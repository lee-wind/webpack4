export default [
    {
        path: '/homepage',
        name: 'homepage',
        component: () => import('../../views/homepage/homepage'),
        meta: {
            title: '首页',
            auth: true
        }
    }
]
