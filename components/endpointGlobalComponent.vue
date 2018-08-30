<template>

  <md-content class="endpointContainer">

    <md-list class="endpoint_sidebar">
      <md-list-item>
        <div class="md-list-item-text"
             title="NUMBER OF ITEMS TO DISPLAY PER LINE">
          NUMBER OF ITEMS TO DISPLAY PER LINE
        </div>

        <md-button class="md-icon-button md-dense"
                   title="increase"
                   @click="changeItemCountPerLine('increase')">
          <md-icon>add</md-icon>
        </md-button>

        <md-button class="md-icon-button md-dense"
                   title="decrease"
                   @click="changeItemCountPerLine('decrease')">
          <md-icon>remove</md-icon>
        </md-button>

        <div class="lineCount">
          {{itemCountPerLine}}
        </div>
      </md-list-item>
    </md-list>

    <md-content class="endpoint_grid md-scrollbar">

      <!--*********************************************************** Debut Others *****************************************************************************-->
      <div v-if="endpoints.length > 0">
        <md-toolbar class="md-dense"
                    style="min-height : 30px; height : 30px; padding-right: 10px; 
                background: #356bab">
          <h3 class="md-title"
              style="flex: 1">Others</h3>
          <md-button class="md-icon-button md-dense"
                     @click="showOrHideOther"
                     style="margin-right: 20px;">

            <md-icon v-if="!showEndpoint">
              keyboard_arrow_down
            </md-icon>
            <md-icon v-if="showEndpoint">
              keyboard_arrow_up
            </md-icon>

          </md-button>
        </md-toolbar>

        <div class="_endpoint_div_content">
          <endpoint-component v-if="showEndpoint"
                              @selectEndpoint="selectEndpoint"
                              v-for="endpoint in endpoints"
                              :key="endpoint._server_id"
                              :endpointNode="endpoint"
                              :endpointSelected="endpointSelected"></endpoint-component>
        </div>

      </div>

      <!--*********************************************************** Fin Others *****************************************************************************-->

      <endpoint-group v-for="endpoint_group in endPointsGroupNodes"
                      :key="endpoint_group._server_id"
                      :endpointGroupNode="endpoint_group"
                      @selectEndpoint="selectEndpoint"
                      :appName="appName"
                      :endpointSelected="endpointSelected"></endpoint-group>
    </md-content>
  </md-content>
</template>


<script>
const globalType = typeof window === "undefined" ? global : window;
var getInfo = require("../classes/getInfo.js");
import endpointComponent from "./endpointComponent.vue";
import endpointGroup from "./endpointGroupComponent.vue";

var getInfoInstance = new getInfo.GetInformation();

export default {
  name: "endpointGlobalComponent",
  components: { endpointComponent, endpointGroup },
  props: ["deviceNode", "appName", "endpointSelected", "severalEndpoints"],
  data() {
    return {
      endpoints: [],
      endPointsGroupNodes: [],
      showEndpoint: true,
      itemCountPerLine: 3
    };
  },
  methods: {
    selectEndpoint: function(item) {
      this.$emit("select_endpoint", item);
    },
    showOrHideOther: function() {
      this.showEndpoint = !this.showEndpoint;
    },
    changeItemCountPerLine: function(name) {
      if (name == "increase" && this.itemCountPerLine < 10) {
        this.itemCountPerLine += 1;
      } else if (name == "decrease" && this.itemCountPerLine > 1) {
        this.itemCountPerLine -= 1;
      } else {
        return;
      }

      globalType.spinal.eventBus.$emit(
        "itemCountPerLineChange",
        this.itemCountPerLine
      );
    },
    getEndpointsNode: function(current_endpoint) {
      var _self = this;
      current_endpoint.getElement().then(el => {
        var type = el.constructor.name;

        if (type == "SpinalDevice") {
          console.log("it is a device");
          //Si spinalDevice

          console.log("current_endpoint", current_endpoint);

          _self.endpoints = _self.endpoints.concat(
            current_endpoint.getChildrenByAppByRelation(
              _self.appName,
              "hasEndpoint"
            )
          );

          _self.endPointsGroupNodes = _self.endPointsGroupNodes.concat(
            current_endpoint.getChildrenByAppByRelation(
              _self.appName,
              "hasEndpointGroup"
            )
          );
        } else if (type == "SpinalEndpoint") {
          //si endpoint
          console.log("it is an endpoint", current_endpoint);

          _self.endpoints.push(current_endpoint);
        } else if (type == "SpinalEndpointGroup") {
          console.log("it is an endpointGroup");
          //si endpointGroup
          _self.endPointsGroupNodes.concat([current_endpoint]);
        }
      });
    }
  },
  watch: {
    deviceNode: function(newDeviceNode) {
      var _self = this;

      if (typeof newDeviceNode != "undefined" && newDeviceNode != null) {
        this.deviceNode.getElement().then(m => {
          var type = m.constructor.name;

          if (type == "SpinalDevice") {
            //Si spinalDevice
            _self.endpoints = _self.deviceNode.getChildrenByAppByRelation(
              _self.appName,
              "hasEndpoint"
            );

            _self.endPointsGroupNodes = _self.deviceNode.getChildrenByAppByRelation(
              _self.appName,
              "hasEndpointGroup"
            );
          } else if (type == "SpinalEndpoint") {
            //si endpoint
            _self.endpoints = [_self.deviceNode];
          } else if (type == "SpinalEndpointGroup") {
            //si endpointGroup
            _self.endPointsGroupNodes = [this.deviceNode];
          }
        });
      }
    },
    severalEndpoints: function(newSeveralEndpoints) {
      var _self = this;

      console.log("severalEndpoints", this.severalEndpoints);
      console.log("newSeveralEndpoints", newSeveralEndpoints);

      if (
        typeof newSeveralEndpoints != "undefined" &&
        newSeveralEndpoints != null
      ) {
        this.endpoints = [];
        this.endPointsGroupNodes = [];

        for (var i = 0; i < this.severalEndpoints.length; i++) {
          var current_endpoint = this.severalEndpoints[i];

          if (current_endpoint) {
            this.getEndpointsNode(current_endpoint);
          }
        }
      }
    }
  }
};
</script>


<style>
.endpointContainer {
  height: calc(70% - 20px) !important;
  border-bottom: 1px solid #58595b;
}

.endpointContainer
  .endpoint_grid
  .md-toolbar.md-dense.md-primary.md-theme-default {
  min-height: 35px;
  height: 35px;
  margin-bottom: 3px;
  margin-top: 3px;
  font-size: 13px;
  text-transform: capitalize;
  box-sizing: border-box;
  padding: 0px;
}

.mylayout {
  width: 100%;
}

.endpointContainer .endpoint_grid {
  width: 100%;
  height: calc(100% - 45px);
  overflow: hidden;
  overflow-y: auto;
}

.endpointContainer .endpoint_sidebar {
  width: 100%;
  height: 30px;
  margin-bottom: 5px;
  padding-top: 10px;
}

.lineCount {
  width: 24px;
  height: 24px;
  background: #356bab;
  text-align: center;
  padding-top: 5px;
}
</style>
