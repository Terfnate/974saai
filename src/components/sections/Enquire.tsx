import { useState, type FormEvent } from 'react';
import { ENQUIRE } from '@/content/content';

/** Enquiry form. There is no real inbox yet, so submitting validates and shows a preview notice. */
export function Enquire() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setSent(true);
  };
  return (
    <section className="sec sec--steel" id="enquire" aria-labelledby="enq-h">
      <div className="wrap enq">
        <header className="sec-head sec-head--dark" data-rise>
          <p className="kicker kicker--dark">Enquire</p>
          <h2 id="enq-h">{ENQUIRE.heading}</h2>
          <p className="sec-head__lead">{ENQUIRE.lead}</p>
        </header>
        <form className="form" onSubmit={onSubmit} noValidate data-rise>
          <fieldset className="form__roles">
            <legend>I am a</legend>
            {ENQUIRE.roles.map((r, i) => (
              <label key={r} className="chip">
                <input type="radio" name="role" value={r} defaultChecked={i === 0} />
                <span>{r}</span>
              </label>
            ))}
          </fieldset>
          <div className="form__row">
            <label className="field"><span>Name</span><input name="name" autoComplete="name" required /></label>
            <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
          </div>
          <label className="field"><span>What do you need?</span><textarea name="message" rows={4} required placeholder="Number of units, dates, kiosk type…" /></label>
          <input type="text" name="company_site" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
          <div className="form__foot">
            <button className="btn btn--primary" type="submit">Send enquiry</button>
            <p className="form__status" role="status">{sent ? ENQUIRE.preview : ''}</p>
          </div>
        </form>
      </div>
    </section>
  );
}
