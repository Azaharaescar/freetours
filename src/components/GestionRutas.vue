<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { apiUrl } from "../config/api.js";

const router = useRouter();
const rutasBD = ref([]);
const guiaSeleccionado = ref({}); //guardamos guia seleccionado para cada ruta en este objeto con id de ruta como clave
const guiasPorFecha = ref({});// guardamos guias disponibles por fecha para no repetir peticiones

async function cargarRutas() {
    try {
        //aqui traemos todas las rutas con asistentes y guia asignado si tiene
        const respuesta = await fetch(apiUrl + "rutas", {
            method: "GET",
        });
        const datos = await respuesta.json();
//Si datos es un array lo asignamos a rutas y cargamos guias disponibles para cada fecha sino dejamos rutasBD vacio
        if (Array.isArray(datos)) {
            rutasBD.value = datos;
            await cargarGuiasParaFechas(datos);

            for (let i = 0; i < datos.length; i++) {
                const ruta = datos[i];
              
                if (ruta.guia_id) {
                    guiaSeleccionado.value[ruta.id] = String(ruta.guia_id);//el select funciona con string asi que convertimos a string para que salga seleccionado ya que el id del guia viene en numero 
                } else {
                    guiaSeleccionado.value[ruta.id] = "";
                }
            }
        } else {
            rutasBD.value = [];
        }
    } catch (error) {
        console.log("Hubo un error al cargar rutas", error);
        rutasBD.value = [];
    }
}

async function cargarGuiasParaFechas(rutas) {
    //hacemos solo una llamada por fecha
    const fechasVistas = [];
//recorremos rutas y vamos cargando guias disponibles para cada fecha
    for (let i = 0; i < rutas.length; i++) {
        const fechaRuta = rutas[i].fecha;

        if (fechasVistas.includes(fechaRuta)) {//si ya hemos cargado guias para esta fecha la saltamos para no repetir
            continue;
        }
// guardamos fecha para no repetirla en siguientes iteraciones
        fechasVistas.push(fechaRuta);
//  cargamos guias disponibles para esta fecha
        try {
            const respuesta = await fetch(
                apiUrl + "asignaciones?fecha=" + fechaRuta,
                {
                    method: "GET",
                },
            );

            const datos = await respuesta.json();

            if (Array.isArray(datos)) {
                guiasPorFecha.value[fechaRuta] = datos;
            } else {
                guiasPorFecha.value[fechaRuta] = [];
            }

        } catch (error) {
            console.log("Error al cargar guias para fecha " + fechaRuta, error);
            guiasPorFecha.value[fechaRuta] = [];
        }
    }
}

function irACrearRuta() {
    router.push("/registro-rutas");
}

async function cancelarRuta(id) {
    
    const confirmar = confirm("¿Seguro que quieres cancelar esta ruta?");
    if (!confirmar) {
      
    }

    try {
        const respuesta = await fetch(apiUrl + "rutas?id=" + id, {
            method: "DELETE",
        });
        const datos = await respuesta.json();

        if (
            respuesta.ok &&
            datos &&
            (datos.status === "success" || datos.message)
        ) {
            alert("ruta cancelada");
            await cargarRutas();
        } else {
            alert("No se pudo cancelar la ruta");
        }
    } catch (error) {
        alert("No se pudo conectar con el servidor");
    }
}

function guiasParaRuta(ruta) {
    // metemos guia actual y luego los disponibles de la fecha
    const resultado = [];
//si la ruta ya tiene guia asignado lo ponemos el primero para que salga seleccionado en el select
    if (ruta.guia_id && ruta.guia_nombre && ruta.guia_email) {
        resultado.push({
            id: ruta.guia_id,
            nombre: ruta.guia_nombre,
            email: ruta.guia_email,
        });
    }

    const disponibles = guiasPorFecha.value[ruta.fecha] || [];

    for (let i = 0; i < disponibles.length; i++) {
        const guia = disponibles[i];
        let repetido = false;

        for (let j = 0; j < resultado.length; j++) {
            if (String(resultado[j].id) === String(guia.id)) {
                repetido = true;
            }
        }

        if (!repetido) {
            resultado.push(guia);
        }
    }

    return resultado;
}

async function guardarAsignacion(ruta) {
    const idGuia = guiaSeleccionado.value[ruta.id];

    if (!idGuia) {
        alert("Elige un guía para guardar la asignación");
        
    }

    try {
        const respuesta = await fetch(apiUrl + "asignaciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ruta_id: ruta.id,
                guia_id: Number(idGuia),
            }),
        });

        const datos = await respuesta.json();

        if (
            respuesta.ok &&
            datos &&
            (datos.status === "success" || datos.message)
        ) {
            alert("asignación guardada");
            await cargarRutas();
        } else {
            alert("No se pudo guardar la asignación");
        }
    } catch (error) {
        alert("No se pudo conectar con el servidor");
    }
}

onMounted(function () {
    cargarRutas();
});
</script>
<template>
    <section class="GestionRutasSeccion">
        <div class="CabeceraPanel">
            <div>
                <h2>Gestión de rutas</h2>
                <p class="SubtituloPanel">Administración de rutas</p>
            </div>
            <button type="button" class="BotonPrincipal" @click="irACrearRuta">
                Crear ruta
            </button>
        </div>

        <div class="ContenedorTabla">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titulo</th>
                        <th>Localidad</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Guía</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ruta in rutasBD" :key="ruta.id">
                        <td>{{ ruta.id }}</td>
                        <td>{{ ruta.titulo }}</td>
                        <td>{{ ruta.localidad }}</td>
                        <td>{{ ruta.fecha }}</td>
                        <td>{{ ruta.hora }}</td>
                        <td>
                            <select v-model="guiaSeleccionado[ruta.id]">
                                <option value="">sin guía</option>
                                <option
                                    v-for="guia in guiasParaRuta(ruta)"
                                    :key="guia.id"
                                    :value="String(guia.id)"
                                >
                                    {{ guia.nombre }}
                                </option>
                            </select>
                        </td>
                        <td>
                            <div class="AccionesTabla">
                                <button
                                    type="button"
                                    class="BotonMini"
                                    @click="guardarAsignacion(ruta)"
                                >
                                    Asignar
                                </button>
                                <button
                                    type="button"
                                    class="BotonPeligro"
                                    @click="cancelarRuta(ruta.id)"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="rutasBD.length === 0">
                        <td colspan="7">no hay rutas para mostrar</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="PiePanel">
            <p>Mostrando {{ rutasBD.length }} rutas</p>
        </div>
    </section>
</template>
<style scoped>
.GestionRutasSeccion {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.25rem 3rem;
    display: grid;
    gap: 1.25rem;
}

.CabeceraPanel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

h2 {
    margin: 0;
}

.SubtituloPanel {
    margin: 0.35rem 0 0;
    color: #4a5b4f;
}

td select {
    border: 1px solid #c9d7cc;
    border-radius: 10px;
    padding: 0.6rem 0.75rem;
    background: #f7fbf7;
}

.ContenedorTabla {
    overflow-x: auto;
    background: #ffffff;
    border: 1px solid #d6e2d8;
    border-radius: 14px;
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 980px;
}

th,
td {
    text-align: left;
    padding: 0.85rem 0.8rem;
    border-bottom: 1px solid #eef3ef;
}

th {
    background: #f4faf5;
    font-size: 0.92rem;
}

.AccionesTabla {
    display: flex;
    gap: 0.45rem;
}

.PiePanel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.PiePanel p {
    margin: 0;
    color: #4a5b4f;
}

.BotonPrincipal,
.BotonSecundario,
.BotonMini {
    border-radius: 999px;
    border: 1px solid transparent;
    cursor: pointer;
}

.BotonPrincipal {
    background: #234f32;
    color: #f0fff2;
    padding: 0.65rem 1rem;
    font-weight: 600;
}

.BotonSecundario {
    background: #ffffff;
    border-color: #234f32;
    color: #234f32;
    padding: 0.5rem 0.9rem;
}

.BotonMini {
    background: #f7fbf7;
    border-color: #c9d7cc;
    color: #1f2b24;
    padding: 0.35rem 0.75rem;
}

.botonPeligro {
    background: #fff0f0;
    border-color: #f2c1c1;
    color: #962b2b;
   
}
</style>
