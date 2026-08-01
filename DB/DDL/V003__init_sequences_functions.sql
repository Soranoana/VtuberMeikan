-- =====================================================================
-- V003__init_sequences_functions.sql
-- 採番シーケンス・関数
--
-- 【注記：当初計画からの変更】
-- 設計書上の当初計画では「V003=コンテンツテーブル」「V004=シーケンス・関数」
-- の順だったが、V004(旧)で定義する関数を V003(旧content) の users /
-- vtuber_profiles テーブルの DEFAULT 句が参照するため、関数を先に作る
-- 必要がある。そのため本ファイルを V003、コンテンツテーブル作成を
-- V004 に入れ替えている。
--
-- 【注記：マスタFKデフォルト値の実装方式】
-- users.disp_theme / users.language のデフォルト値は、PostgreSQLの
-- DEFAULT句には直接サブクエリを書けない制約があるため、
-- 「サブクエリを内包したSTABLE関数」でラップして実現する。
-- =====================================================================

-- --------------------------------------------------------------
-- vtuber_profiles_id 用（例: VP000001）
-- --------------------------------------------------------------
CREATE SEQUENCE vtuber_profiles_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_vtuber_profiles_id()
RETURNS VARCHAR(8) AS $$
BEGIN
    RETURN 'VP' || LPAD(nextval('vtuber_profiles_id_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------------
-- users.user_id 用（例: US000001）
-- --------------------------------------------------------------
CREATE SEQUENCE users_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_users_id()
RETURNS VARCHAR(8) AS $$
BEGIN
    RETURN 'US' || LPAD(nextval('users_id_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------------
-- users.disp_theme のデフォルト値取得
-- theme.theme_physical_name = 'default' の行のIDを返す
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_default_theme_id()
RETURNS integer AS $$
    SELECT theme_sequence_id
    FROM theme
    WHERE theme_physical_name = 'default';
$$ LANGUAGE sql STABLE;

-- --------------------------------------------------------------
-- users.language のデフォルト値取得
-- language.language_physical_name = 'japan' の行のIDを返す
-- --------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_default_language_id()
RETURNS integer AS $$
    SELECT language_sequence_id
    FROM language
    WHERE language_physical_name = 'japan';
$$ LANGUAGE sql STABLE;
