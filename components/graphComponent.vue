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

    <!-- <div class="chart"
         v-if="!graphVisible">
      <h1>No data !</h1>
    </div> -->

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
      chartOptions: null,
      graphVisible: null,
      dataLst: null
    };
  },
  methods: {
    updateData: function() {
      this.chartData.datasets[0].data = this.dataLst.get();
    }
  },
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
      console.log("appName", this.appName);

      var historyValue = this.endpointSelected.getRelationsByAppNameByType(
        this.appName,
        "hasHistory"
      )[0];

      if (historyValue) {
        _self.graphVisible = true;
        historyValue
          .getNodeList2()[0]
          .getElement()
          .then(el => {
            el.history.bind(this.updateData);
            this.dataLst = el.history;
            _self.chartData = {
              labels: [],
              datasets: [
                {
                  label: "Courbe",
                  data: el.history.get(),
                  backgroundColor: "#f87979"
                }
              ]
            };

            for (var i = 0; i < el.windowSize.get(); i++) {
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
              },
              legend: {
                display: false
              }
            };
          });
      } else {
        // _self.chartData = {
        //   title: "",
        //   labels: ["0", "1", "2"],
        //   datasets: [
        //     {
        //       label: "Courbe",
        //       data: [],
        //       backgroundColor: "#f87979"
        //     }
        //   ]
        // };
        _self.graphVisible = true;
      }
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
