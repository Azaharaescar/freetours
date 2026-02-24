<script setup>
import { ref, onMounted } from "vue";
import { apiUrl } from "../config/api.js";
import { useRouter } from "vue-router";

const router = useRouter();
const reservas = ref([]);
const usuario = JSON.parse(localStorage.getItem("sesion"));
const email = usuario ? usuario.email : null;

// CARGAR LAS RESERVAS DEL USUARIO LOGUEADO
async function cargarReservas() {
    if (!email) return;
    try {
        const respuesta = await fetch(apiUrl + "reservas?email=" + email, {
            method: "GET",
        });
        reservas.value = await respuesta.json();
    } catch (error) {
        reservas.value = [];
    }
}
//MODIFICAR EL NUMERO DE PERSONAS
async function modificarReserva(reserva) {
    try {
        const respuesta = await fetch(apiUrl + "reservas?id=" + reserva.id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ num_personas: reserva.num_personas }), // solo enviamos el número de personas modificado para actualizarlo en el backend
        });
        const data = await respuesta.json();
        alert("Reserva modificada");
    } catch (error) {
        alert("Error al modificar la reserva");
    }
}
// CANCELAR RESERVA
async function cancelarReserva(reserva) {
    if (!confirm("¿Seguro que quieres cancelar la reserva?")) return;
    try {
        const respuesta = await fetch(apiUrl + "reservas?id=" + reserva.id, {
            method: "DELETE",
        });
        const data = await respuesta.json();
        reservas.value = reservas.value.filter((r) => r.id !== reserva.id);
        alert("Reserva cancelada");
    } catch (error) {
        alert("Error al cancelar la reserva");
    }
}

onMounted(() => {
    // al cargar la pagina cargamos las reservas del usuario logueado
    cargarReservas();
});
</script>
<template>
    <section class="container py-4">
        <h1>Mis reservas</h1>
        <div v-if="reservas.length">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Ruta</th>
                        <th>Fecha</th>
                        <th>Nº personas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="reserva in reservas" :key="reserva.id">
                        <td>{{ reserva.ruta_titulo || reserva.ruta_id }}</td>
                        <td>{{ reserva.fecha }}</td>
                        <td>
                            <input
                                type="number"
                                min="1"
                                v-model.number="reserva.num_personas"
                                class="form-control d-inline-block w-auto"
                            />
                        </td>
                        <td>
                            <button
                                class="btn btn-primary btn-sm me-2"
                                @click="modificarReserva(reserva)"
                            >
                                Modificar
                            </button>
                            <button
                                class="btn btn-danger btn-sm"
                                @click="cancelarReserva(reserva)"
                            >
                                Cancelar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="alert alert-info">No tienes reservas.</div>
    </section>
</template>

<style scoped>
.table {
    background: #fff;
}
</style>
