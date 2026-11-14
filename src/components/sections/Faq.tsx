import { FAQ } from '@/content/content';
import { SectionHead } from '../ui';

export function Faq() {
  return (
    <section className="sec sec--concrete" id="faq" aria-labelledby="faq-h">
      <div className="wrap faq">
        <SectionHead id="faq-h" kicker="FAQ" title="Questions we get asked." />
        <div className="faq__list" data-rise>
          {FAQ.map((f) => (
            <details key={f.q} className="faq__item">
              <summary>{f.q}<span className="faq__plus" aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
