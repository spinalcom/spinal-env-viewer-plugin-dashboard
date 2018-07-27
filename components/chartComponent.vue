

<script>
import Vue from "vue";
import { Doughnut } from "vue-chartjs";

Chart.pluginService.register({
  beforeDraw: function(chart) {
    var width = chart.chart.width,
      height = chart.chart.height,
      ctx = chart.chart.ctx;

    ctx.restore();
    var fontSize = (height / 110).toFixed(2);
    ctx.font = fontSize + "em sans-serif";
    ctx.textBaseline = "middle";

    var text = chart.options.name;
    var textX = Math.round((width - ctx.measureText(text).width) / 2);
    var textY = height - 10;

    ctx.fillStyle = "#FFFFFF";

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
});

export default {
  name: "chartComponent",
  extends: Doughnut,
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