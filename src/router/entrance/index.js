export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('../../views/entrance/login'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../../views/entrance/register'),
        meta: {
            title: '注册'
        }
    },
    {
        path: '/forgetPassword',
        name: 'forgetPassword',
        component: () => import('../../views/entrance/forgetPassword'),
        meta: {
            title: '找回密码'
        }
    }
]
