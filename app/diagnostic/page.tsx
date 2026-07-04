'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';

// 選択肢の定義
const OPTIONS = [
  { label: '当てはまる', value: 2, color: 'bg-emerald-500 hover:bg-emerald-600' },
  { label: 'どちらかといえば当てはまる', value: 1, color: 'bg-teal-400 hover:bg-teal-500' },
  { label: 'あまり当てはまらない', value: 0, color: 'bg-orange-300 hover:bg-orange-400' },
  { label: '全く当てはまらない', value: -1, color: 'bg-rose-500 hover:bg-rose-600' },
];

export default function DiagnosticPage() {
  const router = useRouter();
  
  // ユーザーの回答を記録するステート { 質問ID: スコア }
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // 選択肢がクリックされた時の処理
  const handleSelect = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // 診断完了ボタンを押した時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 未回答の質問がないかチェック
    if (Object.keys(answers).length < questions.length) {
      alert('まだ未回答の質問があります。すべての質問にお答えください！');
      return;
    }

    // 各カテゴリの合計スコアを計算するための初期オブジェクト
    const scores = { time: 0, relations: 0, cognition: 0, interest: 0, activity: 0, values: 0 };

    // 回答を集計
    questions.forEach((q) => {
      scores[q.category] += answers[q.id] || 0;
    });

    // 💡 将来的に結果画面へスコアを渡す処理（クエリパラメータとしてURLに載せる）
    const params = new URLSearchParams();
    Object.entries(scores).forEach(([key, val]) => {
      params.append(key, val.toString());
    });

    // 結果画面（/result?time=X&relations=Y...）へ遷移
    router.push(`/result?${params.toString()}`);
  };

  // 回答の進捗率を計算
  const progressPercent = Math.round((Object.keys(answers).length / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      {/* 固定表示のプログレスバー（上部） */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-2">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-slate-600 min-w-[60px]">
            進捗: {progressPercent}%
          </span>
          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-8">
        <header className="text-center mb-10">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">サイレント層 診断テスト</h1>
          <p className="text-sm text-slate-500">あなたの街づくりに対する関わり方や特性を分析します。</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-start gap-3 mb-4">
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                  Q.{index + 1}
                </span>
                <p className="text-base font-medium text-slate-800">{q.text}</p>
              </div>

              {/* 4つの選択肢ボタン */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OPTIONS.map((opt) => {
                  const isSelected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(q.id, opt.value)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all duration-200 text-left sm:text-center ${
                        isSelected
                          ? `${opt.color} text-white border-transparent shadow-md scale-[1.02]`
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* 送信ボタン */}
          <div className="pt-6 text-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-200 text-lg hover:shadow-xl"
            >
              診断結果を見る
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}