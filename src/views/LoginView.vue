<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiUrl } from "../main.js";
// Variables del formulario (lo que escribe el usuario)

const correo = ref("");
const contraseña = ref("");
const router = useRouter();

async function enviar() {
    // Mini validación para no mandar el formulario vacío (evitamos sustos tontos)
    if (!correo.value || !contraseña.value) {
        alert("Rellena correo y contraseña");
        return;
    }

    // Preparamos el body exactamente como lo la API
    const datosLogin = {
        email: correo.value.trim(),
        contraseña: contraseña.value,
    };

    try {
        const respuesta = await fetch(apiUrl + "usuarios?login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosLogin),
        });
        //    console.log(respuesta);
        //const datos = await respuesta.text();
        const datos = await respuesta.json();
        console.log(datos);

        if (datos.status === "success") {
            // Guardamos sesión para que no se pierda al recargar la página
            localStorage.setItem("sesion", JSON.stringify(datos.user));
            router.push("/");
            return;
        }

        // Si el backend dice que no, mostramos mensaje amigable
        alert(datos.message || "Correo o contraseña incorrectos");
    } catch (error) {
        console.error("Error en login:", error);
        alert("No se pudo conectar con el servidor");
    }
}

function irRegistro() {
    router.push("/registro");
}
</script>

<template>
    <section class="SeccionAutenticacion">
        <div class="TarjetaAcceso">
            <div class="FormularioAcceso">
                <h2>Iniciar sesion</h2>
                <p class="TextoNota">
                    Accede a tu cuenta para gestionar tus reservas.
                </p>

                <form @submit.prevent="enviar">
                    <div class="CampoFormulario">
                        <label for="email">Correo</label>
                        <input
                            v-model="correo"
                            type="email"
                            placeholder="nombre@correo.com"
                        />
                    </div>

                    <div class="CampoFormulario">
                        <label for="contrasena">Contraseña</label>
                        <input
                            v-model="contraseña"
                            type="password"
                            placeholder="Tu contraseña"
                        />
                    </div>

                    <div class="GrupoAcciones">
                        <button type="submit" class="BotonPrimario">
                            Enviar
                        </button>
                        <button
                            type="button"
                            class="BotonSecundario"
                            @click="irRegistro"
                        >
                            ¿Aún no estás registrado?
                        </button>
                    </div>
                </form>
            </div>

            <div class="ImagenLateral" aria-hidden="true">
                <img
                    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                    alt=""
                />
            </div>
        </div>
    </section>
</template>

<style scoped>
.SeccionAutenticacion {
    padding: 2.5rem 1.25rem 3.5rem;
}

/* Tarjeta con dos columnas */
.TarjetaAcceso {
    max-width: 1050px;
    margin: 0 auto;
    display: grid;
    gap: 0;
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(18, 35, 24, 0.12);
}

.FormularioAcceso {
    padding: 2.5rem;
    display: grid;
    gap: 1rem;
}

.TextoNota {
    color: #2f3f35;
    max-width: 42ch;
}

/* Campos del formulario */
.CampoFormulario {
    display: grid;
    gap: 0.4rem;
}

.CampoFormulario label {
    font-weight: 600;
    color: #1f2b24;
}

.CampoFormulario input {
    border: 1px solid #c9d7cc;
    border-radius: 12px;
    padding: 0.75rem 0.9rem;
    background: #f7fbf7;
}

/* Botones visuales */
.GrupoAcciones {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
}

.GrupoAcciones button {
    border-radius: 999px;
    padding: 0.7rem 1.4rem;
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

/* Imagen lateral */
.ImagenLateral {
    min-height: 320px;
}

.ImagenLateral img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

@media (min-width: 900px) {
    .TarjetaAcceso {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 899px) {
    .ImagenLateral {
        order: -1;
        height: 220px;
    }
}
</style>
