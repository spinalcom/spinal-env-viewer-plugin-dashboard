<template>

  <md-content class="endpointContainer">

    <!-- <md-menu md-size="small">
        NUMBER OF ITEMS TO DISPLAY PER LINE : &nbsp;

        <md-button :md-ripple="false"
                   md-menu-trigger>
          <div>
            {{itemCountPerLine}} &nbsp;
            <i class="material-icons">
              keyboard_arrow_down
            </i>
          </div>
        </md-button>

        <md-menu-content style="text-align: center">
          <md-menu-item @click="changeItemCountPerLine(4)">4</md-menu-item>
          <md-menu-item @click="changeItemCountPerLine(5)">5</md-menu-item>
          <md-menu-item @click="changeItemCountPerLine(6)">6</md-menu-item>
        </md-menu-content>
      </md-menu> -->

    <md-list class="endpoint_sidebar">
      <md-list-item>
        <span class="md-list-item-text"
              title="NUMBER OF ITEMS TO DISPLAY PER LINE">NUMBER OF ITEMS TO DISPLAY PER LINE</span>
        <md-menu md-size="small">
          <md-button md-menu-trigger>
            {{itemCountPerLine}}
            <md-icon>keyboard_arrow_down</md-icon>
          </md-button>

          <md-menu-content>
            <md-menu-item style="text-align: center"
                          @click="changeItemCountPerLine(3)">&nbsp;3</md-menu-item>

            <md-menu-item style="text-align: center"
                          @click="changeItemCountPerLine(4)">&nbsp;4</md-menu-item>
            <md-menu-item style="text-align: center"
                          @click="changeItemCountPerLine(5)">&nbsp;5</md-menu-item>
            <md-menu-item style="text-align: center"
                          @click="changeItemCountPerLine(6)">&nbsp;6</md-menu-item>
          </md-menu-content>
        </md-menu>
      </md-list-item>
    </md-list>

    <md-content class="endpoint_grid md-scrollbar">

      <!--*********************************************************** Debut Others *****************************************************************************-->
      <div v-if="endpoints.length > 0">
        <md-toolbar class="md-dense md-primary">
          <h3 class="md-title"
              style="flex: 1">Others</h3>
          <md-button class="md-icon-button md-dense"
                     @click="showOrHideOther">
            <!-- {{ showEndpoint ? "Hide" : "Show" }} -->

            <md-icon v-if="!showEndpoint">
              keyboard_arrow_down
            </md-icon>
            <md-icon v-if="showEndpoint">
              keyboard_arrow_up
            </md-icon>

          </md-button>
        </md-toolbar>

        <div>
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
// var appName = "smartConnector";

export default {
  name: "endpointGlobalComponent",
  components: { endpointComponent, endpointGroup },
  props: ["deviceNode", "appName", "endpointSelected"],
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
    changeItemCountPerLine: function(itemCount) {
      this.itemCountPerLine = itemCount;
      globalType.spinal.eventBus.$emit(
        "itemCountPerLineChange",
        this.itemCountPerLine
      );
    }
  },
  watch: {
    deviceNode: function(newDeviceNode) {
      var _self = this;

      if (typeof newDeviceNode != "undefined") {
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
    }
  }
};
</script>


<style>
.endpointContainer {
  height: calc(50% - 20px) !important;
  border-bottom: 1px solid gray;
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
  border: 1px solid red;
  margin-bottom: 5px;
  padding-top: 10px;
}
</style>
