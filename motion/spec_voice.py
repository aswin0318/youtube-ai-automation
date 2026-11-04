"""Synthesize the approved script with sentence-aligned caption cues."""
import json, math, re
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

SCENES = [
('request','THE PROMPT', "You ask an AI coding agent: build me a workout tracker. It produces a great-looking app. You log a workout, tap save, then refresh. Your workout is gone. The AI built a screen, but nobody defined what saving should mean."),
('spec','THE SPEC', "This is where spec-driven development comes in. Before building, you describe the behavior you need. That description is called a specification, or spec. It explains who the feature is for, what it should do, and its important constraints."),
('criteria','ACCEPTANCE CRITERIA', "For our tracker, the spec says: a user logs exercises and sets. After saving and reopening the app, the workout must still be there. These are acceptance criteria: specific outcomes we can check."),
('plan','THE PLAN', "Next comes the technical plan. For example: a workout screen, an API to receive the data, and a database to store it. The spec describes the expected behavior; the plan explains a way to deliver it."),
('tasks','TASKS AND CODE', "Break the plan into tasks: create the form, implement the save endpoint, and store the workout. An AI agent can work on each task with the spec and plan as shared context."),
('verify','VERIFY', "Now test the result. Save a workout, reopen the app, and check it is still there. If it fails, fix it and test again. People still need to review the spec and code. A spec doesn't guarantee a correct app."),
('ending','NEXT: SPEC KIT', "That's spec-driven development: define behavior, plan, build, and verify. In the next video, we'll explore GitHub Spec Kit, a tool that helps teams follow this process.")
]

out=Path('motion/public/spec-short');out.mkdir(parents=True,exist_ok=True)
voice=Kokoro('voices/kokoro-v1.0.onnx','voices/voices-v1.0.bin')
scenes=[]; joined=[]; elapsed=0
for idx,(kind,title,narration) in enumerate(SCENES):
 chunks=re.split(r'(?<=[.!?])\s+', narration)
 audio=[]; cues=[]; cursor=0
 for j,chunk in enumerate(chunks):
  samples,rate=voice.create(chunk,voice='af_heart',speed=1.00 if kind!='ending' else .96,lang='en-us')
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
