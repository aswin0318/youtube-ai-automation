"""Synthesize the approved script with sentence-aligned caption cues."""
import json, math, re
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

SCENES = [
('prompt','THE REQUEST', "You ask your AI coding agent: build an appointment-booking feature. A minute later, it proudly says: Done!"),
('problem','THE PROBLEM', "The screen looks great. But two people book the same time slot. And the app happily says: Confirmed! to both. Congratulations. You just invented a waiting room boss fight."),
('spec','THE SPEC', "This is where spec-driven development comes in. Before the agent starts coding, you describe what the feature must do, the rules it must follow, and how you'll know it works. That description is called a specification, or a spec."),
('example','THE RULE', "For our booking feature, the spec might say: a patient can book an available slot. Once booked, that slot can't be booked again. And here's an edge case: what if two requests arrive at almost the same time?"),
('criteria','ACCEPTANCE CRITERIA', "Then we write acceptance criteria: checks that define success. For example: if two patients try to book the same slot, only one booking succeeds, and the other gets a clear message."),
('plan','PLAN AND VERIFY', "Next comes the technical plan: maybe an API for bookings, a database to store them, and a way to prevent conflicting writes. The agent can then break that plan into tasks, write code, and run tests against the spec. And yes, humans still review the requirements and the code."),
('ending','NEXT EPISODE', "So, spec-driven development helps turn a vague request into a shared, testable description that guides the work. In the next video, we'll explore GitHub Spec Kit, a tool that helps put this process into practice.")
]

out=Path('motion/public/spec-short');out.mkdir(parents=True,exist_ok=True)
voice=Kokoro('voices/kokoro-v1.0.onnx','voices/voices-v1.0.bin')
scenes=[]; joined=[]; elapsed=0
for idx,(kind,title,narration) in enumerate(SCENES):
 chunks=re.split(r'(?<=[.!?])\s+', narration)
 audio=[]; cues=[]; cursor=0
 for j,chunk in enumerate(chunks):
  samples,rate=voice.create(chunk,voice='af_heart',speed=1.02 if kind!='ending' else .98,lang='en-us')
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
