import { useState } from 'react';
import { RESERVE } from '@/content/content';
import { UNITS, UNIT_TYPES, ZONES } from '@/content/site-plan';
import { Layout, PageHero } from '@/components/Layout';
import { PreviewForm, Field, Chips } from '@/components/PreviewForm';
import { SiteMap } from '@/components/SiteMap';

export default function Reservations() {
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const picked = UNITS.filter((u) => sel.includes(u.id));

  return (
    <Layout title={RESERVE.title} description={RESERVE.lead}>
      <PageHero kicker={RESERVE.kicker} h1={RESERVE.h1} lead={RESERVE.lead}>
        <div className="hero__ctas" data-hero-fade><a className="btn btn--primary" href="#map">Open the site map</a></div>
      </PageHero>

      <section className="sec sec--white sec--tight" id="map" aria-labelledby="map-h">
        <div className="wrap">
          <header className="sec-head">
            <p className="kicker">Step 1</p>
            <h2 id="map-h">Pick your spots.</h2>
            <p className="sec-head__lead">Click a free kiosk or pavilion to add it. Grey units are already booked. Drag to look around, or use the buttons. You can also pick from the list.</p>
          </header>
          <SiteMap selected={sel} onToggle={toggle} />
        </div>
      </section>

      <section className="sec sec--concrete" aria-labelledby="res-h">
        <div className="wrap res">
          <PreviewForm label="Reservation request" submit="Request a quote" preview={RESERVE.preview} className="form--light res__form"
            check={() => (sel.length === 0 ? 'Pick at least one free unit on the map or in the list.' : null)}>
            <input type="hidden" name="units" value={sel.join(',')} />
            <h2 id="res-h" className="res__h">2. Add services</h2>
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
            {picked.length === 0 ? <p className="summary__empty">No units yet. <a href="#map">Pick them on the map.</a></p> : (
              <ul role="list" className="summary__list">
                {picked.map((u) => (
                  <li key={u.id}>
                    <span><i className="summary__sw" style={{ background: UNIT_TYPES[u.type].color }} /><b>{u.id}</b> {UNIT_TYPES[u.type].name}<small>{ZONES[u.zone].name}</small></span>
                    <button type="button" className="summary__x" onClick={() => toggle(u.id)} aria-label={`Remove ${u.id}`}>×</button>
                  </li>
                ))}
              </ul>
            )}
            <p className="summary__total"><span>Total units</span><b>{picked.length}</b></p>
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
