import React from 'react';
import {AbsoluteFill,Audio,Composition,Easing,interpolate,interpolateColors,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import scenes from './spec-scenes.json';
const FPS=30,TOTAL=scenes.reduce((a,s)=>a+s.duration,0);
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)};
const rise=(t,a,b)=>interpolate(t,[a,b],[0,1],clamp);
const colors={ink:'#1c2740',coral:'#fa8072',purple:'#a38be9',mint:'#65cdb2',yellow:'#ffd06e'};
const Box=({x,y,w,h,color,children})=><g><rect x={x} y={y} width={w} height={h} rx="16" fill={color}/>{children}</g>;
const Label=({x,y,children,size=25,color=colors.ink})=><text x={x} y={y} fill={color} fontWeight="800" fontSize={size} textAnchor="middle">{children}</text>;
const phase=(sc,t,i)=>rise(t,sc.cues[Math.min(i,sc.cues.length-1)].start,sc.cues[Math.min(i,sc.cues.length-1)].start+.6);
function Cursor({x,y,t}) {let pulse=1+.11*Math.sin(t*7);return <g transform={`translate(${x} ${y}) scale(${pulse})`}><path d="M0 0 L2 67 L20 49 L34 78 L46 72 L31 43 L58 41Z" fill="#ffd06e" stroke="#1c2740" strokeWidth="4" strokeLinejoin="round"/></g>}
function Device({scene,t}){
 const k=scene.kind, e=i=>phase(scene,t,i), bob=Math.sin(t*1.4)*3;
 let dx=k==='request'? 600-e(2)*35 : k==='verify'? 600-e(0)*35 : 600;
 let dy=k==='request'? 420-e(2)*10 : k==='verify'? 420-e(0)*10 : 420;
 let title=k==='request'?'WORKOUT TRACKER':k==='spec'?'DEFINE BEHAVIOR':k==='criteria'?'ACCEPTANCE TEST':k==='plan'?'TECHNICAL PLAN':k==='tasks'?'BUILD THE FEATURE':k==='verify'?'TEST THE RESULT':'COMING UP NEXT';
 return <g transform={`translate(0 ${bob})`}>
 <rect x="150" y="40" width="580" height="690" rx="44" fill="#fffdfa" stroke="#1c2740" strokeWidth="8"/>
 <rect x="150" y="40" width="580" height="92" rx="40" fill="#e4ddfb"/>
 <circle cx="200" cy="86" r="10" fill="#fa8072"/><circle cx="235" cy="86" r="10" fill="#ffd06e"/><circle cx="270" cy="86" r="10" fill="#65cdb2"/>
 <Label x={465} y={94} size={26}>{title}</Label>
 {(k==='request'||k==='verify')&&<g>
 <Label x={440} y={210} size={32}>TODAY'S WORKOUT</Label>
 <Box x={205} y={250} w={470} h={80} color="#eaf7f1"><Label x={440} y={301} size={27}>SQUATS · 3 SETS</Label></Box>
 <Box x={290} y={370} w={300} h={80} color="#a38be9"><Label x={440} y={421} color="#ffffff" size={29}>SAVE</Label></Box>
 <g opacity={e(2)}><rect x="195" y="490" width="490" height="120" rx="20" fill={k==='request'?'#fff0ec':'#e5f7ed'}/><Label x={440} y={542} size={26}>{k==='request'?'AFTER REFRESH':'AFTER REOPEN'}</Label><Label x={440} y={582} size={25} color={k==='request'?'#ba4a45':'#16785d'}>{k==='request'?'WORKOUT MISSING!':'WORKOUT STILL HERE ✓'}</Label></g>
 <Cursor x={dx} y={dy} t={t}/></g>}
 {k==='spec'&&<g>
 <Label x={440} y={207} size={31}>WHAT MUST THE APP DO?</Label>
 {['WHO: PEOPLE TRACKING WORKOUTS','BEHAVIOR: SAVE A SESSION','CONSTRAINT: KEEP THE DATA'].map((s,i)=><g key={s} transform={`translate(${(1-e(Math.min(i+1,scene.cues.length-1)))*80} 0)`} opacity={e(Math.min(i+1,scene.cues.length-1))}><Box x={190} y={250+i*110} w={500} h={78} color={[ '#e5f7ed','#f1e9ff','#fff0d4'][i]}><Label x={440} y={300+i*110} size={21}>{s}</Label></Box></g>)}
 </g>}
 {k==='criteria'&&<g>
 <Label x={440} y={210} size={30}>A RESULT WE CAN CHECK</Label>
 {['1. LOG EXERCISE + SETS','2. SAVE THE WORKOUT','3. REOPEN: IT IS STILL THERE'].map((s,i)=><g key={s} opacity={e(Math.min(i,scene.cues.length-1))}><circle cx="235" cy={285+i*112} r="19" fill="#65cdb2"/><path d={`M225 ${285+i*112} l7 7 l14 -16`} fill="none" stroke="#fff" strokeWidth="5"/><text x="275" y={294+i*112} fontSize="22" fontWeight="800" fill="#1c2740">{s}</text></g>)}
 <Cursor x={390+Math.sin(t*2)*14} y={600} t={t}/></g>}
 {k==='plan'&&<g><Label x={440} y={215} size={30}>HOW THE PARTS CONNECT</Label>
 <path d="M275 380 H605" stroke="#9b91d0" strokeWidth="9" strokeDasharray="13 11"/>
 {['SCREEN','API','DATABASE'].map((s,i)=><g key={s} opacity={e(Math.min(i,scene.cues.length-1))}><Box x={185+i*170} y={315} w={145} h={130} color={['#65cdb2','#a38be9','#ffd06e'][i]}><Label x={257+i*170} y={390} size={21}>{s}</Label></Box></g>)}
 <circle cx={275+((t*100)%330)} cy="380" r="11" fill="#1c2740"/><Label x={440} y={550} size={23}>SPEC = WHAT · PLAN = HOW</Label></g>}
 {k==='tasks'&&<g><Label x={440} y={210} size={30}>ONE TASK AT A TIME</Label>
 {['CREATE THE FORM','BUILD THE SAVE API','STORE THE WORKOUT'].map((s,i)=><g key={s} opacity={e(Math.min(i+1,scene.cues.length-1))}><Box x={205} y={255+i*110} w={470} h={80} color={['#e5f7ed','#f1e9ff','#fff0d4'][i]}><Label x={420} y={306+i*110} size={23}>{s}</Label></Box><circle cx="640" cy={295+i*110} r="15" fill="#65cdb2"/></g>)}
 <Cursor x={520+Math.sin(t*2)*18} y={580} t={t}/></g>}
 {k==='ending'&&<g><Label x={440} y={228} size={32}>SPEC-DRIVEN DEVELOPMENT</Label>
 {['DEFINE','PLAN','BUILD','VERIFY'].map((s,i)=><g key={s} opacity={rise(t,i*.5,i*.5+.5)}><Box x={190+i*127} y={285} w={110} h={95} color={['#65cdb2','#a38be9','#ffd06e','#fa8072'][i]}><Label x={245+i*127} y={342} size={18}>{s}</Label></Box></g>)}
 <g opacity={e(1)}><Box x={205} y={475} w={470} h={105} color="#e4ddfb"><Label x={440} y={538} size={29}>NEXT: GITHUB SPEC KIT</Label></Box></g></g>}
 </g>
}
function Captions({cue,time}){if(!cue)return null;const words=cue.text.split(/\s+/),groups=[];for(let i=0;i<words.length;i+=5)groups.push(words.slice(i,i+5));let p=Math.max(0,Math.min(.999,(time-cue.start)/Math.max(.1,cue.end-cue.start)));let index=Math.min(groups.length-1,Math.floor(p*groups.length));return <div style={{position:'absolute',left:100,right:155,bottom:320,minHeight:145,display:'flex',justifyContent:'center',alignItems:'center'}}><div style={{padding:'20px 28px',borderRadius:24,background:'#1c2740',color:'#fff',fontWeight:800,fontSize:52,lineHeight:1.15,textAlign:'center',boxShadow:'0 8px 24px #1c274044'}}>{groups[index].map((w,i)=><span key={i} style={{marginRight:10,color:i===groups[index].length-1?'#ffd06e':'#fff'}}>{w}</span>)}</div></div>}
function Main(){let f=useCurrentFrame(),s=scenes.find(z=>f>=z.start&&f<z.start+z.duration)||scenes[scenes.length-1],t=(f-s.start)/FPS,cue=s.cues.find(c=>t>=c.start&&t<c.end);let ix=scenes.indexOf(s),prev=ix>0?scenes[ix-1]:null,blend=prev?rise(f,s.start,s.start+15):1;let bg=interpolateColors(f,scenes.map(x=>x.start),['#fff1df','#edf5f0','#f4ebfa','#e9f2f9','#fff0df','#e9f7ef','#f4ebfa']);return <AbsoluteFill style={{background:bg,color:'#1c2740',fontFamily:'Arial, sans-serif',overflow:'hidden'}}><div style={{position:'absolute',top:195,left:100,fontSize:25,fontWeight:900,letterSpacing:4,color:'#27766b'}}>THE AI SIDE</div><div style={{position:'absolute',top:253,left:100,right:140,fontSize:58,lineHeight:1.08,fontWeight:900}}>SPEC-DRIVEN DEVELOPMENT</div><svg style={{position:'absolute',top:420,left:100}} width="880" height="820" viewBox="0 0 880 820"><defs><clipPath id="reveal"><circle cx="440" cy="380" r={blend*1000}/></clipPath></defs>{prev&&blend<1&&<Device scene={prev} t={(f-prev.start)/FPS}/>}<g clipPath="url(#reveal)"><Device scene={s} t={t}/></g></svg><Captions cue={cue} time={t}/><Audio src={staticFile('spec-short/narration.wav')}/></AbsoluteFill>}
registerRoot(()=> <Composition id="SpecShort" component={Main} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL}/>);
