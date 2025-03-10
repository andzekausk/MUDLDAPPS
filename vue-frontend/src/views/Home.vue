<template>
    <div>
      <h1>{{ message }}</h1>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        message: "Loading..."
      };
    },
    async mounted() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}`);
        this.message = response.data.message;
      } catch (error) {
        this.message = "Failed to load message.";
      }
    }
  };
  </script>
  