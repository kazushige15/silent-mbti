'use client';

type Scores = {
  time: number;
  relations: number;
  cognition: number;
  interest: number;
  activity: number;
  values: number;
};

type Props = {
  scores: Scores;
};

const LABELS = {
  time: '時間',
  relations: '人間関係',
  cognition: '認知',
  interest: '興味',
  activity: '活動',
  values: '価値観',
};

export default function VennDiagram({ scores }: Props) {
  // サイレント度（マイナススコア）に応じて灰色から段階的に赤くする関数
  const colorBySilentLevel = (score: number) => {
    if (score >= 0) return 'bg-slate-100/80 border-slate-300 text-slate-700'; // 通常（灰色）
    if (score >= -2) return 'bg-rose-100/70 border-rose-300 text-rose-800';  // やや低い（薄い赤）
    if (score >= -5) return 'bg-rose-300/80 border-rose-400 text-rose-900';  // 低い（中くらいの赤）
    return 'bg-rose-500/80 border-rose-600 text-white font-bold';             // 非常に低い（濃い赤）
  };

  // 説明文
  const description = (key: keyof Scores, score: number) => {
    const label = LABELS[key];

    if (score >= 6) return `${label}が非常に高く、地域との関わりに強く影響しています。`;
    if (score >= 3) return `${label}が比較的高く、行動を後押しする要因になっています。`;
    if (score >= 0) return `${label}はやや高めで、一定の関心があります。`;
    if (score >= -2) return `${label}はやや低めで、積極性を抑える傾向があります。`;
    if (score >= -5) return `${label}が低く、参加へのハードルになっている可能性があります。`;

    return `${label}が非常に低く、サイレント要因として強く働いています。`;
  };

  const envSilent = ['time', 'relations', 'cognition']
    .map((k) => Math.max(0, -scores[k as keyof Scores]))
    .reduce((a, b) => a + b, 0);

  const actSilent = ['interest', 'activity', 'values']
    .map((k) => Math.max(0, -scores[k as keyof Scores]))
    .reduce((a, b) => a + b, 0);

  const totalSilent = envSilent + actSilent || 1;

  const envRate = Math.round((envSilent / totalSilent) * 100);
  const actRate = 100 - envRate;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mt-8">
      <div className="text-center mb-8">
        <p className="text-sm font-bold text-indigo-500 tracking-widest uppercase mb-2">
          Silent Factor Map
        </p>
        <h2 className="text-2xl font-black text-slate-800">
          サイレント要因マップ
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">

        {/* 環境系 */}
        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-700">
              環境系（状況の壁）
            </span>
          </div>

          {/* 固定サイズのベン図コンテナ */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-2">
            {/* 上：時間 */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-52 sm:h-52 rounded-full border-2 flex items-center justify-center pt-2 text-base font-bold transition-colors duration-500 ${colorBySilentLevel(scores.time)}`}
              title={`${LABELS.time}：${scores.time >= 0 ? '+' : ''}${scores.time}`}
            >
              <span className="-translate-y-12">{LABELS.time}</span>
            </div>

            {/* 左下：人間関係 */}
            <div
              className={`absolute bottom-0 left-0 w-48 h-48 sm:w-52 sm:h-52 rounded-full border-2 flex items-center justify-center text-base font-bold transition-colors duration-500 ${colorBySilentLevel(scores.relations)}`}
              title={`${LABELS.relations}：${scores.relations >= 0 ? '+' : ''}${scores.relations}`}
            >
              <span className="-translate-x-6 translate-y-6">人間関係</span>
            </div>

            {/* 右下：認知 */}
            <div
              className={`absolute bottom-0 right-0 w-48 h-48 sm:w-52 sm:h-52 rounded-full border-2 flex items-center justify-center text-base font-bold transition-colors duration-500 ${colorBySilentLevel(scores.cognition)}`}
              title={`${LABELS.cognition}：${scores.cognition >= 0 ? '+' : ''}${scores.cognition}`}
            >
              <span className="translate-x-6 translate-y-6">{LABELS.cognition}</span>
            </div>

            {/* 中央：あなた */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-amber-500/90 border-2 border-amber-600 text-white rounded-full flex items-center justify-center text-sm font-black shadow-md z-10">
              あなた
            </div>
          </div>
        </div>

        {/* 行動系 */}
        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-2 bg-indigo-50 rounded-full text-sm font-bold text-indigo-700">
              行動系（意識の壁）
            </span>
          </div>

          {/* 固定サイズのベン図コンテナ */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-2">
            {/* 上：興味 */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-52 sm:h-52 rounded-full border-2 flex items-center justify-center text-base font-bold transition-colors duration-500 ${colorBySilentLevel(scores.interest)}`}
              title={`${LABELS.interest}：${scores.interest >= 0 ? '+' : ''}${scores.interest}`}
            >
              <span className="-translate-y-12">{LABELS.interest}</span>
            </div>

            {/* 左下：活動 */}
            <div
              className={`absolute bottom-0 left-0 w-48 h-48 sm:w-52 sm:h-52 rounded-full border-2 flex items-center justify-center text-base font-bold transition-colors duration-500 ${colorBySilentLevel(scores.activity)}`}
              title={`${LABELS.activity}：${scores.activity >= 0 ? '+' : ''}${scores.activity}`}
            >
              <span className="-translate-x-6 translate-y-6">{LABELS.activity}</span>
            </div>

            {/* 右下：価値観 */}
            <div
              className={`absolute bottom-0 right-0 w-48 h-48 sm:w-52 sm:h-52 rounded-full border-2 flex items-center justify-center text-base font-bold transition-colors duration-500 ${colorBySilentLevel(scores.values)}`}
              title={`${LABELS.values}：${scores.values >= 0 ? '+' : ''}${scores.values}`}
            >
              <span className="translate-x-6 translate-y-6">{LABELS.values}</span>
            </div>

            {/* 中央：あなた */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-amber-500/90 border-2 border-amber-600 text-white rounded-full flex items-center justify-center text-sm font-black shadow-md z-10">
              あなた
            </div>
          </div>
        </div>

      </div>

      {/* 詳細スコア */}
      <div className="mt-8 grid sm:grid-cols-2 gap-3">
        {Object.entries(scores).map(([key, score]) => (
          <div
            key={key}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-800">
                {LABELS[key as keyof Scores]}
              </span>
              <span
                className={`font-black ${
                  score > 0
                    ? 'text-emerald-600'
                    : score < 0
                    ? 'text-rose-600'
                    : 'text-slate-500'
                }`}
              >
                {score > 0 ? '+' : ''}{score}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {description(key as keyof Scores, score)}
            </p>
          </div>
        ))}
      </div>

      {/* 分析 */}
      <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-3">
          あなたのサイレント要因分析
        </h3>

        <div className="space-y-2 text-sm text-slate-700">
          <p>
            ・環境系（時間・人間関係・認知）の影響：
            <span className="font-bold text-indigo-600"> {envRate}%</span>
          </p>

          <p>
            ・行動系（興味・活動・価値観）の影響：
            <span className="font-bold text-indigo-600"> {actRate}%</span>
          </p>

          <p className="pt-2 leading-relaxed">
            {envRate > actRate
              ? 'あなたは「環境や状況」による制約の影響が大きいタイプです。時間的余裕や周囲との関係性が改善されると、地域活動への参加可能性が高まるでしょう。'
              : 'あなたは「意識や心理的ハードル」の影響が大きいタイプです。興味を行動に変えるきっかけや、参加しやすい雰囲気づくりが重要になります。'}
          </p>
        </div>
      </div>
    </div>
  );
}