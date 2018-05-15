<template>
    <div id="folder-form">
        <div class="btn-group-vertical w-100" v-if="!!folder">
          <button class="btn btn-secondary" @click="rename()" v-if="!!folder.id">      
            <i class="fa fa-pencil" aria-hidden="true"></i>
            Rename
          </button>
          <button class="btn btn-secondary" @click="create()">
            <i class="fa fa-folder" aria-hidden="true"></i>
            Create
          </button>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { Getter, Action, Mutation } from 'vuex-class';
    import { IFolder } from '../../interfaces/files';

    @Component
    export default class FolderForm extends Vue {
        @Action('files/createFolder') createFolder: (folder: IFolder) => Promise<void>;
        @Action('files/updateFolder') updateFolder: (folder: IFolder) => Promise<void>;
        @Getter('files/currentFolder') folder: IFolder;

        async rename(){
            const title = prompt("Folder name: ", this.folder.title);
            if(!title || title === this.folder.title) return;
            let folder = { ...this.folder, title };
            await this.updateFolder (folder);
        }

        async create(){
            const title = prompt("Folder name: ");
            if(title) await this.createFolder({ title, directory: !!this.folder ? this.folder.id : null, type: 'folder' });
        }
    }
</script>

<style>
</style>