import { CIRCLE } from '@/content/content';

export function Circle() {
  return (
    <section className="sec sec--red circle" aria-labelledby="circle-h">
      <div className="wrap circle__inner">
        <h2 id="circle-h" className="circle__h" data-rise>{CIRCLE.heading}</h2>
        <div data-rise>
          <p className="circle__lead">{CIRCLE.lead}</p>
          <ul role="list" className="circle__lines">{CIRCLE.lines.map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
