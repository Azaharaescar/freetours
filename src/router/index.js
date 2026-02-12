import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegistroView from "../components/registro.vue";
import GestionUsuariosView from "../views/GestionUsuariosView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/about",
            name: "about",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/AboutView.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/login",
            name: "login",
            component: LoginView,
        },
        {
            path: "/registro",
            name: "registro",
            component: RegistroView,
        },
        {
            path: "/usuarios",
            name: "usuarios",
            component: GestionUsuariosView,
            meta: { requiresAuth: true },
        },
    ],
});

router.beforeEach((to) => {
    const autenticado = !!localStorage.getItem("sesion");

    if (to.meta.requiresAuth && !autenticado) {
        return { name: "login" };
    }

    if ((to.name === "login" || to.name === "registro") && autenticado) {
        return { name: "home" };
    }

    return true;
});

export default router;
