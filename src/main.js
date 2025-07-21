import {createRouter, createWebHistory} from 'vue-router';
import { createApp } from 'vue'

import './assets/main.css'
import App from './App.vue'
import LoginForm from "@/components/auth/LoginForm.vue";
import RegisterForm from "@/components/user/RegisterForm.vue";
import EditProfileForm from "@/components/user/EditProfileForm.vue";
import UserProfile from "@/components/user/UserProfile.vue";
import MainPage from "@/components/MainPage.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [{
            name: 'Login',
            path: '/login',
            component: LoginForm
        },
        {
            name: 'Register',
            path: '/user/register',
            component: RegisterForm
        },
        {
            name: 'Profile',
            path: '/user',
            component: UserProfile
        },
        {
            name: 'EditProfile',
            path: '/user/edit',
            component: EditProfileForm
        },
        {
            name: 'MainPage',
            path: '/main',
            component: MainPage
        }],
});

createApp(App)
    .use(router)
    .mount('#app')
