# Reflect.defineMetadata

::: tip
Nest中使用的是Reflect.defineMetadata来实现@Module,@Controller,@Injectable,@Get等装饰器的功能
它的作用是在类上定义元数据
:::

**use**

```ts
// 如果设置了propertyKey,还可以再具体的属性上定义元数据.单独为某个属性设置元数据。
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
Reflect.getMetadata(metadataKey, target);
```

元数据存放在哪里？
存在类或者对象上呀，如果给类或者类的静态属性添加元数据，那就保存在类上，如果给实例属性添加元数据，那就保存在对象上，用类似 [[metadata]] 的 key 来存的。

```ts
// 定义一个装饰器函数，用于添加元数据到类或属性上
function MyMetadata(metadataValue: any) {
    return Reflect.metadata('myMetadataKey', metadataValue);
}

// 使用装饰器给类添加元数据
@MyMetadata('Metadata for the entire class')
class Example {
   // 使用装饰器给属性添加元数据
   @MyMetadata('Metadata for the property')
   propertyWithMetadata: string = '';
}

// 获取类的元数据
const classMetadata = Reflect.getMetadata('myMetadataKey', Example);
console.log('Class Metadata:', classMetadata);

// 获取属性的元数据
const propertyMetadata = Reflect.getMetadata('myMetadataKey', new Example(), 'propertyWithMetadata');
console.log('Property Metadata:', propertyMetadata);

```

# Nest的装饰器基本都是使用Reflect.metadata实现的

>>这就是 nest 的核心实现原理：通过装饰器给 class 或者对象添加 metadata，并且开启 ts 的 emitDecoratorMetadata 来自动添加类型相关的 metadata，然后运行的时候通过这些元数据来实现依赖的扫描，对象的创建等等功能。

Nest 的装饰器都是依赖 reflect-metadata 实现的，而且还提供了一个 @SetMetadata 的装饰器让我们可以给 class、method 添加一些 metadata

TODO <https://juejin.cn/book/7226988578700525605/section/7235075295521275965?enter_from=course_center&utm_source=course_center>
