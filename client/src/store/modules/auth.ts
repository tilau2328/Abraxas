import Axios from 'axios';
import Vuex, { Module } from 'vuex'
import { DefineActions, DefineGetters, DefineMutations } from "vuex-type-helper";
import { AuthState, Getters, Mutations, Actions } from '../../interfaces/auth';
import { AuthConnector } from '../../connectors/auth';
import { State } from '..';

const connector = new AuthConnector();

const state: AuthState = {
    user: undefined,
    pending: false,
};

const getters: DefineGetters<Getters, AuthState> = {
    user: state => state.user,
    isLoggedIn: state => !!state.user,
    isLoggingIn: state => state.pending,
};

const mutations: DefineMutations<Mutations, AuthState> = {
    setPending(state, pending) {
        state.pending = pending;
    },
    setUser(state, user) {
        state.user = user;
    },
};

const actions: DefineActions<Actions, AuthState, Mutations, Getters> = {
    async login({ commit , dispatch }, { username, password }) {
        commit('setPending', true);
        try {
            const token = await connector.login({ username, password });
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
            const token = await connector.register({ username, password });
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
            const user = await connector.getSelf();
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

export const auth: Module<AuthState, State> = {
    namespaced: true,
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations,
};
