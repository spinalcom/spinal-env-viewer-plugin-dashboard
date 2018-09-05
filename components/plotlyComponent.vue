
<template>
  <md-content class="graphContainer">
    <md-content class="graphDetail">
      <div class="endpointName">{{name}}</div>
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
  props: ["graph_data", "graphXData"],
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
      plot_bgcolor: "rgba(0,0,0,0)"
    };

    this.chartData = [
      {
        type: "scatter",
        y: this.graph_data ? this.graph_data : [],
        x: this.graphXData ? this.graphXData : [],
        marker: {
          color: "#356BAB",
          line: {
            width: 2
          }
        }
      }
    ];
    this._graph_ = null;

    return {
      name: ""
    };
  },
  mounted() {
    this.getEvents();
    this._graph_ = this.createGraph();

    Plotly.plot(this._graph_.gd, this.chartData, this.layout, {
      modeBarButtonsToRemove: ["sendDataToCloud"],
      displaylogo: false
    });

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
    getXData: function() {
      var x = [];
      if (this.graph_data) {
        for (var i = 0; i < this.graph_data.length; i++) {
          x.push(i);
        }
      }
      return x;
    },
    getEvents: function() {
      globalType.spinal.eventBus.$on("seeGraphPanel", el => {
        this.name = el.name.get();

        var historyValue = el.getRelationsByAppNameByType(
          appName,
          "hasHistory"
        )[0];

        if (historyValue) {
          historyValue
            .getNodeList2()[0]
            .getElement()
            .then(el => {
              el.history.bind(() => {
                this.graph_data = el.history.get();
                this.graphXData = el.historyDate.get();
              });
            });
        }
        this.openGraphPanel();
      });
    }
  },
  watch: {
    graph_data: function() {
      this.chartData[0].y = this.graph_data;
      this.chartData[0].x = this.graphXData;
      Plotly.react(this._graph_.gd, this.chartData, this.layout);
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
