// Product copy for the site. Every claim comes from the group's business model (value propositions,
// customer segments, relationships, channels, revenue streams). Partners and prices are not confirmed,
// so none are shown. Edit copy here; the sections only render it.

export const BRAND = {
  name: '974 Pavilions',          // working product name — change it here
  tagline: 'Stadium 974 containers, reborn as event pavilions.',
  place: 'Darb Al Saai',
  // [PLACEHOLDER] No real contact yet. The form shows a preview notice instead of sending.
  contactEmail: '',
  credit: 'A student concept by Group 03 · CMPS307, Qatar University. Partners and pricing are not confirmed.',
};

// Header links. '/#x' anchors point at home-page sections; the rest are pages.
export const NAV = [
  ['Pavilions', '/#spaces'],
  ['Reservations', '/reservations'],
  ['Sponsorships', '/sponsorships'],
  ['Visitors', '/visitors'],
  ['Performance', '/performance'],
] as const;

export const HERO = {
  kicker: `${BRAND.name} · ${BRAND.place}`,
  h1: ['Stadium 974,', 'back for Darb Al Saai.'],
  lead: 'The containers that built Stadium 974 were made to come apart. We fit them with solar power, cooling and event-themed finishes, and set them up as kiosks, pavilions and shaded spaces for Darb Al Saai.',
  ctas: [
    { label: 'Reserve containers', href: '/reservations', kind: 'primary' },
    { label: 'Become a sponsor', href: '/sponsorships', kind: 'ghost' },
  ],
};

export const STORY = {
  kicker: 'Why containers',
  heading: 'Built for one tournament. Ready for every event after it.',
  points: [
    { h: 'Reused, not rebuilt', p: 'Stadium 974 stock gets a second life instead of sitting unused. Less new building, less waste.' },
    { h: 'Solar-powered', p: 'Each pavilion runs on its own solar panels, with power ready for lights, tills and equipment.' },
    { h: 'Made for Qatari heritage', p: 'Finishes and decoration are themed for the event, so the pavilions belong at a cultural festival.' },
    { h: 'Flexible and modern', p: 'Kiosks, operations rooms and shaded areas from the same modular units, arranged to fit the site.' },
  ],
};

export type Space = { key: string; name: string; who: string; body: string; tone: 'red' | 'blue' | 'sand' | 'green'; has: string[] };
export const SPACES: Space[] = [
  { key: 'retail', name: 'Retail kiosk', who: 'For vendors and retailers', tone: 'red',
    body: 'A ready-to-use shopfront with power on arrival and space for your branding.',
    has: ['Solar power', 'Cooling', 'Branding space', 'Furniture and signs'] },
  { key: 'food', name: 'Food kiosk', who: 'For food operators', tone: 'sand',
    body: 'A serviced unit for food and drink, with utilities connected before the gates open.',
    has: ['Utilities connected', 'Ventilation', 'Solar power', 'Branding space'] },
  { key: 'ops', name: 'Operations space', who: 'For organisers', tone: 'blue',
    body: 'Themed, serviced rooms for event teams: control, storage, staff and support.',
    has: ['Cooling', 'Power', 'Equipment fitted', 'Safety inspected'] },
  { key: 'shade', name: 'Gathering pavilion', who: 'For visitors', tone: 'green',
    body: 'Shaded, comfortable spaces where visitors can rest and take part in cultural activities.',
    has: ['Shade', 'Cooling', 'Seating', 'Event-themed design'] },
];

export const INSIDE = {
  kicker: 'Inside every pavilion',
  heading: 'Delivered ready to open.',
  lead: 'Every unit is inspected, cleaned and refitted before it reaches the site, then tested again once it is in place.',
  parts: [
    { k: 'solar', h: 'Solar panels', p: 'Fitted on the roof. Energy savings lower running costs.' },
    { k: 'cool', h: 'Ventilation and cooling', p: 'Installed in every unit for Qatar’s climate.' },
    { k: 'hatch', h: 'Themed finish', p: 'Decorated for the event, with room for vendor branding.' },
    { k: 'kit', h: 'Furniture, signs, equipment', p: 'Installed on site before opening.' },
    { k: 'util', h: 'Utilities connected', p: 'Power and services set up once the units are placed.' },
    { k: 'safe', h: 'Safety checked', p: 'A safety inspection and a final test before anyone walks in.' },
  ],
};

export const AUDIENCES = [
  { key: 'organisers', name: 'Organisers',
    get: 'Serviced, themed containers and operational spaces for your event.',
    support: ['Planning together from the start', 'Reliable delivery to your site', 'Responsive support during the event'] },
  { key: 'vendors', name: 'Vendors',
    get: 'Ready-to-use retail and food kiosks with power and space for your brand.',
    support: ['Help with renting a kiosk', 'Operational support on site', 'A vendor app for requests (planned)'] },
  { key: 'visitors', name: 'Visitors',
    get: 'Shaded gathering areas and comfortable, safe cultural spaces.',
    support: ['Safe, comfortable spaces', 'A channel for feedback and complaints'] },
  { key: 'sponsors', name: 'Sponsors',
    get: 'Your brand on pavilions that visitors actually use.',
    support: ['Sponsorship and branding rights', 'On-site advertising'] },
];

export const STEPS = [
  { h: 'Plan', p: 'Tell us about your event. We agree the site, the number of units and the services you need.' },
  { h: 'Prepare', p: 'We select and inspect Stadium 974 containers, clean them, and fit solar, cooling and your theme.' },
  { h: 'Install', p: 'Units are delivered, placed and connected, then furnished, inspected and tested.' },
  { h: 'Open', p: 'The event runs, with support for organisers and vendors throughout.' },
  { h: 'Return', p: 'We take everything down and return the containers to stock, ready for the next event.' },
];

export const CIRCLE = {
  heading: 'Every container comes back.',
  lead: 'Nothing is built to be thrown away. After the event the pavilions are dismantled and returned to inventory, so the same stock serves the next festival, and the one after.',
  lines: ['Reuse instead of rebuild', 'Solar-powered on site', 'Returned after every event'],
};

export const OFFERS = [
  { h: 'Rent pavilions', who: 'Organisers', p: 'Priced by the number of containers, their size and the services you need.', href: '/reservations', cta: 'Reserve' },
  { h: 'Lease a kiosk', who: 'Vendors', p: 'Retail or food kiosk with power, for the length of the event.', href: '/reservations', cta: 'Reserve' },
  { h: 'Sponsor', who: 'Brands', p: 'Sponsorship, branding rights and on-site advertising.', href: '/sponsorships', cta: 'Sponsor' },
];

export const FAQ = [
  { q: 'Where do the containers come from?', a: 'From Stadium 974, which was built from shipping containers designed to be taken apart and reused.' },
  { q: 'Do the kiosks have power?', a: 'Yes. Units run on solar panels and utilities are connected on site before opening.' },
  { q: 'Will it be hot inside?', a: 'Every unit is fitted with ventilation and cooling.' },
  { q: 'Can I add my own branding?', a: 'Yes. Vendor kiosks include branding space, and sponsors can take branding rights and on-site advertising.' },
  { q: 'Are the pavilions safe?', a: 'Each installation gets a safety inspection and a final test before the event opens.' },
  { q: 'What happens after the event?', a: 'We dismantle the pavilions and return the containers to inventory for the next event.' },
  { q: 'How much does it cost?', a: 'Pricing isn’t set yet. Organiser fees will depend on the number of containers, their size and the services included. Send us an enquiry.' },
];

export const ENQUIRE = {
  heading: 'Bring 974 to your event.',
  lead: 'Tell us who you are and what you need. We’ll get back to you.',
  roles: ['Event organiser', 'Vendor or retailer', 'Food operator', 'Sponsor', 'Other'],
  preview: 'Thanks. This is a preview site, so messages aren’t sent yet.',
};

// ── Pages ───────────────────────────────────────────────────────────────

export const RESERVE = {
  title: 'Container reservations',
  kicker: 'Reservations',
  h1: ['Reserve your', 'pavilions.'],
  lead: 'Choose the units you need and tell us about your event. We check availability and send you a quote.',
  services: ['Event-themed decoration', 'Furniture, signs and equipment', 'Branding space', 'On-site support during the event'],
  included: ['Solar power', 'Ventilation and cooling', 'Utilities connected on site', 'Safety inspection and final test', 'Removal after the event'],
  next: [
    { h: 'We confirm', p: 'We check which units are free for your dates and reply with a quote.' },
    { h: 'We plan the site', p: 'Together we agree the layout, services and theme.' },
    { h: 'We deliver', p: 'Units arrive fitted, are installed and tested, and are removed after the event.' },
  ],
  pricing: 'Prices depend on the number of containers, their size and the services you choose.',
  preview: 'Thanks. This is a preview site, so reservations aren’t sent yet.',
};

export const SPONSOR = {
  title: 'Sponsorships',
  kicker: 'Sponsorships',
  h1: ['Put your brand', 'where people gather.'],
  lead: 'Visitors spend time in our shaded pavilions and kiosks. Sponsors can brand them, advertise on site, and share a sustainability story built on reuse and solar power.',
  why: [
    { h: 'Branding rights', p: 'Your name and identity on pavilions visitors use throughout the event.' },
    { h: 'On-site advertising', p: 'Space on containers and signs across the site.' },
    { h: 'A story worth telling', p: 'Reused Stadium 974 containers, powered by the sun and returned after every event.' },
  ],
  interests: ['Event sponsorship', 'Branding rights', 'On-site advertising', 'Not sure yet'],
  preview: 'Thanks. This is a preview site, so enquiries aren’t sent yet.',
};

export const VISITORS = {
  title: 'Visitors and complaints',
  kicker: 'Visitors',
  h1: ['Here for', 'Darb Al Saai?'],
  lead: 'Find shade, food and culture in our pavilions. If something isn’t right, tell us and we’ll fix it.',
  find: [
    { h: 'Shaded gathering pavilions', p: 'Cool, comfortable places to rest between activities.' },
    { h: 'Food and retail kiosks', p: 'Local vendors in solar-powered kiosks around the site.' },
    { h: 'Cultural spaces', p: 'Pavilions themed for the event and its heritage programme.' },
    { h: 'Safe by design', p: 'Every pavilion is safety inspected and tested before opening.' },
  ],
  types: ['Complaint', 'Feedback', 'Suggestion'],
  areas: ['Food kiosk', 'Retail kiosk', 'Gathering pavilion', 'Somewhere else on site'],
  after: [
    'We log every message and pass it to the team on site.',
    'If you leave your email, we reply.',
    'Feedback is compared between events to improve the pavilions.',
  ],
  preview: 'Thanks. This is a preview site, so messages aren’t sent yet.',
};

export const PERFORMANCE = {
  title: 'Performance',
  kicker: 'Performance',
  h1: ['How the containers', 'perform, event by event.'],
  lead: 'Every container is tracked across events: the energy it generates, how often it is booked, what visitors think, and how much maintenance it needs.',
  sampleNote: 'Sample data. These numbers are illustrative, not real results. Replace them in src/content/performance-sample.ts once events have run.',
};
