export default {
  targets: {
    //配置浏览器最低版本
    ie: 11,
  },
  hash: true, //开启打包文件的hash值后缀
  treeShaking: true, //去除那些引用的但却没有使用的代码
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: true, //开启dva功能
        antd: true, //开启ant design功能
        dynamicImport: {
          //实现路由级的动态加载
          webpackChunkName: true, //实现有意义的异步文件名
        },
        dva: {
          dynamicImport: true, //是否启用按需加载
          hmr: true, //是否启用 dva 的 热更新
        },
        dll: {
          exclude: [],
          include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch', 'antd/es'],
        },
        //约定式路由时才需引用，用于忽略指定文件夹中自动生成的路由
        routes: {
          exclude: [
            /components\//,
            /model\.(j|t)sx?$/,
            /components\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /models\//,
            /services\//,
          ],
        },
      },
    ],
  ],
  baseUrl: {
    dev: 'http://local-invoice.ship56.net',
    pro: '/',
  },
};
