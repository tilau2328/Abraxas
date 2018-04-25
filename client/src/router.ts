import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home';
import Login from './views/auth/Login';
import Register from './views/auth/Register';

Vue.use(VueRouter);

const routes = [
    { path: '/', name: 'Home', component: Home, },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
];

export default new VueRouter({
    routes
})
