<script setup>
import { onMounted, ref } from "vue";
import { apiUrl } from "../config/api.js";
//lo que la persona va escribiendo en los filtros
const busqueda = ref("");
//rol que se ha seleccionado en el filtro de rol.
const rol = ref();
//usuarios que se muestran en la tabla después de aplicar filtros
const usuariosBD = ref([]);

//cargamos usuarios desde la API para pintar la tabla
async function cargarUsuarios() {
    try {
        //hacemos la petición a la API para traer los usuarios
        //fetch por defecto  promesa que hace GET coge datos , asi que no hace falta especificarlo
        let respuesta = await fetch(apiUrl + "usuarios", {
            method: "GET",
        });
        //la API responde con un json asique lo convertimos a objeto de javascript
        let datos = await respuesta.json();
        //si datos es un array los metemos en usuariosBD
        // a Usuarios filtrados le damos el valor de usuariosbd para tenerlos de referencia sin modificar
        if (Array.isArray(datos)) {
            usuariosBD.value = datos;
            //si no es un array dejamos la tabla vacia y mostramos un error en consola
        } else {
            usuariosBD.value = [];
            console.log("Error: la respuesta de la API no es un array");
        }
        //si hay algun error en la petición o al procesar los datos lo mostramos en consola y dejamos la tabla vacia
    } catch (error) {
        console.log("Hubo un error al cargar los usuarios");
        usuariosBD.value = [];
    }
}

//borrar usuario y volver a cargar lista para ver cambios al instante
function Eliminar(id) {
    //pedimos a la api que borre el usuario con el id que le pasamos
    fetch(apiUrl + "usuarios?id=" + id, {
        method: "DELETE",
    })
    //convertimos a objeto js porque nos devuelve un jsion 
        .then((response) => response.json())
        //si la respuesta no es un JSON válido lo mostramos en consola para depurar
        .then((data) => {
            console.log("Usuario eliminado");
            cargarUsuarios(); // recarga la tabla para ver los cambios al instante
        })
        .catch((error) => {
            console.log("Error al eliminar:", error);
        });
}

// Guardar el rol que acabamos de cambiar desde el select
async function guardarUsuario(usuario) {
    //si el usuario no tiene rol seleccionado, mostramos un error y no hacemos la petición
    if (!usuario.rol) {
        alert("Selecciona un rol antes de guardar");
        return;
    }
    //preparamos los datos que vamos a enviar a la API para actualizar el usuario.
    const datosActualizados = {
        rol: usuario.rol,
    };

    try {
        //hacemos la petición a la API para actualizar el usuario
        const respuesta = await fetch(apiUrl + "usuarios?id=" + usuario.id, {
            method: "PUT", //el método PUT se usa para actualizar recursos existentes
            headers: {
                "Content-Type": "application/json", //indicamos que el cuerpo de la petición es un JSON.
            },
            //convertimos los datos actualizados a JSON para enviarlos en el cuerpo de la petición.
            body: JSON.stringify(datosActualizados),
        });
        //la API responde con un JSON, así que lo convertimos a objeto de JS.
        const textoRespuesta = await respuesta.text();
        //let data = null para poder usarlo en el bloque de código siguiente
        //donde si la respuesta es un JSON válido lo asignamos a data
        //  y si no lo es mostramos el texto de la respuesta en consola para depurar.
        let data = null;

        //si la respuesta tiene texto, intentamos convertirlo a JSON.
        if (textoRespuesta) {
            try {
                data = JSON.parse(textoRespuesta);
            } catch (error) {
                console.log("Respuesta no es JSON:", textoRespuesta);
            }
        }
        //si la respuesta no es ok mostramos un error con el mensaje que venga en el json o un mensaje atuomatico.
        if (!respuesta.ok) {
            let mensaje = "Error del servidor al guardar";

            if (data) {
                if (data.message) {
                    mensaje = data.message;
                }
            }

            alert(mensaje);
        }

        console.log("Usuario actualizado");
        cargarUsuarios();
    } catch (error) {
        console.log("Error al guardar:", error);
        alert("Error al guardar el usuario");
    }
}

function filtrarUsuarios(busqueda, rol) {
    //empezamos con la lista completa de usuarios sin filtrar
    let filtrados = usuariosBD;
    if (busqueda.value) {
        const busquedaMinuscula = busqueda.value.toLowerCase();
        filtrados = filtrados.filter(
            (usuario) =>
                usuario.nombre.toLowerCase().includes(busquedaMinuscula) ||
                usuario.email.toLowerCase().includes(busquedaMinuscula),
        );
    }

    /*si se ha seleccionado un rol filtramos por ese rol con filter
    if (rol.value !== "todos") {
        filtrados = filtrados.filter((usuario) => usuario.rol === rol.value);
    }
*/
    //actualizamos la lista de usuarios que se muestra en la tabla.
    usuariosBD.value = filtrados;
}

onMounted(function () {
    // en cuanto entra a la vista pedimos los usuarios.
    cargarUsuarios();
});
</script>

<template>
    <section class="GestionUsuariosSeccion">
        <div class="CabeceraPanel">
            <div>
                <h2>Gestión de usuarios</h2>
                <p class="SubtituloPanel">Administración de cuentas</p>
            </div>
        </div>

        <div class="PanelFiltros">
            <div class="CampoFiltro">
                <label for="buscar">Buscar</label>
                <input
                    v-model="busqueda"
                    type="text"
                    placeholder="Nombre o correo"
                />
            </div>

            <div class="CampoFiltro">
                <label for="rol">Rol</label>
                <select v-model="rol">
                    <option value="todos">todos</option>
                    <option value="cliente">cliente</option>
                    <option value="guia">guía</option>
                    <option value="admin">admin</option>
                </select>
            </div>

            <div class="AccionesFiltro">
                <button
                    type="button"
                    @click="filtrarUsuarios"
                    class="BotonSecundario"
                >
                    Aplicar
                </button>
                <button type="button" class="BotonSecundario">Limpiar</button>
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
                                <option value="cliente">Cliente</option>
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
