import Head from 'next/head';
import type { ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { BRAND } from '@/content/content';
import { startMotion } from '@/lib/motion';
import { Chrome } from './Chrome';
import { Footer } from './sections/Footer';

/** Shared page frame: head tags, header, footer, and the motion layer. */
export function Layout({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  useGSAP(() => startMotion(), []);
  const full = `${title} · ${BRAND.name}`;
  return (
    <>
      <Head>
        <title>{full}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={full} />
        <meta property="og:description" content={description} />
        <meta name="robots" content="noindex" />
      </Head>
      <Chrome />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

/** Hero for inner pages: big title on steel, a row of containers along the bottom edge. */
export function PageHero({ kicker, h1, lead, children }: { kicker: string; h1: string[]; lead: string; children?: ReactNode }) {
  return (
    <section className="phero" aria-labelledby="page-h">
      <div className="wrap">
        <p className="kicker kicker--dark" data-hero-fade>{kicker}</p>
        <h1 id="page-h" className="phero__h">
          {h1.map((l) => <span key={l} className="mask"><span data-hero-line>{l}</span></span>)}
        </h1>
        <p className="phero__lead" data-hero-fade>{lead}</p>
        {children}
      </div>
      <div className="phero__yard" aria-hidden="true">
        {(['red', 'blue', 'sand', 'green', 'steel', 'red', 'blue'] as const).map((t, i) => (
          <span key={i} className={`box box--${t}${i % 3 === 1 ? ' box--20' : ''}`} data-box />
        ))}
      </div>
    </section>
  );
}
