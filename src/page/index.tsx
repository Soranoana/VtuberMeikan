import React from 'react';
import PageTitle from "./common/PageTitle";
import NavigationMenu from "./common/NavigationMenu";
import LeftContent from "./common/LeftContent";
import ViewFooter from "./common/ViewFooter";
import SiteFooter from "./common/SiteFooter";
import Top from "./top";

export default function page() {
    return (
        <>
            <body>
                <PageTitle />
                <NavigationMenu />
                <LeftContent />
                <RightContent />
                <ViewFooter />
                <SiteFooter />
            </body>
        </>
    )
}

function RightContent() {
    return (
        <>
            <Top />
        </>
    )
}