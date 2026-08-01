-- =====================================================================
-- V005__init_indexes.sql
-- インデックス作成
--
-- PKおよびUNIQUE制約（V002/V004で作成済み）にはPostgreSQLが自動で
-- インデックスを作成するため、ここには含めない。
-- =====================================================================

-- vtuber_profiles
CREATE INDEX idx_vtuber_profiles_user_id        ON vtuber_profiles (user_id);
CREATE INDEX idx_vtuber_profiles_join_group      ON vtuber_profiles (join_group);
CREATE INDEX idx_vtuber_profiles_activity_status ON vtuber_profiles (activity_status);

-- sns_link
CREATE INDEX idx_sns_link_profile ON sns_link (vtuber_profiles_id);

-- bbs_res
CREATE INDEX idx_bbs_res_profile  ON bbs_res (vtuber_profiles_id);
CREATE INDEX idx_bbs_res_user     ON bbs_res (user_id);
CREATE INDEX idx_bbs_res_datetime ON bbs_res (res_datetime DESC); -- 投稿日時降順ソート

-- page_author
CREATE INDEX idx_page_author_profile ON page_author (vtuber_profiles_id);
CREATE INDEX idx_page_author_user    ON page_author (user_id);

-- movie_link
CREATE INDEX idx_movie_link_profile ON movie_link (vtuber_profiles_id);

-- profile_report
CREATE INDEX idx_profile_report_profile ON profile_report (vtuber_profiles_id);
CREATE INDEX idx_profile_report_user    ON profile_report (user_id);

-- likes（被いいねの検索用。do_user/target_user/typeの複合UNIQUEはV004で作成済み）
CREATE INDEX idx_likes_target_user ON likes (likes_target_user);

-- screen_word（言語×文言種別×message_idの検索は、V002で追加した複合UNIQUE制約
-- uq_screen_word_lang_type_message の自動インデックスでカバーされるため、
-- 重複する非UNIQUEインデックスはここでは作成しない）

-- images_contents
CREATE INDEX idx_images_contents_user ON images_contents (user_id);
