# 多种provider

**Nest 实现了IoC 从main文件开始，分析Module引用及依赖中的关系，自动把provider注入到目标对象**
::: code-group

``` ts [AuthModule]
@Module({
  imports: [PrismaModule],
  providers: [// [!code focus]
    AuthService//简写,// [!code focus]
    JwtService:{// [!code focus]
      provide:'JWT',// [!code focus]
      useClass:JwtService// [!code focus]
    }],// [!code focus]
  controllers: [AuthController],
})
export class AuthModule {}
```

```ts [AuthController]
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // 或者
  constructor(@Inject('JWT') private readonly jwt: JwtService) {}
}
```

:::

## 注册Value值

```ts
@Module({
  imports: [PrismaModule],
  providers: [{
      provide:'a',
      useValue:'我是A'
    }]
 controllers: [AuthController],
})
```

## 动态注册服务

```ts
@Module({
  imports: [PrismaModule],
  providers: [{
      provide:'providerTest',
      inject: ['person', AppService]
      useFactory:(person:{name:string},authService:AuthService){
        return {
          perison,
          hello:authService.getHello()
        }
      }
    }]
 controllers: [AuthController],
})
```

这个 useFactory 支持通过参数注入别的 provider

## 异步动态注册服务

当需要异步获取provider时，可以使用useFactory的async版本
例如: 链接redis当redis链接成功后再注册provider

```ts
@Module({
  imports: [PrismaModule],
  providers: [ {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        await client.connect();
        return client;
      }
    }
  ],
})
```

## 总结

::: tip

- 一般情况Provider通过@Injectable声明,然后再@Module的providers数组里注册的class
- 默认provier的token就是class,这样不用使用@Inject来指定注入的token 但也可以用字符串类型的token,不过注入的时候要用@Inject单独指定
- 除了useClass，还可以useValue,useFactory,useExisting
灵活运用这些 provider 类型，就可以利用 Nest 的 IOC 容器中注入任何对象。
:::
