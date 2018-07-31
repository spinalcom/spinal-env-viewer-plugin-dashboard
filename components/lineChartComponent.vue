

<script>
import Vue from "vue";
import { Line } from "vue-chartjs";

export default {
  name: "lineChartComponent",
  extends: Line,
  props: ["data", "options"],
  mounted() {
    if (this.data && this.options) {
      this.renderChart(this.data, this.options);
    }
  },
  watch: {
    data: function() {
      this.renderChart(this.data, this.options);
    },
    options: function() {
      this.renderChart(this.data, this.options);
    }
  }
};
</script>


<style>
canvas#line-chart {
  width: 100%;
  height: 100% !important;
}
</style>
