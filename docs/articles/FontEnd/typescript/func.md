# 函数相关

## 声明

```typescript
const foo = (name:string):number=>{}
//  或
type FuncFoo = (name:string) =>number 
const foo:FuncFoo = (name)=>{return 1}
```

## 重载

### 场景
>
> 函数可能有多组入参类型和返回值类型则需要为多组不同的情况适配不同的函数类型声明(签名)
> 根据多种不同入参类型和返回值适配不同的函数签名

``` typescript
type refuse ='不符合条件'
function foo(sex:string,signUp:'已报名')
function foo(sex:string,signUp:'未报名')
function foo(sex:string,signUp:'已报名' | '未报名'):Boolean|refuse{
    if(sex && signUp =='已报名')return true
    if(!sex) return '不符合条件'
    return false

}
```

### 作用

基于重载能力,可以
