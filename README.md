## 一汽丰田 WAP 端

> Nuxt.js + Vue.js project

## 使用node及npm版本
> node v10.8.0

> npm 6.2.0

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

使用pm2启动你的nuxt.js：

    $ npm install // or yarn install 如果未安装依赖或依赖有更改
    $ pm2 start npm --name "wap-site" -- run start
    
    $ pm2 stop all   停止


###### cnpm install --save-dev babel-eslint eslint eslint-config-standard eslint-plugin-html eslint-plugin-promise eslint-plugin-standard eslint-plugin-import eslint-plugin-node

###### Standard 标准： 

    https://standardjs.com/readme-zhcn.html
    https://standardjs.com/rules-zhcn.html#javascript-standard-style

###### 自动代码格式化：standard --fix

###### npx eslint --fix ./src/lib/filename.vue 可以修复常见的不合规范的代码，★并自动格式化。即便如此，或许你仍需执行上一个命令来查看有规范问题的代码，并作出手动修改。PS:路径及文件名需要填写完整，npx命令要求npm在@5.2.0以上。

##### 代码格式化：
    npx eslint --fix ./pages/**/*.vue
    npx eslint --fix ./utils/*.js
    npx eslint --fix ./plugins/**/*.js
    npx eslint --fix ./middleware/*.js
    npx eslint --fix ./layout/*.vue
    npx eslint --fix ./filters/*.js
    npx eslint --fix ./extend/html-cdn-loader.js  
    npx eslint --fix ./components/**/*.vue


  // "libraryName": "element-ui",
  // "styleLibraryName": "theme-chalk",

