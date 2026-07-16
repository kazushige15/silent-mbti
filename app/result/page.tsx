'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

const PARAM_INFO: Record<string, { label: string; leftText: string; rightText: string }> = {
  time: { label: '時間', leftText: '活動的', rightText: '暇/在宅' },
  relations: { label: '人間関係', leftText: '社交的', rightText: '単独好み' },
  cognition: { label: '認知', leftText: '情報敏感', rightText: '情報遮断' },
  interest: { label: '興味', leftText: '敏感', rightText: '無関心' },
  activity: { label: '活動', leftText: '行動派', rightText: '未経験' },
  values: { label: '価値観', leftText: '貢献志向', rightText: '自己完結' },
};

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // スコアの取得
  const getScore = (key: string) => parseInt(searchParams.get(key) || '0', 10);
  const scores = {
    time: getScore('time'),
    relations: getScore('relations'),
    cognition: getScore('cognition'),
    interest: getScore('interest'),
    activity: getScore('activity'),
    values: getScore('values'),
  };

  // 6文字コードをここで再計算（これが今回の修正の核心です）
  const typeCode = [
    scores.time >= 0 ? 'A' : 'S',
    scores.relations >= 0 ? 'O' : 'S',
    scores.cognition >= 0 ? 'I' : 'S',
    scores.interest >= 0 ? 'T' : 'S',
    scores.activity >= 0 ? 'F' : 'S',
    scores.values >= 0 ? 'V' : 'S',
  ].join('');

  const getPercent = (key: string) => Math.max(0, Math.min(100, (getScore(key) + 4) * 12.5));
  
  const percents = {
    time: getPercent('time'),
    relations: getPercent('relations'),
    cognition: getPercent('cognition'),
    interest: getPercent('interest'),
    activity: getPercent('activity'),
    values: getPercent('values'),
  };

  const isSilent = {
    time: percents.time >= 50,
    relations: percents.relations >= 50,
    cognition: percents.cognition >= 50,
    interest: percents.interest >= 50,
    activity: percents.activity >= 50,
    values: percents.values >= 50,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        
        {/* 6文字コード表示 */}
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-indigo-500 tracking-widest uppercase mb-2">あなたの診断タイプ</p>
          <h1 className="text-6xl font-black text-slate-800 tracking-tighter mb-4">{typeCode}</h1>
        </div>

        {/* ベン図 */}
        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
          <h3 className="font-bold text-slate-800 text-center mb-6 text-sm">サイレント要因の可視化</h3>
          <div className="flex justify-center gap-8">
            <div className="relative w-24 h-24">
              {[ {key: 'time', pos: 'top'}, {key: 'relations', pos: 'left'}, {key: 'cognition', pos: 'right'} ].map((item) => (
                <div key={item.key} className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${isSilent[item.key as keyof typeof isSilent] ? 'bg-rose-200 border-rose-400' : 'bg-slate-200 border-slate-300'}`}
                  style={{ top: item.pos === 'top' ? '0' : '50%', left: item.pos === 'top' ? '25%' : item.pos === 'left' ? '0' : '50%' }}>
                  {PARAM_INFO[item.key].label}
                </div>
              ))}
            </div>
            <div className="relative w-24 h-24">
              {[ {key: 'interest', pos: 'top'}, {key: 'activity', pos: 'left'}, {key: 'values', pos: 'right'} ].map((item) => (
                <div key={item.key} className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${isSilent[item.key as keyof typeof isSilent] ? 'bg-indigo-200 border-indigo-400' : 'bg-slate-200 border-slate-300'}`}
                  style={{ top: item.pos === 'top' ? '0' : '50%', left: item.pos === 'top' ? '25%' : item.pos === 'left' ? '0' : '50%' }}>
                  {PARAM_INFO[item.key].label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* バー分析 */}
        <div className="space-y-6 mb-10">
          {Object.entries(percents).map(([key, percent]) => (
            <div key={key}>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>{PARAM_INFO[key].leftText}</span>
                <span className="text-indigo-600">{PARAM_INFO[key].label}</span>
                <span>{PARAM_INFO[key].rightText}</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-indigo-500"></div>
                <div className="absolute top-0 h-4 w-4 bg-white border-2 border-indigo-600 rounded-full shadow-md transition-all duration-500"
                  style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}></div>
              </div>
            </div>
          ))}
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
    <Suspense fallback={<div>読み込み中...</div>}>
      <ResultContent />
    </Suspense>
  );
}