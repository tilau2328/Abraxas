<template>
    <form id="register-form" @submit.prevent="submit()">
        <h1>Register</h1>
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
            :disabled="disable">Register</button>
    </form>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { Getter, Action, Mutation, State } from 'vuex-class';
    import * as auth from '../../store/modules/auth';
    import { RegisterCredentials } from '../../interfaces/auth';
    
    @Component
    export default class RegisterForm extends Vue {
        error: string = '';
        credentials: RegisterCredentials = { username: '', password: '' };
        @Getter('auth/isLoggedIn') isLoggedIn: boolean;
        @Getter('auth/isLoggingIn') isLoggingIn: boolean;
        @Action('auth/register') register: (credentials: RegisterCredentials) => Promise<boolean>;

        async submit() {
            try {
                const success = await this.register(this.credentials);
                if(success) {
                    this.$router.push({ name: 'Home' }); 
                }
            } catch(error) {
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
