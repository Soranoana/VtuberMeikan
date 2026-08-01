-- =====================================================================
-- V004__init_content_tables.sql
-- 動的コンテンツテーブル作成
--
-- 依存関係の都合上、以下の順序で作成する:
--   join_group → users → tag → vtuber_profiles → sns_link → bbs_res
--   → page_author → contact → profile_report → images_contents
--   → likes → movie_link → relation → vtuber_profiles_lang
--   → profile_tag → profile_activity
-- =====================================================================

-- --------------------------------------------------------------
-- join_group（所属） ※activity_statusに依存
-- --------------------------------------------------------------
CREATE TABLE join_group (
    join_group_sequence_id   serial PRIMARY KEY,
    group_name                 varchar(64) NOT NULL UNIQUE,
    operation_status            integer REFERENCES activity_status(activity_status_sequence_id),
    group_detail                 text,
    create_datetime               timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                   varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                    varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- users（ユーザー） ※user_role, sns_support, theme, languageに依存
-- --------------------------------------------------------------
CREATE TABLE users (
    users_sequence_id      serial PRIMARY KEY,
    user_id                  varchar(8) NOT NULL UNIQUE DEFAULT generate_users_id(),
    user_name                 varchar(64),
    user_role_physical_name    integer REFERENCES user_role(user_role_sequence_id),
    user_name_hidden_flag        boolean NOT NULL DEFAULT FALSE,
    login_service                 integer REFERENCES sns_support(sns_support_sequence_id),
    register_date                  timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    disp_theme                      integer NOT NULL REFERENCES theme(theme_sequence_id) DEFAULT get_default_theme_id(),
    language                         integer NOT NULL REFERENCES language(language_sequence_id) DEFAULT get_default_language_id(),
    create_datetime                   timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                       varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                    timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                        varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                    boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- tag（タグ）
-- --------------------------------------------------------------
CREATE TABLE tag (
    tag_sequence_id   serial PRIMARY KEY,
    tag                 text NOT NULL UNIQUE,
    create_datetime       timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user           varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime        timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user            varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag        boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- vtuber_profiles（Vtuberプロフィール） ※users, join_group, activity_statusに依存
-- --------------------------------------------------------------
CREATE TABLE vtuber_profiles (
    vtuber_profiles_sequence_id   serial PRIMARY KEY,
    vtuber_profiles_id              varchar(8) NOT NULL UNIQUE DEFAULT generate_vtuber_profiles_id(), -- URLに使用。可変
    user_id                           integer REFERENCES users(users_sequence_id),
    join_group                        integer REFERENCES join_group(join_group_sequence_id),
    debut_date                         timestamptz,
    activity_status                     integer NOT NULL REFERENCES activity_status(activity_status_sequence_id),
    create_datetime                      timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                          varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                       timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                           varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                       boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- sns_link（SNSリンク） ※vtuber_profiles, sns_supportに依存
-- --------------------------------------------------------------
CREATE TABLE sns_link (
    sns_link_sequence_id     serial PRIMARY KEY,
    vtuber_profiles_id         integer NOT NULL REFERENCES vtuber_profiles(vtuber_profiles_sequence_id),
    sns_icon                     integer REFERENCES sns_support(sns_support_sequence_id), -- 選択なしも含む
    sns_link_label                 varchar(32), -- SNSアイコンに紐づくSNS名
    sns_url                          text NOT NULL,
    create_datetime                    timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                        varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                     timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                         varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                     boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- bbs_res（BBS） ※vtuber_profiles, usersに依存
-- --------------------------------------------------------------
CREATE TABLE bbs_res (
    bbs_res_sequence_id     serial PRIMARY KEY,
    vtuber_profiles_id        integer NOT NULL REFERENCES vtuber_profiles(vtuber_profiles_sequence_id),
    user_id                     integer NOT NULL REFERENCES users(users_sequence_id),
    res_text                     text NOT NULL,
    res_datetime                  timestamptz NOT NULL,
    create_datetime                 timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                     varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                  timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                      varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                  boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- page_author（ページ編集者） ※users, vtuber_profiles, screen_wordに依存
-- --------------------------------------------------------------
CREATE TABLE page_author (
    page_author_sequence_id    serial PRIMARY KEY,
    user_id                      integer NOT NULL REFERENCES users(users_sequence_id),
    vtuber_profiles_id            integer NOT NULL REFERENCES vtuber_profiles(vtuber_profiles_sequence_id),
    fix_item                        integer NOT NULL REFERENCES screen_word(screen_word_sequence_id),
    fix_before                       text NOT NULL,
    fix_after                         text NOT NULL,
    fix_datetime                       timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    report_count                        integer NOT NULL DEFAULT 0,
    create_datetime                       timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                           varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                        timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                            varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                        boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- contact（問い合わせ） ※priority, response_statusに依存
-- --------------------------------------------------------------
CREATE TABLE contact (
    contact_sequence_id              serial PRIMARY KEY,
    mail_address                        varchar(255) NOT NULL,
    subject                              varchar(255) NOT NULL,
    contact_detail                        text NOT NULL,
    priority_physical_name                  integer REFERENCES priority(priority_sequence_id),
    response_status_physical_name             integer REFERENCES response_status(response_status_sequence_id),
    create_datetime                             timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                                 varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                              timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                                  varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                              boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- profile_report（プロフィール通報） ※users, vtuber_profiles, report_reasonに依存
-- --------------------------------------------------------------
CREATE TABLE profile_report (
    profile_report_sequence_id     serial PRIMARY KEY,
    user_id                           integer REFERENCES users(users_sequence_id),
    vtuber_profiles_id                  integer NOT NULL REFERENCES vtuber_profiles(vtuber_profiles_sequence_id),
    report_reason_physical_name           integer NOT NULL REFERENCES report_reason(report_reason_sequence_id),
    report_detail                           text NOT NULL,
    report_datetime                           timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_datetime                             timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                                 varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                              timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                                  varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                              boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- images_contents（画像(ユーザー投稿)） ※usersに依存
-- --------------------------------------------------------------
CREATE TABLE images_contents (
    images_contents_sequence_id   serial PRIMARY KEY,
    user_id                          integer NOT NULL REFERENCES users(users_sequence_id),
    gcs_bucket                        varchar(100) NOT NULL,
    gcs_object_name                     varchar(512) NOT NULL,
    cdn_url                               varchar(512),
    content_type                           varchar(50),
    width                                    integer,
    height                                   integer,
    file_size                                integer,
    alt_text                                  varchar(255),
    create_datetime                             timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                                 varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                              timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                                  varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                              boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- likes（いいね） ※usersに依存
-- --------------------------------------------------------------
CREATE TABLE likes (
    likes_sequence_id     serial PRIMARY KEY,
    likes_do_user            integer NOT NULL REFERENCES users(users_sequence_id),
    likes_target_user          integer NOT NULL REFERENCES users(users_sequence_id),
    likes_type                    likes_type_enum NOT NULL,
    likes_datetime                  timestamptz NOT NULL,
    create_datetime                   timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                       varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                    timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                        varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                    boolean     NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_likes_do_target_type UNIQUE (likes_do_user, likes_target_user, likes_type)
);

-- --------------------------------------------------------------
-- movie_link（動画リンク） ※vtuber_profilesに依存
-- --------------------------------------------------------------
CREATE TABLE movie_link (
    movie_link_sequence_id   serial PRIMARY KEY,
    vtuber_profiles_id          integer NOT NULL REFERENCES vtuber_profiles(vtuber_profiles_sequence_id),
    url                            text NOT NULL,
    create_datetime                  timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                      varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                   timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                       varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                   boolean     NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------
-- relation（関係値） ※vtuber_profilesに依存（自己参照x2）
-- --------------------------------------------------------------
CREATE TABLE relation (
    relation_sequence_id   serial PRIMARY KEY,
    node_from                 integer NOT NULL REFERENCES vtuber_profiles(vtuber_profiles_sequence_id),
    node_to                     integer NOT NULL REFERENCES vtuber_profiles(vtuber_profiles_sequence_id),
    node_name                     varchar(32) NOT NULL,
    create_datetime                 timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                     varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                  timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                      varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                  boolean     NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_relation_from_to UNIQUE (node_from, node_to)
);

-- --------------------------------------------------------------
-- vtuber_profiles_lang（Vtuberプロフィール(各言語)） ※vtuber_profiles, languageに依存
-- --------------------------------------------------------------
CREATE TABLE vtuber_profiles_lang (
    vtuber_profiles_lang_sequence_id   serial PRIMARY KEY,
    vtuber_profiles_id                    integer NOT NULL REFERENCES vtuber_profiles(vtuber_profiles_sequence_id),
    lang                                     integer NOT NULL REFERENCES language(language_sequence_id),
    name                                       varchar(128) NOT NULL,
    nickname                                    varchar(128),
    birthday                                     varchar(32),
    blood_type                                    varchar(16),
    height                                          varchar(16),
    mutter                                           text,
    catchphrase                                       varchar(64),
    favorite                                            varchar(64),
    dis_favorite                                         varchar(64),
    hobby                                                  varchar(64),
    dream                                                    varchar(64),
    messages                                                  text,
    profile_detail                                              text, -- マークダウン対応
    create_datetime                                               timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                                                   varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                                                timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                                                    varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                                                boolean     NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_vtuber_profiles_lang_profile_lang UNIQUE (vtuber_profiles_id, lang)
);

-- --------------------------------------------------------------
-- profile_tag（プロフィールのタグ） ※vtuber_profiles, tagに依存
-- --------------------------------------------------------------
CREATE TABLE profile_tag (
    profile_tag_sequence_id   serial PRIMARY KEY,
    vtuber_profiles_id           integer NOT NULL REFERENCES vtuber_profiles(vtuber_profiles_sequence_id),
    tag                             integer NOT NULL REFERENCES tag(tag_sequence_id),
    create_datetime                   timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                       varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                    timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                        varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                    boolean     NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_profile_tag_profile_tag UNIQUE (vtuber_profiles_id, tag)
);

-- --------------------------------------------------------------
-- profile_activity（プロフィールの活動ジャンル） ※vtuber_profilesに依存
-- --------------------------------------------------------------
CREATE TABLE profile_activity (
    profile_activity_sequence_id   serial PRIMARY KEY,
    vtuber_profiles_id                 integer NOT NULL REFERENCES vtuber_profiles(vtuber_profiles_sequence_id),
    activity                              varchar(16) NOT NULL,
    create_datetime                        timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_user                            varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    update_datetime                         timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_user                             varchar(32)  NOT NULL DEFAULT CURRENT_USER,
    soft_delete_flag                         boolean     NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_profile_activity_profile_activity UNIQUE (vtuber_profiles_id, activity)
);
