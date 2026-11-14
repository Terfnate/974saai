import { BRAND, NAV } from '@/content/content';
import { NavLink } from '../NavLink';

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__inner">
        <div>
          <p className="foot__name">{BRAND.name}</p>
          <p className="foot__tag">{BRAND.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul role="list" className="foot__nav">
            {NAV.map(([l, h]) => <li key={h}><NavLink href={h}>{l}</NavLink></li>)}
            <li><NavLink href="/#faq">FAQ</NavLink></li>
          </ul>
        </nav>
      </div>
      <p className="wrap foot__legal">{BRAND.credit}</p>
    </footer>
  );
}
