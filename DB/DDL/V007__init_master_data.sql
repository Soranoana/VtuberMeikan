-- =====================================================================
-- V007__init_master_data.sql
-- マスタデータ初期投入
--
-- 【注意】
-- - images_system の gcs_bucket / gcs_object_name はプレースホルダーです。
--   実際のアイコン画像をCloud Storageにアップロードした後、正しいパスに
--   書き換えてください。
-- - screen_word の display_message はサンプルです。文言が固まったら
--   実際の表示テキストに置き換えてください。
-- - IDは自動採番のため、他レコードを参照する箇所はすべて物理名からの
--   サブクエリで解決しており、投入順に依存しません。
-- =====================================================================

-- --------------------------------------------------------------
-- activity_status（活動状態）
-- --------------------------------------------------------------
INSERT INTO activity_status (activity_status_physical_name) VALUES
    ('before'),   -- 活動開始前(VTuber準備中) ※varchar(8)制限のため短縮
    ('active'),   -- 活動中
    ('graduate'); -- 卒業済み ※varchar(8)制限のため短縮

-- --------------------------------------------------------------
-- badge（バッジ）
-- --------------------------------------------------------------
INSERT INTO badge (badge_physical_name) VALUES
    ('most_watch'),
    ('newcomer'),
    ('recently_update');

-- --------------------------------------------------------------
-- priority（優先度）
-- --------------------------------------------------------------
INSERT INTO priority (priority_physical_name, priority_logical_name) VALUES
    ('high', '最優先'),
    ('normal', '通常'),
    ('low', '優先度低');

-- --------------------------------------------------------------
-- response_status（対応状況）
-- --------------------------------------------------------------
INSERT INTO response_status (response_status_physical_name, response_status_logical_name) VALUES
    ('pending', '未対応'),  -- ※varchar(8)制限のため短縮
    ('working', '対応中'),  -- ※varchar(8)制限のため短縮
    ('done', '対応済み');

-- --------------------------------------------------------------
-- report_reason（通報理由）
-- --------------------------------------------------------------
INSERT INTO report_reason (report_reason_physical_name) VALUES
    ('inappropriate'), -- ※varchar(16)制限のため短縮
    ('copyright'),
    ('spam'),
    ('other');

-- --------------------------------------------------------------
-- theme（画面テーマ） ※usersのdisp_themeデフォルトが参照する'default'を含む
-- --------------------------------------------------------------
INSERT INTO theme (theme_physical_name) VALUES
    ('default'),
    ('light'),
    ('dark');

-- --------------------------------------------------------------
-- user_role（ユーザー権限）
-- --------------------------------------------------------------
INSERT INTO user_role (user_role_physical_name) VALUES
    ('admin'),
    ('vtuber'),
    ('general');

-- --------------------------------------------------------------
-- language（表示言語） ※usersのlanguageデフォルトが参照する'japan'を含む
-- 'dev' は開発中の内部利用および将来的な検証環境専用の物理名確認用
-- --------------------------------------------------------------
INSERT INTO language (language_physical_name, enable) VALUES
    ('dev', TRUE),
    ('japan', TRUE);

-- --------------------------------------------------------------
-- images_system（画像(システム管理)） ※sns_support.image_idがNOT NULLで参照するため先に投入
-- 【要置き換え】実際のアイコン画像のパスに差し替えること
-- --------------------------------------------------------------
INSERT INTO images_system (gcs_bucket, gcs_object_name, content_type) VALUES
    ('vtubermeikan-system-images', 'sns_icons/google.svg', 'image/svg+xml'),
    ('vtubermeikan-system-images', 'sns_icons/x.svg', 'image/svg+xml'),
    ('vtubermeikan-system-images', 'sns_icons/youtube.svg', 'image/svg+xml');

-- --------------------------------------------------------------
-- sns_support（サポートするSNS）
-- --------------------------------------------------------------
INSERT INTO sns_support (sns_name_physical_name, image_id, use_login_service, use_sns_link)
SELECT 'google', images_system_sequence_id, TRUE, FALSE
FROM images_system WHERE gcs_object_name = 'sns_icons/google.svg';

INSERT INTO sns_support (sns_name_physical_name, image_id, use_login_service, use_sns_link)
SELECT 'x_twitter', images_system_sequence_id, FALSE, TRUE
FROM images_system WHERE gcs_object_name = 'sns_icons/x.svg';

INSERT INTO sns_support (sns_name_physical_name, image_id, use_login_service, use_sns_link)
SELECT 'youtube', images_system_sequence_id, FALSE, TRUE
FROM images_system WHERE gcs_object_name = 'sns_icons/youtube.svg';

-- --------------------------------------------------------------
-- screen_word（画面文言） ※'japan'言語での各マスタ論理名サンプル
-- message_id_table によって、message_id は各マスタの
-- *_sequence_id を格納する（ポリモーフィック参照）
-- --------------------------------------------------------------
INSERT INTO screen_word (language_physical_name, message_id, display_message, message_id_table)
SELECT
    (SELECT language_sequence_id FROM language WHERE language_physical_name = 'japan'),
    badge_sequence_id,
    CASE badge_physical_name
        WHEN 'most_watch' THEN 'よく見られているVtuber'
        WHEN 'newcomer' THEN '新人Vtuber'
        WHEN 'recently_update' THEN '最近更新されたVtuber'
    END,
    'badge'
FROM badge;

INSERT INTO screen_word (language_physical_name, message_id, display_message, message_id_table)
SELECT
    (SELECT language_sequence_id FROM language WHERE language_physical_name = 'japan'),
    activity_status_sequence_id,
    CASE activity_status_physical_name
        WHEN 'before' THEN '活動開始前(VTuber準備中)'
        WHEN 'active' THEN '活動中'
        WHEN 'graduate' THEN '卒業済み'
    END,
    'activity_status'
FROM activity_status;
