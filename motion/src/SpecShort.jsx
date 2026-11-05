import React from 'react';
import {AbsoluteFill,Audio,Composition,Easing,interpolate,interpolateColors,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import scenes from './spec-scenes.json';
const FPS=30,TOTAL=scenes.reduce((a,s)=>a+s.duration,0);
const o={extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)};
const ease=(v,a,b)=>interpolate(v,[a,b],[0,1],o);
const C={ink:'#202842',mint:'#57bfa3',purple:'#8e7bd5',gold:'#ffc56c',red:'#ef7b73',cream:'#fffaf0',light:'#ebf2f4'};
const T=({x,y,children,size=26,fill=C.ink,weight=800,anchor='middle'})=><text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={fill}>{children}</text>;
const R=({x,y,w,h,fill=C.cream,stroke=C.ink,sw=5,rx=18})=><rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={sw}/>;
function Person({x,y,s=1,t=0,color='#a996eb',skin='#eeb887',mood='smile',arm='down',walk=0,sit=0,scratch=0}){
 const swing=Math.sin(t*5)*walk*12,armY=arm==='point'?-32:arm==='raise'?-95:40,blink=Math.abs(Math.sin(t*1.3))>.992;
 return <g transform={`translate(${x} ${y}) scale(${s})`}>
 <path d={`M-23 -68 L${-30+swing+34*sit} ${-5-32*sit} L${-30+swing+45*sit} -5 M23 -68 L${30-swing+25*sit} ${-5-32*sit} L${30-swing+32*sit} -5`} stroke={C.ink} strokeWidth="14" strokeLinecap="round"/>
 <path d="M-51 -158 Q0 -185 51 -158 L58 -68 H-58Z" fill={color} stroke={C.ink} strokeWidth="6"/>
 <path d={`M-47 -150 Q-75 -130 -66 -106 M48 -151 Q${scratch?82:75} ${scratch?-195+8*Math.sin(t*6):-135+armY*.25} ${scratch?42:81} ${scratch?-240+7*Math.sin(t*6):-140+armY}`} fill="none" stroke={C.ink} strokeWidth="13" strokeLinecap="round"/>
 <circle cx="0" cy="-216" r="52" fill={skin} stroke={C.ink} strokeWidth="6"/>
 <path d="M-52 -220 Q-50 -272 -2 -269 Q48 -270 52 -220 Q20 -244 -10 -238 Q-32 -237 -52 -220Z" fill="#42334a"/>
 <ellipse cx="-19" cy="-216" rx="4.5" ry={blink?1:4.5} fill={C.ink}/><ellipse cx="19" cy="-216" rx="4.5" ry={blink?1:4.5} fill={C.ink}/>
 <path d={mood==='sad'?'M-19 -190 Q0 -205 19 -190':mood==='surprise'?'M-4 -199 Q9 -202 7 -188 Q-4 -184 -4 -199':'M-19 -193 Q0 -178 19 -193'} fill="none" stroke={C.ink} strokeWidth="4.5" strokeLinecap="round"/>
 </g>
}
function Robot({x,y,s=1,t=0,concern=false}){
 const tilt=Math.sin(t*2)*3;
 return <g transform={`translate(${x} ${y}) scale(${s})`}>
 <path d="M-27 -52V-7 M27 -52V-7" stroke={C.ink} strokeWidth="12" strokeLinecap="round"/>
 <rect x="-48" y="-130" width="96" height="80" rx="20" fill="#79caba" stroke={C.ink} strokeWidth="6"/>
 <g transform={`rotate(${tilt} 0 -165)`}><rect x="-56" y="-215" width="112" height="82" rx="20" fill="#d5f3e8" stroke={C.ink} strokeWidth="6"/>
 <path d="M0 -215v-23" stroke={C.ink} strokeWidth="6"/><circle cx="0" cy="-244" r="7" fill={C.red}/>
 <circle cx="-20" cy="-178" r="6" fill={C.ink}/><circle cx="20" cy="-178" r="6" fill={C.ink}/>
 <path d={concern?'M-18 -151 Q0 -162 18 -151':'M-18 -157 Q0 -144 18 -157'} stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round"/></g>
 <path d={`M-48 -110 Q-72 -92 -72 -72 M48 -112 Q75 ${-110+Math.sin(t*3)*6} 76 -140`} stroke={C.ink} strokeWidth="10" fill="none" strokeLinecap="round"/>
 </g>
}
function Frame({children,title='BOOK APPOINTMENT'}){return <g><R x={168} y={70} w={544} h={450} rx={30} fill="#fffdfa"/><rect x="170" y="72" width="540" height="75" rx="27" fill="#ded8f3"/><circle cx="205" cy="108" r="9" fill={C.red}/><circle cx="235" cy="108" r="9" fill={C.gold}/><circle cx="265" cy="108" r="9" fill={C.mint}/><T x={490} y={118} size={23}>{title}</T>{children}</g>}
function Card({x,y,w=200,text,fill='#e2f2eb',size=23}){return <g><R x={x} y={y} w={w} h={65} rx={15} fill={fill} stroke="none" sw={0}/><T x={x+w/2} y={y+42} size={size}>{text}</T></g>}
function Scene({sc,t}){
 const e=i=>{let c=sc.cues[Math.min(i,sc.cues.length-1)];return ease(t,c.start,c.start+.7)},p=(i,j)=>{let a=sc.cues[Math.min(i,sc.cues.length-1)].start,b=sc.cues[Math.min(j,sc.cues.length-1)].start;return ease(t,a,Math.max(a+.5,b))},k=sc.kind,wig=Math.sin(t*2)*3;
 const floor=<path d="M45 692H835" stroke="#a7b6b1" strokeWidth="6" strokeLinecap="round"/>;
 if(k==='prompt')return <g>{floor}<Frame title="NEW FEATURE"><T x={440} y={223} size={30}>BOOK AN APPOINTMENT</T><g opacity={1-e(1)}><path d="M270 275H610 M270 305H540 M270 335H575" stroke={C.purple} strokeWidth="8" strokeLinecap="round" strokeDasharray="340" strokeDashoffset={340*(1-ease(t,0,2))}/><rect x={270+250*((t*.45)%1)} y="345" width="5" height="20" fill={C.ink}/></g><g opacity={e(1)}><Card x={330} y={380} w={220} text="DONE!" fill="#d9f2e6" size={28}/></g></Frame><Person x={100} y={690} s={.65} t={t} arm="point"/><Robot x={780} y={690} s={.68} t={t}/><g opacity={1-e(1)}><path d="M180 570H700" fill="none" stroke={C.purple} strokeWidth="5" strokeDasharray="10 10"/><circle cx={180+520*p(0,1)} cy="570" r="11" fill={C.purple}/></g></g>;
 if(k==='problem'){
  const arrive=p(1,2), confirmed=e(2), react=e(3), phonesOut=e(3), travel=ease(t,sc.cues[1].start,sc.cues[1].start+1.5);
  return <g>{floor}
   <g opacity={1-phonesOut} transform={`translate(0 ${-40*phonesOut})`}>
    <T x={440} y={90} size={32}>ONE APPOINTMENT. TWO PATIENTS.</T>
    {[0,1].map((i)=><g key={i} transform={`translate(${i?500:190} 125)`}>
     <R x={0} y={0} w={190} h={240} rx={24} fill="#fffdfa" sw={5}/><rect x={69} y={12} width={52} height={7} rx={4} fill={C.ink}/>
     <T x={95} y={65} size={21}>APPOINTMENT</T><T x={95} y={112} size={31}>10:00</T>
     <g opacity={confirmed}><Card x={16} y={145} w={158} text="CONFIRMED" fill="#d9f2e6" size={19}/></g>
    </g>)}
    <g opacity={(1-confirmed)*e(1)}><path d="M380 255H500" stroke={C.purple} strokeWidth="5" strokeDasharray="8 8"/><circle cx={380+60*travel} cy="255" r="13" fill={C.purple}/><circle cx={500-60*travel} cy="255" r="13" fill={C.red}/></g>
   </g>
   <g opacity={react}><path d="M389 634H493V661H389Z M404 661V687 M478 661V687 M389 634V570" fill="#d9ad79" stroke={C.ink} strokeWidth="7" strokeLinejoin="round"/><T x={440} y={125} size={38} fill={C.red}>WAIT... BOTH?!</T><path d="M437 151l-15 31 M457 151l15 31" stroke={C.red} strokeWidth="6" strokeLinecap="round"/></g>
   <Person x={210+230*react} y={690} s={.82} t={t} sit={react} color="#a996eb" mood={react>.3?'surprise':'smile'} scratch={react>.45}/>
   <Person x={670-76*react} y={690} s={.82} t={t+1} color="#ffbc83" skin="#bc825f" mood={react>.3?'sad':'smile'} scratch={react>.45}/>
   <g opacity={react}><Robot x={785} y={690} s={.5} t={t} concern={true}/></g>
  </g>
 }
 if(k==='spec'){
  const ink=e(1),stamp=e(2),penX=330+250*ease(t,sc.cues[1].start,sc.cues[1].start+2);
  return <g>{floor}
   <g transform={`translate(0 ${(1-ink)*25})`}><R x={212} y={65} w={455} h={490} rx={20} fill="#fffdfa" sw={6}/>
    <path d="M580 65v80h87" fill="#eee8fb" stroke={C.ink} strokeWidth="5"/>
    <T x={400} y={130} size={31}>THE SPEC</T>
    <g opacity={ink}><path d="M260 185H590 M260 273H590 M260 361H590" stroke="#d2d9dc" strokeWidth="5"/>
     <T x={290} y={215} anchor="start" size={25}>WHAT SHOULD HAPPEN</T>
     <T x={290} y={303} anchor="start" size={25}>RULES + EDGE CASES</T>
     <T x={290} y={391} anchor="start" size={25}>HOW TO CHECK IT</T>
     <path d={`M${penX} 456l45 -45 17 17 -45 45 -24 7z`} fill={C.gold} stroke={C.ink} strokeWidth="5"/>
    </g>
    <g opacity={stamp} transform={`rotate(-9 512 493)`}><R x={395} y={466} w={230} h={58} rx={8} fill="#fef6ee" stroke={C.red} sw={5}/><T x={510} y={506} size={25} fill={C.red}>SPECIFICATION</T></g>
   </g>
   <Person x={100} y={690} s={.75} t={t} arm="point"/><Robot x={780} y={690} s={.76} t={t}/>
  </g>
 }
 if(k==='example'){
  const booked=e(1),race=e(2),p1=245+130*ease(t,sc.cues[2].start,sc.cues[2].start+1.4),p2=635-130*ease(t,sc.cues[2].start,sc.cues[2].start+1.4);
  return <g>{floor}
   <T x={440} y={88} size={32}>THE BOOKING RULE</T>
   <R x={285} y={120} w={310} h={280} rx={22} fill="#fffdfa" sw={6}/><rect x="287" y="122" width="306" height="65" rx="19" fill="#ded8f3"/>
   <T x={440} y={165} size={27}>10:00 AM</T>
   <g opacity={1-booked}><T x={440} y={270} size={37} fill={C.mint}>AVAILABLE</T><path d="M397 336l30 30 55-55" fill="none" stroke={C.mint} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/></g>
   <g opacity={booked}><T x={440} y={270} size={37} fill={C.red}>BOOKED</T><path d="M400 297l70 70 M470 297l-70 70" stroke={C.red} strokeWidth="10" strokeLinecap="round"/></g>
   <g opacity={race}><path d="M205 485H675" stroke="#b8b1cf" strokeWidth="6" strokeDasharray="10 8"/><circle cx={p1} cy="485" r="22" fill={C.purple}/><circle cx={p2} cy="485" r="22" fill={C.red}/><T x={440} y={550} size={24}>TWO REQUESTS AT ONCE?</T></g>
   <Person x={100} y={690} s={.75} t={t} arm="point"/><Robot x={780} y={690} s={.76} t={t} concern={race>.5}/>
  </g>
 }
 if(k==='criteria'){
  const res=e(1),x=245+185*res;
  return <g>{floor}<T x={440} y={92} size={34}>HOW DO WE KNOW IT WORKS?</T>
   <T x={440} y={155} size={25}>TWO REQUESTS. ONE SLOT.</T>
   <path d="M180 255H700 M180 390H700" stroke="#c9c5d9" strokeWidth="6" strokeDasharray="8 10"/>
   <g transform={`translate(${x} 255)`}><circle r="25" fill={C.mint}/><path d="M-11 0l8 9 16-18" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round"/></g>
   <g transform={`translate(${x} 390)`}><circle r="25" fill={C.red}/><path d="M-10-10l20 20 M10-10l-20 20" stroke="white" strokeWidth="6" strokeLinecap="round"/></g>
   <g opacity={res}><Card x={500} y={222} w={230} text="BOOKED" fill="#d9f2e6" size={24}/><Card x={500} y={357} w={230} text="TRY ANOTHER" fill="#fff0d3" size={22}/></g>
   <T x={440} y={505} size={25}>ONE SUCCEEDS. ONE GETS A MESSAGE.</T>
   <Person x={100} y={690} s={.75} t={t}/><Robot x={780} y={690} s={.76} t={t}/>
  </g>
 }
 if(k==='plan'){let flow=(t*90)%230;return <g>{floor}<Frame title="TECHNICAL PLAN"><T x={440} y={210} size={25}>PREVENT CONFLICTING WRITES</T><path d="M270 315H610" stroke="#abb9c4" strokeWidth="7" strokeDasharray="12 10"/><Card x={205} y={275} w={120} text="APP" fill="#d9f2e6" size={21}/><Card x={380} y={275} w={120} text="API" fill="#eee8fb" size={21}/><g><path d="M555 293v47c0 12 120 12 120 0v-47" fill="#fff0d3" stroke={C.ink} strokeWidth="5"/><ellipse cx="615" cy="293" rx="60" ry="17" fill="#ffd99b" stroke={C.ink} strokeWidth="5"/><T x={615} y={332} size={19}>DATA</T></g><path d="M260 242H620" stroke={C.purple} strokeWidth="3" strokeDasharray="4 10" opacity=".45"/><rect x={260+flow} y="230" width="25" height="25" rx="6" fill={C.mint}/><rect x={260+((t*90+125)%230)} y="230" width="22" height="22" rx="5" fill={C.red}/><g opacity={e(1)}><T x={440} y={438} size={25}>TASKS → CODE → TEST</T></g></Frame><Person x={100} y={690} s={.65} t={t} arm="point"/><Robot x={780} y={690} s={.68} t={t}/></g>}
 return <g>{floor}<Frame title="SPEC-DRIVEN DEVELOPMENT"><T x={440} y={220} size={26}>DESCRIBE · BUILD · TEST</T><Card x={240} y={275} w={400} text="SHARED + TESTABLE" fill="#d9f2e6"/><g opacity={e(1)}><path d="M310 420v-33q0-20 20-20h55q20 0 20 20v33" fill="none" stroke={C.ink} strokeWidth="7"/><R x={275} y={415} w={330} h={78} rx={15} fill="#eee8fb" stroke={C.ink} sw={5}/><T x={440} y={464} size={22}>NEXT: GITHUB SPEC KIT</T></g></Frame><Person x={100} y={690} s={.65} t={t} arm="point"/><Robot x={780} y={690} s={.68} t={t}/></g>
}
function Caption({cue,time}){if(!cue)return null;let words=cue.text.split(/\s+/),chunks=[];for(let i=0;i<words.length;i+=5)chunks.push(words.slice(i,i+5));let n=Math.max(0,Math.min(chunks.length-1,Math.floor((time-cue.start)/Math.max(.1,cue.end-cue.start)*chunks.length)));return <div style={{position:'absolute',left:95,right:150,bottom:300,minHeight:150,display:'flex',justifyContent:'center',alignItems:'center'}}><div style={{background:'#202842',borderRadius:22,padding:'20px 26px',color:'#fff',fontSize:50,fontWeight:800,lineHeight:1.17,textAlign:'center'}}>{chunks[n].map((w,i)=><span key={i} style={{marginRight:9,color:i===chunks[n].length-1?'#ffc56c':'white'}}>{w}</span>)}</div></div>}
function Main(){const f=useCurrentFrame(),s=scenes.find(x=>f>=x.start&&f<x.start+x.duration)||scenes[scenes.length-1],t=(f-s.start)/FPS,cue=s.cues.find(c=>t>=c.start&&t<c.end),ix=scenes.indexOf(s),prev=ix>0?scenes[ix-1]:null,blend=prev?ease(f,s.start,s.start+18):1,bg=interpolateColors(f,scenes.map(x=>x.start),['#fff1e2','#f1eafa','#e6f4eb','#fff1db','#e8eefb','#eef6ed','#fff0e5']);return <AbsoluteFill style={{background:bg,color:C.ink,fontFamily:'Arial, sans-serif',overflow:'hidden'}}><div style={{position:'absolute',top:190,left:105,fontSize:25,fontWeight:900,letterSpacing:4,color:'#28756b'}}>THE AI SIDE</div><div style={{position:'absolute',top:250,left:105,right:165,fontSize:58,fontWeight:900,lineHeight:1.05}}>SPEC-DRIVEN DEVELOPMENT</div><svg style={{position:'absolute',left:100,top:430}} width="880" height="760" viewBox="0 0 880 760"><defs><clipPath id="wipe"><circle cx="440" cy="345" r={blend*1020}/></clipPath></defs>{prev&&blend<1&&<Scene sc={prev} t={(f-prev.start)/FPS}/>}<g clipPath="url(#wipe)"><rect x="0" y="0" width="880" height="760" fill={bg}/><Scene sc={s} t={t}/></g></svg><Caption cue={cue} time={t}/><Audio src={staticFile('spec-short/narration.wav')}/></AbsoluteFill>}
registerRoot(()=> <Composition id="SpecShort" component={Main} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL}/>);

