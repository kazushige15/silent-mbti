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
// 円の大きさ（サイレント要因が強いほど大きく表示）
const size = (score: number) => {
  // プラス・0は小さく固定
  if (score >= 0) {
    return 40;
  }

  // マイナスになるほど大きく表示（-8で85px）
  return 40 + (-score / 8) * 45;
};

  // 色判定
  const color = (score: number) => {
    if (score > 0) return 'bg-emerald-400/50 border-emerald-500';
    if (score < 0) return 'bg-rose-400/50 border-rose-500';
    return 'bg-slate-300/50 border-slate-400';
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

      <div className="grid md:grid-cols-2 gap-8">

        {/* 環境系 */}
        <div>
          <div className="text-center mb-4">
            <span className="inline-block px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-700">
              環境系（状況の壁）
            </span>
          </div>

          <div className="relative h-72">
            {/* 時間 */}
            <div
              className={`absolute left-1/2 top-35 -translate-x-1/2 rounded-full border-2 flex items-center justify-center text-sm font-bold text-slate-800 transition-all duration-700 ${color(scores.time)}`}
              style={{
                width: size(scores.time),
                height: size(scores.time),
              }}
              title={`${LABELS.time}：${scores.time >= 0 ? '+' : ''}${scores.time}`}
            >
              時間
            </div>

            {/* 人間関係 */}
            <div
              className={`absolute left-12 bottom-10 rounded-full border-2 flex items-center justify-center text-sm font-bold text-slate-800 transition-all duration-700 ${color(scores.relations)}`}
              style={{
                width: size(scores.relations),
                height: size(scores.relations),
              }}
              title={`${LABELS.relations}：${scores.relations >= 0 ? '+' : ''}${scores.relations}`}
            >
              人間
            </div>

            {/* 認知 */}
            <div
              className={`absolute right-12 bottom-10 rounded-full border-2 flex items-center justify-center text-sm font-bold text-slate-800 transition-all duration-700 ${color(scores.cognition)}`}
              style={{
                width: size(scores.cognition),
                height: size(scores.cognition),
              }}
              title={`${LABELS.cognition}：${scores.cognition >= 0 ? '+' : ''}${scores.cognition}`}
            >
              認知
            </div>

            {/* 中央 */}
            <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg">
              あなた
            </div>
          </div>
        </div>

        {/* 行動系 */}
        <div>
          <div className="text-center mb-4">
            <span className="inline-block px-4 py-2 bg-indigo-50 rounded-full text-sm font-bold text-indigo-700">
              行動系（意識の壁）
            </span>
          </div>

          <div className="relative h-72">
            {/* 興味 */}
            <div
              className={`absolute left-1/2 top-35 -translate-x-1/2 rounded-full border-2 flex items-center justify-center text-sm font-bold text-slate-800 transition-all duration-700 ${color(scores.interest)}`}
              style={{
                width: size(scores.interest),
                height: size(scores.interest),
              }}
              title={`${LABELS.interest}：${scores.interest >= 0 ? '+' : ''}${scores.interest}`}
            >
              興味
            </div>

            {/* 活動 */}
            <div
              className={`absolute left-12 bottom-10 rounded-full border-2 flex items-center justify-center text-sm font-bold text-slate-800 transition-all duration-700 ${color(scores.activity)}`}
              style={{
                width: size(scores.activity),
                height: size(scores.activity),
              }}
              title={`${LABELS.activity}：${scores.activity >= 0 ? '+' : ''}${scores.activity}`}
            >
              活動
            </div>

            {/* 価値観 */}
            <div
              className={`absolute right-12 bottom-10 rounded-full border-2 flex items-center justify-center text-sm font-bold text-slate-800 transition-all duration-700 ${color(scores.values)}`}
              style={{
                width: size(scores.values),
                height: size(scores.values),
              }}
              title={`${LABELS.values}：${scores.values >= 0 ? '+' : ''}${scores.values}`}
            >
              価値
            </div>

            {/* 中央 */}
            <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg">
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