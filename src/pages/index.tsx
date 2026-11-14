import { HERO } from '@/content/content';
import { Layout } from '@/components/Layout';
import { Hero } from '@/components/sections/Hero';
import { Story } from '@/components/sections/Story';
import { Spaces } from '@/components/sections/Spaces';
import { Inside } from '@/components/sections/Inside';
import { Audiences } from '@/components/sections/Audiences';
import { How } from '@/components/sections/How';
import { Circle } from '@/components/sections/Circle';
import { Offers } from '@/components/sections/Offers';
import { Faq } from '@/components/sections/Faq';
import { Enquire } from '@/components/sections/Enquire';

// Home: the product showcase. Inner pages live in src/pages/*.tsx and use the same Layout.
export default function Home() {
  return (
    <Layout title="Event pavilions from Stadium 974 containers" description={HERO.lead}>
      <Hero />
      <Story />
      <Spaces />
      <Inside />
      <Audiences />
      <How />
      <Circle />
      <Offers />
      <Faq />
      <Enquire />
    </Layout>
  );
}
