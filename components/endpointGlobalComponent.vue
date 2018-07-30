<template>

  <div class="endpointContainer">

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
                    @selectEndpoint="selectEndpoint"></endpoint-group>

  </div>

</template>


<script>
const globalType = typeof window === "undefined" ? global : window;
var getInfo = require("../classes/getInfo.js");
import endpointComponent from "./endpointComponent.vue";
import endpointGroup from "./endpointGroupComponent.vue";

var getInfoInstance = new getInfo.GetInformation();
var appName = "smartConnector3";

export default {
  name: "endpointGlobalComponent",
  components: { endpointComponent, endpointGroup },
  props: ["deviceNode"],
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
      console.log("device node watch");

      // var _self = this;
      if (typeof newDeviceNode != "undefined") {
        this.endpoints = this.deviceNode.getChildrenByAppByRelation(
          appName,
          "hasEndpoint"
        );
        // .then(el => {
        //   for (var i = 0; i < el.length; i++) {
        //     _self.endpoints.push(getInfoInstance.getDeviceDetail(el[i]));
        //   }
        // });

        this.endPointsGroupNodes = this.deviceNode.getChildrenByAppByRelation(
          appName,
          "hasEndpointGroup"
        );
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

.endpointContainer .md-toolbar.md-theme-default.md-primary {
  height: 20px !important;
  margin-bottom: 3px;
  font-size: 15px;
}
</style>
