import React from 'react';
import {AbsoluteFill,Audio,Composition,Easing,interpolate,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import scenes from './harness-scenes.json';
const FPS=30, total=scenes.reduce((sum,s)=>sum+s.duration,0);
const T={ink:'#101827',white:'#f8f8f0',muted:'#b6c5c9',teal:'#8df2cb',blue:'#8dc9f9',orange:'#ffad83',yellow:'#f5d572',violet:'#bd9cff'};
const ease=Easing.bezier(.22,1,.36,1);const opt={extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease};
const ramp=(f,start,end)=>interpolate(f,[start,end],[0,1],opt);
function active(f,scene,fade=20){return Math.min(ramp(f,scene.start,scene.start+fade),1-ramp(f,scene.start+scene.duration-fade,scene.start+scene.duration));}
function Box({x,y,w,h,color=T.white,children,active=1,tilt=0}){return <div style={{position:'absolute',left:x,top:y,width:w,height:h,opacity:active,transform:`translateY(${(1-active)*24}px) rotate(${tilt}deg) scale(${.97+.03*active})`,borderRadius:25,background:color,color:T.ink,border:'3px solid #111927',boxShadow:'9px 11px 0 #0a101e',display:'flex',alignItems:'center',justifyContent:'center',fontSize:29,fontWeight:800,letterSpacing:.5,textAlign:'center'}}>{children}</div>}
function Workspace(){const frame=useCurrentFrame();const t=frame/FPS;const current=scenes.find(s=>frame>=s.start&&frame<s.start+s.duration)||scenes[scenes.length-1];const by=(kind)=>scenes.find(s=>s.kind===kind);const v=(kind)=>active(frame,by(kind)); const entrance=ramp(frame,0,18);const local=frame-current.start;
 const progress=(kind)=>{const s=by(kind);return interpolate(frame,[s.start,s.start+s.duration],[0,1],opt)};
 const state=(kinds)=>Math.min(1,kinds.reduce((n,k)=>n+v(k),0));
 const cleanup=state(['mistake','weak','example','ending']); const concepts=state(['harness','tools','context','coordination','controls','state']);
 const signal=interpolate(frame,[0,total],[0,Math.PI*12]);
 const fileJourney=500*(v('mistake')*Math.min(1,progress('mistake')*1.2)+v('weak')*Math.min(1,progress('weak')*1.3)+v('example')*Math.min(1,progress('example')));
 const flowPulse=(t*.23)%1;
 const highlight=['tools','context','coordination','controls','state'].indexOf(current.kind);
 const drawHead=current.title.replace(/^0\d\s+/,'');
 const cue=current.cues.find(c=>local/FPS>=c.start&&local/FPS<c.end+.08);
 return <AbsoluteFill style={{fontFamily:'Arial, sans-serif',color:T.white,background:'#101b2b',overflow:'hidden'}}>
  <div style={{position:'absolute',inset:-120,background:'radial-gradient(ellipse at 15% 30%,#2a534f 0%,transparent 43%),radial-gradient(ellipse at 90% 62%,#403962 0%,transparent 48%),#101b2b',transform:`translate(${Math.sin(t*.08)*20}px,${Math.cos(t*.07)*15}px) scale(1.03)`}}/>
  <svg style={{position:'absolute',inset:0,opacity:.14}} width="1080" height="1920"><defs><pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse"><path d="M 72 0 L 0 0 0 72" fill="none" stroke="#cce8df" strokeWidth="1"/></pattern></defs><rect width="1080" height="1920" fill="url(#grid)"/></svg>
  <div style={{position:'absolute',left:80,top:95,fontSize:26,letterSpacing:5,fontWeight:800,color:T.teal,opacity:entrance}}>THE AI SIDE</div>
  {scenes.map((s,i)=>{const a=active(frame,s,24);return <div key={s.kind} style={{position:'absolute',left:80,right:80,top:188,opacity:a,transform:`translateY(${(1-a)*20}px)`,fontSize:s.title.length>22?53:68,fontWeight:900,letterSpacing:-1.6,lineHeight:1.1}}>{s.title.replace(/^0\d\s+/,'')}</div>})}
  <div style={{position:'absolute',left:80,top:340,width:110,height:6,background:T.teal,transform:`scaleX(${entrance})`,transformOrigin:'left'}}/>
  {/* Persistent central agent, moving softly rather than a sequence of page cards. */}
  <div style={{position:'absolute',left:340,top:620,width:400,height:400,borderRadius:'50%',border:'2px solid #8df2cb55',transform:`rotate(${t*4}deg)`}}><div style={{position:'absolute',left:196,top:-9,width:16,height:16,borderRadius:'50%',background:T.teal}}/></div>
  <div style={{position:'absolute',left:380,top:660,width:320,height:320,borderRadius:'50%',background:'#21374a',border:'4px solid '+T.teal,boxShadow:'0 0 70px #70e1ba2d',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transform:`scale(${1+.014*Math.sin(t*2)})`}}><div style={{fontSize:62,color:T.teal}}>✦</div><div style={{fontSize:31,fontWeight:900,letterSpacing:2}}>AI MODEL</div></div>
  {/* Same file follows each stage of the story. */}
  <div style={{position:'absolute',left:74+fileJourney+Math.sin(t*1.2)*7,top:730+Math.sin(t*1.7)*8,width:165,height:200,opacity:Math.max(cleanup,v('model'),v('loop'),concepts*.7,v('workshop'),v('distinction')),transform:`rotate(${Math.sin(t)*3}deg)`}}><svg viewBox="0 0 160 190" width="165" height="200"><path d="M16 5 H105 L148 48 V180 H16 Z" fill="#f5d572" stroke="#111827" strokeWidth="5"/><path d="M105 5 V50 H148" fill="none" stroke="#111827" strokeWidth="5"/><path d="M40 85 H122 M40 110 H122 M40 135 H100" stroke="#111827" strokeWidth="6" strokeLinecap="round"/></svg><div style={{position:'absolute',top:205,left:-5,width:180,fontSize:21,fontWeight:800,letterSpacing:1,textAlign:'center'}}>PROJECT FILE</div></div>
  <div style={{position:'absolute',left:770,top:725,opacity:cleanup,transform:`translateX(${(1-cleanup)*35}px)`}}><svg width="200" height="210" viewBox="0 0 200 210"><path d="M35 55 H165 L150 180 H50 Z" fill="#fa9d80" stroke="#101827" strokeWidth="6"/><path d="M22 46 H178 M75 25 H125" fill="none" stroke="#fa9d80" strokeWidth="13" strokeLinecap="round"/><path d="M82 85 V150 M118 85 V150" stroke="#101827" strokeWidth="7"/></svg><div style={{fontSize:24,fontWeight:800,textAlign:'center',marginTop:6}}>DELETE TOOL</div></div>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity:Math.max(v('loop'),v('coordination'))}}><path d="M255 850 H360 M720 850 H805" stroke={T.teal} strokeWidth="6" strokeDasharray="14 14" strokeDashoffset={-t*35} fill="none"/><path d="M360 1050 C480 1140 610 1140 720 1050" stroke={T.blue} strokeWidth="5" fill="none" strokeDasharray="13 11" strokeDashoffset={t*35}/></svg>
  <div style={{position:'absolute',left:250+flowPulse*560,top:826,width:19,height:19,background:T.yellow,borderRadius:'50%',boxShadow:'0 0 18px '+T.yellow,opacity:Math.max(v('loop'),v('coordination'))}}/>
  <div style={{position:'absolute',left:285,top:1050,width:510,textAlign:'center',opacity:Math.max(v('loop'),v('coordination')),fontSize:29,fontWeight:800,letterSpacing:1}}>THINK  →  ACT  →  CHECK</div>
  <div style={{position:'absolute',left:130,top:485,width:820,height:690,border:'3px dashed '+T.teal,borderRadius:64,opacity:concepts*.65,transform:`scale(${.94+.06*concepts})`}}/>
  {['TOOLS','CONTEXT','LOOP','CONTROLS','STATE'].map((label,i)=>{let a=i*2*Math.PI/5-Math.PI/2;let x=540+390*Math.cos(a)-82,y=830+335*Math.sin(a)-32;return <Box key={label} x={x} y={y} w={164} h={64} color={i===highlight?T.yellow:'#d9ece4'} active={concepts} tilt={i%2?2:-2}><span style={{fontSize:22}}>{label}</span></Box>})}
  <Box x={160} y={1080} w={760} h={108} color={T.yellow} active={Math.max(v('controls'),v('example'))}><span>REVIEW BEFORE DELETE</span></Box>
  <Box x={755} y={1060} w={220} h={102} color={T.blue} active={v('state')}><span>ACTIVITY LOG</span></Box>
  <div style={{position:'absolute',left:247,top:1020,width:586,height:24,borderRadius:12,background:T.orange,opacity:v('workshop'),transform:`scaleX(${v('workshop')})`}}/>
  <div style={{position:'absolute',left:294,top:1070,opacity:v('workshop'),fontSize:68,color:T.yellow,transform:`rotate(${Math.sin(t)*8}deg)`}}>⚒</div>
  <div style={{position:'absolute',right:302,top:1070,opacity:v('workshop'),fontSize:66,color:T.blue}}>⌑</div>
  <Box x={145} y={1080} w={790} h={120} color={T.orange} active={v('weak')}><span>BROAD ACCESS • NO APPROVAL</span></Box>
  <Box x={125} y={1080} w={830} h={120} color={T.blue} active={v('workshop')}><span>TOOLS + RULES + SAFETY</span></Box>
  <Box x={110} y={1080} w={860} h={120} color={T.yellow} active={v('distinction')}><span>MINIMAL  →  ENGINEERED</span></Box>
  <Box x={165} y={1105} w={750} h={105} color={T.teal} active={v('ending')}><span>YOUR DECISION</span></Box>
  {/* Sentence cues are measured from generated audio, not estimated by word count. */}
  <div style={{position:'absolute',left:80,right:80,bottom:205,minHeight:145,fontSize:44,lineHeight:1.23,fontWeight:700,color:T.white,textShadow:'0px 3px 10px #101827',display:'flex',alignItems:'center'}}>{cue?.text||''}</div>
 </AbsoluteFill>;
}
function Video(){return <AbsoluteFill><Workspace/><Audio src={staticFile('harness/narration.wav')}/></AbsoluteFill>}
registerRoot(()=> <Composition id="HarnessExplainer" component={Video} width={1080} height={1920} fps={FPS} durationInFrames={total}/>);
