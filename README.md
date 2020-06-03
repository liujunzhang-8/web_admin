# vue-manage-system

<a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.8.2-brightgreen.svg" alt="element-ui">
  </a>

基于 Vue + Element UI 的后台管理系统解决方案。

## 项目截图

### 登录

![Image text](https://github.com/lin-xin/manage-system/raw/master/screenshots/wms3.png)


## 前言

该方案作为一套多功能的后台框架模板，适用于绝大部分的后台管理系统（Web Management System）开发。基于 vue.js，使用 vue-cli3 脚手架，引用 Element UI 组件库，方便开发快速简洁好看的组件。
## 功能

-   [x] Element UI
-   [√] 登录/注销
-   [√] 系统首页
-   [√] 系统管理
            - [√] 用户管理
            - [√] 角色管理
            - [√] 菜单管理
            - [√] 参数管理
            - [√] 权限管理
    [√] 模板管理
            - [√] 模板查询
            - [√] 模板参数
            - [√] 模板关键字
-   [√] 短信管理
            - [√] 短信查询
            - [√] 短信发送
            - [√] 短信参数

## 安装步骤

```
git clone https://github.com/liujunzhang-8/changsheng_life.git      // 把模板下载到本地
cd changsheng_life    // 进入模板目录
npm install         // 安装项目依赖，等待安装完成之后，安装失败可用 cnpm 或 yarn

// 开启服务器，浏览器访问 http://localhost:8080
npm run serve

// 执行构建命令，生成的dist文件夹放在服务器下即可访问
npm run build
```

## 组件使用说明与演示

### vue-schart

vue.js 封装 sChart.js 的图表组件。访问地址：[vue-schart](https://github.com/linxin/vue-schart)

<p><a href="https://www.npmjs.com/package/vue-schart"><img src="https://img.shields.io/npm/dm/vue-schart.svg" alt="Downloads"></a></p>

## 其他注意事项

### 一、如果我不想用到上面的某些组件呢，那我怎么在模板中删除掉不影响到其他功能呢？

举个栗子，我不想用 user 这个组件，那我需要分四步走。

第一步：删除该组件的路由，在目录 src/router/index.js 中，找到引入改组件的路由，删除下面这段代码。

```JavaScript
{
    // 富文本编辑器组件
    path: '/user',
    component: resolve => require(['../components/page/User.vue'], resolve)
},
```

第二步：删除引入该组件的文件。在目录 src/components/page/ 删除 User.vue 文件。

第三步：删除该页面的入口。在目录 src/components/common/User.vue 中，找到该入口，删除下面这段代码。

```js
{
	index: 'user',
	title: '用户管理'
},
```

第四步：卸载该组件。执行以下命令：
npm un vue-quill-user -S

完成。