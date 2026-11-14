import { STORY } from '@/content/content';
import { SectionHead } from '../ui';

export function Story() {
  return (
    <section className="sec sec--concrete" id="why" aria-labelledby="why-h">
      <div className="wrap story">
        <SectionHead id="why-h" kicker={STORY.kicker} title={STORY.heading} />
        <ul role="list" className="story__list">
          {STORY.points.map((s) => (
            <li key={s.h} data-rise>
              <span className="story__rule" data-rule aria-hidden="true" />
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
