<template>
    <div id="file-list">
        <ul v-if="files.length" >
            <file-item v-for="file in files" 
                v-bind:key="file.id" v-bind:file="file">
            </file-item>
        </ul>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import FileItem from './FileItem';
    import Component from 'vue-class-component';
    import { Getter, Action, Mutation } from 'vuex-class';

    @Component({
        components: {
            'file-item': FileItem,
        },
        props: ['files']
    })
    export default class FileList extends Vue {
    
    }
</script>

<style>
</style>