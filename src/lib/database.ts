import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

// プロフィールの型定義
export interface Profile {
  id: string;
  name: string;
  age?: number;
  bio?: string;
  email?: string;
  location?: string;
  interests?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// データベース初期化
export async function initializeDatabase() {
  const db = await open({
    filename: './profiles.db',
    driver: sqlite3.Database
  });

  // プロフィールテーブルの作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER,
      bio TEXT,
      email TEXT,
      location TEXT,
      interests TEXT,
      avatar TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  return db;
}

// プロフィール作成
export async function createProfile(profileData: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await initializeDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const profile: Profile = {
    id,
    ...profileData,
    createdAt: now,
    updatedAt: now
  };

  await db.run(`
    INSERT INTO profiles (id, name, age, bio, email, location, interests, avatar, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [profile.id, profile.name, profile.age, profile.bio, profile.email, profile.location, profile.interests, profile.avatar, profile.createdAt, profile.updatedAt]);

  return profile;
}

// プロフィール一覧取得
export async function getProfiles(search?: string): Promise<Profile[]> {
  const db = await initializeDatabase();
  
  let query = 'SELECT * FROM profiles ORDER BY createdAt DESC';
  let params: string[] = [];
  
  if (search) {
    query = 'SELECT * FROM profiles WHERE name LIKE ? OR bio LIKE ? ORDER BY createdAt DESC';
    params = [`%${search}%`, `%${search}%`];
  }
  
  const profiles = await db.all(query, params);
  return profiles;
}

// プロフィール詳細取得
export async function getProfile(id: string): Promise<Profile | null> {
  const db = await initializeDatabase();
  const profile = await db.get('SELECT * FROM profiles WHERE id = ?', [id]);
  return profile || null;
}

// プロフィール更新
export async function updateProfile(id: string, profileData: Partial<Omit<Profile, 'id' | 'createdAt'>>) {
  const db = await initializeDatabase();
  const now = new Date().toISOString();
  
  const updateFields = Object.keys(profileData)
    .filter(key => key !== 'id' && key !== 'createdAt')
    .map(key => `${key} = ?`)
    .join(', ');
  
  const values = Object.values(profileData).filter((_, index) => 
    Object.keys(profileData)[index] !== 'id' && Object.keys(profileData)[index] !== 'createdAt'
  );
  
  await db.run(`
    UPDATE profiles 
    SET ${updateFields}, updatedAt = ?
    WHERE id = ?
  `, [...values, now, id]);
  
  return getProfile(id);
}

// プロフィール削除
export async function deleteProfile(id: string): Promise<boolean> {
  const db = await initializeDatabase();
  const result = await db.run('DELETE FROM profiles WHERE id = ?', [id]);
  return result.changes > 0;
}
