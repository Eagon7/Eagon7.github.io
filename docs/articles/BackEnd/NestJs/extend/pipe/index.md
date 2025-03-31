# pipe
>
> pipe是在参数到达handle之前对参数做些验证和转换的Class

::: details 内置的 Pipe 有这些

- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe
- ParseEnumPipe
- ParseFloatPipe
- ParseFilePipe
:::

::: code-group

```ts [普通使用]
@Get()
find(@Query(dto,ParseIntPipe) arg:Record<string,any>){}
```

```ts [自定义返回状态码]
  @Get('a')
  geta(
    @Query('aa', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
    arg: number,
  ) {
    console.log(arg)
  }
```

```ts [抛给Exception Filter处理]
  @Get('b')
  getb(
    @Query(
      'bb',
      new ParseIntPipe({ exceptionFactory: () => new HttpException('xxx' + '错误信息', HttpStatus.ACCEPTED) }),
    )
    arg: number,
  ) {
    console.log(arg)
  }
```

:::

## class-validator

Nestjs提供的Pipe需要使用class-validator来做验证，所以我们需要先安装class-validator

### ParseArrayPipe

```ts
// localhost:3000/example?a=1/2/3
@Get()
find(@Query('a',new ParseArrayPipe({
    items: Number,//转换的类型
    separator:'/',//分隔符
    optional:true,//是否可选
})) ee:Array<number>){}
```

### ParseEnumPipe
>
> 规定参数只能传递枚举中的值,并且会自动转换为枚举类型

```ts
enum Ggg{
    a='1',
    b='2',
    c='3'
}
  @Get('gg/:enum')
  gg(@Param('enum', new ParseEnumPipe(Ggg)) e: Ggg) {
    return e
  }
```

### ParseUUIDPipe
>
> UUID:随机生成不重复的字符串,他有v3,v4,v5版本
只能接受uuid作为param参数才能匹配到参数为uuid格式

```ts
  @Get('hh/:uuid')
  hh(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return uuid
  }
```

### DefaultValuePipe
>
> 设置默认参数,当你没传参数的时候，会使用默认值

```ts

```

## 自定义pipe
>
> nest g pipe aaa --flat --no-spec

```ts
@Injectable()
export class PipeTestPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata)
    return value
  }
}
@param value : 传递来的具体数值
@param metadata:请求元信息
```

## 总结

写Pipe只需实现pipeTransform接口和transform方法，返回值就是传递给handler的值

在 pipe 里可以拿到装饰器和 handler 参数的各种信息，基于这些来实现校验和转换就是很简单的事情了。
