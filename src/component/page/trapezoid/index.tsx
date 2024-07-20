
export enum trapezoidColor {
    "red",
    "yellow",
    "green",
    "lightblue",
    "blue",
};

export interface trapezoidInfoIF {
    label: string,
    color: string | trapezoidColor,
}
// export interface rectTrapezoidParam {
//     trapezoidInfos: trapezoidInfoIF[]
// }

// 型ガード関数を定義
function isTrapezoidColor(color: any): color is trapezoidColor {
    return Object.values(trapezoidColor).includes(color);
}

export function rectTrapezoid(trapezoidInfo: trapezoidInfoIF) {
    const styleSeatParam_color = isTrapezoidColor(trapezoidInfo.color)
        // color が trapezoidColor の場合、既定の色を表示する
        ? `rectTrapezoid ${trapezoidInfo.color}`
        // color が string の場合、backgroundを手動で設定する
        : `${trapezoidInfo.color}`;

    return (
        <>
            {/* <a href="#"> */}
            <div className="trapezoidWithShadow">
                <div className={styleSeatParam_color}>
                    {trapezoidInfo.label}
                </div>
            </div>
            {/* </a> */}
        </>
    );
}