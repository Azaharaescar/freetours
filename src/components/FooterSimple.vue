<template>
    <footer class="footer-simple">
        <div class="container">
            <p>© {{ year }} FreeTours — Todos los derechos reservados.</p>
        </div>
    </footer>
</template>

<script setup>
import { ref } from "vue";
// Año automático para no tener que tocarlo cada enero.
const year = new Date().getFullYear();
</script>

<style scoped>
.footer-simple {
    background: #d8f0da;
    color: #1f2b24;
    padding: 1rem 0;
}
.container {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;
}
</style>
