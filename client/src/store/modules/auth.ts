import Vuex, { Module } from 'vuex'
import { DefineActions, DefineGetters, DefineMutations } from "vuex-type-helper";
import { State, Getters, Mutations, Actions } from '../../interfaces/auth';
import { login, register, getSelf } from '../../connectors/auth';
import Axios from 'axios';

const state: State = {
    user: undefined,
    pending: false,
};

const getters: DefineGetters<Getters, State> = {
    user: state => state.user,
    isLoggedIn: state => !!state.user,
    isLoggingIn: state => state.pending,
};

const mutations: DefineMutations<Mutations, State> = {
    setPending(state, pending) {
        state.pending = pending;
    },
    setUser(state, user) {
        state.user = user;
    },
};

const actions: DefineActions<Actions, State, Mutations, Getters> = {
    async login({ commit , dispatch }, { username, password }) {
        commit('setPending', true);
        try {
            const token = await login({ username, password });
            if(!token) throw 'Error: Invalid Token';
            localStorage.setItem('token', token);
            return await dispatch("authenticate", {});
        } catch(err) {
            commit('setPending', false);
            throw err;
        }
    },
    async register({ commit, dispatch }, { username, password }) {
        commit('setPending', true);
        try {
            const token = await register({ username, password });
            if(!token) throw 'Error: Invalid Token';
            localStorage.setItem('token', token);
            return await dispatch("authenticate", {});
        } catch(err) {
            commit('setPending', false);
            throw err;
        }
    },
    async authenticate({ commit, state }) {
        commit('setPending', true);
        try {
            const token = localStorage.getItem('token');
            if(!token) return false;
            Axios.defaults.headers.common['authentication'] = token;
            const user = await getSelf();
            if(user) commit('setUser', user);
            return !!user;
        } catch(err) {
            return false;
        } finally {
            commit('setPending', false);
        }
    },
    async logout({ commit }) {
        localStorage.removeItem('token');
        commit('setUser', undefined);
    },
};

export const auth: Module<State, State> = {
    namespaced: true,
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations,
};
