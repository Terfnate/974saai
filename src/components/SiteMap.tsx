import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { UNITS, UNIT_TYPES, ZONES, SITE_NOTE, type Unit, type UnitType, type Zone } from '@/content/site-plan';
import type { MapHandle } from './three/SiteMap3D';

// three.js loads only on the reservations page, after first paint.
const SiteMap3D = dynamic(() => import('./three/SiteMap3D'), { ssr: false });

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

const TYPES = Object.keys(UNIT_TYPES) as UnitType[];

/** Pick units on a 3D map of the event ground, or in the list below it. Both views share `selected`. */
export function SiteMap({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<MapHandle | null>(null);
  const [types, setTypes] = useState<Set<UnitType>>(() => new Set(TYPES));
  const [freeOnly, setFreeOnly] = useState(false);
  const [env, setEnv] = useState({ webgl: false, still: false, drag: false, checked: false });
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const el = box.current!;
    const io = new IntersectionObserver(([e]) => {
      setEnv((v) => (v.checked ? v : { webgl: hasWebGL(), still: matchMedia('(prefers-reduced-motion: reduce)').matches, drag: matchMedia('(pointer: fine)').matches, checked: true }));
      setRunning(e.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const visible = (u: Unit) => types.has(u.type) && (!freeOnly || !u.booked);
  const free = UNITS.filter((u) => !u.booked).length;
  const toggleType = (t: UnitType) => setTypes((s) => {
    const n = new Set(s);
    if (n.has(t) && n.size > 1) n.delete(t); else n.add(t);
    return n;
  });
  const showList = env.checked && !env.webgl;

  return (
    <div className="sitemap" ref={box}>
      <p className="sample" role="note"><b>Sample data</b> {SITE_NOTE.replace(/^Sample layout and bookings\. /, '')}</p>

      <div className="filters">
        <fieldset className="evs">
          <legend className="sr">Show unit types</legend>
          {TYPES.map((t) => (
            <label key={t} className="evs__opt">
              <input type="checkbox" checked={types.has(t)} onChange={() => toggleType(t)} />
              <span><i style={{ background: UNIT_TYPES[t].color }} />{UNIT_TYPES[t].name}</span>
            </label>
          ))}
        </fieldset>
        <label className="switch">
          <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} />
          <span>Available only <small>({free} of {UNITS.length})</small></span>
        </label>
      </div>

      {!showList ? (
        <div className={`sitemap__stage${ready ? ' is-ready' : ''}`}>
          {env.checked && env.webgl ? (
            <SiteMap3D selected={selected} visible={visible} onPick={(u) => onToggle(u.id)} onReady={() => setReady(true)} still={env.still} running={running} api={api} drag={env.drag} />
          ) : null}
          {!ready ? <p className="sitemap__loading">Loading the site map…</p> : null}
          <div className="sitemap__legend" aria-hidden="true">
            <span><i className="sw sw--free" />Available</span>
            <span><i className="sw sw--booked" />Booked</span>
            <span><i className="sw sw--sel" />Your selection</span>
          </div>
          <div className="sitemap__ctrl" role="group" aria-label="Map view">
            <button type="button" onClick={() => api.current?.rotate(-1)} aria-label="Rotate left">⟲</button>
            <button type="button" onClick={() => api.current?.rotate(1)} aria-label="Rotate right">⟳</button>
            <button type="button" onClick={() => api.current?.zoom(1)} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => api.current?.zoom(-1)} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => api.current?.reset()} aria-label="Reset view">Reset</button>
          </div>
        </div>
      ) : null}

      <details className="sitemap__list" open={showList || undefined}>
        <summary>List view <small>(keyboard and screen readers)</small></summary>
        {(Object.keys(ZONES) as Zone[]).map((z) => {
          const us = UNITS.filter((u) => u.zone === z && visible(u));
          if (!us.length) return null;
          return (
            <fieldset key={z} className="zone">
              <legend>{ZONES[z].name}</legend>
              {us.map((u) => (
                <label key={u.id} className={`zone__unit${u.booked ? ' is-booked' : ''}`}>
                  <input type="checkbox" checked={selected.includes(u.id)} disabled={u.booked} onChange={() => onToggle(u.id)} />
                  <span className="zone__id">{u.id}</span>
                  <span>{UNIT_TYPES[u.type].name}</span>
                  <span className="zone__st">{u.booked ? 'Booked' : selected.includes(u.id) ? 'Selected' : 'Available'}</span>
                </label>
              ))}
            </fieldset>
          );
        })}
      </details>
    </div>
  );
}
