# Ref

## 获取Ref的三种方式

- ref是一个字符串
::: details View The Code

``` jsx
/* 类组件 */
class Children extends Component{  
    render=()=><div>hello,world</div>
}

export default class Index extends React.Component{
    componentDidMount(){
       console.log(this.refs)
    }
    render=()=> <div>
        <div ref="currentDom"  >字符串模式获取元素或组件</div>
        <Children ref="currentComInstance"  />
    </div>
}
```

:::

- ref是一个函数
::: details View The Code

``` jsx
class Children extends React.Component{  
    render=()=><div>hello,world</div>
}

export default class Index extends React.Component{
    currentDom = null
    currentComponentInstance = null
    componentDidMount(){
        console.log(this.currentDom)
        console.log(this.currentComponentInstance)
    }
    render=()=> <div>
        <div ref={(node)=> this.currentDom = node }  >Ref模式获取元素或组件</div>
        <Children ref={(node) => this.currentComponentInstance = node  }  />
    </div>
}

```

:::

- ref是一个对象
::: details View The Code

``` jsx
class Children extends React.Component{  
    render=()=><div>hello,world</div>
}
export default class Index extends React.Component{
    currentDom = React.createRef(null)
    currentComponentInstance = React.createRef(null)
    componentDidMount(){
        console.log(this.currentDom)
        console.log(this.currentComponentInstance)
    }
    render=()=> <div>
         <div ref={ this.currentDom }  >Ref对象模式获取元素或组件</div>
        <Children ref={ this.currentComponentInstance }  />
   </div>
}
```

:::

## 转发Ref(跨层级获取Ref)

如果我想在父组件 获取 孙/子 组件的实例

- 通过回调函数将子组件的Ref作为参数
::: details View The Code

```jsx
function ParentComponent(){
  const ChildRef =   useRef(null)
  useEffect(()=>{
    console.log(ChildRef)
  },[])
  return  <ChildrenComponent setRef={node => this.ChildRef = node} />
}

function ChildrenComponent({setRef}){
     return <span ref={setRef}>
}

```

:::

- 通过forwardRef转发
- NewFahter组件是为了转发Ref的中间组件 ,forwardRef的第二个参数是ref,这个Ref是GrandFahter组件传递过来的
- 至此一层一层从prop传递，最终通过ref赋值
::: details View The Code

```jsx
function GrandFather(){
  const ChildSpanRef = useRef(null)
  useEffect(()=>{
    console.log(ChildRef)
  },[])
  return  <NewFather ref={ChildSpanRef} />
}

const NewFather = React.forwardRef((props,ref)=> <Father grandRef={ref}  {...props} />)
// 父组件
class Father extends React.Component{
    constructor(props){
        super(props)
        
        console.log(props)
    }
    render(){
        return <div>
            <Son grandRef={this.props.grandRef}  />
        </div>
    }
}

function Son({grandRef}){
    return <span ref={grandRef} />
}
```

:::

## 组合转发Ref

::: details View The Code

```jsx
// 表单组件
class Form extends React.Component{
    render(){
       return <div>{...}</div>
    }
}
// index 组件
class Index extends React.Component{ 
    componentDidMount(){
        const { forwardRef } = this.props
        forwardRef.current={
            form:this.form,      // 给form组件实例 ，绑定给 ref form属性 
            index:this,          // 给index组件实例 ，绑定给 ref index属性 
            button:this.button,  // 给button dom 元素，绑定给 ref button属性 
        }
    }
    form = null
    button = null
    render(){
        return <div   > 
          <button ref={(button)=> this.button = button }  >点击</button>
          <Form  ref={(form) => this.form = form }  />  
      </div>
    }
}
const ForwardRefIndex = React.forwardRef(( props,ref )=><Index  {...props} forwardRef={ref}  />)
// home 组件
export default function Home(){
    const ref = useRef(null)
     useEffect(()=>{
         console.log(ref.current)
     },[])
    return <ForwardRefIndex ref={ref} />
}

```

:::
如上代码所示，流程主要分为几个方面：

1. 通过 useRef 创建一个 ref 对象，通过 forwardRef 将当前 ref 对象传递给子组件。
2. 向 Home 组件传递的 ref 对象上，绑定 form 孙组件实例，index 子组件实例，和 button DOM 元素。

## 高阶组件转发

如果通过高阶组件包裹一个原始类组件，就会产生一个问题，如果高阶组件 HOC 没有处理 ref ，那么由于高阶组件本身会返回一个新组件，所以当使用 HOC 包装后组件的时候，标记的 ref 会指向 HOC 返回的组件，而并不是 HOC 包裹的原始类组件，为了解决这个问题，forwardRef 可以对 HOC 做一层处理。
高阶组件把组件作为参数，我们想获取的Ref其实是这个参数的实例
如果不使用forwardRef转发一下那么最终获取到的组件就是HOC返回的Wrap组件,但是我们需要的事传递进HOC被包裹的组件

**forwardRef的意义是可以让开发着手动控制Ref的指向**
::: details View The Code

```jsx
function HOC(Component){
  class Wrap extends React.Component{
     render(){
        const { forwardedRef ,...otherprops  } = this.props
        return <Component ref={forwardedRef}  {...otherprops}  />
     }
  }
  return  React.forwardRef((props,ref)=> <Wrap forwardedRef={ref} {...props} /> ) 
}

const Index = React.forwardRef((prop,index)=>{
    return 
})
const HocIndex =  HOC(Index)

export default ()=>{
  const node = useRef(null)
  useEffect(()=>{
    console.log(node.current)  /* Index 组件实例  */ 
  },[])
  return <div><HocIndex ref={node}  /></div>
```

:::

## 组件通信

- 类组件通信: 因为类组件有实例，所以我们可以直接获取实例然后调用实例方法来操作
- 函数组件通信: 对于函数组件，本身是没有实例的，所以我们要借用forwardRef(使函数组件可以接收Ref) + useImperativeHandle() useImperativeHandle 一方面第一个参数接受父组件传递的 ref 对象，另一方面第二个参数是一个函数，函数返回值，作为 ref 对象获取的内容。  (向传下来的ref传递方法)
- forwardRef:使函数组件可以接收Ref

:::     details View The Code
::: code-group

```jsx [类组件通信]
// 父通信子 直接传递pros
// 子通信父 直接让父Ref获取实例，得到实例方法,父调用子实例方法用来修改子组件状态
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

class YuQingComp extends React.Component {
  state = {
    togjsMsg: "",
    togyqMsg: "",
  };
  // 调用父组件传递过来的修改函数
  toGjs = () => {
    this.props.toGjs(this.state.togjsMsg);
  };

  // 提供实例方法供父组件调用
  toyq(msg) {
    this.setState({ ...this.state, togyqMsg: msg });
  }

  render() {
    return (
      <>
        <div>gjs say :{this.state.togyqMsg}</div>
        对 gjs说
        <input
          type="text"
          onChange={(e) =>
            this.setState({ ...this.state, togjsMsg: e.target.value })
          }
        />
        <button onClick={this.toGjs}>to 耿嘉帅</button>
      </>
    );
  }
}

export default function GjsComp() {
  const [gyqMsg, setGyqMsg] = useState("");
  const [toGyqMsg, setToGyqMsg] = useState("");
  const node = useRef(null);

  // props 传递函数
  function toGjs(msg) {
    setGyqMsg(msg);
  }

  // 调用子组件的方法
  function toyq() {
    node.current.toyq(toGyqMsg);
  }
  return (
    <>
      <div>yq say:{gyqMsg}</div>
      对yq说
      <input type="text" onChange={(e) => setToGyqMsg(e.target.value)} />
      <button onClick={toyq}>to yq</button>
      <YuQingComp toGjs={toGjs} ref={node} />
    </>
  );
}


```

```jsx [函数组件通信]
 // useImperativeHandle + forwardRef
  // 函数没有实例 所以使用useImperativeHandle 里面传递参数模拟类组件实例，forwawrdRef使函数组件可以被Ref获取实例，这样的话其实跟类组件的性质是一样的
function Son(props, ref) {
  const [sonMes, setSonMes] = useState("");
 // useimperativeHandle创建实例方法，第一个参数是要传递的ref对象
 // 第二个参数是一个函数，函数返回值，作为 ref 对象获取的内容。
 // 第三个参数是一个数组，数组中的值发生变化时，才会重新执行第二个参数的函数
  useImperativeHandle(
    ref,
    () => {
      return {
        SonRtate: 1,
      };
    },
    []
  );
  return <div>Son</div>;
}
// 转发引用，使函数组件可以接受Ref，这样就可以获取到实例
const ForwardSon = forwardRef(Son);

export default function Parent() {
  const instance = useRef(null);
  useEffect(() => {
    console.log(instance);
  });
  return <ForwardSon ref={instance} />;
}
```

:::

## 函数组件数据缓存

函数组件每一次 render ，函数上下文会重新执行，那么有一种情况就是

**在执行一些事件方法改变数据或者保存新数据的时候，有没有必要更新视图，有没有必要把数据放到 state 中。如果视图层更新不依赖想要改变的数据，那么 state 改变带来的更新效果就是多余的。这时候更新无疑是一种性能上的浪费。**

::: tip
useRef 会创建出一个原始的ref对象，只要组件不销毁则这个对象一直存在
:::

- 不影响视图变化的不要放到state中，因为每次更新state都会重新渲染组件
- 可以通过useRef来缓存，因为useRef不会引起组件重新渲染

1. 第一个能够直接修改数据，不会造成函数组件冗余的更新作用。
2. 第二个 useRef 保存数据，如果有 useEffect ，useMemo 引用 ref 对象中的数据，无须将 ref 对象添加成 dep 依赖项，因为 useRef 始终指向一个内存空间，所以这样一点好处是可以随时访问到变化后的值。

``` jsx
const toLearn = [ { type: 1 , mes:'let us learn React' } , { type:2,mes:'let us learn Vue3.0' }  ]
export default function Index({ id }){
    const typeInfo = React.useRef(toLearn[0])

    const changeType = (info)=>{
        typeInfo.current = info /* typeInfo 的改变，不需要视图变化 */
    }

    useEffect(()=>{
       if(typeInfo.current.type===1){
           /* ... */
       }
    },[ id ]) /* 无须将 typeInfo 添加依赖项  */
    return <div>
        {
            toLearn.map(item=> <button key={item.type}  onClick={ changeType.bind(null,item) } >{ item.mes }</button> )
        }
    </div>
}

```
