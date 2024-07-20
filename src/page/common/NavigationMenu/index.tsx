import React from 'react';
import "./../../../testCss.css";
import { trapezoidInfoIF, rectTrapezoid } from "../../../component/page/trapezoid";

export default function page() {

    const trapezoidInfos = [
        { label: "トップ", color: "red" },
        { label: "検索", color: "yellow" },
        { label: "新規Vtuber登録", color: "green" },
        { label: "問い合わせ", color: "lightblue" },
        { label: "ログイン", color: "blue" },
    ] as trapezoidInfoIF[];

    return (
        <>
            <div className="NavigationMenu">
                <div className="Tabs">
                    {/* <nav> */}
                    <ul>
                        {!!trapezoidInfos && trapezoidInfos.map((item: trapezoidInfoIF, index) => (
                            <li className={"zIndex" + (trapezoidInfos.length - index)}>
                                {rectTrapezoid(item)}
                            </li>
                        ))}
                        {/* <li><a href="#"><img src="広告3.png" /></a></li> */}
                    </ul>
                    {/* </nav> */}
                </div>
            </div >
        </>
    )
}