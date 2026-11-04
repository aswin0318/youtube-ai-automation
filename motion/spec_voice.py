"""Synthesize the approved script with sentence-aligned caption cues."""
import json, math, re
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

SCENES = [
('house','A HOUSE WITHOUT A PLAN', "Imagine telling a builder: build me a house. That's it. No blueprint. No budget. And you forgot to mention a bathroom. The builder gets to work anyway. A little while later, the house is finished. Wait. Why is the front door on the roof?"),
('guess','THE AI GUESS', "Now imagine telling an AI coding agent: build me an app. You know you want a workout tracker, but you never said that. So the AI makes a shopping app instead. The code might work perfectly. It just solves the wrong problem."),
('spec','THE BLUEPRINT', "Spec-driven development starts with a blueprint for your software. That blueprint is called a specification, or a spec. It explains who the app is for, what it should do, and how you will know it works. You and the AI can review it before building starts."),
('plan','FROM IDEA TO PLAN', "For our workout tracker, the spec says: people can log exercises and see their progress. Next comes the plan. That's where you decide how to build it, like which screens and storage the app needs."),
('tasks','SMALLER TASKS', "Then the plan breaks into smaller tasks. Create the workout screen. Save a session. Show progress. The AI tackles those tasks to build the app, and you can check each piece against the spec."),
('toolkit','SPEC KIT', "GitHub's Spec Kit helps organize this process: specify what to build, plan how to build it, break it into tasks, and implement them. Think of it as a toolkit that helps turn a rough idea into a blueprint your coding agent can follow."),
('ending','CHECK THE PLAN', "But a blueprint isn't magic. If the requirements are wrong, the AI can still build the wrong thing very efficiently. So here's the question: would you rather spend a minute checking the blueprint, or a day rebuilding the wrong app?")
]

out=Path('motion/public/spec-short');out.mkdir(parents=True,exist_ok=True)
voice=Kokoro('voices/kokoro-v1.0.onnx','voices/voices-v1.0.bin')
scenes=[]; joined=[]; elapsed=0
for idx,(kind,title,narration) in enumerate(SCENES):
 chunks=re.split(r'(?<=[.!?])\s+', narration)
 audio=[]; cues=[]; cursor=0
 for j,chunk in enumerate(chunks):
  samples,rate=voice.create(chunk,voice='af_heart',speed=.89 if kind!='ending' else .86,lang='en-us')
  if len(samples)==0: raise RuntimeError('Empty voice segment')
  cues.append({'text':chunk,'start':cursor,'end':cursor+len(samples)/rate});audio.append(samples);cursor+=len(samples)/rate
  if j<len(chunks)-1:
   pause=1.2 if kind=='ending' and j==len(chunks)-2 else .42
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
