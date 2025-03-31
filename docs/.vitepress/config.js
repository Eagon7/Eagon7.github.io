module.exports = {
  title: "Eagon Home",
  base: "/",
  head: [["link", { rel: "icon", href: "/docs/public/react_ts.svg" }]],
  lastUpdated: true, // 文章最后更新时间
  description: "https://github.com/Eagon7/Eagon7.github.io",
  themeConfig: {
    outline: [2, 3],
    siteTitle: "Eagon Ellington-", //左上角的名字
    logo: "/prisma.jpg", //左上角的logo,注意：它的路径是从public文件夹开始的，所以这里引用的是public/logo.jpg这张图
    nav: [
      {
        text: "前端", //导航标签的名字
        items: [
          //这种格式是有下拉菜单的版本
          { text: "JavaScript", link: "/articles/FontEnd/js/" }, //text代表每一项的名字，link是连接的位置
          { text: "Vue", link: "/articles/FontEnd/vue/" },
          { text: "typescript", link: "/articles/FontEnd/typescript/" },
          {
            text: "React",
            link: "/articles/FontEnd/react/",
          },
          {
            text: "Electron",
            link: "/articles/FontEnd/electron/base.md",
          },
        ],
      },
      {
        text: "个人项目",
        items: [
          {
            text: "代码片段APP",
            link: "/articles/FontEnd/snippet/requirement.md",
          },
        ],
      },
      {
        text: "other", //导航标签的名字
        items: [
          { text: "其他笔记", link: "/otherArticles/" }, //text代表每一项的名字，link是连接的位置
        ],
      },
      {
        text: "后端",
        items: [{ text: "NestJS", link: "/articles/BackEnd/NestJs/" }],
      },
      {
        text: "算法",
        items: [
          { text: "前置知识", link: "/articles/algorithm/base/index" },
          {
            text: "算法积累笔记",
            link: "/articles/algorithm/accumulate/index",
          },
        ],
      },
      {
        text: "设计模式",
        link: "/articles/designModel/index",
      },
      {
        text: "英语",
        items: [
          { text: "英语语法", link: "/articles/English/grammar/" },
          // { text: "英语单词", link: "/articles/English/word/" },
        ],
      },
    ],
    sidebar: {
      "/articles/English/grammar/": [
        {
          text: "verb动词",
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: "英语语法",
              link: "/articles/English/grammar/",
            },
          ],
        },
      ],
      "/articles/designModel/": [
        {
          text: "设计模式",
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: "前言",
              link: "/articles/designModel/",
            },
            {
              text: "IOC DI",
              link: "/articles/designModel/IOCDI/",
            },
          ],
        },
      ],
      "/articles/FontEnd/vue/": [
        {
          items: [
            {
              text: "123",
              link: "/articles/FontEnd/vue/base/index",
            },
          ],
        },
      ],
      "/articles/FontEnd/js/": [],
      "/articles/FontEnd/typescript/": [
        {
          items: [
            {
              text: "函数相关",
              link: "/articles/FontEnd/typescript/func",
            },
          ],
        },
      ],
      "/articles/FontEnd/react/": [
        {
          text: "React basic",
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: "React Props",
              link: "/articles/FontEnd/react/props/",
            },
            {
              text: "React Hooks",
              link: "/articles/FontEnd/react/Hooks/",
            },
            {
              text: "React LifeCycle",
              link: "/articles/FontEnd/react/lifeCycle/",
            },
            {
              text: "React Ref",
              link: "/articles/FontEnd/react/ref/",
            },
            {
              text: "React Context",
              link: "/articles/FontEnd/react/context/",
            },
            {
              text: "React HOC",
              link: "/articles/FontEnd/react/HOC/",
            },
            {
              text: "React RenderOptimized",
              link: "/articles/FontEnd/react/render/",
            },
          ],
        },
        {
          text: "React Storage",
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: "React Storage前言",
              link: "/articles/FontEnd/react/Storage/",
              items: [
                {
                  text: "Jotai",
                  link: "/articles/FontEnd/react/Storage/jotai/",
                },
                {
                  text: "Redux",
                  link: "/articles/FontEnd/react/Storage/redux/",
                },
              ],
            },
          ],
        },
        {
          text: "React Router",
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: "React Router",
              link: "/articles/FontEnd/react/ReactRouter/",
            },
          ],
        },
        {
          text: "React Query",
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: "React Query",
              link: "/articles/FontEnd/react/ReactQuery/",
            },
          ],
        },
      ],
      "/articles/algorithm/base": [
        {
          text: "复杂度",
          collapsible: true,
          collapsed: true,
          items: [
            { text: "前言", link: "/articles/algorithm/base/index" },
            { text: "时间复杂度", link: "/articles/algorithm/base/time" },
          ],
        },
      ],
      "/articles/BackEnd/NestJs": [
        {
          text: "前置",
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: "http数据传输的几种方式",
              link: "/articles/BackEnd/NestJs/http/",
            },
            {
              text: "Provider",
              link: "/articles/BackEnd/NestJs/provider/",
            },
            {
              text: "Module and LifeCycle",
              link: "/articles/BackEnd/NestJs/module/",
            },
            {
              text: "AOP and Example",
              link: "/articles/BackEnd/NestJs/AOP/",
            },
            {
              text: "decorator",
              link: "/articles/BackEnd/NestJs/decorator/",
            },
            {
              text: "Exception Handler",
              link: "/articles/BackEnd/NestJs/exception/",
            },
            {
              text: "makeDecorator",
              link: "/articles/BackEnd/NestJs/makeDecorator/",
            },
            {
              text: "ReflectMetaData",
              link: "/articles/BackEnd/NestJs/ReflectMetaData/",
            },
            {
              text: "Circular Dependency",
              link: "/articles/BackEnd/NestJs/circularDep/",
            },
            {
              text: "Dynamic Module",
              link: "/articles/BackEnd/NestJs/dynamicModule/",
            },
          ],
        },
        {
          text: "必要操作",
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: "rxjs和interceptor",
              link: "/articles/BackEnd/NestJs/extend/rxjs/",
            },
            {
              text: "pipe",
              link: "/articles/BackEnd/NestJs/extend/pipe/",
            },
            {
              text: "PostPipe",
              link: "/articles/BackEnd/NestJs/extend/postpipe/",
            },
            {
              text: "ExpressUpload Multer --TODO",
              link: "/articles/BackEnd/NestJs/extend/expressUpload/",
            },
            {
              text: "NestUpload Multer ",
              link: "/articles/BackEnd/NestJs/extend/nestUpload/",
            },
          ],
        },
      ],
      "/articles/FontEnd/snippet/": [
        {
          text: "需求分析",
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: "需求分析",
              link: "/articles/FontEnd/snippet/requirement",
            },
          ],
        },
      ],
      "/articles/FontEnd/electron/": [
        {
          text: "介绍",
          collapsible: true,
          collapsed: true,
          items: [
            {
              text: "语言场景",
              link: "/articles/FontEnd/electron/base.md",
            },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/eagon7" }], //右上角的社交标签，支持多种icon，具体可以查询官网，反正没有QQ和微信，放个git差不多意思意思就行了
  },
  markdown: {
    // lineNumbers: true, //代码块显示行号
  },
};
