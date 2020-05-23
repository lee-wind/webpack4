import Vue from 'vue'
import Router from 'vue-router'

import bus from "../util/bus"

import entrance from './entrance'
import homepage from "./homepage"
import magnetism from "./magnetism";
import ecology from "./ecology";
import me from "./me";

Vue.use(Router);

const router =  new Router({
    routes: [
        {
            path: '/',
            redirect: {
                name: 'homepage'
            }
        },
        ...entrance,
        ...homepage,
        ...magnetism,
        ...ecology,
        ...me,
    ]
});

router.beforeEach((to, from , next) => {

    bus.$alertHide();
    bus.$confirmHide();
    bus.$loadingHide();

    document.title = to.meta.title;

    /*if(to.meta.auth){
        if(!localStorage.getItem('userPhone')){
            return next({
                name: 'login'
            });
        }
    }*/
    next();
});

export default router;
