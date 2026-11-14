import Link from 'next/link';
import { HERO } from '@/content/content';
import { Box, type Tone } from '../ui';

// A stadium-style stack in a 100 × 60 unit box. 40 ft = 46 wide, 20 ft = 22 wide, 11 high (+1 gap).
// Listed bottom row first: the intro cranes them in in this order and the scroll lifts them off in reverse.
const STACK: { x: number; y: number; w: number; tone: Tone }[] = [
  { x: 0, y: 0, w: 46, tone: 'red' }, { x: 48, y: 0, w: 46, tone: 'blue' },
  { x: 4, y: 12, w: 22, tone: 'sand' }, { x: 28, y: 12, w: 46, tone: 'steel' }, { x: 76, y: 12, w: 22, tone: 'green' },
  { x: 10, y: 24, w: 46, tone: 'blue' }, { x: 58, y: 24, w: 22, tone: 'red' },
  { x: 22, y: 36, w: 22, tone: 'green' }, { x: 46, y: 36, w: 46, tone: 'sand' },
  { x: 34, y: 48, w: 46, tone: 'red' },
];

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-h" data-hero>
      <div className="hero__copy" data-hero-copy>
        <p className="kicker kicker--dark" data-hero-fade>{HERO.kicker}</p>
        <h1 id="hero-h" className="hero__h">
          {HERO.h1.map((l) => <span key={l} className="mask"><span data-hero-line>{l}</span></span>)}
        </h1>
        <p className="hero__lead" data-hero-fade>{HERO.lead}</p>
        <div className="hero__ctas" data-hero-fade>
          {HERO.ctas.map((c) => <Link key={c.label} className={`btn btn--${c.kind}`} href={c.href}>{c.label}</Link>)}
        </div>
      </div>
      <div className="stack" data-stack aria-hidden="true">
        {STACK.map((b, i) => (
          <div key={i} className="stack__slot" data-slot
            style={{ left: `${b.x}%`, bottom: `${(b.y / 60) * 100}%`, width: `${b.w}%`, height: `${(11 / 60) * 100}%` }}>
            <Box tone={b.tone} className={b.w < 30 ? 'box--20' : ''} />
          </div>
        ))}
        <div className="stack__ground" />
      </div>
      <p className="hero__scroll" data-hero-fade aria-hidden="true">Scroll</p>
    </section>
  );
}
