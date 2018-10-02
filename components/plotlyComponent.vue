
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
var appName = "MyNetwork4";
export default {
  name: "plotlyComponent",
  data() {
    this.layout = {
      margin: {
        b: 90,
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
        showline: true,
        tickformat: "%d/%m/%Y %H:%M"
      },
      yaxis: {
        showgrid: false,
        showline: true
      }
    };

    this.chartData = [
      {
        mode: "lines+markers",
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

    this.seuilMinBind = null;
    this.seuilMaxBind = null;

    this.seuilMinModel = null;
    this.seuilMaxModel = null;

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
    this.getEvents();
    this._graph_ = this.createGraph();

    setInterval(() => {
      this.resize(this._graph_.gd, this._graph_.gd3);
    }, 500);
  },
  methods: {
    createGraph: function() {
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

        console.log("el", el);

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
                this.defineSeuil(
                  this.endPointModel,
                  el2.historyDate.get(),
                  () => {
                    this.updateGraph(el2.historyDate.get(), el2.history.get());
                  }
                );
              });

              /**** Bind et unbind seuiMin */
              if (this.seuilMinModel) {
                this.seuilMinModel.unbind(this.seuilMinBind);
              }

              this.seuilMinBind = this.endPointModel.seuilMin.bind(() => {
                this.seuilMinModel = this.endPointModel.seuilMin;

                this.defineSeuil(
                  this.endPointModel,
                  el2.historyDate.get(),
                  () => {
                    this.updateGraph(el2.historyDate.get(), el2.history.get());
                  }
                );
              });
              /**** Fin Bind et unbind seuiMin */

              /**** Bind et unbind seuiMax */
              if (this.seuilMaxModel) {
                this.seuilMaxModel.unbind(this.seuilMaxBind);
              }

              this.seuilMaxBind = this.endPointModel.seuilMax.bind(() => {
                this.seuilMaxModel = this.endPointModel.seuilMax;

                this.defineSeuil(
                  this.endPointModel,
                  el2.historyDate.get(),
                  () => {
                    this.updateGraph(el2.historyDate.get(), el2.history.get());
                  }
                );
              });

              /**** Fin Bind et unbind seuiMax */
            });
        }
        this.openGraphPanel();
      });
    },
    defineSeuil: function(argEndpoint, argHistory, callback) {
      this.layout["shapes"] = [];

      // console.log("argHistory", argHistory);

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
  },
  watch: {},
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
  height: 90% !important;
}

.graphDetail {
  width: 100% !important;
  height: 10% !important;
}

.endpointName {
  text-align: center;
  width: 100%;
  height: 100%;
  padding-top: 8px;
  font-size: 20px;
}
</style>
