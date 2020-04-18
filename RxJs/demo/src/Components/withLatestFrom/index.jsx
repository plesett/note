import React, { Component } from 'react'

import { withLatestFrom, map } from 'rxjs/operators';
import { interval } from 'rxjs';

export default class withLatestFrom1 extends Component {
    render() {

        // 每5秒发出值
        const source = interval(5000);
        // 每1秒发出值
        const secondSource = interval(1000);
        const example = source.pipe(
            withLatestFrom(secondSource),
            map(([first, second]) => {
                return `First Source (5s): ${first} Second Source (1s): ${second}`;
            })
        );

        const subscribe = example.subscribe(val => console.log(val));
        return (
            <div>
                withLatestFrom<br />
                  输出:<br/>
                    "First Source (5s): 0 Second Source (1s): 4"<br/>
                    "First Source (5s): 1 Second Source (1s): 9"<br/>
                    "First Source (5s): 2 Second Source (1s): 14"<br/>
                <h3>5s后执行时候 secondSource也会在执行，当source执行完毕后统一打印出来</h3>
            </div>
        )
    }
}
