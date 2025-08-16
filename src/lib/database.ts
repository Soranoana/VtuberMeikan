import { Pool, PoolClient } from 'pg';
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

// PostgreSQL接続プールの作成
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'vtuber_meikan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// データベース接続テスト
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    return true;
  } catch (error) {
    console.error('データベース接続エラー:', error);
    return false;
  }
}

// プロフィール作成
export async function createProfile(profileData: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> {
  const client = await pool.connect();
  try {
    const id = uuidv4();
    const query = `
      INSERT INTO profiles (id, name, age, bio, email, location, interests, avatar)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      id,
      profileData.name,
      profileData.age,
      profileData.bio,
      profileData.email,
      profileData.location,
      profileData.interests,
      profileData.avatar
    ];
    
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// プロフィール一覧取得
export async function getProfiles(search?: string): Promise<Profile[]> {
  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM profiles ORDER BY created_at DESC';
    let values: string[] = [];
    
    if (search) {
      query = `
        SELECT * FROM profiles 
        WHERE name ILIKE $1 OR bio ILIKE $1 
        ORDER BY created_at DESC
      `;
      values = [`%${search}%`];
    }
    
    const result = await client.query(query, values);
    return result.rows;
  } finally {
    client.release();
  }
}

// プロフィール詳細取得
export async function getProfile(id: string): Promise<Profile | null> {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM profiles WHERE id = $1';
    const result = await client.query(query, [id]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

// プロフィール更新
export async function updateProfile(id: string, profileData: Partial<Omit<Profile, 'id' | 'createdAt'>>): Promise<Profile | null> {
  const client = await pool.connect();
  try {
    const fields = Object.keys(profileData)
      .filter(key => key !== 'id' && key !== 'createdAt')
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(profileData).filter((_, index) => 
      Object.keys(profileData)[index] !== 'id' && Object.keys(profileData)[index] !== 'createdAt'
    );
    
    if (fields.length === 0) {
      return getProfile(id);
    }
    
    const query = `
      UPDATE profiles 
      SET ${fields}
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await client.query(query, [id, ...values]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

// プロフィール削除
export async function deleteProfile(id: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const query = 'DELETE FROM profiles WHERE id = $1';
    const result = await client.query(query, [id]);
    return result.rowCount > 0;
  } finally {
    client.release();
  }
}

// プールをエクスポート（必要に応じて）
export { pool };
