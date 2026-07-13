import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, ChevronRight } from 'lucide-react';
import { VTuberProfile } from '../types';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface SidebarProps {
  profiles: VTuberProfile[];
  collapsible?: boolean; // 折りたたみ可能かどうか
}

export function Sidebar({ profiles, collapsible = false }: SidebarProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = !collapsible || isHovered;

  return (
    <aside
      className={`space-y-4 transition-all duration-300 ${
        collapsible ? 'fixed left-0 top-20 z-40 h-[calc(100vh-5rem)]' : ''
      } ${
        collapsible && !isExpanded ? 'w-8' : collapsible ? 'w-80' : ''
      }`}
      onMouseEnter={() => collapsible && setIsHovered(true)}
      onMouseLeave={() => collapsible && setIsHovered(false)}
    >
      {/* 折りたたみ時のタブ表示 */}
      {collapsible && !isExpanded && (
        <div className="bg-primary h-full rounded-r-lg flex items-center justify-center shadow-lg cursor-pointer">
          <ChevronRight className="w-5 h-5 text-primary-foreground" />
        </div>
      )}

      {/* サイドバーコンテンツ */}
      <div
        className={`${
          collapsible && !isExpanded ? 'hidden' : 'block'
        } ${
          collapsible ? 'overflow-y-auto max-h-full pr-2' : ''
        } space-y-4`}
      >
        {/* VTuberの検索 */}
        <Card className="bg-[#FFFEF8] border-2 border-[#D4C5A9] overflow-hidden shadow-md">
          <div className="p-4 bg-gradient-to-r from-[#E8DFC4] to-[#F4E9D6] border-b-2 border-[#D4C5A9]">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-[#8B7355]" />
              <h3 className="text-[#8B7355]">VTuberの検索</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <Input
                placeholder="名前で検索..."
                className="border-2 border-[#D4C5A9] focus:border-[#8B7355] bg-[#FFFEF8]"
              />
              <Button
                className="w-full bg-[#8B7355] hover:bg-[#6B5945] text-white"
                onClick={() => navigate('/search')}
              >
                <Search className="w-4 h-4 mr-2" />
                検索する
              </Button>
            </div>
          </div>
        </Card>

        {/* 広告 */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 overflow-hidden shadow-md">
          <div className="p-4 bg-gradient-to-r from-blue-200 to-blue-300 border-b-2 border-blue-400">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-800 bg-white px-2 py-0.5 rounded">AD</span>
              <h3 className="text-sm font-semibold text-blue-900">スポンサー</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
              <div className="space-y-2">
                <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
                  <p className="text-sm text-gray-500 font-medium">広告スペース</p>
                </div>
                <p className="text-xs text-gray-600 font-semibold">あなたのVTuber活動を応援します</p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  VTuber向けの配信機材、編集ソフト、グッズ制作サービスなどをご紹介
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </aside>
  );
}
