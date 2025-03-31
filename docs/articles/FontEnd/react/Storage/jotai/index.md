---
outline: [2,3]   
---
# Jotai

引用来源：[Ryun](https://juejin.cn/post/7230826178914746429)

## 常见的状态管理模式

1. **global：**  全局式，也被称作单一数据源，将所有的数据放到一个大对象中，关键词：`combineReducers();`
2. **multiple stores：**  多数据源模式，将状态存放到多个数据源中，可在多个地方使用消费，关键词：`useStore()；`
3. **atomic state：**  原子状态，与创建对象形式的存储不同，针对每一个变量可以是响应式的，通过原子派生的方式来适应复杂的开发场景，关键词：`atom()`；

## Jotai  原子状态管理

### 原子式解决了什么问题

 reactHook 使State的**拆分**和**逻辑共享**变得更容易
 但useState 和 useContext对于多个store仍需要维护多个Context Provider 因为当Context改变，所有消费该context的组件都会重新渲染即使是组件仅用到了
context的一部分，容易导致不必要的**无用渲染，造成性能损失**。

 比如react-redux v6完全基于Context API而导致性能大幅下降，v7又回退到之前的内部订阅方案，context更适合放类似主题这种变化不大的全局数据，而并不适合存放频繁更新的复杂状态集合

  原子化、组件内状态，但是api较多，它通过将原子状态进行派生、组合成新的状态(类似**vue的computed**)

- 所谓组件内状态，其实就是内部使用了useState，state变化，触发更新渲染罢了
- 有兴趣可以阅读[手动实现Recoil原理](https://juejin.cn/post/7230335974085492773 "https://juejin.cn/post/7230335974085492773")

## 使用教程

### 1. 创建 atom  派生atom  使用 useAtom

::: details View The Code

``` Typescript
import { atom, useAtom } from "jotai";
import { FC } from "react";

// 创建atom
const ValueAtom = atom({ react: 1 });

// 派生atom 依赖某个atom 当依赖项发生变化时更新触发atom的第一个参数修改变量 -  1
const DeriveAtom = atom((get) => get(ValueAtom).react - 1);

// 使用atom
const Text: FC = () => {
  const [value] = useAtom(ValueAtom);
  return (
    <>
      <div> {value.react} </div>
    </>
  );
}; 
```

:::

### 2. 异步派生

::: details View The Code

``` TypeScript
import { atom, useAtom } from "jotai";
import { FC } from "react";

const MockData = new Promise<string>((r) => {
  setTimeout(() => {
    r("mock data");
  }, 3000);
});

// 创建atom
const ValueAtom = atom({ react: 1 });
// 派生atom 依赖某个atom 当依赖项发生变化时更新触发atom的第一个参数修改变量 -  1
const DeriveAtom = atom(async (get): Promise<string> => {
  return await MockData;
});

const Text: FC = () => {
  const [mock] = useAtom(DeriveAtom);
  return (
    <div>
      <div>value: {mock}</div>
    </div>
  );
};

export default Text;

```

:::

::: danger
这样会阻塞渲染线程 不建议这样做。异步请求应该放在组件内部，或者使用异步更新atom
:::

### 3. 函数组件内更新方式

::: details View The Code

``` typescript
  const ValueAtom = atom(1)
  const Text = ()=>{
    const [value,setValue] = useAtom(ValueAtom)
    return <>
      <div>{value}</div>
      <button onClick={()=>setValue(value+1)}>add</button>
    </>
  }
```

:::

### 4. atom内更新方式

::: details View The Code

``` typescript
  const ValueAtom = atom(1)
  const AddNumberAtom = atom(ge=>ge(ValueAtom)+1,(get,set,_arg)=>{
    set(ValueAtom,get(ValueAtom)+_arg)
  })

const Text: FC = () => {
  const [value] = useAtom(ValueAtom);
  const [,AddNumber] = useAtom(AddNumberAtom);
  return (
    <div>
      <div>{value}</div>
      <button onClick={AddNumber(1)}>add</button>
    </div>
  );
};
  
```

:::

### 5. 异步更新atom 区别于第二条异步获取，异步更新不会阻塞线程

::: details View The Code

```typescript
  const MockData = new Promise<string>((r) => {
    setTimeout(() => {
      r("mock data");
    }, 3000);
  });

  const ValueAtom = atom(1)
  const AddNumberAtom =  atom(null,async (get,set,_arg)=>{
  const result = await MockData(_arg.url)
    set(ValueAtom,get(ValueAtom)+result)
  })

const Text: FC = () => {
  const [Value] = useAtom(ValueAtom);
  const [,AddNumber] = useAtom(AddNumberAtom);

  return <>
    <div>{Value}</div>
    <button onClick={()=>AddNumber({url:'www.abc.com'})}>add</button>
  </>
}

```

:::

### 6. 渲染问题

:::   details View The Code
> 当我们点击add时，发现A和B都重新渲染了，但是问题来了，A为什么要重新渲染呀，A只是触发了更新操作，并不需要重新渲染呀？？？

>这是因为，如果使用useAtom，即使你不引入它的value值，但它由useAtomValue包裹，当更新时，useAtomValue会触发订阅事件，从而触发渲染，如果不理解可以阅读 Recoil原理
-> 理解： A组件使用即订阅，Atom原子更新触发订阅事件从而更新

>解决办法 参考7

``` typescript
import { FC } from "react";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const countAtom = atom(0);

const A = () => {
  const [, setCount] = useAtom(countAtom);
  console.log("组件A渲染");

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>add</button>
    </div>
  );
};

const B = () => {
  const [count] = useAtom(countAtom);
  console.log("组件B渲染");

  return (
    <div>
      <p>组件B：{count}</p>
    </div>
  );
};

const AsyncTest: FC = () => {
  return (
    <>
      <A />
      <B />
    </>
  );
};
export default AsyncTest;
```

:::

### 7. 解决渲染问题 useAtomValue、useSetAtom

- 如果有的组件只需要监听状态的变化值，而没有更新操作 请使用useAtomValue
- 如果仅更新操作，而无需渲染状态的组件，请使用 useSetAtom
- 这么做的目的：防止无意义的渲染

### 8. Provider

- 正常情况下，无需用Provider包裹组件
- 但如果需要控制某些组件的状态不发生更新，可以用Provider包裹
- 或者说，用Provider包裹的组件，状态是独立的，不受外部影响，同时也不影响外部，即使大家共用同一个atom状态
- 如果不想让这个组件受外部更新影响，可以用Provider包裹，这样就不会触发更新了 不会触发订阅事件

### 9.store

> createStore,export出去,使用Jotai的Provider提供给App

> 其中，store中的状态，是全局的，任何组件都可以使用，但是，如果某个组件使用了Provider包裹，那么该组件的状态是独立的，不受外部影响，同时也不影响外部，即使大家共用同一个atom状态

## 实际使用

::: code-group

```ts [store.ts]
import { createStore, atom } from "jotai";

const myStore = createStore();
export const countAtom = atom(0);
export const statusAtom = atom(false);

// 监听发生变化
myStore.sub(countAtom, () => {
  console.log("countAtom value is changed to", myStore.get(countAtom));
  myStore.set(statusAtom, myStore.get(countAtom) % 2 !== 0);
});

export default myStore;

```

```ts [main.ts]
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "jotai";
import myStore from "./store/index.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={myStore}>
      <App />
    </Provider>
  </React.StrictMode>
);

```

```ts [App.tsx]
import { Provider, getDefaultStore, useAtom, useAtomValue } from "jotai";
import { countAtom, statusAtom } from "./store/index";
import { num, num2 } from "./store/NavStore";
import store from "./store/NavStore";

const App = () => {
  const [count, setCount] = useAtom(countAtom);
  const status = useAtomValue(statusAtom);
  return (
    <>
      <div style={{ background: status ? "pink" : "black" }}>123</div>
      <p>Default Count: {count}</p>
      <button onClick={() => setCount((x) => x + 1)}>add</button>
    </>
  );
};
export default App;
```

:::
