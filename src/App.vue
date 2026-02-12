<script setup>
import FooterSimple from "./components/FooterSimple.vue";
import HeaderSimple from "./components/HeaderSimple.vue";
import {ref} from "vue";

//Habría que controlar cuando se inicia sesión y se cierra con un emit desde el hijo y tener un dato
// de sesión reactivo para pasarlo a la barra de navegación como props
const datosSesion= ref(JSON.parse(localStorage.getItem('sesion')));

function actualizaDatosSesion(usuario){
 
  datosSesion.value=usuario;
  if(usuario ){
    localStorage.setItem("sesion", JSON.stringify(usuario));
  }
    

  else
    localStorage.removeItem("sesion");

}
</script>

<template>
    <HeaderSimple />
    <router-view />
    <FooterSimple />
</template>

<style scoped></style>
