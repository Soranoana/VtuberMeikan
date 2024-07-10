import React from 'react';
import "@/src/page/testCss.css";

export default function page() {
    return (
        <>
            <div className="NavigationMenu">
                <div className="Tabs">
                    {/* <nav> */}
                    <ul>
                        <li className="zIndex5">
                            {/* <a href="#"> */}
                            <div className="trapezoidWithShadow">
                                <div className="rectTrapezoid red">トップ</div>
                            </div>
                            {/* </a> */}
                        </li>
                        <li className="zIndex4">
                            {/* <a href="#"> */}
                            <div className="trapezoidWithShadow">
                                <div className="rectTrapezoid yellow">検索</div>
                            </div>
                            {/* </a> */}
                        </li>
                        <li className="zIndex3">
                            {/* <a href="#"> */}
                            <div className="trapezoidWithShadow">
                                <div className="rectTrapezoid green">新規Vtuber登録</div>
                            </div>
                            {/* </a> */}
                        </li>
                        <li className="zIndex2">
                            {/* <a href="#"> */}
                            <div className="trapezoidWithShadow">
                                <div className="rectTrapezoid lightblue">問い合わせ</div>
                            </div>
                            {/* </a> */}
                        </li>
                        <li className="zIndex1">
                            {/* <a href="#"> */}
                            <div className="trapezoidWithShadow">
                                <div className="rectTrapezoid blue">ログイン</div>
                            </div>
                            {/* </a> */}
                        </li>
                        {/* <li><a href="#"><img src="広告3.png" /></a></li> */}
                    </ul>
                    {/* </nav> */}
                </div>
            </div >
        </>
    )
}