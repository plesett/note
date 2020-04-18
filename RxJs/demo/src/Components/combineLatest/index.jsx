import React, { Component } from 'react';

import { take, map, combineAll } from 'rxjs/operators';
import { timer, combineLatest } from 'rxjs';

export default class CombineLatest extends Component {
    render() {

        // timerOne 每1秒时发出第一个值，然后每4秒发送一次
        const timerOne = timer(1000, 4000);
        // timerTwo 每2秒时发出第一个值，然后每4秒发送一次
        const timerTwo = timer(2000, 4000);

        console.log("发送完成", new Date().toLocaleString())   // 开始订阅的时间

        const combined = combineLatest(timerOne, timerTwo).subscribe(latestValues => {
            console.log("打印时间:", new Date().toLocaleString())
            const [timerValOne, timerValTwo] = latestValues;
            console.log(
                `Timer One Latest: (${timerValOne}),Timer Two Latest: (${timerValTwo}),`
            );
        })


        return (
            <div>
                CombineLatest
            </div>
        )
    }
}
