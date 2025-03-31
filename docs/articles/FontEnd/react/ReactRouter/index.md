# React Router

后端概念：发送url请求到服务器端，server会通过不同的地址返回不同的页面

**为什么需要路由：**

- 单页应用需要路由切换
- 通过url可以定位到页面
- 更有语义的组织资源

**三种路由的实现方式：**

- BrowserRouter
- HashRouter
- MemoryRouter

**好处**

- 页面松耦合
- lazyload 之类的可以基于路由实现
- 重构,维护,扩展更容易

## 快速上手

## 原理分析

## 核心API

| name | effect  | demo|
| ---- | ------- |--- |
|Link |普通链接，不会触发刷新|`<Link to=""/>`|
|NavLink|类似Link | 但是会添加当前选中状态`<NavLink to="/home" activeClassName="selected"/>`|
|Prompt|满足条件时提示用户是否离开页面|`<Prompt when={formIsHalfFilledOut} message="Are you sure you want leave?">` |
|Redirect|重定向 例如登录判断|`<Router path="/" render={()=>{Logged ? <Redirect to='/dashboard'> : <PublicHome> }}>` |
|||
