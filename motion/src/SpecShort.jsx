import React from 'react';
import {AbsoluteFill,Audio,Composition,Easing,interpolate,interpolateColors,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import scenes from './spec-scenes.json';
const FPS=30,TOTAL=scenes.reduce((n,s)=>n+s.duration,0);
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)};
const ease=(v,a,b)=>interpolate(v,[a,b],[0,1],clamp);
const C={white:'#F4F1EA',dim:'#A6A7AC',sub:'#6F747D',line:'#44454D',panel:'#191C21',panel2:'#20252A',mint:'#9DE7C7',coral:'#FF9D8E',amber:'#EBC98B',lav:'#C5BBF6',ink:'#12151A'};
const txt=(x,y,size,fill,children,opts={})=><text x={x} y={y} fontSize={size} fill={fill} fontFamily="Arial, sans-serif" fontWeight={opts.weight||700} textAnchor={opts.anchor||'start'} letterSpacing={opts.spacing||0}>{children}</text>;
const Box=({x,y,w,h,children,fill=C.panel,stroke=C.line,rx=24})=><g><rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth="2"/>{children}</g>;
const Pill=({x,y,w,label,color=C.mint,fill='#293C35'})=><g><rect x={x} y={y} width={w} height="44" rx="22" fill={fill}/>{txt(x+w/2,y+30,19,color,label,{anchor:'middle',weight:800})}</g>;
const Rise=({children,amount})=><g opacity={amount} transform={`translate(0 ${(1-amount)*22})`}>{children}</g>;
function Avatar({x,y,fill=C.lav,mood='smile',s=1}){return <g transform={`translate(${x} ${y}) scale(${s})`}><circle r="44" fill={fill}/><circle cx="-13" cy="-5" r="4" fill={C.ink}/><circle cx="13" cy="-5" r="4" fill={C.ink}/><path d={mood==='sad'?'M-15 20 Q0 7 15 20':mood==='surprise'?'M0 11a7 8 0 1 0 0 16a7 8 0 1 0 0 -16':'M-15 11 Q0 25 15 11'} fill="none" stroke={C.ink} strokeWidth="4" strokeLinecap="round"/></g>}
function Scene({sc,t}){
 const cue=(i)=>sc.cues[Math.min(i,sc.cues.length-1)]?.start||0;
 const e=(i,d=.7)=>ease(t,cue(i),cue(i)+d), k=sc.kind;
 const enter=ease(t,0,.65), pulse=(Math.sin(t*2.5)+1)/2;
 if(k==='prompt'){
  const done=e(1),draw=ease(t,.1,2.1);
  return <g><Rise amount={enter}><Box x={62} y={55} w={796} h={410}>
   {txt(100,108,22,C.dim,'NEW REQUEST',{spacing:2})}<rect x="100" y="148" width="720" height="190" rx="16" fill="#111417" stroke="#41464A" strokeWidth="2"/>
   {txt(128,207,34,C.white,'Build an appointment')}{txt(128,253,34,C.white,'booking feature.')}
   <path d="M128 294H680" stroke={C.mint} strokeWidth="4" strokeLinecap="round" strokeDasharray="552" strokeDashoffset={552*(1-draw)}/>
   <Pill x={100} y={378} w={174} label="AI AGENT" color={C.mint}/><g opacity={done}><Pill x={661} y={378} w={154} label="DONE ✓" color={C.mint}/></g>
  </Box></Rise><g opacity={enter}><path d="M150 565H770" stroke="#373D40" strokeWidth="4" strokeLinecap="round"/><circle cx={150+620*ease(t,.5,3.3)} cy="565" r="8" fill={C.mint}/>{txt(150,630,25,C.dim,'PROMPT')}{txt(770,630,25,C.dim,'WORKING CODE',{anchor:'end'})}</g></g>
 }
 if(k==='problem'){
  const requests=e(1),confirm=e(2),reaction=e(3);
  return <g><Rise amount={enter}><Box x={100} y={44} w={720} h={270}><Pill x={140} y={83} w={190} label="ONE SLOT" color={C.amber} fill="#3B3427"/>{txt(140,205,65,C.white,'10:00 AM')}{txt(140,257,26,C.dim,'Doctor appointment')}
   <circle cx="745" cy="140" r="32" fill="#333B38"/><path d="M731 140l10 10 20-23" stroke={C.mint} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </Box></Rise><g opacity={requests}><path d="M280 392V348Q280 326 310 326H610Q640 326 640 348V392" stroke="#62696C" strokeWidth="3" fill="none" strokeDasharray="7 10"/>
  <Rise amount={requests}><Box x={65} y={398} w={360} h={182} fill="#20232A"><Avatar x={126} y={461} s={.65}/>{txt(176,460,25,C.white,'PATIENT 01')}{txt(176,500,23,C.dim,'10:00 AM')}<g opacity={confirm}><Pill x={104} y={524} w={242} label="CONFIRMED"/></g></Box>
  <Box x={495} y={398} w={360} h={182} fill="#20232A"><Avatar x={556} y={461} s={.65} fill={C.amber}/>{txt(606,460,25,C.white,'PATIENT 02')}{txt(606,500,23,C.dim,'10:00 AM')}<g opacity={confirm}><Pill x={534} y={524} w={242} label="CONFIRMED"/></g></Box></Rise></g>
  <g opacity={reaction}><rect x="210" y="646" width="500" height="82" rx="22" fill="#3B292C" stroke="#824E50" strokeWidth="2"/>{txt(460,698,29,C.coral,'WAIT... BOTH?!',{anchor:'middle'})}</g></g>
 }
 if(k==='spec'){
  const show=e(1),stamp=e(2); const rows=[['01','WHAT IT MUST DO','One patient books a slot'],['02','RULES + CONSTRAINTS','No duplicate bookings'],['03','HOW TO CHECK IT','Define what success means']];
  return <g><Rise amount={enter}><Box x={88} y={35} w={744} h={635} fill="#F3F0E9" stroke="#F3F0E9">
  {txt(128,100,22,'#727875','FEATURE DOCUMENT',{spacing:2})}{txt(128,165,45,C.ink,'Appointment booking')}
  <path d="M128 196H792" stroke="#D3D4CC" strokeWidth="2"/>
  {rows.map((r,i)=>{let v=ease(t,cue(1)+i*.65,cue(1)+i*.65+.6);return <g key={r[0]} opacity={show*v} transform={`translate(0 ${(1-v)*14})`}><rect x="128" y={230+i*115} width="52" height="52" rx="14" fill={i===0?'#DCF3E7':i===1?'#F9DDD8':'#F5E7C4'}/>{txt(154,264+i*115,20,C.ink,r[0],{anchor:'middle'})}{txt(202,255+i*115,24,C.ink,r[1])}{txt(202,292+i*115,22,'#616B68',r[2])}</g>})}
  <g opacity={stamp}><rect x="566" y="570" width="216" height="52" rx="12" fill="#1D3029"/>{txt(674,605,22,C.mint,'SPECIFICATION',{anchor:'middle'})}</g>
  </Box></Rise></g>
 }
 if(k==='example'){
  const booked=e(1),race=e(2),move=ease(t,cue(2),cue(2)+1.4);
  return <g><Rise amount={enter}><Box x={170} y={40} w={580} h={365} fill="#F4F1EA" stroke="#F4F1EA"><rect x="170" y="40" width="580" height="82" rx="22" fill="#D6E9DF"/>{txt(460,94,25,'#264B3C','APPOINTMENT',{anchor:'middle',spacing:2})}{txt(460,212,58,C.ink,'10:00 AM',{anchor:'middle'})}
  <g opacity={1-ease(t,cue(1),cue(1)+.25)}><rect x="280" y="256" width="360" height="74" rx="18" fill="#D9F2E4"/>{txt(460,304,30,'#34745B','AVAILABLE ✓',{anchor:'middle'})}</g>
  <g opacity={ease(t,cue(1)+.25,cue(1)+.6)}><rect x="280" y="256" width="360" height="74" rx="18" fill="#F8DCD5"/>{txt(460,304,30,'#A9534D','BOOKED',{anchor:'middle'})}</g>
  </Box></Rise><g opacity={race}><path d="M148 543H772" stroke="#5D6664" strokeWidth="4" strokeDasharray="7 12"/><circle cx={170+170*move} cy="543" r="20" fill={C.mint}/><circle cx={750-170*move} cy="543" r="20" fill={C.coral}/>{txt(460,630,29,C.white,'Two requests. One slot.',{anchor:'middle'})}{txt(460,676,24,C.dim,'What happens at the same time?',{anchor:'middle'})}</g></g>
 }
 if(k==='criteria'){
  const result=e(1);return <g><Rise amount={enter}><Box x={84} y={45} w={752} h={570}>
   {txt(124,105,21,C.dim,'ACCEPTANCE CRITERIA',{spacing:2})}{txt(124,163,36,C.white,'Two requests. One slot.')}
   <path d="M124 199H796" stroke={C.line} strokeWidth="2"/>
   <circle cx="160" cy="292" r="23" fill="#335F4B"/><path d="M149 292l8 8 16-19" stroke={C.mint} strokeWidth="5" fill="none" strokeLinecap="round"/>{txt(206,284,30,C.white,'First booking')}{txt(206,321,23,C.dim,'The slot is reserved')}<g opacity={result}><Pill x={600} y={264} w={190} label="SUCCESS"/></g>
   <circle cx="160" cy="436" r="23" fill="#69403E"/><path d="M152 428l16 16m0-16l-16 16" stroke={C.coral} strokeWidth="4" strokeLinecap="round"/>{txt(206,428,30,C.white,'Second booking')}{txt(206,465,23,C.dim,'A clear message appears')}<g opacity={result}><Pill x={600} y={408} w={190} label="TRY AGAIN" color={C.coral} fill="#3B292C"/></g>
  </Box></Rise></g>
 }
 if(k==='plan'){
  const task=e(1),review=e(2),travel=(t*90)%540;
  return <g><Rise amount={enter}><Box x={75} y={45} w={770} h={490}>
   {txt(115,108,21,C.dim,'TECHNICAL PLAN',{spacing:2})}{txt(115,170,35,C.white,'Prevent conflicting writes')}
   <path d="M205 315H715" stroke="#66736C" strokeWidth="4" strokeDasharray="8 10"/><circle cx={195+travel} cy="315" r="9" fill={C.mint}/>
   {[['APP',170,'#263A33'],['API',380,'#302F40'],['DATABASE',590,'#443B2B']].map(([label,x,fill])=><g key={label}><rect x={x} y="252" width="160" height="118" rx="22" fill={fill} stroke="#59615E" strokeWidth="2"/>{txt(x+80,319,24,C.white,label,{anchor:'middle'})}</g>)}
   <g opacity={task}>{txt(460,458,28,C.mint,'TASKS   →   CODE   →   TEST',{anchor:'middle'})}</g>
  </Box></Rise><g opacity={review}><rect x="190" y="604" width="540" height="78" rx="20" fill="#283C34" stroke="#5B8874" strokeWidth="2"/>{txt(460,654,26,C.mint,'HUMAN REVIEW MATTERS',{anchor:'middle'})}</g></g>
 }
 const next=e(1);return <g><Rise amount={enter}><Box x={90} y={80} w={740} h={390}><Pill x={130} y={122} w={220} label="THE TAKEAWAY" color={C.amber} fill="#3C3528"/>{txt(130,237,38,C.white,'Clear requirements.')}{txt(130,294,38,C.white,'A plan. Testable results.')}{txt(130,372,25,C.dim,'Humans and agents share the same goal.')}</Box></Rise><g opacity={next} transform={`translate(0 ${(1-next)*24})`}><Box x={165} y={560} w={590} h={130} fill="#26382F" stroke="#507764"/>{txt(460,615,22,C.mint,'NEXT EPISODE',{anchor:'middle',spacing:2})}{txt(460,659,32,C.white,'GitHub Spec Kit',{anchor:'middle'})}</g></g>
}
function Caption({cue,t}){
 if(!cue)return null;
 const words=cue.text.split(/\s+/),chunks=[];for(let i=0;i<words.length;i+=5)chunks.push(words.slice(i,i+5));
 const p=Math.max(0,Math.min(.999,(t-cue.start)/Math.max(.1,cue.end-cue.start))),idx=Math.min(chunks.length-1,Math.floor(p*chunks.length));
 const local=p*chunks.length-idx, active=Math.min(chunks[idx].length-1,Math.floor(local*chunks[idx].length));
 return <div style={{position:'absolute',top:238,left:105,right:105,height:185,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:65,lineHeight:1.19,fontWeight:800,letterSpacing:-1.6}}><div style={{width:'100%',minWidth:0,overflowWrap:'break-word'}}>{chunks[idx].map((w,i)=><span key={i} style={{display:'inline',marginRight:14,color:i===active?C.mint:i<active?C.white:'#8C9194'}}>{w}</span>)}</div></div>
}
function Main(){
 const f=useCurrentFrame(),s=scenes.find(x=>f>=x.start&&f<x.start+x.duration)||scenes[scenes.length-1],t=(f-s.start)/FPS,cue=s.cues.find(c=>t>=c.start&&t<c.end),index=scenes.indexOf(s),prev=index>0?scenes[index-1]:null;
 const fadeIn=prev?ease(f,s.start+5,s.start+12):1,fadeOut=prev?1-ease(f,s.start,s.start+5):0;
 return <AbsoluteFill style={{background:'#101316',overflow:'hidden',fontFamily:'Arial,sans-serif',color:C.white}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 30% 37%, #25352e 0%, #171c1c 38%, #101316 75%)'}}/>
  <AbsoluteFill style={{opacity:.15,backgroundImage:'linear-gradient(#738078 1px, transparent 1px), linear-gradient(90deg,#738078 1px,transparent 1px)',backgroundSize:'84px 84px'}}/>
  <div style={{position:'absolute',top:115,left:112,fontSize:25,fontWeight:900,letterSpacing:4,color:C.mint}}>THE AI SIDE</div>
  <div style={{position:'absolute',top:163,left:112,right:112,height:2,background:'#4A5A51',opacity:.7}}/>
  <Caption cue={cue} t={t}/>
  <svg style={{position:'absolute',left:80,top:475}} width="920" height="910" viewBox="0 0 920 910">
   {prev&&fadeOut>0&&<g opacity={fadeOut}><Scene sc={prev} t={(f-prev.start)/FPS}/></g>}
   <g opacity={fadeIn}><Scene sc={s} t={t}/></g>
  </svg>
  <div style={{position:'absolute',left:112,right:155,bottom:214,display:'flex',alignItems:'center',gap:14,fontSize:23,color:'#88928C',fontWeight:700,letterSpacing:2}}><span style={{width:10,height:10,borderRadius:'50%',background:C.mint,display:'inline-block'}}/>SPEC-DRIVEN DEVELOPMENT</div>
  <Audio src={staticFile('spec-short/narration.wav')}/>
 </AbsoluteFill>
}
registerRoot(()=> <Composition id="SpecShort" component={Main} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL}/>);
