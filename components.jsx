// components.jsx — shared visual primitives for the TikTok video

const { useState, useEffect, useRef, useMemo } = React;

const W = 1080, H = 1920;

// ── Camera shake wrapper ────────────────────────────────────────────────
function CameraShake({ intensity = 0, children }) {
  const time = useTime();
  const jx = Math.sin(time * 73) * intensity;
  const jy = Math.cos(time * 91) * intensity * 0.8;
  const jr = Math.sin(time * 41) * intensity * 0.05;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      transform: `translate(${jx}px, ${jy}px) rotate(${jr}deg)`,
      willChange: 'transform',
    }}>{children}</div>
  );
}

// ── Vignette ─────────────────────────────────────────────────────────────
function Vignette({ red = 0 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none',
      background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%), radial-gradient(ellipse at center, rgba(255,30,40,${red*0.15}) 0%, transparent 60%)`,
      zIndex: 50,
    }}/>
  );
}

// ── Scanline / film grain overlay ─────────────────────────────────────────
function FilmGrain() {
  const time = useTime();
  const seed = Math.floor(time * 30);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none',
      opacity: 0.08,
      mixBlendMode: 'overlay',
      backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)`,
      transform: `translateY(${seed % 3}px)`,
      zIndex: 49,
    }}/>
  );
}

// ── Heartbeat pulse on edge of screen ─────────────────────────────────────
function HeartbeatPulse({ bpm = 90, intensity = 1 }) {
  const time = useTime();
  // double-beat: lub-dub
  const period = 60 / bpm;
  const t = (time % period) / period;
  const beat = Math.exp(-Math.pow((t-0.0)*8, 2)) + 0.7 * Math.exp(-Math.pow((t-0.18)*8, 2));
  const a = clamp(beat * intensity, 0, 1);
  return (
    <div style={{
      position:'absolute', inset:0, pointerEvents:'none',
      boxShadow: `inset 0 0 ${120 + a*80}px ${30 + a*40}px rgba(255,30,40,${0.15 + a*0.45})`,
      zIndex: 48,
    }}/>
  );
}

// ── Glitch flash (full-screen) ────────────────────────────────────────────
function GlitchFlash({ start, durations = [0.06, 0.04, 0.05] }) {
  const time = useTime();
  let on = false;
  let acc = start;
  for (const d of durations) {
    if (time >= acc && time < acc + d) { on = true; break; }
    acc += d * 2;
  }
  if (!on) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#fff', mixBlendMode: 'difference',
      opacity: 0.85, zIndex: 60, pointerEvents:'none',
    }}/>
  );
}

// ── Cinema subtitle ───────────────────────────────────────────────────────
// parts: [{word, red?, big?}, …]
function CinemaSubtitle({ start, end, parts, y = 1500, size = 92, jitter = 1.5 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const entry = 0.18, exit = 0.18;
        let opacity = 1, scale = 1;
        if (localTime < entry) {
          const t = clamp(localTime/entry,0,1);
          opacity = t;
          scale = 0.78 + 0.22 * Easing.easeOutBack(t);
        }
        const exitStart = duration - exit;
        if (localTime > exitStart) {
          const t = clamp((localTime-exitStart)/exit,0,1);
          opacity = 1-t;
          scale = 1 - 0.04*t;
        }
        const jx = Math.sin(localTime*47)*jitter;
        const jy = Math.cos(localTime*53)*jitter*0.7;
        return (
          <div style={{
            position:'absolute', left:0, right:0, top:y,
            display:'flex', justifyContent:'center',
            zIndex: 70,
            pointerEvents:'none',
          }}>
            <div style={{
              transform:`translate(${jx}px, ${jy}px) scale(${scale})`,
              opacity,
              fontFamily:'Inter, system-ui, sans-serif',
              fontWeight:900,
              fontSize:size,
              textTransform:'uppercase',
              letterSpacing:'-0.015em',
              color:'#fff',
              textShadow:'0 8px 24px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,1)',
              display:'flex', gap:'0.28em', flexWrap:'wrap',
              justifyContent:'center',
              alignItems:'baseline',
              maxWidth: W - 80,
              textAlign:'center',
              lineHeight: 0.95,
            }}>
              {parts.map((p,i)=>(
                <span key={i} style={{
                  color: p.red ? '#ff2638' : '#fff',
                  fontSize: p.big ? size*1.18 : size,
                  textShadow: p.red
                    ? '0 0 28px rgba(255,38,56,0.7), 0 8px 24px rgba(0,0,0,0.95)'
                    : '0 8px 24px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,1)',
                  WebkitTextStroke: p.red ? '1px rgba(0,0,0,0.4)' : 'none',
                }}>{p.word}</span>
              ))}
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── Day badge (top-left) ──────────────────────────────────────────────────
function DayBadge({ start, end, label }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const entry = 0.25, exit = 0.2;
        let o = 1, x = 0;
        if (localTime < entry) {
          const t = clamp(localTime/entry,0,1);
          o = t;
          x = (1-Easing.easeOutCubic(t)) * -40;
        }
        if (localTime > duration-exit) {
          const t = clamp((localTime-(duration-exit))/exit,0,1);
          o = 1-t;
        }
        return (
          <div style={{
            position:'absolute', left:48, top:120,
            transform:`translateX(${x}px)`,
            opacity:o,
            zIndex:65,
            display:'flex', alignItems:'center', gap:12,
          }}>
            <div style={{width:14, height:14, background:'#ff2638', borderRadius:'50%', boxShadow:'0 0 12px rgba(255,38,56,0.8)'}}/>
            <div style={{
              fontFamily:'JetBrains Mono, ui-monospace, monospace',
              fontWeight:700,
              fontSize:32,
              color:'#fff',
              letterSpacing:'0.18em',
              textShadow:'0 4px 12px rgba(0,0,0,0.9)',
            }}>{label}</div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── Phone frame ──────────────────────────────────────────────────────────
function PhoneFrame({ children, x = 90, y = 220, w = 900, h = 1500, glow = 0, tilt = 0, scale = 1 }) {
  return (
    <div style={{
      position:'absolute',
      left: x + w/2, top: y + h/2,
      width: w, height: h,
      transform: `translate(-50%,-50%) scale(${scale}) rotate(${tilt}deg)`,
      transformOrigin:'center',
      zIndex: 20,
    }}>
      <div style={{
        position:'absolute', inset:0,
        borderRadius: 80,
        background:'#0a0a0e',
        border:'6px solid #16161c',
        boxShadow:`0 50px 100px rgba(0,0,0,0.9), 0 0 0 14px #050507, 0 0 ${60+glow*80}px ${10+glow*30}px rgba(120,180,255,${0.1+glow*0.4})`,
        overflow:'hidden',
      }}>
        {/* Notch */}
        <div style={{
          position:'absolute', top:30, left:'50%', transform:'translateX(-50%)',
          width: 280, height: 44, background:'#000', borderRadius: 24, zIndex: 10,
        }}/>
        {children}
      </div>
    </div>
  );
}

// ── Status bar inside phone ──────────────────────────────────────────────
function StatusBar({ time = '03:33', date }) {
  return (
    <div style={{
      position:'absolute', top:38, left:60, right:60,
      display:'flex', justifyContent:'space-between',
      color:'#fff', fontFamily:'Inter, system-ui, sans-serif',
      fontWeight:600, fontSize:30,
      zIndex:5,
    }}>
      <div>{time}</div>
      <div style={{display:'flex', gap:10, alignItems:'center'}}>
        <div style={{display:'flex', gap:3, alignItems:'flex-end'}}>
          <div style={{width:5, height:8, background:'#fff', borderRadius:1}}/>
          <div style={{width:5, height:12, background:'#fff', borderRadius:1}}/>
          <div style={{width:5, height:16, background:'#fff', borderRadius:1}}/>
          <div style={{width:5, height:20, background:'#fff', borderRadius:1}}/>
        </div>
        <div style={{
          width:32, height:16, border:'2px solid #fff', borderRadius:4,
          position:'relative',
        }}>
          <div style={{position:'absolute', inset:1.5, background:'#fff', width:'70%', borderRadius:1}}/>
        </div>
      </div>
    </div>
  );
}

// ── Big lockscreen clock ──────────────────────────────────────────────────
function LockClock({ time = '03:33', date = 'jeudi 7 mai', flicker = 0 }) {
  const t = useTime();
  const f = flicker > 0 ? (Math.sin(t*30)>0.5 ? flicker*0.7 : 0) : 0;
  return (
    <div style={{
      position:'absolute', top:140, left:0, right:0,
      textAlign:'center', color:'#fff',
      fontFamily:'Inter, system-ui, sans-serif',
      zIndex:4,
      opacity: 1-f,
    }}>
      <div style={{fontSize:42, fontWeight:500, opacity:0.85, marginBottom:6}}>{date}</div>
      <div style={{
        fontSize:230, fontWeight:300, letterSpacing:'-0.04em',
        lineHeight:1, fontVariantNumeric:'tabular-nums',
      }}>{time}</div>
    </div>
  );
}

// ── iOS-style notification ───────────────────────────────────────────────
function IOSNotification({ x=50, y=600, sender='MOI (DEMAIN)', preview, body, time='maintenant', appLabel='Messages', appColor='#1ec964', glow=false, scale=1, opacity=1 }) {
  return (
    <div style={{
      position:'absolute', left:x, right:x, top:y,
      transform:`scale(${scale})`,
      transformOrigin:'top center',
      opacity,
      zIndex: 6,
    }}>
      <div style={{
        background:'rgba(38,38,46,0.78)',
        backdropFilter:'blur(30px)',
        WebkitBackdropFilter:'blur(30px)',
        borderRadius:36,
        padding:'30px 36px',
        color:'#fff',
        fontFamily:'Inter, system-ui, sans-serif',
        boxShadow: glow
          ? '0 0 60px rgba(255,38,56,0.45), 0 20px 40px rgba(0,0,0,0.6)'
          : '0 20px 40px rgba(0,0,0,0.6)',
        border: glow ? '1px solid rgba(255,38,56,0.4)' : '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:14}}>
          <div style={{
            width:50, height:50, borderRadius:12, background: appColor,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:700, fontSize:26, color:'#fff',
          }}>M</div>
          <div style={{fontSize:24, fontWeight:600, flex:1, letterSpacing:'0.02em', textTransform:'uppercase', opacity:0.85}}>{appLabel}</div>
          <div style={{fontSize:22, color:'rgba(255,255,255,0.55)'}}>{time}</div>
        </div>
        <div style={{fontSize:30, fontWeight:700, marginBottom:6}}>{sender}</div>
        {preview && <div style={{fontSize:30, fontWeight:500, opacity:0.9, marginBottom: body?6:0}}>{preview}</div>}
        {body && <div style={{fontSize:32, fontWeight:600, color: glow ? '#ffb3bb':'#fff'}}>{body}</div>}
      </div>
    </div>
  );
}

// ── Message bubble (within a conversation) ───────────────────────────────
function Bubble({ text, side='left', x=80, y=400, width=820, color, accent=false, scale=1, opacity=1 }) {
  const bg = side==='right'
    ? (accent ? '#ff2638' : '#0a84ff')
    : '#2a2a2e';
  return (
    <div style={{
      position:'absolute', left:x, top:y, width,
      transform:`scale(${scale})`,
      opacity,
      display:'flex', justifyContent: side==='right' ? 'flex-end' : 'flex-start',
      zIndex:5,
    }}>
      <div style={{
        maxWidth: '85%',
        background: color || bg,
        color:'#fff',
        padding:'22px 28px',
        borderRadius: side==='right' ? '32px 32px 8px 32px' : '32px 32px 32px 8px',
        fontFamily:'Inter, system-ui, sans-serif',
        fontSize: 30, fontWeight: 500,
        boxShadow: accent ? '0 0 30px rgba(255,38,56,0.6)' : '0 4px 12px rgba(0,0,0,0.4)',
        lineHeight: 1.25,
      }}>
        {text}
      </div>
    </div>
  );
}

// ── Conversation header ──────────────────────────────────────────────────
function ConvoHeader({ name='MOI', sub='+33 6 ** ** ** **' , flashRed=false }) {
  return (
    <div style={{
      position:'absolute', top:100, left:0, right:0,
      display:'flex', flexDirection:'column', alignItems:'center',
      zIndex:5,
      paddingTop: 30,
    }}>
      <div style={{
        width:120, height:120, borderRadius:'50%',
        background: flashRed ? 'linear-gradient(135deg,#ff2638,#7a0010)' : 'linear-gradient(135deg,#444,#222)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'Inter, sans-serif', fontWeight:700, fontSize:54,
        color:'#fff', marginBottom:18,
        boxShadow: flashRed ? '0 0 40px rgba(255,38,56,0.6)' : '0 6px 16px rgba(0,0,0,0.4)',
      }}>M</div>
      <div style={{
        fontFamily:'Inter, sans-serif', fontWeight:700, fontSize:38,
        color:'#fff', letterSpacing:'0.02em',
      }}>{name}</div>
      <div style={{
        fontFamily:'JetBrains Mono, ui-monospace, monospace',
        fontSize:22, color:'rgba(255,255,255,0.55)', marginTop:4,
      }}>{sub}</div>
    </div>
  );
}

Object.assign(window, {
  W, H,
  CameraShake, Vignette, FilmGrain, HeartbeatPulse, GlitchFlash,
  CinemaSubtitle, DayBadge,
  PhoneFrame, StatusBar, LockClock, IOSNotification,
  Bubble, ConvoHeader,
});
