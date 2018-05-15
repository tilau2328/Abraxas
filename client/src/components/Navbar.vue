<template>
    <div id="navbar">
        <nav class="navbar fixed-top navbar-expand-md navbar-dark bg-dark">
            <router-link :to="{ name: 'Home' }" class="navbar-brand">Abraxas</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" 
                data-target="#navbarCollapse" aria-controls="navbarCollapse" 
                aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item" v-if="!!user">
                        <router-link :to="{ name: 'Files' }" class="nav-link">Files</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav navbar-right">
                    <li class="nav-item" v-if="!!user">
                        <a class="nav-link" href="#" @click="logout">Logout</a>
                    </li>
                    <li class="nav-item" v-if="!user">
                        <router-link :to="{ name: 'Login' }" class="nav-link">Login</router-link>
                    </li>
                    <li class="nav-item" v-if="!user">
                        <router-link :to="{ name: 'Register' }" class="nav-link">Register</router-link>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { User } from '../interfaces/auth';
    import Component from 'vue-class-component';
    import { Getter, Action } from 'vuex-class';

    @Component
    export default class Navbar extends Vue {
        @Getter('auth/user') user: User;
        @Action('auth/logout') logout: () => Promise<void>;

        async signout() {
            await this.logout();
            this.$router.push({ name: 'Home' });
        }
    }
</script>
