'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

// --- 設定データ（画像のデザインに合わせたラベル定義） ---
const AXIS_INFO = {
  time: { label: '時間', active: '活動的', silent: '暇/在宅' },
  relations: { label: '人間関係', active: '社交的', silent: '単独好み' },
  cognition: { label: '認知', active: '情報敏感', silent: '情報遮断' },
  interest: { label: '興味', active: '敏感', silent: '無関心' },
  activity: { label: '活動', active: '行動派', silent: '未経験' },
  values: { label: '価値観', active: '貢献志向', silent: '自己完結' },
};

const AXIS_ORDER = ['time', 'relations', 'cognition', 'interest', 'activity', 'values'];

// --- UIコンポーネント ---

// 1. スライダーバー
const SliderBar = ({ label, activeLabel, silentLabel, score }: any) => {
  // スコア -8〜+8 を 0〜100% に変換 (左が活動的、右がサイレント)
  // 計算: (-8 → 0%, 0 → 50%, +8 → 100%)
  const percentage = ((score + 8) / 16) * 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-xs text-slate-500 mb-1 px-1">
        <span>{activeLabel}</span>
        <span className="font-bold text-indigo-700">{label}</span>
        <span>{silentLabel}</span>
      </div>
      <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-600">
        <div 
          className="absolute top-0 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full shadow-md transition-all duration-500"
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  );
};

// 2. ベン図（SVG）
const VennDiagrams = () => (
  <div className="flex justify-center gap-8 mb-10 overflow-x-auto p-4">
    {/* 環境系 */}
    <div className="text-center">
      <p className="text-xs font-bold text-slate-500 mb-2">環境系（状況の壁）</p>
      <svg width="200" height="140" viewBox="0 0 200 140">
        <circle cx="70" cy="70" r="50" fill="#38bdf8" fillOpacity="0.2" />
        <circle cx="130" cy="70" r="50" fill="#fbbf24" fillOpacity="0.2" />
        <text x="100" y="70" fontSize="10" textAnchor="middle" fontWeight="bold">時間/関係/認知</text>
      </svg>
    </div>
    {/* 行動系 */}
    <div className="text-center">
      <p className="text-xs font-bold text-slate-500 mb-2">行動系（意識の壁）</p>
      <svg width="200" height="140" viewBox="0 0 200 140">
        <circle cx="70" cy="70" r="50" fill="#34d399" fillOpacity="0.2" />
        <circle cx="130" cy="70" r="50" fill="#a78bfa" fillOpacity="0.2" />
        <text x="100" y="70" fontSize="10" textAnchor="middle" fontWeight="bold">興味/活動/価値観</text>
      </svg>
    </div>
  </div>
);

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // スコア取得（前回までのロジックを流用）
  const getScore = (key: string) => parseInt(searchParams.get(key) || '0', 10);
  
  // A(Active), S(Silent) の判定
  const typeCode = AXIS_ORDER.map((k) => (getScore(k) >= 0 ? 'A' : 'S')).join('');

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-6">
        
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <p className="text-indigo-600 font-bold mb-2">あなたの診断タイプ</p>
          <h1 className="text-5xl font-black text-slate-800 tracking-tight">{typeCode}</h1>
        </div>

        {/* ベン図 */}
        <VennDiagrams />

        {/* スライダー一覧 */}
        <div className="space-y-2">
          {AXIS_ORDER.map((key) => {
            const info = AXIS_INFO[key as keyof typeof AXIS_INFO];
            const score = getScore(key);
            return (
              <SliderBar 
                key={key}
                label={info.label}
                activeLabel={info.active}
                silentLabel={info.silent}
                score={score}
              />
            );
          })}
        </div>

        <button
          onClick={() => router.push('/diagnostic')}
          className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ResultContent />
    </Suspense>
  );
}