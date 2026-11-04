"""Synthesize the approved script with sentence-aligned caption cues."""
import json, math, re
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

SCENES = [
('mistake','THE MISTAKE', 'You ask an AI agent to clean up your project folder. A few seconds later, an important file is gone. Was the AI the problem?'),
('model','THE AI MODEL', 'Let’s start with the brain: the AI model. It reads your request and decides what action might help. But the model alone doesn’t walk into your computer and delete a file.'),
('loop','THE AGENT LOOP', 'To act, it needs software around it. That software can give it tools, run an action, send the result back, and let it decide what to do next. That repeated cycle is an agent loop.'),
('weak','THE WEAK SETUP', 'Now imagine that loop has a delete tool with broad access, and no approval step. The agent might misunderstand the word temporary and delete the wrong file.'),
('harness','THE HARNESS', 'This is where an agent harness comes in. It’s the system around the model that helps manage how the agent works: what it can see, what it can do, and what happens when something goes wrong.'),
('tools','01  TOOLS', 'First: tools. The harness connects the agent to capabilities like reading files, running commands, or searching the web.'),
('context','02  CONTEXT', 'Second: context. It supplies the instructions and information the agent needs, like your request, relevant files, and previous tool results.'),
('coordination','03  COORDINATION', 'Third: the agent loop and coordination. The harness sends information to the model, handles tool calls, and returns the results. Some harnesses can also coordinate multiple agents.'),
('controls','04  CONTROLS', 'Fourth: controls. These can restrict access, run tools in a sandbox, or ask a human to approve an action.'),
('state','05  OBSERVABILITY & STATE', 'Fifth: observability and state. Depending on the system, the harness can record actions, track progress, and help a session resume later.'),
('example','BACK TO THE CLEANUP', 'So, back to that cleanup request. A carefully configured harness could give the agent access only to the right folder, show it the cleanup rules, and ask you before deleting anything important. The model still makes decisions. The harness manages the environment around those decisions.'),
('workshop','THINK OF A WORKSHOP', 'Think of it like a workshop. The model is the worker’s ability to think. The tools are the equipment. The harness is the workshop setup: the instructions, access controls, safety checks, and records around the work.'),
('distinction','THE REAL COMPARISON', 'Every working agent needs some software around the model. So the real comparison isn’t an agent with no harness versus an agent with one. It’s a minimal setup versus a more carefully engineered one. And the protections only work if someone actually configures and tests them.'),
('ending','YOUR TURN', 'A smarter agent can make better decisions. But who checks what it actually does? What would you let an AI agent do on your computer?')]

out=Path('motion/public/harness');out.mkdir(parents=True,exist_ok=True)
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
   pause=1.05 if kind=='ending' and j==len(chunks)-2 else .32
   audio.append(np.zeros(int(rate*pause),dtype=np.float32));cursor+=pause
 # Padding makes breathing room between ideas explicit.
 padding=.30;audio.append(np.zeros(int(rate*padding),dtype=np.float32));cursor+=padding
 samples=np.concatenate(audio); frames=math.ceil(cursor*30); pad=frames/30-len(samples)/rate
 if pad>0:samples=np.concatenate((samples,np.zeros(round(rate*pad),dtype=np.float32)))
 joined.append(samples)
 scenes.append({'kind':kind,'title':title,'start':elapsed,'duration':frames,'cues':cues});elapsed+=frames
 print(f'{idx+1}/{len(SCENES)} {kind}: {cursor:.2f}s',flush=True)
sf.write(out/'narration.wav',np.concatenate(joined),rate)
Path('motion/src/harness-scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2))
print('Duration seconds:',elapsed/30,flush=True)
