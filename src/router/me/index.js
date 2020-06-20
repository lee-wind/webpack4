export default [
    {
        path: '/me',
        name: 'me',
        component: () => import('../../views/me/me'),
        meta: {
            title: '个人中心',
            auth: true
        }
    },{
        path: '/me/inviteFriends',
        name: 'inviteFriends',
        component: () => import('../../views/me/inviteFriends/inviteFriends'),
        meta: {
            title: '邀请好友',
            auth: true
        }
    },{
        path: '/me/messageCenter',
        name: 'messageCenter',
        component: () => import('../../views/me/messageCenter/messageCenter'),
        meta: {
            title: '消息中心',
            auth: true,
            keepAlive: true
        }
    },{
        path: '/me/language',
        name: 'language',
        component: () => import('../../views/me/language/language'),
        meta: {
            title: '切换语言',
            auth: true
        }
    },{
        path: '/me/form',
        name: 'form',
        component: () => import('../../views/me/form/form'),
        meta: {
            title: '表单操作',
            auth: true
        }
    },{
        path: '/me/DApp',
        name: 'form',
        component: () => import('../../views/me/DApp/DApp'),
        meta: {
            title: 'DApp',
            auth: true
        }
    },{
        path: '/me/avatar',
        name: 'avatar',
        component: () => import('../../views/me/avatar/avatar'),
        meta: {
            title: 'avatar',
            auth: true
        }
    }
]
