
<template>
  <md-content class="graphContainer">
    <md-content class="graphDetail">
      <div class="endpointName"
           v-if="endpointSelected">{{endpointSelected.name.get()}}</div>
    </md-content>
    <md-content id="plotGraph"></md-content>
  </md-content>

</template>


<script>
// require("../classes/plotly.min.js");
const globalType = typeof window === "undefined" ? global : window;
var appName = "smartConnector";
export default {
  name: "plotlyComponent",
  // props: ["graph_data", "graphXData"],
  data() {
    this.layout = {
      margin: {
        l: 50,
        r: 20,
        b: 25,
        t: 8,
        pad: 4
      },
      font: {
        size: 15,
        color: "#FFFFFF"
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: {
        showgrid: false,
        showline: true
      },
      yaxis: {
        showgrid: false,
        showline: true
      }
    };

    this.chartData = [
      {
        mode: "lines",
        y: [],
        x: [],
        marker: {
          color: "#356BAB",
          line: {
            width: 2
          }
        },
        connectgaps: true,
        transforms: [
          {
            type: "filter",
            target: "y",
            operation: "!=",
            value: NaN
          }
        ]
      }
    ];

    this._graph_ = null;

    this.seuilMin = null;
    this.seuilMax = null;

    this.endpointBind = null;
    this.endPointModel = null;

    this.historyBind = null;
    this.historyModel = null;

    return {
      graph_data: [],
      graphXData: [],
      endpointSelected: null
    };
  },
  mounted() {
    console.log("plotlyComponent mounted");
    this.getEvents();
    this._graph_ = this.createGraph();

    setInterval(() => {
      this.resize(this._graph_.gd, this._graph_.gd3);
    }, 500);
  },
  methods: {
    createGraph: function() {
      // var copieLayout = JSON.parse(JSON.stringify(this.layout));

      var d3 = Plotly.d3;
      var graphWidth = 100,
        graphHeight = 100;

      var gd3 = d3.select(document.getElementById("plotGraph")).style({
        width: graphWidth + "%",
        height: graphHeight + "%"
      });

      var gd = gd3.node();

      return { gd: gd, gd3: gd3 };
    },
    resize: function(gd, gd3) {
      gd3.style({
        width: "100%",
        height: "100%"
      });

      Plotly.Plots.resize(gd);
    },
    openGraphPanel: function() {
      var graphPanel =
        globalType.spinal.panelManager.panelsGroup.graphPanelClass[0];

      if (!graphPanel.isVisible()) {
        graphPanel.setVisible(true);
      }
    },

    getEvents: function() {
      globalType.spinal.eventBus.$on("seeGraphPanel", el => {
        this.endpointSelected = el;
        // this.name = el.name.get();

        el.getElement().then(endpoint => {
          // if (this.endPointModel != endpoint) {
          //   if (this.endPointModel != null) {
          //     this.endPointModel.unbind(this.endpointBind);
          //   }

          this.endPointModel = endpoint;

          // this.endpointBind = endpoint.bind(() => {
          //   this.defineSeuil(endpoint);
          //   // this.seuilMin = endpoint.seuilMin.get();
          //   // this.seuilMax = endpoint.seuilMax.get();
          // });
          // }
        });

        var historyValue = el.getRelationsByAppNameByType(
          appName,
          "hasHistory"
        )[0];

        if (historyValue) {
          historyValue
            .getNodeList2()[0]
            .getElement()
            .then(el2 => {
              if (this.historyModel) this.historyModel.unbind(this.historyBind);
              this.historyModel = el2.history;
              this.historyBind = el2.history.bind(() => {
                // this.graph_data = el2.history.get();
                // this.graphXData = el2.historyDate.get();

                this.defineSeuil(
                  this.endPointModel,
                  el2.historyDate.get(),
                  () => {
                    this.updateGraph(el2.historyDate.get(), el2.history.get());
                  }
                );
              });
            });
        }
        this.openGraphPanel();
      });
    },
    defineSeuil: function(argEndpoint, argHistory, callback) {
      this.layout["shapes"] = [];

      if (argEndpoint.seuilMin.active.get()) {
        this.layout.shapes.push({
          type: "line",
          y0: argEndpoint.seuilMin.value.get(),
          y1: argEndpoint.seuilMin.value.get(),
          x0: new Date(argHistory[0]).getTime(),
          x1: new Date(argHistory[argHistory.length - 1]).getTime(),
          line: {
            color: "red",
            width: 2.5
          }
        });
      }

      if (argEndpoint.seuilMax.active.get()) {
        this.layout.shapes.push({
          type: "line",
          y0: argEndpoint.seuilMax.value.get(),
          y1: argEndpoint.seuilMax.value.get(),
          x0: new Date(argHistory[0]).getTime(),
          x1: new Date(argHistory[argHistory.length - 1]).getTime(),
          line: {
            color: "red",
            width: 2.5
          }
        });
      }
      callback();
    },
    updateGraph: function(xData, yData) {
      this.chartData[0].x = xData;
      this.chartData[0].y = yData;
      Plotly.react(this._graph_.gd, this.chartData, this.layout, {
        modeBarButtonsToRemove: ["sendDataToCloud"],
        displaylogo: false
      });
    }
    // getMaxData: function() {
    //   var x = [];
    //   if (this.graphXData) {
    //     for (var i = 0; i < this.graphXData.length; i++) {
    //       x.push(this.seuilMax.value);
    //     }
    //   }
    //   return x;
    // },
    // getMinData: function() {
    //   var x = [];
    //   if (this.graphXData) {
    //     for (var i = 0; i < this.graphXData.length; i++) {
    //       x.push(this.seuilMin.value);
    //     }
    //   }
    //   return x;
    // }
    // getGraphData(callback) {
    //   this.chartData.push({
    //     type: "scatter",
    //     y: this.graph_data ? this.graph_data : [],
    //     x: this.graphXData ? this.graphXData : [],
    //     marker: {
    //       color: "#356BAB",
    //       line: {
    //         width: 5
    //       }
    //     },
    //     name: "value line"
    //   });

    //   if (this.seuilMin.active) {
    //     this.chartData.push({
    //       type: "scatter",
    //       y: this.getMinData(),
    //       x: this.graphXData ? this.graphXData : [],
    //       marker: {
    //         color: "#FF4D3F",
    //         line: {
    //           width: 5
    //         }
    //       },
    //       name: "minimum threshold"
    //     });
    //   }

    //   if (this.seuilMax.active) {
    //     this.chartData.push({
    //       type: "scatter",
    //       y: this.getMaxData(),
    //       x: this.graphXData ? this.graphXData : [],
    //       marker: {
    //         color: "#FF4D3F",
    //         line: {
    //           width: 5
    //         }
    //       },
    //       name: "maximum threshold"
    //     });
    //   }
    //   callback();
    // }
  },
  watch: {
    graph_data: function(newValue, oldValue) {
      // this.chartData[0].y = this.graph_data;
      // this.chartData[0].x = this.graphXData;
      // this.chartData = [];
      // this.getGraphData(() => {
      //   Plotly.react(this._graph_.gd, this.chartData, this.layout);
      // });
      // console.log("graph_Data change");
      // this.chartData[0].y = this.graph_data;
      // this.chartData[0].x = this.graphXData;
      // if (oldValue.length == 0) {
      //   console.log("chartData", this.chartData.x);
      //   Plotly.plot(this._graph_.gd, this.chartData, this.layout, {
      //     modeBarButtonsToRemove: ["sendDataToCloud"],
      //     displaylogo: false
      //   });
      // } else {
      //   console.log("oldValue.length", oldValue.length);
      //   Plotly.react(this._graph_.gd, this.chartData, this.layout);
      // }
    },
    graphXData: function() {},
    endpointSelected: function(newEndpoint, oldEndpoint) {
      // if (oldEndpoint) {
      //   if (this.historyModel != null) {
      //     this.historyModel.unbind(this.historyBind);
      //     console.log("history.unbind");
      //   }
      // }
    }
  },
  beforeDestroy() {
    // if (this.endPointModel != endpoint) {
    //   if (this.endPointModel != null) {
    //     this.endPointModel.unbind(this.endpointBind);
    //     console.log("EndpointUnBinded in beforeDestroy");
    //   }
    // }

    if (this.historyModel != null) {
      this.historyModel.unbind(this.historyBind);
      console.log("endpointHistoryUnbinded");
    }
  }
};
</script>

<style>
.graphContainer {
  width: 100% !important;
  height: calc(100% - 50px) !important;
}

#plotGraph {
  width: 100% !important;
  height: 80% !important;
}

.graphDetail {
  width: 100% !important;
  height: 20% !important;
}

.endpointName {
  text-align: center;
  width: 100%;
  height: 40%;
  padding-top: 8px;
  font-size: 20px;
}
</style>
