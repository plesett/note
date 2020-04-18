import React, { Component } from 'react';

// RxJS v6+
import { mapTo } from 'rxjs/operators';
import { interval, merge } from 'rxjs';

export default class Merge extends Component {
    render() {
        // 每2.5秒发出值
        const first = interval(2500);
        // 每2秒发出值
        const second = interval(2000);
        // 每1.5秒发出值
        const third = interval(1500);
        // 每1秒发出值
        const fourth = interval(1000);

        // 从一个 observable 中发出输出值
        const example = merge(
            first.pipe(mapTo('FIRST!')),
            second.pipe(mapTo('SECOND!')),
            third.pipe(mapTo('THIRD')),
            fourth.pipe(mapTo('FOURTH'))
        );
        // 输出: "FOURTH", "THIRD", "SECOND!", "FOURTH", "FIRST!", "THIRD", "FOURTH"
        const subscribe = example.subscribe(val => console.log(val));


        return (
            <div>
                Merge
            </div>
        )
    }
}
