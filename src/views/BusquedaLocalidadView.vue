<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { apiUrl } from "../config/api.js";

const router = useRouter();
const rutas = ref([]);
const cargando = ref(false);
const localidadBuscada = ref("");

async function cargarRutas() {
    const guardada = localStorage.getItem("busquedaLocalidad");

    if (guardada) {//si hay una búsqueda guardada la usamos para cargar rutas al entrar a esta pagina
        localidadBuscada.value = guardada.trim();
    } else {
        localidadBuscada.value = "";
    }

    if (!localidadBuscada.value) {
        rutas.value = [];
        return;
    }

    cargando.value = true;
    try {
        const respuesta = await fetch(
            apiUrl +
                "rutas?localidad=" + localidadBuscada.value,
            {
                method: "GET",
            },
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las rutas por localidad");
        }

        const datos = await respuesta.json();

        if (Array.isArray(datos)) {
            const filtradas = [];
            const busqueda = localidadBuscada.value.toLowerCase();

            for (let i = 0; i < datos.length; i++) {
                const ruta = datos[i];
                let localidadRuta = "";

                if (ruta && ruta.localidad) {
                    localidadRuta = String(ruta.localidad).toLowerCase();
                }

                if (localidadRuta.includes(busqueda)) {
                    filtradas.push(ruta);
                }
            }

            rutas.value = filtradas;
        } else {
            rutas.value = [];
        }
    } catch (error) {
        console.error("Error al cargar rutas por localidad:", error);
        rutas.value = [];
    }

    cargando.value = false;
}

function volverInicio() {
    router.push("/");
}

function obtenerImagen(ruta) {
    if (ruta && typeof ruta === "object") {
        if (typeof ruta.foto === "string") {
            if (ruta.foto !== "") {
                return ruta.foto;
            }
        }
    }

    return "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&q=80";
}

function textoLocalidadBuscada() {
    let texto = "";

    if (localidadBuscada.value) {
        texto = localidadBuscada.value;
    } else {
        texto = "sin localidad";
    }

    return texto;
}

function textoTitulo(ruta) {
    let texto = "";

    if (ruta && ruta.titulo) {
        texto = ruta.titulo;
    } else {
        texto = "Ruta";
    }

    return texto;
}

function textoLocalidad(ruta) {
    let texto = "";

    if (ruta && ruta.localidad) {
        texto = ruta.localidad;
    } else {
        texto = "Localidad no disponible";
    }

    return texto;
}

function textoDescripcion(ruta) {
    let texto = "";

    if (ruta && ruta.descripcion) {
        texto = ruta.descripcion;
    } else {
        texto = "Descripción no disponible";
    }

    return texto;
}

function textoFecha(ruta) {
    let texto = "";

    if (ruta && ruta.fecha) {
        texto = ruta.fecha;
    } else {
        texto = "Sin fecha";
    }

    return texto;
}

function textoHora(ruta) {
    let texto = "";

    if (ruta && ruta.hora) {
        texto = ruta.hora;
    } else {
        texto = "Sin hora";
    }

    return texto;
}

onMounted(() => {
    cargarRutas();
});
</script>

<template>
    <section class="container py-4 py-md-5">
        <div
            class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4"
        >
            <div>
                <h1 class="h3 mb-1">Resultados por localidad</h1>
                <p class="text-secondary mb-0">
                    Mostrando rutas para:
                    <strong>{{ textoLocalidadBuscada() }}</strong>
                </p>
            </div>
            <button
                type="button"
                class="btn btn-outline-primary"
                @click="volverInicio"
            >
                Volver al inicio
            </button>
        </div>

        <div v-if="cargando" class="text-center py-5">
            <div class="spinner-border" role="status" aria-hidden="true" />
        </div>

        <div v-else-if="!localidadBuscada" class="alert alert-light border">
            Escribe una localidad en el buscador de inicio para ver rutas.
        </div>

        <div v-else-if="rutas.length === 0" class="alert alert-warning">
            No hay rutas disponibles para esa localidad.
        </div>

        <div v-else class="d-grid gap-3">
            <article
                v-for="ruta in rutas"
                :key="ruta.id"
                class="card shadow-sm"
            >
                <div class="row g-0">
                    <div class="col-12 col-md-4">
                        <img
                            :src="obtenerImagen(ruta)"
                            class="img-fluid w-100 h-100 imagen-tarjeta"
                            :alt="textoTitulo(ruta)"
                        />
                    </div>
                    <div class="col-12 col-md-8">
                        <div class="card-body h-100 d-flex flex-column">
                            <h2 class="h5 card-title mb-2">
                                {{ textoTitulo(ruta) }}
                            </h2>
                            <p class="text-secondary mb-2">
                                {{ textoLocalidad(ruta) }}
                            </p>
                            <p class="card-text mb-3">
                                {{ textoDescripcion(ruta) }}
                            </p>
                            <div class="mt-auto">
                                <span class="badge text-bg-light me-2">{{
                                    textoFecha(ruta)
                                }}</span>
                                <span class="badge text-bg-light">{{
                                    textoHora(ruta)
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </section>
</template>

<style scoped>
.imagen-tarjeta {
    min-height: 220px;
    object-fit: cover;
}
</style>
