<template>
    <div id="folder-list">
        <ul v-if="folders.length" >
            <folder-item v-for="folder in folders" 
                v-bind:key="folder.id" :folder="folder">
            </folder-item>
        </ul>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import FolderItem from './FolderItem';
    import Component from 'vue-class-component';
    import { Getter, Action, Mutation } from 'vuex-class';

    @Component({
        components: {
            'folder-item': FolderItem,
        },
        props: ['folders']
    })
    export default class FolderList extends Vue {
    
    }
</script>

<style>
</style>