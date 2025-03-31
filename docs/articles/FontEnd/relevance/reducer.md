---
 layout : doc
---
# reducer

> action + state  = new state

#### 与state的区别

state是用户触发函数来执行具体的一步一步操作，**reducer是把操作整合到一起**，用户触发事件名进而执行相应的处理函数

例如：用户触发添加程序, 程序了解到事件名以后去reducer中找到对应的函数执行操作

这样的优点就是把操作整合到一起，只需要知道用户执行了什么操作去reducer中寻找响应的程序而不是直接触发这些程序，更加符合常理

#### 命名原因

reducer是根据reduce命名 ,它接收目前的结果和当前的值，然后返回下一个结果.

 React中的reducer也是这样的他们都接受 当前state 和触发的事件action ,然后返回新的state 这样action行为会随着时间的推移积累到状态中

<!-- ## reduce实现reducer

::: code-group

```ts [index.js]
import tasksReducer from './tasksReducer.js';

let actions = [
  {type: 'added', id: 1, text: '参观卡夫卡博物馆'},
  {type: 'added', id: 2, text: '看木偶戏'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: '打卡列侬墙'},
];

let finalState = actions.reduce(tasksReducer, []);
const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);

```

``` ts [reducer.js]{3,2}
export default function tasksReducer(tasks, action) {
  // tasks: previous state 
  // action: current state
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasksk.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知 action: ' + action.type);
    }
  }
}

```

::: -->

## 实现useReducer

通过useState保存当前状态＋action = new state
::: code-group

```js [app.js]
const App = ()=>{
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <div>
      {state}
      <button onClick={()=>dispatch({type:'add',message:'添加'})}/> 
    </div>
  )
}
```

``` js [reducer.js]
type reducer = (state,action)=>newState
// reducer 接收状态事件 计算新的状态
const reducer = (state,action)=>{
  switch(action.type){
    case 'add':
      return state + action.message
    default:
      return state
  }
}
```

``` js [useReducer.js]
type useReducer = (reducer,initState)=>[state,dispatch]
// useReducer 接收接受个初始值，和状态计算函数。 返回的dispatch来调用状态计算函数，通过useState保存状态
const useReducer =(reducer,initState)=>{
  const [state,setState] = useState(initState)

  function dispatch = (action)=>{
    const newState = reducer(state,action)
    setState(newState)
  }

  export [state,dispatch]
}
```

:::

## 实际用途

useReducer是React提供的一个Hook，用于管理组件的状态（state）。它的实际用途包括：

- 状态复杂逻辑：当组件的状态逻辑较为复杂，涉及多个状态变化时，可以使用useReducer来更好地组织和管理状态的变化逻辑。

- 替代useState：在一些情况下，使用useReducer可以替代多个独立的useState，从而将相关状态集中管理，减少状态逻辑的分散。

- 可预测性：使用useReducer可以使状态变化变得可预测，因为它通过一个reducer函数来处理状态变化，可以更好地理解状态变化的来源。

- 中间件和副作用：useReducer可以配合副作用和中间件来处理状态变化时的特定逻辑，使得状态管理更加灵活。

- 复杂动态表单：在处理复杂的动态表单或用户输入场景时，useReducer可以帮助更好地处理不同字段的状态变化。

- 总之，useReducer适用于需要更精细控制状态逻辑、处理复杂状态变化、使用中间件或副作用等情况下，可以优于简单使用useState来管理组件状态。
