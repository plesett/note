import React, { Component } from 'react';
// RxJS v6+
import { delay, take } from 'rxjs/operators';
import { forkJoin, of, interval } from 'rxjs';

export default class ForkJoin extends Component {
    render() {

        const myPromise = val =>
            new Promise(resolve =>
                setTimeout(() => resolve(`Promise Resolved: ${val}`), 5000)
            );

        /*
            当所有 observables 完成时，将每个 observable 
            的最新值作为数组发出
        */
        const example = forkJoin(
            // 立即发出 'Hello'
            of('Hello'),
            // 1秒后发出 'World'
            of('World').pipe(delay(1000)),
            // 1秒后发出0
            interval(1000).pipe(take(1)),
            // 以1秒的时间间隔发出0和1
            interval(1000).pipe(take(2)),
            // 5秒后解析 'Promise Resolved' 的 promise
            myPromise('RESULT')
        );
        //输出: ["Hello", "World", 0, 1, "Promise Resolved: RESULT"]
        const subscribe = example.subscribe(val => console.log(val));


        return (
            <div>
                ForkJoin
            </div>
        )
    }
}
