<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiUrl } from "../config/api.js";

const nombre = ref("");
const correo = ref("");
const contraseña = ref("");

const router = useRouter();

async function enviar() {
    // Validación básica para que no te llegue basura al backend
    if (!nombre.value || !correo.value || !contraseña.value) {
        alert("Completa todos los campos");
        return;
    }

    // Regla simple: contraseña de mínimo 8 chars (tu placeholder ya lo pide)
    if (contraseña.value.length < 8) {
        0;
        alert("La contraseña debe tener mínimo 8 caracteres");
        return;
    }

    // Armamos el objeto con el formato que pide la API
    const datosUsuario = {
        nombre: nombre.value.trim(),
        email: correo.value.trim(),
        contraseña: contraseña.value,
    };

    try {
        const respuesta = await fetch(apiUrl + "usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosUsuario),
        });

        const datos = await respuesta.json();

        // Si todo fue bien, lo normal: mandamos al login
        if (datos.status === "success" || datos.id || datos.message) {
            alert("Cuenta creada correctamente");
            console.log(datos);

            router.push("/login");
            return;
        }

        alert(datos.message || "No se pudo crear la cuenta");
    } catch (error) {
        console.error("Error en registro:", error);
        alert("No se pudo conectar con el servidor");
    }
}

function irLogin() {
    router.push("/login");
}
</script>

<template>
    <section class="SeccionRegistro">
        <div class="TarjetaRegistro">
            <div class="FormularioRegistro">
                <h2 class="TituloRegistro">Crear cuenta</h2>
                <p class="TextoNota">
                    Completa tus datos para unirte a FreeTours.
                </p>

                <form @submit.prevent="enviar">
                    <div class="CampoFormulario">
                        <label for="nombre">Nombre completo</label>
                        <input
                            id="nombre"
                            v-model="nombre"
                            type="text"
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div class="CampoFormulario">
                        <label for="correo">Correo</label>
                        <input
                            id="correo"
                            v-model="correo"
                            type="email"
                            placeholder="nombre@correo.com"
                        />
                    </div>

                    <div class="CampoFormulario">
                        <label for="contrasena">Contraseña</label>
                        <input
                            id="contrasena"
                            v-model="contraseña"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                        />
                    </div>

                    <div class="GrupoAcciones">
                        <button type="submit" class="BotonPrimario">
                            Crear cuenta
                        </button>
                        <button
                            type="button"
                            class="BotonSecundario"
                            @click="irLogin"
                        >
                            Ir a iniciar sesión
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

.CampoFormulario input {
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
