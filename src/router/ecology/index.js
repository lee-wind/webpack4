export default [
    {
        path: '/ecology',
        name: 'ecology',
        component: () => import('../../views/ecology/ecology'),
        meta: {
            title: '生态',
            auth: true
        }
    }
]
