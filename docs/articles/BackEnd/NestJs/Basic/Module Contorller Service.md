- Nest 请求声明周期
- [[Provider]]
	- 动态Provider
	- asynProvider 

-  Module
	- 静态模块
	- 动态模块
	- 全局模块
- [[env配置相关]]
## Module Controller Service的关系
>`Module` 提供了一个模块化的方式来组织和管理您的应用程序的代码，同时还允许您使用依赖注入和模块之间的依赖关系来构建更加可扩展的应用程序。
$$ Module是Nestjs应用程序的基本构建块，每个模块都有一个独立的作用域，其中包含一组相关的Controller,service和其他提供者（provider） Module的作用是将应用程序拆分为更小的可重用部分，以便更好的组织代码和管理依赖关系$$

>Controller提供一个路由处理器，他可以将HTTP请求映射到响应的处理器方法上，并将处理器方法的结果作为HTTP响应返回给Client
$$Controller是处理 HTTP请求并返回HTTP响应的类，Controller的作用是将路由映射到处理请求方法上，在Controller中可以使用Nestjs提供的装饰器来定义 路由,中间件,pipe,dto和请求参数等 $$

>Service提供一种实现业务逻辑的方式，他可以访问操作数据，同事还可以与其他服务交互以完成复杂的业务逻辑
$$Service是处理应用程序逻辑的类，将业务逻辑从Controller中分离出来，使得Controller只需处理HTTP请求和响应，而不需要处理业务逻辑。在Service中，可以编写业务逻辑和调用其他服务$$

## Nest 请求生命周期
![img](https://doc.houdunren.com/assets/img/pasted-from-clipboard.415797fd.png)
``` java

1.  收到请求
2.  全局绑定的中间件
3.  模块绑定的中间件
4.  全局守卫
5.  控制层守卫
6.  路由守卫
7.  全局拦截器（控制器之前）
8.  控制器层拦截器 （控制器之前）
9.  路由拦截器 （控制器之前）
10.  全局管道
11.  控制器管道
12.  路由管道
13.  路由参数管道
14.  控制器（方法处理器）
15.  路由拦截器（请求之后）
16.  控制器拦截器 （请求之后）
17.  全局拦截器 （请求之后）
18.  异常过滤器 （路由，之后是控制器，之后是全局）
19.  服务器响应
```
## [[Provider]]
	提供服务,用于表示应用程序中可注入的任何东西。除了服务，Provider 还可以提供其他类型的对象，例如 Factory 工厂、配置对象、连接对象等。
-   提供者使用 **@Injectable()** 装饰器定义，这样系统会分析 **constructor** 进行依赖注入
-   提供者在模块的 **providers** 属性中定义，用于注册到服务容器中，用于被其他类依赖注入
-   提供者可以在自身的constructor构造函数中依赖注入其他服务提供者，需要使用 **@Injectable()** 装饰器声明该提供者
-   注册到容器的提供者，默认只对当前模块有效，即作用域为模块
-   可以使用 **exports** 导出给其他模块使用
-   提供者是单例的4
-   提供者可以是任何值，而不仅仅是服务类
$$
Provider 提供者是 NestJS 应用程序中的核心概念之一，它们将代码块标记为可注入的，并提供与其它代码块之间的依赖关系。当需要在组件或控制器中使用一个实例时，NestJS 会自动处理依赖关系并将实例提供给需要的组件或控制器。
$$


## Module
	模块是一个子程序，用于定义控制器，提供者或向其他模块开放提供者（开放模块的API）
- 默认情况下控制器，提供者在当前模块可用，即模块作用域
- 若果向其他模块提供服务可以将提供者定义在export属性中，其他模块需要再imports属性中引入当前模块
- 模块是[[设计模式模式]]的，多个模块共享当前模块实例
- 模块提供者也是单例，所以模块被多个其他模块使用，那该模块的provider也是共享的
```typescript
@Module({
	//导入其他模块
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('app.token_secret'),
          expiresIn: '100d',
        }
      },
    }),
  ],
  //模块提供者
  providers: [AuthService, JwtStrategy],
  //控制器
  controllers: [AuthController],
  //向外提供接口
  exports: [AuthService],
})
export class AuthModule {}

```

	## 动态Module