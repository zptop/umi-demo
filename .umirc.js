import { defineConfig } from 'umi';
import { theme } from "./config/theme.config";
import routes from "./src/router/router";
export default defineConfig({
    nodeModulesTransform: {
        type: 'none',
    },
    title: false,
    //   proxy: {
    //     '/api': {
    //       target: 'http://local-invoice.ship56.net',
    //       pathRewrite: { '^/api': '' },
    //       changeOrigin: true
    //     }
    //   },
    theme,
    routes,
});
