<template>
  <div>
    <div class="btn-group w-100">
      <button class="btn btn-outline-secondary">
        <i class="fa fa-folder"></i>
      </button>
      <button class="btn btn-outline-secondary w-100" @click="select">
        {{folder.title}}
      </button>
      <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
        class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split">
        <span class="sr-only">Toggle Dropdown</span>
      </button>
      <div class="dropdown-menu dropdown-menu-right">
        <button class="dropdown-item" @click="remove">
          <i class="fa fa-times" aria-hidden="true"></i>
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { Getter, Action, Mutation } from 'vuex-class';

    @Component({
        props: ['folder']
    })
    export default class FolderItem extends Vue {
        @Action('files/removeFolder') removeFolder: (id: string) => Promise<void>;

        async remove(){
          await this.removeFolder(this.$props.folder.id);
        }

        select() {
          let route = { name: 'Folder', params: { id: this.$props.folder.id } };
          console.log(route);
          this.$router.push(route);
        }
    }
</script>