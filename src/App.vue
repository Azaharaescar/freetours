<script setup>
import FooterSimple from "./components/FooterSimple.vue";
import HeaderSimple from "./components/HeaderSimple.vue";
// Estructura base de toda la app: header arriba, páginas en medio y footer abajo.
</script>

<template>
    <HeaderSimple />
    <router-view />
    <FooterSimple />
</template>

<style scoped></style>
