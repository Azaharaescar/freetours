<script setup>
import { ref, onMounted } from "vue";
import { apiUrl } from "../config/api.js";

const usuario = JSON.parse(localStorage.getItem("sesion"));
const guiaId = usuario ? usuario.id : null;
const rutasAsignadas = ref([]);
const asistentesRuta = ref([]);
const rutaSeleccionada = ref(null);
const mostrandoAsistentes = ref(false);
// CARGAR LAS RUTAS ASIGNADAS AL GUIA LOGUEADO
async function cargarRutasAsignadas() {
    try {
        const respuesta = await fetch(
            apiUrl + "asignaciones?guia_id=" + guiaId,
            {
                method: "GET",
            },
        );
        const datos = await respuesta.json();
        console.log("Respuesta API rutas asignadas:", datos); // <-- Mostrar datos en consola
        if (Array.isArray(datos)) {
            rutasAsignadas.value = datos;
        } else {
            rutasAsignadas.value = [];
        }
    } catch (error) {
        rutasAsignadas.value = [];
    }
}

// VER ASISTENTES DE LA RUTA SELECCIONADA
async function verAsistentes(ruta) {
    rutaSeleccionada.value = ruta; // guardamos la ruta seleccionada para mostrar su título en el modal de asistentes
    mostrandoAsistentes.value = true; // mostramos el modal de asistentes
    // Los asistentes vienen en la propiedad reservas de la ruta asignada
    if (Array.isArray(ruta.reservas)) {
        // comprobamos que la ruta tiene reservas para evitar errores si no tiene reservas o la propiedad no es un array
        asistentesRuta.value = ruta.reservas; // guardamos las reservas de la ruta seleccionada para mostrarlas en el modal de asistentes
    } else {
        asistentesRuta.value = [];
    }
}

// CERRAR ASISTENTES
function cerrarAsistentes() {
    mostrandoAsistentes.value = false;
    rutaSeleccionada.value = null;
    asistentesRuta.value = [];
}

onMounted(() => {
    cargarRutasAsignadas();

    console.log("rutas asignadas", rutasAsignadas);
    rutasAsignadas.value.forEach((ruta) => console.log(ruta));
});
</script>
<template>
    <section class="container py-4">
        <h1>Mis rutas asignadas</h1>
        <div v-if="rutasAsignadas.length > 0">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Localidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ruta in rutasAsignadas" :key="ruta.id">
                        <!-- <-- Mostrar cada ruta en consola -->
                        <td>{{ ruta.ruta_id }}</td>
                        <td>{{ ruta.ruta_titulo }}</td>
                        <td>{{ ruta.ruta_fecha }}</td>
                        <td>{{ ruta.ruta_hora }}</td>
                        <td>{{ ruta.ruta_localidad }}</td>
                        <td>
                            <button
                                class="btn btn-info btn-sm"
                                @click="verAsistentes(ruta)"
                            >
                                Pasar lista
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="alert alert-info">No tienes rutas asignadas.</div>

        <!-- Modal o sección para mostrar asistentes -->
        <div v-if="mostrandoAsistentes && rutaSeleccionada" class="mt-4">
            <h2>Asistentes a la ruta: {{ rutaSeleccionada.titulo }}</h2>
            <button
                class="btn btn-secondary btn-sm mb-2"
                @click="cerrarAsistentes"
            >
                Cerrar
            </button>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Nº personas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="asistente in asistentesRuta" :key="asistente.id">
                        <td>{{ asistente.nombre || "-" }}</td>
                        <td>{{ asistente.email || "-" }}</td>
                        <td>{{ asistente.num_personas }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-if="asistentesRuta.length === 0" class="alert alert-warning">
                No hay asistentes para esta ruta.
            </div>
        </div>
    </section>
</template>

<style scoped>
.table {
    background: #fff;
}
</style>
