# circular dependency如何解决

**为什么会出现circulr dependency?**
有两个模块A和B，A依赖B，B依赖A，这样就形成了循环依赖。
因为Nest解析是从上到下的，所以当解析到A时，A依赖B，但是B还没有解析，所以会报错。

解决办法:

```ts
@Module({
    imports:[forwardRef(()=>BModule)],
})
```

nest 会单独创建两个 Module，之后再把 Module 的引用转发过去，也就是 forwardRef 的含义。
provider 之间也会形成循环依赖，解决方案同上
