// 言語ごとに異なるテキストフィールド
export interface VTuberLocalization {
  name?: string;
  nickname?: string;
  catchphrase?: string;
  oneWord?: string;
  dream?: string;
  message?: string;
  favoriteThings?: string;
  dislikedThings?: string;
  hobby?: string;
  freeDescription?: string;
}

export interface VTuberRelationship {
  targetId: string;
  label: string;
  direction?: 'to' | 'from' | 'both';
  reverseLabel?: string; // target→center のラベル（label と異なる場合のみ設定）
}

export interface VTuberProfile {
  id: string;
  name: string;
  nickname: string;
  affiliation: string;
  birthday: string;
  debut: string;
  bloodType: string;
  height: string;
  favoriteThings: string;
  dislikedThings: string;
  hobby: string;
  catchphrase: string;
  dream: string;
  message: string;
  oneWord?: string;
  activityHistory?: string;
  activityGenre?: string;
  activityStatus?: string;
  imageUrl?: string;
  imageUrls?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt?: Date;
  viewCount?: number;
  likeCount?: number;
  youtubeUrl?: string;
  xUrl?: string;
  tiktokUrl?: string;
  websiteUrl?: string;
  videoUrls?: string[];
  freeDescription?: string;
  snsLinks?: { icon: string; label: string; url: string }[];
  weight?: string;
  location?: string;
  streamingTags?: string;
  fanartTag?: string;
  r18FanartTag?: string;
  relationships?: VTuberRelationship[];
  localizations?: { [lang: string]: VTuberLocalization };
}
