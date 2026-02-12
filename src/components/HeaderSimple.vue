<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function haySesion() {
    return !!localStorage.getItem("sesion");
}

function cerrarSesion() {
    localStorage.removeItem("sesion");
    router.push("/login");
}
</script>

<template>
    <header class="EncabezadoSimple">
        <div class="ContenedorEncabezado">
            <div class="MarcaSitio">
                <div class="CajaLogo" aria-hidden="true">Logo</div>
                <h1>FreeTours</h1>
            </div>
            <nav>
                <router-link to="/" class="EnlaceNav">Inicio</router-link>
                <router-link to="/about" class="EnlaceNav">Acerca</router-link>
                <router-link v-if="haySesion()" to="/usuarios" class="EnlaceNav"
                    >Usuarios</router-link
                >
                <router-link v-if="!haySesion()" to="/login" class="EnlaceNav"
                    >Iniciar sesion</router-link
                >
                <router-link
                    v-if="!haySesion()"
                    to="/registro"
                    class="EnlaceNav"
                    >Registrarse</router-link
                >
                <button
                    v-if="haySesion()"
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
