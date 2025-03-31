
# 渲染控制

## React 几种控制 render 方法

- 第一种就是从父组件直接隔断子组件的渲染，经典的就是 memo，缓存 element 对象。
- 父组件 render ，子组件有没有必要跟着父组件一起 render ，如果没有必要，则就需要阻断更新
::: code-group

```jsx [导致不必要更新的demo]
/* 子组件 */
function Children ({ number }){
    console.log('子组件渲染')
    return <div>let us learn React!  { number } </div>
}

/* 父组件 */
export default class Index extends React.Component{
    state={
        numberA:0,
        numberB:0,
    }
    render(){
        return <div>
            <Children number={ this.state.numberA } />
           <button onClick={ ()=> this.setState({ numberA:this.state.numberA + 1 }) } >改变numberA -{ this.state.numberA } </button>
           <button onClick={ ()=> this.setState({ numberB:this.state.numberB + 1 }) } >改变numberB -{ this.state.numberB }</button>
        </div>
     }

}
// Children只依赖A ， 当B更新后会触发组件整体更新。此时就需要单独判断Children是否需要更新（根据修改的值是不是A判断）
```

```jsx [优化]
import React from "react";
function Children({ number }) {
  console.log("子组件渲染");
  return <div>let us learn React! {number} </div>;
}

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberA: 0,
      numberB: 0,
    };
    this.component = <Children number={this.state.numberA} />;
  }

  controllComponentRender = () => {
    /* 通过此函数判断 */
    const { props } = this.component;
    if (props.number !== this.state.numberA) {
      /* 只有 numberA 变化的时候，重新创建 element 对象  */
      return (this.component = React.cloneElement(this.component, {
        number: this.state.numberA,
      }));
    }
    return this.component;
  };
  render() {
    return (
      <div>
        {this.controllComponentRender()}

        {this.state.numberB}
        <button
          onClick={() => this.setState({ numberA: this.state.numberA + 1 })}
        >
          改变numberA
        </button>
        <button
          onClick={() => this.setState({ numberB: this.state.numberB + 1 })}
        >
          改变numberB
        </button>
      </div>
    );
  }
}
```

``` jsx [使用React提供的useMemo优化]
export default function Index(){
    const [ numberA , setNumberA ] = React.useState(0)
    const [ numberB , setNumberB ] = React.useState(0)
    return <div>
        { useMemo(()=> <Children number={numberA} />,[ numberA ]) }
        <button onClick={ ()=> setNumberA(numberA + 1) } >改变numberA</button>
        <button onClick={ ()=> setNumberB(numberB + 1) } >改变numberB</button>
    </div>
}
// 用 React.useMemo 可以达到同样的效果， 需要更新的值 numberA 放在 deps 中，numberA 改变，重新形成element对象，否则通过 useMemo 拿到上次的缓存值。达到如上同样效果。比起类组件，我更推荐函数组件用 useMemo 这种方式。
```

:::

### useMemo用法

::: details

```jsx
const cacheSomething = useMemo(create,deps)
```

- create：第一个参数为一个函数，函数的返回值作为缓存值，如上 demo 中把 Children 对应的 element 对象，缓存起来。
- deps： 第二个参数为一个数组，存放当前 useMemo 的依赖项，在函数组件下一次执行的时候，会对比 deps 依赖项里面的状态，是否有改变，如果有改变重新执行 create ，得到新的缓存值。
cacheSomething：返回值，执行 create 的返回值。如果 deps 中有依赖项改变，返回的重新执行 create 产生的值，否则取上一次缓存值。

#### useMemo原理

useMemo 会记录上一次执行 create 的返回值，并把它绑定在函数组件对应的 fiber 对象上，只要组件不销毁，缓存值就一直存在，但是 deps 中如果有一项改变，就会重新执行 create ，返回值作为新的值记录到 fiber 对象上。

- useMemo应用场景：
可以缓存 element 对象，从而达到按条件渲染组件，优化性能的作用。
如果组件中不期望每次 render 都重新计算一些值,可以利用 useMemo 把它缓存起来。
可以把函数和属性缓存起来，作为 PureComponent 的绑定方法，或者配合其他Hooks一起使用。

原理其实很简单，每次执行 render 本质上 createElement 会产生一个新的 props，这个 props 将作为对应 fiber 的 pendingProps ，在此 fiber 更新调和阶段，React 会对比 fiber 上老 oldProps 和新的 newProp （ pendingProps ）是否相等，如果相等函数组件就会放弃子组件的调和更新，从而子组件不会重新渲染；如果上述把 element 对象缓存起来，上面 props 也就和 fiber 上 oldProps 指向相同的内存空间，也就是相等，从而跳过了本次更新

:::

### pureComponent

纯组件是一种发自组件本身的渲染优化策略，当开发类组件选择了继承 PureComponent ，就意味这要遵循其渲染规则。规则就是浅比较 state 和 props 是否相等。
**基本使用**
::: details

```jsx
/* 纯组件本身 */
class Children extends React.PureComponent{
    state={
        name:'alien',
        age:18,
        obj:{
            number:1,
        }
    }
    changeObjNumber=()=>{
        const { obj } = this.state
        obj.number++
        this.setState({ obj })
    }
    render(){
        console.log('组件渲染')
        return <div  >
           <div> 组件本身改变state </div>
           <button onClick={() => this.setState({ name:'alien' }) } >state相同情况</button>
           <button onClick={() => this.setState({ age:this.state.age + 1  }) }>state不同情况</button>
           <button onClick={ this.changeObjNumber } >state为引用数据类型时候</button>
           <div>hello,my name is alien,let us learn React!</div>
        </div>
    }
}
/* 父组件 */
export default function Home (){
    const [ numberA , setNumberA ] = React.useState(0)
    const [ numberB , setNumberB ] = React.useState(0)
    return <div>
        <div> 父组件改变props </div>
        <button onClick={ ()=> setNumberA(numberA + 1) } >改变numberA</button>
        <button onClick={ ()=> setNumberB(numberB + 1) } >改变numberB</button>
        <Children number={numberA}  /> 
    </div>
}

```

:::

- 对于props pureComponent 会浅比较 props 是否相等，如果相等则不会重新渲染，否则重新渲染。
- 对于state pureComponent 会浅比较 state 是否相等，如果相等则不会重新渲染，否则重新渲染。
- 浅比较只会比较基础数据类型，对于引用类型，比如 demo 中 state 的 obj ，单纯的改变 obj 下属性是不会促使组件更新的，因为浅比较两次 obj 还是指向同一个内存空间，想要解决这个问题也容易，浅拷贝就可以解决，

```jsx
  changeObjNumber=()=>{
        const { obj } = this.state
        obj.number++
        this.setState({ obj:{...obj} })
    }
 ```

#### pureComponent原理

- pureComponentPrototype有一个prototype属性，isPureReactComponent，这个属性是一个布尔值，用来标识当前组件是否是纯组件，如果是纯组件，那么在更新时，会先进行浅比较，如果相等，就不会进行更新，如果不相等，才会进行更新。

- 这个属性在更新组件 updateClassInstance 方法中使用的 ,这个函数在更新组件的时候被调用，在这个函数内部，有一个专门负责检查是否更新的函数 checkShouldComponentUpdate 。

```jsx react/react-reconciler/ReactFiberClassComponent.js
function checkShouldComponentUpdate(){
     if (typeof instance.shouldComponentUpdate === 'function') {
         return instance.shouldComponentUpdate(newProps,newState,nextContext) 
          /* shouldComponentUpdate 逻辑 */
     } 
    if (ctor.prototype && ctor.prototype.isPureReactComponent) {
        return  !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    }
}
```

isPureReactComponent 判断是否为纯函数，如果是则进行浅比较shallowEqual

::: info shallowEqual过程

1. 首先新老props,states比较 不相等重新生成element
2. 判断新老 state 或者 props ，有不是对象或者为 null 的，那么直接返回 false ，更新组件。
3. 通过 Object.keys 将新老 props 或者新老 state 的属性名 key 变成数组，判断数组的长度是否相等，如果不相等，证明有属性增加或者减少，那么更新组件
4. 遍历老 props 或者老 state ，判断对应的新 props 或新 state ，有没有与之对应并且相等的（这个相等是浅比较），如果有一个不对应或者不相等，那么直接返回 false ，更新组件。 到此为止，浅比较流程结束， PureComponent 就是这么做渲染节流优化的。
:::

#### pureComponent注意事项

PureComponent可以让组件自发的做一层性能上的调优，但是父组件给是PureComponent的子组件绑定事件要小心，避免两种情况

1. 避免使用箭头函数，不要给是PureComponent子组件绑定箭头函数，因为父组件每一次render如果是箭头函数绑定的话，都会重新声场一个箭头函数，PureComponent的浅比较就会失效(参数函数指针改变)，导致子组件每一次都会重新渲染

```jsx
class Index extends React.PureComponent{}
export default class Father extends React.component{
  render=()=> <Index callback={()=>{}} />
}
```

2. PureComponent的父组件是函数组件的情况,绑定函数要用useCallback或者useMemo处理，就是再用class + function 组件开发项目的时候，如果父组件是函数，子组件是PureComponent 那么绑定函数要小心，因为函数组件每一次执行，如果不处理，还会声明一个新的函数，所以PureComponent对比同样会失效

```jsx
class Index extends React.PureComponent{}

export default function Father(){
  const callback=()=>{}
  return <Index callback={callback} />
}
```

综上可以用 useCallback 或者 useMemo 解决这个问题，useCallback 首选，这个 hooks 初衷就是为了解决这种情况的。

```jsx
export default function (){
    const callback = React.useCallback(function handerCallback(){},[])
    return <Index callback={callback}  />
}
```

::: info
useCallback接受两个参数 第一个参数是需要缓存的函数，第二个参数为deps 如果deps内依赖项改变返回新的函数
:::

::: info useCallback 和 useMemo 区别
useCallback返回的是一个记忆化的回调函数。只有当依赖项发生变化时，回调函数才会改变。这可以防止不必要的组件重新渲染。例如，如果你有一个经常重新渲染的父组件，其中有一个子组件接收一个函数属性，那么useCallback就非常有用，因为它可以确保只有当函数的依赖项改变时，函数才会被重新创建

相反，useMemo返回的是一个记忆化的值，这个值是运行函数的结果。只有当依赖项改变时，这个值才会重新计算。这对于避免重复进行昂贵的计算或数据转换非常有用。例如，如果你有一个组件，它执行一个可能非常昂贵的操作（如计算一个数的阶乘），那么useMemo就可以用来记忆化这个计算的结果，从而只有当输入的数改变时，才会重新运行这个计算

总的来说，useCallback和useMemo的主要区别在于，useCallback返回的是一个记忆化的函数，而useMemo返回的是一个记忆化的值。
:::

### shouldComponentUpdate

有的时候把控制渲染交给React组件本身处理靠不住，那么我们便可以自定义渲染方案决定组建是否更新

- 使用

```jsx
class Index extends React.Component {
  state = {
    stateNumA: 0,
    stateNumB: 0,
  };
  shouldComponentUpdate(newProps, newState, newContext) {
    if (
      newProps.stateNumA !== this.props.propsNumA ||
      newState.stateNumA !== this.state.stateNumA
    ) {
      return true; // 只有当 propsNumA 或 stateNumA 发生变化时才会更新
    }
    return false;
  }
  render() {
    console.log("render");
    const { stateNumA, stateNumB } = this.state;
    return (
      <div>
        <button onClick={() => this.setState({ stateNumA: stateNumA + 1 })}>
          改变state NumA
        </button>
        <button onClick={() => this.setState({ stateNumB: stateNumB + 1 })}>
          改变state NumB
        </button>
      </div>
    );
  }
}
```

可以通过新老props/state比较，判断是否渲染
但是如果是引用类型，比如对象，数组，那么浅比较就会失效，因为新老props/state指向的是同一个内存空间，所以我们需要深比较，这个时候就需要用到lodash的深比较函数isEqual
immutable.js 也可以实现深比较

### React.Memo

```jsx
React.memo(Component,compare)
Component: 需要被包裹的组件
compare: 比较函数，用来判断是否需要更新，返回true则不更新，返回false则更新
```

#### React.Memo的特点

- memo 当二个参数 compare 不存在时，会用浅比较原则处理 props ，相当于仅比较 props 版本的 pureComponent 。
- memo 同样适合类组件和函数组件。

- DEMO 当父组件传递的Number更改且大于5时，更新组件

```jsx
import React from "react";

function Children(props) {
  console.log("子组件渲染");
  return <div> {props.number} </div>;
}

const Child = React.memo(Children, (prevProps, nextProps) => {
  // 如果返回true，需要memo备忘
  return !(prevProps.number !== nextProps.number && nextProps.number >= 5);
});
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      test: 0,
    };
  }
  render() {
    return (
      <div>
        number({this.state.number})
        <button
          onClick={() => {
            this.setState({
              number: this.state.number + 1,
            });
          }}
        >
          +
        </button>
        <Child number={this.state.number} />
        test({this.state.test})
        <button
          onClick={() => {
            this.setState({
              test: this.state.test + 1,
            });
          }}
        >
          +
        </button>
      </div>
    );
  }
}

```

### 打破渲染限制的方法使Memo和PureComponent失效

1. forceUpdate 如果更新状态使用的forceUpdate 而不是 setState 会跳过shouldComponentUpdate的判断，直接更新组件
2. Context 如果组件依赖于context，那么当context发生变化时，组件会重新渲染，不会走shouldComponentUpdate

### 控制渲染的场景

1. 大屏展示组件数据量大，渲染耗时长，可以使用React.memo局部更新
2. 表单，React 一般会采用受控组件的模式去管理表单数据层，表单数据层完全托管于 props 或是 state ，而用户操作表单往往是频繁的，需要频繁改变数据层，所以很有可能让整个页面组件高频率 render 。
3. 第三种情况就是越是靠近 app root 根组件越值得注意，根组件渲染会波及到整个组件树重新 render ，子组件 render ，一是浪费性能，二是可能执行 useEffect ，componentWillReceiveProps 等钩子，造成意想不到的情况发生。
