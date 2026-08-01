-- =====================================================================
-- V001__init_enum_types.sql
-- ENUM型の定義
-- =====================================================================

CREATE TYPE likes_type_enum AS ENUM ('profile', 'edit');

-- 【修正】設計書では message_type_enum は ('screen_element', 'other_tables') の
-- 2値だったが、実データを流してテストしたところ、badge / activity_status など
-- 複数のマスタテーブルがそれぞれ1から始まる連番を持つため、'other_tables'
-- という一つの値に束ねると screen_word.message_id が衝突することが判明した。
-- （例：badgeの1件目とactivity_statusの1件目が両方 message_id=1 になる）
-- 参照先テーブルごとに値を分けることで、この衝突を防いでいる。
CREATE TYPE message_type_enum AS ENUM (
    'screen_element',
    'badge',
    'activity_status',
    'priority',
    'response_status',
    'report_reason',
    'theme',
    'user_role'
);
