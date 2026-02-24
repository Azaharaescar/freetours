<template>
    <div class="about">
        <h1>Nosotros</h1>
        <video
            ref="video"
            id="medio"
            width="720"
            height="400"
            style="display: block; margin: 2rem auto 1rem auto"
        >
            <source src="/paisaje.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
        </video>
        <nav class="ControlesVideo">
            <input
                type="button"
                id="reiniciar"
                value="reiniciar"
                @click="accionReiniciar"
            />
            <input
                type="button"
                id="retrasar"
                value="«"
                @click="accionRetrasar"
            />
            <input
                v-if="!reproduciendo"
                type="button"
                id="play"
                value="▶"
                @click="accionPlay"
            />
            <input
                v-else
                type="button"
                id="pause"
                value="||"
                @click="accionPlay"
            />
            <input
                type="button"
                id="adelantar"
                value="»"
                @click="accionAdelantar"
            />
            <input
                type="button"
                id="silenciar"
                :value="silenciado ? 'sonar' : 'silenciar'"
                @click="accionSilenciar"
            />
            <label>Volumen</label>
            <input
                type="button"
                id="menosVolumen"
                value="-"
                @click="accionMenosVolumen"
            />
            <input
                type="button"
                id="masVolumen"
                value="+"
                @click="accionMasVolumen"
            />
        </nav>
    </div>
</template>

<script setup>
import { ref } from "vue";

const video = ref(null);
const reproduciendo = ref(false);
const silenciado = ref(false);

function accionPlay() {
    const medio = video.value;
    if (!medio.paused && !medio.ended) {
        medio.pause();
        reproduciendo.value = false;
        document.body.style.backgroundColor = "#fff";
    } else {
        medio.play();
        reproduciendo.value = true;
        document.body.style.backgroundColor = "grey";
    }
}

function accionReiniciar() {
    const medio = video.value;
    medio.currentTime = 0;
    medio.play();
    reproduciendo.value = true;
    document.body.style.backgroundColor = "grey";
}

function accionRetrasar() {
    const medio = video.value;
    medio.currentTime -= 5;
    if (medio.currentTime < 0) medio.currentTime = 0;
}

function accionAdelantar() {
    const medio = video.value;
    medio.currentTime += 5;
    if (medio.currentTime > medio.duration) medio.currentTime = medio.duration;
}

function accionSilenciar() {
    const medio = video.value;
    medio.muted = !medio.muted;
    silenciado.value = medio.muted;
}

function accionMasVolumen() {
    const medio = video.value;
    if (medio.volume < 1) {
        medio.volume += 0.1;
        if (medio.volume > 1) medio.volume = 1;
    }
}

function accionMenosVolumen() {
    const medio = video.value;
    if (medio.volume > 0) {
        medio.volume -= 0.1;
        if (medio.volume < 0) medio.volume = 0;
    }
}
</script>
<style>
nav.ControlesVideo {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
}
nav.ControlesVideo input[type="button"] {
    border-radius: 999px;
    border: 1px solid #c9d7cc;
    background: #f7fbf7;
    color: #1f2b24;
    padding: 0.35rem 0.75rem;
    font-size: 1.1rem;
    cursor: pointer;
    min-width: 40px;
    transition: background 0.2s;
}
nav.ControlesVideo input[type="button"]:hover {
    background: #e0f0e0;
}
nav.ControlesVideo label {
    margin: 0 0.5rem;
    color: #234f32;
    font-weight: 600;
}
</style>
