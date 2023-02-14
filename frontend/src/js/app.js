import { createApp } from 'vue/dist/vue.esm-bundler';

const formulario = createApp({});
const usuarios = createApp({});

import FormularioComponent from './components/FormularioComponent.vue';
import UsuariosComponent from './components/UsuariosComponent.vue';

formulario.component('formulario-component', FormularioComponent);
usuarios.component('usuarios-component', UsuariosComponent);

formulario.mount('#formulario');
usuarios.mount('#usuarios');