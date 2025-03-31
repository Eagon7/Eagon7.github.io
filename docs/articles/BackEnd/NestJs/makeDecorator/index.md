# 合并装饰器
>
>装饰器太多了，有时候我们需要合并装饰器，这样就可以减少代码量，提高代码可读性。

```ts
import { applyDecorators, Get, UseGuards } from '@nestjs/common';

export function Bbb(path, role) {
  return applyDecorators(
    Get(path),
    Aaa(role),
    UseGuards(AaaGuard)
  )
}

```

## 自定义装饰器

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Ccc = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    return 'ccc';
  },
);
```
