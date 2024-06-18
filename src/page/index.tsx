import React from 'react';
import PageTitle from "./common/pageTitle";
import NavigationMenu from "./common/navigationMenu";
import LeftContent from "./common/leftContent";
import ViewFooter from "./common/viewFooter";
import SiteFooter from "./common/siteFooter";
import Top from "./top";
import Profile from "./profile";
import "./../testCss.css";

export default function page() {
    return (
        <>
            <body>
                {/* タイトル */}
                <PageTitle />
                {/* メニューバー */}
                <NavigationMenu />
                {/* サブメニュー */}
                <LeftContent />
                {/* メインページ */}
                <RightContent />
                {/* フェードする画像 */}
                <ViewFooter />
                {/* コピーライトなど */}
                <SiteFooter />
            </body>
        </>
    )
}

function RightContent() {
    return (
        <>
            <Top />
            {/* <Profile /> */}
        </>
    )
}