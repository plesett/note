import React, { Component } from 'react';

import { startWith } from 'rxjs/operators';
import { of } from 'rxjs';

export default class StartWith extends Component {
    render() {

        // 发出 (1,2,3)
        const source = of(1, 2, 3);
        // 从0开始
        const example = source.pipe(startWith(0));
        // 输出: 0,1,2,3
        const subscribe = example.subscribe(val => console.log(val));

        return (
            <div>
                startWith
                <h3>发出给定的第一个值,在输出的时候给定一个值优先输出</h3>
            </div>
        )
    }
}
