import Vue from 'vue'
import Vuex, { ModuleTree } from 'vuex'
import { auth } from './modules/auth'
import { files } from './modules/files'
import { AuthState } from '../interfaces/auth';
import { FilesState } from '../interfaces/files';
Vue.use(Vuex);

export interface State {
    auth: AuthState,
    files: FilesState,
}

const modules: ModuleTree<State> = {
    'auth': auth,
    'files': files,
}

export default new Vuex.Store({
    modules
})
