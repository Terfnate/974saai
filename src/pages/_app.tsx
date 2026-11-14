import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Big_Shoulders, Big_Shoulders_Stencil, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';

const display = Big_Shoulders({ subsets: ['latin'], weight: 'variable', variable: '--f-display', adjustFontFallback: false, fallback: ['Arial Narrow', 'sans-serif'] });
const stencil = Big_Shoulders_Stencil({ subsets: ['latin'], weight: ['800'], variable: '--f-stencil', adjustFontFallback: false, fallback: ['Arial Narrow', 'sans-serif'] });
const text = IBM_Plex_Sans({ subsets: ['latin'], weight: 'variable', variable: '--f-text' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-mono' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${display.variable} ${stencil.variable} ${text.variable} ${mono.variable} root`}>
      <Component {...pageProps} />
    </div>
  );
}
