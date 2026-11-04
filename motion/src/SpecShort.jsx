import React from 'react';
import {AbsoluteFill,Audio,Composition,Easing,interpolate,interpolateColors,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import scenes from './spec-scenes.json';
const FPS=30, TOTAL=scenes.reduce((a,s)=>a+s.duration,0);
const C={bg:'#f9f1e6',base:'#e4f1ee',white:'#233047',muted:'#58647b',aqua:'#70d5bf',amber:'#ffcb70',red:'#ed786e',violet:'#cab9f3',stroke:'#a8b5c5',ink:'#233047'};
const opt={extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)};
const range=(f,a,b)=>interpolate(f,[a,b],[0,1],opt);
const local=(f,s)=>Math.max(0,(f-s.start)/FPS);
const fade={extrapolateLeft:'clamp',extrapolateRight:'clamp'};
const visible=(f,s)=>f>=s.start-12&&f<s.start+s.duration+9;
const reveal=(f,s)=>s.start===0?1:range(f,s.start-12,s.start+9);
function IconFile({x=0,y=0,scale=1,color=C.amber}){return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M0 0H106L150 44V178H0Z" fill={color} stroke={C.ink} strokeWidth="6" strokeLinejoin="round"/><path d="M106 0V44H150M25 80H122M25 108H122M25 136H94" fill="none" stroke={C.ink} strokeWidth="6" strokeLinecap="round"/></g>}
function Brain({x=400,y=310,r=130,label='AI MODEL'}){return <g><circle cx={x} cy={y} r={r+20} fill="none" stroke={C.aqua} opacity=".18" strokeWidth="5"/><circle cx={x} cy={y} r={r} fill="#d9efea" stroke={C.aqua} strokeWidth="7"/><path d={`M${x} ${y-65}l13 38 38 13-38 13-13 38-13-38-38-13 38-13Z`} fill={C.aqua}/><text x={x} y={y+Math.min(69,r*.6)} textAnchor="middle" fill={C.white} fontWeight="800" fontSize={r<100?21:33}>{label}</text></g>}
function Node({x,y,w=210,h=95,label,color=C.aqua}){return <g><rect x={x} y={y} width={w} height={h} rx="25" fill={color}/><text x={x+w/2} y={y+h/2+11} textAnchor="middle" fill={C.ink} fontWeight="900" fontSize={label.length>14?25:32}>{label}</text></g>}
function Line({x1,y1,x2,y2,color=C.muted}){return <path d={`M${x1} ${y1} L${x2} ${y2}`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/>}
function Motion({children,t,delay=0}){const a=range(t,delay,delay+.6);return <g opacity={a} transform={`translate(0 ${(1-a)*36})`}>{children}</g>}
function FlowDot({x1,y1,x2,y2,t,delay=0}){const p=((Math.max(0,t-delay)*.27)%1);return <circle cx={x1+(x2-x1)*p} cy={y1+(y2-y1)*p} r="11" fill="#233047" opacity={t>delay?.8:0}/>}
function Worker({x=295,y=75,scale=1,t=0}){const n=Math.sin(t*2)*3;return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M35 245 Q100 205 165 245 L174 355 H26Z" fill="#a5b8ef" stroke="#263248" strokeWidth="7"/><path d="M45 260 Q0 300 5 350 M155 260 Q200 300 195 350" stroke="#263248" strokeWidth="20" fill="none" strokeLinecap="round"/><g transform={`rotate(${n} 100 130)`}><circle cx="100" cy="130" r="68" fill="#f3b986" stroke="#263248" strokeWidth="7"/><path d="M35 120 Q35 38 98 55 Q153 35 168 105 Q130 77 92 84 Q55 85 35 120Z" fill="#3a2b42"/><circle cx="78" cy="132" r="5" fill="#263248"/><circle cx="123" cy="132" r="5" fill="#263248"/><path d="M82 160 Q100 171 118 160" fill="none" stroke="#263248" strokeWidth="5" strokeLinecap="round"/></g></g>}
function EasePerson({x=0,y=0,s=1,t=0,mood='happy',action='wave'}) {
 let swing=Math.sin(t*3)*12, scratch=action==='scratch', wave=action==='wave';
 return <g transform={`translate(${x} ${y}) scale(${s})`}>
 <path d={`M68 240 L${58+swing*.3} 320 M120 240 L${130-swing*.3} 320`} stroke="#263248" strokeWidth="13" strokeLinecap="round"/>
 <path d="M46 151 Q93 135 140 151 L149 245 H38Z" fill="#a5b8ef" stroke="#263248" strokeWidth="6"/>
 <path d="M48 170 Q15 195 31 225" fill="none" stroke="#263248" strokeWidth="13" strokeLinecap="round"/>
 <path d={scratch?`M135 173 Q178 ${128+swing} 143 ${52+swing*.3}`:wave?`M135 171 Q170 ${125+swing} 171 ${90+swing}`:`M135 171 Q165 200 150 229`} fill="none" stroke="#263248" strokeWidth="13" strokeLinecap="round"/>
 <circle cx="93" cy="80" r="57" fill="#f3b986" stroke="#263248" strokeWidth="6"/>
 <path d="M36 75Q32 14 91 22Q142 8 150 70Q105 42 36 75Z" fill="#3a2b42"/>
 <circle cx="75" cy="79" r="5" fill="#263248"/><circle cx="110" cy="79" r="5" fill="#263248"/>
 <path d={mood==='confused'?'M75 112 Q93 101 111 112':'M75 105 Q93 120 111 105'} fill="none" stroke="#263248" strokeWidth="5" strokeLinecap="round"/>
 {mood==='confused'&&<text x="151" y="25" fontSize="45" fontWeight="900" fill="#e87569">?</text>}
 </g>
}
function Diagram({scene,frame}) {
 const t=local(frame,scene), k=scene.kind, cues=scene.cues, at=(i)=>cues[Math.min(i,cues.length-1)]?.start||0;
 const e=(i,d=.5)=>range(t,at(i),at(i)+d), wig=Math.sin(t*2)*5;
 if(k==='house'){
 const built=e(5,1.2), roof=e(5,1.4), wrong=e(6,.8), confuse=e(7,.3);
 return <g>
 <EasePerson x={20} y={280} s={.86} t={t} action={confuse>.5?'scratch':'wave'} mood={confuse>.5?'confused':'happy'}/>
 <path d="M30 635H770" stroke="#9daaa8" strokeWidth="6"/>
 <g transform="translate(280 130)"><rect x="70" y="220" width="330" height={320*built} rx="6" fill="#ffce88" stroke="#263248" strokeWidth="8"/>
 <path d="M40 230 L235 65 L430 230" fill="none" stroke="#e7756c" strokeWidth="22" strokeLinejoin="round" opacity={roof}/>
 <g opacity={built}><rect x="105" y="290" width="75" height="75" fill="#8ad9ce"/><rect x="285" y="290" width="75" height="75" fill="#8ad9ce"/></g>
 <g transform={`translate(180 ${390-360*wrong})`} opacity={built}><rect width="95" height="130" rx="8" fill="#6c5ba8" stroke="#263248" strokeWidth="7"/><circle cx="72" cy="66" r="6" fill="#ffd366"/></g>
 </g><g opacity={e(1)}><rect x="195" y="65" width="190" height="74" rx="20" fill="#fff7e7"/><text x="290" y="113" textAnchor="middle" fontSize="26" fill="#263248" fontWeight="800">BUILD A HOUSE</text></g>
 {t>=at(2)&&t<at(5)&&<g><text x="660" y="130" textAnchor="middle" fontSize="37" fill="#e7756c" fontWeight="900">NO PLAN!</text><path d="M650 150v50" stroke="#e7756c" strokeWidth="8" strokeLinecap="round"/></g>}
 </g>
 }
 if(k==='guess'){
 const app=e(2,1), surprise=e(3);return <g><EasePerson x={30} y={300} s={.8} t={t} mood={surprise?'confused':'happy'} action={surprise?'scratch':'wave'}/>
 <g transform={`translate(${235+15*Math.sin(t)} 110)`}><rect width="490" height="490" rx="38" fill="#fffaf0" stroke="#263248" strokeWidth="7"/>
 <rect x="25" y="25" width="440" height="80" rx="20" fill="#cab9f3"/><text x="245" y="76" textAnchor="middle" fontSize="30" fill="#263248" fontWeight="900">BUILD ME AN APP</text>
 <g opacity={app} transform={`translate(0 ${30*(1-app)})`}><path d="M165 165H185L200 250H290L310 185H190 M208 275h1 M285 275h1" stroke="#263248" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"/><text x="245" y="350" textAnchor="middle" fontSize="35" fontWeight="900" fill="#263248">SHOPPING APP</text></g>
 <text x="245" y="425" textAnchor="middle" fontSize="26" fill="#c35c55" fontWeight="800" opacity={surprise}>I WANTED WORKOUTS!</text></g></g>
 }
 if(k==='spec'){
 const card=e(0,1);return <g><EasePerson x={20} y={300} s={.8} t={t}/>
 <g transform={`translate(235 ${100+50*(1-card)})`} opacity={card}><rect width="510" height="500" rx="32" fill="#e1eff7" stroke="#3f7894" strokeWidth="8"/><text x="255" y="70" textAnchor="middle" fill="#233047" fontSize="38" fontWeight="900">BLUEPRINT</text>
 {['WHO: PEOPLE WHO TRAIN','WHAT: LOG WORKOUTS','SUCCESS: SEE PROGRESS'].map((s,i)=><g key={s} opacity={range(t,at(2)+i*.5,at(2)+i*.5+.5)} transform={`translate(0 ${i*110})`}><circle cx="55" cy="150" r="14" fill="#70d5bf"/><text x="82" y="160" fontSize="24" fontWeight="900" fill="#233047">{s}</text></g>)}
 <path d={`M${65+300*e(3,2)} 455 l30 -30`} stroke="#e7756c" strokeWidth="9" strokeLinecap="round"/></g></g>
 }
 if(k==='plan'){
 const stage=e(1,1);return <g><EasePerson x={35} y={300} s={.8} t={t}/><g transform="translate(245 105)"><rect width="500" height="500" rx="30" fill="#fffaf0" stroke="#263248" strokeWidth="7"/><text x="250" y="70" textAnchor="middle" fontSize="31" fontWeight="900" fill="#263248">WORKOUT TRACKER</text>
 <rect x="35" y="110" width="430" height="95" rx="18" fill="#70d5bf"/><text x="250" y="170" textAnchor="middle" fontSize="26" fontWeight="900" fill="#263248">LOG + TRACK PROGRESS</text>
 <g opacity={stage} transform={`translate(0 ${30*(1-stage)})`}><path d="M110 270H390V420H110Z" fill="#cab9f3" stroke="#263248" strokeWidth="5"/><path d="M140 310H280 M140 350H350 M140 390H230" stroke="#263248" strokeWidth="8" strokeLinecap="round"/><text x="250" y="470" textAnchor="middle" fontSize="29" fontWeight="900" fill="#263248">SCREENS + STORAGE</text></g></g></g>
 }
 if(k==='tasks'){
 const complete=e(2,1);return <g><EasePerson x={20} y={300} s={.8} t={t}/><g transform="translate(240 100)"><rect width="505" height="500" rx="32" fill="#fffaf0" stroke="#263248" strokeWidth="7"/><text x="250" y="65" textAnchor="middle" fontSize="35" fontWeight="900" fill="#263248">THE BUILD</text>
 {['CREATE SCREEN','SAVE SESSION','SHOW PROGRESS'].map((s,i)=>{let z=e(i+1,.5);return <g key={s} transform={`translate(${25+30*(1-z)} ${100+i*110})`} opacity={z}><rect width="455" height="82" rx="18" fill={[C.aqua,C.violet,C.amber][i]}/><text x="225" y="53" textAnchor="middle" fontSize="28" fontWeight="900" fill="#263248">{s}</text><path d="M405 30 l8 9 15 -20" fill="none" stroke="#263248" strokeWidth="5" opacity={complete}/></g>})}</g></g>
 }
 if(k==='toolkit'){
 return <g><EasePerson x={30} y={295} s={.8} t={t}/><g transform="translate(235 115)"><rect x="0" y="180" width="500" height="300" rx="28" fill="#e7756c" stroke="#263248" strokeWidth="8"/><path d="M170 180 V110 Q170 80 200 80 H300 Q330 80 330 110 V180" fill="none" stroke="#263248" strokeWidth="12"/><text x="250" y="255" textAnchor="middle" fontSize="37" fontWeight="900" fill="#fffaf0">SPEC KIT</text>{['SPEC','PLAN','TASKS','BUILD'].map((s,i)=><g key={s} transform={`translate(${25+i*117} ${330-60*range(t,at(1)+i*.3,at(1)+i*.3+1)})`}><rect width="105" height="85" rx="12" fill={[C.aqua,C.violet,C.amber,C.aqua][i]}/><text x="52" y="53" textAnchor="middle" fontSize="19" fontWeight="900" fill="#263248">{s}</text></g>)}</g></g>
 }
 const q=e(2);return <g><EasePerson x={35} y={280} s={.9} t={t} action={q?'scratch':'wave'} mood={q?'confused':'happy'}/><g transform="translate(285 100)"><rect width="445" height="500" rx="30" fill="#e1eff7" stroke="#3f7894" strokeWidth="8"/><text x="222" y="90" textAnchor="middle" fontSize="36" fontWeight="900" fill="#263248">CHECK THE PLAN</text><path d="M85 190H350M85 270H350M85 350H310" stroke="#80aabd" strokeWidth="8" strokeLinecap="round"/><path d="M330 230l28 28 58 -70" fill="none" stroke="#70d5bf" strokeWidth="14" strokeLinecap="round" opacity={e(0,.6)}/></g></g>
}
function Captions({cue,time}){if(!cue)return null; const words=cue.text.split(/\s+/),groups=[];for(let i=0;i<words.length;){let n=Math.min(5,words.length-i);if(words.length-i-n===1)n--;groups.push(words.slice(i,i+n));i+=n}const weights=groups.map(g=>g.join(' ').length),total=weights.reduce((a,b)=>a+b,0);const fraction=Math.min(.999,Math.max(0,(time-cue.start)/Math.max(.1,cue.end-cue.start)));let cursor=0,index=0;for(let i=0;i<groups.length;i++){cursor+=weights[i]/total;if(fraction<cursor){index=i;break}}return <div style={{position:'absolute',left:110,right:170,bottom:310,minHeight:145,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{background:'#1c2637ed',padding:'22px 26px',borderRadius:22,color:'#fffdfa',fontSize:54,lineHeight:1.18,fontWeight:850,textAlign:'center',boxShadow:'0 9px 30px #0008'}}>{groups[index].map((w,i)=><span key={i} style={{display:'inline-block',marginRight:12,color:i===groups[index].length-1?C.amber:'#fffdfa'}}>{w}</span>)}</div></div>}
function Main(){const f=useCurrentFrame(),t=f/FPS,s=scenes.find(z=>f>=z.start&&f<z.start+z.duration)||scenes[scenes.length-1],time=local(f,s),cue=s.cues.find(c=>time>=c.start&&time<c.end),bg=interpolateColors(f,scenes.map(z=>z.start),['#f8eedf','#e4f0ec','#f0eafb','#fff0db','#e4f2ea','#ecebfa','#fbeadf']);return <AbsoluteFill style={{background:C.bg,color:C.white,fontFamily:'Arial, sans-serif',overflow:'hidden'}}><div style={{position:'absolute',inset:0,background:bg}}/><div style={{position:'absolute',top:250,left:105,fontSize:25,fontWeight:900,letterSpacing:4,color:'#2c706a'}}>THE AI SIDE</div><div style={{position:'absolute',top:318,left:105,right:190,fontWeight:900,fontSize:60,lineHeight:1.05,letterSpacing:-1}}>SPEC-DRIVEN AI</div>{scenes.map(z=>{if(!visible(f,z))return null;const amount=reveal(f,z);return <div key={z.kind} style={{position:'absolute',left:115,top:475,width:800,height:700,background:bg,clipPath:`circle(${amount*110}% at 50% 50%)`}}><svg width="800" height="700" viewBox="0 0 800 700"><Diagram scene={z} frame={f}/></svg></div>})}<Captions cue={cue} time={time}/><Audio src={staticFile('spec-short/narration.wav')}/></AbsoluteFill>}
registerRoot(()=> <Composition id="SpecShort" component={Main} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL}/>);
