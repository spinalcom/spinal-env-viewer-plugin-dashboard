<template>

  <md-content>
    <!-- <button @click="logEndPoind">Hello World !</button> -->

    <div class="endpointContainer">

      <!--*********************************************************** Debut Others *****************************************************************************-->
      <div v-if="endpoints.length > 0">
        <md-toolbar class="md-primary">
          <h3 class="md-title"
              style="flex: 1">Others</h3>
          <md-button @click="showOrHideOther">{{ showEndpoint ? "Hide" : "Show" }}</md-button>
        </md-toolbar>

        <endpoint-component v-if="showEndpoint"
                            @selectEndpoint="selectEndpoint"
                            v-for="endpoint in endpoints"
                            :key="endpoint._server_id"
                            :endpoint="endpoint"></endpoint-component>

      </div>

      <!--*********************************************************** Fin Others *****************************************************************************-->

      <endpoint-group v-for="endpoint_group in endPointsGroupNodes"
                      :key="endpoint_group._server_id"
                      :endpointGroupNode="endpoint_group"></endpoint-group>

    </div>

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
      console.log("endpointGroup", this.endPointsGroup);
      console.log("deviceNode", this.deviceNode);
      // this.showEndpoint = !this.showEndpoint;
    }
  },
  watch: {
    deviceNode: function() {
      var _self = this;

      this.deviceNode
        .getChildrenElementsByAppByRelation("smartConnector", "hasEndpoint")
        .then(el => {
          for (var i = 0; i < el.length; i++) {
            _self.endpoints.push(getInfoInstance.getDeviceDetail(el[i]));
          }
        });

      this.endPointsGroupNodes = this.deviceNode.getChildrenByAppByRelation(
        "smartConnector",
        "hasEndpointGroup"
      );
    }
  }
};
</script>


<style>
.endpointContainer {
  height: 300px;
  overflow: hidden;
  overflow-y: auto;
  border-bottom: 1px solid gray;
}

.endpointContainer .md-toolbar.md-theme-default.md-primary {
  height: 40px;
}
</style>
