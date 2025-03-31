# post中的pipe

:::tip
> Get请求中需要pipe验证，Post请求中使用dto+validate验证

:::
>>post 请求的数据是通过 @Body 装饰器来取，并且要有一个 dto class 来接收：（dto 是 data transfer object，数据传输对象的意思）

```ts
@Post('/create')
create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

## pipe结合class-validator进行验证

::: code-group

```ts [MyValidationPipe.dto.ts]
import { IsInt } from 'class-validator'
export class MyValidationPipeDto{
    @IsInt({message:'年龄必须是整数'})
    age:number

}
```

```ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class MyValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value
    }
    const object = plainToInstance(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      throw new BadRequestException('参数验证失败')
    }
    return value
  }
}
```

```ts [controller]
@Post()
aaa(@Body(new MyValidationPipe()) body: MyValidationPipeDto) {
  return body
}
```

:::

1. 首先创建一个 dto class，用来接收数据,并使用class-validator进行验证,@IsInt()会被放到dto class的原型属性上
2. 当请求进入controller时，会使用MyValidationPipe进行验证
3. MyValidationPipe中会使用plainToInstance将文本对象数据转为dto class对象，拿到定义的验证规则，然后使用class-validator进行验证
