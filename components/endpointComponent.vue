<template>

  <md-content class="endpointContent"
              :class="{selected: isEndpointSelected(), three_item : itemCount == 3, four_item : itemCount == 4 , five_item : itemCount == 5, six_item :itemCount == 6}"

              @click="selectEndpoint">

    <div v-if="endpoint"
         :class="{endpoint_boolean : isBoolean(), endpoint_string : !isBoolean()}">
      <div class="name"
           :title="endpoint.name">
        {{endpoint.name}}
      </div>
      <div class="value"
           :title="endpoint.currentValue"
           :class="{falseValue : !booleanTrueOrFalse() && isBoolean()  , trueValue : booleanTrueOrFalse() && isBoolean()}">
        {{endpoint.currentValue }}
      </div>
    </div>

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
  props: ["endpointNode", "endpointSelected"],
  data() {
    return {
      endpoint: null,
      chartData: null,
      chartOptions: null,
      mouseOver: false,
      itemCount: 3
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
    },

    isEndpointSelected: function() {
      if (this.endpointNode && this.endpointSelected) {
        if (this.endpointNode.id.get() == this.endpointSelected.id.get()) {
          return true;
        }
      }
      return false;
    },

    booleanTrueOrFalse: function() {
      if (
        this.endpoint.currentValue == "1" ||
        this.endpoint.currentValue.toUpperCase() == "TRUE"
      ) {
        return true;
      } else if (
        this.endpoint.currentValue == "0" ||
        this.endpoint.currentValue.toUpperCase() == "FALSE"
      ) {
        return false;
      }
    },
    isBoolean: function() {
      if (this.endpoint && this.endpoint.type.toLowerCase() == "boolean") {
        return true;
      }
      return false;
    }
  },
  mounted() {
    var _self = this;
    if (this.endpointNode) {
      this.getEndpoints();
    }

    globalType.spinal.eventBus.$on("itemCountPerLineChange", el => {
      _self.itemCount = el;
    });
  },
  watch: {
    endpointNode: function() {
      this.getEndpoints();
    }
  }
};
</script>

<style scoped>
.md-content .endpointContent {
  /* width: 85px !important; */
  height: 85px;
  display: inline-block;
  justify-content: center;
  padding: 7px;
  margin: 5px;
  background: #242424;
}

.md-content .endpointContent.three_item {
  width: calc(100% / 3);
}

.md-content .endpointContent.four_item {
  width: calc(100% / 4);
}

.md-content .endpointContent.five_item {
  width: calc(100% / 5);
}

.md-content .endpointContent.six_item {
  width: calc(100% / 6);
}

.md-content .selected {
  background: #0097ef;
}

.md-content .endpointContent:hover {
  background: gray;
  cursor: pointer;
}

.md-content .selected:hover {
  background: #0097ef;
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
  width: 100%;
  height: 100%;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.md-content .endpointContent .endpoint_string .name,
.md-content .endpointContent .endpoint_boolean .name {
  width: 100%;
  height: 20%;
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.md-content .endpointContent .endpoint_string .value {
  width: 100%;
  height: 80%;
  min-height: 20px;
  font-size: 17px;
  color: #f87979;
  align-items: center;
  padding-top: 8px;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 3;
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
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 5;
}

.md-content .endpointContent .trueValue {
  background: green;
}

.md-content .endpointContent .falseValue {
  background: red;
}
</style>
