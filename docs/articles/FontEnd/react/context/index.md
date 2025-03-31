# Context Provider Consumer

- const ThemeContext = React.createContext(null)
- const ThemeProvider = ThemeContext.Provider  //提供者
- const ThemeConsumer = ThemeContext.Consumer // 订阅消费者

## 提供者Provider用法

```jsx
const ThemeProvider = ThemeContext.Provider  //提供者
export default function ProviderDemo(){
    const [ contextValue , setContextValue ] = React.useState({  color:'#ccc', background:'pink' })
    return <div>
        <ThemeProvider value={ contextValue } > 
            <Son />
        </ThemeProvider>
    </div>
}
```

provider 作用有两个：

- value 属性传递 context，供给 Consumer 使用。
- value 属性改变，ThemeProvider 会让消费 Provider value 的组件重新渲染。

## 消费者Consumer用法

对于新版本想要获取 context 的消费者，React 提供了3种形式
::: code-group

```jsx [① 类组件之contextType 方式]
React v16.6 提供了 contextType 静态属性，用来获取上面 Provider 提供的 value 属性，这里注意的是 contextType ，不是上述老版的contextTypes
const ThemeContext = React.createContext(null)
// 类组件 - contextType 方式
class ConsumerDemo extends React.Component{
   static contextType = ThemeContext

   render(){
     const { border , setTheme ,color  ,background} = this.context
        ...
   }
}


```

```jsx [函数组件useContext方式]
// 既然类组件都可以快捷获取 context 了，那么函数组件也应该研究一下如何快速获取 context 吧，于是乎 v16.8 React hooks 提供了 useContext，下面看一下 useContext 使用。
// useContext 接受一个参数，就是想要获取的 context ，返回一个 value 值，就是最近的 provider 提供 contextValue 值。

const ThemeContext = React.createContext(null)
function ConsumerDemo(){
    const  contextValue = React.useContext(ThemeContext) /*  */
    const { color,background } = contextValue
    return <div style={{ color,background }}> 消费者 </div> 
}

```

```jsx [订阅者之Consumer]
// Consumer 订阅者采取 render props 方式，接受最近一层 provider 中value 属性，作为 render props 函数的参数
// 可以将参数取出来，作为 props 混入 ConsumerDemo 组件，说白了就是 context 变成了 props。

const ThemeConsumer = ThemeContext.Consumer // 订阅消费者
function ConsumerDemo(props){
    const { color,background } = props
    return <div style={{ color,background } } >消费者</div> 
}
const Son = () => (
    <ThemeConsumer>
       { /* 将 context 内容转化成 props  */ }
       { (contextValue)=> <ConsumerDemo  {...contextValue}  /> }
    </ThemeConsumer>
) 
```

:::
