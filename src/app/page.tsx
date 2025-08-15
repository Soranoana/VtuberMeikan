'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Profile } from '@/lib/database';

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // プロフィール一覧を取得
  const fetchProfiles = async (search?: string) => {
    try {
      const url = search ? `/api/profiles?search=${encodeURIComponent(search)}` : '/api/profiles';
      const response = await fetch(url);
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // プロフィール削除
  const handleDelete = async (id: string) => {
    if (!confirm('このプロフィールを削除しますか？')) return;
    
    try {
      const response = await fetch(`/api/profiles/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProfiles(profiles.filter(profile => profile.id !== id));
        alert('プロフィールが削除されました');
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    }
  };

  // 検索実行
  const handleSearch = () => {
    fetchProfiles(searchTerm);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            プロフィール投稿サイト
          </h1>
          <p className="text-lg text-gray-600">
            あなたのプロフィールを投稿して、他の人と共有しましょう
          </p>
        </div>

        {/* 検索と新規作成ボタン */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="名前や自己紹介で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                検索
              </button>
            </div>
          </div>
          <Link
            href="/create"
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
          >
            新規プロフィール作成
          </Link>
        </div>

        {/* プロフィール一覧 */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">読み込み中...</div>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">プロフィールが見つかりません</div>
          </div>
        ) : (
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
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
