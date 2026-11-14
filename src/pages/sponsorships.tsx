import { SPONSOR } from '@/content/content';
import { Layout, PageHero } from '@/components/Layout';
import { PreviewForm, Field, Chips } from '@/components/PreviewForm';

export default function Sponsorships() {
  return (
    <Layout title={SPONSOR.title} description={SPONSOR.lead}>
      <PageHero kicker={SPONSOR.kicker} h1={SPONSOR.h1} lead={SPONSOR.lead} />

      <section className="sec sec--concrete" aria-labelledby="why-sp">
        <div className="wrap">
          <h2 id="why-sp" className="sr">What sponsors get</h2>
          <ul role="list" className="trio">
            {SPONSOR.why.map((w) => (
              <li key={w.h} data-rise><span className="story__rule" data-rule aria-hidden="true" /><h3>{w.h}</h3><p>{w.p}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec sec--steel" aria-labelledby="sp-form">
        <div className="wrap enq">
          <header className="sec-head sec-head--dark" data-rise>
            <p className="kicker kicker--dark">Sponsor enquiry</p>
            <h2 id="sp-form">Let’s talk.</h2>
            <p className="sec-head__lead">Tell us about your brand and what you have in mind. We’ll come back with options.</p>
          </header>
          <div data-rise>
            <PreviewForm label="Sponsor enquiry" submit="Send enquiry" preview={SPONSOR.preview}>
              <Chips legend="Interested in" name="interest" options={SPONSOR.interests} type="checkbox" />
              <div className="form__row">
                <Field label="Company"><input name="company" autoComplete="organization" required /></Field>
                <Field label="Your name"><input name="name" autoComplete="name" required /></Field>
              </div>
              <div className="form__row">
                <Field label="Email"><input name="email" type="email" autoComplete="email" required /></Field>
                <Field label="Phone" hint="(optional)"><input name="phone" type="tel" autoComplete="tel" /></Field>
              </div>
              <Field label="Message"><textarea name="message" rows={4} required placeholder="Which event, and what you’d like to achieve…" /></Field>
            </PreviewForm>
          </div>
        </div>
      </section>
    </Layout>
  );
}
