import { INSIDE } from '@/content/content';
import { SectionHead } from '../ui';
import { Stage } from '../three/Stage';

// Marker positions on the drawing, in the same order as INSIDE.parts.
const PINS: [number, number][] = [[200, 62], [172, 140], [556, 182], [600, 300], [770, 302], [722, 230]];

/** Fitted pavilion with numbered callouts: a 3D model (Stage) where WebGL is available, the SVG drawing otherwise. */
export function Inside() {
  return (
    <section className="sec sec--white" id="inside" aria-labelledby="in-h">
      <div className="wrap">
        <SectionHead id="in-h" kicker={INSIDE.kicker} title={INSIDE.heading} lead={INSIDE.lead} />
        <div className="anat" data-anat>
          <Stage fallback={<svg className="anat__svg" viewBox="0 0 820 360" role="img" aria-label="Drawing of a container kiosk with solar panels, cooling vent, themed serving hatch, furniture, utility connection and a safety tag.">
            <defs>
              <pattern id="ribs" width="14" height="10" patternUnits="userSpaceOnUse">
                <rect width="14" height="10" fill="#b8321c" />
                <rect x="7" width="2" height="10" fill="#000" opacity=".16" />
                <rect x="9" width="1" height="10" fill="#fff" opacity=".08" />
              </pattern>
              <pattern id="cells" width="22" height="12" patternUnits="userSpaceOnUse">
                <rect width="22" height="12" fill="#1d3b5c" />
                <path d="M0 0H22M0 0V12" stroke="#7fa6c9" strokeWidth="1" opacity=".55" />
              </pattern>
              <pattern id="stripe" width="40" height="10" patternUnits="userSpaceOnUse">
                <rect width="20" height="10" fill="#c9a15a" /><rect x="20" width="20" height="10" fill="#f3efe6" />
              </pattern>
            </defs>
            <line x1="0" y1="330" x2="820" y2="330" stroke="#111a21" strokeWidth="3" />
            {/* solar array */}
            <g data-anat-solar>
              {[60, 210, 360, 510].map((x) => (
                <g key={x}>
                  <path d={`M${x} 104 L${x + 18} 64 L${x + 148} 64 L${x + 130} 104 Z`} fill="url(#cells)" stroke="#111a21" strokeWidth="2" />
                  <line x1={x + 40} y1="104" x2={x + 40} y2="110" stroke="#111a21" strokeWidth="3" />
                  <line x1={x + 100} y1="104" x2={x + 100} y2="110" stroke="#111a21" strokeWidth="3" />
                </g>
              ))}
            </g>
            {/* body */}
            <rect x="40" y="110" width="720" height="210" fill="url(#ribs)" />
            <rect x="40" y="110" width="720" height="210" fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="5" />
            <rect x="40" y="110" width="720" height="8" fill="#fff" opacity=".14" />
            {/* door end */}
            <rect x="698" y="124" width="4" height="182" fill="#000" opacity=".3" />
            <rect x="738" y="124" width="4" height="182" fill="#000" opacity=".3" />
            {/* safety tag */}
            <g data-anat-pop>
              <rect x="706" y="212" width="32" height="40" rx="3" fill="#f3efe6" stroke="#111a21" strokeWidth="2" />
              <path d="M713 233 l7 7 l12 -15" fill="none" stroke="#2f6b4f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            {/* cooling vent */}
            <g>
              <rect x="80" y="140" width="92" height="56" fill="#e8e8e4" stroke="#111a21" strokeWidth="2" />
              {[150, 160, 170, 180].map((y) => <line key={y} x1="88" y1={y} x2="164" y2={y + 4} stroke="#111a21" strokeWidth="3" />)}
            </g>
            {/* sign */}
            <rect x="262" y="124" width="220" height="34" fill="#13202a" />
            <text x="372" y="148" textAnchor="middle" fill="#e5a823" fontSize="20" fontWeight="800" fontFamily="var(--f-stencil), sans-serif" letterSpacing="2">974</text>
            {/* serving hatch with awning */}
            <rect x="222" y="178" width="300" height="100" fill="#2a1c17" />
            <rect x="240" y="196" width="60" height="6" fill="#c9a15a" opacity=".6" />
            <rect x="320" y="196" width="60" height="6" fill="#c9a15a" opacity=".6" />
            <rect x="210" y="274" width="324" height="12" fill="#c9a15a" stroke="#111a21" strokeWidth="2" />
            <path data-anat-awning d="M206 166 H538 L556 196 H188 Z" fill="url(#stripe)" stroke="#111a21" strokeWidth="2" />
            {/* furniture */}
            <g data-anat-pop>
              <rect x="560" y="276" width="72" height="8" fill="#13202a" />
              <rect x="590" y="284" width="8" height="46" fill="#13202a" />
              <rect x="545" y="298" width="22" height="6" fill="#13202a" /><rect x="553" y="304" width="5" height="26" fill="#13202a" />
              <rect x="640" y="298" width="22" height="6" fill="#13202a" /><rect x="648" y="304" width="5" height="26" fill="#13202a" />
            </g>
            {/* utility hookup */}
            <path data-anat-cable d="M760 300 H784 V330" fill="none" stroke="#111a21" strokeWidth="4" />
            <rect x="772" y="300" width="28" height="30" fill="#5c6f7c" stroke="#111a21" strokeWidth="2" />
            {/* markers */}
            {PINS.map(([x, y], i) => (
              <g key={i} className="anat__pin" data-anat-pin>
                <circle cx={x} cy={y} r="15" />
                <text x={x} y={y + 5} textAnchor="middle">{i + 1}</text>
              </g>
            ))}
          </svg>} />
          <ol className="anat__list" role="list">
            {INSIDE.parts.map((p, i) => (
              <li key={p.k} data-rise>
                <span className="anat__n" aria-hidden="true">{i + 1}</span>
                <div><h3>{p.h}</h3><p>{p.p}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
