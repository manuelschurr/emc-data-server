<template>
  <div>
    <div class="btn-group-vertical" role="group">
      <button
        @click="setSelection($event)"
        id="btn-puls"
        class="btn btn-secondary"
      >
        Puls Oxy <br />
        Puls: 192 <br />
        SpO2: 98
      </button>
      <button
        @click="setSelection($event)"
        id="btn-stream"
        class="btn btn-secondary"
      >
        Live Bild
      </button>
      <button
        @click="setSelection($event)"
        id="btn-position"
        class="btn btn-secondary"
      >
        Position <br />
        ETA: {{ arrivalTime ? arrivalTime : "-" | secToTime }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showComponentMap: false,
      showComponentStream: false,
      showComponentPulsoxy: false,
      pastEvent: null,
      selection: []
    };
  },
  props: {
    arrivalTime: Number
  },
  methods: {
    setSelection(event) {
      this.pastEvent = event.currentTarget.id;
      if (!this.selection.includes(event.currentTarget.id)) {
        this.selection.push(event.currentTarget.id);
      } else {
        let index = this.selection.indexOf(event.currentTarget.id);
        if (index > -1) {
          this.selection.splice(index, 1);
        }
      }
      this.$root.$emit("selectedComponent", this.selection);
    }
  },
  filters: {
    secToTime: function(value) {
      var seconds = Math.floor(value % 60).toString();
      var minutes = Math.floor(value / 60).toString();
      if (seconds.length === 1) {
        seconds = "0" + seconds;
      }
      return minutes + ":" + seconds;
    }
  }
};
</script>