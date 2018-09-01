import Vue from 'vue';
import Router from 'vue-router';
import HcDashboard from '@/components/HcDashboard';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/dashboard/:deviceType',
            name: 'dashboard',
            component: HcDashboard,
        },
    ],
});
