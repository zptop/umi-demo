const routes = [
    { path: '/login', component: './user/login.js' },
    { path: '/registed', component: './user/registed.tsx' },
    {
        path: '/',
        component: '../layouts',
        wrappers: ['@/wrappers/auth'],
        routes: [
            {
                path: '/car',
                routes: [
                    {
                        path: '/car/index',
                        component: './car/index'
                    },
                    {
                        path: '/car/form',
                        component: './car/form'
                    }
                ]
            },
            {
                path: '/ship',
                routes: [
                    {
                        path: '/ship/index',
                        component: './ship/index'
                    },
                    {
                        path: '/ship/form',
                        component: './ship/form'
                    }
                ]
            },
            {
                path: '/invoice',
                routes: [
                    {
                        path: '/invoice/car',
                        component: './invoice/car'
                    },
                    {
                        path: '/invoice/ship',
                        component: './invoice/ship'
                    }
                ]
            }
        ]
    }
];
export default routes;