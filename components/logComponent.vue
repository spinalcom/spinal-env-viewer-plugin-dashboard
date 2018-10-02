<template>

  <md-content class="logContent"
              :class="{selected: isEndpointSelected()}"
              :style="divStyle"
              @click="selectEndpoint">

    <!-- one_item : itemCount == 1,two_item : itemCount == 2,three_item : itemCount == 3, four_item : itemCount == 4 , five_item : itemCount == 5, six_item :itemCount == 6 -->
    <!-- <div v-if="endpoint"
         :class="{endpoint_boolean : isBoolean(), endpoint_string : !isBoolean()}">
      <div class="name"
           :title="endpoint.name">
        {{endpoint.name}}
      </div>
      <div class="value"
           :title="endpoint.currentValue"
           :class="{falseValue : !booleanTrueOrFalse() && isBoolean()  , trueValue : booleanTrueOrFalse() && isBoolean()}">
        <div class="currentValue">{{formatCurrentValue(endpoint.currentValue) }}</div>
        <div class="currentUnit">{{endpoint.unit}}</div>
      </div>
      <div class="btnGroup">
        <md-button v-for="icon in iconsItems"
                   :key="icon.iconName"
                   class="md-icon-button md-dense"
                   :title="icon.title"
                   @click="icon.clickMethod">
          <md-icon>
            {{icon.iconName}}
          </md-icon>
        </md-button>

        <md-button v-if="displayAlarmIcon()"
                   @click="activeAlarmMode"
                   class="alarmMode md-icon-button md-dense"
                   title="Alarm">
          <md-icon>error_outline</md-icon>
        </md-button>

      </div>
    </div> -->

  </md-content>

</template>


<script>
const globalType = typeof window === "undefined" ? global : window;
import chartComponent from "./chartComponent.vue";
import seuilComponent from "./configureSeuilDialog.vue";

var getInfo = require("../classes/getInfo.js");
var getInfoInstance = new getInfo.GetInformation();
var viewer;

export default {
  name: "logComponent",
  components: { chartComponent, seuilComponent },
  props: ["endpointNode", "endpointSelected"],
  data() {
    this.iconsItems = [
      {
        title: "open Graph Panel",
        clickMethod: this.openGraphPanel,
        iconName: "pie_chart"
      },
      {
        title: "Configure Seuil",
        clickMethod: this.configureSeuil,
        iconName: "trending_down"
      }
    ];

    return {
      log: null,
      mouseOver: false,
      itemCount: 3
    };
  },
  computed: {
    divStyle() {
      return {
        width: "calc((100% /" + this.itemCount + ") - 24px)"
      };
    }
  },
  methods: {
    getDbids: async function(node, app) {
      let res = [];
      let element = await node.getElement();
      if (element.constructor.name === "BIMElement") {
        res = res.concat(element.id.get());
      } else if (node.hasChildren()) {
        let childrenNodes = node.getChildrenByApp(app);
        for (let index = 0; index < childrenNodes.length; index++) {
          const childNode = childrenNodes[index];
          res = res.concat(await this.getDbids(childNode, app));
        }
      }
      return res;
    },
    selectEndpoint: function() {
      this.$emit("selectEndpoint", this.endpointNode);
    },
    getEndpoints: function() {
      var _self = this;

      this.endpointNode.getElement().then(el => {
        el.bind(() => {
          _self.seuilEndPoint = el;
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
                backgroundColor: ["#356bab", "#58595b"],
                hoverBackgroundColor: ["#356bab", "#58595b"]
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
    }
  },
  mounted() {
    var _self = this;
    if (this.endpointNode) {
      this.getEndpoints();
    }

    viewer = globalType.v;

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
.md-content .logContent {
  /* width: 85px !important; */
  height: 130px;
  display: inline-block;
  justify-content: center;
  padding: 7px;
  margin: 5px;
  background: #242424;
}

.md-content .selected {
  background: #356bab;
}

.md-content .logContent:hover {
  background: #58595b;
  cursor: pointer;
}

.md-content .selected:hover {
  background: #356bab;
}

.md-content .logContent .endpoint_name {
  width: 100%;
  height: 20%;
  text-align: center;
  padding-top: 5px;
  font-size: 1em;
  text-transform: capitalize;
}

.md-content .logContent .endpoint_doughnut,
.md-content .logContent .endpoint_string,
.md-content .logContent .endpoint_boolean {
  width: 100%;
  height: 100%;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.md-content .logContent .endpoint_string .name,
.md-content .logContent .endpoint_boolean .name {
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

.md-content .logContent .endpoint_string .value {
  width: 100%;
  height: 50%;
  min-height: 20px;
  color: #f68204;
  align-items: center;
  padding-top: 8px;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.md-content .logContent .endpoint_boolean .value {
  width: 100%;
  height: 50%;
  min-height: 20px;
  color: #f68204;
  align-items: center;
  padding-top: 8px;
  text-align: center;
  text-transform: uppercase;
}

.md-content .logContent .endpoint_boolean .btnGroup,
.md-content .logContent .endpoint_string .btnGroup {
  width: 100%;
  height: 20%;
}

.md-content .logContent .endpoint_boolean .value .currentValue,
.md-content .logContent .endpoint_boolean .value .currentUnit,
.md-content .logContent .endpoint_string .value .currentValue,
.md-content .logContent .endpoint_string .value .currentUnit {
  width: 100%;
  height: 50%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.md-content .logContent .endpoint_boolean .value .currentValue,
.md-content .logContent .endpoint_string .value .currentValue {
  font-size: 25px;
  /* padding-top: inherit; */
}

.md-content .logContent .endpoint_boolean .value .currentUnit,
.md-content .logContent .endpoint_string .value .currentUnit {
  text-align: right;
  font-size: 10px;
}

.md-content .logContent .trueValue {
  color: black !important;
  background: #31c64b;
}

.md-content .logContent .falseValue {
  color: black !important;
  background: #ff4d3f;
}

.alarmMode .md-icon {
  color: #ff4d3f !important;
}
</style>
