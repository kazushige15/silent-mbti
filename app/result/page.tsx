'use client';

export const dynamic = 'force-dynamic';

import VennDiagram from '@/components/VennDiagram';
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

const TYPE_NAMES: Record<string, string> = {
  // ==========================================
  // 1. A-O-I-T-F-* (超アクティブ・情報・現場派)
  // ==========================================
  'AOITFV': '街の主役プロデューサー',      // A O I T F V
  'AOITFS': '街を遊び尽くす行動派',        // A O I T F S
  'AOITSV': '街のフィクサー',              // A O I T S V
  'AOITSS': '街の情報ハブ',                // A O I T S S

  // ==========================================
  // 2. A-O-I-S-*-* (情報敏感・人間関係オープン)
  // ==========================================
  'AOISFV': '頭脳派の地域戦略家',          // A O I S F V
  'AOISFS': 'トレンド過敏な街っ子',        // A O I S F S
  'AOISSV': '情報通の街サポーター',        // A O I S S V
  'AOISSS': '社交的な情報収集家',          // A O I S S S

  // ==========================================
  // 3. A-O-S-T-*-* (現場主義・お祭り好き)
  // ==========================================
  'AOSTFV': '現場主義の盛り上げ隊長',      // A O S T F V
  'AOSTFS': '街のイベント突撃隊',          // A O S T F S
  'AOSTSV': '行動派ローカルヒーロー',      // A O S T S V
  'AOSTSS': 'イベント大好きアクティブ派',  // A O S T S S

  // ==========================================
  // 4. A-O-S-S-*-* (アクティブ・社交のみ)
  // ==========================================
  'AOSSFV': '気ままな街の盛り上げ役',      // A O S S F V
  'AOSSFS': 'フットワーク軽快マン',        // A O S S F S
  'AOSSSV': '街の顔広サポーター',          // A O S S S V
  'AOSSSS': 'アクティブな自由人',          // A O S S S S

  // ==========================================
  // 5. A-S-I-T-*-* (ソロ活動・ハイスペック)
  // ==========================================
  'ASITFV': '孤高の地域イノベーター',      // A S I T F V
  'ASITFS': 'ソロ活まちファン',            // A S I T F S
  'ASITSV': '潜伏系まちづくりアドバイザー',// A S I T S V
  'ASITSS': 'ディープな街の探求者',        // A S I T S S

  // ==========================================
  // 6. A-S-I-S-*-* (ソロ・情報収集型)
  // ==========================================
  'ASISFV': '静かなる地域マーケター',      // A S I S F V
  'ASISFS': 'ソロ活街探索家',              // A S I S F S
  'ASISSV': '一匹狼の街ライター',          // A S I S S V
  'ASISSS': '静かな情報コレクター',        // A S I S S S

  // ==========================================
  // 7. A-S-S-T-*-* (ソロ・興味行動派)
  // ==========================================
  'ASSTFV': '一匹狼の街づくり職人',        // A S S T F V
  'ASSTFS': 'マイペースな街歩き派',        // A S S T F S
  'ASSTSV': 'ひそかな街の愛好家',          // A S S T S V
  'ASSTSS': '街のトレンドハンター',        // A S S T S S

  // ==========================================
  // 8. A-S-S-S-*-* (アクティブ・単独)
  // ==========================================
  'ASSSTV': '影の行動派サポーター',        // A S S S T V
  'ASSSTS': '気ままなソロ探検家',          // A S S S T S
  'ASSSSV': '無言の行動派ギバー',          // A S S S S V
  'ASSSSS': 'アクティブな一匹狼',          // A S S S S S

  // ==========================================
  // 9. S-O-I-T-*-* (マイペース・顔役・交流派)
  // ==========================================
  'SOITFV': 'マイペースな街の顔役',        // S O I T F V
  'SOITFS': '社交的な街の愛好家',          // S O I T F S
  'SOITSV': 'ご近所づきあいの達人',        // S O I T S V
  'SOITSS': 'のんびり街ウォッチャー',      // S O I T S S

  // ==========================================
  // 10. S-O-I-S-*-* (在宅・社交・情報通)
  // ==========================================
  'SOISFV': 'おしゃべりな街の分析家',      // S O I S F V
  'SOISFS': '口コミ地域アドバイザー',      // S O I S F S
  'SOISSV': '情報に強い街のサポーター',    // S O I S S V
  'SOISSS': '世間話の達人',                // S O I S S S

  // ==========================================
  // 11. S-O-S-T-*-* (在宅・社交・現場派)
  // ==========================================
  'SOSTFV': '気まぐれな現場ボランティア',  // S O S T F V
  'SOSTFS': 'のんびりイベント参加者',      // S O S T F S
  'SOSTSV': 'マイペースなボランティア',    // S O S T S V
  'SOSTSS': '情報通のご近所さん',          // S O S T S S

  // ==========================================
  // 12. S-O-S-S-*-* (在宅・社交のみ)
  // ==========================================
  'SOSSFV': '気ままな散歩人',              // S O S S F V
  'SOSSFS': 'マイペースな行動派',          // S O S S F S
  'SOSSSV': 'ご近所サポーター',            // S O S S S V
  'SOSSSS': 'ご近所フレンドリー',          // S O S S S S

  // ==========================================
  // 13. S-S-I-T-*-* (静かな情報・貢献派)
  // ==========================================
  'SSITFV': 'マイペースな地域サポーター',  // S S I T F V
  'SSITFS': '隠れローカルファン',          // S S I T F S
  'SSITSV': '静かなる地域サポーター',      // S S I T S V
  'SSITSS': 'マニアックなローカル通',      // S S I T S S

  // ==========================================
  // 14. S-S-I-S-*-* (静かな情報収集派)
  // ==========================================
  'SSISFV': '静かなる街の探検家',          // S S I S F V
  'SSISFS': 'ひっそり散歩好き',            // S S I S F S
  'SSISSV': 'サイレントアドバイザー',      // S S I S S V
  'SSISSS': 'マイペースな情報通',          // S S I S S S

  // ==========================================
  // 15. S-S-S-T-*-* (静かな街ファン)
  // ==========================================
  'SSSTFV': '陰で想う地域ファン',          // S S S T F V
  'SSSTFS': 'マイペースな散策家',          // S S S T F S
  'SSSTSV': 'サイレントサポーター',        // S S S T S V
  'SSSTSS': '静かなる街の観測者',          // S S S T S S

  // ==========================================
  // 16. S-S-S-S-*-* (完全サイレント寄り)
  // ==========================================
  'SSSSFV': 'サイレントな街の味方',        // S S S S F V
  'SSSSFS': 'ひっそりお散歩人',            // S S S S F S
  'SSSSSV': '静かなる献身者',              // S S S S S V
  'SSSSSS': '完全なる隠者（サイレント市民）'// S S S S S S
};

// 🌟 マップにない場合の自動フォールバック生成
function getTypeName(code: string): string {
  if (TYPE_NAMES[code]) return TYPE_NAMES[code];

  // 簡易的な生成ロジック例 (1文字目:時間, 2文字目:人間関係)
  const isTimeActive = code[0] === 'A';
  const isRelActive = code[1] === 'A';

  if (!isTimeActive && isRelActive) return '社交的な暇人';
  if (isTimeActive && !isRelActive) return '単独行動の多忙人';
  if (isTimeActive && isRelActive) return '街を駆け巡るアクティブ人';
  return 'マイペースなマイタウン人';
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const typeCode = searchParams.get('type') || 'SSSSSS';
  const typeName = getTypeName(typeCode);
  
  // 生スコアを取得してパーセンテージ化
  const getPercent = (key: string) => {
    const score = parseInt(searchParams.get(key) || '0', 10);
    const normalized = Math.max(0, Math.min(100, 100 - ((score + 4) * 12.5)));
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
        
        {/* 6文字のアルファベットタイプ ＆ キャッチーな名前 */}
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-indigo-500 tracking-widest uppercase mb-2">あなたの診断タイプ</p>
          <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">{typeCode}</h1>
          
          {/* 🌟 キャッチーな名前を表示する見出し */}
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600 mb-4">
            「{typeName}」
          </h2>

          <p className="text-slate-500 font-medium text-sm">街との距離感を示す6つの指標</p>
        </div>

        {/* 6つのバー分析 */}
        <div className="space-y-8 mb-10">
          {Object.entries(scores).map(([key, percent]) => (
            <div key={key}>
              <div className="flex justify-between items-center text-sm font-bold text-slate-500 mb-3">
                <span>{PARAM_INFO[key].leftText}</span>
                <span className="text-lg font-extrabold text-indigo-600">
                  {PARAM_INFO[key].label}
                </span>
                <span>{PARAM_INFO[key].rightText}</span>
              </div>

              {/* バー全体の親要素 */}
              <div className="w-full h-4 bg-slate-100 rounded-full relative border border-slate-200 px-3 flex items-center">
                
                {/* グラデーションバー本体 */}
                <div className="absolute inset-x-0 h-full bg-gradient-to-r from-orange-400 to-purple-600 rounded-full"></div>
                
                {/* ツマミ */}
                <div 
                  className="relative h-7 w-7 bg-white border-[3px] border-purple-600 rounded-full shadow-xl transition-all duration-500 z-10"
                  style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* ベン図の表示エリア */}
        <div className="mb-10 flex justify-center">
          <VennDiagram
            scores={{
              time: parseInt(searchParams.get('time') || '0', 10),
              relations: parseInt(searchParams.get('relations') || '0', 10),
              cognition: parseInt(searchParams.get('cognition') || '0', 10),
              interest: parseInt(searchParams.get('interest') || '0', 10),
              activity: parseInt(searchParams.get('activity') || '0', 10),
              values: parseInt(searchParams.get('values') || '0', 10),
            }}
          />
        </div>

        {/* ベン図の簡易解説など */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
          <h3 className="font-bold text-slate-800 mb-2">診断分析レポート</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            あなたのタイプ {typeCode}（{typeName}）は、地域との関わりにおいて「{typeCode[0] === 'A' ? '活動的な時間活用' : '静かな時間活用'}」を基盤としています。
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