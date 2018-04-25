<template>
    <div id="register" class="row">
        <register-form class="col-md-4 offset-md-4" />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import RegisterForm from '../../components/auth/RegisterForm';

    @Component({
        components: {
            'register-form': RegisterForm
        }
    })
    export default class Register extends Vue {}
</script>
