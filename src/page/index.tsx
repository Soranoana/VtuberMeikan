import React from 'react';
import PageTitle from "@/src/page/common/pageTitle";
import NavigationMenu from "@/src/page/common/navigationMenu";
import LeftContent from "@/src/page/common/leftContent";
import ViewFooter from "@/src/page/common/viewFooter";
import SiteFooter from "@/src/page/common/siteFooter";
import Top from "@/src/page/top";
import Profile from "@/src/page/profile";
import "@/src/../testCss.css";

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