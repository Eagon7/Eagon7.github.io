# 装饰器总结

## @Optional()

使Provider为可选

>> 当Controller需要注入一个Provider,如果这个provider不存在的话，那么会报错，把它设置为可选的会避免这个问题

```ts
export class AppController{
    @Optional() // [!code ++]
    private readonly a : Record<string,any>

    controller(@Optional() private appService:Appservice){} // [!code ++]
}
```

## @Global()

使Provider全局可用,当一个Module被设置为@Global时，Export属性全局可用

```ts
@Global() // [!code ++]
@Module({
    imports:[],
    providers:[AppService],
    exports:[AppService]
})
export class AppModule{...}
```

## @Catch()

>ExceptionFilter 是处理抛出的未捕获异常的，通过 @Catch 来指定处理的异常：
::: code-group

```ts
@Catch(HttpException)
export class AaaFilter implements ExceptionFilter{
    catch(exception:HttpException,host:ArgumentHost){
        const response:Response = host.switchToHttp().getResponse();
        response.status(exception.getStatus()).json({
            msg:exception.message
        })
    }
}
```

```ts
@Controller()
export class AppController{
    @Inject(AppService)
    private readonly appService:AppService

    @Get()
    @UseFilter(AaaFilter)
    getHello():void{
    if(xxx){
        throw new HttpException('xxxx',HttpStatus.BAD_REQUEST)
       }
    }
}
```

:::

## @Post()
>
>> 如果是POST请求，可以使用@Body获取到请求体.我们一般用 dto 的 class 来接受请求体里的参数

```ts
// dto
export class AaaDto{
    a:number,
    b:number
}

// Controller
@Post('/bbb')
getHello(@Body() aaa:AaaDto){
    console.log(aaa)
}
```

除了 @Get、@Post 外，还可以用 @Put、@Delete、@Patch、@Options、@Head 装饰器分别接受 put、delete、patch、options、head 请求

## @SetMetaData()

handle 和 class 可以通过@SetMetaData()制定元信息数据,提供给守卫，拦截器等使用
然后在 guard 或者 interceptor 里取出来：
::: code-group

```ts [Controller]
import { SetMetadata } from '@nestjs/common';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Roles('user')
@Controller('aa')
export class AppService{
    controller(){}

    @Get()
    @UseGuard(AaaGuard)
    @Roles('admin')
    getPassword(){}
}
```

```ts [guard]
@Injectable()
export class RoleGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const handleRoles = this.reflector.get<string[]>('roles', context.getHandler())
    const classRoles = this.reflector.get<string[]>('roles', context.getClass())
    return true
  }
}

```

:::

## @Headers()

>通过 @Headers 装饰器取某个请求头 或者全部请求头

```ts
@Get('/abc')
header(@Headers('Accept') accept:string,@Headers() headers:Record<string,any>){
    console.log(accept,headers)
}
```

## @Ip()
>
> 通过@Ip 拿到请求的ip

```ts
@Get('/ip')
ip(@Ip() ip:string){
    console.log(ip)
}
```

## @Session() TODO

::: details
>
> 通过@Session拿到session

```ts
@Get('/session')
session(@Session() session){
    console.log(session)
}
```

**但要使用 session 需要安装一个 express 中间件**

```ts
npm install express-session
```

在main.ts引入并启用

```ts
import * as session from 'express-session'
app.use(session({
    secret:'abc',
    cookie:{maxAge:10000}
}))
```

会返回 set-cookie 的响应头，设置了 cookie，包含 sid 也就是 sesssionid。

之后每次请求都会自动带上这个 cookie：
:::

## @HostParam 用于取域名部分的参数
>
> Controller 除了可以制定具体path生效外，还可以指定host

```ts
@Controller({host:':host.0.0.1',path:'aaa'})
export class AaaController{
    @Get('bbb')
    hello(@HostParam('host') host){
        return host
    }
}
```

// 127.0.0.1/aaa/bbb
此时只有host满足xx.0.0.1才能路由到这个Controller
host 里的参数就可以通过 @HostParam 取出来：// 127

## @Req() @Response 直接注入Request/Response属性
>
> 前面取的是request属性，当然也可以注入request对象
::: code-group

```ts Req
@Controller({host:':host.0.0.1',path:'aaa'})
export class AaaController{
    @Get('bbb')
    hello(@Req() req:Request){
        console.log(req.hostname)
    }
}
```

```ts Res
// Response 必须手动 .end去响应
// Nest 这么设计是为了避免你自己返回的响应和 Nest 返回的响应的冲突。
// 如果你不会自己返回响应，可以通过 passthrough 参数告诉 Nest：
    @Get('bbb')
    hello(@Res({passthrough:true}) res:Response){
        res.end('ddd') // [!code ++]
    }
```

:::
注入Request后可以手动取任何参数

## @Next()
>
> 除了注入@Res不会返回响应外，注入@Next也不会
> @Next() 当你有两个handler来处理同一个路由的时候，可以再第一个handler里注入next,调用它来吧请求转发到第二个handler

```ts
@Get('eee')
eee(@Next() next:NextFunction){
    console.log('handler1')
    return '111'
}

@Get('eee')
eee2(){
    console.log('handler2')
    return 'eee'
}
```

Nest 不会处理注入@Next的handler返回值
handler默认返回值是200状态码，你可以通过@HttpCode修改它

```ts
@Get('fff')
@HttpCode(222)
fff(){
    return 'hello'
}
```

修改Header

```ts
@Get('ggg')
@Header('aaa','bbb')
getHello(){}
```

## @Redirect() 重定向

```ts
@Get('abc')
@Redirect('http://baidu.com')
RedirectBaidu(){
}

@Get('abc')
@Redirect('http://baidu.com') // [!code --]
@Redirect() // [!code ++]
RedirectBaidu(){
return {// [!code ++]
 url:'https://www.baidu.com'// [!code ++]
} // [!code ++]
}

```
