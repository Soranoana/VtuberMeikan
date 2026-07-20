# DB設計ER図

```mermaid
erDiagram
    vtuber_profiles {
        uuid vtuber_profiles_uuid PK
        uuid user_id FK
        uuid join_group FK
        uuid activity_status FK
    }
    join_group {
        uuid join_group_uuid PK
        uuid operation_status FK
    }
    activity_status {
        uuid activity_status_uuid PK
    }
    sns_link {
        uuid sns_link_uuid PK
        uuid vtuber_profiles_id FK
        uuid sns_icon FK
    }
    bbs_res {
        uuid bbs_res_uuid PK
        uuid vtuber_profiles_id FK
        uuid user_id FK
    }
    page_author {
        uuid page_author_uuid PK
        uuid user_id FK
        uuid vtuber_profiles_id FK
        uuid fix_item FK
    }
    contact {
        uuid contact_uuid PK
        uuid priority_physical_name FK
        uuid response_status_physical_name FK
    }
    priority {
        uuid priority_uuid PK
    }
    response_status {
        uuid response_status_uuid PK
    }
    language {
        uuid language_uuid PK
    }
    screen_word {
        uuid screen_word_uuid PK
        uuid language_physical_name FK
        uuid message_id FK
    }
    sns_support {
        uuid sns_support_uuid PK
        uuid image_id FK
    }
    profile_report {
        uuid profile_report_uuid PK
        uuid user_id FK
        uuid vtuber_profiles_id FK
        uuid report_reason_physical_name FK
    }
    report_reason {
        uuid report_reason_uuid PK
    }
    users {
        uuid users_uuid PK
        uuid user_role_physical_name FK
        uuid login_service FK
        uuid disp_theme FK
        uuid language FK
    }
    theme {
        uuid theme_uuid PK
    }
    user_role {
        uuid user_role_uuid PK
    }
    images_contents {
        uuid images_contents_uuid PK
        uuid user_id FK
    }
    images_system {
        uuid images_system_uuid PK
    }
    screen_element {
        uuid screen_element_uuid PK
    }
    likes {
        uuid likes_uuid PK
        uuid likes_do_user FK
        uuid likes_target_user FK
    }
    movie_link {
        uuid movie_link_uuid PK
        uuid vtuber_profiles_id FK
    }
    relation {
        uuid relation_uuid PK
        uuid node_from FK
        uuid node_to FK
    }
    vtuber_profiles_lang {
        uuid vtuber_profiles_lang_uuid PK
        uuid vtuber_profiles_id FK
        uuid lang FK
    }
    tag {
        uuid tag_uuid PK
    }
    profile_tag {
        uuid profile_tag_uuid PK
        uuid vtuber_profiles_id FK
        uuid tag FK
    }
    profile_activity {
        uuid profile_activity_uuid PK
        uuid vtuber_profiles_id FK
    }

    vtuber_profiles ||--o{ sns_link : has
    vtuber_profiles ||--o{ bbs_res : has
    vtuber_profiles ||--o{ page_author : has
    vtuber_profiles ||--o{ profile_report : has
    vtuber_profiles ||--o{ movie_link : has
    vtuber_profiles ||--o{ relation : node
    vtuber_profiles ||--o{ vtuber_profiles_lang : has
    vtuber_profiles ||--o{ profile_tag : has
    vtuber_profiles ||--o{ profile_activity : has
    vtuber_profiles }o--|| users : owned_by
    vtuber_profiles }o--|| join_group : belongs_to
    vtuber_profiles }o--|| activity_status : status

    join_group }o--|| activity_status : operation_status

    sns_link }o--|| vtuber_profiles : profile
    sns_link }o--|| sns_support : icon

    bbs_res }o--|| vtuber_profiles : profile
    bbs_res }o--|| users : author

    page_author }o--|| users : author
    page_author }o--|| vtuber_profiles : profile
    page_author }o--|| screen_word : fix_item

    contact }o--|| priority : priority
    contact }o--|| response_status : response

    screen_word }o--|| language : language
    screen_word }o--|| screen_element : element

    sns_support }o--|| images_system : image

    profile_report }o--|| users : reporter
    profile_report }o--|| vtuber_profiles : target
    profile_report }o--|| report_reason : reason

    users }o--|| user_role : role
    users }o--|| sns_support : login_service
    users }o--|| theme : theme
    users }o--|| language : language

    images_contents }o--|| users : owner

    likes }o--|| users : do_user
    likes }o--|| users : target_user

    movie_link }o--|| vtuber_profiles : profile

    relation }o--|| vtuber_profiles : source
    relation }o--|| vtuber_profiles : target

    vtuber_profiles_lang }o--|| vtuber_profiles : profile
    vtuber_profiles_lang }o--|| language : language

    profile_tag }o--|| vtuber_profiles : profile
    profile_tag }o--|| tag : tag

    profile_activity }o--|| vtuber_profiles : profile
```
