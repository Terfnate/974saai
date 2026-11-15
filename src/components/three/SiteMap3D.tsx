// 3D event ground for picking units. Client-only (next/dynamic). Selection state lives in the page;
// this scene only renders it and reports clicks. Rotate/zoom buttons drive the camera so the mouse wheel
// keeps scrolling the page.
import { useEffect, useImperativeHandle, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { gsap } from 'gsap';
import { UNITS, UNIT_TYPES, ZONES, type Unit, type UnitType } from '@/content/site-plan';

const L = 6.06, H = 2.59, D = 2.44;
const TARGET = new THREE.Vector3(0, 0, -6);
const HOME = new THREE.Vector3(50, 54, 68);

// ── Materials (made once) ────────────────────────────────────────────
function ribTexture(color: string) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d')!;
  g.fillStyle = color; g.fillRect(0, 0, 256, 64);
  for (let x = 0; x < 256; x += 8) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + 5, 0, 2, 64); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x + 7, 0, 1, 64); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.repeat.set(3, 1);
  return t;
}
const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0.15, ...o });
type Look = 'free' | 'booked' | 'dim';
const BODY: Record<UnitType, Record<Look, THREE.Material[]>> = {} as never;
const ensureBodies = () => {
  if (Object.keys(BODY).length) return;
  const lookColor = { booked: '#8c969d', dim: '#d9d6cf' };
  (Object.keys(UNIT_TYPES) as UnitType[]).forEach((t) => {
    BODY[t] = {} as Record<Look, THREE.Material[]>;
    (['free', 'booked', 'dim'] as Look[]).forEach((look) => {
      const col = look === 'free' ? UNIT_TYPES[t].color : lookColor[look];
      const side = std({ map: ribTexture(col), transparent: look === 'dim', opacity: look === 'dim' ? 0.45 : 1 });
      const top = std({ color: new THREE.Color(col).multiplyScalar(0.8), transparent: look === 'dim', opacity: look === 'dim' ? 0.45 : 1 });
      BODY[t][look] = [side, side, top, top, side, side];
    });
  });
};
const M = {
  sand: std({ color: '#e6d6b1', roughness: 0.95, metalness: 0 }),
  paving: std({ color: '#d4cfc4', roughness: 0.9, metalness: 0 }),
  plaza: std({ color: '#cdc6b8', roughness: 0.9, metalness: 0 }),
  dark: std({ color: '#1c1411', roughness: 0.9 }),
  solar: std({ color: '#1d3b5c', roughness: 0.3, metalness: 0.4 }),
  cream: std({ color: '#f3efe6', roughness: 0.9, metalness: 0, side: THREE.DoubleSide }),
  steel: std({ color: '#13202a', roughness: 0.5, metalness: 0.4 }),
  trunk: std({ color: '#8a6a45', roughness: 0.9, metalness: 0 }),
  leaf: std({ color: '#3f7a4a', roughness: 0.8, metalness: 0 }),
  fence: std({ color: '#9aa3a9', roughness: 0.6, metalness: 0.5 }),
  red: std({ color: '#b8321c' }), blue: std({ color: '#1d5b9e' }), ochre: std({ color: '#c9a15a' }),
  ring: new THREE.MeshBasicMaterial({ color: '#e5a823' }),
  hoverRing: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.7 }),
};

// ── One unit ─────────────────────────────────────────────────────────
type UnitProps = { u: Unit; selected: boolean; hovered: boolean; dim: boolean; onPick: (u: Unit) => void; onHover: (id: string | null) => void };

function UnitMesh({ u, selected, hovered, dim, onPick, onHover }: UnitProps) {
  const lift = useRef<THREE.Group>(null);
  const look: Look = dim ? 'dim' : u.booked ? 'booked' : 'free';
  useFrame((_, dt) => {
    const to = selected ? 0.8 : hovered && !u.booked && !dim ? 0.4 : 0;
    lift.current!.position.y = THREE.MathUtils.damp(lift.current!.position.y, to, 10, dt);
  });
  const over = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(u.id); document.body.style.cursor = u.booked || dim ? 'not-allowed' : 'pointer'; };
  const out = () => { onHover(null); document.body.style.cursor = ''; };
  const click = (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); if (!u.booked && !dim) onPick(u); };
  const kiosk = u.type === 'retail' || u.type === 'food';

  return (
    <group position={[u.x, 0, u.z]} rotation={[0, u.rot, 0]}>
      {(selected || hovered) && !u.booked && !dim ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} material={selected ? M.ring : M.hoverRing}>
          <ringGeometry args={[3.6, 4.1, 48]} />
        </mesh>
      ) : null}
      <group ref={lift} onPointerOver={over} onPointerOut={out} onClick={click}>
        <mesh position={[0, H / 2, 0]} material={BODY[u.type][look]} castShadow receiveShadow>
          <boxGeometry args={[L, H, D]} />
        </mesh>
        {!dim ? (
          <>
            {kiosk ? (
              <>
                <mesh position={[-0.3, 1.55, D / 2 + 0.01]} material={M.dark}><planeGeometry args={[3, 1.1]} /></mesh>
                <mesh position={[-0.3, 2.25, D / 2 + 0.45]} rotation={[0.35, 0, 0]} material={M.cream} castShadow><boxGeometry args={[3.3, 0.06, 1]} /></mesh>
              </>
            ) : null}
            {u.type === 'ops' ? <mesh position={[1.8, 1.1, D / 2 + 0.01]} material={M.dark}><planeGeometry args={[0.9, 2]} /></mesh> : null}
            <mesh position={[0, H + 0.12, 0]} rotation={[0.18, 0, 0]} material={M.solar} castShadow><boxGeometry args={[5.4, 0.06, 2.1]} /></mesh>
            {u.type === 'shade' ? (
              <group position={[0, 0, D / 2]}>
                <mesh position={[0, 2.7, 2.4]} rotation={[-1.35, 0, 0]} material={M.cream} castShadow><planeGeometry args={[6.4, 5]} /></mesh>
                {[-3, 3].map((x) => <mesh key={x} position={[x, 1.25, 4.7]} material={M.steel}><cylinderGeometry args={[0.06, 0.06, 2.5, 8]} /></mesh>)}
              </group>
            ) : null}
          </>
        ) : null}
      </group>
      {hovered ? (
        <Html position={[0, H + 2.4, 0]} center zIndexRange={[20, 10]} style={{ pointerEvents: 'none' }}>
          <div className={`maptip${u.booked ? ' is-booked' : ''}`}>
            <b>{u.id}</b>
            <span>{UNIT_TYPES[u.type].name}</span>
            <em>{u.booked ? 'Booked' : selected ? 'Selected · click to remove' : 'Available · click to select'}</em>
          </div>
        </Html>
      ) : selected ? (
        <Html position={[0, H + 1.6, 0]} center zIndexRange={[15, 5]} style={{ pointerEvents: 'none' }}>
          <span className="mapchip">{u.id}</span>
        </Html>
      ) : null}
    </group>
  );
}

// ── Set dressing ─────────────────────────────────────────────────────
const PALMS: [number, number][] = [
  [-3.2, 34], [3.2, 34], [-3.2, 24], [3.2, 24], [-3.2, 16], [3.2, 16], [-3.2, 8], [3.2, 8],
  [12, -26], [-12, -26], [12, 2], [-12, 2], [40, -26], [40, 2], [-38, -26], [-38, 2], [-36, -30], [2, -32],
];
function Palms() {
  return (
    <>
      {PALMS.map(([x, z]) => (
        <group key={`${x},${z}`} position={[x, 0, z]}>
          <mesh material={M.trunk} position={[0, 2.2, 0]} castShadow><cylinderGeometry args={[0.16, 0.24, 4.4, 7]} /></mesh>
          <mesh material={M.leaf} position={[0, 4.6, 0]} castShadow scale={[1.6, 0.55, 1.6]}><icosahedronGeometry args={[1.1, 0]} /></mesh>
        </group>
      ))}
    </>
  );
}

function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={M.sand} receiveShadow><planeGeometry args={[130, 110]} /></mesh>
      <mesh position={[0, 0.02, 18]} material={M.paving} receiveShadow><boxGeometry args={[8, 0.04, 40]} /></mesh>
      <mesh position={[0, 0.03, -12]} material={M.plaza} receiveShadow><cylinderGeometry args={[11, 11, 0.06, 64]} /></mesh>
      <mesh position={[22.5, 0.02, -12]} material={M.paving} receiveShadow><boxGeometry args={[23, 0.04, 6]} /></mesh>
      <mesh position={[-22.5, 0.02, -12]} material={M.paving} receiveShadow><boxGeometry args={[23, 0.04, 6]} /></mesh>
      <mesh position={[-12, 0.02, -29]} material={M.paving} receiveShadow><boxGeometry args={[4, 0.04, 12]} /></mesh>
      {/* the 974 stack: a small container monument in the plaza */}
      <group position={[0, 0, -12]}>
        <mesh material={M.red} position={[0, 0.65, 0]} castShadow><boxGeometry args={[3, 1.3, 1.2]} /></mesh>
        <mesh material={M.blue} position={[0.4, 1.95, 0.1]} rotation={[0, 0.5, 0]} castShadow><boxGeometry args={[3, 1.3, 1.2]} /></mesh>
        <mesh material={M.ochre} position={[-0.2, 3.25, 0]} rotation={[0, -0.4, 0]} castShadow><boxGeometry args={[3, 1.3, 1.2]} /></mesh>
      </group>
      {/* entrance gate */}
      <group position={[0, 0, 40]}>
        {[-5, 5].map((x) => <mesh key={x} material={M.steel} position={[x, 2.5, 0]} castShadow><boxGeometry args={[0.8, 5, 0.8]} /></mesh>)}
        <mesh material={M.red} position={[0, 5.3, 0]} castShadow><boxGeometry args={[11.6, 0.9, 1]} /></mesh>
      </group>
      {/* food court seating */}
      {[18, 26].flatMap((x) => [-15, -9].map((z) => (
        <group key={`${x}${z}`} position={[x, 0, z]}>
          <mesh material={M.steel} position={[0, 0.75, 0]} castShadow><cylinderGeometry args={[0.9, 0.9, 0.08, 20]} /></mesh>
          <mesh material={M.steel} position={[0, 0.37, 0]}><cylinderGeometry args={[0.08, 0.08, 0.74, 8]} /></mesh>
        </group>
      )))}
      {/* operations yard fence */}
      {([[-18, -33.6, 28, 0.15], [-18, -42.4, 28, 0.15], [-32, -38, 0.15, 8.8], [-4, -38, 0.15, 8.8]] as const).map(([x, z, w, d]) => (
        <mesh key={`${x}${z}`} material={M.fence} position={[x, 0.6, z]}><boxGeometry args={[w, 1.2, d]} /></mesh>
      ))}
    </>
  );
}

function Labels() {
  return (
    <>
      {Object.values(ZONES).map((z) => (
        <Html key={z.name} position={[z.label[0], 0.2, z.label[1]]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <span className="maplabel">{z.name}</span>
        </Html>
      ))}
      <Html position={[0, 7, 40]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}><span className="maplabel">Entrance</span></Html>
      <Html position={[0, 0.2, -3]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}><span className="maplabel">Central plaza</span></Html>
    </>
  );
}

// ── Camera rig: buttons rotate and zoom around the target ─────────────
export type MapHandle = { rotate: (dir: 1 | -1) => void; zoom: (dir: 1 | -1) => void; reset: () => void };

function Rig({ still, api, drag }: { still: boolean; api: RefObject<MapHandle | null>; drag: boolean }) {
  const { camera, size } = useThree();
  // Portrait screens need the camera further out to fit the whole ground.
  const home = () => HOME.clone().sub(TARGET).multiplyScalar(size.width / size.height < 1 ? 1.75 : 1).add(TARGET);
  useEffect(() => { camera.position.copy(home()); controls.current?.update(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const controls = useRef<OrbitControlsImpl>(null);
  const move = (to: THREE.Vector3) => {
    if (still) { camera.position.copy(to); controls.current?.update(); return; }
    gsap.to(camera.position, { x: to.x, y: to.y, z: to.z, duration: 0.7, ease: 'power3.out', onUpdate: () => controls.current?.update() });
  };
  useImperativeHandle(api, () => ({
    rotate: (dir) => {
      const off = camera.position.clone().sub(TARGET);
      off.applyAxisAngle(new THREE.Vector3(0, 1, 0), dir * Math.PI / 6);
      move(off.add(TARGET));
    },
    zoom: (dir) => {
      const off = camera.position.clone().sub(TARGET);
      const len = THREE.MathUtils.clamp(off.length() * (dir > 0 ? 0.75 : 1.33), 35, 170);
      move(off.setLength(len).add(TARGET));
    },
    reset: () => move(home()),
  }));
  return <OrbitControls ref={controls} target={TARGET} enabled={drag} enableZoom={false} enablePan={false} minPolarAngle={0.25} maxPolarAngle={1.2} enableDamping />;
}

type Props = {
  selected: string[];
  visible: (u: Unit) => boolean;
  onPick: (u: Unit) => void;
  onReady: () => void;
  still: boolean;
  running: boolean;
  api: RefObject<MapHandle | null>;
  drag: boolean; // drag-to-rotate; off on touch screens so swiping still scrolls the page
};

export default function SiteMap3D({ selected, visible, onPick, onReady, still, running, api, drag }: Props) {
  ensureBodies();
  useEffect(() => () => { document.body.style.cursor = ''; }, []);
  const [hover, setHover] = useState<string | null>(null);
  const sel = useMemo(() => new Set(selected), [selected]);
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.75]}
      frameloop={running ? 'always' : 'never'}
      camera={{ position: HOME.toArray(), fov: 30, near: 1, far: 400 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
      onCreated={() => onReady()}
      onPointerMissed={() => setHover(null)}
    >
      <ambientLight intensity={0.9} />
      <hemisphereLight args={['#ffffff', '#d9c9a3', 0.5]} />
      <directionalLight position={[40, 70, 30]} intensity={2} castShadow shadow-mapSize={[2048, 2048]}>
        <orthographicCamera attach="shadow-camera" args={[-70, 70, 60, -60, 1, 200]} />
      </directionalLight>
      <Ground />
      <Palms />
      <Labels />
      {UNITS.map((u) => (
        <UnitMesh key={u.id} u={u} selected={sel.has(u.id)} hovered={hover === u.id} dim={!visible(u)} onPick={onPick} onHover={setHover} />
      ))}
      <Rig api={api} still={still} drag={drag} />
    </Canvas>
  );
}
