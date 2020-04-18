## Rxjs

####介绍

> Rxjs: 基于可观测数据流在异步编程应用中的库。

> 基于**设计模式**中**观察者模式、迭代器模式以及函数式编程**，在学习Rxjs之前需要了解[设计模式](https://www.runoob.com/design-pattern/design-pattern-intro.html "设计模式")

观察者模式：
> 优点
> + 1、观察者和被观察者是抽象耦合的。 
> + 2、建立一套触发机制。

> 缺点
> + 1、如果一个被观察者对象有很多的直接和间接的观察者的话，将所有的观察者都通知到会花费很多时间。 
> + 2、如果在观察者和观察目标之间有循环依赖的话，观察目标会触发它们之间进行循环调用，可能导致系统崩溃。 
> + 3、观察者模式没有相应的机制让观察者知道所观察的目标对象是怎么发生变化的，而仅仅只是知道观察目标发生了变化。

**1) 类似JS的事件监听一样,监听某种事件的变化，当变化时可产生相应的连锁操作**

```javascript
window.addEventListener('click', function(){
  console.log('click!');
})
```
这时监听就是天生的观察者模式。去给window的Click事件（被观察者）绑定一个监听事件（观察者），当事件发生。回调就会触发


### RxJs

**在RxJs中有两个重要的概念需要我们理解:**

`Observable` (可观察对象)
`Observer` (观察者)

类似JavaScript的例子：

```javascript
var btn = document.getElementById('btn');
var handler = function() {
  console.log('click');
}
btn.addEventListener('click', handler)
```

+ Click 就是一个 Observable，
+ handler 这个函数就是一个Observer.

以上的编码思路可采用Rxjs编写

改用RxJS编写：

```javascript
Rx.Observable.fromEvent(btn, 'click')
.subscribe(() => console.log('click'));
```

`fromEvent`把一个`event`转成了一个`Observable`，然后它就可以被订阅subscribe`了

然后在Rxjs中还有个重要的概念 `流stream`


# 后续补充---------------


> 其实`Observable`其实就是数据流`stream`流是在时间流逝的过程中产生的一系列事件。它具有时间与事件响应的概念
> **结合设计模式的思路，把一切输入都当做数据流（流）去处理：**
> 

**操作符**
> 操作符是 observables 背后的马力，为复杂的异步任务提供了一种优雅的声明式解决方案

**内容 (按操作符类型)**
## 组合

### **combineAll**

> **combineAll(project: function): Observable**
> 映射成内部的 interval observable

`子流有变化就来一输出`

> 例：
> **假设存在两个流 A、B**
> A每间隔4秒发射出一个值
> B每间隔2秒发射出一个值
> **必然的是AB会有同一时间发出一个值**

```javascript
        // 这里interval是每隔1秒产生一个数据, take(2)表示取2个数 
        // pipe()作为一种链接运算符的方法
        // 也就是0， 1.

        const source = interval(1000).pipe(take(2));// 每一秒产生一个数据。取2个数据再发送[0 , 1]
        
        // 将 source 发出的每个值映射成取前3个值的 interval observable
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
```




> **combineLatest**
> **combineLatest(observables: ...Observable, project: function): Observable**
>  组合3个定时发送的 observables
> + 此操作符可以既有静态方法，又有实例方法
> + 当源 observable 完成时，可以使用 combineAll 来应用 combineLatest 以发出 observables

```javascript

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
```

`combineLatest`一开始也会等待每个子流都发射完一次数据，但是在合并时，如果子流1在等待其他流发射数据期间又发射了新数据，则使用子流最新发射的数据进行合并，之后每当有某个流发射新数据，不再等待其他流同步发射数据，而是使用其他流之前的最近一次数据进行合并

> **concat**
> **concat(observables: ...*): Observable**
> concat 2个基础的 observables
> + 当源 observable 完成时，可以使用 combineAll 来应用 combineLatest 以发出 observables
> + 必须等待之前操作完成才能继续执行下一操作

```javascript
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
```

`concat()`必须等待该任务执行完成，才可继续再订阅下一个 observable 并发出值


> **concatAll**
> **concatAll(): Observable**
> + concatMap === map + concatAll
> + 订阅每个内部 observable 并发出值，当一个完成了才订阅下一个

```javascript
        // 每2秒发出值
        const source = interval(2000);
        const example = source.pipe(
          // 为了演示，增加10并作为 observable 返回
          map(val => of(val + 10)),
          // 合并内部 observables 的值
          concatAll()
        );
        // 输出: 'Example with Basic Observable 10', 'Example with Basic Observable 11'...
        const subscribe = example.subscribe(val =>
          console.log('Example with Basic Observable:', val)
        );
```

`concatAll()`成把所有元素 concat 起来。


> **forkJoin**
> **forkJoin(...args, selector : function): Observable**
> + 如果内部 observable 不完成的话，forkJoin 永远不会发出值

```javascript

const myPromise = val =>
  new Promise(resolve =>
    setTimeout(() => resolve(`Promise Resolved: ${val}`), 5000)
  );
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
```

`forkJoin()`当所有 observables 完成时，发出每个 observable 的最新值.

> **merge**
> **merge(input: Observable): Observable**
> + 此操作符可以既有静态方法，又有实例方法
> + 优先输出执行快的值

```javascript
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
```

`merge()`将多个Observable的值输出到一个observable。将多输入组合到同一个observable按照执行时间排序好


> **mergeAll**
> **mergeAll(concurrent: number): Observable**
> + mergeMap === map + mergeAll
> + interval 每0.5秒发出一个值。这个值会被映射成延迟1秒的 interval 。mergeAll 操作符接收一个可选参数以决定在同一时间有多少个内部 observables 可以被订阅。其余的 observables 会先暂存以等待订阅。

mergeAll接受2个observable，每个observable发射出来值之后，mergeAll之后产生的observable就直接emit了

> **pairwise**
> **pairwise(): Observable<Array>**
> + 将前一个值和当前值作为数组发出

```javascript
        // 将前一个值和当前值作为数组发出
        // 每一秒发送一个值
        interval(1000)
            .pipe(
                pairwise(),
                take(5) // 取前五
            )
            .subscribe(console.log);

        // 返回: [0,1], [1,2], [2,3], [3,4], [4,5]
```

**将前一个值和当前值作为数组发出**


> **race**
> **race(): Observable**
> + 使用首先发出值的 observable 

```javascript

// 接收第一个发出值的 observable
const example = race(
  // 每1.5秒发出值
  interval(1500),
  // 每1秒发出值
  interval(1000).pipe(mapTo('1s won!')),
  // 每2秒发出值
  interval(2000),
  // 每2.5秒发出值
  interval(2500)
);
// 输出: "1s won!"..."1s won!"...etc
const subscribe = example.subscribe(val => console.log(val));
```

**每次输出使用首先发出的值！！！**


> **startWith**
> **startWith(an: Values): Observable**
> + 发出给定的第一个值

```javascript
        // 发出 (1,2,3)
        const source = of(1, 2, 3);
        // 从0开始
        const example = source.pipe(startWith(0));
        // 输出: 0,1,2,3
        const subscribe = example.subscribe(val => console.log(val));
```

**输出时首先发出优先的值！！！等于在输出前发送一个定义好的值，在执行后续输出**


> **withLatestFrom**
> **withLatestFrom(other: Observable, project: Function): Observable**
> + 提供另一个 observable 的最新值。
> + 控制source 发出的频率快慢

```javascript
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
```

**5s后执行时候 secondSource也会在执行，当source执行完毕后统一打印出来**


> **zip**
> **zip(observables: * ): Observable**
> + zip 操作符会订阅所有内部 observables，然后等待每个发出一个值。一旦发生这种情况，将发出具有相应索引的所有值。这会持续进行，直到至少一个内部 observable 完成。

```javascript
const sourceOne = of('Hello');
const sourceTwo = of('World!');
const sourceThree = of('Goodbye');
const sourceFour = of('World!');
// 一直等到所有 observables 都发出一个值，才将所有值作为数组发出
const example = zip(
  sourceOne,
  sourceTwo.pipe(delay(1000)),
  sourceThree.pipe(delay(2000)),
  sourceFour.pipe(delay(3000))
);
// 输出: ["Hello", "World!", "Goodbye", "World!"]
const subscribe = example.subscribe(val => console.log(val));
```

**等待所有都发出值，才将所有值作为*数组*发出**

###  条件

> **defaultIfEmpty**
> **defaultIfEmpty(defaultValue: any): Observable**

```javascript
// 当源 observable 为空时，发出 'Observable.of() Empty!'，否则发出源的任意值
const exampleOne = of().pipe(defaultIfEmpty('Observable.of() Empty!'));
// 输出: 'Observable.of() Empty!'
const subscribe = exampleOne.subscribe(val => console.log(val));
```

**给定of()为空，则会发出defaultIfEmpty()定义好的值**
**在检测到无输出的时候可以定义发出给定的值**

> + 如果在完成前没有发出任何通知，那么发出给定的值

> **every**
> **every(predicate: function, thisArg: any): Observable**

```javascript
// 发出5个值
const source = of(1, 2, 3, 4, 5);
const example = source.pipe(
  // 每个值都是偶数吗？
  every(val => val % 2 === 0)
);
// 输出: false
const subscribe = example.subscribe(val => console.log(val));
```

> + 如果完成时所有的值都能通过断言，那么发出 true，否则发出 false 
**在以上所有的结果都通过(逻辑或者计算正确)就会输出Boolean值**

### 创建

> **create**
> **create(subscribe: function)**
> + 使用给定的订阅函数来创建 observable

```javascript
const hello = Observable.create(function(observer) {
  observer.next('Hello');
  observer.next('World');
});

// 输出: 'Hello'...'World'
const subscribe = hello.subscribe(val => console.log(val));
```

**给定的create()方法创建，参数为回调执行的代码块**
**给定的订阅函数来创建 observable 。**


> **empty**
> **empty(scheduler: Scheduler): Observable**
> + 立即完成的 observable 。

```javascript
// 输出: 'Complete!'
const subscribe = empty().subscribe({
  next: () => console.log('Next'),
  complete: () => console.log('Complete!')
});
```

**立即完成，直接在‘订阅’步骤去执行**

> **from**
> **from(ish: ObservableInput, mapFn: function, thisArg: any, scheduler: Scheduler): Observable**
> + 将数组、promise 或迭代器转换成 observable
> + 对于数组和迭代器，所有包含的值都会被作为序列发出
> + 此操作符也可以用来将字符串作为字符的序列发出

```javascript
// 将数组作为值的序列发出
const arraySource = from([1, 2, 3, 4, 5]);
// 输出: 1,2,3,4,5
const subscribe = arraySource.subscribe(val => console.log(val));
```

**将数组的值作为序列依次输出**

> **fromEvent**
> **fromEvent(target: EventTargetLike, eventName: string, selector: function): Observable**
> + 将事件转换成 observable 序列

```JavaScript
// 创建发出点击事件的 observable
const source = fromEvent(document, 'click');
// 映射成给定的事件时间戳
const example = source.pipe(map(event => `Event time: ${event.timeStamp}`));
// 输出 (示例中的数字以运行时为准): 'Event time: 7276.390000000001'
const subscribe = example.subscribe(val => console.log(val));
```

**事件fromEvent(),参数: 监听对象，监听事件**

> **fromPromise**
> **fromPromise(promise: Promise, scheduler: Scheduler): Observable**
> + 创建由 promise 转换而来的 observable，并发出 promise 的结果
> + 打平类操作符可以接收 promises 而不需要 observable 包装
**暂存**

> **interval**
> **interval(period: number, scheduler: Scheduler): Observable**
> + 基于给定时间间隔发出数字序列。

```javascript
// 每1秒发出数字序列中的值
const source = interval(1000);
// 数字: 0,1,2,3,4,5....
const subscribe = source.subscribe(val => console.log(val));
```

**每秒发出自增数字**

> **of / just**
> **of(...values, scheduler: Scheduler): Observable**
> + 按顺序发出任意数量的值

```javascript
// 依次发出提供的任意数量的值
const source = of(1, 2, 3, 4, 5);
// 输出: 1,2,3,4,5
const subscribe = source.subscribe(val => console.log(val));
```

**会按顺序发出任意数量的值**


> **range**
> **range(start: number, count: number, scheduler: Scheduler): Observable**
> + 依次发出给定区间内的数字

```javascript
// 依次发出1-10
const source = range(1, 10);
// 输出: 1,2,3,4,5,6,7,8,9,10
const example = source.subscribe(val => console.log(val));
```

**依次发出给定区间内的数字。,发出1-10的区间值（包括1包括10）**

> **throw**
> **throw(error: any, scheduler: Scheduler): Observable**
> + 在订阅上发出错误

```javascript
// 在订阅上使用指定值来发出错误
const source = throwError('This is an error!');
// 输出: 'Error: This is an error!'
const subscribe = source.subscribe({
  next: val => console.log(val),
  complete: () => console.log('Complete!'),
  error: val => console.log(`Error: ${val}`)
});
```

**这里是定义抛出的错误，用订阅去执行相应的执行状态**

> **timer**
> **timer(initialDelay: number | Date, period: number, scheduler: Scheduler): Observable**
> + 给定持续时间后，再按照指定间隔时间依次发出数字。

```javascript
const source = timer(1000);
// 输出: 0
const subscribe = source.subscribe(val => console.log(val));
```

**简单粗暴输出第一个值就结束**

### 错误处理

> **catch / catchErro**
> **catchError(project : function): Observable**
> + 优雅地处理 observable 序列中的错误
> + 记住要在 catch 函数中返回一个 observable

```javascript
// 发出错误
const source = throwError('This is an error!');
// 优雅地处理错误，并返回带有错误信息的 observable
const example = source.pipe(catchError(val => of(`I caught: ${val}`)));
// 输出: 'I caught: This is an error'
const subscribe = example.subscribe(val => console.log(val));
```

**定义好抛出的错误提示信息**


> **retry**
> **retry(number: number): Observable**
> + 如果发生错误，以指定次数重试 observable 序列

```javascript
// 每1秒发出值
const source = interval(1000);
const example = source.pipe(
  mergeMap(val => {
    // 抛出错误以进行演示
    if (val > 5) {
      return throwError('Error!');
    }
    return of(val);
  }),
  // 出错的话可以重试2次
  retry(2)
);
const subscribe = example.subscribe({
  next: val => console.log(val),
  error: val => console.log(`${val}: Retried 2 times then quit!`)
});
```

**retry()可以设置指定的重试次数，通过subscribe订阅next为为出错，error为错误**


> **retryWhen**
> **retryWhen(receives: (errors: Observable) => Observable, the: scheduler): Observable**
> + 当发生错误时，基于自定义的标准来重试 observable 序列

```javascript
// 每1秒发出值
const source = interval(1000);
const example = source.pipe(
  map(val => {
    if (val > 5) {
      // 错误将由 retryWhen 接收
      throw val;
    }
    return val;
  }),
  retryWhen(errors =>
    errors.pipe(
      // 输出错误信息
      tap(val => console.log(`Value ${val} was too high!`)),
      // 5秒后重启
      delayWhen(val => timer(val * 1000))
    )
  )
)
const subscribe = example.subscribe(val => console.log(val));
```

**当发生错误，我们是可以自定义的去设置规则**


### 多播

> **publish**
> **publish() : ConnectableObservable**
> + 共享源 observable 并通过调用 connect 方法使其变成热的

```javascript
// 每1秒发出值
const source = interval(1000);
const example = source.pipe(
  // 副作用只会执行1次
  tap(_ => console.log('Do Something!')),
  // 不会做任何事直到 connect() 被调用
  publish()
);
// connect() 被调用的时候输出
const subscribe = example.subscribe(val =>
  console.log(`Subscriber One: ${val}`)
);
const subscribeTwo = example.subscribe(val =>
  console.log(`Subscriber Two: ${val}`)
);

// 5秒后调用 connect，这会使得 source 开始发出值
setTimeout(() => {
  example.connect();
}, 5000);
```

**publish()，只有通过connect()调用才会发出初始值（或运作）**


> **multicast**
> **multicast(selector: Function): Observabl
e**
> + 使用提供 的 Subject 来共享源 observable
```javascript
// 每2秒发出值并只取前5个
const source = interval(2000).pipe(take(5));

const example = source.pipe(
  // 因为我们在下面进行了多播，所以副作用只会调用一次
  tap(() => console.log('Side Effect #1')),
  mapTo('Result!')
);
const multi = example.pipe(multicast(() => new Subject()));
const subscriberOne = multi.subscribe(val => console.log(val));
const subscriberTwo = multi.subscribe(val => console.log(val));
// 使用 subject 订阅 source
multi.connect();
```

**只需订阅了multi都会共享输出**

> **share**
> **share(): Observable**
> + 在多个订阅者间共享源 observable 

```javascript
// 1秒后发出值
const source = timer(1000);
// 输出副作用，然后发出结果
const example = source.pipe(
  tap(() => console.log('***SIDE EFFECT***')),
  mapTo('***RESULT***')
);

const subscribe = example.subscribe(val => console.log(val));
const subscribeTwo = example.subscribe(val => console.log(val));

const sharedExample = example.pipe(share());

const subscribeThree = sharedExample.subscribe(val => console.log(val));
const subscribeFour = sharedExample.subscribe(val => console.log(val));
```

**当不共享副作用就会执行两次，当共享的时候副作用就会执行一次**

> **shareReplay**
> **shareReplay(bufferSize?: number, windowTime?: number, scheduler?I IScheduler): Observable**
> + 共享源 observable 并重放指定次数的发出

```javascript
// 当有副作用或繁重的计算时，你不希望在多个订阅者之间重复执行时，会使用 shareReplay 。 当你知道流的后来订阅者也需要访问之前发出的值，shareReplay 在这种场景下也是有价值的
```


### 过滤

> **debounce**
> **debounce(durationSelector: function): Observable**
> + 根据一个选择器函数，舍弃掉在两次输出之间小于指定时间的发出值。

```javascript
// 发出四个字符串
const example = of('WAIT', 'ONE', 'SECOND', 'Last will display');
// 只有在最后一次发送后再经过一秒钟，才会发出值，并抛弃在此之前的所有其他值
const debouncedExample = example.pipe(debounce(() => timer(1000)));
// 所有的值都将被忽略，除了最后一个 输出: 'Last will display'
const subscribe = debouncedExample.subscribe(val => console.log(val));
```

**只留下最后输出，其他的全部抛弃**

> **debounceTime**
> **debounceTime(dueTime: number, scheduler: Scheduler): Observable**
> + 舍弃掉在两次输出之间小于指定时间的发出值

```javascript
const input = document.getElementById('example');

// 对于每次键盘敲击，都将映射成当前输入值
const example = fromEvent(input, 'keyup').pipe(map(i => i.currentTarget.value));

// 在两次键盘敲击之间等待0.5秒方才发出当前值，
// 并丢弃这0.5秒内的所有其他值
const debouncedInput = example.pipe(debounceTime(500));

// 输出值
const subscribe = debouncedInput.subscribe(val => {
  console.log(`Debounced Input: ${val}`);
});
```

**在指定的等待时间内，输入的值都会被抛弃**


> **distinctUntilChanged**
> **distinctUntilChanged(compare: function): Observable**
> + 只有当当前值与之前最后一个值不同时才将其发出。

```javascript
// 基于最新发出的值进行比较，只输出不同的值
const myArrayWithDuplicatesInARow = from([1, 1, 2, 2, 3, 1, 2, 3]);

const distinctSub = myArrayWithDuplicatesInARow
  .pipe(distinctUntilChanged())
  // 输出: 1,2,3,1,2,3
  .subscribe(val => console.log('DISTINCT SUB:', val));

const nonDistinctSub = myArrayWithDuplicatesInARow
  // 输出 : 1,1,2,2,3,1,2,3
  .subscribe(val => console.log('NON DISTINCT SUB:', val));
```

**相同值不输出只输出不同值**

> **filter**
> **filter(select: Function, thisArg: any): Observable**
> + 发出符合给定条件的值。

```javascript
// 发出 (1,2,3,4,5)
const source = from([1, 2, 3, 4, 5]);
// 过滤掉奇数
const example = source.pipe(filter(num => num % 2 === 0));
// 输出: "Even number: 2", "Even number: 4"
const subscribe = example.subscribe(val => console.log(`Even number: ${val}`));
```

**给定输出特定条件的值**


> **first**
> **first(predicate: function, select: function)**
> + 发出第一个值或第一个通过给定表达式的值。

```javascript
const source = from([1, 2, 3, 4, 5]);
// 没有参数则发出第一个值
const example = source.pipe(first());
// 输出: "First value: 1"
const subscribe = example.subscribe(val => console.log(`First value: ${val}`));
```

**发出第一个给定序列的第一个值**

> **ignoreElements**
> **ignoreElements(): Observable**
> + 忽略所有通知，除了 complete 和 error 

```javascript
// 每100毫秒发出值
const source = interval(100);
// 略所有值，只发出 complete
const example = source.pipe(
  take(5),
  ignoreElements()
);
// 输出: "COMPLETE!"
const subscribe = example.subscribe(
  val => console.log(`NEXT: ${val}`),
  val => console.log(`ERROR: ${val}`),
  () => console.log('COMPLETE!')
);
```

**忽略所有通知，除了 complete 和 error**

> **last**
> **last(predicate: function): Observable**
> + 根据提供的表达式，在源 observable 完成时发出它的最后一个值
**与 last 对应的操作符是 first (详细见first写法)**


> **sample**
> **sample(sampler: Observable): Observable**
> + 当提供的 observable 发出时从源 observable 中取样。**

```javascript
// 每1秒发出值
const source = interval(1000);
// 每2秒对源 observable 最新发出的值进行取样
const example = source.pipe(sample(interval(2000)));
// 输出: 2..4..6..8..
const subscribe = example.subscribe(val => console.log(val));
```

**从原本的1秒发一次到后面每间隔两秒发一次**


> **single**
> **single(a: Function): Observable**
> + 发出通过表达式的单一项。

```javascript
// 发出 (1,2,3,4,5)
const source = from([1, 2, 3, 4, 5]);
// 发出匹配断言函数的一项
const example = source.pipe(single(val => val === 4));
// 输出: 4
const subscribe = example.subscribe(val => console.log(val));
```

**发出通过断言的第一个数字**

> **skip**
> **skip(the: Number): Observable**
> + 跳过N个(由参数提供)发出值。

```javascript
// 每1秒发出值
const source = interval(1000);
// 跳过前5个发出值
const example = source.pipe(skip(5));
// 输出: 5...6...7...8........
const subscribe = example.subscribe(val => console.log(val));
```

**在发送前跳过N个值**

> **skipUntil**
> **skipUntil(the: Observable): Observable**
> + 跳过源 observable 发出的值，直到提供的 observable 发出值

```javascript
// 每1秒发出值
const source = interval(1000);
// 跳过源 observable 发出的值，直到内部 observable 发出值 (6s后)
const example = source.pipe(skipUntil(timer(6000)));
// 输出: 5...6...7...8........
const subscribe = example.subscribe(val => console.log(val));
```

**跳过值直到另个 observable 发出值**


> **skipWhile**
> **skipWhile(predicate: Function): Observable**
> + 跳过源 observable 发出的值，直到提供的表达式结果为 false 

```javascript

// 每1秒发出值
const source = interval(1000);
// 当源 observable 发出的值小于5的时候，则跳过该值
const example = source.pipe(skipWhile(val => val < 5));
// 输出: 5...6...7...8........
const subscribe = example.subscribe(val => console.log(val));
```

**当值小于阈值的时候跳过**


> **take**
> **take(count: number): Observable**
> + 在完成前发出N个值(N由参数决定)

```javascript
// 发出 1,2,3,4,5
const source = of(1, 2, 3, 4, 5);
// 取第一个发出的值然后完成
const example = source.pipe(take(1));
// 输出: 1
const subscribe = example.subscribe(val => console.log(val));
```
**取发出的第一个值**


> **takeUntil**
> **takeUntil(notifier: Observable): Observable**
> + 发出值，直到提供的 observable 发出值，它便完成

```javascript
// 每1秒发出值
const source = interval(1000);
// 5秒后发出值
const timer$ = timer(5000);
// 当5秒后 timer 发出值时， source 则完成
const example = source.pipe(takeUntil(timer$));
// 输出: 0,1,2,3
const subscribe = example.subscribe(val => console.log(val));
```

**在特定时间后发出值**

> **takeWhile**
> **takeWhile(predicate: function(value, index): boolean): Observable**
> + 发出值，直到提供的表达式结果为 false

```javascript
// 发出 1,2,3,4,5
const source = of(1, 2, 3, 4, 5);
// 允许值发出直到 source 中的值大于4，然后便完成
const example = source.pipe(takeWhile(val => val <= 4));
// 输出: 1,2,3,4
const subscribe = example.subscribe(val => console.log(val));
```

**使用限定条件取值,再不满足条减下为false则停止输出**


> **throttle**
> **throttle(durationSelector: function(value): Observable | Promise): Observable**
> + 以某个时间间隔为阈值，在 durationSelector 完成前将抑制新值的发出

```javascript
// 每1秒发出值
const source = interval(1000);
// 节流2秒后才发出最新值
const example = source.pipe(throttle(val => interval(2000)));
// 输出: 0...3...6...9
const subscribe = example.subscribe(val => console.log(val));
```

**节流2秒,重新决定输出的时间间隔，且发出节流最新值**

> **throttleTime**
> **throttleTime(duration: number, scheduler: Scheduler): Observable**
> + 当指定的持续时间经过后发出最新值。

```javascript
// 每1秒发出值
const source = interval(1000);
/*
  节流5秒
  节流结束前发出的最后一个值将从源 observable 中发出
*/
const example = source.pipe(throttleTime(5000));
// 输出: 0...6...12
const subscribe = example.subscribe(val => console.log(val));
```

**节流5秒,重新决定输出的时间间隔，且发出节流结束前最后的值**

### 转换

> **buffer**
> **buffer(closingNotifier: Observable): Observable**
> + 收集输出值，直到提供的 observable 发出才将收集到的值作为数组发出

```javascript
// 创建每1秒发出值的 observable
const myInterval = interval(1000);
// 创建页面点击事件的 observable
const bufferBy = fromEvent(document, 'click');
/*
  收集由 myInterval 发出的所有值，直到我们点击页面。此时 bufferBy 会发出值以完成缓存。
  将自上次缓冲以来收集的所有值传递给数组。
*/
const myBufferedInterval = myInterval.pipe(buffer(bufferBy));
// 打印值到控制台
// 例如 输出: [1,2,3] ... [4,5,6,7,8]
const subscribe = myBufferedInterval.subscribe(val =>
  console.log(' Buffered Values:', val)
);
```

**一开始收集输出，等到点击页面则传递所有的值给数组**


> **bufferCount**
> **bufferCount(bufferSize: number, startBufferEvery: number = null): Observable**
> + 收集发出的值，直到收集完提供的数量的值才将其作为数组发出

```javascript
// 创建每1秒发出值的 observable
const source = interval(1000);
// 在发出3个值后，将缓冲的值作为数组传递
const bufferThree = source.pipe(bufferCount(3));
// 打印值到控制台
// 输出: [0,1,2]...[3,4,5]
const subscribe = bufferThree.subscribe(val =>
  console.log('Buffered Values:', val)
);
```

**一开始收集输出，等到点击页面则传递所有的值给数组每3个数组成一个数组**


> **bufferTime**
> **bufferTime(bufferTimeSpan: number, bufferCreationInterval: number, scheduler: Scheduler): Observable**
> + 收集发出的值，直到经过了提供的时间才将其作为数组发出

```javascript
// 创建每500毫秒发出值的 observable
const source = interval(500);
// 2秒后，将缓冲值作为数组发出
const example = source.pipe(bufferTime(2000));
// 打印值到控制台
// 输出: [0,1,2]...[3,4,5,6]
const subscribe = example.subscribe(val =>
  console.log('Buffered with Time:', val)
);
```

**每0.5发出值，经过2秒缓冲后作为数组发出**

> **bufferToggle**
> **bufferToggle(openings: Observable, closingSelector: Function): Observable**
> + 开启开关以捕获源 observable 所发出的值，关闭开关以将缓冲的值作为数组发出

```javascript
// 每1秒发出值
const sourceInterval = interval(1000);
// 5秒后开启第一个缓冲区，然后每5秒钟开启新的缓冲区
const startInterval = interval(5000);
// 3秒后发出值以关闭相应的缓冲区
const closingInterval = val => {
  console.log(`Value ${val} emitted, starting buffer! Closing in 3s!`);
  return interval(3000);
};
// 每5秒会开启一个新的缓冲区以收集发出的值，3秒后发出缓冲的值
const bufferToggleInterval = sourceInterval.pipe(
  bufferToggle(
    startInterval,
    closingInterval
  )
);
// 输出到控制台
// 输出: Emitted Buffer: [4,5,6]...[9,10,11]
const subscribe = bufferToggleInterval.subscribe(val =>
  console.log('Emitted Buffer:', val)
);
```

**bufferToggle()函数里面的参数来开启关闭相应的缓冲区**

> **bufferWhen**
> **bufferWhen(closingSelector: function): Observable**
> + 收集值，直到关闭选择器发出值才发出缓冲的值

```javascript
// 每1秒发出值
const oneSecondInterval = interval(1000);
// 返回的 observable 每5秒发出值
const fiveSecondInterval = () => interval(5000);
// 每5秒发出缓冲的值
const bufferWhenExample = oneSecondInterval.pipe(bufferWhen(fiveSecondInterval));
// 输出值
// 输出: [0,1,2,3]...[4,5,6,7,8]
const subscribe = bufferWhenExample.subscribe(val =>
  console.log('Emitted Buffer: ', val)
);
```

**限制住每5秒开启发出缓冲区值**

> **concatMap**
> **concatMap(project: function, resultSelector: function): Observable**
> + 将值映射成内部 observable，并按顺序订阅和发出

```javascript
// 发出延迟值
const source = of(2000, 1000);
// 将内部 observable 映射成 source，当前一个完成时发出结果并订阅下一个
const example = source.pipe(
  concatMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
);
// 输出: With concatMap: Delayed by: 2000ms, With concatMap: Delayed by: 1000ms
const subscribe = example.subscribe(val =>
  console.log(`With concatMap: ${val}`)
);

// 展示 concatMap 和 mergeMap 之间的区别
const mergeMapExample = source
  .pipe(
    // 只是为了确保 meregeMap 的日志晚于 concatMap 示例
    delay(5000),
    mergeMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
  )
  .subscribe(val => console.log(`With mergeMap: ${val}`));
```

**延迟发出对应的值**

> **concatMapTo**
> **concatMapTo(observable: Observable, resultSelector: function): Observable**
> + 当前一个 observable 完成时订阅提供的 observable 并发出值
```javascript

// 每2秒发出值
const sampleInterval = interval(500).pipe(take(5));
const fakeRequest = of('Network request complete').pipe(delay(3000));
// 前一个完成才会订阅下一个
const example = sampleInterval.pipe(concatMapTo(fakeRequest));
// 结果
// 输出: Network request complete...3s...Network request complete'
const subscribe = example.subscribe(val => console.log(val));
```

**只有等待前一个值输出，才会发出下一个值**

> **exhaustMap**
> **exhaustMap(project: function, resultSelector: function): Observable**
> + 映射成内部 observable，忽略其他值直到该 observable 完成

```javascript
const sourceInterval = interval(1000);
const delayedInterval = sourceInterval.pipe(delay(10), take(4));

const exhaustSub = merge(
  // 延迟10毫秒，然后开始 interval 并发出4个值
  delayedInterval,
  // 立即发出
  of(true)
)
  .pipe(exhaustMap(_ => sourceInterval.pipe(take(5))))

  // 输出: 0, 1, 2, 3, 4
  .subscribe(val => console.log(val));
```

**第一个发出的值 (of(true)) 会被映射成每秒发出值、5秒后完成的 interval observable 。因为 delayedInterval 的发送是晚于前者的，虽然 observable仍然是活动的，但它们会被忽略**

> **expand**
> **expand(project: function, concurrent: number, scheduler: Scheduler): Observable**
> + 递归调用提供的函数

```javascript
// 发出 2
const source = of(2);
const example = source.pipe(
  // 递归调用提供的函数
  expand(val => {
    // 2,3,4,5,6
    console.log(`Passed value: ${val}`);
    // 3,4,5,6
    return of(1 + val);
  }),
  // 用5次
  take(5)
);
// 输出: 2,3,4,5,6
const subscribe = example.subscribe(val => console.log(`RESULT: ${val}`));
```

**递归输出，每次加一 用5次**

> **groupBy**
> **groupBy(keySelector: Function, elementSelector: Function): Observable**
> + 基于提供的值分组成多个 observables

```javascript
const people = [
  { name: 'Sue', age: 25 },
  { name: 'Joe', age: 30 },
  { name: 'Frank', age: 25 },
  { name: 'Sarah', age: 35 }
];
// 发出每个 people
const source = from(people);
// 根据 age 分组
const example = source.pipe(
  groupBy(person => person.age),
  // 为每个分组返回一个数组
  mergeMap(group => group.pipe(toArray()))
);
/*
  输出:
  [{age: 25, name: "Sue"},{age: 25, name: "Frank"}]
  [{age: 30, name: "Joe"}]
  [{age: 35, name: "Sarah"}]
*/
const subscribe = example.subscribe(val => console.log(val));
```

**根据分组实现输出相应分组信息**

> **map**
> **map(project: Function, thisArg: any): Observable**
> + 对源 observable 的每个值应用投射函数

```javascript
// 发出 (1,2,3,4,5)
const source = from([1, 2, 3, 4, 5]);
// 每个数字加10
const example = source.pipe(map(val => val + 10));
// 输出: 11,12,13,14,15
const subscribe = example.subscribe(val => console.log(val));
```

**每个值都去遍历它 然后进行加10的操作**

> **mapTo**
> **mapTo(value: any): Observable**
> + 将每个发出值映射成常量

```javascript
// 每2秒发出值
const source = interval(2000);
// 将所有发出值映射成同一个值
const example = source.pipe(mapTo('HELLO WORLD!'));
// 输出: 'HELLO WORLD!'...'HELLO WORLD!'...'HELLO WORLD!'...
const subscribe = example.subscribe(val => console.log(val));
```

**发出值映射成同一个值***

> **mergeMap**
> **mergeMap(project: function: Observable, resultSelector: function: any, concurrent: number): Observable**
> + 映射成 observable 并发出值。

```javascript
// 发出 'Hello'
const source = of('Hello');
// 映射成 observable 并将其打平
const example = source.pipe(mergeMap(val => of(`${val} World!`)));
// 输出: 'Hello World!'
const subscribe = example.subscribe(val => console.log(val));
```

**将其值遍历控制订阅数量**


> **partition**
> **partition(predicate: function: boolean, thisArg: any): [Observable, Observable]**
> + 根据提供的谓词将可观察的一分为二

```javascript
const source = from([1, 2, 3, 4, 5, 6]);
// 第一个值(events)返回 true 的数字集合，第二个值(odds)是返回 false 的数字集合
const [evens, odds] = source.pipe(partition(val => val % 2 === 0));
/*
  输出:
  "Even: 2"
  "Even: 4"
  "Even: 6"
  "Odd: 1"
  "Odd: 3"
  "Odd: 5"
*/
const subscribe = merge(
  evens.pipe(map(val => `Even: ${val}`)),
  odds.pipe(map(val => `Odd: ${val}`))
).subscribe(val => console.log(val));
```

**第一个值(events)返回 true 的数字集合，第二个值(odds)是返回 false 的数字集合**

> **pluck**
> **pluck(properties: ...args): Observable**
> + 选择属性来发出

```javascript
const source = from([{ name: 'Joe', age: 30 }, { name: 'Sarah', age: 35 }]);
// 提取 name 属性
const example = source.pipe(pluck('name'));
// 输出: "Joe", "Sarah"
const subscribe = example.subscribe(val => console.log(val));
```

**选择其中的一个属性对应的值发出**

> **reduce**
> **reduce(accumulator: function, seed: any): Observable**
> + 将源 observalbe 的值归并为单个值，当源 observable 完成时将这个值发出

```javascript
const source = of(1, 2, 3, 4);
const example = source.pipe(reduce((acc, val) => acc + val));
// 输出: Sum: 10'
const subscribe = example.subscribe(val => console.log('Sum:', val));
```

**数字流的加和**

> **scan**
> **scan(accumulator: function, seed: any): Observable**
> + 随着时间的推移进行归并。

```javascript
const source = of(1, 2, 3);
// 基础的 scan 示例，从0开始，随着时间的推移计算总数
const example = source.pipe(scan((acc, curr) => acc + curr, 0));
// 输出累加值
// 输出: 1,3,6
const subscribe = example.subscribe(val => console.log(val));
```

**随着时间的推移计算总数**

> **switchMap**
> **switchMap(project: function: Observable, resultSelector: function(outerValue, innerValue, outerIndex, innerIndex): any): Observable**
> + 映射成 observable，完成前一个内部 observable，发出值。

```javascript
// 立即发出值， 然后每5秒发出值
const source = timer(0, 5000);
// 当 source 发出值时切换到新的内部 observable，发出新的内部 observable 所发出的值
const example = source.pipe(switchMap(() => interval(500)));
// 输出: 0,1,2,3,4,5,6,7,8,9...0,1,2,3,4,5,6,7,8
const subscribe = example.subscribe(val => console.log(val));
```

**没5秒重启输出**

> **window**
> **window(windowBoundaries: Observable): Observable**
> + 时间窗口值的 observable 。

> **windowCount**
> **windowCount(windowSize: number, startWindowEvery: number): Observable**
> + 源 observable 中的值的 observable，每次发出N个值(N由参数决定)

> **windowTime**
> **windowTime(windowTimeSpan: number, windowCreationInterval: number, scheduler: Scheduler): Observable**
> + 在每个提供的时间跨度内，收集源 obsercvable 中的值的 observable 

> **windowToggle**
> **windowToggle(openings: Observable, closingSelector: function(value): Observable): Observable**
> + 以 openings 发出为起始，以 closingSelector 发出为结束，收集并发出源 observable 中的值的 observable 

> **windowWhen**
> **windowWhen(closingSelector: function(): Observable): Observable**
> + 在提供的时间帧处关闭窗口，并发出从源 observable 中收集的值的 observable


### 工具

> **do / tap**
> **do(nextOrObserver: function, error: function, complete: function): Observable**
> + 透明地执行操作或副作用，比如打印日志。

> **delay**
> **delay(delay: number | Date, scheduler: Scheduler): Observable**
> + 根据给定时间延迟发出值。

> **delayWhen**
> **delayWhen(selector: Function, sequence: Observable): Observable**
> + 延迟发出值，延迟时间由提供函数决定。

> **dematerialize**
> **dematerialize(): Observable**
> + 将 notification 对象转换成 notification 值。

> **let**
> **let(function): Observable**
> + 让我拥有完整的 observable 。

> **timeout**
> **timeout(due: number, scheduler: Scheduler): Observable**
> + 在指定时间间隔内不发出值就报错

> **toPromise**
> **toPromise() : Promise**
> + 将 observable 转换成 promise 

































