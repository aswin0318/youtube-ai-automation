"""Create an English AI explainer with local neural speech and animated graphics."""
import json, math, subprocess, tempfile, wave
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
W, H, FPS = 540, 960, 15
MODEL = ROOT / 'voices' / 'en_US-lessac-medium.onnx'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REGULAR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
SCENES = [
    ('YOUR AI CAN\nDO MORE.', 'What if your AI could do more than just answer questions?', 'question'),
    ('MEET THE\nAI AGENT', 'Meet the AI agent. It can break a goal into steps.', 'plan'),
    ('THINK.\nUSE TOOLS.\nACT.', 'It can use tools, check results, and decide what to do next.', 'tools'),
    ('BUT WAIT...', 'But here is the catch. Agents can still make mistakes.', 'warning'),
    ('YOU ARE\nIN CONTROL.', 'So keep a human in control, especially for important decisions. Follow Mind il AI for more.', 'control'),
]

def ease(x):
    x = max(0, min(1, x)); return 1 - (1-x)**3

def font(size, bold=True): return ImageFont.truetype(FONT if bold else REGULAR, size)

def fit(draw, text, size, max_width):
    f=font(size)
    while max(draw.textbbox((0,0), line, font=f)[2] for line in text.split('\n')) > max_width:
        size -= 1; f=font(size)
    return f

def wrap(draw, text, f, width):
    lines=[]; line=''
    for word in text.split():
        trial=(line+' '+word).strip()
        if line and draw.textbbox((0,0),trial,font=f)[2]>width: lines.append(line); line=word
        else: line=trial
    if line: lines.append(line)
    return lines

def frame(scene, text, t, length, index):
    img=Image.new('RGB',(W,H),(7,12,28)); d=ImageDraw.Draw(img)
    # Slow-moving grids and particles create depth without distracting from the message.
    for x in range(-40, W+80, 72):
        xx=x+int(t*6)%72; d.line((xx,0,xx-80,H),fill=(15,29,49),width=1)
    for y in range(0,H,72): d.line((0,y,W,y),fill=(13,26,43),width=1)
    for k in range(18):
        x=(k*137+23)%W; y=(k*173+int(t*14*(1+k%3)))%H
        d.ellipse((x,y,x+3,y+3),fill=(37,87,105))
    cyan=(60,235,206); violet=(155,127,255); white=(245,248,255); muted=(151,173,191)
    d.rounded_rectangle((30,30,510,76),radius=15,fill=(17,31,50))
    d.text((47,40),'MIND-IL AI',font=font(19),fill=cyan)
    d.text((400,40),f'0{index+1} / 05',font=font(16),fill=muted)
    title_font=fit(d,text,55,460)
    offset=int((1-ease(t/0.5))*45)
    d.multiline_text((40,118+offset),text,font=title_font,fill=white,spacing=7)
    d.rounded_rectangle((40,350,500,695),radius=30,fill=(14,26,47),outline=(37,68,91),width=2)
    cx,cy=270,520; pulse=1+0.06*math.sin(t*5)
    if scene=='question':
        r=int(90*pulse); d.ellipse((cx-r,cy-r,cx+r,cy+r),outline=cyan,width=6)
        d.text((cx-27,cy-74),'?',font=font(112),fill=white)
        for j in range(5):
            a=t*1.2+j*math.tau/5; x=cx+145*math.cos(a); y=cy+118*math.sin(a)
            d.ellipse((x-5,y-5,x+5,y+5),fill=violet)
    elif scene=='plan':
        for j,label in enumerate(['GOAL','PLAN','DO']):
            x=77+j*130; y=470+int(8*math.sin(t*3-j))
            d.rounded_rectangle((x,y,x+110,y+88),radius=18,fill=(24,53,74),outline=cyan,width=2)
            d.text((x+12,y+32),label,font=font(18),fill=white)
            if j<2: d.line((x+112,y+44,x+127,y+44),fill=violet,width=5)
    elif scene=='tools':
        for j,label in enumerate(['THINK','TOOLS','CHECK']):
            y=421+j*71; progress=ease((t-j*.35)/.45)
            d.rounded_rectangle((85,y,455,y+52),radius=14,fill=(24,48,70))
            d.rounded_rectangle((85,y,85+int(370*progress),y+52),radius=14,fill=(31,105,111))
            d.text((108,y+13),label,font=font(21),fill=white)
    elif scene=='warning':
        d.regular_polygon((cx,cy,106),3,rotation=0,fill=(255,172,62))
        d.text((cx-13,cy-51),'!',font=font(80),fill=(22,25,38))
        r=130+int(8*math.sin(t*5)); d.arc((cx-r,cy-r,cx+r,cy+r),0,300,fill=(255,172,62),width=3)
    else:
        r=int(86*pulse); d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(28,110,108))
        d.line((cx-45,cy,cx-10,cy+35,cx+50,cy-40),fill=white,width=12,joint='curve')
        d.text((179,640),'HUMAN REVIEW',font=font(19),fill=cyan)
    # Captions are timed to each spoken sentence, rather than pretending to be word aligned.
    d.rounded_rectangle((30,745,510,875),radius=20,fill=(15,29,48))
    cf=font(22,False); lines=wrap(d,SCENES[index][1],cf,420)
    for j,line in enumerate(lines):
        box=d.textbbox((0,0),line,font=cf); d.text(((W-(box[2]-box[0]))/2,760+j*31),line,font=cf,fill=white)
    d.rounded_rectangle((40,909,500,916),radius=3,fill=(43,61,78))
    d.rounded_rectangle((40,909,40+int(460*(index+min(t/length,1))/len(SCENES)),916),radius=3,fill=cyan)
    return img

def run(cmd,**kw): subprocess.run(cmd,check=True,**kw)

def main():
    if not MODEL.exists(): raise RuntimeError('English voice model missing')
    with tempfile.TemporaryDirectory() as td:
        tmp=Path(td); parts=[]
        for i,(headline,narration,kind) in enumerate(SCENES):
            audio=tmp/f'{i}.wav'; output=tmp/f'{i}.mp4'
            run(['python','-m','piper','--model',str(MODEL),'--output_file',str(audio)],input=narration.encode())
            with wave.open(str(audio)) as wf: seconds=wf.getnframes()/wf.getframerate()
            duration=seconds+0.28; count=math.ceil(duration*FPS)
            cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','pipe:0','-i',str(audio),'-t',str(duration),'-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k',str(output)]
            p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
            try:
                for n in range(count): p.stdin.write(frame(kind,headline,n/FPS,duration,i).tobytes())
            finally: p.stdin.close()
            if p.wait()!=0: raise RuntimeError('ffmpeg rendering failed')
            parts.append(output)
        listing=tmp/'files.txt'; listing.write_text(''.join(f"file '{p}'\n" for p in parts))
        run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-c','copy',str(OUT/'short.mp4')])
    (OUT/'metadata.json').write_text(json.dumps({'title':'What is an AI Agent? | Mind-il AI #Shorts','language':'en','review_required':True},indent=2))
    print('Preview created. Review voice, timing and visuals before publishing.')

if __name__=='__main__': main()
