import { VISITORS } from '@/content/content';
import { Layout, PageHero } from '@/components/Layout';
import { PreviewForm, Field, Chips } from '@/components/PreviewForm';

export default function Visitors() {
  return (
    <Layout title={VISITORS.title} description={VISITORS.lead}>
      <PageHero kicker={VISITORS.kicker} h1={VISITORS.h1} lead={VISITORS.lead}>
        <div className="hero__ctas" data-hero-fade>
          <a className="btn btn--primary" href="#feedback">Report a problem</a>
        </div>
      </PageHero>

      <section className="sec sec--concrete" aria-labelledby="find-h">
        <div className="wrap story">
          <header className="sec-head" data-rise><p className="kicker">On site</p><h2 id="find-h">What you’ll find.</h2></header>
          <ul role="list" className="story__list">
            {VISITORS.find.map((f) => (
              <li key={f.h} data-rise><span className="story__rule" data-rule aria-hidden="true" /><h3>{f.h}</h3><p>{f.p}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec sec--steel" id="feedback" aria-labelledby="fb-h">
        <div className="wrap enq">
          <header className="sec-head sec-head--dark" data-rise>
            <p className="kicker kicker--dark">Complaints and feedback</p>
            <h2 id="fb-h">Something not right? Tell us.</h2>
            <p className="sec-head__lead">Complaints, feedback and ideas all go to the team on site.</p>
            <ul role="list" className="after">{VISITORS.after.map((a) => <li key={a}>{a}</li>)}</ul>
          </header>
          <div data-rise>
            <PreviewForm label="Complaint or feedback" submit="Send" preview={VISITORS.preview}>
              <Chips legend="This is a" name="type" options={VISITORS.types} />
              <div className="form__row">
                <Field label="Where?">
                  <select name="area" required defaultValue="">
                    <option value="" disabled>Choose an area</option>
                    {VISITORS.areas.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </Field>
                <Field label="When?"><input name="date" type="date" required /></Field>
              </div>
              <fieldset className="rating">
                <legend>How was your visit? <em>(optional)</em></legend>
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="chip"><input type="radio" name="rating" value={n} /><span>{n}</span></label>
                ))}
              </fieldset>
              <Field label="What happened?"><textarea name="message" rows={4} required /></Field>
              <Field label="Email" hint="(optional, if you want a reply)"><input name="email" type="email" autoComplete="email" /></Field>
            </PreviewForm>
          </div>
        </div>
      </section>
    </Layout>
  );
}
