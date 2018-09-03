
<template>
  <md-content id="plot_graph">
    <!-- <div id="plotlyGraph"></div> -->
  </md-content>

</template>


<script>
// require("../classes/plotly.min.js");

export default {
  name: "plotlyComponent",
  props: ["graph_data"],
  data() {
    this.layout = {
      margin: {
        l: 50,
        r: 10,
        b: 25,
        t: 5,
        pad: 4
      },
      font: {
        size: 16
      }
    };

    this.chartData = [
      {
        type: "scatter",
        y: this.graph_data ? this.graph_data : [],
        x: this.getXData(),
        marker: {
          color: "#C8A2C8",
          line: {
            width: 2.5
          }
        }
      }
    ];
    this._graph_ = null;

    return {};
  },
  mounted() {
    this._graph_ = this.createGraph();

    Plotly.plot(this._graph_.gd, this.chartData, this.layout);

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

      var gd3 = d3.select(document.getElementById("plot_graph")).style({
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

    getXData: function() {
      var x = [];
      if (this.graph_data) {
        for (var i = 0; i < this.graph_data.length; i++) {
          x.push(i);
        }
      }
      return x;
    }
  },
  watch: {
    graph_data: function() {
      this.chartData[0].y = this.graph_data;
      this.chartData[0].x = this.getXData();
      Plotly.react(this._graph_.gd, this.chartData, this.layout);
    }
  }
};
</script>

<style>
#plot_graph {
  width: 100% !important;
  height: 100% !important;
}
</style>
