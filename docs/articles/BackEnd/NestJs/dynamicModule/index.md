# 动态模块

Provider 是可以通过 useFactory 动态产生的，Module同样也可以

```ts
@Module({
    imports:[ConfigModule],
})
```

:::tip
此时ConfigModule是静态的，有时需要ConfigModule根据传递的参数动态改变里面的方法，此时就需要动态模块
:::

## 定义 1

第一种方法是在Module中写一个静态的注册方法注册

```ts
// config.module.ts
@Module({})
export class ConfigModule{
    static register(options:ConfigOptions):DynamicModule{
        return {
            module:ConfigModule,
            providers:[
                {
                    provide:CONFIG_OPTIONS,
                    useValue:options,
                },
                ConfigService,
            ],
        }
    }
}
```

区别@Module的地方

- 跟@Module类似，只是多了一个module属性，这个属性是用来指定这个模块的类型的，这里是ConfigModule
- 而且我们还可以把参数传入的 options 对象作为一个新的 provider。
- register可以接收参数，所以我们可以把参数传入的 options 对象作为一个新的 provider。@Module不行

::: warning
这里的 register 方法其实叫啥都行，但 nest 约定了 3 种方法名：

- register:用一次模块传一次配置，比如这次调用是 BbbModule.register({aaa:1})，下一次就是 BbbModule.register({aaa:2}) 了
- forRoot: 配置一次模块全局用，比如XxxModule.forRoot({})一次，之后一直用这个Module,一般在AppModule里import
- forFeature:用forRoot固定整体模块，用于局部的时候可能需要再传递一些配置，比如用forRoot指定数据库链接信息，再用forFeature指定某个模块访问哪个数据库和表

:::

## 定义 2

:::code-group

```ts [bbb.module.ts]
@Module({
    imports:[ConfigurableModuleClass.register({aaa:1,bbb:'bbb'})],
})
```

```ts [aaa.module.ts]
@Module()
export class AaaModule extends ConfigurableModuleClass{}

```

```ts [aaa.module-definition.ts]
import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface CccModuleOptions {
    aaa: number;
    bbb: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<CccModuleOptions>().build();
```

::: tip  使用流程

1. 创建xxx.module-definition.ts文件，使用ConfigurableModuleBuilder来生成一个动态模块
2. 创建xxx.module.ts文件，继承ConfigurableModuleClass
3. 注入：使用definMODULE_OPTIONS_TOKEN来注入 @Inject(MODULE_OPTIONS_TOKEN)

:::
用ConfigurableModuleBuilder来生成一个动态模块

- ConfigurableModuleClass : 生成具有register,forRoot,forFeature方法的类
- MODULE_OPTIONS_TOKEN    : 生成一个token，用于注入

**上边的代码仔细观察只能使用register方法**

### forRoot 和 forFeature

```ts

export  const {ConfigurableModuleClass,MODULE_OPTIONS_TOKEN} = 
    new ConfigurableModuleBuilder<CccModuleOptions>().setClassName('forRoot').build(); // [!code ++]
                                                     .setClassName('forFeature').build();// [!code ++]
```

设置为全局模块

```ts
xxx ..setExtras({
    isGlobal: true
  }, (definition, extras) => ({
    ...definition,
    global: extras.isGlobal,
  })).build(); 
```

最后再App.Module.ts挂载
setExtras 第一个参数是给 options 扩展 extras 属性，第二个参数是收到 extras 属性之后如何修改模块定义。

## 总结

Module可以传入 options根据配置生成对应的Module,还可以吧传入的options作为provider注入到别的对象里

建议的动态产生 Module 的方法名有 register、forRoot、forFeature 3种。

register：用一次注册一次

forRoot：只注册一次，用多次，一般在 AppModule 引入

forFeature：用了 forRoot 之后，用 forFeature 传入局部配置，一般在具体模块里 imports

并且这些方法都可以写 xxxAsync 版本，也就是传入 useFactory 等 option，内部注册异步 provider。

这个过程也可以用 ConfigurableModuleBuilder 来生成。通过 setClassMethodName 设置方法名，通过 setExtras 设置额外的 options 处理逻辑。

并且返回的 class 都有 xxxAsync 的版本。

这就是动态模块的定义方式，后面用到 typeorm、mongoose 等模块会大量见到这种模块。
