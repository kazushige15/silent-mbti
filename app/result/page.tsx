'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

const PARAM_INFO: Record<string, { label: string; leftText: string; rightText: string; desc: string }> = {
  time: {
    label: '時間（Time）',
    leftText: '活動的 (多忙/多趣味)',
    rightText: 'サイレント (在宅/暇)',
    desc: '休日を家で静かに過ごしたり、時間に余裕があるものの街の活動には使っていない状態を表します。',
  },
  relations: {
    label: '人間関係（Relations）',
    leftText: '社交的 (オープン)',
    rightText: 'サイレント (単独好み)',
    desc: '一人でいることを好み、近所や知らない人との関わりに慎重な傾向を表します。',
  },
  cognition: {
    label: '認知（Cognition）',
    leftText: '街の情報に敏感',
    rightText: 'サイレント (情報遮断)',
    desc: '回覧板や地域の掲示板、チラシにあまり関心がなく、地域の情報が届きにくい状態です。',
  },
  interest: {
    label: '興味（Interest）',
    leftText: 'トレンド・地域に敏感',
    rightText: 'サイレント (低関心)',
    desc: '身近な出来事や新しい流行に対して、自分から積極的に調べない傾向を表します。',
  },
  activity: {
    label: '活動（Activity）',
    leftText: 'フットワークが軽い',
    rightText: 'サイレント (未経験)',
    desc: 'イベントへの参加や、初めての場所・新しいことを始めることに抵抗がある状態です。',
  },
  values: {
    label: '価値観（Values）',
    leftText: '他者貢献・責任感高',
    rightText: 'サイレント (自己完結)',
    desc: '自分以外の人のためや、地域の役割のために時間やお金を使うことに慎重な傾向です。',
  },
};

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawScores = {
    time: parseInt(searchParams.get('time') || '0', 10),
    relations: parseInt(searchParams.get('relations') || '0', 10),
    cognition: parseInt(searchParams.get('cognition') || '0', 10),
    interest: parseInt(searchParams.get('interest') || '0', 10),
    activity: parseInt(searchParams.get('activity') || '0', 10),
    values: parseInt(searchParams.get('values') || '0', 10),
  };

  const calculateSilentPercentage = (category: string, score: number): number => {
    let percentage = 0;
    if (category === 'time') {
      percentage = ((score + 4) / 12) * 100;
    } else {
      percentage = (1 - (score + 4) / 12) * 100;
    }
    return Math.max(0, Math.min(100, Math.round(percentage)));
  };

  const silentScores = {
    time: calculateSilentPercentage('time', rawScores.time),
    relations: calculateSilentPercentage('relations', rawScores.relations),
    cognition: calculateSilentPercentage('cognition', rawScores.cognition),
    interest: calculateSilentPercentage('interest', rawScores.interest),
    activity: calculateSilentPercentage('activity', rawScores.activity),
    values: calculateSilentPercentage('values', rawScores.values),
  };

  const totalSilentScore = Math.round(
    (silentScores.time + silentScores.relations + silentScores.cognition + silentScores.interest + silentScores.activity + silentScores.values) / 6
  );

  // 💡 【環境系】のサイレント判定（50%以上）
  const isTimeSilent = silentScores.time >= 50;
  const isRelationsSilent = silentScores.relations >= 50;
  const isCognitionSilent = silentScores.cognition >= 50;
  const envOverlapCount = [isTimeSilent, isRelationsSilent, isCognitionSilent].filter(Boolean).length;

  // 💡 【行動系】のサイレント判定（50%以上）
  const isInterestSilent = silentScores.interest >= 50;
  const isActivitySilent = silentScores.activity >= 50;
  const isValuesSilent = silentScores.values >= 50;
  const actOverlapCount = [isInterestSilent, isActivitySilent, isValuesSilent].filter(Boolean).length;

  // 全6項目中の合計重なり数
  const totalOverlapCount = envOverlapCount + actOverlapCount;

  // ベン図から導き出す詳細なテキスト
  let vennMessage = "";
  if (totalOverlapCount === 0) {
    vennMessage = "驚異のアクティブ度！サイレントな要素が一つも見当たりません。";
  } else if (envOverlapCount >= 2 && actOverlapCount < 2) {
    vennMessage = "【環境要因サイレント】心の中では興味があるのに、「時間・人間関係・認知」のまわりの環境が壁になっています！";
  } else if (actOverlapCount >= 2 && envOverlapCount < 2) {
    vennMessage = "【マインド要因サイレント】環境には恵まれていますが、本人の「興味・活動・価値観」が地域に向いていない状態です。";
  } else if (envOverlapCount >= 2 && actOverlapCount >= 2) {
    vennMessage = "【ディープ・サイレント】環境の壁もマインドの壁も両方重なっている、最もアプローチが難しい孤立ゾーンです。";
  } else {
    vennMessage = "いくつかの要因が少しずつ重なっています。ちょっとしたきっかけでアクティブに変貌するライト層です。";
  }

  // 称号の決定
  let title = 'パッシブ・オブザーバー（静かな観察者）';
  let description = '街の動きはなんとなく見ているものの、自分から関わる動機がまだ見つかっていない標準的なサイレント層です。';

  if (totalOverlapCount >= 5 || totalSilentScore >= 80) {
    title = 'アブソリュート・インドア（孤高の隠者）';
    description = '環境系・行動系のほぼすべての障壁が重なった、究極のサイレント層です。街づくりや地域コミュニティとは完全に距離を置いています。';
  } else if (envOverlapCount >= 2 && actOverlapCount < 2) {
    title = 'シャイ・ポテンシャル（不器用な実力者）';
    description = '街への興味や貢献意欲（行動系）は高いのに、忙しさや情報不足（環境系）のせいで参加できていない、非常にもったいない隠れ有能層です！';
  } else if (actOverlapCount >= 2 && envOverlapCount < 2) {
    title = 'マイワールド・トラベラー（我が道をいく人）';
    description = '時間や人間関係には余裕があるものの、そもそも街づくりや地域のトレンドに全く興味関心が向いていない、自己完結型のサイレント層です。';
  } else if (totalSilentScore < 40) {
    title = 'アクティブ・シチズン（お祭りライト層）';
    description = 'サイレント層の中では最もフットワークが軽く、条件さえ合致すればいつでも街づくりに飛び込めるアクティブ一歩手前の層です。';
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* ヘッダー・総合結果 */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center py-12 px-6">
          <p className="text-sm font-semibold tracking-widest text-indigo-200 uppercase mb-2">あなたのサイレント特性タイプ</p>
          <h1 className="text-3xl font-extrabold mb-4">{title}</h1>
          <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-6 py-2 font-bold text-lg">
            総合サイレント度: <span className="text-yellow-300 text-2xl">{totalSilentScore}%</span>
          </div>
        </div>

        {/* 説明文 */}
        <div className="p-8 border-b border-slate-100 text-center">
          <p className="text-slate-600 leading-relaxed mb-4">{description}</p>
          <div className="inline-block bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm text-indigo-700 font-medium max-w-md">
            {vennMessage}
          </div>
        </div>

        {/* 📊 新機能：環境系＆行動系のダブルベン図エリア */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 mb-8 text-center">
            サイレント要因のダブルベン図分析
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
            
            {/* 左側：環境系ベン図 */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full mb-4">環境系（状況の壁）</span>
              <div className="relative w-48 h-48">
                {/* 時間 */}
                <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  isTimeSilent ? 'bg-rose-500/30 text-rose-700 border-rose-400 z-10' : 'bg-slate-200/40 text-slate-400 border-slate-200'
                }`}>
                  <span className="mb-8">時間</span>
                </div>
                {/* 人間関係 */}
                <div className={`absolute bottom-2 left-2 w-28 h-28 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  isRelationsSilent ? 'bg-blue-500/30 text-blue-700 border-blue-400 z-10' : 'bg-slate-200/40 text-slate-400 border-slate-200'
                }`}>
                  <span className="mt-8 ml-4">人間関係</span>
                </div>
                {/* 認知 */}
                <div className={`absolute bottom-2 right-2 w-28 h-28 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  isCognitionSilent ? 'bg-amber-500/30 text-amber-700 border-amber-400 z-10' : 'bg-slate-200/40 text-slate-400 border-slate-200'
                }`}>
                  <span className="mt-8 mr-4">認知</span>
                </div>
                {/* 環境系中央の重なり */}
                {envOverlapCount === 3 && (
                  <div className="absolute top-[38%] left-[38%] w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center text-[8px] font-extrabold text-white shadow z-20">
                    濃
                  </div>
                )}
              </div>
            </div>

            {/* 右側：行動系ベン図 */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full mb-4">行動系（意識の壁）</span>
              <div className="relative w-48 h-48">
                {/* 興味 */}
                <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  isInterestSilent ? 'bg-teal-500/30 text-teal-700 border-teal-400 z-10' : 'bg-slate-200/40 text-slate-400 border-slate-200'
                }`}>
                  <span className="mb-8">興味</span>
                </div>
                {/* 活動 */}
                <div className={`absolute bottom-2 left-2 w-28 h-28 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  isActivitySilent ? 'bg-purple-500/30 text-purple-700 border-purple-400 z-10' : 'bg-slate-200/40 text-slate-400 border-slate-200'
                }`}>
                  <span className="mt-8 ml-4">活動</span>
                </div>
                {/* 価値観 */}
                <div className={`absolute bottom-2 right-2 w-28 h-28 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  isValuesSilent ? 'bg-emerald-500/30 text-emerald-700 border-emerald-400 z-10' : 'bg-slate-200/40 text-slate-400 border-slate-200'
                }`}>
                  <span className="mt-8 mr-4">価値観</span>
                </div>
                {/* 行動系中央の重なり */}
                {actOverlapCount === 3 && (
                  <div className="absolute top-[38%] left-[38%] w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-[8px] font-extrabold text-white shadow z-20">
                    濃
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 両方のベン図がマックス（超サイレント層）のときの特別演出 */}
          {totalOverlapCount === 6 && (
            <div className="mt-6 bg-red-600 text-white text-xs font-extrabold px-4 py-2 rounded-xl text-center animate-bounce shadow-md">
              ⚠️ 全ての要因が重なった【完全なる超サイレント層】です！
            </div>
          )}
        </div>

        {/* MBTI風 パラメーター表示エリア */}
        <div className="p-8 space-y-8">
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-600 pl-3 mb-6">
            6つの特性パラメータ分析
          </h2>

          {Object.entries(silentScores).map(([key, percent]) => {
            const info = PARAM_INFO[key];
            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-700">{info.label}</span>
                  <span className="font-bold text-indigo-600">消極度: {percent}%</span>
                </div>
                
                <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden flex relative border border-slate-200">
                  <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${100 - percent}%` }}></div>
                  <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                  <div className="absolute top-0 left-1/2 w-[2px] h-full bg-white/50"></div>
                </div>

                <div className="flex justify-between text-xs font-semibold text-slate-400 px-1">
                  <span>← {info.leftText}</span>
                  <span>{info.rightText} →</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded-lg">{info.desc}</p>
              </div>
            );
          })}
        </div>

        {/* もう一度診断するボタン */}
        <div className="p-8 bg-slate-50 text-center">
          <button
            onClick={() => router.push('/diagnostic')}
            className="px-8 py-3 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm transition-all duration-200 text-sm"
          >
            もう一度診断する
          </button>
        </div>

      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">読み込み中...</div>}>
      <ResultContent />
    </Suspense>
  );
}