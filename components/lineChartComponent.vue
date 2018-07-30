

<script>
import Vue from "vue";
import { Line } from "vue-chartjs";

export default {
  name: "lineChartComponent",
  extends: Line,
  props: ["data", "options"],
  // mounted() {
  //   console.log("data", this.data);
  //   console.log("options", this.options);
  //   this.renderChart(this.data, this.options);
  // },
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
  height: 100% !important;
  background: green;
}
</style>
