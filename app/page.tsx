import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      {/* タイトル */}
      <h1 className="text-4xl font-bold mb-4">
        SILENT MBTI
      </h1>

      {/* 簡単な説明文 */}
      <p className="text-gray-600 mb-8 max-w-md">
        静かな空間で、本当の自分を見つける性格診断。
        いくつかの質問に答えて、あなたのタイプを紐解きましょう。
      </p>

      {/* 診断開始ボタン */}
      <Link 
        href="/diagnostic"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition"
      >
        診断をはじめる
      </Link>
    </main>
  );
}