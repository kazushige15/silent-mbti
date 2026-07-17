'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

type AxisKey = 'time' | 'relations' | 'cognition' | 'interest' | 'activity' | 'values';

interface AxisInfo {
  label: string;
  activeLabel: string;
  silentLabel: string;
  silentFill: string;
  silentStroke: string;
}

const AXIS_INFO: Record<AxisKey, AxisInfo> = {
  time: { label: '時間', activeLabel: '活動的', silentLabel: '暇/在宅', silentFill: '#cbd5e1', silentStroke: '#64748b' },
  relations: { label: '人間関係', activeLabel: '社交的', silentLabel: '単独好み', silentFill: '#93c5fd', silentStroke: '#2563eb' },
  cognition: { label: '認知', activeLabel: '情報敏感', silentLabel: '情報遮断', silentFill: '#fcd34d', silentStroke: '#d97706' },
  interest: { label: '興味', activeLabel: '敏感', silentLabel: '無関心', silentFill: '#5eead4', silentStroke: '#0d9488' },
  activity: { label: '活動', activeLabel: '行動派', silentLabel: '未経験', silentFill: '#d8b4fe', silentStroke: '#9333ea' },
  values: { label: '価値観', activeLabel: '貢献志向', silentLabel: '自己完結', silentFill: '#6ee7b7', silentStroke: '#059669' },
};

const AXIS_ORDER: AxisKey[] = ['time', 'relations', 'cognition', 'interest', 'activity', 'values'];
const ENV_AXES: AxisKey[] = ['time', 'relations', 'cognition'];
const MIND_AXES: AxisKey[] = ['interest', 'activity', 'values'];

const INACTIVE_FILL = '#f1f5f9';
const INACTIVE_STROKE = '#cbd5e1';

// 3円ベン図（三角配置）。axes = [上, 左下, 右下]
function VennTriple({ axes, isSilent }: { axes: AxisKey[]; isSilent: Record<AxisKey, boolean> }) {
  const positions = [
    { cx: 110, cy: 72, labelX: 110, labelY: 46 },   // 上
    { cx: 80, cy: 122, labelX: 55, labelY: 150 },   // 左下
    { cx: 140, cy: 122, labelX: 165, labelY: 150 }, // 右下
  ];

  return (
    <svg viewBox="0 0 220 180" className="w-full max-w-[220px] mx-auto">
      {axes.map((key, i) => {
        const info = AXIS_INFO[key];
        const silent = isSilent[key];
        const pos = positions[i];
        const fill = silent ? info.silentFill : INACTIVE_FILL;
        const stroke = silent ? info.silentStroke : INACTIVE_STROKE;
        return (
          <circle
            key={key}
            cx={pos.cx}
            cy={pos.cy}
            r="58"
            fill={fill}
            fillOpacity={silent ? 0.55 : 0.5}
            stroke={stroke}
            strokeWidth={silent ? 2 : 1.5}
          />
        );
      })}
      {axes.map((key, i) => {
        const info = AXIS_INFO[key];
        const silent = isSilent[key];
        const pos = positions[i];
        return (
          <g key={`${key}-label`}>
            {silent && (
              <>
                <circle cx={pos.labelX} cy={pos.labelY - 14} r="4" fill={info.silentStroke} />
                <circle cx={pos.labelX} cy={pos.labelY - 14} r="7" fill="none" stroke={info.silentStroke} strokeWidth="1.5" opacity="0.5" />
              </>
            )}
            <text
              x={pos.labelX}
              y={pos.labelY}
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
              fill={silent ? '#1e293b' : '#94a3b8'}
            >
              {info.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getScore = (key: AxisKey) => parseInt(searchParams.get(key) || '0', 10);
  const scores = Object.fromEntries(AXIS_ORDER.map((k) => [k, getScore(k)])) as Record<AxisKey, number>;

  const isSilent = Object.fromEntries(
    AXIS_ORDER.map((k) => [k, scores[k] < 0])
  ) as Record<AxisKey, boolean>;

  const activeLetters: Record<AxisKey, string> = {
    time: 'A', relations: 'O', cognition: 'I', interest: 'T', activity: 'F', values: 'V',
  };
  const typeCode = AXIS_ORDER.map((k) => (isSilent[k] ? 'S' : activeLetters[k])).join('');

  // スコア理論値 -8〜+8 → サイレント度 0%(フル活動的)〜100%(フルサイレント)
  const getSilentPercent = (key: AxisKey) => {
    const s = scores[key];
    return Math.max(0, Math.min(100, ((8 - s) / 16) * 100));
  };

  return (
    <div className="min-h-screen bg-white py-14 px-6">
      <div className="max-w-md mx-auto">

        {/* ヘッダー */}
        <div className="text-center mb-10">
          <p className="text-indigo-500 font-bold text-lg mb-3">あなたの診断タイプ</p>
          <h1 className="text-7xl font-black text-slate-900 tracking-wide">{typeCode}</h1>
        </div>

        {/* ダブルベン図分析 */}
        <div className="mb-12">
          <h2 className="text-center font-bold text-slate-700 mb-6">サイレント要因のダブルベン図分析</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-center mb-2">
                <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full">
                  環境系（状況の壁）
                </span>
              </div>
              <VennTriple axes={ENV_AXES} isSilent={isSilent} />
            </div>

            <div>
              <div className="flex justify-center mb-2">
                <span className="bg-teal-50 text-teal-600 text-xs font-bold px-3 py-1.5 rounded-full">
                  行動系（意識の壁）
                </span>
              </div>
              <VennTriple axes={MIND_AXES} isSilent={isSilent} />
            </div>
          </div>
        </div>

        {/* スライダーリスト */}
        <div className="space-y-7">
          {AXIS_ORDER.map((key) => {
            const info = AXIS_INFO[key];
            const percent = getSilentPercent(key);
            return (
              <div key={key}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs text-slate-400 font-medium">{info.activeLabel}</span>
                  <span className="text-sm font-bold text-indigo-600">{info.label}</span>
                  <span className="text-xs text-slate-400 font-medium">{info.silentLabel}</span>
                </div>
                <div className="relative h-2 rounded-full bg-gradient-to-r from-teal-400 to-blue-600">
                  <div
                    className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-md border border-slate-200"
                    style={{ left: `${percent}%`, transform: 'translate(-50%, -50%)' }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => router.push('/diagnostic')}
          className="w-full mt-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">読み込み中...</div>}>
      <ResultContent />
    </Suspense>
  );
}