<script setup>
import router from "@/router";
import { ref } from "vue";
</script>

<template>
    <header class="header-simple">
        <div class="container">
            <div class="brand">
                <div class="logo-box" aria-hidden="true">Logo</div>
                <h1>FreeTours</h1>
            </div>
            <nav>
                <router-link to="/" class="nav-link">Inicio</router-link>
                <router-link to="/about" class="nav-link">Acerca</router-link>
                <router-link to="/login" class="nav-link"
                    >Iniciar sesion</router-link
                >
                <router-link to="/registro" class="nav-link"
                    >Registrarse</router-link
                >
            </nav>
        </div>
    </header>
</template>

<style scoped>
.header-simple {
    background: #d8f0da;
    color: #1f2b24;
    padding: 0.75rem 0;
}

.container {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
}

.brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.logo-box {
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

nav a.router-link-active {
    text-decoration: underline;
}
</style>
