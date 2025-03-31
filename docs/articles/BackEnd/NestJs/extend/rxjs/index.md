# RxJS

>>RxJS 是一个组织异步逻辑的库，它有很多 operator(运算程序)，可以极大的简化异步逻辑的编写。它是由数据源产生数据，经过一系列 operator 的处理，最后传给接收者。这个数据源叫做 observable。

```ts
import { of, filter, map } from 'rxjs';

of(1, 2, 3)
.pipe(map((x) => x * x))
.pipe(filter((x) => x % 2 !== 0))
.subscribe((v) => console.log(`value: ${v}`));
// 1,9
```

rxjs很多operator是很容易都可以实现的，但是他的种类全，代码稳定，所以处理异步逻辑的时候，尽量使用rxjs。

## map
>
>使用 map operator 来对 controller 返回的数据做一些修改：

```ts
@Injectable()
export class MapTestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => {
      return {
        code: 200,
        message: 'success',
        data
      }
    }))
  }
}
```

## tap
>
>使用tap operator来添加一些日志,缓存等数据逻辑

```ts
@Injectable()
export class TapTestInterceptor implements NestInterceptor {
  constructor(private appService: AppService) {}

  private readonly logger = new Logger(TapTestInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        // 这里是更新缓存的操作，这里模拟下
        this.appService.getHello();
        this.logger.log(`log something`, data);
      }),
    );
  }
}

```

::: tip
这里明明不用map的原因是

1. map会改变数据的类型，而tap不会
2. map是在数据返回前执行一些副作用，tap只是单纯记录日志等操作不会改变数据
:::

## catchError

>controller可能会抛出一些错误，这些错误会被exception filter处理，但是到达之前还可以用Interception中使用catchError先处理下

```ts
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class CatchErrorTestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CatchErrorTestInterceptor.name)

  intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError(err => {
      this.logger.error(err.message, err.stack)
      return throwError(() => err)
    }))
  }
}

```

## timeout
>
> 处理接口长时间没响应

```ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from '@nestjs/common';
import { catchError, Observable, throwError, timeout, TimeoutError } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(3000),
      catchError(err => {
        if(err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      })
    )
  }
}
```

timeout 操作符会在 3s 没收到消息的时候抛一个 TimeoutError。

然后用 catchError 操作符处理下，如果是 TimeoutError，就返回 RequestTimeoutException，这个有内置的 exception filter 会处理成对应的响应格式。

## 总结

rxjs 是处理异步逻辑的库，特点是操作符多operator，可以组合多个operator使用，不需要自己写。

nest的interceptor就用了rxjs处理响应，常用的如下

tap: 不修改响应数据，执行一些额外逻辑，比如记录日志、更新缓存等
map：对响应数据做修改，一般都是改成 {code, data, message} 的格式
catchError：在 exception filter 之前处理抛出的异常，可以记录或者抛出别的异常
timeout：处理响应超时的情况，抛出一个 TimeoutError，配合 catchErrror 可以返回超时的响应
总之，rxjs 的 operator 多，但是适合在 nest interceptor 里用的也不多。

此外，interceptor 也是可以注入依赖的，你可以通过注入模块内的各种 provider。

全局 interceptor 可以通过 APP_INTERCEPTOR 的 token 声明，这种能注入依赖，比 app.useGlobalInterceptors 更好。

interceptor 是 nest 必用功能
