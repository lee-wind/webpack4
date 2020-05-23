export default [
    {
        path: '/magnetism',
        name: 'magnetism',
        component: () => import('../../views/magnetism/magnetism'),
        meta: {
            title: '励磁矩阵',
            auth: true
        }
    }
]
