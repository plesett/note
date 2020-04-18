import React, { Component } from 'react';

// RxJS v6+
import { take, map, combineAll } from 'rxjs/operators';
import { interval } from 'rxjs';

export default class CombineAll extends Component {
    render() {

        // 这里interval是每隔1秒产生一个数据, take(2)表示取2个数 
        // pipe()作为一种链接运算符的方法
        // 也就是0， 1.

        const source = interval(1000).pipe(take(2));// 每一秒产生一个数据。取2个数据再发送[0 , 1]
        
        // 将 source 发出的每个值映射成取前5个值的 interval observable
        // map操作符和js数组里的map差不多，都是传入一个callback，执行callback回传新值.
        const example = source.pipe(
            map(val => interval(1000).pipe(map(i => `Result (${val}): ${i}`), take(3)))
        );
        
        /*
          soure 中的2个值会被映射成2个(内部的) interval observables，
          这2个内部 observables 每秒使用 combineLatest 策略来 combineAll，
          每当任意一个内部 observable 发出值，就会发出每个内部 observable 的最新值。
        */
        const combined = example.pipe(combineAll());
        

        const subscribe = combined.subscribe(val => console.log(val));


        return (
            <div>
                CombineAll
            </div>
        )
    }
}
