import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'logo' | 'text' | 'loader' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('logo'),   60);    // logo springs in
    const t2 = setTimeout(() => setPhase('text'),   700);   // welcome text fades in
    const t3 = setTimeout(() => setPhase('loader'), 1200);  // loading bar appears
    const t4 = setTimeout(() => setPhase('exit'),   2800);  // start exit
    const t5 = setTimeout(() => onComplete(),       3500);  // unmount

    return () => {
      clearTimeout(t1); clearTimeout(t2);
      clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
    };
  }, [onComplete]);

  const isEnter  = phase === 'enter';
  const isExit   = phase === 'exit';
  const showText = phase === 'text' || phase === 'loader' || phase === 'exit';
  const showLoad = phase === 'loader' || phase === 'exit';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 55%, #0c1e45 0%, #020c1f 75%)',
        opacity: isExit ? 0 : 1,
        transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isExit ? 'none' : 'auto',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        gap: 0,
      }}
    >
      {/* ── Ambient glow blobs ── */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,86,219,0.18) 0%, transparent 70%)',
        filter: 'blur(50px)', top: '50%', left: '50%',
        transform: 'translate(-50%, -55%)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)',
        filter: 'blur(60px)', top: '60%', left: '55%',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }} />

      {/* ── Logo ── */}
      <div style={{
        position: 'relative',
        opacity:   isEnter ? 0 : 1,
        transform: isEnter
          ? 'scale(0.5) translateY(24px)'
          : isExit
          ? 'scale(1.05) translateY(-6px)'
          : 'scale(1) translateY(0)',
        transition: 'opacity 0.7s cubic-bezier(0.34,1.56,0.64,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        marginBottom: 32,
      }}>
        {/* Glow ring */}
        <div style={{
          position: 'absolute', inset: -20, borderRadius: 24,
          background: 'rgba(26,86,219,0.10)',
          border: '1.5px solid rgba(26,86,219,0.25)',
          boxShadow: showText
            ? '0 0 55px 12px rgba(26,86,219,0.25), 0 0 110px 30px rgba(26,86,219,0.08)'
            : '0 0 0 transparent',
          transition: 'box-shadow 1s ease 0.3s',
        }} />

        <img
          src="/logo.jpeg"
          alt="Bharat Enterprises"
          style={{
            height: 130,
            width: 'auto',
            objectFit: 'contain',
            position: 'relative',
            zIndex: 2,
            filter: 'drop-shadow(0 8px 28px rgba(26,86,219,0.4)) drop-shadow(0 2px 8px rgba(0,0,0,0.55))',
          }}
        />
      </div>

      {/* ── Welcome Text ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity:   showText ? 1 : 0,
        transform: showText ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        marginBottom: 36,
      }}>
        {/* "WELCOME TO" badge */}
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(147,197,253,0.8)',
          marginBottom: 4,
        }}>
          Welcome to
        </span>

        {/* Brand name */}
        <h1 style={{
          margin: 0,
          fontSize: 'clamp(22px, 5vw, 30px)',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.15,
        }}>
          Bharat Enterprises
        </h1>

        {/* Divider with subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <span style={{ height: 1, width: 36, background: 'rgba(26,86,219,0.5)' }} />
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(147,197,253,0.6)',
          }}>
            Finance Services
          </span>
          <span style={{ height: 1, width: 36, background: 'rgba(26,86,219,0.5)' }} />
        </div>
      </div>

      {/* ── Loading bar ── */}
      <div style={{
        width: 220,
        opacity:   showLoad ? 1 : 0,
        transform: showLoad ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}>
        {/* Track */}
        <div style={{
          width: '100%',
          height: 3,
          borderRadius: 99,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}>
          {/* Fill */}
          <div style={{
            height: '100%',
            borderRadius: 99,
            background: 'linear-gradient(90deg, #1a56db, #60a5fa, #f59e0b)',
            width: showLoad ? '100%' : '0%',
            transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>

        {/* Animated dots label */}
        <LoadingDots />
      </div>

      {/* Shimmer particles */}
      {showText && [
        { top: '36%', left: '37%', delay: '0s',    size: 2.5 },
        { top: '60%', left: '56%', delay: '0.25s', size: 2 },
        { top: '42%', left: '62%', delay: '0.45s', size: 2 },
        { top: '57%', left: '40%', delay: '0.15s', size: 1.5 },
        { top: '50%', left: '30%', delay: '0.35s', size: 1.5 },
        { top: '46%', left: '68%', delay: '0.2s',  size: 2 },
      ].map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: p.top, left: p.left,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: 'rgba(200,220,255,0.65)',
          animation: `be-float 2.4s ease-in-out ${p.delay} infinite alternate`,
          pointerEvents: 'none',
        }} />
      ))}

      <style>{`
        @keyframes be-float {
          0%   { opacity: 0.15; transform: translateY(0)   scale(1);   }
          100% { opacity: 1;    transform: translateY(-8px) scale(1.7); }
        }
      `}</style>
    </div>
  );
};

/* Animated "Loading..." dots */
const LoadingDots: React.FC = () => {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const id = setInterval(() =>
      setDots(d => (d.length >= 3 ? '' : d + '.')), 380
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'rgba(96,165,250,0.65)',
      fontFamily: 'monospace',
      minWidth: 80,
      textAlign: 'center',
    }}>
      Loading{dots}
    </span>
  );
};
