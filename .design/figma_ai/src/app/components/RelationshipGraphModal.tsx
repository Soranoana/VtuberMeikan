import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { VTuberProfile, VTuberRelationship } from '../types';
import { useApp } from '../context/AppContext';

const PALETTE = [
  '#6366f1', // indigo
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
];

const W = 720;
const H = 640;
const CX = W / 2;
const CY = H / 2;
const CENTER_R = 52;
const NODE_R = 36;
// Minimum bow used when label widths don't force a larger value
const MIN_BOW = 55;

function getOrbitR(count: number): number {
  if (count <= 2) return 185;
  if (count <= 4) return 205;
  if (count <= 6) return 220;
  return Math.min(255, 210 + count * 4);
}

function calcPos(i: number, total: number, orbitR: number) {
  const angle = (2 * Math.PI * i / total) - Math.PI / 2;
  return { x: CX + orbitR * Math.cos(angle), y: CY + orbitR * Math.sin(angle) };
}

// Point on the rim of a circle of radius r, in the direction from (fx,fy) toward (tx,ty)
function edgePoint(fx: number, fy: number, tx: number, ty: number, r: number) {
  const dx = tx - fx, dy = ty - fy;
  const len = Math.sqrt(dx * dx + dy * dy);
  return { x: fx + dx / len * r, y: fy + dy / len * r };
}

// Unit vector perpendicular to segment (x1,y1)→(x2,y2), rotated 90° CCW
function perpUnit(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  return { ox: -dy / len, oy: dx / len };
}

// Point on a quadratic bezier at t = 0.5
function bezierMid(
  p0x: number, p0y: number,
  cpx: number, cpy: number,
  p2x: number, p2y: number,
) {
  return {
    x: 0.25 * p0x + 0.5 * cpx + 0.25 * p2x,
    y: 0.25 * p0y + 0.5 * cpy + 0.25 * p2y,
  };
}

// ---- Sub-components --------------------------------------------------------

interface LabelProps { x: number; y: number; text: string; color: string }

function RelLabel({ x, y, text, color }: LabelProps) {
  const w = Math.max(36, text.length * 14 + 16);
  const h = 22;
  return (
    <g>
      <rect
        x={x - w / 2} y={y - h / 2}
        width={w} height={h} rx="5"
        fill="rgba(10,10,22,0.88)"
        stroke={color} strokeWidth="1" strokeOpacity="0.7"
      />
      <text
        x={x} y={y + 5}
        textAnchor="middle"
        fill={color} fontSize="12" fontWeight="600"
      >
        {text}
      </text>
    </g>
  );
}

interface NodeCircleProps {
  id: string;
  cx: number; cy: number; r: number;
  imageUrl?: string; name: string;
  isCenter?: boolean; color?: string; dimmed?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function NodeCircle({ id, cx, cy, r, imageUrl, name, isCenter, color, dimmed, onClick, onMouseEnter, onMouseLeave }: NodeCircleProps) {
  const clipId = `clip-${id}`;
  const borderColor = isCenter ? '#6366f1' : (color ?? '#9ca3af');
  const borderW = isCenter ? 4 : 3;
  return (
    <g
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: onClick ? 'pointer' : 'default', opacity: dimmed ? 0.35 : 1, transition: 'opacity 0.2s' }}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={r - borderW} />
        </clipPath>
      </defs>
      <circle cx={cx + 2} cy={cy + 2} r={r} fill="rgba(0,0,0,0.25)" />
      <circle cx={cx} cy={cy} r={r} fill="white" stroke={borderColor} strokeWidth={borderW} />
      {imageUrl ? (
        <image
          href={imageUrl}
          x={cx - r + borderW} y={cy - r + borderW}
          width={(r - borderW) * 2} height={(r - borderW) * 2}
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <text
          x={cx} y={cy + (isCenter ? 9 : 7)}
          textAnchor="middle" fill={borderColor}
          fontSize={isCenter ? 28 : 20} fontWeight="bold"
        >
          {name.charAt(0)}
        </text>
      )}
      {isCenter && (
        <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.4" />
      )}
      <text
        x={cx} y={cy + r + (isCenter ? 18 : 15)}
        textAnchor="middle" fill="white"
        fontSize={isCenter ? 13 : 11} fontWeight={isCenter ? '700' : '500'}
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
      >
        {name.length > 8 ? name.slice(0, 8) + '…' : name}
      </text>
    </g>
  );
}

// ---- Main component --------------------------------------------------------

interface Props {
  profile: VTuberProfile;
  allProfiles: VTuberProfile[];
  onClose: () => void;
  onSelectProfile: (p: VTuberProfile) => void;
}

export function RelationshipGraphModal({ profile, allProfiles, onClose, onSelectProfile }: Props) {
  const { pushModal, popModal } = useApp();
  useEffect(() => { pushModal(); return popModal; }, []);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const rels: VTuberRelationship[] = profile.relationships ?? [];
  type RelEntry = { rel: VTuberRelationship; p: VTuberProfile };
  const related: RelEntry[] = rels
    .map(rel => ({ rel, p: allProfiles.find(ap => ap.id === rel.targetId) }))
    .filter((r): r is RelEntry => !!r.p);

  const orbitR = getOrbitR(related.length);

  function renderEdge(
    rel: VTuberRelationship,
    p: VTuberProfile,
    pos: { x: number; y: number },
    idx: number,
  ) {
    const ci = idx % PALETTE.length;
    const color = PALETTE[ci];
    const isHovered = hoveredId === p.id;
    const isDimmed = hoveredId !== null && !isHovered;
    const sw = isHovered ? 3 : 2;
    const sop = isHovered ? 1 : 0.78;
    const opacity = isDimmed ? 0.18 : 1;
    const endMk = `url(#me-${ci})`;
    const startMk = `url(#ms-${ci})`;
    const dir = rel.direction ?? 'both';

    // ── Bidirectional ───────────────────────────────────────────────────────
    if (dir === 'both') {
      const isSame = !rel.reverseLabel || rel.reverseLabel === rel.label;

      if (isSame) {
        // Same label → single double-headed arrow
        const src = edgePoint(CX, CY, pos.x, pos.y, CENTER_R + 6);
        const dst = edgePoint(pos.x, pos.y, CX, CY, NODE_R + 6);
        return (
          <g key={p.id} style={{ opacity, transition: 'opacity 0.2s' }}>
            <line
              x1={src.x} y1={src.y} x2={dst.x} y2={dst.y}
              stroke={color} strokeWidth={sw} strokeOpacity={sop}
              markerStart={startMk} markerEnd={endMk}
            />
            <RelLabel
              x={(src.x + dst.x) / 2} y={(src.y + dst.y) / 2}
              text={rel.label} color={color}
            />
          </g>
        );
      }

      // Different labels → two arcs bowing to opposite sides.
      // The two label centres are separated by exactly `bow` pixels along
      // the perpendicular axis (derived from bezierMid = mid + perp*bow/2),
      // so we compute bow from the actual pixel widths of both labels to
      // guarantee they never overlap regardless of string length.
      const lw_a = Math.max(36, rel.label.length * 14 + 16);
      const lw_b = Math.max(36, rel.reverseLabel!.length * 14 + 16);
      const bow = Math.max(MIN_BOW, lw_a / 2 + lw_b / 2 + 14);

      const { ox, oy } = perpUnit(CX, CY, pos.x, pos.y);

      // Arc A: center → target  (bows toward +perp side)
      const aSrc = edgePoint(CX, CY, pos.x, pos.y, CENTER_R + 6);
      const aDst = edgePoint(pos.x, pos.y, CX, CY, NODE_R + 6);
      const aMx = (aSrc.x + aDst.x) / 2;
      const aMy = (aSrc.y + aDst.y) / 2;
      const aCpX = aMx + ox * bow;
      const aCpY = aMy + oy * bow;
      const aLabelPt = bezierMid(aSrc.x, aSrc.y, aCpX, aCpY, aDst.x, aDst.y);

      // Arc B: target → center  (bows toward −perp side)
      const bSrc = edgePoint(pos.x, pos.y, CX, CY, NODE_R + 6);
      const bDst = edgePoint(CX, CY, pos.x, pos.y, CENTER_R + 6);
      const bMx = (bSrc.x + bDst.x) / 2;
      const bMy = (bSrc.y + bDst.y) / 2;
      const bCpX = bMx - ox * bow;
      const bCpY = bMy - oy * bow;
      const bLabelPt = bezierMid(bSrc.x, bSrc.y, bCpX, bCpY, bDst.x, bDst.y);

      return (
        <g key={p.id} style={{ opacity, transition: 'opacity 0.2s' }}>
          <path
            d={`M ${aSrc.x} ${aSrc.y} Q ${aCpX} ${aCpY} ${aDst.x} ${aDst.y}`}
            fill="none" stroke={color} strokeWidth={sw} strokeOpacity={sop}
            markerEnd={endMk}
          />
          <path
            d={`M ${bSrc.x} ${bSrc.y} Q ${bCpX} ${bCpY} ${bDst.x} ${bDst.y}`}
            fill="none" stroke={color} strokeWidth={sw} strokeOpacity={sop}
            markerEnd={endMk}
          />
          <RelLabel x={aLabelPt.x} y={aLabelPt.y} text={rel.label} color={color} />
          <RelLabel x={bLabelPt.x} y={bLabelPt.y} text={rel.reverseLabel!} color={color} />
        </g>
      );
    }

    // ── Unidirectional ──────────────────────────────────────────────────────
    const src = dir === 'to'
      ? edgePoint(CX, CY, pos.x, pos.y, CENTER_R + 6)
      : edgePoint(pos.x, pos.y, CX, CY, NODE_R + 6);
    const dst = dir === 'to'
      ? edgePoint(pos.x, pos.y, CX, CY, NODE_R + 6)
      : edgePoint(CX, CY, pos.x, pos.y, CENTER_R + 6);
    return (
      <g key={p.id} style={{ opacity, transition: 'opacity 0.2s' }}>
        <line
          x1={src.x} y1={src.y} x2={dst.x} y2={dst.y}
          stroke={color} strokeWidth={sw} strokeOpacity={sop}
          markerEnd={endMk}
        />
        <RelLabel
          x={(src.x + dst.x) / 2} y={(src.y + dst.y) / 2}
          text={rel.label} color={color}
        />
      </g>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative w-full max-w-3xl mx-2 sm:mx-6">
        {/* Title bar */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-white/70 text-sm tracking-widest">相関図 — {profile.name}</span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white/70 hover:text-white transition-colors"
            aria-label="閉じる"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '82vh' }}>
          <defs>
            {PALETTE.map((color, i) => (
              <g key={i}>
                {/* markerEnd: tip at line end, points forward (toward node) */}
                <marker
                  id={`me-${i}`}
                  markerWidth="9" markerHeight="7"
                  refX="9" refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 9 3.5, 0 7" fill={color} fillOpacity="0.9" />
                </marker>
                {/* markerStart: reversed polygon, tip at line start, points outward */}
                <marker
                  id={`ms-${i}`}
                  markerWidth="9" markerHeight="7"
                  refX="0" refY="3.5"
                  orient="auto"
                >
                  <polygon points="9 0, 0 3.5, 9 7" fill={color} fillOpacity="0.9" />
                </marker>
              </g>
            ))}
          </defs>

          {/* Decorative orbit rings */}
          <circle cx={CX} cy={CY} r={orbitR}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx={CX} cy={CY} r={orbitR * 0.58}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 6" />

          {/* Edges first so nodes render above them */}
          {related.map(({ rel, p }, idx) =>
            renderEdge(rel, p, calcPos(idx, related.length, orbitR), idx)
          )}

          {/* Peripheral nodes */}
          {related.map(({ p }, idx) => {
            const pos = calcPos(idx, related.length, orbitR);
            return (
              <NodeCircle
                key={p.id}
                id={`rel-${p.id}`}
                cx={pos.x} cy={pos.y} r={NODE_R}
                imageUrl={p.imageUrls?.[0] ?? p.imageUrl}
                name={p.name}
                color={PALETTE[idx % PALETTE.length]}
                dimmed={hoveredId !== null && hoveredId !== p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => { onSelectProfile(p); onClose(); }}
              />
            );
          })}

          {/* Center node rendered last — sits on top of all edges */}
          <NodeCircle
            id="center"
            cx={CX} cy={CY} r={CENTER_R}
            imageUrl={profile.imageUrls?.[0] ?? profile.imageUrl}
            name={profile.name}
            isCenter
          />

          {related.length === 0 && (
            <text x={CX} y={CY + 120}
              textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="14">
              関係値が登録されていません
            </text>
          )}
        </svg>

        <p className="text-center text-white/30 text-xs mt-2">
          どこかクリックで閉じる / 関係VTuberをクリックでページ移動
        </p>
      </div>
    </div>
  );
}
