// data/questions.ts

// 6つの区分（カテゴリ）の型定義
export type Category = 'time' | 'relations' | 'cognition' | 'interest' | 'activity' | 'values';

// 質問1つあたりのデータ構造
export interface Question {
  id: number;
  category: Category;
  text: string;
}

// 24個の質問データ一覧
export const questions: Question[] = [
  // ==========================================
  // ■ 環境系 (Environment)
  // ==========================================
  
  // 1. 時間 (time)
  { id: 1, category: 'time', text: '暇な時間が多いと感じる' },
  { id: 2, category: 'time', text: '休日は家にいることが多い' },
  { id: 3, category: 'time', text: '平日は忙しい' },
  { id: 4, category: 'time', text: '空いた時間は趣味や休息に使う' },

  // 2. 人間関係 (relations)
  { id: 5, category: 'relations', text: '一人でいることが好き' },
  { id: 6, category: 'relations', text: '関わるなら同じ年代がいい' },
  { id: 7, category: 'relations', text: '知らない人と何かすることに抵抗がない' },
  { id: 8, category: 'relations', text: '近所の人と積極的に関わる方である' },

  // 3. 認知 (cognition)
  { id: 9, category: 'cognition', text: 'ポストのチラシは見る' },
  { id: 10, category: 'cognition', text: 'CMは飛ばす' },
  { id: 11, category: 'cognition', text: 'YouTubeなどで、関連するコンテンツを見ることがある' },
  { id: 12, category: 'cognition', text: '掲示板や回覧板に触れたことがある。' },

  // ==========================================
  // ■ 行動系 (Action)
  // ==========================================

  // 4. 興味 (interest)
  { id: 13, category: 'interest', text: '新しいことを知るのが好きである' },
  { id: 14, category: 'interest', text: '身近な出来事には自然と興味がわく' },
  { id: 15, category: 'interest', text: '気になったことは自ら調べることが多い' },
  { id: 16, category: 'interest', text: '自分は話題や流行に敏感である' },

  // 5. 活動 (activity)
  { id: 17, category: 'activity', text: '興味と関連する催事に参加したことがある' },
  { id: 18, category: 'activity', text: '興味があれば一人でも参加する' },
  { id: 19, category: 'activity', text: '新しいことを始めたことがある' },
  { id: 20, category: 'activity', text: '初めての場所には抵抗がない' },

  // 6. 価値観 (values)
  { id: 21, category: 'values', text: '趣味に対してお金をかけられる' },
  { id: 22, category: 'values', text: '他人に役立つことにお金を使える' },
  { id: 23, category: 'values', text: '人のために時間を使うことに価値を感じる' },
  { id: 24, category: 'values', text: '責任ある役割を請け負える' }
];