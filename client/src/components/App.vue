<template>
    <div id="app">
        <navbar></navbar>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Navbar from './Navbar.vue';
    import Component from 'vue-class-component';
    import { Getter, Action, Mutation } from 'vuex-class';

    @Component({
        components: {
            navbar: Navbar
        }
    })
    export default class App extends Vue {
        @Getter('auth/isLoggedIn') isLoggedIn: boolean;
        @Action('auth/authenticate') authenticate: () => Promise<boolean>;

        verifyAuth(route: any) {
            if(!this.isLoggedIn && ['Home', 'Login', 'Register'].indexOf(route.name) == -1) {
                this.$router.push({ name: 'Login' });
            } else if(this.isLoggedIn && ['Login', 'Register'].indexOf(route.name) != -1) {
                this.$router.go(-1);
            }            
        }

        async created() {
            await this.authenticate();
            this.verifyAuth(this.$store.state.route);
        }

        updated() {
            this.verifyAuth(this.$store.state.route);
        }
    }
</script>

<style>
    #app {
    margin-top: 60px;
    }
</style>