<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const usuarioActual = ref(JSON.parse(localStorage.getItem("sesion")));

// FUNCION PARA ACTUALIZAR SESION EN EL HEADER AL INICIAR O CERRAR SESION
function actualizarSesion() {
    // Aquí refrescamos el usuario del header sin recargar toda la web para no tener que volver a cargar la página al iniciar sesión o cerrar sesión para que se actualice el menú del header al momento NO OLVIDAR
    // osea sin hacer el tipico "location.reload()" que recarga toda la pgina
    usuarioActual.value = JSON.parse(localStorage.getItem("sesion"));
}
// FUNCION PARA CERRAR SESION
function cerrarSesion() {
    //cerramos sesión y actualizamos el menu al momento.
    localStorage.removeItem("sesion");
    actualizarSesion();

    //avisamos al resto de ficheros de que la sesin cambio

    window.dispatchEvent(new Event("sesionCambiada"));
    router.push("/login");
}

onMounted(() => {
    //onmounted es para ejecutar código al cargar el componente en este caso para actualizar el header si ya hay sesión iniciada al cargar la web y para quedarnos escuchando cambios de sesión
    // se me olvidara
    //nos quedamos escuchando cambios de sesión
    window.addEventListener("sesionCambiada", actualizarSesion);
});

onBeforeUnmount(() => {
    //limpiamos el listener para que no se acumulen eventos duplicados
    window.removeEventListener("sesionCambiada", actualizarSesion);
});
</script>

<template>
    <header class="EncabezadoSimple">
        <div class="ContenedorEncabezado">
            <div class="MarcaSitio">
                <div class="CajaLogo">Logo</div>
                <h1>FreeTours</h1>
            </div>
            <nav>
                <router-link
                    v-if="usuarioActual && usuarioActual.rol === 'guia'"
                    to="/mis-rutas-guia"
                    class="EnlaceNav"
                >
                    Mis rutas asignadas
                </router-link>
                <router-link
                    v-if="usuarioActual && usuarioActual.rol === 'cliente'"
                    to="/mis-reservas"
                    class="EnlaceNav"
                >
                    Mis reservas
                </router-link>
                <router-link to="/" class="EnlaceNav">Inicio</router-link>
                <router-link to="/about" class="EnlaceNav">Acerca</router-link>
                <router-link
                    v-if="usuarioActual && usuarioActual.rol === 'admin'"
                    to="/usuarios"
                    class="EnlaceNav"
                >
                    Usuarios
                </router-link>
                <router-link
                    v-if="usuarioActual && usuarioActual.rol === 'admin'"
                    to="/rutas"
                    class="EnlaceNav"
                >
                    Rutas
                </router-link>
                <router-link
                    v-if="usuarioActual && usuarioActual.rol === 'admin'"
                    to="/registro-rutas"
                    class="EnlaceNav"
                >
                    Registro rutas
                </router-link>
                <router-link
                    v-if="!usuarioActual"
                    to="/login"
                    class="EnlaceNav"
                >
                    Iniciar sesion
                </router-link>
                <router-link
                    v-if="!usuarioActual"
                    to="/registro"
                    class="EnlaceNav"
                >
                    Registrarse
                </router-link>
                <button
                    v-if="usuarioActual"
                    type="button"
                    class="BotonCerrarSesion"
                    @click="cerrarSesion"
                >
                    Cerrar sesión
                </button>
            </nav>
        </div>
    </header>
</template>

<style scoped>
.EncabezadoSimple {
    background: #d8f0da;
    color: #1f2b24;
    padding: 0.75rem 0;
}

.ContenedorEncabezado {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
}

.MarcaSitio {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.CajaLogo {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #bfe3c2;
    color: #1f2b24;
    display: grid;
    place-items: center;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.04em;
}

nav {
    margin-left: auto;
}

nav a {
    color: #1f2b24;
    margin-left: 1rem;
    text-decoration: none;
}

.BotonCerrarSesion {
    margin-left: 1rem;
    border: 1px solid #1f2b24;
    border-radius: 999px;
    background: transparent;
    color: #1f2b24;
    padding: 0.3rem 0.8rem;
    cursor: pointer;
}
nav a.router-link-active {
    text-decoration: underline;
}
</style>
