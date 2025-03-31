> 案例，第三方发送短信服务。 根据不同配置使用不同的第三方运营商
```typescript
sms.serivce.ts
@Injectable()
export class AppController(){
	constructor(){
		private ali:aliService,
		private tencent:tencentServices,
		private sms: SmsService,
	    @Inject(base.KEY) private baseConfig: ConfigType<typeof base>,
	}

	getSmsService(type?:string){
		const service = {
			ali:aliService,
			tencent:tencnetService
		}
		if (type) return privider[type];
	    const curEnv = this.config.get('sms.system_provider');
	    return privider[curEnv] ?? curEnv;
	}

	send(type?:string){
		return this.getSmsProvider(type).send();
	}
}
```

> 使用@nest/config 快速配置env配置

	配置环境文件
```typescript
// config/a.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('base', () => ({
  name: process.env.APP_NAME || 'NestJS',
  age: process.env.APP_AGE || 18,
}));
```

	最终统一导入到config/index.ts，再统一导出
```typescript
// 注册到全局module
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [sms, ...config],
    }),
  ]
```

	使用
```typescript
// app.controller.ts
 @Controller()
 class AppController{
	 constroctor(
	 // 直接注入 传递泛型类型，ConfigType会提供类型
	 @Inject(base.KEY) private baseConfig: ConfigType<typeof base>,
	 ){}
 }
```
