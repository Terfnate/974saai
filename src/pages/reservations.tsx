import { useState } from 'react';
import { RESERVE, SPACES } from '@/content/content';
import { Layout, PageHero } from '@/components/Layout';
import { PreviewForm, Field, Chips } from '@/components/PreviewForm';
import { Box } from '@/components/ui';

export default function Reservations() {
  const [qty, setQty] = useState<Record<string, number>>(() => Object.fromEntries(SPACES.map((s) => [s.key, 0])));
  const total = Object.values(qty).reduce((a, b) => a + b, 0);
  const set = (k: string, d: number) => setQty((q) => ({ ...q, [k]: Math.max(0, Math.min(40, q[k] + d)) }));

  return (
    <Layout title={RESERVE.title} description={RESERVE.lead}>
      <PageHero kicker={RESERVE.kicker} h1={RESERVE.h1} lead={RESERVE.lead} />

      <section className="sec sec--concrete" aria-labelledby="res-h">
        <div className="wrap res">
          <PreviewForm label="Reservation request" submit="Request a quote" preview={RESERVE.preview} className="form--light res__form"
            check={() => (total === 0 ? 'Add at least one unit in step 1.' : null)}>
            <h2 id="res-h" className="res__h">1. Choose your units</h2>
            <ul role="list" className="units">
              {SPACES.map((s) => (
                <li key={s.key} className="unit">
                  <Box tone={s.tone} className="unit__box box--20" />
                  <div className="unit__text">
                    <h3>{s.name}</h3>
                    <p>{s.who}</p>
                  </div>
                  <div className="stepper" role="group" aria-label={`${s.name} quantity`}>
                    <button type="button" onClick={() => set(s.key, -1)} aria-label={`One fewer ${s.name}`} disabled={qty[s.key] === 0}>−</button>
                    <output aria-live="polite">{qty[s.key]}</output>
                    <button type="button" onClick={() => set(s.key, 1)} aria-label={`One more ${s.name}`}>+</button>
                  </div>
                  <input type="hidden" name={`qty_${s.key}`} value={qty[s.key]} />
                </li>
              ))}
            </ul>

            <h2 className="res__h">2. Add services</h2>
            <Chips legend="Optional extras" name="services" options={RESERVE.services} type="checkbox" />

            <h2 className="res__h">3. Your event</h2>
            <Chips legend="I am" name="role" options={['An event organiser', 'A vendor', 'A food operator']} />
            <Field label="Event name"><input name="event" required /></Field>
            <div className="form__row">
              <Field label="From"><input name="from" type="date" required /></Field>
              <Field label="To"><input name="to" type="date" required /></Field>
            </div>
            <Field label="Location"><input name="location" defaultValue="Darb Al Saai" required /></Field>

            <h2 className="res__h">4. Your details</h2>
            <div className="form__row">
              <Field label="Name"><input name="name" autoComplete="name" required /></Field>
              <Field label="Organisation" hint="(optional)"><input name="org" autoComplete="organization" /></Field>
            </div>
            <div className="form__row">
              <Field label="Email"><input name="email" type="email" autoComplete="email" required /></Field>
              <Field label="Phone" hint="(optional)"><input name="phone" type="tel" autoComplete="tel" /></Field>
            </div>
            <Field label="Anything else?" hint="(optional)"><textarea name="message" rows={3} /></Field>
          </PreviewForm>

          <aside className="summary" aria-label="Reservation summary">
            <h2 className="summary__h">Your request</h2>
            {total === 0 ? <p className="summary__empty">No units yet. Use + to add them.</p> : (
              <ul role="list" className="summary__list">
                {SPACES.filter((s) => qty[s.key] > 0).map((s) => (
                  <li key={s.key}><span>{s.name}</span><b>× {qty[s.key]}</b></li>
                ))}
              </ul>
            )}
            <p className="summary__total"><span>Total units</span><b>{total}</b></p>
            <p className="summary__note">{RESERVE.pricing}</p>
            <h3>Included with every unit</h3>
            <ul role="list" className="summary__inc">{RESERVE.included.map((i) => <li key={i}>{i}</li>)}</ul>
          </aside>
        </div>
      </section>

      <section className="sec sec--white" aria-labelledby="next-h">
        <div className="wrap">
          <header className="sec-head" data-rise><p className="kicker">After you send it</p><h2 id="next-h">What happens next.</h2></header>
          <ol role="list" className="next">
            {RESERVE.next.map((n, i) => (
              <li key={n.h} data-rise><span className="next__n">Step {i + 1}</span><h3>{n.h}</h3><p>{n.p}</p></li>
            ))}
          </ol>
        </div>
      </section>
    </Layout>
  );
}
