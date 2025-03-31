# 全局Module和生命周期

- 模块导出 provider，另一个模块需要 imports 它才能用这些 provider。
- 多个模块需要用到同一个 provider 时，可以把这个 provider 放到一个模块中，然后 imports 这个模块。
- 也可以直接把这个模块设置为全局模块，这样就不需要 imports 了。

## 全局模块

**注意:全局模块不推荐经常使用，注入太多的provider不清楚来源，可维护性差**

```ts
@Global()
@Module({
    imports: [PrismaModule],
    providers: [AService],
    controllers: [AController],
    exports: [AService],
    })
})
export class AModule {}
```

## 生命周期Lifecycle

**Nest 在启动的时候，会递归解析 Module 依赖，扫描其中的 provider、controller，注入它的依赖。
全部解析完后，会监听网络端口，开始处理请求。**

这个过程中，Nest 暴露了一些生命周期方法：

1. 首先，递归初始化模块，依次次调用模块内 controller,provider 的onModuleInit方法，然后在调用module的onModuleInit方法

2. 全部初始化完之后，再依次调用模块内的 controller、provider 的 onApplicationBootstrap 方法，然后调用 module 的 onApplicationBootstrap 方法

3. 然后监听网络端口。

4. 之后 Nest 应用就正常运行了。

**这个过程中，onModuleInit、onApplicationBootstrap等 都是我们可以实现的生命周期方法。**

```ts
@Controller('ccc')
export class CccController implements OnModuleInit, OnApplicationBootstrap {
  constructor(private readonly cccService: CccService) {}
  onApplicationBootstrap() {}
  onModuleInit() {} 
```

|生命周期         |     作用      |
| ------------- | :-----------: |  
|  onApplicationBootstrap |   初始化    |
|  onModuleInit | 初始化 |
| onModuleDestroy  |   销毁    |
| beforeApplicationShutdown | 销毁前 |
| onApplicationShutdown |   销毁    |

## 总结

::: tip
模块可以@Global声明为全局，这样它export的provider就可以在各处使用了，不需要imports

provider,controller,module都支持启动和销毁函数，这些生命周期函数都支持async的方式

可以在里面做一些初始化，销毁的逻辑，如onApplicationShutown里通过moduleRef.get取出一些provider,执行关闭连接等销毁逻辑
全局模块，声明周期，moduleRef都是Nest常用功能
:::
