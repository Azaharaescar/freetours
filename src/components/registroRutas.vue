<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiUrl } from "../config/api";

const titulo = ref("");
const localidad = ref("");
const fecha = ref("");
const hora = ref("");
const descripcion = ref("");
const foto = ref("");
const latitud = ref("");
const longitud = ref("");
const guiaId = ref("");
const guiasDisponibles = ref([]);
const router = useRouter();

async function cargarGuiasDisponibles() {
    /*cuando cambia la fecha traemos solo los guias libres de ese dia
    if (!fecha.value) {
        guiasDisponibles.value = [];
        guiaId.value = "";
        return;
    }

    try {
        const respuesta = await fetch(
            apiUrl + "asignaciones?fecha=" + fecha.value,
            {
                method: "GET",
            },
        );
        const datos = await respuesta.json();

        if (Array.isArray(datos)) {
            guiasDisponibles.value = datos;

            let existeGuiaElegido = false;
            for (let i = 0; i < datos.length; i++) {
                if (String(datos[i].id) === String(guiaId.value)) {
                    existeGuiaElegido = true;
                }
            }

            if (!existeGuiaElegido) {
                guiaId.value = "";
            }
        } else {
            guiasDisponibles.value = [];
            guiaId.value = "";
        }
    } catch (error) {
        console.log("Error al cargar guias", error);
        guiasDisponibles.value = [];
        guiaId.value = "";
    }

*/
}
async function enviar() {
    //aqui ponemos un alert porque todos los campos tienen que estrar completos
    if (
        !titulo.value ||
        !localidad.value ||
        !fecha.value ||
        !hora.value ||
        !descripcion.value ||
        !latitud.value ||
        !longitud.value
    ) {
        alert("Completa todos los campos");
       
    }

    // montamos el body que usa la api
    const datosRuta = {
        titulo: titulo.value,
        localidad: localidad.value,
        descripcion: descripcion.value,
        foto: foto.value,
        fecha: fecha.value,
        hora: hora.value,
        latitud: latitud.value,
        longitud: longitud.value,
    };

    //guia es opcional y lo puedo seleccionar en la gestion;
    if (guiaId.value) {
        datosRuta.guia_id = Number(guiaId.value);
    }

    try {
        const respuesta = await fetch(apiUrl + "rutas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosRuta),
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            alert("ruta creada correctamente");
            router.push("/rutas");
            
        }

        if (datos && datos.message) {
            alert(datos.message);
        } else {
            alert("No se pudo crear la ruta");
        }
    } catch (error) {
        console.error("Error al crear ruta", error);
        alert("No se pudo conectar con el servidor");
    }
}
</script>
<template>
    <section class="SeccionRegistro">
        <div class="TarjetaRegistro">
            <div class="FormularioRegistro">
                <h2 class="TituloRegistro">Crear ruta</h2>
                <p class="TextoNota">
                    Completa tus datos para agregar una ruta
                </p>

                <form @submit.prevent="enviar">
                    <div class="CampoFormulario">
                        <label for="titulo">Titulo ruta</label>
                        <input
                            v-model="titulo"
                            type="text"
                            placeholder="Titulo"
                        />
                    </div>

                    <div class="CampoFormulario">
                        <label for="localidad">Localidad</label>
                        <input
                            v-model="localidad"
                            type="text"
                            placeholder="Madrid..."
                        />
                    </div>

                    <div class="CampoFormulario">
                        <label for="descripcion">Descripcion</label>
                        <input
                            v-model="descripcion"
                            type="text"
                            placeholder="Descripcion ruta"
                        />
                    </div>

                    <div class="CampoFormulario">
                        <label for="foto">Foto ruta</label>
                        <input type="file" @change="onFotoChange" />
                    </div>

                    <div class="CampoFormulario">
                        <label for="fecha">Fecha</label>
                        <input
                            v-model="fecha"
                            type="date"
                            @change="cargarGuiasDisponibles"
                        />
                    </div>

                    <div class="CampoFormulario">
                        <label for="hora">Hora</label>
                        <input v-model="hora" type="time" />
                    </div>

                    <div class="CampoFormulario">
                        <label for="latitud">Latitud</label>
                        <input v-model="latitud" type="number" step="any" />
                    </div>

                    <div class="CampoFormulario">
                        <label for="longitud">Longitud</label>
                        <input v-model="longitud" type="number" step="any" />
                    </div>

                    <div class="CampoFormulario">
                        <label for="guia">Guía disponible</label>
                        <select v-model="guiaId">
                            <option value="">sin asignar</option>
                            <option
                                v-for="guia in guiasDisponibles"
                                :key="guia.id"
                                :value="String(guia.id)"
                            >
                                {{ guia.nombre }} - {{ guia.email }}
                            </option>
                        </select>
                    </div>

                    <div class="GrupoAcciones">
                        <button type="submit" class="BotonPrimario">
                            Crear ruta
                        </button>
                    </div>
                </form>
            </div>

            <div class="ImagenLateral" aria-hidden="true">
                <img
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
                    alt="Imagen decorativa"
                />
            </div>
        </div>
    </section>
</template>
<style scoped>
.SeccionRegistro {
    padding: 2.5rem 1.25rem 3.5rem;
}

.TarjetaRegistro {
    max-width: 1050px;
    margin: 0 auto;
    display: grid;
    gap: 0;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.FormularioRegistro {
    padding: 1.5rem;
    display: grid;
    gap: 1rem;
}

.TituloRegistro {
    margin: 0;
}

.TextoNota {
    color: #2f3f35;
    max-width: 42ch;
}

.CampoFormulario {
    display: grid;
    gap: 0.4rem;
}

.CampoFormulario label {
    font-weight: 600;
    color: #1f2b24;
}

.CampoFormulario input,
.CampoFormulario select {
    border: 1px solid #c9d7cc;
    border-radius: 8px;
    padding: 0.6rem 0.75rem;
    background: #f7fbf7;
}

.GrupoAcciones {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
}

.GrupoAcciones button {
    border-radius: 999px;
    padding: 0.6rem 1.2rem;
    font-weight: 600;
    border: 1px solid transparent;
    cursor: pointer;
}

.BotonPrimario {
    background: #234f32;
    color: #f0fff2;
}

.BotonSecundario {
    background: transparent;
    border-color: #234f32;
    color: #234f32;
}

.ImagenLateral {
    min-height: 220px;
}

.ImagenLateral img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

@media (min-width: 900px) {
    .TarjetaRegistro {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 899px) {
    .ImagenLateral {
        order: -1;
        height: 180px;
    }
}
</style>
