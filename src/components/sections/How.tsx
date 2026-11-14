import { STEPS } from '@/content/content';
import { Box } from '../ui';

/** Five steps on a rail; a container rides along it as you scroll (motion.ts). */
export function How() {
  return (
    <section className="sec sec--steel how" id="how" aria-labelledby="how-h" data-how>
      <div className="wrap">
        <header className="sec-head sec-head--dark" data-rise>
          <p className="kicker kicker--dark">How it works</p>
          <h2 id="how-h">From the stadium to your site, and back.</h2>
        </header>
        <div className="how__rail" aria-hidden="true">
          <span className="how__line" />
          <span className="how__fill" data-how-fill />
          <span className="how__rider" data-how-rider><Box tone="red" className="box--20" /></span>
        </div>
        <ol className="how__steps" role="list">
          {STEPS.map((s, i) => (
            <li key={s.h} data-rise>
              <span className="how__n">Step {i + 1}</span>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
