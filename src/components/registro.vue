<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiUrl } from '../main.js'


const nombre = ref('')
const correo = ref('')
const contraseña = ref('')

const router = useRouter()

const userData = {
    nombre: nombre.value,
    email: correo.value,
    contraseña: contraseña.value
};

fetch(apiUrl + 'usuarios?registro', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
})
.then(response => response.json())
.then(data => console.log('Respuesta:', data))
.catch(error => console.error('Error:', error));





function enviar() {
    console.log('Registro enviado', { nombre: nombre.value, correo: correo.value, contraseña: contraseña.value })
    // Aquí iría la llamada a la API para crear la cuenta
    // Después redirigir al login o a la página principal
    router.push('/login')
}

function irLogin() {
    router.push('/login')
}
</script>

<template>

    <section class="contenedor">
        <div class="tarjeta">
            <div class="formulario">

                <h2 class="titulo">Crear cuenta</h2>
                <p class="nota">Completa tus datos para unirte a FreeTours.</p>

                <form @submit.prevent="enviar">
                    <div class="campo">
                        <label for="nombre">Nombre completo</label>
                        <input id="nombre" v-model="nombre" type="text" placeholder="Tu nombre" />
                    </div>

                    <div class="campo">
                        <label for="correo">Correo</label>
                        <input id="correo" v-model="correo" type="email" placeholder="nombre@correo.com" />
                    </div>

                    <div class="campo">
                        <label for="contrasena">Contraseña</label>
                        <input id="contrasena" v-model="contraseña" type="password" placeholder="Mínimo 8 caracteres" />
                    </div>

                    <div class="acciones">
                        <button type="submit" class="boton-primario">Crear cuenta</button>
                        <button type="button" class="boton-secundario" @click="irLogin">Ir a iniciar sesión</button>
                    </div>
                </form>

            </div>

            <div class="imagen" aria-hidden="true">
                <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80" alt="Imagen decorativa" />
            </div>
        </div>
    </section>

</template>

<style scoped>
.contenedor {
    padding: 2.5rem 1.25rem 3.5rem;
}

.tarjeta {
    max-width: 1050px;
    margin: 0 auto;
    display: grid;
    gap: 0;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.formulario {
    padding: 1.5rem;
    display: grid;
    gap: 1rem;
}

.titulo {
    margin: 0;
}

.nota {
    color: #2f3f35;
    max-width: 42ch;
}

.campo {
    display: grid;
    gap: 0.4rem;
}

.campo label {
    font-weight: 600;
    color: #1f2b24;
}

.campo input {
    border: 1px solid #c9d7cc;
    border-radius: 8px;
    padding: 0.6rem 0.75rem;
    background: #f7fbf7;
}

.acciones {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
}

.acciones button {
    border-radius: 999px;
    padding: 0.6rem 1.2rem;
    font-weight: 600;
    border: 1px solid transparent;
    cursor: pointer;
}

.boton-primario {
    background: #234f32;
    color: #f0fff2;
}

.boton-secundario {
    background: transparent;
    border-color: #234f32;
    color: #234f32;
}

.imagen {
    min-height: 220px;
}

.imagen img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

@media (min-width: 900px) {
    .tarjeta {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 899px) {
    .imagen {
        order: -1;
        height: 180px;
    }
}
</style>
