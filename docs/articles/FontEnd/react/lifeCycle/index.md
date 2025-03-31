# 生命周期

React hooks也提供了 api ，用于弥补函数组件没有生命周期的缺陷。其原理主要是运用了 hooks 里面的 useEffect 和 useLayoutEffect

## useEffect

```ts
useEffect(()=>{
    return destory
},dep)
```

1. 第一个参数callback 返回销毁函数 下次执行useEffect会首先执行这个销毁函数。 销毁定时器,订阅等以防资源泄露
2. 第二个参数为依赖项，依赖项发生变化则执行callback
对于 useEffect 执行， React 处理逻辑是采用异步调用 ，对于每一个 effect 的 callback， React 会向 setTimeout回调函数一样，放入任务队列，等到主线程任务完成，DOM 更新，js 执行完成，视图绘制完毕，才执行。所以 effect 回调函数不会阻塞浏览器绘制视图。

## useLayoutEffect

**useLayoutEffect 和 useEffect 不同的地方是采用了同步执行**

1. 首先 useLayoutEffect 是在 DOM 更新之后，浏览器绘制之前，这样可以方便修改 DOM，获取 DOM 信息，这样浏览器只会绘制一次，如果修改 DOM 布局放在 useEffect ，那 useEffect 执行是在浏览器绘制视图之后，接下来又改 DOM ，就可能会导致浏览器再次回流和重绘。而且由于两次绘制，视图上可能会造成闪现突兀的效果。

2. useLayoutEffect callback 中代码执行会阻塞浏览器绘制。

**一句话概括如何选择 useEffect 和 useLayoutEffect ：修改 DOM ，改变布局就用 useLayoutEffect ，其他情况就用 useEffect**

## useInsertionEffect

在介绍 useInsertionEffect 用途之前，先看一下 useInsertionEffect 的执行时机。

``` jsx
React.useEffect(()=>{
    console.log('useEffect 执行')
},[])

React.useLayoutEffect(()=>{
    console.log('useLayoutEffect 执行')
},[])

React.useInsertionEffect(()=>{
    console.log('useInsertionEffect 执行')
},[])
```

打印： useInsertionEffect 执行 useLayoutEffect 执行 useEffect 执行

本质上是解决 css in js 产生的重绘问题
style-components库为例
::: tip style-component
你可以使用ES6的标签模板字符串语法（Tagged Templates）为需要 styled 的 Component 定义一系列CSS属性，当该组件的JS代码被解析执行的时候，styled-components 会动态生成一个 CSS 选择器，并把对应的 CSS 样式通过 style 标签的形式插入到 head 标签里面。动态生成的 CSS 选择器会有一小段哈希值来保证全局唯一性来避免样式发生冲突。
这种模式下本质上是动态生成 style 标签。
:::

```jsx
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #BF4F74;
`;

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

render(
  <Wrapper>
    <Title>
      Hello World!
    </Title>
  </Wrapper>
);
```

这个是时候 useInsertionEffect 的作用就出现了，useInsertionEffect 的执行在 DOM 更新前，所以此时使用 CSS-in-JS 避免了浏览器出现再次重回和重排的可能，解决了性能上的问题。

如果使用useLayoutEffect的话，它的执行时机在DOM更新完成，浏览器只需绘制即可,此时插入style便可引起浏览器的重绘，因为样式发生了变化

## 类组件生命周期在函数组件内使用Effect替代方案

::: code-group

```jsx [模块渲染后]
// componentDidMount
React.useEffect(()=>{
    /* 请求数据 ， 事件监听 ， 操纵dom */
},[])  /* 切记 dep = [] */
这里要记住 dep = [] ，这样当前 effect 没有任何依赖项，也就只有初始化执行一次。
```

```jsx [模块卸载前]
//componentWillUnmount
 React.useEffect(()=>{
        /* 请求数据 ， 事件监听 ， 操纵dom ， 增加定时器，延时器 */
        return function componentWillUnmount(){
            /* 解除事件监听器 ，清除定时器，延时器 */
        }
},[])/* 切记 dep = [] */
```

```jsx [模块组件props更新]
// useEffect 代替 componentWillReceiveProps 着实有点牵强。
// 首先因为二者的执行阶段根本不同，一个是在render阶段，一个是在commit阶段。
// 其次 useEffect 会初始化执行一次，但是 componentWillReceiveProps 只有组件更新 props 变化的时候才会执行。
React.useEffect(()=>{
    console.log('props变化：componentWillReceiveProps')
},[ props ])
```

```jsx [模块更新后]
// componentDidUpdate
React.useEffect(()=>{
    console.log('组件更新完成：componentDidUpdate ')     
}) /* 没有 dep 依赖项 */
// 注意此时useEffect没有第二个参数。
// 没有第二个参数，那么每一次执行函数组件，都会执行该 effect。
```

```jsx [allDemo]
function FunctionLifecycle(props){
    const [ num , setNum ] = useState(0)
    React.useEffect(()=>{
        /* 请求数据 ， 事件监听 ， 操纵dom  ， 增加定时器 ， 延时器 */
        console.log('组件挂载完成：componentDidMount')
        return function componentWillUnmount(){
            /* 解除事件监听器 ，清除 */
            console.log('组件销毁：componentWillUnmount')
        }
    },[])/* 切记 dep = [] */
    React.useEffect(()=>{
        console.log('props变化：componentWillReceiveProps')
    },[ props ])
    React.useEffect(()=>{ /*  */
        console.log(' 组件更新完成：componentDidUpdate ')
    })
    return <div>
        <div> props : { props.number } </div>
        <div> states : { num } </div>
        <button onClick={ ()=> setNum(state=>state + 1) }   >改变state</button>
    </div>
}

export default ()=>{
    const [ number , setNumber ] = React.useState(0)
    const [ isRender , setRender ] = React.useState(true)
    return <div>
        { isRender &&  <FunctionLifecycle number={number}  /> }
        <button onClick={ ()=> setNumber(state => state + 1 ) } > 改变props  </button> <br/>
        <button onClick={()=> setRender(false) } >卸载组件</button>
    </div>
}
```

:::

constructor： 做数据初始化，将滑动处理函数，做防抖处理。
getDerivedStateFromProps: props获取后,得到两个参数，上一个props,更新或的props
componentDidMount: 组件挂载后
shouldComponentUpdate：性能优化，只有 list 改变，渲染视图。
render: 渲染视图，渲染 Item
getSnapshotBeforeUpdate：保存更新前的快照数据
componentDidUpdate：组件即将更新。
componentWillUnmount：组件即将卸载。
