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

  const typeCode = searchParams.get('type') || 'SSSSSS';
  
  // 生スコアを取得してパーセンテージ化
  const getPercent = (key: string) => {
    const score = parseInt(searchParams.get(key) || '0', 10);
    // スコアの範囲を考慮して0-100%に正規化 (仮定: -4〜+4程度が中心)
    const normalized = Math.max(0, Math.min(100, (score + 4) * 12.5));
    return normalized;
  };

  const scores = {
    time: getPercent('time'),
    relations: getPercent('relations'),
    cognition: getPercent('cognition'),
    interest: getPercent('interest'),
    activity: getPercent('activity'),
    values: getPercent('values'),
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        
        {/* 6文字のアルファベットタイプ */}
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-indigo-500 tracking-widest uppercase mb-2">あなたの診断タイプ</p>
          <h1 className="text-6xl font-black text-slate-800 tracking-tighter mb-4">{typeCode}</h1>
          <p className="text-slate-500 font-medium">街との距離感を示す6つの指標</p>
        </div>

        {/* 6つのバー分析 */}
        <div className="space-y-6 mb-10">
          {Object.entries(scores).map(([key, percent]) => (
            <div key={key}>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>{PARAM_INFO[key].leftText}</span>
                <span className="text-indigo-600">{PARAM_INFO[key].label}</span>
                <span>{PARAM_INFO[key].rightText}</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-indigo-500"></div>
                <div 
                  className="absolute top-0 h-4 w-4 bg-white border-2 border-indigo-600 rounded-full shadow-md transition-all duration-500"
                  style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* ベン図の簡易解説など */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
          <h3 className="font-bold text-slate-800 mb-2">診断分析レポート</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            あなたのタイプ {typeCode} は、地域との関わりにおいて「{typeCode[0] === 'A' ? '活動的な時間活用' : '静かな時間活用'}」を基盤としています。
            詳細な分析に基づき、あなたの街との最適な距離感をご提案します。
          </p>
        </div>

        <button
          onClick={() => router.push('/diagnostic')}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200"
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