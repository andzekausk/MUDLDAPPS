<template>
  <div class="calendar-container">
    <!-- nav bar -->
    <div class="calendar-header">
      <button @click="changeDate('prev')">Iepriekšējais</button>
      <h2>{{ currentDate }}</h2>
      <button @click="changeDate('next')">Nākamais</button>
      <button @click="resetDate">Šodiena</button>
    </div>

    <!-- Calendar grid view -->
    <div class="calendars">
      <div v-for="computer in computers" :key="computer.computer_id" class="calendar-wrapper">
        <h3>{{ computer.computer_name }}</h3>
        <FullCalendar ref="calendars" :options="getCalendarOptions(computer.computer_id)" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      computers: [],
      reservations: [],
      currentDate: new Date().toISOString().split("T")[0],
    };
  },
  mounted() {
    this.fetchComputers();
    this.fetchReservations();
  },
  methods: {
    async fetchComputers() {
    try {
        const response = await axios.get("http://localhost:3000/api/computers");
        this.computers = response.data.computers; 
    } catch (error) {
        console.error("Failed to fetch computers:", error);
    }
    },
    async fetchReservations() {
      try {
        const response = await axios.get("http://localhost:3000/api/reservations");
        console.log("Reservations:", response.data);
        this.reservations = response.data;
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    },
    getCalendarOptions(computerId) {
      const events = (this.reservations || []).filter(
        (reservation) => reservation.computer_id === computerId
      );
      return {
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: "timeGridDay",
        locale: "lv",
        headerToolbar: false,
        allDaySlot: false,
        events,
      };
    },
    changeDate(action) {
      this.$refs.calendars.forEach((calendar) => {
        const api = calendar.getApi();
        if (action === "prev") api.prev();
        else if (action === "next") api.next();
        this.updateCurrentDate(api);
      });
    },
    resetDate() {
      this.$refs.calendars.forEach((calendar) => {
        calendar.getApi().today();
        this.updateCurrentDate(calendar.getApi());
      });
    },
    updateCurrentDate(api) {
      this.currentDate = api.getDate().toISOString().split("T")[0];
    },
  },
};
</script>

<style>
.calendar-container {
  text-align: center;
  padding: 20px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.calendars {
  display: flex;
  overflow-x: auto;  /* scroll horizontally */
  white-space: nowrap;
  padding-bottom: 10px; /* scrollbar wont hide content */
}

.calendar-wrapper {
  flex: 0 0 auto;  
  width: 100px;  
  min-width: 100px; 
  height: 500px; 
  background: white;
  padding: 10px;
  border-radius: 6px;
}

.fc {
  height: 100%; /* Uses all height */
}
.fc-col-header {  
  display: none; /* Hides title of day */
}
</style>
