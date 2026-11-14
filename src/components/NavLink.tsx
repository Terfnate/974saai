import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

/** '/#x' links become plain '#x' on the home page (smooth in-page scroll); other routes use next/link. */
export function NavLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const { pathname } = useRouter();
  if (href.startsWith('/#')) {
    return <a className={className} href={pathname === '/' ? href.slice(1) : href}>{children}</a>;
  }
  return <Link className={className} href={href} aria-current={pathname === href ? 'page' : undefined}>{children}</Link>;
}
