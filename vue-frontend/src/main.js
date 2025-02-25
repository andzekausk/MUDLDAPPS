import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import { createPinia } from "pinia";

import FullCalendar from '@fullcalendar/vue3';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';

const app = createApp(App);

app.component('FullCalendar', FullCalendar);

app.use(createPinia());
app.use(router);
app.mount("#app");