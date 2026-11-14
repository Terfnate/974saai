// Motion layer: Lenis smooth scroll + GSAP ScrollTrigger.
// Called once per page inside useGSAP, so every tween and trigger reverts on unmount.
// Sections only render markup with data-* hooks; everything that moves is driven from here.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

export function startMotion(): () => void {
  document.documentElement.classList.add('js-motion');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    document.documentElement.classList.remove('js-motion');
    return () => {};
  }

  // ── Lenis drives the scroll; ScrollTrigger listens to it ───────────────
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: { offset: -64 } });
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // ── Hero: the stack is craned into place, bottom row first ─────────────
  const boxes = q('[data-stack] [data-box]');
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  // Each step only runs when its elements exist on this page (GSAP warns on empty targets).
  const step = (els: Element[], vars: gsap.TweenVars, at: number) => { if (els.length) intro.from(els, vars, at); };
  step(q('[data-hero-line]'), { yPercent: 105, duration: 1.3, stagger: 0.08 }, 0);
  step(q('[data-hero-fade]'), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.35);
  step(boxes, { y: () => -window.innerHeight * 0.7, autoAlpha: 0, duration: 1.1, ease: 'power3.out', stagger: { each: 0.07, from: 'start' } }, 0.2);
  step(q('.phero__yard [data-box]'), { y: 120, duration: 1, ease: 'power3.out', stagger: 0.06 }, 0.3);

  // Generic reveals: anything tagged data-rise comes up once.
  q('[data-rise]').forEach((el) =>
    gsap.from(el, { y: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));

  // Story rules draw across.
  q('[data-rule]').forEach((l) =>
    gsap.from(l, { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: l, start: 'top 90%' } }));

  // Anatomy drawing: panels drop onto the roof, awning swings open, fittings and pins pop in.
  const anat = document.querySelector('[data-anat]');
  if (anat) {
    gsap.timeline({ scrollTrigger: { trigger: anat, start: 'top 70%' }, defaults: { ease: 'expo.out' } })
      .from(q('[data-anat-solar] > g'), { y: -60, autoAlpha: 0, duration: 1, stagger: 0.1 })
      .from(q('[data-anat-awning]'), { scaleY: 0, transformOrigin: '50% 0%', duration: 0.9 }, 0.3)
      .from(q('[data-anat-pop]'), { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, 0.5)
      .from(q('[data-anat-pin]'), { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', duration: 0.6, ease: 'back.out(2)', stagger: 0.08 }, 0.7);
  }

  // How it works: a container rides the rail with the scroll.
  const how = document.querySelector('[data-how]');
  if (how) {
    const st = { trigger: how.querySelector('.how__steps'), start: 'top 95%', end: 'bottom 35%', scrub: 0.6 };
    gsap.fromTo(how.querySelector('[data-how-rider]'), { left: '0%' }, { left: '100%', ease: 'none', scrollTrigger: st });
    gsap.fromTo(how.querySelector('[data-how-fill]'), { scaleX: 0 }, { scaleX: 1, transformOrigin: '0 50%', ease: 'none', scrollTrigger: st });
  }

  const mm = gsap.matchMedia();

  // ── Desktop: pinned hero dismantle, pinned container train ─────────────
  mm.add('(min-width: 900px)', () => {
    // The stack comes apart top row first as you scroll: the project in one gesture.
    const hero = document.querySelector('[data-hero]');
    if (hero) {
      const out = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: '+=90%', pin: true, scrub: 0.7, anticipatePin: 1 } });
      // Slots move here; the boxes inside them are owned by the intro, so the two tweens never share a target.
      const slots = q('[data-stack] [data-slot]');
      [...slots].reverse().forEach((b, i) => {
        out.to(b, { x: () => window.innerWidth * (0.35 + (i % 3) * 0.12), y: () => -window.innerHeight * (0.25 + (i % 2) * 0.2), rotation: i % 2 ? 6 : -4, autoAlpha: 0, ease: 'power2.in', duration: 1 }, i * 0.28);
      });
      out.to(q('[data-hero-copy]'), { yPercent: -8, ease: 'none', duration: slots.length * 0.28 + 0.7 }, 0);
    }

    const train = document.querySelector<HTMLElement>('[data-train]');
    const track = train?.querySelector<HTMLElement>('[data-track]');
    if (train && track) {
      train.classList.add('is-pinned');
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, { x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: train, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.5, invalidateOnRefresh: true } });
      return () => train.classList.remove('is-pinned');
    }
  });

  // ── Mobile: no pinning, cards rise in ──────────────────────────────────
  mm.add('(max-width: 899px)', () => {
    q('[data-train] [data-card]').forEach((c) =>
      gsap.from(c, { y: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%' } }));
  });

  // Pins are created last (inside matchMedia); sort so every trigger after a pin accounts for its spacing.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  return () => {
    mm.revert();
    gsap.ticker.remove(tick);
    lenis.destroy();
    document.documentElement.classList.remove('js-motion');
  };
}
