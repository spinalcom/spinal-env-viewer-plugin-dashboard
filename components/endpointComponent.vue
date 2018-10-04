<template>

  <md-content class="endpointContent"
              :class="{selected: isEndpointSelected()}"
              :style="divStyle"
              @click="selectEndpoint">

    <seuil-component :showDialog="displaySeuil"
                     :endpointSelected="seuilEndPoint"
                     @hideDialog="configureSeuil"></seuil-component>

    <!-- one_item : itemCount == 1,two_item : itemCount == 2,three_item : itemCount == 3, four_item : itemCount == 4 , five_item : itemCount == 5, six_item :itemCount == 6 -->
    <div v-if="endpoint"
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
                   @click="fitToViewAlarm"
                   class="alarmMode md-icon-button md-dense"
                   title="Alarm">
          <md-icon>error_outline</md-icon>
        </md-button>

      </div>
    </div>

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
  name: "endpointComponent",
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
      endpoint: null,
      chartData: null,
      chartOptions: null,
      mouseOver: false,
      itemCount: 3,
      alarmMode: false,
      delay: 500,
      clicks: 0,
      timer: null,
      displaySeuil: false,
      seuilEndPoint: null
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
    editEndpoint: function() {},
    getEndpoints: function() {
      var _self = this;

      this.endpointNode.getElement().then(el => {
        el.bind(() => {
          _self.seuilEndPoint = el;

          if (el.constructor.name == "SpinalEndpoint") {
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
          }
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
      if (this.isBoolean()) {
        if (this.endpoint.currentValue === 1) {
          return true;
        } else if (this.endpoint.currentValue === 0) {
          return false;
        } else if (
          this.endpoint.currentValue === "1" ||
          this.endpoint.currentValue.toUpperCase() == "TRUE"
        ) {
          return true;
        } else if (
          this.endpoint.currentValue === "0" ||
          this.endpoint.currentValue.toUpperCase() == "FALSE"
        ) {
          return false;
        }
      }
    },
    isBoolean: function() {
      if (this.endpoint && this.endpoint.type.toLowerCase() == "boolean") {
        return true;
      }
      return false;
    },
    formatCurrentValue: function(argCurrentValue) {
      var argCurrentValueNumber = Number(argCurrentValue);

      if (
        !isNaN(argCurrentValueNumber) &&
        !Number.isInteger(argCurrentValueNumber)
      )
        return Number(argCurrentValue).toFixed(2);
      return argCurrentValue;
    },
    openGraphPanel: function() {
      globalType.spinal.eventBus.$emit("seeGraphPanel", this.endpointNode);
    },
    displayAlarmIcon: function() {
      // var relations = this.endpointNode.getRelationsByAppNameByType(
      //   "linker",
      //   "link"
      // );
      // if (relations.length > 0) {
      //   return true;
      // }
      // return false;

      if (
        (this.endpoint.max.active &&
          this.endpoint.currentValue >= this.endpoint.max.value) ||
        (this.endpoint.min.active &&
          this.endpoint.currentValue <= this.endpoint.min.value)
      ) {
        // this.activeAlert();
        return true;
      }

      this.disableAlarm();
      return false;
    },

    activeAlert: function() {
      var allBimOjects = [];

      var relations = this.endpointNode.getRelationsByAppNameByType(
        "linker",
        "link"
      );

      for (var i = 0; i < relations.length; i++) {
        allBimOjects = allBimOjects.concat(
          this.getDbids(relations[i].nodeList1[0], "linker")
        );
      }

      Promise.all(allBimOjects).then(el => {
        var x = [];
        for (var i = 0; i < el.length; i++) {
          x = x.concat(el[i]);
        }

        viewer.setColorMaterial(x, "#FF4D3F", "1234");
      });
    },
    disableAlarm: function() {
      var allBimOjects = [];

      var relations = this.endpointNode.getRelationsByAppNameByType(
        "linker",
        "link"
      );

      for (var i = 0; i < relations.length; i++) {
        allBimOjects = allBimOjects.concat(
          this.getDbids(relations[i].nodeList1[0], "linker")
        );
      }

      Promise.all(allBimOjects).then(el => {
        var x = [];
        for (var i = 0; i < el.length; i++) {
          x = x.concat(el[i]);
        }

        viewer.restoreColorMaterial(x, "1234");
      });
    },
    fitToViewAlarm: function() {
      var allBimOjects = [];

      var relations = this.endpointNode.getRelationsByAppNameByType(
        "linker",
        "link"
      );

      for (var i = 0; i < relations.length; i++) {
        allBimOjects = allBimOjects.concat(
          this.getDbids(relations[i].nodeList1[0], "linker")
        );
      }

      this.clicks++;

      Promise.all(allBimOjects).then(el => {
        var x = [];
        for (var i = 0; i < el.length; i++) {
          x = x.concat(el[i]);
        }

        var self = this;

        if (this.clicks === 1) {
          this.timer = setTimeout(function() {
            viewer.setColorMaterial(x, "#FF4D3F", "1234");
            self.clicks = 0;
          }, this.delay);
        } else if (this.clicks === 2) {
          clearTimeout(this.timer);
          // this.result.push("dblclick");
          this.timer2 = setTimeout(function() {
            self.clicks = 0;
            viewer.restoreColorMaterial(x, "1234");
          }, this.delay);
        } else {
          clearTimeout(this.timer2);
          viewer.setColorMaterial(x, "#FF4D3F", "1234");
          viewer.fitToView(x);
          self.clicks = 0;
        }
      });
    },
    configureSeuil: function() {
      this.displaySeuil = !this.displaySeuil;
    }
    // saveSeuil: function(save) {
    //   this.displaySeuil = !this.displaySeuil;
    //   if (save) {
    //     console.log("save");
    //   }
    // }
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
.md-content .endpointContent {
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

.md-content .endpointContent:hover {
  background: #58595b;
  cursor: pointer;
}

.md-content .selected:hover {
  background: #356bab;
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

.md-content .endpointContent .endpoint_boolean .value {
  width: 100%;
  height: 50%;
  min-height: 20px;
  color: #f68204;
  align-items: center;
  padding-top: 8px;
  text-align: center;
  text-transform: uppercase;
}

.md-content .endpointContent .endpoint_boolean .btnGroup,
.md-content .endpointContent .endpoint_string .btnGroup {
  width: 100%;
  height: 20%;
}

.md-content .endpointContent .endpoint_boolean .value .currentValue,
.md-content .endpointContent .endpoint_boolean .value .currentUnit,
.md-content .endpointContent .endpoint_string .value .currentValue,
.md-content .endpointContent .endpoint_string .value .currentUnit {
  width: 100%;
  height: 50%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.md-content .endpointContent .endpoint_boolean .value .currentValue,
.md-content .endpointContent .endpoint_string .value .currentValue {
  font-size: 25px;
  /* padding-top: inherit; */
}

.md-content .endpointContent .endpoint_boolean .value .currentUnit,
.md-content .endpointContent .endpoint_string .value .currentUnit {
  text-align: right;
  font-size: 10px;
}

.md-content .endpointContent .trueValue {
  color: black !important;
  background: #31c64b;
}

.md-content .endpointContent .falseValue {
  color: black !important;
  background: #ff4d3f;
}

.alarmMode .md-icon {
  color: #ff4d3f !important;
}
</style>
