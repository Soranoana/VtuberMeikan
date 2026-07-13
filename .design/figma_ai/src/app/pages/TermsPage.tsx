import { ScrollText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';

const SECTIONS = [
  {
    id: 1,
    title: '第1条（適用）',
    content: `本利用規約（以下「本規約」といいます）は、VTuber名鑑（以下「本サービス」といいます）の利用に関する条件を定めるものです。ユーザーの皆さまは、本規約に同意したうえで本サービスをご利用ください。本サービスを利用した場合、本規約に同意したものとみなします。`,
  },
  {
    id: 2,
    title: '第2条（定義）',
    content: `本規約において使用する用語の定義は次のとおりです。
・「ユーザー」：本サービスを利用するすべての方
・「コンテンツ」：本サービス上に投稿・掲載された文章、画像、動画リンクその他一切の情報
・「投稿コンテンツ」：ユーザーが本サービスに登録・編集したVTuberプロフィール情報および添付画像`,
  },
  {
    id: 3,
    title: '第3条（アカウントおよびログイン）',
    content: `本サービスへの情報登録・編集には、対応するソーシャルアカウント（Google 等）によるログインが必要になる場合があります。ユーザーは、自己の責任においてアカウントを管理し、第三者への貸与・譲渡を行ってはなりません。ログイン情報の漏洩・不正利用による損害について、当サービスは一切の責任を負いません。`,
  },
  {
    id: 4,
    title: '第4条（投稿コンテンツに関するルール）',
    content: `ユーザーが投稿するコンテンツについて、以下のルールを遵守してください。

1. 投稿するVTuberプロフィール情報は、公開されている正確な情報に基づくものとしてください。
2. 画像は、権利者（VTuber本人・所属事務所等）から公開・使用許諾を得たものに限ります。無断転載・著作権侵害となる画像のアップロードを禁止します。
3. 個人を特定できる非公開情報（自宅住所・電話番号・本名等）の掲載を禁止します。
4. 誹謗中傷・差別的表現・わいせつ表現を含むコンテンツの投稿を禁止します。
5. スパム・広告目的の投稿を禁止します。
6. 虚偽の情報を意図的に掲載することを禁止します。`,
  },
  {
    id: 5,
    title: '第5条（削除申請）',
    content: `VTuber本人またはその権利者は、掲載内容に問題がある場合、削除申請フォームよりお申し出ください。申請内容を確認のうえ、合理的な理由があると判断した場合に削除対応を行います。申請があった場合でも、必ずしも削除が行われるとは限りません。また、削除には一定の審査期間を要する場合があります。`,
  },
  {
    id: 6,
    title: '第6条（知的財産権）',
    content: `本サービス上のコンテンツに関する著作権・商標権その他の知的財産権は、当該コンテンツの権利者に帰属します。ユーザーが投稿したコンテンツの著作権はユーザーに帰属しますが、ユーザーは当サービスに対し、本サービスの運営・改善・広報を目的とした無償かつ非独占的な利用許諾を付与するものとします。`,
  },
  {
    id: 7,
    title: '第7条（禁止事項）',
    content: `以下の行為を禁止します。

・本サービスの運営を妨害する行為
・他のユーザーや第三者の権利・利益を侵害する行為
・不正アクセス・クラッキング等の行為
・本サービスを通じた営利目的の無断広告・勧誘行為
・法令または公序良俗に違反する行為
・その他、当サービスが不適切と判断する行為`,
  },
  {
    id: 8,
    title: '第8条（免責事項）',
    content: `当サービスは、本サービス上のコンテンツの正確性・完全性・最新性を保証しません。本サービスの利用によって生じた損害について、当サービスは故意または重大な過失がある場合を除き、一切の責任を負いません。本サービスは予告なく内容の変更・停止・終了を行う場合があります。`,
  },
  {
    id: 9,
    title: '第9条（個人情報の取り扱い）',
    content: `当サービスは、ユーザーの個人情報をプライバシーポリシーに従い適切に管理します。収集した情報は、本サービスの提供・改善・お問い合わせ対応の目的にのみ使用し、法令に基づく場合を除き第三者に提供しません。`,
  },
  {
    id: 10,
    title: '第10条（規約の変更）',
    content: `当サービスは、必要に応じて本規約を変更することができます。変更後の規約は、本サービス上に掲載した時点で効力を生じるものとし、ユーザーが本サービスを継続して利用した場合は変更後の規約に同意したものとみなします。重要な変更がある場合は、可能な限り事前にお知らせします。`,
  },
  {
    id: 11,
    title: '第11条（準拠法・管轄裁判所）',
    content: `本規約の解釈および適用は日本法に準拠します。本サービスに関して生じた紛争については、当サービス運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。`,
  },
];

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#FFFEF8] to-white">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">

        {/* パンくず */}
        <nav className="flex items-center gap-1.5 text-sm text-[#A69885] mb-8">
          <button onClick={() => navigate('/')} className="hover:text-[#8B7355] transition-colors">トップ</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#8B7355] font-medium">利用規約</span>
        </nav>

        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8DFC4] flex items-center justify-center">
            <ScrollText className="w-5 h-5 text-[#8B7355]" />
          </div>
          <h1 className="text-2xl font-bold text-[#3a3a3a]">利用規約</h1>
        </div>
        <p className="text-sm text-[#A69885] mb-1">Terms of Service</p>
        <p className="text-sm text-[#6b6b6b] mb-8">
          制定日：2024年11月1日　／　最終更新日：2026年7月1日
        </p>

        {/* 前文 */}
        <div className="bg-[#FFFBF0] border border-[#D4C5A9] rounded-xl px-6 py-5 mb-8 text-sm text-[#6b6b6b] leading-relaxed">
          本利用規約をよくお読みいただき、内容に同意いただいた場合のみ本サービスをご利用ください。VTuberプロフィールの登録・編集を行う際は、規約への同意が必要です。
        </div>

        {/* 目次 */}
        <div className="bg-white border border-[#D4C5A9] rounded-xl px-6 py-5 mb-10">
          <p className="text-xs font-semibold text-[#A69885] tracking-widest uppercase mb-3">目次</p>
          <ol className="space-y-1.5">
            {SECTIONS.map(s => (
              <li key={s.id}>
                <a
                  href={`#section-${s.id}`}
                  className="text-sm text-[#8B7355] hover:text-[#6B5945] hover:underline transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* 各条文 */}
        <div className="space-y-8">
          {SECTIONS.map(s => (
            <section key={s.id} id={`section-${s.id}`} className="scroll-mt-24">
              <h2 className="text-base font-bold text-[#3a3a3a] mb-3 pb-2 border-b border-[#E8DFC4]">
                {s.title}
              </h2>
              <p className="text-sm text-[#6b6b6b] leading-relaxed whitespace-pre-line">
                {s.content}
              </p>
            </section>
          ))}
        </div>

        {/* フッター */}
        <div className="mt-12 pt-6 border-t border-[#D4C5A9] text-center text-xs text-[#A69885]">
          <p>VTuber名鑑 運営事務局</p>
          <p className="mt-1">ご不明な点は<button onClick={() => navigate('/contact')} className="text-[#8B7355] underline hover:text-[#6B5945]">お問い合わせ</button>よりご連絡ください。</p>
        </div>
      </div>
    </div>
  );
}
