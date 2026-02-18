import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegistroView from "../components/registro.vue";
import GestionUsuariosView from "../views/GestionUsuariosView.vue";
import GestionRutas from "../components/GestionRutas.vue";
import registroRutas from "../components/registroRutas.vue";

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
        {
            path: "/rutas",
            name: "rutas",
            component: GestionRutas,
            meta: { requiresAuth: true },
        },
        {
            path: "/registro-rutas",
            name: "registro-rutas",
            component: registroRutas,
            meta: { requiresAuth: true, requiresAdmin: true },
        },
    ],
});

router.beforeEach((to) => {
    const autenticado = !!localStorage.getItem("sesion");
    let usuarioSesion = null;

    if (autenticado) {
        try {
            usuarioSesion = JSON.parse(localStorage.getItem("sesion"));
        } catch (error) {
            usuarioSesion = null;
        }
    }

    if (to.meta.requiresAuth && !autenticado) {
        return { name: "login" };
    }

    if (to.meta.requiresAdmin) {
        if (!usuarioSesion) {
            return { name: "login" };
        }

        if (usuarioSesion.rol !== "admin") {
            return { name: "home" };
        }
    }

    if ((to.name === "login" || to.name === "registro") && autenticado) {
        return { name: "home" };
    }

    return true;
});

export default router;
