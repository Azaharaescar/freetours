import MisRutasGuiaView from "../views/MisRutasGuiaView.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegistroView from "../components/registro.vue";
import GestionUsuariosView from "../views/GestionUsuariosView.vue";
import BusquedaLocalidadView from "../views/BusquedaLocalidadView.vue";
import GestionRutas from "../components/GestionRutas.vue";
import registroRutas from "../components/registroRutas.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/mis-rutas-guia",
            name: "mis-rutas-guia",
            component: MisRutasGuiaView,
        },
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/mis-reservas",
            name: "mis-reservas",
            component: () => import("../views/MisReservasView.vue"),
        },
        {
            path: "/about",
            name: "about",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/AboutView.vue"),
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
            path: "/buscar",
            name: "buscar-localidad",
            component: BusquedaLocalidadView,
        },

        {
            path: "/usuarios",
            name: "usuarios",
            component: GestionUsuariosView,
            meta: { requiresAuth: true },// Indica que esta ruta solo puede ser accedida por usuarios autenticados
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
            // requiresAuth: obliga a que el usuario haya iniciado sesión
         // requiresAdmin: además, exige que el usuario tenga rol "admin"
        },
        {
            path: "/ruta/:id",
            name: "detalle-ruta",
            component: () => import("../views/DetalleRutaView.vue"),
        },
    ],
});

router.beforeEach((to) => {
    const autenticado = !!localStorage.getItem("sesion"); 
    //Comprueba si existe una sesión guardada en localStorage

    let usuarioSesion = null;

    if (autenticado) {
        try {
            usuarioSesion = JSON.parse(localStorage.getItem("sesion"));
            //Convierte la sesión guardada en objeto para acceder a sus datos (ej: rol)
        } catch (error) {
            usuarioSesion = null;
        }
    }

    if (to.meta.requiresAuth && !autenticado) {
        // Si la ruta requiere autenticación y el usuario no está logueado
        return { name: "login" }; // Redirige al login
    }

    if (to.meta.requiresAdmin) {
        // Si la ruta requiere rol administrador

        if (!usuarioSesion) {
            return { name: "login" }; // Si no hay sesión válida, redirige al login
        }

        if (usuarioSesion.rol !== "admin") {
            return { name: "home" }; 
            //si el usuario no es admin, lo redirige al inicio
        }
    }

    if ((to.name === "login" || to.name === "registro") && autenticado) {
        //Evita que un usuario ya autenticado vuelva a entrar a login o registro
        return { name: "home" };
    }

    return true; //Permite la navegación si cumple las condiciones
});

export default router;
