<template>

  <md-content class="endpointContainer md-scrollbar">

    <!--*********************************************************** Debut Others *****************************************************************************-->
    <div v-if="endpoints.length > 0">
      <md-toolbar class="md-dense md-primary">
        <h3 class="md-title"
            style="flex: 1">Others</h3>
        <md-button @click="showOrHideOther">{{ showEndpoint ? "Hide" : "Show" }}</md-button>
      </md-toolbar>

      <endpoint-component v-if="showEndpoint"
                          @selectEndpoint="selectEndpoint"
                          v-for="endpoint in endpoints"
                          :key="endpoint._server_id"
                          :endpointNode="endpoint"></endpoint-component>

    </div>

    <!--*********************************************************** Fin Others *****************************************************************************-->

    <endpoint-group v-for="endpoint_group in endPointsGroupNodes"
                    :key="endpoint_group._server_id"
                    :endpointGroupNode="endpoint_group"
                    @selectEndpoint="selectEndpoint"
                    :appName="appName"></endpoint-group>
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
  props: ["deviceNode", "appName"],
  data() {
    return {
      endpoints: [],
      endPointsGroupNodes: [],
      showEndpoint: true
    };
  },
  methods: {
    selectEndpoint: function(item) {
      this.$emit("select_endpoint", item);
    },
    showOrHideOther: function() {
      this.showEndpoint = !this.showEndpoint;
    }
  },
  watch: {
    deviceNode: function(newDeviceNode) {
      if (typeof newDeviceNode != "undefined") {
        this.endpoints = this.deviceNode.getChildrenByAppByRelation(
          this.appName,
          "hasEndpoint"
        );

        console.log("endpoints", this.endpoints);

        this.endPointsGroupNodes = this.deviceNode.getChildrenByAppByRelation(
          this.appName,
          "hasEndpointGroup"
        );

        console.log("endPointsGroupNodes", this.endPointsGroupNodes);
      } else {
        console.log("no");
      }
    }
  }
};
</script>


<style>
.endpointContainer {
  height: calc(50% - 20px) !important;
  overflow: hidden;
  overflow-y: auto;
  border-bottom: 1px solid gray;
}

.endpointContainer .md-toolbar.md-dense.md-primary.md-theme-default {
  min-height: 30px !important;
  margin-bottom: 3px;
  font-size: 13px;
  text-transform: capitalize;
}

/* .md-dense.md-primary {
  min-height: 30px !important;
} */
</style>
