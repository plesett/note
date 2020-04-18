import React, { Component } from 'react';

// RxJS v6+
import { concat } from 'rxjs/operators';
import { of } from 'rxjs';

export default class Concat extends Component {
    render() {

        // 发出 1,2,3
        const sourceOne = of(1, 2, 3);
        // 发出 4,5,6
        const sourceTwo = of(4, 5, 6);
        // 先发出 sourceOne 的值，当完成时订阅 sourceTwo
        const example = sourceOne.pipe(concat(sourceTwo));
        // 输出: 1,2,3,4,5,6
        const subscribe = example.subscribe(val =>
            console.log('Example: Basic concat:', val)
        );

        
        return (
            <div>
                Concat
            </div>
        )
    }
}
