import Vue from 'vue';
import store from './store';
import router from './router';
import App from './components/App';
import { sync } from 'vuex-router-sync';

sync(store, router);

new Vue({
    store,
    router,
    el: '#app',
    render: h => h(App),
});
