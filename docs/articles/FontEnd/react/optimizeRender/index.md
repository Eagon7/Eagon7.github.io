# 渲染调优

## 懒加载和异步渲染

### 异步渲染 Suspense(悬念)

::: info
 Suspense 是 React 提出的一种同步的代码来实现异步操作的方案
 Suspense可以让组件 await等待异步操作，直到异步操作完成，才会渲染组件。
:::
**用法**

```jsx
// 子组件
function UserInfo() {
  // 获取用户数据信息，然后再渲染组件。
  const user = getUserInfo();
  return <h1>{user.name}</h1>;
}
// 父组件
/**
 * @fallback: 加载过程中的占位符
 * UserInfo: 需要等待异步加载完成后渲染的组件,确保组件拿到的数据是异步请求后最新的数据
 */
export default function Index(){
    return <Suspense fallback={<h1>Loading...</h1>}>
        <UserInfo/>
    </Suspense>
}

```

传统模式：挂载组件-> 请求数据 -> 再渲染组件。
异步模式：请求数据-> 渲染组件。

**异步组件的好处**
不再需要 componentDidMount 或 useEffect 配合做数据交互，也不会因为数据交互后，改变 state 而产生的二次更新作用。
代码逻辑更简单，清晰。

### 懒加载(动态加载)

#### React.lazy

React.lazy 接受一个函数，这个函数需要动态调用 import()
它必须返回一个 Promise ，该 Promise 需要 resolve 一个 default export 的 React 组件。

```jsx
const LazyComponent = React.lazy(() => import('./test.js'))

export default function Index(){
   return <Suspense fallback={<div>loading...</div>} >
       <LazyComponent />
   </Suspense>
}
```

::: tip
执行过程:

  1. React.lazy 函数调用时，会返回一个 Promise 对象。
  2. 当组件渲染的时候，React.lazy 返回的 Promise 会被 Suspense 捕获，然后显示 fallback 指定的组件，等待 import() 加载组件完成后，再渲染真正的组件。
:::
用 React.lazy 动态引入 test.js 里面的组件，配合 Suspense 实现动态加载组件效果。这样很利于代码分割，不会让初始化的时候加载大量的文件。

### React.lazy和Suspense实现动态加载原理
