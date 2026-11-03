"""Free offline Mind-il AI Malayalam Short preview generator.

Uses prewritten, reviewed educational facts rather than inventing live news.
No uploads: a human must inspect narration and text before enabling publishing.
"""
import json
import subprocess
import tempfile
import wave
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo
from PIL import Image, ImageDraw, ImageFont, features

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
TOPICS = [
    ('AI ഏജന്റ് എന്താണ്?', [
        'എ ഐ ഏജന്റ് എന്താണ്?',
        'ചാറ്റ്ബോട്ട് നമ്മുടെ ചോദ്യങ്ങൾക്ക് മറുപടി നൽകുന്നു.',
        'ഏജന്റിന് ലക്ഷ്യത്തിലേക്ക് പല ഘട്ടങ്ങൾ ആസൂത്രണം ചെയ്യാം.',
        'ചില ഏജന്റുകൾ ഉപകരണങ്ങൾ ഉപയോഗിച്ച് പ്രവർത്തിക്കുകയും ചെയ്യും.',
        'എന്നാൽ മനുഷ്യ പരിശോധനയും സുരക്ഷയും പ്രധാനമാണ്.'
    ]),
    ('AI ഉപയോഗിക്കുമ്പോൾ ശ്രദ്ധിക്കുക', [
        'എ ഐ ചാറ്റിൽ എന്തൊക്കെയാണ് നൽകാൻ പാടില്ലാത്തത്?',
        'പാസ്‌വേഡും ഒ ടി പിയും ഒരിക്കലും പങ്കുവെക്കരുത്.',
        'സ്വകാര്യ ബാങ്ക് വിവരങ്ങളും രഹസ്യ രേഖകളും ഒഴിവാക്കുക.',
        'മറുപടിയിലെ പ്രധാന വിവരങ്ങൾ എപ്പോഴും പരിശോധിക്കുക.',
        'കൂടുതൽ അറിവിന് മൈൻഡിൽ എ ഐ പിന്തുടരൂ.'
    ]),
    ('LLM എങ്ങനെ പ്രവർത്തിക്കുന്നു?', [
        'എ ഐ ഭാഷാ മോഡൽ എങ്ങനെ പ്രവർത്തിക്കുന്നു?',
        'വാക്കുകളെ ചെറിയ ടോക്കണുകളായി കൈകാര്യം ചെയ്യുന്നു.',
        'മുൻപ് വന്ന ടോക്കണുകൾ നോക്കി അടുത്തത് പ്രവചിക്കുന്നു.',
        'ആത്മവിശ്വാസത്തോടെ നൽകുന്ന മറുപടിയും തെറ്റാകാം.',
        'പ്രധാന വിവരങ്ങൾ സ്വതന്ത്രമായി പരിശോധിക്കുക.'
    ]),
]

def run(args):
    subprocess.run(args, check=True)

def duration(wav):
    with wave.open(str(wav)) as f:
        return f.getnframes() / f.getframerate()

def text_lines(draw, text, font, max_width):
    output = []; line = ''
    for word in text.split():
        nxt = (line + ' ' + word).strip()
        if line and draw.textbbox((0, 0), nxt, font=font)[2] > max_width:
            output.append(line); line = word
        else: line = nxt
    if line: output.append(line)
    return output

def main():
    today = datetime.now(ZoneInfo('Asia/Kolkata')).date()
    title, lines = TOPICS[today.toordinal() % len(TOPICS)]
    font_file = next(Path('/usr/share/fonts').rglob('NotoSansMalayalam-Regular.ttf'), None)
    if not font_file:
        font_file = next(Path('/usr/share/fonts').rglob('*Malayalam*.ttf'), None)
    if not font_file:
        raise RuntimeError('Malayalam font missing')
    if not features.check('raqm'):
        raise RuntimeError('Pillow requires libraqm to render Malayalam joined script correctly')
    font = ImageFont.truetype(str(font_file), 56)
    brand_font = ImageFont.truetype(str(font_file), 39)
    with tempfile.TemporaryDirectory() as tmp:
        temp = Path(tmp)
        parts = []
        for i, text in enumerate(lines):
            png, wav, mp4 = (temp / f'{i}.{ext}' for ext in ('png', 'wav', 'mp4'))
            canvas = Image.new('RGB', (720, 1280), '#101928')
            d = ImageDraw.Draw(canvas)
            d.rounded_rectangle((38, 65, 682, 185), 26, fill='#1a3044')
            d.text((65, 93), 'മൈൻഡിൽ എ ഐ', font=brand_font, fill='#4be4c0')
            wrapped = text_lines(d, text, font, 610)
            y = 530 - len(wrapped) * 45
            for line in wrapped:
                width = d.textbbox((0, 0), line, font=font)[2]
                d.text(((720 - width) / 2, y), line, font=font, fill='#f2f8ff')
                y += 100
            d.rounded_rectangle((55, 1110, 665, 1124), 7, fill='#354457')
            d.rounded_rectangle((55, 1110, 55 + int(610 * (i+1) / len(lines)), 1124), 7, fill='#4be4c0')
            canvas.save(png)
            run(['espeak-ng', '-v', 'ml', '-s', '140', '-w', str(wav), text])
            sec = max(3, duration(wav) + 0.4)
            run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-loop', '1', '-framerate', '25', '-i', str(png), '-i', str(wav), '-t', str(sec), '-vf', 'format=yuv420p', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '29', '-c:a', 'aac', '-b:a', '96k', '-shortest', str(mp4)])
            parts.append(mp4)
        concat = temp / 'files.txt'
        concat.write_text(''.join(f"file '{p}'\n" for p in parts))
        run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat), '-c', 'copy', str(OUT / 'short.mp4')])
    (OUT / 'metadata.json').write_text(json.dumps({'title': f'{title} | Mind-il AI #Shorts', 'language': 'ml', 'review_required': True, 'date': str(today)}, ensure_ascii=False, indent=2), encoding='utf8')
    print('Generated output/short.mp4. Review audio and captions before publishing.')

if __name__ == '__main__': main()
