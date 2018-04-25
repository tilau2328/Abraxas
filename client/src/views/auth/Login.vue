<template>
    <div id="login" class="row">
        <login-form class="col-md-4 offset-md-4" />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import LoginForm from '../../components/auth/LoginForm';

    @Component({
        components: {
            'login-form': LoginForm
        }
    })
    export default class Login extends Vue {}
</script>
