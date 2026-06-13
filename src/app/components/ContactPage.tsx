import { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Mail, Send } from 'lucide-react';
import { AdBanner } from './AdBanner';
import { adConfig } from '../config/adConfig';

export function ContactPage() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 送信処理（実際にはバックエンドに送信）
    console.log({ email, subject, message });
    
    // 送信完了メッセージを表示
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="w-full space-y-4">
        {/* 上部広告 */}
        {adConfig.contactTop && (
          <AdBanner position="contact-top" variant="vertical" />
        )}

        <div className="bg-[#FFFEF8] border-2 border-[#D4C5A9] rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-6 h-6 text-[#8B7355]" />
              <h2 className="text-[#8B7355]">お問い合わせ</h2>
            </div>
            <p className="text-sm text-[#6b6b6b]">
              ご質問やご意見がございましたら、お気軽にお問い合わせください
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-[#E8F5E9] border-2 border-[#81C784] rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Send className="w-5 h-5 text-[#4CAF50]" />
                <p className="text-[#2E7D32]">お問い合わせを送信しました</p>
              </div>
              <p className="text-sm text-[#558B2F]">
                ご連絡ありがとうございます。内容を確認の上、順次ご返信いたします。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* メールアドレス */}
              <div>
                <label className="block text-sm text-[#8B7355] mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full bg-white border-[#D4C5A9] focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                <p className="mt-1 text-xs text-[#6b6b6b]">
                  ご返信先のメールアドレスを入力してください
                </p>
              </div>

              {/* 件名 */}
              <div>
                <label className="block text-sm text-[#8B7355] mb-2">
                  件名 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="お問い合わせの件名を入力してください"
                  required
                  className="w-full bg-white border-[#D4C5A9] focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
              </div>

              {/* 問い合わせ内容 */}
              <div>
                <label className="block text-sm text-[#8B7355] mb-2">
                  問い合わせ内容 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="お問い合わせ内容を詳しくご記入ください"
                  required
                  rows={8}
                  className="w-full bg-white border-[#D4C5A9] focus:border-[#8B7355] focus:ring-[#8B7355] resize-none"
                />
                <p className="mt-1 text-xs text-[#6b6b6b]">
                  できるだけ詳しくご記入いただけますと、スムーズな対応が可能です
                </p>
              </div>

              {/* 送信ボタン */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#8B7355] hover:bg-[#6B5945] text-white flex items-center justify-center gap-2"
                  disabled={!email || !subject || !message}
                >
                  <Send className="w-4 h-4" />
                  送信する
                </Button>
              </div>
            </form>
          )}

          {/* 注意事項 */}
          <div className="mt-8 pt-6 border-t-2 border-[#D4C5A9]">
            <h3 className="text-sm text-[#8B7355] mb-3">ご注意事項</h3>
            <ul className="space-y-2 text-xs text-[#6b6b6b]">
              <li className="flex items-start gap-2">
                <span className="text-[#8B7355] mt-0.5">•</span>
                <span>お問い合わせ内容によっては、回答までにお時間をいただく場合がございます</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B7355] mt-0.5">•</span>
                <span>土日祝日のお問い合わせは、翌営業日以降の対応となります</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B7355] mt-0.5">•</span>
                <span>お問い合わせの内容によっては、回答できない場合がございます</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 下部広告 */}
        {adConfig.contactBottom && (
          <AdBanner position="contact-bottom" variant="vertical" />
        )}
      </div>
    </div>
  );
}