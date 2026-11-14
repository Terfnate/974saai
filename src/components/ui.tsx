import type { CSSProperties, ReactNode } from 'react';

export type Tone = 'red' | 'blue' | 'sand' | 'green' | 'steel';

/** A shipping container seen from the side: corrugated ribs, door end with locking bars. Pure CSS. */
export function Box({ tone, className = '', style, children }: { tone: Tone; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div className={`box box--${tone} ${className}`} style={style} data-box>
      {children}
    </div>
  );
}

export function SectionHead({ id, kicker, title, lead, dark = false }: { id: string; kicker: string; title: string; lead?: string; dark?: boolean }) {
  return (
    <header className={`sec-head${dark ? ' sec-head--dark' : ''}`} data-rise>
      <p className="kicker">{kicker}</p>
      <h2 id={id}>{title}</h2>
      {lead ? <p className="sec-head__lead">{lead}</p> : null}
    </header>
  );
}

export const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, ''));
