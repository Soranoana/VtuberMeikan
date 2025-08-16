'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Profile } from '@/lib/database';

export default function SearchPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // プロフィール検索
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/profiles?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error('検索エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enterキーで検索実行
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vtuber検索
          </h1>
          <p className="text-lg text-gray-600">
            名前や自己紹介でVtuberを検索できます
          </p>
        </div>

        {/* 検索フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Vtuberの名前や自己紹介を入力..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchTerm.trim()}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
            >
              {loading ? '検索中...' : '検索'}
            </button>
          </div>
        </div>

        {/* 検索結果 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">検索中...</div>
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {profile.name}
                    </h3>
                    {profile.age && (
                      <span className="text-sm text-gray-500">{profile.age}歳</span>
                    )}
                  </div>
                  
                  {profile.bio && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {profile.bio}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/profile/${profile.id}`}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      詳細を見る
                    </Link>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/edit/${profile.id}`}
                        className="text-green-500 hover:text-green-600"
                      >
                        編集
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">検索結果が見つかりませんでした</div>
            <p className="text-gray-400 mt-2">別のキーワードで検索してみてください</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
