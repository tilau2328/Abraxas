<template>
    <div id="files" class="row" >
        <FolderList class="col-md-4" v-bind:folders="folders" />
        <div class="col-md-4">
            <FolderOptions />
            <UploadForm />
        </div>
        <FileList class="col-md-4" v-bind:files="files" />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import { Getter, Action } from 'vuex-class'
    import Component from 'vue-class-component'
    import { Observable } from 'rxjs/Observable';
    import FileList from '../../components/files/FileList'
    import FolderList from '../../components/files/FolderList'
    import UploadForm from '../../components/files/UploadForm'
    import FolderOptions from '../../components/files/FolderForm'
    import { IFile, IFolder } from '../../interfaces/files'

    @Component({
        components: {
            FileList,
            FolderList,
            UploadForm,
            FolderOptions,
        },
        watch: {
            '$route' (to, from) {
                this.fetchFolder();
            }
        }
    })
    export default class Files extends Vue {
        @Action('files/fetchFolder') fetchFolder: () => Promise<void>;
        @Getter('files/currentFolder') folder: IFolder;
        private socket: SocketIOClient.Socket;
        private events: Observable<any>;

        get files(): IFile[] {
            const res: IFile[] = [];
            if(!this.folder) return [];
            this.folder.content.filter((item) => item.type === "file")
                .forEach((item) => res.push(<IFile> item));
            return res;
        }

        get folders(): IFolder[] {
            const res: IFolder[] = [];
            if(!this.folder) return [];
            this.folder.content.filter((item) => item.type === "folder")
                .forEach((item) => res.push(<IFolder> item));
            return res;
        }

        created() {
            this.fetchFolder();
        }
    }
</script>
