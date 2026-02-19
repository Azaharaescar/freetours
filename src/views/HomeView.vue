<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { apiUrl } from "../config/api.js";

const router = useRouter();
const textoBusqueda = ref("");
const rutas = ref([]);


async function cargarRutas(localidad) {
 
    // si hay localidad añadimos query para filtrar por localidad en backend sino cargamos todas las rutas
    //query es para no cargar todas las rutas al buscar por localidad y que el backend se encargue de filtrar por localidad en vez de cargar todo y filtrar en el frontend que es peor NO OLVIDAR
    /*
    if (localidad) {
        url = apiUrl + "rutas?localidad=" + encodeURIComponent(localidad);
    }*/

    try {
        const respuesta = await fetch(apiUrl + "rutas", {
            method: "GET",
        });

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las rutas");
        }
         const datos = await respuesta.json();

        for (let i = 0; i < datos.length; i++) {
            const ruta = datos[i];
            console.log("Ruta:", ruta);
        }
        if (Array.isArray(datos)) {
            rutas.value = datos;
        
            
        } else {
            rutas.value = [];
        }
    } catch (error) {
        console.error("Error al cargar rutas:", error);
        rutas.value = [];
    }

   
}

onMounted(() => {
    cargarRutas();
});
//funciones para manejar la búsqueda y navegación
function irLogin() {
    router.push("/login");
}

function irRegistro() {
    router.push("/registro");
}

function buscarPorLocalidad() {
    let localidad = "";

    if (textoBusqueda.value) {
        localidad = textoBusqueda.value.trim();
    }

    if (localidad) {
        localStorage.setItem("busquedaLocalidad", localidad);
    } else {
        localStorage.removeItem("busquedaLocalidad");
    }

    router.push("/buscar");
}

function obtenerImagen(ruta) {//función para obtener la imagen de la ruta
        if (typeof ruta.foto === "string") {
            if (ruta.foto !== "") {
                return ruta.foto;
            }
        }
    }



console.log("Rutas cargadas:", rutas.value);

</script>

<template>
    <section class="container py-4 py-md-5">
        <div class="position-relative rounded-4 overflow-hidden shadow">
            <div
                id="homeCarousel"
                class="carousel slide"
                data-bs-ride="carousel"
            >
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img
                            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80"
                            class="d-block w-100 imagen-carrusel"
                            alt="Paisaje natural"
                        />
                    </div>
                    <div class="carousel-item">
                        <img
                            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"
                            class="d-block w-100 imagen-carrusel"
                            alt="Montañas"
                        />
                    </div>
                </div>
                <button
                    class="carousel-control-prev"
                    type="button"
                    data-bs-target="#homeCarousel"
                    data-bs-slide="prev"
                >
                    <span
                        class="carousel-control-prev-icon"
                        aria-hidden="true"
                    />
                    <span class="visually-hidden">Anterior</span>
                </button>
                <button
                    class="carousel-control-next"
                    type="button"
                    data-bs-target="#homeCarousel"
                    data-bs-slide="next"
                >
                    <span
                        class="carousel-control-next-icon"
                        aria-hidden="true"
                    />
                    <span class="visually-hidden">Siguiente</span>
                </button>
            </div>

            <div class="capa-oscura" />

            <div class="buscador-superpuesto container px-3">
                <h1 class="text-white fw-bold mb-2">
                    Encuentra tu próximo free tour
                </h1>
                <p class="text-white mb-3">
                    Busca por ciudad, y descubre nuevas experiencias...
                </p>
                <form
                    class="row g-2 justify-content-center"
                    @submit.prevent="buscarPorLocalidad"
                >
                    <div class="col-12 col-md-8 col-lg-7">
                        <input
                            v-model="textoBusqueda"
                            type="search"
                            class="form-control form-control-lg"
                            placeholder="Ej: Jaén..."
                        />
                    </div>
                    <div class="col-12 col-md-auto d-grid">
                        <button
                            type="submit"
                            class="btn btn-primary btn-lg px-4"
                        >
                            Buscar
                        </button>
                    </div>
                </form>

                <div class="d-flex gap-2 justify-content-center flex-wrap mt-3">
                    <button
                        class="btn btn-light"
                        type="button"
                        @click="irLogin"
                    >
                        Iniciar sesión
                    </button>
                    <button
                        class="btn btn-outline-light"
                        type="button"
                        @click="irRegistro"
                    >
                        Registro
                    </button>
                </div>
            </div>
        </div>

        <div
            class="d-flex justify-content-between align-items-center mt-4 mb-3"
        >
            <h2 class="h4 m-0">Tours disponibles</h2>
            <span class="badge text-bg-secondary"
                >{{ rutas.length }} resultado(s)</span
            >
        </div>

        <div v-if="cargando" class="text-center py-5">
            <div class="spinner-border" role="status" aria-hidden="true" />
        </div>

        <div v-else-if="rutas.length === 0" class="alert alert-light border">
            No se encontraron tours con esa búsqueda.
        </div>

        <div v-else class="row g-4">
            <div
                v-for="ruta in rutas "
                :key="ruta.id"
                class="col-12 col-md-6 col-lg-4"
            >
                <div class="card h-100 shadow-sm">
                    <img
                        :src="obtenerImagen(ruta)"
                        class="card-img-top imagen-tarjeta"
                        :alt="ruta.titulo"
                    />
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title mb-2">
                            {{ruta.titulo}}
                        </h5>
                        <p class="card-text text-secondary mb-2">
                            {{ruta.localidad}}
                        </p>
                        <p class="card-text mb-3">
                            {{ ruta.descripcion }}
                        </p>
                        <div class="mt-auto">
                            <span class="badge text-bg-light me-2">{{
                                ruta.fecha
                            }}</span>
                            <span class="badge text-bg-light">{{
                                ruta.hora
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.imagen-carrusel {
    height: 500px;
    object-fit: cover;
}

.capa-oscura {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    pointer-events: none;
}

.buscador-superpuesto {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 2;
}

.imagen-tarjeta {
    height: 220px;
    object-fit: cover;
}

@media (max-width: 767.98px) {
    .imagen-carrusel {
        height: 420px;
    }
}
</style>
