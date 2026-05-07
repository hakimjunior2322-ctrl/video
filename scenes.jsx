// scenes.jsx — the 7 narrative beats of the 20s TikTok video

const SCENES = [
  // [start, end] beats — total 20s
  // 1) HOOK 0–3.0 — phone buzzes 03:33, lockscreen
  // 2) JOUR 2 3.0–6.0 — news alert
  // 3) JOUR 3-4 6.0–9.0 — message stack
  // 4) JOUR 5 9.0–12.0 — reply attempt fails
  // 5) RÉVÉLATION 12.0–14.5 — recipient = sender = MOI
  // 6) PENNY DROP 14.5–17.0 — sleep typing
  // 7) TWIST 17.0–20.0 — Demain à 06:14
];

// ── Scene 1: HOOK ─────────────────────────────────────────────────────────
function Scene1Hook() {
  return (
    <Sprite start={0} end={3.0}>
      {({ localTime }) => {
        // Lockscreen scale-up entry
        const phoneScale = interpolate([0, 0.4, 2.6, 3.0], [1.04, 1.0, 1.0, 1.04], Easing.easeOutCubic)(localTime);
        const buzz = localTime > 0.4 && localTime < 1.2;
        const buzzAmt = buzz ? Math.sin((localTime-0.4)*60) * 6 * Math.exp(-(localTime-0.4)*3) : 0;
        return (
          <>
            <PhoneFrame scale={phoneScale} tilt={buzzAmt*0.05}>
              <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg,#020205 0%, #0a0510 50%, #050308 100%)'}}/>
              <StatusBar time="03:33"/>
              <Sprite start={0} end={0.5}>
                <LockClock time="03:33" date="jeudi 7 mai" />
              </Sprite>
              <Sprite start={0.5} end={3.0}>
                <LockClock time="03:33" date="jeudi 7 mai" flicker={0.3}/>
              </Sprite>
              <Sprite start={0.5} end={3.0}>
                {({ localTime: lt, duration: d }) => {
                  const slide = interpolate([0, 0.5], [-300, 0], Easing.easeOutBack)(lt);
                  const shake = lt < 0.7 ? Math.sin(lt*80)*4*Math.exp(-lt*5) : 0;
                  return (
                    <div style={{position:'absolute', inset:0, transform:`translate(${shake}px, ${slide}px)`}}>
                      <IOSNotification
                        x={50} y={780}
                        sender="MOI (DEMAIN)"
                        body="Ne sors pas demain."
                        time="03:33"
                        glow={true}
                      />
                    </div>
                  );
                }}
              </Sprite>
            </PhoneFrame>
          </>
        );
      }}
    </Sprite>
  );
}

// ── Scene 2: JOUR 2 — news alert ─────────────────────────────────────────
function Scene2NewsAlert() {
  return (
    <Sprite start={3.0} end={6.0}>
      {({ localTime }) => {
        const phoneScale = interpolate([0, 0.5, 2.5, 3.0], [1.08, 1.0, 1.0, 1.06])(localTime);
        return (
          <PhoneFrame scale={phoneScale} tilt={-0.5}>
            <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg,#0a0204 0%, #1a0508 60%, #050102 100%)'}}/>
            <StatusBar time="08:42"/>
            {/* Breaking news banner */}
            <Sprite start={0.05} end={3.0}>
              {({ localTime: lt }) => {
                const slide = interpolate([0,0.4],[-200,0], Easing.easeOutCubic)(lt);
                const flash = lt < 0.6 ? (Math.sin(lt*40)>0 ? 1 : 0.85) : 1;
                return (
                  <div style={{
                    position:'absolute', left:50, right:50, top:200,
                    transform:`translateY(${slide}px)`,
                    opacity: flash,
                    zIndex:5,
                  }}>
                    <div style={{
                      background:'#ff2638',
                      borderRadius:'20px 20px 0 0',
                      padding:'14px 24px',
                      color:'#fff',
                      fontFamily:'Inter, sans-serif',
                      fontWeight:800, fontSize:24,
                      letterSpacing:'0.2em',
                      display:'flex', alignItems:'center', gap:14,
                    }}>
                      <div style={{width:14, height:14, background:'#fff', borderRadius:'50%'}}/>
                      ALERTE INFO — EN DIRECT
                    </div>
                    <div style={{
                      background:'#0e0a0c',
                      borderRadius:'0 0 20px 20px',
                      padding:'30px 30px 36px',
                      color:'#fff',
                      borderLeft:'4px solid #ff2638',
                    }}>
                      <div style={{
                        fontFamily:'Inter, sans-serif', fontWeight:800,
                        fontSize:46, lineHeight:1.1, marginBottom:16,
                      }}>Métro ligne 4 — déraillement</div>
                      <div style={{
                        fontFamily:'Inter, sans-serif', fontWeight:600,
                        fontSize:34, color:'#ff7080',
                      }}>12 morts confirmés ce matin à 8 h 12.</div>
                      <div style={{
                        marginTop:24, fontSize:22, color:'rgba(255,255,255,0.5)',
                        fontFamily:'JetBrains Mono, monospace',
                      }}>Le Monde · il y a 4 min</div>
                    </div>
                  </div>
                );
              }}
            </Sprite>
            {/* Hand trembling caption — message preview at bottom */}
            <Sprite start={1.6} end={3.0}>
              {({ localTime: lt }) => {
                const o = interpolate([0,0.3],[0,1])(lt);
                return (
                  <div style={{position:'absolute', inset:0, opacity:o}}>
                    <IOSNotification
                      x={50} y={1100}
                      sender="MOI (DEMAIN)"
                      body="Je te l'avais dit."
                      time="à l'instant"
                      glow={true}
                    />
                  </div>
                );
              }}
            </Sprite>
          </PhoneFrame>
        );
      }}
    </Sprite>
  );
}

// ── Scene 3: JOURS 3-4 — message stack montage ────────────────────────────
function Scene3Montage() {
  const messages = [
    { t: 0.0, text: "Quelqu'un t'observe." },
    { t: 0.85, text: "Ne ferme pas les yeux." },
    { t: 1.7, text: "Il porte ton visage." },
  ];
  return (
    <Sprite start={6.0} end={9.0}>
      {({ localTime }) => {
        const phoneScale = interpolate([0, 0.4, 3.0], [1.0, 1.05, 1.18], Easing.easeInQuad)(localTime);
        return (
          <PhoneFrame scale={phoneScale} tilt={Math.sin(localTime*3)*0.4}>
            <div style={{position:'absolute', inset:0, background:'#040408'}}/>
            <StatusBar time="03:33"/>
            <LockClock time="03:33" date="vendredi 8 mai" flicker={0.5}/>
            {messages.map((m, i) => (
              <Sprite key={i} start={m.t} end={3.0}>
                {({ localTime: lt }) => {
                  const slide = interpolate([0, 0.35], [-150, 0], Easing.easeOutBack)(lt);
                  const shake = lt < 0.4 ? Math.sin(lt*70)*5*Math.exp(-lt*6) : 0;
                  const yPos = 720 + i * 200;
                  return (
                    <div style={{position:'absolute', inset:0, transform:`translate(${shake}px, ${slide}px)`}}>
                      <IOSNotification
                        x={50} y={yPos}
                        sender="MOI (DEMAIN)"
                        body={m.text}
                        time="maintenant"
                        glow={true}
                        scale={0.92}
                      />
                    </div>
                  );
                }}
              </Sprite>
            ))}
          </PhoneFrame>
        );
      }}
    </Sprite>
  );
}

// ── Scene 4: JOUR 5 — reply attempt fails ────────────────────────────────
function Scene4Reply() {
  return (
    <Sprite start={9.0} end={12.0}>
      {({ localTime }) => {
        const phoneScale = interpolate([0, 0.4, 3.0], [1.05, 1.0, 1.04])(localTime);
        return (
          <PhoneFrame scale={phoneScale}>
            <div style={{position:'absolute', inset:0, background:'#070708'}}/>
            <StatusBar time="04:12"/>
            <ConvoHeader name="MOI" sub="+33 6 47 ** ** **"/>
            {/* Existing incoming message at top */}
            <Sprite start={0} end={3.0}>
              <Bubble side="left" x={60} y={420} text="Ne réponds pas. C'est trop tard."/>
            </Sprite>
            {/* User starts typing */}
            <Sprite start={0.5} end={3.0}>
              {({ localTime: lt }) => {
                const fullText = "T'es qui ?";
                const chars = Math.min(fullText.length, Math.floor(lt * 8));
                const text = fullText.slice(0, chars);
                if (!text) return null;
                return (
                  <Bubble side="right" x={60} y={620} text={text || ' '} />
                );
              }}
            </Sprite>
            {/* Sending failed */}
            <Sprite start={2.0} end={3.0}>
              {({ localTime: lt }) => {
                const o = interpolate([0,0.3],[0,1])(lt);
                const shake = Math.sin(lt*40)*3;
                return (
                  <div style={{position:'absolute', left:0, right:0, top:740, opacity:o, transform:`translateX(${shake}px)`, zIndex:6, textAlign:'center'}}>
                    <div style={{
                      display:'inline-flex', alignItems:'center', gap:10,
                      padding:'10px 20px', background:'rgba(255,38,56,0.12)',
                      border:'1px solid rgba(255,38,56,0.5)',
                      borderRadius:20,
                      color:'#ff5666',
                      fontFamily:'Inter,sans-serif', fontWeight:600, fontSize:22,
                    }}>
                      <div style={{width:8, height:8, background:'#ff2638', borderRadius:'50%'}}/>
                      Non délivré · Numéro inexistant
                    </div>
                  </div>
                );
              }}
            </Sprite>
          </PhoneFrame>
        );
      }}
    </Sprite>
  );
}

// ── Scene 5: RÉVÉLATION — sender == recipient ────────────────────────────
function Scene5Revelation() {
  return (
    <Sprite start={12.0} end={14.5}>
      {({ localTime }) => {
        // Hard zoom-in on the contact name
        const phoneScale = interpolate([0, 0.5, 2.5], [1.0, 1.6, 2.0], Easing.easeInQuad)(localTime);
        const phoneY = interpolate([0, 0.5, 2.5], [0, -200, -350], Easing.easeInQuad)(localTime);
        return (
          <div style={{position:'absolute', inset:0, transform:`translateY(${phoneY}px)`}}>
            <PhoneFrame scale={phoneScale}>
              <div style={{position:'absolute', inset:0, background:'#070708'}}/>
              <StatusBar time="04:13"/>
              <ConvoHeader name="MOI" sub="+33 6 47 92 18 03" flashRed={true}/>
              {/* Info panel: numero du destinataire */}
              <Sprite start={0.4} end={2.5}>
                {({ localTime: lt }) => {
                  const o = interpolate([0,0.4],[0,1])(lt);
                  const ringPulse = 1 + Math.sin(lt*6)*0.03;
                  return (
                    <div style={{
                      position:'absolute', left:60, right:60, top:480,
                      opacity:o,
                      zIndex:5,
                    }}>
                      <div style={{
                        background:'rgba(255,38,56,0.08)',
                        border:'2px solid rgba(255,38,56,0.6)',
                        borderRadius:24,
                        padding:'24px 28px',
                        boxShadow:`0 0 ${30*ringPulse}px rgba(255,38,56,0.4)`,
                        transform:`scale(${ringPulse})`,
                      }}>
                        <div style={{fontFamily:'Inter,sans-serif', fontWeight:600, fontSize:22, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:16}}>De · vers</div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                          <div>
                            <div style={{fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:30, color:'#fff'}}>MOI</div>
                            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:22, color:'#ff7080', marginTop:4}}>+33 6 47 92 18 03</div>
                          </div>
                          <div style={{fontSize:42, color:'rgba(255,255,255,0.4)'}}>→</div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:30, color:'#fff'}}>MOI</div>
                            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:22, color:'#ff7080', marginTop:4}}>+33 6 47 92 18 03</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Sprite>
            </PhoneFrame>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── Scene 6: PENNY DROP — sleep typing ───────────────────────────────────
function Scene6SleepTyping() {
  return (
    <Sprite start={14.5} end={17.0}>
      {({ localTime }) => {
        // Pull back to reveal him "asleep" (we use silhouette)
        const zoom = interpolate([0, 1.0, 2.5], [1.6, 0.7, 0.55], Easing.easeOutCubic)(localTime);
        return (
          <>
            {/* Bedroom silhouette context */}
            <div style={{
              position:'absolute', inset:0,
              background:'radial-gradient(ellipse at 50% 60%, #0a0a14 0%, #000 70%)',
            }}/>
            {/* Sleeping silhouette behind/around the phone */}
            <Sprite start={0.6} end={2.5}>
              {({ localTime: lt }) => {
                const o = interpolate([0, 0.6], [0, 0.85])(lt);
                return (
                  <div style={{position:'absolute', inset:0, opacity:o, zIndex:1}}>
                    {/* Pillow */}
                    <div style={{
                      position:'absolute', left:0, right:0, bottom:0, height:600,
                      background:'linear-gradient(180deg, transparent 0%, #0a0a10 30%, #050508 100%)',
                    }}/>
                    {/* Head silhouette */}
                    <div style={{
                      position:'absolute', left:'50%', top:1200, transform:'translateX(-50%)',
                      width:520, height:440, background:'#020203',
                      borderRadius:'50% 50% 45% 45%',
                      boxShadow:'0 -20px 80px rgba(0,0,0,0.8)',
                    }}/>
                    {/* Hand on phone */}
                    <div style={{
                      position:'absolute', left:'45%', top:1380,
                      width:280, height:200, background:'#080809',
                      borderRadius:'40% 30% 50% 30%',
                      transform:'rotate(-15deg)',
                      filter:'blur(2px)',
                    }}/>
                  </div>
                );
              }}
            </Sprite>
            <PhoneFrame scale={zoom} y={300}>
              <div style={{position:'absolute', inset:0, background:'#070708'}}/>
              <StatusBar time="04:18"/>
              {/* Sent messages from "MOI" — all from him */}
              <Sprite start={0} end={2.5}>
                {({ localTime: lt }) => {
                  const stagger = (i) => clamp((lt - i*0.2)/0.3, 0, 1);
                  const msgs = [
                    "Ne sors pas demain.",
                    "Je te l'avais dit.",
                    "Quelqu'un t'observe.",
                    "Il porte ton visage.",
                    "Arrête.",
                  ];
                  return (
                    <>
                      {msgs.map((m,i)=>(
                        <Bubble key={i} side="right" accent={true}
                          x={60} y={400 + i*150}
                          text={m}
                          opacity={stagger(i)}
                          scale={0.6 + 0.4*stagger(i)}
                        />
                      ))}
                    </>
                  );
                }}
              </Sprite>
            </PhoneFrame>
          </>
        );
      }}
    </Sprite>
  );
}

// ── Scene 7: TWIST — Demain à 06:14 ──────────────────────────────────────
function Scene7Twist() {
  return (
    <Sprite start={17.0} end={20.0}>
      {({ localTime }) => {
        const phoneScale = interpolate([0, 0.5, 2.0, 2.7, 3.0], [0.7, 1.0, 1.0, 1.4, 1.6], Easing.easeInOutCubic)(localTime);
        // Final fade to black
        const blackOut = interpolate([2.7, 3.0], [0, 1], Easing.easeInQuad)(localTime);
        return (
          <>
            <div style={{position:'absolute', inset:0, background:'#000'}}/>
            <PhoneFrame scale={phoneScale}>
              <div style={{position:'absolute', inset:0, background:'#000'}}/>
              {/* Status bar with date */}
              <Sprite start={0} end={3.0}>
                {({ localTime: lt }) => {
                  // Clock ticks: 06:13 -> 06:14 around lt=2.0
                  const showFourteen = lt > 1.9;
                  const flashTime = lt > 1.85 && lt < 2.05;
                  return (
                    <>
                      <StatusBar time={showFourteen ? "06:14" : "06:13"}/>
                      <div style={{
                        position:'absolute', top:140, left:0, right:0,
                        textAlign:'center', color:'#fff',
                        zIndex:4,
                      }}>
                        <div style={{fontFamily:'Inter,sans-serif', fontSize:42, fontWeight:500, opacity:0.85, marginBottom:6}}>vendredi 8 mai</div>
                        <div style={{
                          fontFamily:'Inter,sans-serif',
                          fontSize:230, fontWeight:300, letterSpacing:'-0.04em',
                          lineHeight:1, fontVariantNumeric:'tabular-nums',
                          color: flashTime ? '#ff2638' : '#fff',
                          textShadow: flashTime ? '0 0 60px rgba(255,38,56,0.8)' : 'none',
                        }}>
                          {showFourteen ? "06:14" : "06:13"}
                        </div>
                      </div>
                    </>
                  );
                }}
              </Sprite>
              {/* Final notification */}
              <Sprite start={0.3} end={3.0}>
                {({ localTime: lt }) => {
                  const slide = interpolate([0, 0.4], [-300, 0], Easing.easeOutBack)(lt);
                  const shake = lt < 0.7 ? Math.sin(lt*70)*6*Math.exp(-lt*5) : 0;
                  return (
                    <div style={{position:'absolute', inset:0, transform:`translate(${shake}px, ${slide}px)`}}>
                      <IOSNotification
                        x={50} y={780}
                        sender="MOI (DEMAIN)"
                        body="Demain à 06:14."
                        time="maintenant"
                        glow={true}
                      />
                    </div>
                  );
                }}
              </Sprite>
            </PhoneFrame>
            {/* Black out */}
            <div style={{
              position:'absolute', inset:0, background:'#000',
              opacity: blackOut, zIndex:90,
            }}/>
          </>
        );
      }}
    </Sprite>
  );
}

Object.assign(window, {
  Scene1Hook, Scene2NewsAlert, Scene3Montage, Scene4Reply,
  Scene5Revelation, Scene6SleepTyping, Scene7Twist,
});
