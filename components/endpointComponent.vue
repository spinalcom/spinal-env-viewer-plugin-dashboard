<template>

  <md-content class="md-layout-item endpointContent"
              @click="selectEndpoint">
    <!-- @mouseover="hoverEndpoint"
              @mouseleave="mouseLeaveEndpoint" -->

    <!-- <div v-if="endpoint"
         class="endpoint_name">
      {{endpoint.name}}
    </div> -->

    <!-- ***************************************************** Autre Type ******************************************************************************* -->

    <div v-if="endpoint && endpoint.type == 'number'"
         class="md-size-15 endpoint_doughnut">
      <!--  && !mouseOver -->
      <chart-component :data="chartData"
                       :options="chartOptions"></chart-component>
    </div>

    <!-- ***************************************************** Type String ******************************************************************************* -->

    <div v-if="endpoint && endpoint.type == 'string'"
         class="md-size-15 endpoint_string">
      <!--  && !mouseOver -->

      <div class="name">
        {{endpoint.name}}
      </div>
      <div class="value">
        {{endpoint.currentValue}}
      </div>
    </div>

    <!-- ***************************************************** Type Boolean ******************************************************************************* -->
    <div v-if="endpoint && endpoint.type == 'boolean'"
         class="md-size-15 endpoint_boolean ">
      <!--  && !mouseOver -->
      <div class="name">
        {{endpoint.name}}
      </div>
      <div class="value">
        {{endpoint.currentValue ? "1" : "0"}}
      </div>
    </div>

    <!-- ***************************************************** Mouse Over ******************************************************************************* -->

    <!-- <div v-if="endpoint && mouseOver"
         class="endpoint_boolean">
      <div class="name">
        {{endpoint.name}}
      </div>
      <div class="value">

        <md-button title="edit"
                   class="md-icon-button md-dense"
                   @click="editEndpoint">
          <md-icon>edit</md-icon>
        </md-button>

        <md-button title="show chart"
                   class="md-icon-button md-dense"
                   @click="selectEndpoint">
          <md-icon>show_chart</md-icon>
        </md-button>

      </div>
    </div> -->

  </md-content>

</template>


<script>
const globalType = typeof window === "undefined" ? global : window;
import chartComponent from "./chartComponent.vue";
var getInfo = require("../classes/getInfo.js");
var getInfoInstance = new getInfo.GetInformation();

export default {
  name: "endpointComponent",
  components: { chartComponent },
  props: ["endpointNode"],
  data() {
    return {
      endpoint: null,
      chartData: null,
      chartOptions: null,
      mouseOver: false
    };
  },
  methods: {
    selectEndpoint: function() {
      this.$emit("selectEndpoint", this.endpointNode);
    },
    editEndpoint: function() {
      console.log("hello world");
    },
    getEndpoints: function() {
      var _self = this;

      this.endpointNode.getElement().then(el => {
        el.bind(() => {
          _self.endpoint = getInfoInstance.getDeviceDetail(el);

          _self.chartData = {
            datasets: [
              {
                /** Bind */
                data: [
                  parseInt(_self.endpoint.currentValue),
                  _self.endpoint.max -
                    _self.endpoint.min -
                    _self.endpoint.currentValue
                ],
                backgroundColor: ["#FF6384", "#DCDCDC"],
                hoverBackgroundColor: ["#FF6384", "#DCDCDC"]
              }
            ]
          };

          _self.chartOptions = {
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
              text: _self.endpoint.name.toUpperCase(),
              fontSize: 12,
              fontColor: "#FFFFFF",
              padding: 0
            },
            tooltips: {
              callbacks: {
                label: (tooltipItem, data) => {
                  return _self.endpoint.currentValue;
                }
              }
            },
            name: _self.endpoint.currentValue + _self.endpoint.unit
          };
        });
      });
    }
    // hoverEndpoint: function() {
    //   this.mouseOver = true;
    // }
    // mouseLeaveEndpoint: function() {
    //   this.mouseOver = false;
    // }
  },
  mounted() {
    if (this.endpointNode) {
      this.getEndpoints();
    }
  },
  watch: {
    endpointNode: function() {
      this.getEndpoints();
    }
  }
};
</script>

<style lang="scss" scoped>
.md-content .endpointContent {
  width: 75px;
  min-height: 85px;
  display: inline-block;
  justify-content: center;
  // margin-left: 5px;
  padding: 7px;
  // margin-top: 10px;
  // margin-bottom: 10px;
  margin: 5px;
  background: #242424;
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
  font-size: 1em;
  text-transform: capitalize;
}

.md-content .endpointContent .endpoint_doughnut,
.md-content .endpointContent .endpoint_string,
.md-content .endpointContent .endpoint_boolean {
  width: 90%;
  height: 100%;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

//  {
//   width: 90%;
//   height: 100%;
//   display: block;
// }

.md-content .endpointContent .endpoint_string .name,
.md-content .endpointContent .endpoint_boolean .name {
  width: 100%;
  height: 20%;
  text-align: "center";
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
}

.md-content .endpointContent .endpoint_string .value {
  width: 100%;
  height: 80%;
  min-height: 20px;
  font-size: 12px;
  color: #f87979;
  align-items: center;
  padding-top: 8px;
  text-align: center;
  text-transform: uppercase;
}

.md-content .endpointContent .endpoint_boolean .value {
  width: 100%;
  height: 70%;
  min-height: 20px;
  font-size: 12px;
  color: #f87979;
  align-items: center;
  padding-top: 8px;
  text-align: center;
  text-transform: uppercase;
}
</style>
