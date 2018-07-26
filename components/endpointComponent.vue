<template>

  <md-content class="endpointContent"
              @click="selectEndpoint(endpoint)">

    <!-- <div class="endpoint_name">
      {{endpoint.name}}
    </div> -->

    <div class="endpoint_doughnut">
      <chart-component :data="chartData"
                       :options="chartOptions"></chart-component>
    </div>

  </md-content>

</template>


<script>
const globalType = typeof window === "undefined" ? global : window;
import chartComponent from "./chartComponent.vue";
export default {
  name: "endpointComponent",
  components: { chartComponent },
  props: ["endpoint"],
  data() {
    return {
      chartData: {
        datasets: [
          {
            data: [
              this.endpoint.currentValue,
              this.endpoint.max - this.endpoint.min - this.endpoint.currentValue
            ],
            backgroundColor: ["#FF6384", "#DCDCDC"],
            hoverBackgroundColor: ["#FF6384", "#DCDCDC"]
          }
        ]
      },
      chartOptions: {
        elements: {
          center: {
            text: "90%",
            color: "#FF6384",
            fontStyle: "Arial",
            sidePadding: 20
          }
        },
        cutoutPercentage: 70,
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        title: {
          display: true,
          text: this.endpoint.name.toUpperCase(),
          fontSize: 12,
          fontColor: "#FFFFFF",
          padding: 0
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return this.endpoint.currentValue;
            }
          }
        },
        name: this.endpoint.currentValue + this.endpoint.unit
      }
    };
  },
  methods: {
    selectEndpoint: function(endpoint) {
      this.$emit("selectEndpoint", endpoint);
    }
  }
};
</script>

<style lang="scss" scoped>
.md-content .endpointContent {
  width: 75px;
  min-height: 75px;
  display: inline-block;
  justify-content: center;
  margin-right: 5px;
  padding: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  // align-items: center;
}

.md-content .endpointContent:hover {
  background: gray;
  cursor: pointer;
}

.md-content .endpointContent .endpoint_name {
  width: 100%;
  height: 20%;
  text-align: center;
  padding-top: 5px;
  font-size: 1.5em;
  text-transform: capitalize;
}

.md-content .endpointContent .endpoint_doughnut {
  width: 100%;
  height: 75%;
  display: block;
}
</style>
