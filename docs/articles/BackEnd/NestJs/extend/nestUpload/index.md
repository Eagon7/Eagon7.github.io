# NestJs Upload

[[!大文件分片上传]]

需要先把multer的类型文件安装上

```ts
npm install @types/multer
```

## 基础上传

```ts
@Post()
@UseInterceptors(FileInterceptor('example'))
upload(@UploadedFile() file:Express.Multer.File,@Body() body:any){
  console.log('file', file);
}
```

## 上传流程

::: tip 上传流程

- 请求到达路由前被interceptor,拦截器会把文件保存到req.file上
- 请求到达路由后，req.file会被装饰器@UploadedFile()装饰，装饰器会把req.file的值赋给file
- 请求到达路由后，req.body会被装饰器@Body()装饰，装饰器会把req.body的值赋给body
:::

## 可接收多文件

- FileInterceptor -> FileFieldsInterceptor
- UploadedFile -> UploadedFiles

```ts
@Post()
@UseInterceptors(FilesInterceptor('example'))
upload(@UploadedFiles() file:Express.Multer.file,@Body() body:any){
  console.log('file', file);
}
```

## 指定多字段用来保存file

```ts
  @Post()
  @UseInterceptors(// [!code ++]
    FileFieldsInterceptor(// [!code ++]
      [ // [!code ++]
        { name: 'aaa', maxCount: 2 },// [!code ++]
        { name: 'bbb', maxCount: 3 },// [!code ++]
      ], // [!code ++]
      {
        dest: 'uploads',
      },
    ),
  )

  upload( 
    @UploadedFiles()// [!code ++]
    files: { aaa?: Express.Multer.File[]; bbb?: Express.Multer.File[] },
    @Body() body,
  ) {
    console.log('body', body)
    console.log('files', files)
  }
```

## 字段名不固定，自动分析

```ts
@Post('ddd')
@UseInterceptors(AnyFilesInterceptor({ // [!code ++]
    dest: 'uploads' // [!code ++]
}))// [!code ++]
uploadAnyFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log('body', body);
    console.log('files', files);
}
```

## 对文件大小类型进行限制
>
> 使用pipe,添加检查文件大小的逻辑
::: code-group

```ts [controller]
@Post('uploadfile')
@UseInterceptors(FileInterceptor('example',{dest:'uploads'}))
upload(@UploadedFile(FileSizeValidationPipe) file:Express.Multer.File){} // [!code ++]
```

```ts [FileSizeValidationPipe]
import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if(value.size > 10 * 1024) {
      throw new HttpException('文件大于 10k', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
```

:::

### 使用内置的文件管道验证 new ParseFilePipe()

```ts
@Post('fff')
@UseInterceptors(FileInterceptor('aaa', {
    dest: 'uploads'
}))
uploadFile3(@UploadedFile(new ParseFilePipe({ // [!code focus]
    validators: [// [!code focus]
      new MaxFileSizeValidator({ maxSize: 1000 }),// [!code focus]
      new FileTypeValidator({ fileType: 'image/jpeg' }),// [!code focus]
    ],// [!code focus]
})) file: Express.Multer.File, @Body() body) {
    console.log('body', body);
    console.log('file', file);
}
```
