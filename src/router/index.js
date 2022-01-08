import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Image from '@/views/image'

Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        component: Layout,
        children: [{
                path: '',
                name: 'home',
                component: Home
            },
            {
                path: '/article',
                name: 'article',
                component: Article
            },
            {
                path: '/publish',
                name: 'publish',
                component: Publish
            },
            {
                path: '/image',
                name: 'image',
                component: Image
            }
        ]

    }

]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    // console.log('222');
    // console.log(to);
    // console.log(from);
    const user = JSON.parse(window.localStorage.getItem('user'))


    if (to.path !== '/login') {
        //拦截
        if (user) {
            next()

        } else {
            next('/login')
        }
    } else {
        next()

    }
    // 允许通过
})

export default router