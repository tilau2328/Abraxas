import Vue from 'vue';
import VueRouter from 'vue-router';
import HomePage from './views/Home';
import LoginPage from './views/auth/Login';
import RegisterPage from './views/auth/Register';
import FilePage from './views/files/File';
import FilesPage from './views/files/Files';
import FolderPage from './views/files/Folder';

Vue.use(VueRouter);

const routes = [
    { path: '/', name: 'Home', component: HomePage, },
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/register', name: 'Register', component: RegisterPage },
    { path: '/files', name: 'Files', component: FilesPage },
    { path: '/files/:id', name: 'File', component: FilePage },
    { path: '/folders/:id', name: 'Folder', component: FolderPage },
];

export default new VueRouter({
    routes
})
