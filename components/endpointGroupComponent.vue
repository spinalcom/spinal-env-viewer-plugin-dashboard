<template>

  <md-content>

    <md-toolbar class="md-dense md-primary"
                style="min-height : 20px; height : 20px; padding-right: 0px;">
      <h3 class="md-title"
          style="flex: 1">{{endPointGroupName}}</h3>
      <md-button class="md-icon-button md-dense"
                 @click="showHideEndpoints">
        <md-icon v-if="!show">
          keyboard_arrow_down
        </md-icon>
        <md-icon v-if="show">
          keyboard_arrow_up
        </md-icon>
      </md-button>
    </md-toolbar>

    <div v-if="show">
      <endpoint-component v-for="endpoint in endPointGroups"
                          :key="endpoint._server_id"
                          :endpointNode="endpoint"
                          @selectEndpoint="select_endpoint"
                          :appName="appName"
                          :endpointSelected="endpointSelected"></endpoint-component>
    </div>

  </md-content>

</template>


<script>
var getInfo = require("../classes/getInfo.js");
import endpointComponent from "./endpointComponent.vue";
var getInfoInstance = new getInfo.GetInformation();
// var appName = "smartConnector";
export default {
  name: "endpointGroup",
  components: { endpointComponent },
  props: ["endpointGroupNode", "appName", "endpointSelected"],
  data() {
    return {
      endPointGroupName: "",
      endPointGroups: [],
      show: true
    };
  },
  methods: {
    select_endpoint: function(endp) {
      this.$emit("selectEndpoint", endp);
    },
    showHideEndpoints: function() {
      this.show = !this.show;
    }
  },
  mounted() {
    // var _self = this;
    if (this.endpointGroupNode) {
      this.endPointGroupName = this.endpointGroupNode.name.get();
      this.endPointGroups = this.endpointGroupNode.getChildrenByAppByRelation(
        this.appName,
        "hasEndpoint"
      );
    }
    // .then(el => {
    //   for (var i = 0; i < el.length; i++) {
    //     _self.endPointGroups.push(getInfoInstance.getDeviceDetail(el[i]));
    //   }
    // });
  },
  watch: {
    endpointGroupNode: function() {
      this.endPointGroupName = this.endpointGroupNode.name.get();
      this.endPointGroups = this.endpointGroupNode.getChildrenByAppByRelation(
        this.appName,
        "hasEndpoint"
      );
    }
  }
};
</script>