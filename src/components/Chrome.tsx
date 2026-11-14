import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NAV, BRAND } from '@/content/content';
import { NavLink } from './NavLink';

/** Fixed top bar: project mark, section links on desktop, a full-screen menu on mobile. */
export function Chrome() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = btn.current;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    document.querySelector<HTMLAnchorElement>('#menu a')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => { removeEventListener('keydown', onKey); lenis?.start(); opener?.focus(); };
  }, [open]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="chrome">
        <Link className="chrome__mark" href="/" aria-label={`${BRAND.name}, home`}>
          <span className="chrome__974">974</span>
          <span>Pavilions</span>
        </Link>
        <nav className="chrome__nav" aria-label="Sections">
          <ul role="list">{NAV.map(([l, h]) => <li key={h}><NavLink href={h}>{l}</NavLink></li>)}</ul>
        </nav>
        <Link className="btn btn--primary btn--sm chrome__cta" href="/reservations">Reserve</Link>
        <button ref={btn} className="chrome__menu" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>
          <span className="sr">Menu</span>
        </button>
      </header>
      {open && (
        <div className="menu" id="menu" role="dialog" aria-modal="true" aria-label="Sections"
          onClick={(e) => { if (e.target === e.currentTarget || (e.target as Element).closest('a')) setOpen(false); }}>
          <button className="chrome__menu menu__close" type="button" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            <span className="sr">Close menu</span>
          </button>
          <ul role="list">{NAV.map(([l, h]) => <li key={h}><NavLink href={h}>{l}</NavLink></li>)}</ul>
        </div>
      )}
    </>
  );
}
