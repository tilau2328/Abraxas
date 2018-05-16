import Vue from 'vue';
import * as io from 'socket.io-client';
import { IFolder, IFile } from '../interfaces/files';
import { SocketConnector } from '../connectors/socket';


export class FileEvents extends SocketConnector {
    private url = 'http://localhost:3000/files';
    private state: { type: string, data: { token: string, id?: string } };

    onReconect(socket: SocketIOClient.Socket) {
        console.log("Reconnect: ", this.state);
        socket.emit(this.state.type, this.state.data);
    }

    fileEvents(store: any, id: string) {
        if(!this.hasSocket) this.connect(this.url);
        if(!this.state || this.state.type !== 'file') 
            this.registerFileEvents(store);
        this.state = { 
            type: 'file', 
            data: { id, token: localStorage.getItem('token') } 
        };
        this.emit('file', this.state.data);
    }

    folderEvents(store: any, id: string) {
        if(!this.hasSocket) this.connect(this.url);
        if(!this.state || this.state.type !== 'folder') 
            this.registerFolderEvents(store);
        
            this.state = { 
                type: 'folder', 
                data: { id, token: localStorage.getItem('token') } 
            };
            this.emit('folder', this.state.data);
    }

    private registerFileEvents(store: any) {
        this.unregisterEventHandlers();
        this.registerEventHandler('fileUpdated', (data) => this.fileUpdated(store, data));
        this.registerEventHandler('fileRemoved', (data) => this.fileRemoved(store, data));
    }

    private registerFolderEvents(store: any) {
        this.registerEventHandler('fileCreated', (data) => this.fileCreated(store, data));
        this.registerEventHandler('fileUpdated', (data) => this.fileUpdated(store, data));
        this.registerEventHandler('fileRemoved', (data) => this.fileRemoved(store, data));
        this.registerEventHandler('folderCreated', (data) => this.folderCreated(store, data));
        this.registerEventHandler('folderUpdated', (data) => this.folderUpdated(store, data));
        this.registerEventHandler('folderRemoved', (data) => this.folderRemoved(store, data));
    }

    private fileCreated(store: any, data: any) {
        let file: IFile = { ...data, type: 'file' };
        if(!!store.state.folder) store.commit('addFile', file);
    }

    private fileUpdated(store: any, data: any) {
        const folder: IFolder = store.state.folder;
        let file: IFile = store.state.file;
        if(!!file && file.id === data.id) {
            file = { ...file, ...data };
            store.commit('setFile', file);
        } 
        if(!!folder && (data.directory === folder.id || (!data.directory && !folder.id))) {
            for(let i = 0; i < folder.content.length; i++) {
                let item = folder.content[i];
                if(item.id === data.id) {
                    Vue.set(store.state.folder.content, i, { ...item, ...data });
                    break;
                }
            }
            store.commit('setFolder', folder);
        }
    }

    private fileRemoved(store: any, data: any) {
        let folder: IFolder = store.state.folder;
        let file: IFolder = store.state.file;
        if(!!folder)
            store.commit('removeFile', data);
        if(!!file && file.id === data.id)
            store.commit('setFile', null);
    }
    
    private folderCreated(store: any, data: any) {
        let folder: IFolder = { ...data, type: 'folder' };
        store.commit('addFolder', folder);
    }

    private folderUpdated(store: any, data: any) {
        let folder: IFolder = store.state.folder;
        if(!folder) return;
        if(folder.id === data.id)
            folder = { ...folder, ...data };
        else if(folder.id === data.directory || (!folder.id && !data.directory)) 
            for(let i = 0; i < folder.content.length; i++)
                if(folder.content[i].id === data.id)
                    Vue.set(folder.content, i, { ...folder.content[i], ...data });
        store.commit('setFolder', folder);
    }
    
    private folderRemoved(store: any, data: any) {
        let folder: IFolder = store.state.folder;
        if(!folder) return;
        if(folder.id === data.id) 
            store.commit('setFolder', null);
        else if(folder.id === data.id || (!folder.id && !data.directory)) 
            for(let item of folder.content)
                if(item.id === data.id)
                    store.commit('removeFolder', item);
    }
}