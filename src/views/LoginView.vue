
<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiUrl } from '../main.js'
// Variables reactivas simples para el formulario de inicio de sesión

const correo = ref('')
const contraseña = ref('')
const router = useRouter()
const loginData = {
    email: correo.value,
    contraseña: contraseña.value
};

fetch(apiUrl + 'usuarios?login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
})
.then(response => response.json())
.then(data => {
    if (data.status === 'success') {
        console.log('Login exitoso:', data.user);
        enviar() // Redirige a la página principal después del login exitoso
      
    } else {
        console.log('Error de login:', data.message);
    }
})
.catch(error => console.error('Error:', error));


  function enviar() {

  console.log('Enviar login:', { correo: correo.value, contraseña: contraseña.value })
  // Ejem redirigir a la página principal después del login
  router.push('/')
}
function irRegistro() {
  router.push('/registro')
}
</script>


<template>

    <section class="autenticacion">
        <div class="tarjeta">
            <div class="formulario">
             
                <h2>Iniciar sesion</h2>
                <p class="nota">
                    Accede a tu cuenta para gestionar tus reservas.
                </p>

             
                <form @submit.prevent="enviar">
                    <div class="campo">
                        <label for="email">Correo</label>
                        <input v-model="correo"
                            type="email"
                            placeholder="nombre@correo.com"
                        />
                    </div>

                    <div class="campo">
                        <label for="contrasena">Contraseña</label>
                        <input v-model="contraseña"
                            type="password"
                            placeholder="Tu contraseña"
                        
                        />
                    </div>

                    <div class="acciones">
                        <button type="submit" class="boton-primario">Enviar</button>
                        <button type="button" class="boton-secundario" @click="irRegistro">
                            ¿Aún no estás registrado?
                        </button>
                    </div>
                </form>
            </div>

          
            <div class="imagen" aria-hidden="true">
                <img
                    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                    alt=""
                />
            </div>
        </div>
    </section>
</template>

<style scoped>

.autenticacion {
    padding: 2.5rem 1.25rem 3.5rem;
}

/* Tarjeta con dos columnas */
.tarjeta {
    max-width: 1050px;
    margin: 0 auto;
    display: grid;
    gap: 0;
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(18, 35, 24, 0.12);
}

.formulario {
    padding: 2.5rem;
    display: grid;
    gap: 1rem;
}

.nota {
    color: #2f3f35;
    max-width: 42ch;
}

/* Campos del formulario */
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
    border-radius: 12px;
    padding: 0.75rem 0.9rem;
    background: #f7fbf7;
}

/* Botones visuales */
.acciones {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
}

.acciones button {
    border-radius: 999px;
    padding: 0.7rem 1.4rem;
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

/* Imagen lateral */
.imagen {
    min-height: 320px;
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
        height: 220px;
    }
}
</style>
