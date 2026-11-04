"""Synthesize the approved script with sentence-aligned caption cues."""
import json, math, re
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

SCENES = [
('house','THE BLUEPRINT', "Imagine asking a builder: build me a house. No blueprint. No budget. No mention of a bathroom. What could possibly go wrong?"),
('guess','THE GUESS', "That's what happens when you tell an AI coding agent: build me an app, and leave it to guess the rest. It might build something that works, but not what you actually wanted."),
('spec','THE SPEC', "Spec-driven development gives the AI a blueprint first. A specification, or spec, describes what you want, who it's for, and what success looks like."),
('plan','THE PLAN', "Say you want a workout tracker. The spec says users can log exercises and see their progress. The plan decides how to build it."),
('tasks','THE BUILD', "Then the plan becomes smaller tasks, like creating the workout screen and saving each session. Only then does the AI start building."),
('toolkit','SPEC KIT', "GitHub's Spec Kit helps structure that process: spec, plan, tasks, implement. Think of it as a toolkit for turning your idea into a blueprint the AI can follow."),
('ending','THE QUESTION', "But here's the catch: a blueprint only helps if someone checks it. So before your AI builds faster, are you sure it's building the right thing?")
]

out=Path('motion/public/spec-short');out.mkdir(parents=True,exist_ok=True)
voice=Kokoro('voices/kokoro-v1.0.onnx','voices/voices-v1.0.bin')
scenes=[]; joined=[]; elapsed=0
for idx,(kind,title,narration) in enumerate(SCENES):
 chunks=re.split(r'(?<=[.!?])\s+', narration)
 audio=[]; cues=[]; cursor=0
 for j,chunk in enumerate(chunks):
  samples,rate=voice.create(chunk,voice='af_heart',speed=.94 if kind!='ending' else .90,lang='en-us')
  if len(samples)==0: raise RuntimeError('Empty voice segment')
  cues.append({'text':chunk,'start':cursor,'end':cursor+len(samples)/rate});audio.append(samples);cursor+=len(samples)/rate
  if j<len(chunks)-1:
   pause=1.2 if kind=='ending' and j==len(chunks)-2 else .34
   audio.append(np.zeros(int(rate*pause),dtype=np.float32));cursor+=pause
 # Padding makes breathing room between ideas explicit.
 padding=.30;audio.append(np.zeros(int(rate*padding),dtype=np.float32));cursor+=padding
 samples=np.concatenate(audio); frames=math.ceil(cursor*30); pad=frames/30-len(samples)/rate
 if pad>0:samples=np.concatenate((samples,np.zeros(round(rate*pad),dtype=np.float32)))
 joined.append(samples)
 scenes.append({'kind':kind,'title':title,'start':elapsed,'duration':frames,'cues':cues});elapsed+=frames
 print(f'{idx+1}/{len(SCENES)} {kind}: {cursor:.2f}s',flush=True)
sf.write(out/'narration.wav',np.concatenate(joined),rate)
Path('motion/src/spec-scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2))
print('Duration seconds:',elapsed/30,flush=True)
