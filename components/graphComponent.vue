<template>
  <div class="graph">
    <div class="title"
         md-theme="selection-orange">
      <div class="titleText">{{endpointS}}</div>
      <div class="titlebtn">
        <!-- <md-button v-if="endpointSelected"
                   title="edit"
                   class="md-icon-button md-dense">
          <md-icon>edit</md-icon>
        </md-button> -->
      </div>
    </div>

    <div class="chart">
      <!-- <line-chart-component style="width : calc(100% - 10px); height : 100%"
                            :data="chartData"
                            :options="chartOptions"></line-chart-component> -->

      <plotly-component></plotly-component>

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
import plotlyComponent from "./plotlyComponent.vue";

export default {
  name: "graphComponent",
  components: { lineChartComponent, plotlyComponent },
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
      this.chartData = this.dataLst.get();
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
            this.dataLst = el.history;
            el.history.bind(this.updateData);

            // _self.chartData = {
            //   labels: [],
            //   datasets: [
            //     {
            //       label: "Courbe",
            //       data: el.history.get(),
            //       backgroundColor: "#356bab"
            //     }
            //   ]
            // };

            // for (var i = 0; i < el.windowSize.get(); i++) {
            //   _self.chartData.labels.push(i.toString());
            // }

            // _self.chartOptions = {
            //   responsive: true,
            //   maintainAspectRatio: false,
            //   scales: {
            //     yAxes: [
            //       {
            //         stacked: true
            //       }
            //     ]
            //   },
            //   legend: {
            //     display: false
            //   }
            // };
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
  height: 30% !important;
}

.graph .title {
  width: 100%;
  height: 20%;
  font-size: 16px;
  /* text-align: center; */
}

.graph .title .titleText {
  width: 80%;
  height: 100%;
  padding-top: 6px;
  float: left;
}

.graph .title .titlebtn {
  width: 10%;
  height: 100%;
  float: right;
}

.graph .chart {
  width: 100% !important;
  height: 80% !important;
  padding-top: 3px;
}
</style>
