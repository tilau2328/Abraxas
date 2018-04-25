<template>
    <form id="login-form" @submit.prevent="submit()">
        <h1>Login</h1>
        <div class="form-group">
            <input
                type="text"
                v-model="credentials.username"
                class="form-control"
                placeholder="Username"
                :disabled="isLoggingIn"
            >
        </div>
        <div class="form-group">
            <input
                type="password"
                v-model="credentials.password"
                class="form-control"
                placeholder="Password"
                :disabled="isLoggingIn"
            >
        </div>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
        <button class="btn btn-primary" submit
            :disabled="disable">Login</button>
    </form>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { Getter, Action, Mutation, State } from 'vuex-class';
    import * as auth from '../../store/modules/auth';
    import { LoginCredentials } from '../../interfaces/auth';
    
    @Component
    export default class LoginForm extends Vue {
        error: string = '';
        credentials: LoginCredentials = { username: '', password: '' };
        @Getter('auth/isLoggedIn') isLoggedIn: boolean;
        @Getter('auth/isLoggingIn') isLoggingIn: boolean;
        @Action('auth/login') login: (credentials: LoginCredentials) => Promise<boolean>;

        async submit() {
            try {
                const success = await this.login(this.credentials);
                if(success) {
                    this.$router.push({ name: 'Home' }); 
                }
            } catch(error) {
                console.log(error);
                this.error = error;
            }
        }

        get disable() {
            return this.credentials.username === '' || this.credentials.password === '' || this.isLoggingIn;
        }

        created() {
            console.log(this.disable);
            if(this.isLoggedIn) {
                this.$router.go(-1);
            }
        }
    }
</script>
