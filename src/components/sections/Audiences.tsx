import { AUDIENCES } from '@/content/content';
import { SectionHead } from '../ui';

export function Audiences() {
  return (
    <section className="sec sec--concrete" id="for" aria-labelledby="for-h">
      <div className="wrap">
        <SectionHead id="for-h" kicker="Who it’s for" title="Something for everyone at the festival." />
        <ul role="list" className="aud">
          {AUDIENCES.map((a) => (
            <li key={a.key} className="aud__row" data-rise>
              <h3 className="aud__name">{a.name}</h3>
              <p className="aud__get">{a.get}</p>
              <ul role="list" className="aud__support">{a.support.map((s) => <li key={s}>{s}</li>)}</ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
