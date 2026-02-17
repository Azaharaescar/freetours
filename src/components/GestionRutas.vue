<script setup>
import { onMounted, ref } from "vue";
import { apiUrl } from "../config/api.js";
const rutasBD = ref([]);
async function cargarRutas() {
    try {
        //hacemos la petición a la API para traer los usuarios
        //fetch por defecto  promesa que hace GET coge datos , asi que no hace falta especificarlo
        let respuesta = await fetch(apiUrl + "rutas", {
            method: "GET",
        });
        //la API responde con un json asique lo convertimos a objeto de javascript
        let datos = await respuesta.json();
        //si datos es un array los metemos en usuariosBD
        // a Usuarios filtrados le damos el valor de usuariosbd para tenerlos de referencia sin modificar
        if (Array.isArray(datos)) {
            rutasBD.value = datos;
            //si no es un array dejamos la tabla vacia y mostramos un error en consola
        } else {
           rutasBD.value = [];
            console.log("Error: la respuesta de la API no es un array");
        }
        //si hay algun error en la petición o al procesar los datos lo mostramos en consola y dejamos la tabla vacia
    } catch (error) {
        console.log("Hubo un error al cargar los usuarios");
        rutasBD.value = [];
    }
}
onMounted(function () {
    // en cuanto entra a la vista pedimos las rutas.
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
        </div>

        <div class="PanelFiltros">
            <div class="CampoFiltro">
                <label for="buscar">Buscar</label>
                <input
                    v-model="busqueda"
                    type="text"
                    placeholder="Titulo"
                />
            </div>


            <div class="AccionesFiltro">
                <button
                    type="button"
                    class="BotonSecundario"
                >
                    Aplicar
                </button>
            </div>
        </div>

        <div class="ContenedorTabla">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titulo</th>
                        <th>Localidad</th>
                        <th>Fecha</th>
                        <th>Acciones</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ruta in rutasBD" :key="ruta.id">
                        <td>{{ ruta.id }}</td>
                        <td>{{ ruta.titulo }}</td>
                        <td>{{ ruta.localidad }}</td>
                        <td>{{ ruta.fecha }}</td>
                        <td>
                            <button type="button" @click="Eliminar(usuario.id)">
                                Eliminar
                            </button>
                            <button
                                type="button"
                                @click="guardarRuta(ruta)"
                            >
                                Guardar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="PiePanel">
            <p>Mostrando rutas</p>
            <div class="ControlesPaginacion">
                <button type="button" class="BotonMini">Anterior</button>
                <button type="button" class="BotonMini">Siguiente</button>
            </div>
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

.PanelFiltros {
    background: #ffffff;
    border: 1px solid #d6e2d8;
    border-radius: 14px;
    padding: 1rem;
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    align-items: end;
}

.CampoFiltro {
    display: grid;
    gap: 0.35rem;
}

.CampoFiltro label {
    font-weight: 600;
    color: #1f2b24;
}

.CampoFiltro input,
.CampoFiltro select {
    border: 1px solid #c9d7cc;
    border-radius: 10px;
    padding: 0.6rem 0.75rem;
    background: #f7fbf7;
}

.AccionesFiltro {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
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
    min-width: 760px;
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

.EtiquetaEstado {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 0.2rem 0.65rem;
    font-size: 0.8rem;
    background: #e8f3ea;
    color: #1f4a2d;
}

.EtiquetaEstado.bloqueado {
    background: #ffe6e6;
    color: #8a1f1f;
}

.EtiquetaEstado.pendiente {
    background: #fff5d9;
    color: #7d5a00;
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

.ControlesPaginacion {
    display: flex;
    gap: 0.5rem;
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

.BotonSecundario.EstadoGhost {
    border-color: #9caf9f;
    color: #2f3f35;
}

.BotonMini {
    background: #f7fbf7;
    border-color: #c9d7cc;
    color: #1f2b24;
    padding: 0.35rem 0.75rem;
}

.BotonMini.EstadoPeligro {
    background: #fff0f0;
    border-color: #f2c1c1;
    color: #962b2b;
}

</style>