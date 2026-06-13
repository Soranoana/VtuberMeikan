import { Card } from './ui/card';

interface AdBannerProps {
  position?: string; // 広告の位置を識別するためのラベル
  variant?: 'horizontal' | 'vertical'; // 横長 or 縦長
  className?: string;
}

export function AdBanner({ 
  position = 'default', 
  variant = 'horizontal',
  className = '' 
}: AdBannerProps) {
  // スマホで非表示にする広告位置のリスト
  const hideOnMobile = ['detail-top', 'search-top', /*'newProfile-top',*/ 'new-profile-top', 'new-profile-form-top', 'contact-top', 'login-top'];
  const shouldHideOnMobile = hideOnMobile.includes(position);

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 overflow-hidden shadow-md ${shouldHideOnMobile ? 'hidden md:block' : ''} ${className}`}>
      <div className="p-3 bg-gradient-to-r from-blue-200 to-blue-300 border-b-2 border-blue-400">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-800 bg-white px-2 py-0.5 rounded">AD</span>
          <h3 className="text-sm font-semibold text-blue-900">スポンサー</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
          <div className={variant === 'horizontal' ? 'flex items-center gap-4' : 'space-y-2'}>
            <div 
              className={`${
                variant === 'horizontal' 
                  ? 'w-40 h-24 flex-shrink-0' 
                  : 'w-full h-32'
              } bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center`}
            >
              <p className="text-sm text-gray-500 font-medium">広告スペース</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 font-semibold mb-1">あなたのVTuber活動を応援します</p>
              <p className="text-xs text-gray-500 line-clamp-2">
                VTuber向けの配信機材、編集ソフト、グッズ制作サービスなどをご紹介
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}