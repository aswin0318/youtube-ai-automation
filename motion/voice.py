import json, math, os
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

voice=Kokoro('voices/kokoro-v1.0.onnx','voices/voices-v1.0.bin')
scenes=[
 ('What if AI could do more than answer your questions?', 'WHAT IF AI\nCOULD ACT?', 'hook'),
 ('A chatbot gives you an answer. An AI agent can take action.', 'ANSWERS\nvs ACTION', 'compare'),
 ('Give it a goal, and it can break it into smaller steps.', 'ONE GOAL.\nA REAL PLAN.', 'plan'),
 ('It can use tools, check what happened, and try again.', 'USE. CHECK.\nIMPROVE.', 'loop'),
 ('Imagine asking it to plan your trip. It could research places and build your itinerary.', 'FROM IDEA\nTO ITINERARY', 'trip'),
 ('But here is the catch. AI can make mistakes, so keep a human in control.', 'THE HUMAN\nSTAYS IN CHARGE.', 'warning'),
 ('AI agents can act for you, but they need your judgment. What task would you trust one to do?', 'WHAT WOULD YOU\nTRUST IT TO DO?', 'end'),
]
import re
out=Path('motion/public');out.mkdir(parents=True,exist_ok=True);metadata=[]
for i,(script,title,kind) in enumerate(scenes):
 chunks=re.split(r'(?<=[.!?])\s+',script); audio=[]; cues=[];cursor=0
 for j,chunk in enumerate(chunks):
  samples,rate=voice.create(chunk,voice='af_heart',speed=.88 if kind=='end' else .94,lang='en-us'); start=cursor; audio.append(samples);cursor+=len(samples)/rate;cues.append({'text':chunk,'start':start,'end':cursor})
  if j<len(chunks)-1:
   gap=1.1 if kind=='end' else .4;audio.append(np.zeros(int(rate*gap),dtype=np.float32));cursor+=gap
 sf.write(out/f'voice{i}.wav',np.concatenate(audio),rate)
 metadata.append({'title':title,'kind':kind,'audio':f'voice{i}.wav','duration':math.ceil((cursor+.35)*30),'cues':cues})
(out/'scenes.json').write_text(json.dumps(metadata))
Path('motion/src/scenes.json').write_text(json.dumps(metadata))
