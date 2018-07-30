<template>
  <div class="graph">
    <div class="title">
      {{endpointS}}
    </div>

    <div class="chart">
      <line-chart-component id="line"
                            :data="chartData"
                            :options="chartOptions"></line-chart-component>
    </div>
  </div>
</template>


<script>
var appName = "smartConnector3";
import lineChartComponent from "./lineChartComponent.vue";

export default {
  name: "graphComponent",
  components: { lineChartComponent },
  props: ["endpointSelected"],
  data() {
    return {
      chartData: null,
      chartOptions: null
    };
  },
  methods: {},
  computed: {
    endpointS: function() {
      if (this.endpointSelected) {
        return this.endpointSelected.name.get();
      }
      return "";
    }
  },
  watch: {
    endpointSelected: function() {
      console.log("enddpoint changed");
      var _self = this;
      this.endpointSelected
        .getRelationsByAppNameByType("smartConnector3", "hasHistory")[0]
        .getNodeList2()[0]
        .getElement()
        .then(el => {
          console.log("el", el);

          _self.chartData = {
            labels: [],
            datasets: [
              {
                label: "Courbe",
                data: el.get(),
                backgroundColor: "#f87979"
              }
            ]
          };

          for (var i = 0; i < el.length; i++) {
            _self.chartData.labels.push(i.toString());
          }

          _self.chartOptions = {
            responsive: false,
            maintainAspectRatio: false
          };
        });
    }
  }
};
</script>


<style>
.graph {
  width: 100%;
  height: calc(50% - 20px) !important;
}

.graph .title {
  width: 100%;
  height: 30%;
  font-size: 16px;
}

.graph .chart {
  width: 100% !important;
  height: calc(100% - 30% - 15px) !important;
}
</style>

