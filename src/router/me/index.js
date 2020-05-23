export default [
    {
        path: '/me',
        name: 'me',
        component: () => import('../../views/me/me'),
        meta: {
            title: '个人中心',
            auth: true
        }
    }
]
