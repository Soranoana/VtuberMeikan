-- =====================================================================
-- V006__init_triggers.sql
-- 監査列自動更新トリガー
--
-- UPDATE時に update_datetime / update_user を自動更新する。
-- create_datetime / create_user はINSERT時のDEFAULTのみで、
-- UPDATE時には変更しない。
--
-- 【注意】CURRENT_USER はPostgreSQLの接続ロール名を返す。
-- アプリケーションがサービスアカウント1つでDBに接続する構成の場合、
-- 全行が同じ値（例: "app"）になり、実際にどのエンドユーザーが
-- 操作したかは記録されない。エンドユーザー単位で記録したい場合は、
-- アプリ側で `SET LOCAL app.current_user_id = '...'` のようなセッション
-- 変数を設定し、DEFAULT/トリガー内で
-- current_setting('app.current_user_id', true) を使う方式に
-- 変更する必要がある。個人開発の初期段階であれば一旦このままでも
-- 問題ないが、複数管理者での運用を始める際は見直しを推奨する。
-- =====================================================================

CREATE OR REPLACE FUNCTION set_update_audit_columns()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_datetime := CURRENT_TIMESTAMP;
    NEW.update_user := CURRENT_USER;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 対象テーブル全28件にBEFORE UPDATEトリガーを設定
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON vtuber_profiles       FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON join_group            FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON tag                    FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON badge                  FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON activity_status         FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON sns_link                 FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON bbs_res                   FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON page_author                FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON contact                     FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON priority                     FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON response_status              FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON language                      FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON screen_word                    FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON sns_support                     FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON profile_report                   FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON report_reason                     FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON users                              FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON theme                               FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON user_role                            FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON images_contents                       FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON images_system                          FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON screen_element                          FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON likes                                    FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON movie_link                                FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON relation                                   FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON vtuber_profiles_lang                        FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON profile_tag                                  FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
CREATE TRIGGER trg_update_audit BEFORE UPDATE ON profile_activity                              FOR EACH ROW EXECUTE FUNCTION set_update_audit_columns();
