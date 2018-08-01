<template>
  <div class="graph">
    <div class="title">
      {{endpointS}}
    </div>

    <div class="chart">
      <line-chart-component style="width : calc(100% - 10px); height : 100%"
                            :data="chartData"
                            :options="chartOptions"></line-chart-component>
    </div>
  </div>
</template>


<script>
// var appName = "smartConnector";
import lineChartComponent from "./lineChartComponent.vue";

export default {
  name: "graphComponent",
  components: { lineChartComponent },
  props: ["endpointSelected", "appName"],
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
      var _self = this;
      this.endpointSelected
        .getRelationsByAppNameByType(this.appName, "hasHistory")[0]
        .getNodeList2()[0]
        .getElement()
        .then(el => {
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
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  stacked: true
                }
              ]
            }
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
  height: 20%;
  font-size: 16px;
  text-align: center;
}

.graph .chart {
  width: 100% !important;
  height: calc(100% - 20% - 15px) !important;
  padding: 5px;
}
</style>

