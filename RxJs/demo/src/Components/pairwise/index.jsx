import React, { Component } from 'react';

// RxJS v6+
import { pairwise, take } from 'rxjs/operators';
import { interval } from 'rxjs';

export default class Pairwise extends Component {
    render() {
        // 将前一个值和当前值作为数组发出
        // 每一秒发送一个值
        interval(1000)
            .pipe(
                pairwise(),
                take(5) // 取前五
            )
            .subscribe(console.log);

        // 返回: [0,1], [1,2], [2,3], [3,4], [4,5]


        return (
            <div>
                pairwise
            </div>
        )
    }
}
