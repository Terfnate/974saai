import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// three.js only ships when this section is near the viewport.
const Container3D = dynamic(() => import('./Container3D'), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

/**
 * Shows `fallback` (the SVG drawing) until the 3D pavilion is ready, then cross-fades to it.
 * Without WebGL the fallback stays. Scroll progress through the stage (0 → 1) assembles the model.
 */
export function Stage({ fallback }: { fallback: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const prog = useRef(0);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState({ interactive: false, still: false });

  useEffect(() => {
    const el = box.current!;
    if (!hasWebGL()) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setMode({ interactive: matchMedia('(pointer: fine)').matches, still });
      setMount(true);
      io.disconnect();
    }, { rootMargin: '600px 0px' });
    io.observe(el);
    if (still) { prog.current = 1; return () => io.disconnect(); }
    const st = ScrollTrigger.create({ trigger: el, start: 'top 75%', end: 'bottom 35%', onUpdate: (s) => { prog.current = s.progress; } });
    return () => { io.disconnect(); st.kill(); };
  }, []);

  return (
    <div ref={box} className={`stage${ready ? ' is-3d' : ''}`}>
      <div className="stage__fallback">{fallback}</div>
      {mount ? (
        <div className="stage__canvas" aria-hidden="true">
          <Container3D prog={prog} interactive={mode.interactive} still={mode.still} onReady={() => setReady(true)} />
        </div>
      ) : null}
      {ready && mode.interactive ? <p className="stage__hint" aria-hidden="true">Drag to turn it around</p> : null}
    </div>
  );
}
