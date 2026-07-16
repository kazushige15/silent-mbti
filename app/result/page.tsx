'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

type AxisKey = 'time' | 'relations' | 'cognition' | 'interest' | 'activity' | 'values';
type Group = 'env' | 'mind';

interface AxisInfo {
  label: string;
  group: Group;
  icon: string;
  activeLetter: string;
  activeLabel: string;
  silentLabel: string;
  activeDesc: string;
  silentDesc: string;
}

const AXIS_INFO: Record<AxisKey, AxisInfo> = {
  time: {
    label: '時間',
    group: 'env',
    icon: '⏰',
    activeLetter: 'A',
    activeLabel: '活動的（多忙・多趣味）',
    silentLabel: 'サイレント（在宅・暇）',
    activeDesc:
      '普段から予定が埋まりがちで、地域活動に割ける時間的な余白が少ないタイプです。優先順位を変えるより、短時間・単発で参加できる関わり方が向いています。',
    silentDesc:
      '時間的な余裕はあるものの、それが地域活動には向かっていないタイプです。「暇だから」だけでは参加のきっかけになりにくい状態です。',
  },
  relations: {
    label: '人間関係',
    group: 'env',
    icon: '🤝',
    activeLetter: 'O',
    activeLabel: '社交的（オープン）',
    silentLabel: 'サイレント（単独好み）',
    activeDesc:
      '人との関わりに抵抗がなく、初対面の相手とも自然に会話ができるタイプです。地域の輪に入ること自体へのハードルは低い状態です。',
    silentDesc:
      '人間関係は最小限にとどめたいタイプです。近所付き合いや新しいコミュニティへの参加には、心理的なハードルを感じやすい状態です。',
  },
  cognition: {
    label: '認知',
    group: 'env',
    icon: '📰',
    activeLetter: 'I',
    activeLabel: '情報敏感',
    silentLabel: 'サイレント（情報遮断）',
    activeDesc:
      '地域の情報を能動的に収集する習慣があります。回覧板や広報誌、SNSなど複数の経路から情報を得ているタイプです。',
    silentDesc:
      '地域の情報がそもそも届いていない、または届いても目に留まらないタイプです。関心以前に「知る手段」自体が不足している可能性があります。',
  },
  interest: {
    label: '興味',
    group: 'mind',
    icon: '👀',
    activeLetter: 'T',
    activeLabel: 'トレンド・地域に敏感',
    silentLabel: 'サイレント（低関心）',
    activeDesc:
      '新しいお店や地域の変化に対して、自然と関心が向くタイプです。街の変化そのものを楽しめる感性を持っています。',
    silentDesc:
      '街の変化や地域のトレンドに対して、そもそも関心の矛先が向きにくいタイプです。無理に関心を持たせるより、別の切り口が必要です。',
  },
  activity: {
    label: '活動',
    group: 'mind',
    icon: '🚶',
    activeLetter: 'F',
    activeLabel: 'フットワークが軽い',
    silentLabel: 'サイレント（未経験）',
    activeDesc:
      '気になったら実際に足を運んでみる行動力があります。「誰でも歓迎」に対して物怖じせず飛び込めるタイプです。',
    silentDesc:
      '興味があっても、実際の行動に移すハードルが高いタイプです。参加経験がないこと自体が、次の一歩を重くしています。',
  },
  values: {
    label: '価値観',
    group: 'mind',
    icon: '💛',
    activeLetter: 'V',
    activeLabel: '他者貢献',
    silentLabel: 'サイレント（自己完結）',
    activeDesc:
      '自分が暮らす地域に対して、何か還元したい・貢献したいという意識を持っているタイプです。',
    silentDesc:
      '地域活動を「客として楽しむもの」と捉え、運営側に回ることへの動機づけが弱いタイプです。自己完結志向が強い状態です。',
  },
};

const AXIS_ORDER: AxisKey[] = ['time', 'relations', 'cognition', 'interest', 'activity', 'values'];
const ENV_AXES: AxisKey[] = ['time', 'relations', 'cognition'];
const MIND_AXES: AxisKey[] = ['interest', 'activity', 'values'];

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getScore = (key: AxisKey) => parseInt(searchParams.get(key) || '0', 10);
  const scores = Object.fromEntries(AXIS_ORDER.map((k) => [k, getScore(k)])) as Record<AxisKey, number>;

  // スコア >= 0 なら「活動的」側の文字（A/O/I/T/F/V）、負なら「S」
  const isSilent = Object.fromEntries(
    AXIS_ORDER.map((k) => [k, scores[k] < 0])
  ) as Record<AxisKey, boolean>;

  const typeCode = AXIS_ORDER.map((k) => (isSilent[k] ? 'S' : AXIS_INFO[k].activeLetter)).join('');
  const silentCount = AXIS_ORDER.filter((k) => isSilent[k]).length;

  // スコア理論値は4問構成 × (±1 or ±2) = -8 〜 +8
  // 「サイレント度(%)」として 0%(フル活動的) 〜 100%(フルサイレント) にマッピング
  const getSilentPercent = (key: AxisKey) => {
    const s = scores[key];
    return Math.max(0, Math.min(100, ((8 - s) / 16) * 100));
  };

  const envSilentCount = ENV_AXES.filter((k) => isSilent[k]).length;
  const mindSilentCount = MIND_AXES.filter((k) => isSilent[k]).length;

  let overallLabel = '';
  let overallDesc = '';
  if (envSilentCount >= 2 && mindSilentCount >= 2) {
    overallLabel = '真性サイレント層';
    overallDesc =
      '「状況の壁」と「意識の壁」の両方が高いタイプです。物理的な余裕のなさと、心理的なハードルの両方が重なっているため、参加への導線そのものを見直す必要があります。';
  } else if (envSilentCount >= 2 && mindSilentCount < 2) {
    overallLabel = '状況的サイレント層（環境要因型）';
    overallDesc =
      '興味や関心はあるのに、時間・人間関係・情報という「状況の壁」に阻まれているタイプです。参加意欲を高める工夫より、参加コストを下げる工夫の方が効果的です。';
  } else if (envSilentCount < 2 && mindSilentCount >= 2) {
    overallLabel = '意識的サイレント層（意識要因型）';
    overallDesc =
      '時間や機会には比較的恵まれているのに、関心や行動意欲、貢献意識という「意識の壁」が高いタイプです。参加のしやすさよりも、動機づけの設計が鍵になります。';
  } else {
    overallLabel = 'アクティブ層';
    overallDesc =
      '状況・意識どちらの壁も低く、地域活動に対して積極的に関わっていけるタイプです。';
  }

  const totalSilentPercent = Math.round((silentCount / AXIS_ORDER.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ヘッダーカード */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
          <p className="text-sm font-bold text-indigo-500 tracking-widest uppercase mb-2">あなたの診断タイプ</p>
          <h1 className="text-6xl font-black text-slate-800 tracking-tighter mb-3">{typeCode}</h1>
          <p className="inline-block bg-indigo-50 text-indigo-700 font-bold text-sm px-4 py-1.5 rounded-full mb-4">
            {overallLabel}
          </p>
          <p className="text-slate-500 leading-relaxed max-w-md mx-auto">{overallDesc}</p>
          <p className="text-xs text-slate-300 font-medium mt-4">全64パターン（2×2×2×2×2×2）中のあなたのタイプ</p>
        </div>

        {/* ① 性格特性 バー一覧 */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">1</span>
            <h2 className="text-lg font-black text-slate-800">性格特性</h2>
          </div>

          <div className="space-y-8">
            {AXIS_ORDER.map((key) => {
              const info = AXIS_INFO[key];
              const silentPct = getSilentPercent(key);
              const dominant = silentPct >= 50 ? 'silent' : 'active';
              const dominantPct = dominant === 'silent' ? Math.round(silentPct) : Math.round(100 - silentPct);
              const dominantLabel = dominant === 'silent' ? info.silentLabel : info.activeLabel;
              const dominantDesc = dominant === 'silent' ? info.silentDesc : info.activeDesc;

              return (
                <div key={key} className="flex flex-col md:flex-row gap-5 md:items-center">
                  <div className="flex-1">
                    <div className="text-center mb-1">
                      <span className={`text-2xl font-black ${dominant === 'silent' ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {dominantPct}%
                      </span>
                      <span className="ml-1 text-sm font-bold text-slate-600">{dominantLabel}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-bold mb-1 px-1">
                      <span>{info.activeLabel}</span>
                      <span className="text-slate-300">{info.label}</span>
                      <span>{info.silentLabel}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-slate-300 to-rose-400"></div>
                      <div
                        className="absolute top-1/2 w-4 h-4 bg-white border-2 border-slate-700 rounded-full shadow-md transition-all duration-500"
                        style={{ left: `${silentPct}%`, transform: 'translate(-50%, -50%)' }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:w-64 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-2xl">{info.icon}</div>
                    <p className="text-xs text-slate-500 leading-relaxed">{dominantDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ② サイレント要因分析（ベン図） */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center">2</span>
            <h2 className="text-lg font-black text-slate-800">サイレント要因分析</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            6項目中 <span className="font-bold text-rose-500">{silentCount}項目</span> がサイレント傾向（全体の{totalSilentPercent}%）
          </p>

          <svg viewBox="0 0 480 320" className="w-full max-w-md mx-auto">
            {/* 環境系サークル */}
            <circle cx="185" cy="160" r="140" fill="#818cf8" fillOpacity="0.12" stroke="#6366f1" strokeWidth="2" />
            {/* 行動系サークル */}
            <circle cx="295" cy="160" r="140" fill="#fb7185" fillOpacity="0.12" stroke="#f43f5e" strokeWidth="2" />

            <text x="90" y="40" fontSize="13" fontWeight="700" fill="#4338ca">環境系（状況の壁）</text>
            <text x="330" y="40" fontSize="13" fontWeight="700" fill="#be123c" textAnchor="end">行動系（意識の壁）</text>

            {/* 中央：総合判定バッジ */}
            <g>
              <rect x="180" y="140" width="120" height="44" rx="22" fill="#1e293b" />
              <text x="240" y="158" fontSize="10" fill="#ffffff" textAnchor="middle" fontWeight="700">総合タイプ</text>
              <text x="240" y="174" fontSize="9.5" fill="#f1f5f9" textAnchor="middle">{overallLabel}</text>
            </g>

            {/* 環境系の3軸（左寄り配置） */}
            {ENV_AXES.map((key, i) => {
              const info = AXIS_INFO[key];
              const cx = 100 + i * 5;
              const cy = 100 + i * 60;
              const silent = isSilent[key];
              return (
                <g key={key}>
                  <circle cx={cx} cy={cy} r="34" fill={silent ? '#fda4af' : '#e2e8f0'} stroke={silent ? '#e11d48' : '#94a3b8'} strokeWidth="2" />
                  <text x={cx} y={cy - 3} fontSize="10.5" fontWeight="700" textAnchor="middle" fill={silent ? '#881337' : '#475569'}>{info.label}</text>
                  <text x={cx} y={cy + 11} fontSize="8.5" textAnchor="middle" fill={silent ? '#9f1239' : '#64748b'}>{silent ? 'サイレント' : info.activeLetter}</text>
                </g>
              );
            })}

            {/* 行動系の3軸（右寄り配置） */}
            {MIND_AXES.map((key, i) => {
              const info = AXIS_INFO[key];
              const cx = 380 - i * 5;
              const cy = 100 + i * 60;
              const silent = isSilent[key];
              return (
                <g key={key}>
                  <circle cx={cx} cy={cy} r="34" fill={silent ? '#fda4af' : '#e2e8f0'} stroke={silent ? '#e11d48' : '#94a3b8'} strokeWidth="2" />
                  <text x={cx} y={cy - 3} fontSize="10.5" fontWeight="700" textAnchor="middle" fill={silent ? '#881337' : '#475569'}>{info.label}</text>
                  <text x={cx} y={cy + 11} fontSize="8.5" textAnchor="middle" fill={silent ? '#9f1239' : '#64748b'}>{silent ? 'サイレント' : info.activeLetter}</text>
                </g>
              );
            })}
          </svg>

          <div className="flex justify-center gap-6 mt-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-300 border-2 border-rose-500 inline-block"></span>
              <span className="text-slate-500">サイレント該当項目</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200 border-2 border-slate-400 inline-block"></span>
              <span className="text-slate-500">非該当項目</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/diagnostic')}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg"
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