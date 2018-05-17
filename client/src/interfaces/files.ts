export interface IItem {
    id?: string;
    type: string;
    directory?: string;
}

export interface IFile extends IItem {
    title: string;
    mimetype?: string;
    extension?: string;
}

export interface IFolder extends IItem {
    title?: string;
    content?: IItem[];
}

export interface FilesState {
    socket?: SocketIOClient.Socket;
    folder?: IFolder;
    file?: IFile;
}

export interface Getters {
    currentFile: IFile,
    currentFolder: IFolder,
}

export interface Mutations {
    setFile: IFile,
    addFile: IFile,
    removeFile: IFile,
    setFolder: IFolder,
    addFolder: IFolder,
    removeFolder: IFolder,
    setSocket: SocketIOClient.Socket,
}

export interface Actions {
    uploadFiles: FormData,
    fetchFile: string,
    updateFile: IFile,
    removeFile: string,
    downloadFile: string,
    fetchFolder?: string,
    updateFolder: IFolder,
    createFolder: IFolder,
    removeFolder: string,
}
