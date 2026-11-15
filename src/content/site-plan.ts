// ⚠ SAMPLE LAYOUT AND BOOKINGS: an illustrative event ground, not the real Darb Al Saai plan.
// Nothing is saved: `booked` is set here by hand. Replace with real data (or a database) later.
// Coordinates are metres on the ground plane: x = east, z = south (towards the entrance). rot = facing, radians.

export type UnitType = 'retail' | 'food' | 'ops' | 'shade';
export type Zone = 'market' | 'food' | 'gathering' | 'ops';

export const UNIT_TYPES: Record<UnitType, { name: string; color: string }> = {
  retail: { name: 'Retail kiosk', color: '#b8321c' },
  food: { name: 'Food kiosk', color: '#c9a15a' },
  shade: { name: 'Gathering pavilion', color: '#2f6b4f' },
  ops: { name: 'Operations space', color: '#1d5b9e' },
};

export const ZONES: Record<Zone, { name: string; label: [number, number] }> = {
  market: { name: 'Market street', label: [0, 16] },
  food: { name: 'Food court', label: [24, -12] },
  gathering: { name: 'Gathering pavilions', label: [-25, -12] },
  ops: { name: 'Operations yard', label: [-18, -38] },
};

export type Unit = { id: string; type: UnitType; zone: Zone; x: number; z: number; rot: number; booked: boolean };

const E = Math.PI / 2; // face east (+x)
const W = -Math.PI / 2; // face west (−x)
const S = 0; // face south (+z)
const N = Math.PI; // face north (−z)

export const UNITS: Unit[] = [
  // Market street: retail kiosks either side of the avenue, facing it.
  { id: 'R-01', type: 'retail', zone: 'market', x: -7, z: 28, rot: E, booked: false },
  { id: 'R-02', type: 'retail', zone: 'market', x: -7, z: 20, rot: E, booked: true },
  { id: 'R-03', type: 'retail', zone: 'market', x: -7, z: 12, rot: E, booked: false },
  { id: 'R-04', type: 'retail', zone: 'market', x: -7, z: 4, rot: E, booked: false },
  { id: 'R-05', type: 'retail', zone: 'market', x: 7, z: 28, rot: W, booked: true },
  { id: 'R-06', type: 'retail', zone: 'market', x: 7, z: 20, rot: W, booked: false },
  { id: 'R-07', type: 'retail', zone: 'market', x: 7, z: 12, rot: W, booked: false },
  { id: 'R-08', type: 'retail', zone: 'market', x: 7, z: 4, rot: W, booked: true },
  // Food court: a U of kiosks around the seating.
  { id: 'F-01', type: 'food', zone: 'food', x: 18, z: -22, rot: S, booked: true },
  { id: 'F-02', type: 'food', zone: 'food', x: 26, z: -22, rot: S, booked: false },
  { id: 'F-03', type: 'food', zone: 'food', x: 34, z: -16, rot: W, booked: false },
  { id: 'F-04', type: 'food', zone: 'food', x: 34, z: -8, rot: W, booked: true },
  { id: 'F-05', type: 'food', zone: 'food', x: 26, z: -2, rot: N, booked: false },
  { id: 'F-06', type: 'food', zone: 'food', x: 18, z: -2, rot: N, booked: false },
  // Gathering pavilions with shade sails.
  { id: 'G-01', type: 'shade', zone: 'gathering', x: -20, z: -21, rot: S, booked: false },
  { id: 'G-02', type: 'shade', zone: 'gathering', x: -30, z: -21, rot: S, booked: false },
  { id: 'G-03', type: 'shade', zone: 'gathering', x: -20, z: -3, rot: N, booked: true },
  { id: 'G-04', type: 'shade', zone: 'gathering', x: -30, z: -3, rot: N, booked: false },
  // Operations yard, fenced off behind the gathering area.
  { id: 'O-01', type: 'ops', zone: 'ops', x: -26, z: -38, rot: S, booked: true },
  { id: 'O-02', type: 'ops', zone: 'ops', x: -18, z: -38, rot: S, booked: false },
  { id: 'O-03', type: 'ops', zone: 'ops', x: -10, z: -38, rot: S, booked: false },
];

export const SITE_NOTE = 'Sample layout and bookings. This is an illustration, not the real Darb Al Saai plan, and selections aren’t saved yet.';
