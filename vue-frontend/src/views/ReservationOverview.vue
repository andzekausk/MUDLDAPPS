<template>
  <div class='demo-app'>
    <FullCalendar
      class='demo-app-calendar'
      ref="fullCalendar"
      :options='calendarOptions'
    >
      <template v-slot:eventContent='arg'>
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from "@fullcalendar/list";

export default {

  components: {
    FullCalendar // makes the <FullCalendar> tag available
  },

  data: function() {
    return {
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
          listPlugin
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'timeGridWeek',
        firstDay: 1, 
        locale: 'lv',
        editable: true,
        events: [
          { title: 'Event Now', start: new Date() }
        ],
        dateClick: this.handleDateClick,
        buttonText: {
          today: 'Šodien',
          month: 'Mēnesis',
          week: 'Nedēļa',
          day: 'Diena',
          list: 'Saraksts'
        },
        allDayText: 'Visu dienu'
      }
    }
  },

  methods: {

    handleDateClick(arg) {
      if (confirm('Izveidot jaunu rezervāciju ' + arg.dateStr + ' ?')) {
        let calendarApi = this.$refs.fullCalendar.getApi()
        calendarApi.addEvent({
          title: 'Rezervācija',
          start: arg.date,
          allDay: arg.allDay
        })
      }
    }
  }
}

</script>

<style lang='css'>

.demo-app {
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-calendar {
  margin: 0 auto;
  max-width: 900px;
}

</style>
