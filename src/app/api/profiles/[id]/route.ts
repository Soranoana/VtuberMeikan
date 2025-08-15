import { NextRequest, NextResponse } from 'next/server';
import { getProfile, updateProfile, deleteProfile } from '@/lib/database';

// GET: プロフィール詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await getProfile(params.id);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'プロフィールが見つかりません' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    return NextResponse.json(
      { error: 'プロフィールの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// PUT: プロフィール更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const updatedProfile = await updateProfile(params.id, profileData);
    
    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'プロフィールが見つかりません' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    return NextResponse.json(
      { error: 'プロフィールの更新に失敗しました' },
      { status: 500 }
    );
  }
}

// DELETE: プロフィール削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteProfile(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'プロフィールが見つかりません' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'プロフィールが削除されました' });
  } catch (error) {
    console.error('プロフィール削除エラー:', error);
    return NextResponse.json(
      { error: 'プロフィールの削除に失敗しました' },
      { status: 500 }
    );
  }
}
