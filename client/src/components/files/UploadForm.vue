<template>
    <div id="upload-form">
        <form enctype="multipart/form-data" novalidate :disabled="loading">
            <div class="btn-group w-100">
                <label class="btn btn-secondary btn-file w-50" id="upload-files" style="margin: 0px;">
                    <input type="file" name="files" @change="onChange($event);" multiple hidden />
                    <i class="fa fa-plus"></i>
                    Select 
                </label>
                <button class="btn btn-secondary w-50" :disabled="loading || !files.length" @click.prevent="upload()">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                    Upload
                </button>
            </div>
            <div v-for="file in files" v-bind:key="file.id" class="w-100">
                <div class="btn-group w-100">
                    <button class="btn btn-outline-secondary w-100">
                        <span href="">{{file.name}}</span>
                    </button>
                    <button class="btn btn-outline-secondary" @click.prevent="remove(file)">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <button class="btn btn-secondary w-100" @click.prevent="clear()" v-if="!!files.length && !loading">
                Clear
            </button>
        </form>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { Action } from 'vuex-class';
    import Component from 'vue-class-component';

    @Component
    export default class UploadForm extends Vue {
        @Action('files/uploadFiles') uploadFiles: (files: any) => Promise<void>;

        loading: boolean = false;
        files: any[] = [];

        onChange(event: any) {
            const files = event.target.files
            if(!files.length) return;
            for(let i = 0; i < files.length; i++) {
                this.files.push(files[i]);
            }
            event.target.value = "";
        }

        clear() {
            this.files = [];
        }

        remove(file: any) {
            const index = this.files.indexOf(file);
            this.files.splice(index, 1);
        }

        async upload() {
            if(!this.files.length) return;
            this.loading = true;
            const formData = new FormData();
            const directory = this.$store.state.route.params.id;
            try {
                this.files.forEach((file: any) => formData.append("files", file));
                if(directory) formData.append("directory", directory);
                await this.uploadFiles(formData);
                this.clear();
            } finally {
                this.loading = false;
            }
        }
    }
</script>

<style>
</style>