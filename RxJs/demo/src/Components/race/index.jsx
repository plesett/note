import React, { Component } from 'react';

export default class Race extends Component {
    render() {

        return (
            <div>
                <h3>举例:</h3>
                // 接收第一个发出值的 observable<br/>
                const example = race(<br />
                // 每1.5秒发出值<br/>
                interval(1500),<br />
                // 每1秒发出值<br/>
                interval(1000).pipe(mapTo('1s won!')),<br />
                // 每2秒发出值<br/>
                interval(2000),<br />
                // 每2.5秒发出值<br/>
                interval(2500)<br />
                );<br />
                // 输出: "1s won!"..."1s won!"...etc<br/>
                const subscribe = example.subscribe(val => console.log(val));<br />
                <p style={{fontWeight: 'bold'}}>每次输出使用首先发出的值！！！</p>
            </div>
        )
    }
}
