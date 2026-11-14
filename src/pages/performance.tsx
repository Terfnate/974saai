import { useRef, useState } from 'react';
import { PERFORMANCE } from '@/content/content';
import { CONTAINERS, EVENTS, EVENT_DAYS, type ContainerRow, type Condition } from '@/content/performance-sample';
import { Layout, PageHero } from '@/components/Layout';

type MetricKey = 'solar' | 'occupancy' | 'rating' | 'complaints' | 'issues';
type Metric = {
  key: MetricKey; label: string; axis: string; unit: string; better: 'higher' | 'lower'; agg: 'sum' | 'mean'; fixedMax?: number; dp: number;
  get: (c: ContainerRow, e: number) => number | null; kpi: string;
};

const METRICS: Metric[] = [
  { key: 'solar', label: 'Solar energy', axis: 'Energy generated per container (kWh)', unit: ' kWh', better: 'higher', agg: 'sum', dp: 0,
    get: (c, e) => c.solarKwh[e], kpi: 'generated across all containers' },
  { key: 'occupancy', label: 'Occupancy', axis: 'Days in use, as a share of the event (%)', unit: '%', better: 'higher', agg: 'mean', fixedMax: 100, dp: 0,
    get: (c, e) => Math.round((c.bookedDays[e] / EVENT_DAYS) * 100), kpi: 'average occupancy' },
  { key: 'rating', label: 'Visitor rating', axis: 'Average visitor rating (out of 5)', unit: ' / 5', better: 'higher', agg: 'mean', fixedMax: 5, dp: 1,
    get: (c, e) => c.rating[e], kpi: 'average rating' },
  { key: 'complaints', label: 'Complaints', axis: 'Complaints received per container', unit: '', better: 'lower', agg: 'sum', dp: 0,
    get: (c, e) => c.complaints[e], kpi: 'complaints in total' },
  { key: 'issues', label: 'Maintenance', axis: 'Maintenance issues logged per container', unit: '', better: 'lower', agg: 'sum', dp: 0,
    get: (c, e) => c.issues[e], kpi: 'maintenance issues' },
];

const fmt = (v: number, dp: number) => v.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });
function aggregate(m: Metric, e: number) {
  const vals = CONTAINERS.map((c) => m.get(c, e)).filter((v): v is number => v !== null);
  const sum = vals.reduce((a, b) => a + b, 0);
  return m.agg === 'sum' ? sum : sum / vals.length;
}
function niceMax(v: number) {
  const p = 10 ** Math.floor(Math.log10(v));
  return [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((s) => s * p).find((s) => s >= v) ?? v;
}

const STATUS: Record<Condition, { cls: string; icon: string }> = {
  'Good': { cls: 'good', icon: '✓' },
  'Fair': { cls: 'warn', icon: '!' },
  'Needs repair': { cls: 'crit', icon: '✕' },
};

export default function Performance() {
  const [mk, setMk] = useState<MetricKey>('solar');
  const [on, setOn] = useState<boolean[]>(EVENTS.map(() => true));
  const [tip, setTip] = useState<{ c: number; e: number; x: number; y: number } | null>(null);
  const plot = useRef<HTMLDivElement>(null);
  const m = METRICS.find((x) => x.key === mk)!;
  // Anchor the tooltip to the centre of the hovered or focused bar slot.
  const show = (el: HTMLElement, c: number, e: number, v: number | null) => {
    const r = el.getBoundingClientRect(); const p = plot.current!.getBoundingClientRect();
    setTip({ c, e, x: r.left - p.left + r.width / 2, y: v === null ? 0 : (v / max) * 100 });
  };
  const shown = EVENTS.map((_, i) => i).filter((i) => on[i]);

  const max = m.fixedMax ?? niceMax(Math.max(...CONTAINERS.flatMap((c) => EVENTS.map((_, e) => m.get(c, e) ?? 0))) * 1.05);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

  const toggle = (i: number) => setOn((o) => (o.filter(Boolean).length === 1 && o[i] ? o : o.map((v, j) => (j === i ? !v : v))));

  return (
    <Layout title={PERFORMANCE.title} description={PERFORMANCE.lead}>
      <PageHero kicker={PERFORMANCE.kicker} h1={PERFORMANCE.h1} lead={PERFORMANCE.lead} />

      <section className="sec sec--white perf" aria-labelledby="perf-h">
        <div className="wrap">
          <p className="sample" role="note"><b>Sample data</b> {PERFORMANCE.sampleNote.replace(/^Sample data\. /, '')}</p>

          <h2 id="perf-h" className="sr">Container performance dashboard</h2>
          <div className="filters">
            <div className="seg" role="radiogroup" aria-label="Measure">
              {METRICS.map((x) => (
                <label key={x.key} className="seg__opt">
                  <input type="radio" name="metric" checked={mk === x.key} onChange={() => { setMk(x.key); setTip(null); }} />
                  <span>{x.label}</span>
                </label>
              ))}
            </div>
            <fieldset className="evs">
              <legend className="sr">Events to compare</legend>
              {EVENTS.map((ev, i) => (
                <label key={ev.id} className="evs__opt">
                  <input type="checkbox" checked={on[i]} onChange={() => toggle(i)} />
                  <span><i style={{ background: ev.color }} />{ev.name}</span>
                </label>
              ))}
            </fieldset>
          </div>

          <ul role="list" className="kpis">
            {shown.map((e) => {
              const v = aggregate(m, e);
              const prev = e > 0 ? aggregate(m, e - 1) : null;
              const d = prev !== null ? v - prev : null;
              const good = d !== null && d !== 0 && (d > 0) === (m.better === 'higher');
              return (
                <li key={e} className="kpi">
                  <p className="kpi__ev"><i style={{ background: EVENTS[e].color }} />{EVENTS[e].name}</p>
                  <p className="kpi__v">{fmt(v, m.dp)}<small>{m.unit}</small></p>
                  <p className="kpi__l">{m.kpi}</p>
                  <p className="kpi__d">
                    {d === null ? 'First event' : d === 0 ? `No change vs ${EVENTS[e - 1].name}` :
                      <>{d > 0 ? '▲' : '▼'} {fmt(Math.abs(d), m.dp)}{m.unit} vs {EVENTS[e - 1].name} · <span className={good ? 'is-better' : 'is-worse'}>{good ? 'better' : 'worse'}</span></>}
                  </p>
                </li>
              );
            })}
          </ul>

          <figure className="chart" aria-labelledby="chart-cap">
            <figcaption id="chart-cap" className="chart__cap">
              <span className="chart__title">{m.axis}</span>
              <span className="legend">
                {shown.map((e) => <span key={e}><i className="legend__sw" style={{ background: EVENTS[e].color }} />{EVENTS[e].name}</span>)}
              </span>
            </figcaption>
            <div className="chart__plot" ref={plot} onPointerLeave={() => setTip(null)}>
              <div className="chart__grid" aria-hidden="true">
                {ticks.map((t) => <span key={t} style={{ bottom: `${(t / max) * 100}%` }}><b>{fmt(t, m.fixedMax === 5 ? 1 : 0)}</b></span>)}
              </div>
              <div className="chart__groups">
                {CONTAINERS.map((c, ci) => (
                  <div key={c.id} className="chart__group">
                    <div className="chart__bars">
                      {shown.map((e) => {
                        const v = m.get(c, e);
                        const label = `${EVENTS[e].name}, ${c.id} ${c.type}: ${v === null ? 'not measured' : fmt(v, m.dp) + m.unit}`;
                        return (
                          <div key={e} className="chart__hit" tabIndex={0} role="img" aria-label={label}
                            onPointerEnter={(ev) => show(ev.currentTarget, ci, e, v)}
                            onFocus={(ev) => show(ev.currentTarget, ci, e, v)}
                            onBlur={() => setTip(null)}>
                            {v === null
                              ? <span className="chart__na">n/a</span>
                              : <span className={`chart__bar${tip && tip.c === ci && tip.e === e ? ' is-hot' : ''}`} style={{ height: `${(v / max) * 100}%`, background: EVENTS[e].color }} />}
                          </div>
                        );
                      })}
                    </div>
                    <span className="chart__x"><b>{c.id}</b>{c.type}</span>
                  </div>
                ))}
              </div>
              {tip ? (() => {
                const c = CONTAINERS[tip.c]; const v = m.get(c, tip.e);
                return (
                  <div className="tip" style={{ left: tip.x, bottom: `calc(${tip.y}% + 12px)` }} aria-hidden="true">
                    <b>{v === null ? 'Not measured' : fmt(v, m.dp) + m.unit}</b>
                    <span><i style={{ background: EVENTS[tip.e].color }} />{EVENTS[tip.e].name} · {c.id} {c.type}</span>
                  </div>
                );
              })() : null}
            </div>
          </figure>

          <details className="table-wrap" open>
            <summary>Table view</summary>
            <div className="table-scroll" tabIndex={0} role="region" aria-label={`${m.label} by container and event`}>
              <table className="ptable">
                <thead>
                  <tr>
                    <th scope="col">Container</th><th scope="col">Type</th>
                    {EVENTS.map((ev) => <th key={ev.id} scope="col" className="num">{ev.name}</th>)}
                    <th scope="col">Condition now</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTAINERS.map((c) => (
                    <tr key={c.id}>
                      <th scope="row">{c.id}</th><td>{c.type}</td>
                      {EVENTS.map((ev, e) => { const v = m.get(c, e); return <td key={ev.id} className="num">{v === null ? '–' : fmt(v, m.dp)}</td>; })}
                      <td><span className={`status status--${STATUS[c.condition].cls}`}><span aria-hidden="true">{STATUS[c.condition].icon}</span>{c.condition}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note">Units: {m.axis.toLowerCase()}. Operations spaces are staff-only, so they have no visitor rating or complaints.</p>
          </details>
        </div>
      </section>
    </Layout>
  );
}
