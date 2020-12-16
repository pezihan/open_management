# open_management

## 介绍

**本项目配套后端Server项目索引：[open_management 配套的服务器 API 项目](https://github.com/pezihan/open_Server)**

open订单管理系统

后端下载克隆地址：

`git clone https://github.com/pezihan/open_Server.git`



### 安装

```
# 克隆项目
git clone https://github.com/pezihan/open_management.git

# 进入项目目录
cd open_management

# 安装依赖
npm install

# 本地开发 启动项目
npm run serve
```



### 目录结构

```js
- src //开发目录
  - asset // 存放静态文件
    - css
		- global.css // 公用css样式文件
    - font // 存放第三方图标文件
  - components // 公共组件页面
    - Home 
    - Login
    - Paging
    - Popupbox
    - Welcome
  -plugins
	-element.js // ui组件按需导出模块
  - router // 动态路由
  - App.vue
  - main-dev.js //入口文件

- .browserslistrc // 指定打包的代码对哪些浏览器支持
- .editorconfig // 代码规范
- .eslintrc.js // eslint配置文件
- babel.config.js // 插件配置
- package.json //项目信息文件
- vue.config.js //自定义webpack配置文件
```
