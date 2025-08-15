import { NextRequest, NextResponse } from 'next/server';
import { getProfiles, createProfile } from '@/lib/database';

// GET: プロフィール一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    
    const profiles = await getProfiles(search);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    return NextResponse.json(
      { error: 'プロフィールの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// POST: 新規プロフィール作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 必須フィールドの検証
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: '名前は必須です' },
        { status: 400 }
      );
    }
    
    const profileData = {
      name: body.name.trim(),
      age: body.age ? parseInt(body.age) : undefined,
      bio: body.bio?.trim(),
      email: body.email?.trim(),
      location: body.location?.trim(),
      interests: body.interests?.trim(),
      avatar: body.avatar?.trim()
    };
    
    const profile = await createProfile(profileData);
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('プロフィール作成エラー:', error);
    return NextResponse.json(
      { error: 'プロフィールの作成に失敗しました' },
      { status: 500 }
    );
  }
}
