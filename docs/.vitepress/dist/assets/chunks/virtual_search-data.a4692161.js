const e={map:'[{"resume":["0.0"],"前置":["2.0"],"时间复杂度":["3.0"],"js":["4.0"],"nest主要设计模式":["5.0"],"dependency":["5.1"],"inversion":["5.2"],"好处":["5.3"],"如何控制反转":["5.4"],"案例":["5.5"],"设计模式":["6.0"],"nestjs":["7.0"],"react":["8.0"],"asdasd":["9.0"],"发布订阅":["10.0"],"myindex":["11.0"],"记录和楠楠的日常生活":["12.0"],"我们的故事":["13.0"]},{"1":["5.3"],"injection":["5.1"],"依赖注入":["5.1"],"typescript":["5.1","5.5"],"class":["5.1","5.5"],"userservice":["5.1"],"getlist":["5.1","5.5"],"id":["5.1"],"获取用户的逻辑":["5.1"],"controller":["5.1"],"constructor":["5.1"],"this":["5.1"],"of":["5.2"],"控制反转需要的条件如下":["5.4"],"abstract":["5.5"],"service":["5.5"],"void":["5.5"],"putlist":["5.5"],"layout":["14.0"]},{"1":["5.4"],"service":["5.1"],"new":["5.1"],"read":["5.1"],"处理用户数据的逻辑":["5.1"],"const":["5.1"],"result":["5.1"],"control":["5.2"],"解耦和模块化":["5.3"],"container":["5.5"],"创建一个变量存贮依赖项":["5.5"],"private":["5.5"],"dependencies":["5.5"],"key":["5.5"],"string":["5.5"],"false":["14.0"]},{"2":["5.3"],"js":["5.1"],"export":["5.1"],"default":["5.1"],"data":["5.1"],"return":["5.1"],"msg":["5.1"],"focused":["5.1"],"code":["5.1"],"focus":["5.1"],"此时controller":["5.1"],"和":["5.1"],"存在了强耦合的关联":["5.1"],"控制反转":["5.2"],"需要一个管理容器":["5.4"],"container":["5.4"],"any":["5.5"],"注册方法":["5.5"],"register":["5.5"],"dependency":["5.5"],"this":["5.5"]},{"2":["5.4"],"无法复用":["5.1"],"若我们想用authservice时必须新注册一个类来实现":["5.1"],"并且需要改动getuser里面的代码":["5.1"],"那我们此时就需要解决这个问题":["5.1"],"使用di":["5.1"],"依赖是service":["5.1"],"依赖的标准需要拥有一个getlist方法":["5.1"],"并且接收一个id":["5.1"],"控制反转的本质就是降低耦合度":["5.2"],"更方便的依赖注入":["5.3"],"解析方法":["5.5"],"resolve":["5.5"],"if":["5.5"],"page":["14.0"]},{"3":["5.3","5.4"],"不再强依赖一些属性和方法":["5.2"],"具体的实现方式是di依赖注入":["5.2"],"容器需要拥有register方法用来管理容器的注册":["5.4"],"return":["5.5"],"throw":["5.5"],"team":["14.0"]},{"实际使用":["5.1"],"abstract":["5.1"],"get":["5.1"],"authservice":["5.1"],"xxx":["5.1"],"控制反转需要一个容器":["5.2"],"配置集中管理":["5.3"],"容器需要有一个解析的方法":["5.4"],"new":["5.5"],"error":["5.5"],"依赖":["5.5"],"未被注册到容器":["5.5"],"请先注册到容器再去使用":["5.5"],"const":["5.5"]},{"instance":["5.1"],"constroller":["5.1"],"这个容器接手类的控制权":["5.2"],"从容器中解析已注册的依赖项并注入":["5.4"],"让所有的依赖项统一管理注册解耦了对象之间的强依赖关系":["5.4"],"authservice":["5.5"]},{"此时我们的constroller与service解耦":["5.1"],"具体调用的方法完全取决于外部依赖注入进来的方法":["5.1"],"可扩展性":["5.1"],"解耦":["5.1"],"可测试性":["5.1"],"controller":["5.5"]}]'},t={"0.0":{t:"<resume/>",p:"",l:"Resume/index.html",a:"resume"},"2.0":{t:"前置",p:"",l:"articles/algorithm/base/index.html",a:"前置"},"3.0":{t:"时间复杂度",p:"",l:"articles/algorithm/base/time.html",a:"时间复杂度"},"4.0":{t:"js",p:"",l:"articles/basic/index.html",a:"js"},"5.0":{t:"# Nest主要设计模式",p:"",l:"articles/designModel/IOCDI/index.html",a:"nest主要设计模式"},"5.1":{t:"Dependency Injection 依赖注入",p:`class UserService {
  getList(id) {
    // 获取用户的逻辑 
  }
}

class Controller {
  constructor() {
     ...`,l:"articles/designModel/IOCDI/index.html#dependency-injection-依赖注入",a:"dependency-injection-依赖注入"},"5.2":{t:"Inversion of Control  控制反转",p:`控制反转的本质就是降低耦合度，不再强依赖一些属性和方法。具体的实现方式是DI依赖注入
控制反转需要一个容器，这个容器接手类的控制权
`,l:"articles/designModel/IOCDI/index.html#inversion-of-control-控制反转",a:"inversion-of-control-控制反转"},"5.3":{t:"好处",p:`
解耦和模块化
更方便的依赖注入
配置集中管理

`,l:"articles/designModel/IOCDI/index.html#好处",a:"好处"},"5.4":{t:"如何控制反转",p:`控制反转需要的条件如下

需要一个管理容器  Container
容器需要拥有register方法用来管理容器的注册
容器需要有一个解析的方法 （从容器中解析已注册的依赖项并注入)
让所有的依赖项统一 ...`,l:"articles/designModel/IOCDI/index.html#如何控制反转",a:"如何控制反转"},"5.5":{t:"案例",p:`  abstract class Service {
    getList: () =&gt; void;
    putList: () =&gt; void;
  }

  class Cont ...`,l:"articles/designModel/IOCDI/index.html#案例",a:"案例"},"6.0":{t:"设计模式",p:"",l:"articles/designModel/index.html",a:"设计模式"},"7.0":{t:"# NestJs",p:"",l:"articles/nestjs/index.html",a:"nestjs"},"8.0":{t:"react",p:"",l:"articles/react/index.html",a:"react"},"9.0":{t:"asdasd",p:"",l:"articles/vue/first/index.html",a:"asdasd"},"10.0":{t:"发布订阅",p:"",l:"articles/vue/first/model.html",a:"发布订阅"},"11.0":{t:"<myIndex/>",p:"",l:"index.html",a:"myindex"},"12.0":{t:"# 记录和楠楠的日常生活",p:"",l:"nannan/index.html",a:"记录和楠楠的日常生活"},"13.0":{t:"# 我们的故事",p:"",l:"nannan/story/index.html",a:"我们的故事"},"14.0":{t:"<!-- ---",p:`layout :  false
layout: page
&lt;team/&gt; --&gt;
`,l:"team/index.html",a:""}},n={previewLength:100,buttonLabel:"搜索",placeholder:"情输入关键词",allow:[],ignore:[]},s={INDEX_DATA:e,PREVIEW_LOOKUP:t,Options:n};export{s as default};
