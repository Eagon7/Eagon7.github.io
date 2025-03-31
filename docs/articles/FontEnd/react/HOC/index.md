# 高阶组件HOC

**总结**

1. 强化 props ，可以通过 HOC ，向原始组件混入一些状态。
2. 渲染劫持，可以利用 HOC ，动态挂载原始组件，还可以先获取原始组件的渲染树，进行可控性修改。
3. 可以配合 import 等 api ，实现动态加载组件，实现代码分割，加入 loading 效果。
4. 可以通过 ref 来获取原始组件实例，操作实例下的属性和方法。
5. 可以对原始组件做一些事件监听，错误监控等。

## 两种不同的高阶组件

常用的高阶组件有**属性代理**和**反向继承**两种，两者之间有一些共性和区别。接下来分别介绍一下两种模式下的高阶组件。

### 属性代理

属性代理，就是用组件包裹一层代理组件，在代理组件上，可以做一些，对源组件的强化操作。这里注意属性代理返回的是一个新组件，被包裹的原始组件，将在新的组件里被挂载。

``` jsx
function HOC(WrapComponent){
    return class Advance extends React.Component{
       state={
           name:'alien'
       }
       render(){
           return <WrapComponent  { ...this.props } { ...this.state }  />
       }
    }
}
```

优点:

1. 属性代理可以和业务组件低耦合，零耦合，对于条件渲染和 props 属性增强，只负责控制子组件渲染和传递额外的 props 就可以了，所以无须知道，业务组件做了些什么。所以正向属性代理，更适合做一些开源项目的 HOC ，目前开源的 HOC 基本都是通过这个模式实现的。
2. 同样适用于类组件和函数组件。
3. 可以完全隔离业务组件的渲染，因为属性代理说白了是一个新的组件，相比反向继承，可以完全控制业务组件是否渲染。
4. 可以嵌套使用，多个 HOC 是可以嵌套使用的，而且一般不会限制包装 HOC 的先后顺序。

缺点：

1. 一般无法直接获取原始组件的状态，如果想要获取，需要 ref 获取组件实例。
2. 无法直接继承静态属性。如果需要继承需要手动处理，或者引入第三方库。
3. 因为本质上是产生了一个新组件，所以需要配合 forwardRef 来转发 ref。

### 反向继承

反向继承

反向继承和属性代理有一定的区别，在于包装后的组件继承了原始组件本身，所以此时无须再去挂载业务组件。

```jsx
class Index extends React.Component{
  render(){
    return <div> hello,world  </div>
  }
}
function HOC(Component){
    return class wrapComponent extends Component{ /*直接继承需要包装的组件*/

    }
}
export default HOC(Index)
```

优点：

① 方便获取组件内部状态，比如 state ，props ，生命周期，绑定的事件函数等。
② es6继承可以良好继承静态属性。所以无须对静态属性和方法进行额外的处理。
缺点：

① 函数组件无法使用。
② 和被包装的组件耦合度高，需要知道被包装的原始组件的内部状态，具体做了些什么？
③ 如果多个反向继承 HOC 嵌套在一起，当前状态会覆盖上一个状态。这样带来的隐患是非常大的，比如说有多个 componentDidMount ，当前 componentDidMount 会覆盖上一个 componentDidMount 。这样副作用串联起来，影响很大。

## 编写HOC 什么时候使用HOC

1. 强化Props
强化 props 就是在原始组件的 props 基础上，加入一些其他的 props ，强化原始组件功能

2. 控制渲染
HOC 反向继承模式，可以通过 super.render() 得到 render 之后的内容，利用这一点，可以做渲染劫持 ，更有甚者可以修改 render 之后的 React element 对象。

::: code-group

```jsx [控制渲染]
const HOC = (WrapComponent) =>
  class Index  extends WrapComponent {
    render() {
      if (this.props.visible) {
        return super.render()
      } else {
        return <div>暂无数据</div>
      }
    }
  }
```

```jsx [控制渲染树]
class Index extends React.Component{
  render(){
    return <div>
       <ul>
         <li>react</li>
         <li>vue</li>
         <li>Angular</li>
       </ul>
    </div>
  }
}
function HOC (Component){
  return class Advance extends Component {
    render() {
      const element = super.render()
      const otherProps = {
        name:'alien'
      }
      /* 替换 Angular 元素节点 */
      const appendElement = React.createElement('li' ,{} , `hello ,world , my name  is ${ otherProps.name }` )
      const newchild =  React.Children.map(element.props.children.props.children,(child,index)=>{
           if(index === 2) return appendElement
           return  child
      }) 
      return  React.cloneElement(element, element.props, newchild)
    }
  }
}
export  default HOC(Index)

```

:::

### 动态加载Loading

```jsx
export default function dynamicHoc(loadRouter) {
  return class Content extends React.Component {
    state = {Component: null}
    componentDidMount() {
      if (this.state.Component) return
      loadRouter()
        .then(module => module.default) // 动态加载 component 组件
        .then(Component => this.setState({Component},
         ))
    }
    render() {
      const {Component} = this.state
      return Component ? <Component {
      ...this.props
      }
      /> : <Loading />
    }
  }
}

const Index = AsyncRouter(()=>import('../pages/index'))

// Index 组件中，在 componentDidMount 生命周期动态加载上述的路由组件Component，如果在切换路由或者没有加载完毕时，显示的是 Loading 效果。
```

- 组件赋能

对于属性代理虽然不能直接获取组件内的状态，但是可以通过 ref 获取组件实例，获取到组件实例，就可以获取组件的一些状态，或是手动触发一些事件，进一步强化组件，但是注意的是：类组件才存在实例，函数组件不存在实例。

```jsx
function Hoc(Component){
  return class WrapComponent extends React.Component{
      constructor(){
        super()
        this.node = null /* 获取实例，可以做一些其他的操作。 */
      }
      render(){
        return <Component {...this.props}  ref={(node) => this.node = node }  />
      }
  }
}
```

### 事件监控

HOC 不一定非要对组件本身做些什么？也可以单纯增加一些事件监听，错误监控。
以下代码HOC ，只对组件内的点击事件做一个监听效果。

```jsx
function ClickHoc (Component){
  return  function Wrap(props){
    const dom = useRef(null)
    useEffect(()=>{
       const handerClick = () => console.log('发生点击事件') 
       dom.current.addEventListener('click',handerClick)
     return () => dom.current.removeEventListener('click',handerClick)
    },[])
    return  <div ref={dom}  ><Component  {...props} /></div>
  }
}


@ClickHoc
class Index extends React.Component{
   render(){
     return <div className='index'  >
       <p>hello，world</p>
       <button>组件内部点击</button>
    </div>
   }
}
export default ()=>{
  return <div className='box'  >
     <Index />
     <button>组件外部点击</button>
  </div>
}
```

### 权限拦截

::: code-group

```jsx 通过Context传递权限

export const Permission = React.createContext([]) 
export default function Index(){
    const [ rootPermission , setRootPermission ] = React.useState([])
    React.useEffect(()=>{
        /* 获取权限列表 */
        getRootPermission().then(res=>{
            const { code , data } = res as any
            code === 200 && setRootPermission(data) //  [ 'docList'  , 'tagList' ]
        }) 
    },[])
    return <Permission.Provider value={rootPermission} >
         <RootRouter/>
    </Permission.Provider>
}
```

```jsx 编写HOC
/* 没有权限 */
function NoPermission (){
    return <div>您暂时没有权限，请联系管理员开通权限！</div>
}
/* 编写HOC */
export function PermissionHoc(authorization){
    return function(Component){ 
        return function Home (props){
            const matchPermission =(value,list)=> list.indexOf(value) /* 匹配权限 */
            return <Permission.Consumer>
                {
                    (permissionList) => matchPermission(authorization,permissionList) >= 0 ? <Component  {...props} /> : <NoPermission />
                }
            </Permission.Consumer>
        }
    }
}

@PermissionHoc('writeDoc')  // 绑定文档录入页面
export default class Index extends React.Component{}
export default PermissionHoc('writeTag')(index) //绑定标签录入页面
export default PermissionHoc('tagList')(index) //绑定标签列表页面
export default PermissionHoc('docList')(Index) // 绑定文档列表页面


```

:::
