-- =====================================================================
-- V002__init_master_tables.sql
-- 静的マスターテーブル（システム管理）作成
--
-- 依存関係の都合上、以下の順序で作成する:
--   images_system → screen_element → activity_status → badge → priority
--   → response_status → report_reason → theme → user_role
--   → language(images_systemに依存) → sns_support(images_systemに依存)
--   → screen_word(languageに依存)
-- =====================================================================

-- --------------------------------------------------------------
-- images_system（画像(システム管理)）
-- --------------------------------------------------------------
CREATE TABLE images_system (
    images_system_sequence_id  serial PRIMARY KEY,
    gcs_bucket                 varchar(100) NOT NULL,
    gcs_object_name             varchar(512) NOT NULL,
    cdn_url                     varchar(512),
    content_type                 varchar(50),
    width                        integer,
    height                       integer,
    file_size                   integer,
    alt_text                     varchar(255),
    create_datetime              timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                  varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime               timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                   varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag               boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- screen_element（画面要素）
-- --------------------------------------------------------------
CREATE TABLE screen_element (
    screen_element_sequence_id  serial PRIMARY KEY,
    message_id                   varchar(16) NOT NULL UNIQUE,
    create_datetime               timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                   varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                    varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- activity_status（活動状態）
-- --------------------------------------------------------------
CREATE TABLE activity_status (
    activity_status_sequence_id   serial PRIMARY KEY,
    activity_status_physical_name  varchar(8) NOT NULL UNIQUE, -- 論理名はscreen_wordで管理
    create_datetime                 timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                     varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                  timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                      varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                  boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- badge（バッジ）
-- --------------------------------------------------------------
CREATE TABLE badge (
    badge_sequence_id       serial PRIMARY KEY,
    badge_physical_name      varchar(24) NOT NULL UNIQUE, -- 論理名はscreen_wordで管理
    create_datetime           timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user               varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime            timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag            boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- priority（優先度）
-- --------------------------------------------------------------
CREATE TABLE priority (
    priority_sequence_id     serial PRIMARY KEY,
    priority_physical_name    varchar(8) NOT NULL UNIQUE,
    priority_logical_name      varchar(8), -- 管理者向けのため日本語固定
    create_datetime             timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                 varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime              timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                  varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag              boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- response_status（対応状況）
-- --------------------------------------------------------------
CREATE TABLE response_status (
    response_status_sequence_id   serial PRIMARY KEY,
    response_status_physical_name  varchar(8) NOT NULL UNIQUE,
    response_status_logical_name    varchar(8), -- 管理者向けのため日本語固定
    create_datetime                   timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                       varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                    timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                        varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                    boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- report_reason（通報理由）
-- --------------------------------------------------------------
CREATE TABLE report_reason (
    report_reason_sequence_id   serial PRIMARY KEY,
    report_reason_physical_name  varchar(16) NOT NULL UNIQUE, -- 論理名はscreen_wordで管理
    create_datetime               timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                   varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                    varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- theme（画面テーマ）
-- --------------------------------------------------------------
CREATE TABLE theme (
    theme_sequence_id    serial PRIMARY KEY,
    theme_physical_name   varchar(16) NOT NULL UNIQUE, -- 論理名はscreen_wordで管理
    create_datetime        timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user            varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime         timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user             varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag         boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- user_role（ユーザー権限）
-- --------------------------------------------------------------
CREATE TABLE user_role (
    user_role_sequence_id   serial PRIMARY KEY,
    user_role_physical_name  varchar(8) NOT NULL UNIQUE, -- 論理名はscreen_wordで管理
    create_datetime           timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user               varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime            timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag            boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- language（表示言語） ※images_systemに依存
-- --------------------------------------------------------------
CREATE TABLE language (
    language_sequence_id    serial PRIMARY KEY,
    language_physical_name   varchar(16) NOT NULL UNIQUE, -- 論理名はscreen_wordで管理
    language_image            integer REFERENCES images_system(images_system_sequence_id), -- SVG
    enable                     boolean NOT NULL DEFAULT FALSE,
    create_datetime             timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                 varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime              timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                  varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag              boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- sns_support（サポートするSNS） ※images_systemに依存
-- --------------------------------------------------------------
CREATE TABLE sns_support (
    sns_support_sequence_id   serial PRIMARY KEY,
    sns_name_physical_name     varchar(32) NOT NULL UNIQUE,
    image_id                    integer NOT NULL REFERENCES images_system(images_system_sequence_id), -- SVG形式
    use_login_service            boolean NOT NULL DEFAULT TRUE,
    use_sns_link                  boolean NOT NULL DEFAULT TRUE,
    create_datetime                timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                    varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                 timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                     varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                 boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- screen_word（画面文言） ※languageに依存
--
-- 【注記】message_id は badge_sequence_id / screen_element_sequence_id など
-- 他テーブルの実際のIDを message_id_table に応じて格納するポリモーフィック参照。
-- PostgreSQLの通常のFK制約では参照整合性を保証できないため、存在チェックは
-- アプリケーション側で行うこと。
-- 【修正1】設計書では message_id が serial 型になっていたが、この列は
-- アプリ側が明示的に値を指定する列であり自動採番してはならないため、
-- integer 型に変更している。元のExcelもあわせて修正することを推奨。
-- 【修正2】設計書では message_id 単体に UNIQUE 制約が付いていたが、
-- 実際にテストしたところ、(a) badge / activity_status など別々のマスタ
-- テーブルの連番はそれぞれ1から始まるため message_id の値が衝突する、
-- (b) 同じmessage_idを複数言語分（dev/japanなど）登録する設計のため、
-- いずれにしても単体UNIQUEでは成立しないことが判明した。
-- (language_physical_name, message_id_table, message_id) の複合UNIQUEに変更している。
-- --------------------------------------------------------------
CREATE TABLE screen_word (
    screen_word_sequence_id   serial PRIMARY KEY,
    language_physical_name      integer REFERENCES language(language_sequence_id),
    message_id                   integer NOT NULL, -- ポリモーフィック参照（アプリ側で整合性担保）
    display_message                text,
    message_id_table                message_type_enum, -- メッセージID参照元テーブル
    create_datetime                  timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                      varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                   timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                       varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                   boolean     NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_screen_word_lang_type_message UNIQUE (language_physical_name, message_id_table, message_id)
);
