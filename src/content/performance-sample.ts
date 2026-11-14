// ⚠ SAMPLE DATA: illustrative numbers only, not real results. The page labels them as sample.
// Replace with real per-event figures once events have run. Shape: one entry per container,
// each array holds one value per event, in EVENTS order. null = not measured (e.g. staff-only units).

export const EVENT_DAYS = 8; // the event length in the group's plan

export type EventInfo = { id: string; name: string; color: string };
// Colours: container blue, red, ochre. Validated for colourblind separation and contrast on white.
export const EVENTS: EventInfo[] = [
  { id: 'e1', name: 'Event 1', color: '#1d5b9e' },
  { id: 'e2', name: 'Event 2', color: '#b8321c' },
  { id: 'e3', name: 'Event 3', color: '#b07a1f' },
];

export type Condition = 'Good' | 'Fair' | 'Needs repair';
export type ContainerRow = {
  id: string;
  type: 'Retail kiosk' | 'Food kiosk' | 'Operations space' | 'Gathering pavilion';
  solarKwh: number[];          // energy generated over the event
  bookedDays: number[];        // days in use, out of EVENT_DAYS
  rating: (number | null)[];   // average visitor rating, out of 5
  complaints: (number | null)[];
  issues: number[];            // maintenance issues logged
  condition: Condition;        // after the latest event
};

export const CONTAINERS: ContainerRow[] = [
  { id: 'C-01', type: 'Retail kiosk', solarKwh: [212, 224, 238], bookedDays: [6, 7, 8], rating: [3.9, 4.2, 4.4], complaints: [3, 2, 1], issues: [2, 1, 1], condition: 'Good' },
  { id: 'C-02', type: 'Retail kiosk', solarKwh: [205, 219, 231], bookedDays: [5, 6, 7], rating: [3.7, 4.0, 4.3], complaints: [4, 2, 1], issues: [1, 1, 0], condition: 'Good' },
  { id: 'C-03', type: 'Food kiosk', solarKwh: [188, 201, 226], bookedDays: [7, 8, 8], rating: [3.4, 3.9, 4.2], complaints: [7, 4, 2], issues: [4, 2, 1], condition: 'Good' },
  { id: 'C-04', type: 'Food kiosk', solarKwh: [194, 190, 219], bookedDays: [6, 7, 8], rating: [3.6, 3.8, 4.1], complaints: [6, 5, 3], issues: [3, 3, 2], condition: 'Fair' },
  { id: 'C-05', type: 'Operations space', solarKwh: [226, 233, 247], bookedDays: [8, 8, 8], rating: [null, null, null], complaints: [null, null, null], issues: [1, 0, 0], condition: 'Good' },
  { id: 'C-06', type: 'Operations space', solarKwh: [221, 230, 244], bookedDays: [8, 8, 8], rating: [null, null, null], complaints: [null, null, null], issues: [0, 1, 0], condition: 'Good' },
  { id: 'C-07', type: 'Gathering pavilion', solarKwh: [240, 246, 259], bookedDays: [4, 5, 6], rating: [4.1, 4.3, 4.6], complaints: [2, 1, 0], issues: [1, 0, 0], condition: 'Good' },
  { id: 'C-08', type: 'Gathering pavilion', solarKwh: [236, 229, 252], bookedDays: [3, 5, 6], rating: [4.0, 4.4, 4.5], complaints: [3, 1, 1], issues: [2, 1, 3], condition: 'Needs repair' },
];
