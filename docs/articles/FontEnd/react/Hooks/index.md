# Hooks

## API分类
>
>关键词： concurrent
<table>
  <tr>
    <th>使用范围</th>
    <th>Hooks</th>
    <th>具体功能</th>
  </tr>
  <tr>
    <td rowspan="5">数据更新驱动</td>
    <td>useState</td>
    <td>数据驱动更新</td>
  </tr>
  <tr>
    <td>useReducer</td>
    <td>订阅状态，创建reducer，更新试图</td>
  </tr>
  <tr>
    <td>useSyncExternalStore</td>
    <td>订阅外部数据源触发更新</td>
  </tr>
  <tr>
    <td>usetransition</td>
    <td>concurrent模式下，过渡更新任务</td>
  </tr>
  <tr>
    <td>useDeferredValue</td>
    <td>解决更新状态滞后问题</td>
  </tr>
  <tr>
    <td rowspan="2">执行副作用</td>
    <td>b1</td>
    <td>这是分类B下的项目B1</td>
  </tr>
  <tr>
    <td>项目B2</td>
    <td>这是分类B下的项目B2</td>
  </tr>
</table>

<!-- ![Alt text](image.png) -->

## Hooks

### [useRef](/articles/FontEnd/relevance/useRef)

<details>
场景：稳定引用，获取dom节点，获取上一次的值

- 闭包 异步访问到旧变量的问题

::: code-group

```ts
 // 典型的闭包循环案例，每次循环调用setTimeout的时候都会保存当前的作用域，因为var不会新建作用域，所以所有的setTimeout都是共享一个作用域，当for循环同步任务执行完毕后开始执行setTimeout此时因为循环完成i的值已经为10，并且所有的setTimout共享一个作用域，所以打印出来的结果都是10
 for (var i =0;i<10;i++){  // [!code focus]
  setTimeout(()=>{
    console.log(i) // 结果都是10  // [!code focus]
  },1000)
 }

// let 在每次循环的时候都会新建一个作用域，所以当每次循环的时候setTimout被分配到异步队列时都会保存当前的作用域i的值,而不是所有的setTimeout共享一个作用域
for(let i =0;i<10;i++){  // [!code focus]
  setTimeout(()=>{
    console.log(i)  //[!code focus] // 结果是0-9 
  },1000)
}

import { useRef } from 'react';

for (var i = 0; i < 5; i++) {
  const indexRef = useRef(i);// [!code focus]
  setTimeout(function() {
    console.log(indexRef.current); // 每个回调函数捕获正确的值：0-4 // [!code focus] 
  }, 1000);
}
```

1. 造成此结果的原因是当循环时，每次循环执行的setTimeout都会在一秒钟后执行，当一秒钟后执行时当前的i已经是10了，所以打印出来的结果都是10
2. let会在每次循环的时候保存当前作用域的变量，所以每次循环的时候都会保存当前的i，所以打印出来的结果是0-9
tip: var 不会产生新的作用域，所以每次循环的时候都是共享一个作用域，所以每次循环的时候都会覆盖上一次的i，所以最后打印出来的结果都是10

:::
</details>

## 数据更新驱动类

### useState

<details>

``` ts
const [state, setState] = useState(initialState);
参数接收一个初始值，返回一个数组，数组的第一个元素是当前的state，第二个元素是更新state的函数
```

**注意事项**

1. 在函数组件**一次执行上下文中**，state 的值是**固定不变的**。
2. 如果两次 dispatchAction 传入**相同的 state 值**，那么组件就**不会更新**。
3. 当触发 dispatchAction 在**当前执行上下文中获取不到最新的state**,只有再下一次组件 **rerender** 中才能获取到。

</details>

<!-- 
1. 案例

> 此时点击按钮 log打印出来的值并不是更改过后的number 而是更改前的值. 这意味着log时更改未发生<br/>

原因：setNumber是异步的，触发handleClick时，任务线程会先执行同步再执行异步。所以log打印的是更改前的值 <br/>

- 外部log可以获取到最新的值的原因是，在执行完同步的log后执行异步setNumber,异步setNumber触发重新渲染，重新执行Index函数，useState获取到最新的number，所以打印的值是最新的number
- 人话：点击button时触发的log和setNumber在第一任务线程,第一线程执行完毕后执行第一线程引起的一系列任务，外部在第二任务线程中执行的，此时setNumber已执行完毕
点击按钮后执行过程

- 线程1：handleClick -> 宏任务log -> 微任务setNumber(触发线程2)
- 线程2：宏任务log - > 微任务setNumber触发重新渲染
这就是为什么handleClick函数内打印不到最新的值 而handleClick函数外可以大打印到最新的值的原因

``` js{6,8}
function Index() {
  const [number, setNumber] = useState(0);
  console.log("重新渲染");
  const handleClick = () => {
    setNumber(number + 1);
    console.log(number);
  };
    console.log(number);
  return <button onClick={handleClick}>点击 {number}</button>;
}
export default Index;
``` -->

### [useReducer](/articles/FontEnd/relevance/reducer "https://juejin.cn/post/7230335974085492773")

对于拥有许多状态更新逻辑的组件来说，过于分散的事件处理程序可能会令人不知所措。对于这种情况，你可以将组件的所有状态更新(增删改查)逻辑整合到一个外部函数中，这个函数叫作 reducer。

reducer是弥补useState在逻辑复杂情况下的缺陷，它分为三个步骤:

1. 将设置状态的逻辑 修改成dispatch 的一个 action；
2. 编写 一个 reducer 函数；
3. 在你的组件中 使用 reducer。

::: code-group

``` ts[参数]
 const [state, dispatch] = useReducer(reducer, initState);
```

``` ts [实际使用]
const reducer = (state,action)=>{
  const type =action.name
  switch(type){
    case 'increment':
      return {count:state.count+1}
    case 'decrement':
      return {count:state.count-1}
    default:
      throw new Error('error')
  }
  return state
}
const ReducerTest = ()=>{
  
  const [number,dispatchNumber] = useReducer(reducer,initialState)
  return (
    <div>
    {number}
      <button onClick={()=>dispatchNumber({name:'add'})}></button>
    </div>
  )
}
```

:::

### [useContext](/articles/FontEnd/relevance/context)

作用: 传递数据，避免props层层传递，导致代码冗余

## useImperativeHandle

::: info 解决了什么问题?
**子组件通过ref抛出方法供父组件调用**

React函数 组件，父组件需要直接访问子组件的实例方法或属性的问题。

在 React 中，父组件通常通过 props 向子组件传递数据和回调函数来实现组件之间的通信。这种方式可以确保数据流的单向性，但有时候父组件需要直接访问子组件的方法，例如触发子组件的某个功能或获取子组件的状态。

传统的解决方案是使用 ref 来引用子组件的实例，然后通过 ref.current 来访问子组件的方法或属性。但是，这种方式需要手动编写一些额外的代码，不够直观和方便。

useImperativeHandle 的出现解决了这个问题。**它允许子组件通过自定义的方式向父组件暴露自己的实例方法或属性**,父组件可以通过 ref 直接访问子组件的这些方法或属性，而无需手动编写额外的代码。

使用 useImperativeHandle，父组件可以更直接地与子组件进行交互，提供了更灵活的组件通信方式。它使得父组件能够以更直观的方式调用子组件的方法，从而简化了组件之间的通信逻辑。

// 需要注意的是，useImperativeHandle 应该与 forwardRef 一起使用，以便将子组件的引用传递给父组件。
总结来说，useImperativeHandle 解决了在 React 组件中，父组件需要直接访问子组件的实例方法或属性时，通过更简洁、直观的方式实现组件之间的通信的问题。
:::

::: code-group [demo]

``` jsx [Index]
function Index (){
  const childRef = useRef(null)
  function click (){
    chcildRef.current.logger()
  }
  return
   <>
   <Form ref={childRef}>
    <button onClick={click}>click</button> 
    </>
}
```

``` jsx [Form]
const MyForm = forwardRef(function Form(props, ref) {
  const [count, setCount] = useState(0);
  useImperativeHandle(ref, () => ({
    logger: () => {
      console.log("logger");
      setCount(count + 1);
    },
  }));
  return <div>{count}</div>;
});

export default MyForm;
```

:::
