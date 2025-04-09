<template>
  <div>
    <MultiComputerCalendar
      :computers="computers"
      :reservations="reservations"
    />
  </div>
</template>

<script>
import MultiComputerCalendar from "../components/MultiComputerCalendar.vue";
import api from "../services/api";

export default {
  components: {
    MultiComputerCalendar,
  },
  data() {
    return {
      computers: [],
      reservations: [],
    };
  },
  async mounted() {
    await this.fetchComputers();
    await this.fetchReservations();
  },
  methods: {
    async fetchComputers() {
      try {
        const response = await api.get(`/computers`);
        this.computers = response.data.computers;
      } catch (error) {
        console.error("Failed to fetch computers:", error);
      }
    },
    async fetchReservations() {
      try {
        const response = await api.get(`/reservations`);
        this.reservations = response.data;
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    },
  },
};
</script>




