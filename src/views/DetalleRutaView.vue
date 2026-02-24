<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { apiUrl } from "../config/api.js";
const numPersonas = ref(1);

const route = useRoute();
const router = useRouter(); // para navegar a otras paginas
const idRuta = route.params.id; // obtenemos el id de la ruta de la url para cargar su información
const usuarioLogueado = ref(JSON.parse(localStorage.getItem("sesion")));
const email = usuarioLogueado.value ? usuarioLogueado.value.email : null;
const datos = ref([]);

// FUNCION PARA IR A LOGIN SI EL USUARIO NO ESTA LOGUEADO
function irLogin() {
    router.push("/login");
}
// CARGAR  DETALLES RUTA ELEGIDA POR EL USUARIO
async function cargarRuta() {
    try {
        console.log("ID de la ruta:", idRuta);
        const respuesta = await fetch(apiUrl + "rutas?id=" + idRuta, {
            //con este endpoint obtenemos la ruta que introuce el usuario
            method: "GET",
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la ruta");
        }
        // siempre comprobar que la respuesta es correcta antes de usarla en templates
        const resultado = await respuesta.json();
        if (Array.isArray(resultado)) {
            datos.value = resultado;
        } else {
            datos.value = [resultado];
        }
        console.log("Array datos : " + JSON.stringify(datos.value));
    } catch (error) {
        console.error("Error al cargar la ruta:", error);
        datos.value = null;
    }
}

//RESERVAR RUTA
async function ReservarRuta() {
    try {
        // Calcular el total de personas ya reservadas para esta ruta
        let totalReservadas = 0;
        if (Array.isArray(datos.value) && datos.value.length > 0) {
            const ruta = datos.value[0];
            if (Array.isArray(ruta.reservas)) {
                for (let i = 0; i < ruta.reservas.length; i++) {
                    totalReservadas += Number(ruta.reservas[i].num_personas);
                }
            }
        }
        // Sumar las personas que se quieren reservar ahora
        const totalDespues = totalReservadas + Number(numPersonas.value);
        if (totalDespues > 10) {
            alert(
                "No se pueden reservar más de 10 personas en total para esta ruta.",
            );
            return;
        }
        // Si no se supera el máximo, continuar con la reserva
        const reservaData = {
            email: email, // Email del cliente
            ruta_id: idRuta, // ID de la ruta
            num_personas: numPersonas.value, // Número de personas para la reserva
        };
        const respuesta = await fetch(apiUrl + "reservas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reservaData),
        });
        const data = await respuesta.json();
        console.log("Respuesta:", data);
        if (data.status === "success") {
            alert("¡Reserva creada correctamente!");
        }
    } catch (error) {
        console.error("Error al reservar la ruta:", error);
    }
}
// CARGAR RUTA AL ENTRAR A LA PAGINA
onMounted(() => {
    cargarRuta();
});
</script>
<template>
    <section class="container py-4">
        <div v-if="Array.isArray(datos) && datos.length > 0">
            <div
                v-for="ruta in datos"
                :key="ruta.id"
                class="card mb-4 shadow-sm"
            >
                <img
                    :src="ruta.foto"
                    class="card-img-top imagen-detalle"
                    :alt="ruta.titulo"
                />
                <div class="card-body">
                    <h2 class="card-title mb-3">
                        {{ ruta.titulo }}
                    </h2>
                    <p class="mb-2">
                        <strong>Localidad:</strong> {{ ruta.localidad }}
                    </p>
                    <p class="mb-2">
                        <strong>Descripción:</strong>
                        {{ ruta.descripcion }}
                    </p>
                    <p class="mb-2"><strong>Fecha:</strong> {{ ruta.fecha }}</p>
                    <p class="mb-2"><strong>Hora:</strong> {{ ruta.hora }}</p>
                    <p class="mb-2">
                        <strong>Latitud:</strong> {{ ruta.latitud }}
                    </p>
                    <p class="mb-2">
                        <strong>Longitud:</strong> {{ ruta.longitud }}
                    </p>
                    <!-- Campo número de personas y botón de reservar -->
                    <div class="mt-4 text-end">
                        <template v-if="usuarioLogueado">
                            <label for="numPersonas" class="me-2"
                                ><strong>Número de personas:</strong></label
                            >
                            <input
                                id="numPersonas"
                                type="number"
                                min="1"
                                class="form-control d-inline-block w-auto me-3"
                                v-model="numPersonas"
                            />
                            <button
                                class="btn btn-success btn-lg boton-reservar"
                                type="button"
                                @click="ReservarRuta"
                            >
                                Reservar
                            </button>
                        </template>
                        <template v-else>
                            <button
                                class="btn btn-warning btn-lg"
                                type="button"
                                @click="irLogin"
                            >
                                Iniciar sesión para reservar
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="alert alert-warning">
            No se pudo cargar la información de la ruta.
        </div>
    </section>
</template>

<style scoped></style>
<style scoped>
.imagen-detalle {
    height: 320px;
    object-fit: cover;
}
.boton-reservar {
    background-color: #198754;
    color: #fff;
    border: none;
}
.boton-reservar:hover {
    background-color: #157347;
}
</style>
