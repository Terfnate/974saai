import { OFFERS } from '@/content/content';
import Link from 'next/link';
import { SectionHead } from '../ui';

export function Offers() {
  return (
    <section className="sec sec--white" id="offers" aria-labelledby="off-h">
      <div className="wrap">
        <SectionHead id="off-h" kicker="Work with us" title="Rent it, run it, or put your name on it." />
        <ul role="list" className="offers">
          {OFFERS.map((o) => (
            <li key={o.h} className="offers__item" data-rise>
              <p className="offers__who">{o.who}</p>
              <h3>{o.h}</h3>
              <p>{o.p}</p>
              <Link className="link-arrow" href={o.href}>{o.cta} <span aria-hidden="true">→</span></Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
