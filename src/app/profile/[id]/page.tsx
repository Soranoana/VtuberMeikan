'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Profile } from '@/lib/database';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${params.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else if (response.status === 404) {
          setError('プロフィールが見つかりません');
        } else {
          setError('プロフィールの取得に失敗しました');
        }
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
        setError('プロフィールの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('このプロフィールを削除しますか？この操作は取り消せません。')) {
      return;
    }

    try {
      const response = await fetch(`/api/profiles/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('プロフィールが削除されました');
        router.push('/');
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || 'プロフィールが見つかりません'}</div>
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {profile.avatar && (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  {profile.age && (
                    <p className="text-lg opacity-90">{profile.age}歳</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/edit/${profile.id}`}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  編集
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  削除
                </button>
              </div>
            </div>
          </div>

          {/* プロフィール詳細 */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  基本情報
                </h2>
                
                {profile.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">自己紹介</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
                  </div>
                )}

                {profile.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">メールアドレス</h3>
                    <p className="text-gray-700">{profile.email}</p>
                  </div>
                )}

                {profile.location && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">居住地</h3>
                    <p className="text-gray-700">{profile.location}</p>
                  </div>
                )}
              </div>

              {/* 追加情報 */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  追加情報
                </h2>

                {profile.interests && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">興味・趣味</h3>
                    <p className="text-gray-700">{profile.interests}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">作成日</h3>
                  <p className="text-gray-700">
                    {new Date(profile.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">最終更新</h3>
                  <p className="text-gray-700">
                    {new Date(profile.updatedAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-center">
                <Link
                  href={`/edit/${profile.id}`}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  プロフィールを編集
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
