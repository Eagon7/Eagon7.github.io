--- 
layout : doc
outline : [2,2]
---

## 中间件

::: info 存在意义
 处理HTTP请求的函数，他可以在请求到达控制器之前/之后执行一些操作 他可以是全局的也可以是局部的
 场景：身份验证，日志记录，错误处理
:::
::: details
中间件可以执行以下任务:

- 执行任何代码操作
- 对请求对象进行更改
- 结束当前请求生命周期
- 调用下一个中间件函数
- 如果当前中间件没有**手动结束生命周期**，必须使用next()方法将控制权传递给下一个中间件函数，否则请求将被挂起。
:::

1. 定义中间件

::: code-group

```typescript [index.ts]
// 中间件实例代码
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
 use(req:Request,res:Response,next:Function){
  console.log('中间件触发')
  next()
 }
}
```

```typescript [使用]
 // 添加到模块或者控制器中
 @Module({})
export class LoggerMiddleware implements NestMiddleware {
 use(req:Request,res:Response,next:Function){
  console.log('中间件触发')
  next()
 }
}
```

::: info
在上面的代码中，我们将LoggerMiddleware中间件添加到了AppModule模块中，并使用forRoutes('*')方法指定了该中间件适用于所有路由。这样，每次请求到达控制器之前，都会先执行LoggerMiddleware中间件中的代码。
:::

## 守卫

 Guard 是一种用于保护路由的机制，他可以在请求到达控制器之前或者之后执行一些操作。守卫可以用于实现身份验证，权限控制，缓存等功能。在NestJs中收尾可以是全局的也可以是局部的。守卫路由

[[Execution Context 执行上下文]]

```typescript
// Guard n g gu xxx --no-spec

@Injectable()
export class AuthGurad implements CanActive {
 canActivate(contenxt:ExecutionContext):boolean | Promise<boolean> | Observable<boolean>{
  const request = context.switchToHttp().getRequest()
  return validateRequest(request)
 }
}

function validateRequest(request:Request){
 if(request.xxx) return true 
}
```

::: details
定义一个AuthGuard守卫类，实现CanActivate接口，在canActivate()方法中，通过参数context获取到请求对象，调用validateRequest()函数验证请求是否合法，如果请求合法就返回true。要在控制器中使用守卫，需要将守卫添加到路由上
:::

```typescript
// useGuard
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(EagonGuard)
  getHello(): string {
    return
  }
}
```

$$
将AuthGuard守卫添加到路由上，并使用@UseGuards()装饰器指定守卫，这样每次请求到达控制器之前都会先执行AuthGuard守卫中的代码，以确保请求的合法性
$$

## 拦截器

 处理HTTP请求和响应的函数，在请求到达控制器之前之后执行一些操作。拦截器可以实现日志记录，错误处理，数据转换。在Nestjs中拦截器可以是全局的也可局部

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    console.log('Before...')
    const now = Date.now()
    return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)))
  }
}
```

```typescript
// 写入模块中作为提供者
@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule{}
```

## 管道

 管道是数据流入controller前进行的一波数据处理
 其中数据处理包含了对数据的转换,验证。他可以在控制器之前或之后对数据进行预处理。然后将数据传递给控制器或下一个管道。

$$管道的主要目的是增强应用的可靠性，安全性，可维护性$$
管道的应用场景
