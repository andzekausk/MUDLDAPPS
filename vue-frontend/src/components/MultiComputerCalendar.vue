<template>
  <div class="calendar-container">
    <!-- nav bar -->
    <div class="calendar-header">
      <button @click="changeDate('prev')">Iepriekšējais</button>
      <h2>{{ currentDate }}</h2>
      <input ref="hiddenDateInput" type="date" class="calendar-date-input" @change="handleDatePicked" @keydown.prevent @paste.prevent
        @input.prevent />
      <button @click="changeDate('next')">Nākamais</button>
      <button @click="resetDate">Šodiena</button>
    </div>

    <div class="calendars">
      <div v-for="(computer, index) in computers" :key="computer.computer_id" class="calendar-wrapper"
        :class="(index % 4 === 0) ? 'wide' : 'not-show narrow'">
        <h3 class="align-title">{{ computer.computer_name }}</h3>
        <FullCalendar ref="calendars" :options="getCalendarOptions(computer.computer_id)" />
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  name: "MultiComputerCalendar",
  components: {
    FullCalendar,
  },
  props: {
    computers: Array,
    reservations: Array,
    selectedRequest: Object,
    initialDate: String,
  },
  data() {
    return {
      currentDate: this.initialDate || new Date().toLocaleDateString("lv-LV"),
    };
  },

  watch: {
    initialDate(newDate) {
      if (newDate) {
        const parsed = new Date(newDate);
        this.$refs.calendars.forEach((calendar) => {
          const api = calendar.getApi();
          api.gotoDate(parsed);
          this.updateCurrentDate(api);
        });
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.syncScrolling();
      }, 100);
    });
    if (this.initialDate) {
      const date = new Date(this.initialDate);
      this.$refs.calendars.forEach(calendar => {
        calendar.getApi().gotoDate(date);
        this.updateCurrentDate(calendar.getApi());
      });
    }
  },
  methods: {
    getCalendarOptions(computerId) {
      const events = this.reservations.filter(
        (reservation) =>
          reservation.computer_id === computerId && reservation.status !== "denied"
      ).map(reservation => {
        const isHighlighted = reservation.request_id === this.selectedRequest?.request_id;

        return {
          ...reservation,
          className: isHighlighted ? "highlighted-reservation" : "",
        };
      });
      return {
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: "timeGridDay",
        locale: "lv",
        headerToolbar: false,
        allDaySlot: false,
        events,
        nowIndicator: true,
      };
    },
    handleDatePicked(event) {
      const selectedDate = new Date(event.target.value);
      this.$refs.calendars.forEach((calendar) => {
        const api = calendar.getApi();
        api.gotoDate(selectedDate);
        this.updateCurrentDate(api);
      });
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
      const date = api.getDate();
      this.currentDate = date.toLocaleDateString("lv-LV");
    },
    syncScrolling() {
      this.$nextTick(() => {
        const timeGrids = document.querySelectorAll(".fc-scroller");

        timeGrids.forEach((grid) => {
          grid.addEventListener("scroll", (e) => {
            const scrollTop = e.target.scrollTop;
            timeGrids.forEach((other) => {
              if (other !== e.target) other.scrollTop = scrollTop;
            });
          });
        });
      });
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
  /* overflow-x: auto;  scroll horizontally */
  white-space: nowrap;
  padding-bottom: 10px;
  /* scrollbar wont hide content */
}

.calendar-wrapper {
  flex: 0 0 auto;
  width: 100px;
  /* min-width: 100px;  */
  height: 500px;
  background: white;
  /* padding: 10px; */
  border-radius: 6px;
}

.narrow {
  width: 90px;
}

.wide {
  width: 110px;
}

.align-title {
  text-align: right;
  padding-right: 3px;
}

/* Uses all height */
.fc {
  height: 100%;
}

/* Hides title of day */
.fc-col-header {
  display: none;
}

/* Hides scrollbar Chrome/Safari */
.fc-scroller::-webkit-scrollbar {
  width: 0px;
}

/* Hides scrollbar Firefox */
.fc-scroller {
  scrollbar-width: none;
}

.fc-col-header,
.fc-scrollgrid-sync-table,
.fc-daygrid-body.fc-daygrid-body-unbalanced.fc-daygrid-body-natural,
.fc-daygrid-body.fc-daygrid-body-unbalanced,
.fc-timegrid-body,
.fc-timegrid-slots table,
.fc-timegrid-cols table {
  width: 100% !important;
}

.not-show .fc-timegrid-slot-label {
  display: none;
}

/* Removes background color from current day */
.fc-day-today {
  background: transparent !important;
}

.highlighted-reservation {
  border: 2px solid rgb(0, 132, 219) !important;
  border-radius: 4px;
  box-sizing: border-box;
}

.datepicker-input {
  font-size: 16px;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

</style>

<style scoped>
.calendar-date-input::-webkit-datetime-edit {
  display: none;
}
</style>