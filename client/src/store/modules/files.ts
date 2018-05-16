import Vue from 'vue';
import { Module } from "vuex";
import { DefineGetters, DefineMutations, DefineActions } from "vuex-type-helper";
import { FilesState, Getters, Mutations, Actions, IFile, IFolder, IItem } from "../../interfaces/files";
import { StorageConnector, DataConnector } from "../../connectors/files";
import { FileEvents } from '../../events/files';
import { State } from "..";

const storageConnector = new StorageConnector();
const dataConnector = new DataConnector();

const eventListner = new FileEvents();

const state: FilesState = {
    socket: null,
    folder: null,
    file: null,
};

const getters: DefineGetters<Getters, FilesState> = {
    currentFile: state => state.file,
    currentFolder: state => state.folder,
};

const mutations: DefineMutations<Mutations, FilesState> = {
    setSocket(state, socket){
        state.socket = socket;
    },
    setFile(state, file){
        state.file = file;
    },
    addFile(state, file: IFile){
        if(file.directory === state.folder.id || (!file.directory && !state.folder.id)) {
            state.folder.content.push(file);
        }
    },
    removeFile(state, file){
        if(file.directory === state.folder.id){
            let content = state.folder.content;
            for(let i = 0; i < content.length; i++){
                if(file.id === content[i].id) {
                    state.folder.content.splice(i,1);
                    break;
                }
            }
        }
    },
    setFolder(state, folder){
        state.folder = folder;
    },
    addFolder(state, folder){
        if(folder.directory === state.folder.id){
            state.folder.content.push(folder);
        }
    },
    removeFolder(state, folder){
        if(folder.directory === state.folder.id){
            const index = state.folder.content.indexOf(folder);
            state.folder.content.splice(index,1);
        }
    },
};

const actions: DefineActions<Actions, FilesState, Mutations, Getters> = {
    async downloadFile({ commit , dispatch }, id) {
        const file = await storageConnector.download(id);
        console.log(file);
        console.log(file.type);
        return new Blob([file]);
    },
    async uploadFiles({ commit , dispatch }, form) {
        await storageConnector.upload(form);
    },
    async fetchFile(store, id){
        store.commit('setFolder', null);
        store.commit('setFile', null);
        let file: IFile = await dataConnector.getFile(id);
        store.commit('setFile', file);
        eventListner.fileEvents(store, id);
    },
    async updateFile({ commit , dispatch }, file){
        return await dataConnector.updateFile(file);
    },
    async removeFile({ state, commit , dispatch }, id){
        return await dataConnector.removeFile(id);
    },
    async fetchFolder(store, id){
        store.commit('setFolder', null);
        store.commit('setFile', null);
        const folder: IFolder = await dataConnector.getFolder(id);
        store.commit('setFolder', folder);
        eventListner.folderEvents(store, id);
    },
    async createFolder({ commit , dispatch }, folder){
        return await dataConnector.createFolder(folder);
    },
    async updateFolder({ commit , dispatch }, folder){
        return await dataConnector.updateFolder(folder);
    },
    async removeFolder({ commit , dispatch }, id){
        return await dataConnector.removeFolder(id);
    },
};

export const files: Module<FilesState, State> = {
    namespaced: true,
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations,
};
