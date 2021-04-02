import { defineConfig } from 'umi';
import { theme } from './config/theme.config';
import routes from './src/router/router';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: false,
//   proxy: {
//     '/api': {
//       target: 'http://dev-invoice.ship56.net',
//       pathRewrite: { '^/api': '' },
//       changeOrigin: true,
//       onProxyReq(proxyReq, req, res) {
//         proxyReq.setHeader('Access-WR-Token', window.localStorage.getItem('x-auth-token'));
//       },
//     },
//   },
  theme,
  routes,
});
