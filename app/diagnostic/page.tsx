'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
  { id: 1, text: '地域の祭りやイベントの情報を知った時、自分から詳しく調べる。', category: 'interest', type: 'plus' },
  { id: 2, text: '回覧板や地域の掲示板、ポスティングのチラシをよく読む。', category: 'cognition', type: 'plus' },
  { id: 3, text: '近所の人や、地域の知り合いと挨拶以上の世間話をすることがある。', category: 'relations', type: 'plus' },
  { id: 4, text: '休日は仕事や家事、個人の趣味などでスケジュールがびっしり埋まっている。', category: 'time', type: 'plus' },
  { id: 5, text: '「街を良くする」ための活動（清掃やボランティアなど）に興味がある。', category: 'values', type: 'plus' },
  { id: 6, text: '地域のワークショップや、新しいコミュニティの場所に一人で参加できる。', category: 'activity', type: 'plus' },
  { id: 7, text: '自分の住む街が今後どうなっていくか（再開発など）に、あまり関心がない。', category: 'interest', type: 'minus' },
  { id: 8, text: '地域のルールやゴミの分別方法以外の、地元のニュースを知る手段がほぼない。', category: 'cognition', type: 'minus' },
  { id: 9, text: '近所にどんな人が住んでいるか、顔も名前もほとんど知らない。', category: 'relations', type: 'minus' },
  { id: 10, text: '平日の夜や休日は、家でただ静かにのんびり過ごす時間がたっぷりある。', category: 'time', type: 'minus' },
  { id: 11, text: '地域の活動はお金や時間の無駄であり、自分には関係がないと感じる。', category: 'values', type: 'minus' },
  { id: 12, text: '知らない人がたくさん集まる地元のイベントに行くのは、正直億劫だ。', category: 'activity', type: 'minus' },
  { id: 13, text: '地元の新しくオープンしたお店やスポットには、すぐに行ってみたいと思う。', category: 'interest', type: 'plus' },
  { id: 14, text: '行政が発行している広報誌（区報・市報など）やWEBサイトを定期的にチェックする。', category: 'cognition', type: 'plus' },
  { id: 15, text: '困った時に気軽に頼れる、または声をかけ合える近隣の友人がいる。', category: 'relations', type: 'plus' },
  { id: 16, text: '日常的にやりたいことが多すぎて、地域のことに割く時間は1分もない。', category: 'time', type: 'plus' },
  { id: 17, text: '自分を育ててくれた地域や、いま住んでいる社会に対して何か恩返しがしたい。', category: 'values', type: 'plus' },
  { id: 18, text: '地域のサークルや習い事、イベントなどの案内を見たら、気軽に応募してみる。', category: 'activity', type: 'plus' },
  { id: 19, text: '自分の生活圏（家と職場の往復など）以外で、街で何が起きているか全く知らない。', category: 'interest', type: 'minus' },
  { id: 20, text: '地域の避難場所や防災訓練の情報について、どこで確認すればいいか分からない。', category: 'cognition', type: 'minus' },
  { id: 21, text: 'マンションの隣人や近所の人との関わりは、できれば最小限（挨拶だけ）にしたい。', category: 'relations', type: 'minus' },
  { id: 22, text: '突発的に「今日の地域イベントを手伝って」と言われても、すぐ対応できるほど暇だ。', category: 'time', type: 'minus' },
  { id: 23, text: '街のイベントは「楽しむ側（客）」だけでよく、運営やお手伝いをする気は起きない。', category: 'values', type: 'minus' },
  { id: 24, text: '「誰でも大歓迎！」と書かれた地域の集まりであっても、入っていく勇気が出ない。', category: 'activity', type: 'minus' }
];

export default function DiagnosticPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const router = useRouter();

  const handleAnswer = (score: number) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const scores: Record<string, number> = { time: 0, relations: 0, cognition: 0, interest: 0, activity: 0, values: 0 };
      
      QUESTIONS.forEach((q, index) => {
        const ans = nextAnswers[index];
        scores[q.category] += q.type === 'plus' ? ans : -ans;
      });

      const typeCode = [
        scores.time >= 0 ? 'A' : 'S',
        scores.relations >= 0 ? 'O' : 'S',
        scores.cognition >= 0 ? 'I' : 'S',
        scores.interest >= 0 ? 'T' : 'S',
        scores.activity >= 0 ? 'F' : 'S',
        scores.values >= 0 ? 'V' : 'S',
      ].join('');

      const query = new URLSearchParams({
        type: typeCode,
        ...Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, v.toString()])),
      }).toString();

      router.push(`/result?${query}`);
    }
  };

  const currentQuestion = QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-400 font-bold mb-2">
            <span>質問 {currentIndex + 1} / {QUESTIONS.length}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="min-h-[140px] flex items-center justify-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-center leading-relaxed">
            {currentQuestion.text}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={() => handleAnswer(2)} className="w-full py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-2xl border border-emerald-200 transition-all">とてもあてはまる</button>
          <button onClick={() => handleAnswer(1)} className="w-full py-4 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-700 font-semibold rounded-2xl border border-emerald-100 transition-all">ややあてはまる</button>
          <button onClick={() => handleAnswer(-1)} className="w-full py-4 bg-rose-50/50 hover:bg-rose-100/50 text-rose-700 font-semibold rounded-2xl border border-rose-100 transition-all">あまりあてはまらない</button>
          <button onClick={() => handleAnswer(-2)} className="w-full py-4 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-2xl border border-rose-200 transition-all">全くあてはまらない</button>
        </div>
      </div>
    </div>
  );
}