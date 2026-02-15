<script setup>
import { onMounted, ref } from "vue";
import { apiUrl } from "../config/api.js";

const busqueda = ref("");
const rol = ref("todos");
const usuariosBD = ref([]);

// Cargamos usuarios desde la API para pintar la tabla.
async function cargarUsuarios() {
    try {
        let respuesta = await fetch(apiUrl + "usuarios", {
            method: "GET",
        });

        let datos = await respuesta.json();

        if (Array.isArray(datos)) {
            usuariosBD.value = datos;
        } else {
            usuariosBD.value = [];
        }
    } catch (error) {
        console.log("Hubo un error al cargar los usuarios");
        usuariosBD.value = [];
    }
}

// Borrar usuario y volver a cargar lista para ver cambios al instante.
function Eliminar(id) {
    fetch(apiUrl + "usuarios?id=" + id, {
        method: "DELETE",
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Usuario eliminado");
            cargarUsuarios(); // recarga la tabla
        })
        .catch((error) => {
            console.log("Error al eliminar:", error);
        });
}

// Guardar el rol que acabamos de cambiar desde el select.
async function guardarUsuario(usuario) {
    if (!usuario.rol) {
        alert("Selecciona un rol antes de guardar");
        return;
    }

    const datosActualizados = {
        rol: usuario.rol,
    };

    try {
        const respuesta = await fetch(apiUrl + "usuarios?id=" + usuario.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosActualizados),
        });

        const textoRespuesta = await respuesta.text();
        let data = null;

        if (textoRespuesta) {
            try {
                data = JSON.parse(textoRespuesta);
            } catch (error) {
                console.log("Respuesta no es JSON:", textoRespuesta);
            }
        }

        if (!respuesta.ok) {
            const mensaje =
                data && data.message
                    ? data.message
                    : "Error del servidor al guardar";
            alert(mensaje);
            return;
        }

        console.log("Usuario actualizado");
        cargarUsuarios();
    } catch (error) {
        console.log("Error al guardar:", error);
        alert("Error al guardar el usuario");
    }
}

onMounted(function () {
    // En cuanto entra a la vista, pedimos los usuarios.
    cargarUsuarios();
});
</script>

<template>
    <section class="GestionUsuariosSeccion">
        <div class="CabeceraPanel">
            <div>
                <h2>Gestión de usuarios</h2>
                <p class="SubtituloPanel">Administración de cuentas.</p>
            </div>
            <button type="button" class="BotonPrincipa">+ Nuevo usuario</button>
        </div>

        <div class="PanelFiltros">
            <div class="CampoFiltr">
                <label for="buscar">Buscar</label>
                <input
                    id="buscar"
                    v-model="busqueda"
                    type="text"
                    placeholder="Nombre o correo"
                />
            </div>

            <div class="CampoFiltr">
                <label for="rol">Rol</label>
                <select v-model="rol">
                    <option value="admin">admin</option>
                    <option value="usuario">usuario</option>
                </select>
            </div>

            <div class="AccionesFiltro">
                <button type="button" class="BotonSecundari">Aplicar</button>
                <button type="button" class="BotonSecundari">Limpiar</button>
            </div>
        </div>

        <div class="ContenedorTabla">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="usuario in usuariosBD" :key="usuario.id">
                        <td>{{ usuario.id }}</td>
                        <td>{{ usuario.nombre }}</td>
                        <td>{{ usuario.email }}</td>
                        <td>
                            <select v-model="usuario.rol">
                                <option value="usuario">Usuario</option>
                                <option value="guia">Guía</option>
                                <option value="admin">Admin</option>
                            </select>
                        </td>

                        <td>
                            <button type="button" @click="Eliminar(usuario.id)">
                                Eliminar
                            </button>
                            <button
                                type="button"
                                @click="guardarUsuario(usuario)"
                            >
                                Guardar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="PiePanel">
            <p>Mostrando usuarios</p>
            <div class="ControlesPaginacion">
                <button type="button" class="BotonMini">Anterior</button>
                <button type="button" class="BotonMini">Siguiente</button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.GestionUsuariosSeccion {
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
