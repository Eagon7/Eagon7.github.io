# Redux

## API介绍

0. reducer 纯函数，接收两个参数，一个是state，一个是action，返回一个新的state
1. createStore 创建一个 root 存放 state的根对象
2. dispatch 更新store中的state
3. subscribe 订阅/监听store中的state变化
5. combineReducer 将多个reducers合并成一个rootReducer

## 摘要

- middleware 中间件,中间件用于增强 dispatch 功能，返回一个增强后的 dispatch（比如 redux-thunk 使 action 可以为 function）
- enhancer   增强器
- action     动作
- reducer    纯函数
