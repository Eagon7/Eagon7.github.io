>注入基本数据

	因为普通数据服务不是Class，所以要使用@Inject来注入
```Typescript
@Module({
	providers:[
		{
			provide:'APP_NAME',
			useValue:'使用普通值'
		}
	]
})
```
```Typescript
@Injectable()
export class AuthService{
	constractor( @Inject('APP_NAME') private appName){}
}

```

> 注册类

	使用类将提供者注册到服务是最常用的方式
```Typescript
@Module({
	providers:[AutherService]
})

以上是简写形式，完整写法应该如下
```
```Typescript
@Module({
	providers:[
		{
			provider:'AutherService',
			useClass:AutherService
		}
	]
})
```

> 动态注册

	下面实现根据不同的环境创建不同的服务，首先安装 dotenv 扩展包，用来读取.env环境变量。
	然后创建两个服务 app.service.ts 与 b.service.ts

```Typescript
import { config } from 'dotenv';

//读取.env 到 process.env 环境变量中
config({ path: path.join(__dirname, '../.env') });

const appService = {
  provide: AppService,
  useClass: process.env.NODE_ENV === 'development' ? AppService : bService,
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [appService],
})
export class AppModule {}

```

$$不使用dotenv扩展包的话需要手动readFile然后根据\n拆分，循环放入process.env[key]，太麻烦.$$

>工厂函数

	对于复杂要求的provider，我们就可以使用 useFactory 工厂函数进行提供者注册
```Typescript
class XjClass {
  make() {
    return 'this is XjClass Make Method'
  }

@Module({
  providers: [
    AuthService,
    XjClass,
    {
      provide: 'HD',
      //依赖注入其他提供者,将做为参数传递给 useFactory 方法
      inject: [XjClass],
      useFactory: (xjClass) => {
        return xjClass.make()
      },
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
```