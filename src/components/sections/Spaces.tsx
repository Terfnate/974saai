import Link from 'next/link';
import { SPACES } from '@/content/content';
import { Box } from '../ui';

/** The four pavilion types on a container train; pinned and scrolled sideways on desktop. */
export function Spaces() {
  return (
    <section className="train" id="spaces" aria-labelledby="sp-h" data-train>
      <div className="train__track" data-track>
        <header className="train__intro">
          <p className="kicker kicker--dark">The spaces</p>
          <h2 id="sp-h">One container. Four ways to use it.</h2>
          <p>Every unit comes from Stadium 974 and arrives serviced, themed and ready to open.</p>
          <Link className="link-arrow link-arrow--dark" href="/reservations#map">Explore the site map <span aria-hidden="true">→</span></Link>
        </header>
        {SPACES.map((s) => (
          <article key={s.key} className="car" data-card aria-labelledby={`sp-${s.key}`}>
            <Box tone={s.tone} className={`car__box car__box--${s.key}`}>
              <span className="car__awning" aria-hidden="true" />
              <h3 id={`sp-${s.key}`} className="car__name">{s.name}</h3>
            </Box>
            <p className="car__who">{s.who}</p>
            <p className="car__body">{s.body}</p>
            <ul role="list" className="car__has">{s.has.map((h) => <li key={h}>{h}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}
