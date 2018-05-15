<template>
  <div>
    <div class="btn-group w-100">
      <button class="btn btn-outline-secondary">
        <i class="fa fa-file" aria-hidden="true"></i>
      </button>
      <button class="btn btn-outline-secondary w-100" @click="select()">
        {{file.title}}
      </button>
      <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
        class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split">
        <span class="sr-only">Toggle Dropdown</span>
      </button>
      <div class="dropdown-menu dropdown-menu-right">
        <button class="dropdown-item" @click="download">
          <i class="fa fa-download" aria-hidden="true"></i>
          Download
        </button>
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
    import { saveAs } from 'file-saver';
    import Component from 'vue-class-component';
    import { Getter, Action, Mutation } from 'vuex-class';

    @Component({
        props: ['file']
    })
    export default class FileItem extends Vue {
        @Action('files/removeFile') removeFile: (id: string) => Promise<void>;
        @Action('files/downloadFile') downloadFile: (id: string) => Promise<Blob>;
        
        async remove(){
            await this.removeFile(this.$props.file.id);
        }

        async download(){
            const file = await this.downloadFile(this.$props.file.id);
            console.log(file);
            const title = prompt("Save as: ", this.$props.file.title);
            saveAs(file, title);
        }
    }
</script>