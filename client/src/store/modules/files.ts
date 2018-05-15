import Vue from 'vue';
import { Module } from "vuex";
import { DefineGetters, DefineMutations, DefineActions } from "vuex-type-helper";
import { FilesState, Getters, Mutations, Actions, IFile, IFolder, IItem } from "../../interfaces/files";
import { download, upload, getFile, getFolder, createFolder, updateFolder, removeFolder, removeFile, updateFile } from "../../connectors/files";
import { createSocket } from "../../connectors/socket";
import { State } from "..";

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
        const file = await download(id);
        return new Blob([file]);
    },
    async uploadFiles({ commit , dispatch }, form) {
        await upload(form);
    },
    async fetchFile({ state, commit , dispatch }, id){
        commit('setFile', null);
        let file = await getFile(id);
        commit('setFile', file);
        let socket = state.socket;
        if(!socket){
            socket = createSocket('/files');
            commit('setSocket', socket);

            socket.on('fileUpdate', (event: any) => {
                let file: IFile = state.file;
                if(file && file.id === event.id) {
                    file = { ...file, ...event };
                    commit('setFile', file);
                } 
            })

            socket.on('fileRemoved', (event: any) => {
                if(state.file && state.file.id === event.id)
                    commit('setFile', null);
            })
        } 
        const token = localStorage.getItem('token');
        socket.emit('file', { token, id });
    },
    async updateFile({ commit , dispatch }, file){
        return await updateFile(file);
    },
    async removeFile({ state, commit , dispatch }, id){
        return await removeFile(id);
    },
    async fetchFolder({ commit, dispatch }, id){
        commit('setFolder', null);
        const folder: IFolder = await getFolder(id);
        commit('setFolder', folder);
        let socket: SocketIOClient.Socket = state.socket;
        if(!socket) {
            socket = createSocket('/files');
            commit('setSocket', socket);

            socket.on('folderCreated', (event: any) => {
                event.type = 'folder';
                commit('addFolder', event);
            })

            socket.on('folderUpdated', (event: any) => {
                let folder: IFolder;
                let dir: IFolder = state.folder;
                console.log(event);
                console.log(dir);
                if(!dir) return;
                if(dir.id === event.id) {
                    folder = { ...dir, ...event };
                    console.log(folder);
                } else if(dir.id === event.directory || (!dir.id && !event.directory)) {
                    for(let i = 0; i < dir.content.length; i++)
                        if(dir.content[i].id === event.id)
                            Vue.set(dir.content, i, { ...dir.content[i], ...event });
                    folder = dir;
                }
                if(!!folder) commit('setFolder', folder);
            });

            socket.on('folderRemoved', (event: any) => {
                let dir: IFolder = state.folder;
                if(!dir) return;
                if(dir.id === event.id) {
                    commit('setFolder', null);
                } else if(dir.id === event.id || (!dir.id && !event.directory)) {
                    for(let item of dir.content)
                        if(item.id === event.id)
                            commit('removeFolder', item);
                }
            });
            
            socket.on('fileCreated', (event: any) => {
                if(!state.folder) return;
                event.type = 'file';
                commit('addFile', event);
            });

            socket.on('fileUpdated', (event: any) => {
                const folder: IFolder = state.folder;
                if(!!folder) {
                    for(let i = 0; i < folder.content.length; i++) {
                        let item = folder.content[i];
                        if(item.id === event.id) {
                            Vue.set(state.folder.content, i, { ...item, ...event });
                            break;
                        }
                    }
                    commit('setFolder', folder);
                }
            });

            socket.on('fileRemoved', (event: any) => {
                let folder: IFolder = state.folder;
                if(!!folder && (event.directory === folder.id || (!event.directory && !folder.id)))
                    commit('removeFile', event);
            });
        }
        
        const token: string = localStorage.getItem('token');
        socket.emit('folder', { token, id });
    },
    async createFolder({ commit , dispatch }, folder){
        return await createFolder(folder);
    },
    async updateFolder({ commit , dispatch }, folder){
        return await updateFolder(folder);
    },
    async removeFolder({ commit , dispatch }, id){
        return await removeFolder(id);
    },
};

export const files: Module<FilesState, State> = {
    namespaced: true,
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations,
};
