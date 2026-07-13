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
const H = 620;
const CX = W / 2;
const CY = H / 2;
const CENTER_R = 52;
const NODE_R = 36;
const PERP_OFFSET = 8; // 双方向線の平行オフセット距離

function getOrbitR(count: number) {
  if (count <= 3) return 190;
  if (count <= 5) return 210;
  return 230;
}

function calcPos(i: number, total: number, orbitR: number) {
  const angle = (2 * Math.PI * i / total) - Math.PI / 2;
  return { x: CX + orbitR * Math.cos(angle), y: CY + orbitR * Math.sin(angle) };
}

// 線の端点（ノード円の縁）
function edgePoint(fromX: number, fromY: number, toX: number, toY: number, r: number) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = Math.sqrt(dx * dx + dy * dy);
  return { x: fromX + dx / len * r, y: fromY + dy / len * r };
}

// 2点間の垂直方向単位ベクトル
function perpUnit(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  return { ox: -dy / len, oy: dx / len };
}

interface LabelProps {
  x: number;
  y: number;
  text: string;
  color: string;
}

function RelLabel({ x, y, text, color }: LabelProps) {
  const labelW = text.length * 13 + 12;
  const labelH = 22;
  return (
    <g>
      <rect
        x={x - labelW / 2}
        y={y - labelH / 2}
        width={labelW}
        height={labelH}
        rx="5"
        fill="rgba(15,15,30,0.85)"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.7"
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fill={color}
        fontSize="12"
        fontWeight="600"
      >
        {text}
      </text>
    </g>
  );
}

interface NodeImageProps {
  id: string;
  cx: number;
  cy: number;
  r: number;
  imageUrl?: string;
  name: string;
  isCenter?: boolean;
  color?: string;
  dimmed?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function NodeCircle({ id, cx, cy, r, imageUrl, name, isCenter, color, dimmed, onClick, onMouseEnter, onMouseLeave }: NodeImageProps) {
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
          x={cx - r + borderW}
          y={cy - r + borderW}
          width={(r - borderW) * 2}
          height={(r - borderW) * 2}
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <text
          x={cx} y={cy + (isCenter ? 9 : 7)}
          textAnchor="middle"
          fill={borderColor}
          fontSize={isCenter ? 28 : 20}
          fontWeight="bold"
        >
          {name.charAt(0)}
        </text>
      )}

      {isCenter && (
        <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.4" />
      )}

      <text
        x={cx}
        y={cy + r + (isCenter ? 18 : 15)}
        textAnchor="middle"
        fill="white"
        fontSize={isCenter ? 13 : 11}
        fontWeight={isCenter ? '700' : '500'}
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
      >
        {name.length > 8 ? name.slice(0, 8) + '…' : name}
      </text>
    </g>
  );
}

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

  // 各方向線を描画するヘルパー
  function renderLines(rel: VTuberRelationship, p: VTuberProfile, pos: { x: number; y: number }, i: number, isDimmed: boolean, isHovered: boolean) {
    const color = PALETTE[i % PALETTE.length];
    const dir = rel.direction ?? 'both';
    const markerId = `arrow-end-${i % PALETTE.length}`;
    const sw = isHovered ? 3 : 2;
    const sop = isHovered ? 1 : 0.8;

    if (dir === 'both') {
      // 2本の平行オフセット線に分割して双方向を表現
      const { ox, oy } = perpUnit(CX, CY, pos.x, pos.y);
      const px = ox * PERP_OFFSET, py = oy * PERP_OFFSET;

      // 線A: center → target（+ offset）
      const a_src = edgePoint(CX, CY, pos.x, pos.y, CENTER_R + 6);
      const a_dst = edgePoint(pos.x, pos.y, CX, CY, NODE_R + 6);
      const a1x = a_src.x + px, a1y = a_src.y + py;
      const a2x = a_dst.x + px, a2y = a_dst.y + py;
      const aMidX = (a1x + a2x) / 2, aMidY = (a1y + a2y) / 2;

      // 線B: target → center（- offset）
      const b_src = edgePoint(pos.x, pos.y, CX, CY, NODE_R + 6);
      const b_dst = edgePoint(CX, CY, pos.x, pos.y, CENTER_R + 6);
      const b1x = b_src.x - px, b1y = b_src.y - py;
      const b2x = b_dst.x - px, b2y = b_dst.y - py;
      const bMidX = (b1x + b2x) / 2, bMidY = (b1y + b2y) / 2;

      const hasReverse = !!rel.reverseLabel && rel.reverseLabel !== rel.label;

      return (
        <g key={p.id} style={{ opacity: isDimmed ? 0.2 : 1, transition: 'opacity 0.2s' }}>
          {/* 線A: center → target */}
          <line x1={a1x} y1={a1y} x2={a2x} y2={a2y}
            stroke={color} strokeWidth={sw} strokeOpacity={sop}
            markerEnd={`url(#${markerId})`}
          />
          {/* 線B: target → center */}
          <line x1={b1x} y1={b1y} x2={b2x} y2={b2y}
            stroke={color} strokeWidth={sw} strokeOpacity={sop}
            markerEnd={`url(#${markerId})`}
          />
          {/* ラベル */}
          {hasReverse ? (
            <>
              <RelLabel x={aMidX} y={aMidY} text={rel.label} color={color} />
              <RelLabel x={bMidX} y={bMidY} text={rel.reverseLabel!} color={color} />
            </>
          ) : (
            // 対称の場合は2線の中間にラベルを1つ
            <RelLabel
              x={(aMidX + bMidX) / 2}
              y={(aMidY + bMidY) / 2}
              text={rel.label}
              color={color}
            />
          )}
        </g>
      );
    }

    // 単方向
    const isCenterToTarget = dir === 'to';
    const src = isCenterToTarget
      ? edgePoint(CX, CY, pos.x, pos.y, CENTER_R + 6)
      : edgePoint(pos.x, pos.y, CX, CY, NODE_R + 6);
    const dst = isCenterToTarget
      ? edgePoint(pos.x, pos.y, CX, CY, NODE_R + 6)
      : edgePoint(CX, CY, pos.x, pos.y, CENTER_R + 6);
    const midX = (src.x + dst.x) / 2, midY = (src.y + dst.y) / 2;

    return (
      <g key={p.id} style={{ opacity: isDimmed ? 0.2 : 1, transition: 'opacity 0.2s' }}>
        <line x1={src.x} y1={src.y} x2={dst.x} y2={dst.y}
          stroke={color} strokeWidth={sw} strokeOpacity={sop}
          markerEnd={`url(#${markerId})`}
        />
        <RelLabel x={midX} y={midY} text={rel.label} color={color} />
      </g>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl mx-2 sm:mx-6"
      >
        {/* タイトル + 閉じるボタン */}
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

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '80vh' }}>
          <defs>
            {PALETTE.map((color, i) => (
              <marker
                key={`me-${i}`}
                id={`arrow-end-${i}`}
                markerWidth="9" markerHeight="7"
                refX="9" refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 9 3.5, 0 7" fill={color} fillOpacity="0.9" />
              </marker>
            ))}
          </defs>

          {/* 背景グリッド */}
          <circle cx={CX} cy={CY} r={orbitR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx={CX} cy={CY} r={orbitR * 0.6} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 6" />

          {/* 関係線 */}
          {related.map(({ rel, p }, i) => {
            const pos = calcPos(i, related.length, orbitR);
            const isHovered = hoveredId === p.id;
            const isDimmed = hoveredId !== null && !isHovered;
            return renderLines(rel, p, pos, i, isDimmed, isHovered);
          })}

          {/* 関係 VTuber ノード */}
          {related.map(({ rel, p }, i) => {
            const pos = calcPos(i, related.length, orbitR);
            const color = PALETTE[i % PALETTE.length];
            const isDimmed = hoveredId !== null && hoveredId !== p.id;
            return (
              <NodeCircle
                key={p.id}
                id={`rel-${p.id}`}
                cx={pos.x}
                cy={pos.y}
                r={NODE_R}
                imageUrl={p.imageUrls?.[0] ?? p.imageUrl}
                name={p.name}
                color={color}
                dimmed={isDimmed}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => { onSelectProfile(p); onClose(); }}
              />
            );
          })}

          {/* 中心ノード（最前面） */}
          <NodeCircle
            id="center"
            cx={CX}
            cy={CY}
            r={CENTER_R}
            imageUrl={profile.imageUrls?.[0] ?? profile.imageUrl}
            name={profile.name}
            isCenter
          />

          {related.length === 0 && (
            <text x={CX} y={CY + 110} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="14">
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
