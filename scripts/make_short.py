"""Mind-il AI: a self-contained, reviewable English motion-graphics short."""
import json, math, subprocess, tempfile, wave
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'output'; OUT.mkdir(exist_ok=True)
MODEL=ROOT/'voices/en_US-lessac-medium.onnx'
W,H,FPS=540,960,24
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
CYAN=(68,239,205); YELLOW=(255,213,94); WHITE=(246,249,255); MUTED=(148,174,195); PURPLE=(171,132,255)
SCENES=[
 ('THE AI THAT\nDOES THINGS', 'What if your AI could actually do the work for you?', 'hook'),
 ('CHATBOT\nVS AGENT', 'A chatbot gives you an answer. An AI agent can take action.', 'compare'),
 ('ONE GOAL.\nMANY STEPS.', 'Give it a goal, and it can turn that goal into a plan.', 'plan'),
 ('TOOLS +\nFEEDBACK', 'Then it can use tools, check the results, and try again.', 'loop'),
 ('REAL-WORLD\nEXAMPLE', 'For example, it could research a trip and build an itinerary.', 'trip'),
 ('ONE BIG\nCATCH', 'But it can still make mistakes. Never blindly trust its decisions.', 'warning'),
 ('YOU STAY\nIN CONTROL', 'Review important actions yourself. Follow Mind il AI for more.', 'control'),
]

def font(n,bold=True): return ImageFont.truetype(FONT if bold else REG,n)
def ease(x): x=max(0,min(1,x)); return 1-(1-x)**3
def mix(a,b,x): return tuple(int(a[i]*(1-x)+b[i]*x) for i in range(3))
def background():
 im=Image.new('RGB',(W,H)); pix=im.load()
 for y in range(H):
  for x in range(W):
   glow=max(0,1-math.hypot((x-420)/530,(y-300)/620)); pix[x,y]=(int(6+14*glow),int(10+22*glow),int(24+36*glow))
 return im
BG=background()
def text_center(d,xy,s,f,fill):
 box=d.textbbox((0,0),s,font=f); d.text((xy[0]-(box[2]-box[0])/2,xy[1]),s,font=f,fill=fill)
def pill(d,box,fill,outline=None,r=20,width=2): d.rounded_rectangle(tuple(int(x) for x in box),radius=r,fill=fill,outline=outline,width=width)
def icon(d,kind,x,y,scale=1):
 c=CYAN; lw=max(2,int(4*scale)); s=scale
 if kind=='spark':
  d.polygon([(x,y-36*s),(x+9*s,y-9*s),(x+36*s,y),(x+9*s,y+9*s),(x,y+36*s),(x-9*s,y+9*s),(x-36*s,y),(x-9*s,y-9*s)],fill=c)
 elif kind=='chat':
  d.rounded_rectangle((x-42*s,y-30*s,x+42*s,y+25*s),radius=int(12*s),outline=c,width=lw);d.line((x-12*s,y+25*s,x-22*s,y+38*s,x+7*s,y+25*s),fill=c,width=lw)
  for k in [-18,0,18]: d.ellipse((x+k*s-3*s,y-3*s,x+k*s+3*s,y+3*s),fill=WHITE)
 elif kind=='check':
  d.ellipse((x-38*s,y-38*s,x+38*s,y+38*s),outline=c,width=lw); d.line((x-20*s,y,x-5*s,y+15*s,x+23*s,y-17*s),fill=WHITE,width=lw,joint='curve')
 elif kind=='search':
  d.ellipse((x-30*s,y-33*s,x+22*s,y+19*s),outline=c,width=lw); d.line((x+16*s,y+14*s,x+39*s,y+37*s),fill=c,width=lw+2)
 elif kind=='plane':
  d.polygon([(x-44*s,y+4*s),(x+43*s,y-31*s),(x+22*s,y+37*s),(x+5*s,y+12*s)],outline=c,width=lw);d.line((x+5*s,y+12*s,x+43*s,y-31*s),fill=c,width=lw)
 elif kind=='warning':
  d.polygon([(x,y-45*s),(x+48*s,y+36*s),(x-48*s,y+36*s)],fill=YELLOW); d.line((x,y-22*s,x,y+7*s),fill=(17,22,35),width=lw+2);d.ellipse((x-3*s,y+18*s,x+3*s,y+24*s),fill=(17,22,35))

def base(t,idx,duration):
 im=BG.copy(); d=ImageDraw.Draw(im)
 for k in range(13):
  x=(k*137+70)%W; y=(k*211+int(t*(9+k%4*4))+idx*71)%H; r=1+k%2
  d.ellipse((x-r,y-r,x+r,y+r),fill=(42,98,112))
 pill(d,(26,26,514,72),(16,34,51),r=15)
 d.text((42,37),'MIND-IL AI',font=font(18),fill=CYAN)
 text_center(d,(458,38),f'{idx+1:02d} / 07',font(15),MUTED)
 pill(d,(30,916,510,922),(34,56,72),r=3)
 pill(d,(30,916,30+int(480*(idx+min(1,t/duration))/len(SCENES)),922),CYAN,r=3)
 return im,d

def frame(headline,kind,t,duration,idx):
 im,d=base(t,idx,duration); enter=ease(t/.45); shift=int((1-enter)*50)
 d.text((36,106+shift), 'AI EXPLAINED  /  '+('WATCH THIS' if idx==0 else 'IN 30 SECONDS'),font=font(16),fill=CYAN)
 hf=font(53 if len(max(headline.split('\n'),key=len))<13 else 45)
 d.multiline_text((34,145+shift),headline,font=hf,fill=WHITE,spacing=4,stroke_width=0)
 d.line((37,302,37+int(100*enter),302),fill=YELLOW,width=5)
 # Illustration card and its animated content.
 pill(d,(30,337,510,704),(13,28,47),outline=(45,79,99),r=32)
 for j in range(6):
  a=(j*math.tau/6+t*.38);x=270+200*math.cos(a);y=520+147*math.sin(a)
  d.ellipse((x-2,y-2,x+2,y+2),fill=(48,105,118))
 bob=math.sin(t*3)*7
 if kind=='hook':
  r=95+6*math.sin(t*4);d.ellipse((270-r,520-r,270+r,520+r),outline=(47,99,119),width=3)
  icon(d,'spark',270,520+bob,1.7)
  for j,txt in enumerate(['ASK','PLAN','ACT']):
   a=t*.6+j*math.tau/3; x=270+155*math.cos(a);y=520+115*math.sin(a)
   pill(d,(x-38,y-18,x+38,y+18),(28,63,81),outline=(58,113,127),r=14);text_center(d,(x,y-10),txt,font(13),WHITE)
 elif kind=='compare':
  for j,(label,sub,ico) in enumerate([('CHATBOT','ANSWERS','chat'),('AGENT','TAKES ACTION','spark')]):
   x=52+j*238;active=ease((t-j*.45)/.4)
   pill(d,(x,395,x+200,634),(23,47,66),outline=CYAN if j else (71,102,122),r=24)
   icon(d,ico,x+100,474+bob*(j+1)*.4,.9); text_center(d,(x+100,547),label,font(21),WHITE);text_center(d,(x+100,580),sub,font(13),CYAN if j else MUTED)
  text_center(d,(270,510),'VS',font(20),YELLOW)
 elif kind=='plan':
  for j,label in enumerate(['SET THE GOAL','MAKE A PLAN','TAKE ACTION']):
   y=407+j*75; amt=ease((t-.25*j)/.4); pill(d,(72,y,468,y+58),(24,52,70),r=17)
   pill(d,(83,y+9,123,y+49),CYAN if amt>.8 else (50,77,91),r=12);text_center(d,(103,y+17),str(j+1),font(18),(9,27,39));d.text((143,y+18),label,font=font(18),fill=WHITE)
 elif kind=='loop':
  labels=['USE TOOL','CHECK','RETRY']; pos=[(270,416),(157,578),(383,578)]
  for j,(x,y) in enumerate(pos):
   pill(d,(x-75,y-29,x+75,y+29),(25,63,76),outline=CYAN if int(t*1.2)%3==j else (61,98,115),r=20);text_center(d,(x,y-10),labels[j],font(17),WHITE)
  d.line((229,450,181,545),fill=PURPLE,width=4);d.line((231,578,307,578),fill=PURPLE,width=4);d.line((360,545,313,450),fill=PURPLE,width=4)
 elif kind=='trip':
  d.line((116,581,215,469,321,554,424,441),fill=(78,123,145),width=4)
  for x,y in [(116,581),(215,469),(321,554),(424,441)]: d.ellipse((x-8,y-8,x+8,y+8),fill=YELLOW)
  icon(d,'plane',int(116+(min(1,t/2.8)*308)),int(542-75*math.sin(min(1,t/2.8)*math.pi)),.72)
  pill(d,(109,623,431,670),(24,59,76),r=14);text_center(d,(270,637),'YOUR TRIP, PLANNED',font(16),WHITE)
 elif kind=='warning':
  icon(d,'warning',270,505+bob,1.7)
  pill(d,(98,605,442,654),(68,49,40),r=16);text_center(d,(270,618),'MISTAKES HAPPEN',font(18),YELLOW)
 else:
  icon(d,'check',270,493+bob,1.6)
  pill(d,(110,605,430,657),(22,78,78),r=16);text_center(d,(270,620),'HUMAN IN CONTROL',font(17),WHITE)
 # Kinetic, short captions are approximately timed, not forced-aligned.
 words=SCENES[idx][1].split(); groups=[words[i:i+4] for i in range(0,len(words),4)]
 active=min(len(groups)-1,int((t/max(duration-.28,.1))*len(groups)))
 phrase=' '.join(groups[active]).upper();f=font(25)
 while d.textbbox((0,0),phrase,font=f)[2]>452: f=font(f.size-1)
 pill(d,(31,755,509,835),(21,41,59),outline=(42,74,91),r=21)
 text_center(d,(270,780),phrase,f,YELLOW if idx in (0,5) else WHITE)
 text_center(d,(270,863),'FOLLOW FOR MORE AI, MADE SIMPLE',font(15),MUTED)
 return im

def main():
 if not MODEL.exists(): raise RuntimeError('English voice model missing')
 with tempfile.TemporaryDirectory() as td:
  temp=Path(td); parts=[]
  for i,(headline,narration,kind) in enumerate(SCENES):
   wav=temp/f'{i}.wav';mp4=temp/f'{i}.mp4'
   subprocess.run(['python','-m','piper','--model',str(MODEL),'--output_file',str(wav)],input=narration.encode(),check=True)
   with wave.open(str(wav)) as wf: seconds=wf.getnframes()/wf.getframerate()
   duration=seconds+.2;count=math.ceil(duration*FPS)
   cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','pipe:0','-i',str(wav),'-t',str(duration),'-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k',str(mp4)]
   proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
   try:
    for n in range(count): proc.stdin.write(frame(headline,kind,n/FPS,duration,i).tobytes())
   finally: proc.stdin.close()
   if proc.wait(): raise RuntimeError('ffmpeg rendering failed')
   parts.append(mp4)
  listing=temp/'files.txt';listing.write_text(''.join(f"file '{p}'\n" for p in parts))
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-c','copy',str(OUT/'short.mp4')],check=True)
 (OUT/'metadata.json').write_text(json.dumps({'title':'AI Agents Explained in 30 Seconds | #Shorts','language':'en','review_required':True},indent=2))
 print('Rendered preview. Review the voice, captions and animation before publishing.')
if __name__=='__main__': main()
