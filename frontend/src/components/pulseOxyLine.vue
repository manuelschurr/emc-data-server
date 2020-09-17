<script>
import { Line, mixins } from "vue-chartjs";

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartData: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Array | Object,
      required: false,
    },
    chartLabels: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Array | Object,
      required: false,
    },
  },
  // Returns the options of the PulseOxy chart.
  data() {
    return {
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                display: true,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        height: 220,
      },
    };
  },
  // Redndering chart with the transmitted chartdata and the options defined above in data()
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
