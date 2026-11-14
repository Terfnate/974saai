// 3D pavilion, built in code with react-three-fiber (no model file). Client-only: loaded via next/dynamic.
// Scroll through the section to assemble it: solar panels drop on, the serving hatch swings up into an awning,
// the end doors open, then the fittings appear. Drag to rotate on desktop.
//
// To swap in a modelled .glb later: put it in public/models/, and render drei's <Gltf src="/models/x.glb" />
// in place of <Pavilion /> below. The pins and scroll progress can stay as they are.
import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls } from '@react-three/drei';

// Real 20 ft container, in metres. Bottom sits on y = 0, centred on x and z.
const L = 6.06, H = 2.59, D = 2.44;
// Serving hatch opening in the front (+z) wall.
const HX0 = -1.9, HX1 = 1.0, HY0 = 0.95, HY1 = 2.15;

const C = {
  paint: '#b8321c', frame: '#7e2312', inside: '#1c1411', sand: '#c9a15a', cream: '#f3efe6',
  steel: '#13202a', grey: '#5c6f7c', cell: '#1d3b5c', alu: '#c4ccd2',
};
const mat = (color: string, rough = 0.6, metal = 0.25) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
const M = {
  paint: mat(C.paint), frame: mat(C.frame, 0.7), sand: mat(C.sand, 0.8, 0), steel: mat(C.steel, 0.5, 0.4),
  grey: mat(C.grey, 0.6, 0.3), alu: mat(C.alu, 0.35, 0.8), dark: mat('#0d1216', 0.8, 0.1),
  inside: new THREE.MeshStandardMaterial({ color: C.inside, roughness: 0.9, side: THREE.BackSide }),
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - (1 - t) ** 3;
const phase = (p: number, a: number, b: number) => ease(clamp01((p - a) / (b - a)));

/** Flat steel sheet with vertical corrugation ribs on its outer face (+z in local space). */
function Ribbed({ w, h, material = M.paint }: { w: number; h: number; material?: THREE.Material }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const n = Math.max(1, Math.floor(w / 0.16));
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    for (let i = 0; i < n; i++) {
      m.makeTranslation(-w / 2 + (i + 0.5) * (w / n), 0, 0.035);
      ref.current!.setMatrixAt(i, m);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [n, w]);
  return (
    <group>
      <mesh material={material} castShadow receiveShadow><boxGeometry args={[w, h, 0.03]} /></mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, n]} material={material} castShadow>
        <boxGeometry args={[0.075, h - 0.02, 0.045]} />
      </instancedMesh>
    </group>
  );
}

function useCanvasTexture(draw: (g: CanvasRenderingContext2D, s: number) => void, size = 256) {
  return useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = size;
    draw(c.getContext('2d')!, size);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
  }, [draw, size]);
}
const drawCells = (g: CanvasRenderingContext2D, s: number) => {
  g.fillStyle = C.cell; g.fillRect(0, 0, s, s);
  g.strokeStyle = '#7fa6c9'; g.lineWidth = 2; g.globalAlpha = 0.6;
  for (let i = 0; i <= 6; i++) { g.beginPath(); g.moveTo((i * s) / 6, 0); g.lineTo((i * s) / 6, s); g.stroke(); }
  for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(0, (i * s) / 4); g.lineTo(s, (i * s) / 4); g.stroke(); }
};
const drawTag = (g: CanvasRenderingContext2D, s: number) => {
  g.fillStyle = C.cream; g.fillRect(0, 0, s, s);
  g.strokeStyle = '#2f6b4f'; g.lineWidth = s * 0.11; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(s * 0.22, s * 0.52); g.lineTo(s * 0.42, s * 0.72); g.lineTo(s * 0.78, s * 0.3); g.stroke();
};
const drawStripes = (g: CanvasRenderingContext2D, s: number) => {
  for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? C.cream : C.sand; g.fillRect((i * s) / 8, 0, s / 8, s); }
};

type Prog = MutableRefObject<number>;

/** The fitted container. All moving parts read `prog` (0 → 1) every frame and ease towards it. */
function Pavilion({ prog }: { prog: Prog }) {
  const cells = useCanvasTexture(drawCells);
  const tag = useCanvasTexture(drawTag, 128);
  const stripes = useCanvasTexture(drawStripes, 128);
  const cellMat = useMemo(() => new THREE.MeshStandardMaterial({ map: cells, color: '#ffffff', metalness: 0.2, roughness: 0.35 }), [cells]);
  const solar = useRef<THREE.Group>(null);
  const flap = useRef<THREE.Group>(null);
  const doorA = useRef<THREE.Group>(null);
  const doorB = useRef<THREE.Group>(null);
  const fit = useRef<THREE.Group>(null);
  const shown = useRef(0);

  useFrame((_, dt) => {
    shown.current = THREE.MathUtils.damp(shown.current, prog.current, 6, dt);
    const p = shown.current;
    const s = phase(p, 0, 0.3), h = phase(p, 0.25, 0.55), d = phase(p, 0.5, 0.8), f = phase(p, 0.7, 0.95);
    solar.current!.position.y = (1 - s) * 3.5;
    solar.current!.visible = s > 0.001;
    flap.current!.rotation.x = -h * THREE.MathUtils.degToRad(100);
    doorA.current!.rotation.y = -d * THREE.MathUtils.degToRad(105);
    doorB.current!.rotation.y = d * THREE.MathUtils.degToRad(105);
    fit.current!.scale.setScalar(Math.max(0.001, f));
  });

  const post = 0.16; // corner post size
  const hatchW = HX1 - HX0, hatchH = HY1 - HY0, hatchCx = (HX0 + HX1) / 2;
  const leaf = D / 2 - 0.02;

  return (
    <group>
      {/* dark interior shell, seen through the hatch and the doors */}
      <mesh material={M.inside} position={[0, H / 2, 0]}><boxGeometry args={[L - 0.1, H - 0.1, D - 0.1]} /></mesh>

      {/* front wall (+z) in four pieces around the hatch opening */}
      <group position={[0, 0, D / 2]}>
        <group position={[(-L / 2 + HX0) / 2, H / 2, 0]}><Ribbed w={HX0 + L / 2} h={H} /></group>
        <group position={[(HX1 + L / 2) / 2, H / 2, 0]}><Ribbed w={L / 2 - HX1} h={H} /></group>
        <group position={[hatchCx, HY0 / 2, 0]}><Ribbed w={hatchW} h={HY0} /></group>
        <group position={[hatchCx, (HY1 + H) / 2, 0]}><Ribbed w={hatchW} h={H - HY1} /></group>
        {/* counter */}
        <mesh material={M.sand} position={[hatchCx, HY0, 0.2]} castShadow><boxGeometry args={[hatchW + 0.1, 0.06, 0.45]} /></mesh>
        {/* hatch flap, hinged on its top edge; opens into an awning */}
        <group ref={flap} position={[hatchCx, HY1, 0.07]}>
          <group position={[0, -hatchH / 2, 0]}><Ribbed w={hatchW} h={hatchH} /></group>
          <mesh position={[0, -hatchH / 2, -0.025]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[hatchW, hatchH]} />
            <meshStandardMaterial map={stripes} roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* back wall (−z) */}
      <group position={[0, H / 2, -D / 2]} rotation={[0, Math.PI, 0]}><Ribbed w={L} h={H} /></group>

      {/* closed end (−x) with a cooling vent */}
      <group position={[-L / 2, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <Ribbed w={D} h={H} />
        <group position={[0, 0.55, 0.09]}>
          <mesh material={M.alu}><boxGeometry args={[1.0, 0.62, 0.04]} /></mesh>
          {[-0.2, -0.07, 0.06, 0.19].map((y) => (
            <mesh key={y} material={M.dark} position={[0, y, 0.03]} rotation={[-0.5, 0, 0]}><boxGeometry args={[0.9, 0.05, 0.02]} /></mesh>
          ))}
        </group>
      </group>

      {/* door end (+x): two leaves, hinged at the outer edges */}
      <group ref={doorA} position={[L / 2 + 0.03, 0, D / 2 - 0.01]}>
        <group position={[0, H / 2, -leaf / 2]} rotation={[0, Math.PI / 2, 0]}><Ribbed w={leaf} h={H - 0.1} /></group>
        {[-leaf * 0.28, -leaf * 0.72].map((z) => (
          <mesh key={z} material={M.alu} position={[0.07, H / 2, z]}><cylinderGeometry args={[0.022, 0.022, H - 0.2, 10]} /></mesh>
        ))}
        {/* safety tag */}
        <mesh position={[0.1, 1.35, -leaf * 0.5]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.32, 0.32]} />
          <meshStandardMaterial map={tag} roughness={0.8} />
        </mesh>
      </group>
      <group ref={doorB} position={[L / 2 + 0.03, 0, -D / 2 + 0.01]}>
        <group position={[0, H / 2, leaf / 2]} rotation={[0, Math.PI / 2, 0]}><Ribbed w={leaf} h={H - 0.1} /></group>
        {[leaf * 0.28, leaf * 0.72].map((z) => (
          <mesh key={z} material={M.alu} position={[0.07, H / 2, z]}><cylinderGeometry args={[0.022, 0.022, H - 0.2, 10]} /></mesh>
        ))}
      </group>

      {/* roof and floor plates */}
      <mesh material={M.paint} position={[0, H - 0.02, 0]} castShadow receiveShadow><boxGeometry args={[L, 0.05, D]} /></mesh>
      <mesh material={M.frame} position={[0, 0.06, 0]}><boxGeometry args={[L, 0.12, D]} /></mesh>

      {/* frame: corner posts, rails, corner castings */}
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => (
        <group key={`${sx}${sz}`}>
          <mesh material={M.frame} position={[sx * (L / 2 - post / 2), H / 2, sz * (D / 2 - post / 2)]} castShadow><boxGeometry args={[post, H, post]} /></mesh>
          {[0.09, H - 0.09].map((y) => (
            <mesh key={y} material={M.steel} position={[sx * (L / 2 - 0.09), y, sz * (D / 2 - 0.09)]}><boxGeometry args={[0.2, 0.18, 0.2]} /></mesh>
          ))}
        </group>
      )))}
      {[0.08, H - 0.08].flatMap((y) => [-1, 1].map((sz) => (
        <mesh key={`l${y}${sz}`} material={M.frame} position={[0, y, sz * (D / 2 + 0.01)]}><boxGeometry args={[L - 0.3, 0.16, 0.08]} /></mesh>
      )))}
      {[0.08, H - 0.08].map((y) => (
        <mesh key={`e${y}`} material={M.frame} position={[-L / 2 - 0.01, y, 0]}><boxGeometry args={[0.08, 0.16, D - 0.3]} /></mesh>
      ))}

      {/* solar array on the roof */}
      <group ref={solar}>
        {[-1.95, 0, 1.95].map((x) => (
          <group key={x} position={[x, H + 0.36, 0]} rotation={[0.26, 0, 0]}>
            <mesh castShadow material={M.alu}><boxGeometry args={[1.8, 0.04, 1.9]} /></mesh>
            <mesh material={cellMat} position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.72, 1.82]} /></mesh>
            {[-0.7, 0.7].flatMap((lx) => [-0.75, 0.75].map((lz) => (
              <mesh key={`${lx}${lz}`} material={M.alu} position={[lx, -0.19 + lz * 0.12, lz]}><boxGeometry args={[0.04, 0.38 - lz * 0.24, 0.04]} /></mesh>
            )))}
          </group>
        ))}
      </group>

      {/* fittings that appear last: table and stools, utility box with cable */}
      <group ref={fit}>
        <group position={[hatchCx + 0.2, 0, D / 2 + 1.25]}>
          <mesh material={M.steel} position={[0, 1.05, 0]} castShadow><cylinderGeometry args={[0.38, 0.38, 0.05, 28]} /></mesh>
          <mesh material={M.steel} position={[0, 0.52, 0]}><cylinderGeometry args={[0.04, 0.04, 1.04, 10]} /></mesh>
          <mesh material={M.steel} position={[0, 0.02, 0]}><cylinderGeometry args={[0.25, 0.25, 0.04, 20]} /></mesh>
          {[-0.75, 0.75].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh material={M.sand} position={[0, 0.72, 0]} castShadow><cylinderGeometry args={[0.18, 0.18, 0.06, 20]} /></mesh>
              <mesh material={M.steel} position={[0, 0.36, 0]}><cylinderGeometry args={[0.03, 0.03, 0.72, 8]} /></mesh>
            </group>
          ))}
        </group>
        <group position={[L / 2 + 0.55, 0, -D / 2 - 0.2]}>
          <mesh material={M.grey} position={[0, 0.35, 0]} castShadow><boxGeometry args={[0.45, 0.7, 0.32]} /></mesh>
          <mesh material={M.dark} position={[-0.38, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.5, 8]} /></mesh>
        </group>
      </group>
    </group>
  );
}

// Numbered markers matching the list beside the canvas. Each fades when its face turns away from the camera.
const PINS: { pos: [number, number, number]; normal: [number, number, number] }[] = [
  { pos: [0.8, H + 1.0, 0.4], normal: [0, 1, 0.3] },
  { pos: [-L / 2 - 0.2, H / 2 + 0.55, 0.6], normal: [-1, 0, 0] },
  { pos: [hatchMid(), HY1 + 0.25, D / 2 + 1.0], normal: [0, 0.3, 1] },
  { pos: [-0.2, 1.4, D / 2 + 1.25], normal: [0, 0, 1] },
  { pos: [L / 2 + 0.55, 1.0, -D / 2 - 0.2], normal: [1, 0, -0.4] },
  { pos: [L / 2 + 0.2, 1.75, D / 4], normal: [1, 0, 0.3] },
];
function hatchMid() { return (HX0 + HX1) / 2 - 0.6; }

function Pins() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const { camera } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  const n = useMemo(() => PINS.map((p) => new THREE.Vector3(...p.normal).normalize()), []);
  useFrame(() => {
    PINS.forEach((p, i) => {
      const el = refs.current[i];
      if (!el) return;
      v.copy(camera.position).sub(new THREE.Vector3(...p.pos)).normalize();
      el.style.opacity = String(clamp01((v.dot(n[i]) + 0.15) * 3));
    });
  });
  return (
    <>
      {PINS.map((p, i) => (
        <Html key={i} position={p.pos} center zIndexRange={[2, 0]} ref={(el: HTMLDivElement | null) => { refs.current[i] = el; }}>
          <span className="pin3d" aria-hidden="true">{i + 1}</span>
        </Html>
      ))}
    </>
  );
}

export default function Container3D({ prog, interactive, still, onReady }: { prog: Prog; interactive: boolean; still: boolean; onReady: () => void }) {
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 2]}
      camera={{ position: [8.2, 4.4, 9.4], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => onReady()}
    >
      <ambientLight intensity={0.85} />
      <hemisphereLight args={['#ffffff', '#c9c4b8', 0.6]} />
      <directionalLight position={[6, 10, 7]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]}>
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.5, 30]} />
      </directionalLight>
      <directionalLight position={[-6, 4, -5]} intensity={0.5} />
      <group position={[-0.2, -1.1, 0]}>
        <Pavilion prog={prog} />
        <Pins />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.45} scale={16} blur={2.4} far={4} />
      </group>
      <OrbitControls
        enabled={interactive}
        enableZoom={false}
        enablePan={false}
        autoRotate={!still}
        autoRotateSpeed={0.6}
        minPolarAngle={0.6}
        maxPolarAngle={1.45}
        target={[0, 0.3, 0]}
        onStart={(e) => { (e?.target as unknown as { autoRotate: boolean }).autoRotate = false; }}
      />
    </Canvas>
  );
}
