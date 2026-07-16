'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

// --- 型定義 ---
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

// --- 設定データ ---
const AXIS_INFO: Record<AxisKey, AxisInfo> = {
  time: { label: '時間', group: 'env', icon: '⏰', activeLetter: 'A', activeLabel: '活動的', silentLabel: 'サイレント', activeDesc: '多忙・多趣味で余白少なめ。短時間参加が吉。', silentDesc: '在宅・暇があるが地域へ向かっていない。' },
  relations: { label: '人間関係', group: 'env', icon: '🤝', activeLetter: 'O', activeLabel: '社交的', silentLabel: 'サイレント', activeDesc: '人との関わりが自然。ハードル低め。', silentDesc: '単独好み。心理的ハードルが高め。' },
  cognition: { label: '認知', group: 'env', icon: '📰', activeLetter: 'I', activeLabel: '情報敏感', silentLabel: 'サイレント', activeDesc: '能動的な情報収集習慣あり。', silentDesc: '情報遮断。手段が不足している可能性。' },
  interest: { label: '興味', group: 'mind', icon: '👀', activeLetter: 'T', activeLabel: 'トレンド敏感', silentLabel: 'サイレント', activeDesc: '街の変化を楽める感性。', silentDesc: '低関心。別の切り口が必要。' },
  activity: { label: '活動', group: 'mind', icon: '🚶', activeLetter: 'F', activeLabel: 'フットワーク軽', silentLabel: 'サイレント', activeDesc: '気になったら即行動。', silentDesc: '未経験。一歩が重い状態。' },
  values: { label: '価値観', group: 'mind', icon: '💛', activeLetter: 'V', activeLabel: '他者貢献', silentLabel: 'サイレント', activeDesc: '地域へ還元したい意識あり。', silentDesc: '自己完結。運営側の動機が弱い。' },
};

const AXIS_ORDER: AxisKey[] = ['time', 'relations', 'cognition', 'interest', 'activity', 'values'];
const ENV_AXES: AxisKey[] = ['time', 'relations', 'cognition'];
const MIND_AXES: AxisKey[] = ['interest', 'activity', 'values'];

// --- コンポーネント: 6文字表示 ---
const TypeCodeDisplay = ({ code }: { code: string }) => (
  <div className="flex justify-center gap-1.5 md:gap-3 my-8">
    {code.split('').map((char, index) => {
      const isSilent = char === 'S';
      return (
        <div
          key={index}
          className={`w-12 h-16 md:w-16 md:h-20 flex items-center justify-center rounded-2xl text-3xl md:text-4xl font-black shadow-lg border-b-4 
            ${isSilent 
              ? 'bg-rose-100 text-rose-600 border-rose-300' 
              : 'bg-emerald-100 text-emerald-600 border-emerald-300'
            }`}
        >
          {char}
        </div>
      );
    })}
  </div>
);

// --- メインコンテンツ ---
function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getScore = (key: AxisKey) => parseInt(searchParams.get(key) || '0', 10);
  const scores = Object.fromEntries(AXIS_ORDER.map((k) => [k, getScore(k)])) as Record<AxisKey, number>;
  const isSilent = Object.fromEntries(AXIS_ORDER.map((k) => [k, scores[k] < 0])) as Record<AxisKey, boolean>;

  const typeCode = AXIS_ORDER.map((k) => (isSilent[k] ? 'S' : AXIS_INFO[k].activeLetter)).join('');
  const silentCount = AXIS_ORDER.filter((k) => isSilent[k]).length;
  const envSilentCount = ENV_AXES.filter((k) => isSilent[k]).length;
  const mindSilentCount = MIND_AXES.filter((k) => isSilent[k]).length;

  // 判定ロジック
  let overallLabel = '';
  let overallDesc = '';
  if (envSilentCount >= 2 && mindSilentCount >= 2) {
    overallLabel = '真性サイレント層';
    overallDesc = '「状況の壁」と「意識の壁」の両方が高い状態。参加への導線を見直す必要があります。';
  } else if (envSilentCount >= 2 && mindSilentCount < 2) {
    overallLabel = '状況的サイレント層';
    overallDesc = '興味はあるのに「状況の壁」に阻まれている状態。参加コストを下げる工夫が有効です。';
  } else if (envSilentCount < 2 && mindSilentCount >= 2) {
    overallLabel = '意識的サイレント層';
    overallDesc = '余裕はあるのに「意識の壁」が高い状態。動機づけの設計が鍵になります。';
  } else {
    overallLabel = 'アクティブ層';
    overallDesc = '状況・意識どちらの壁も低く、地域活動に対して前向きに関わっていける状態です。';
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* ヘッダーカード */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
          <p className="text-sm font-bold text-indigo-500 tracking-widest uppercase">あなたのタイプ</p>
          <TypeCodeDisplay code={typeCode} />
          <div className="inline-block bg-slate-800 text-white font-bold text-sm px-6 py-2 rounded-full mb-4">
            {overallLabel}
          </div>
          <p className="text-slate-600 leading-relaxed max-w-md mx-auto">{overallDesc}</p>
        </div>

        {/* 詳細セクション（省略：必要に応じて前回のコードを結合してください） */}
        
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <ResultContent />
    </Suspense>
  );
}