<template>

  <md-content>

    <md-toolbar class="md-primary">
      <h3 class="md-title"
          style="flex: 1">{{endPointGroupName}}</h3>
      <md-button @click="showHideEndpoints">{{!show ? "Show" : "Hide"}}</md-button>
    </md-toolbar>

    <div v-if="show">
      <endpoint-component v-for="endpoint in endPointGroups"
                          :key="endpoint._server_id"
                          :endpointNode="endpoint"
                          @selectEndpoint="select_endpoint"></endpoint-component>
    </div>

  </md-content>

</template>


<script>
var getInfo = require("../classes/getInfo.js");
import endpointComponent from "./endpointComponent.vue";
var getInfoInstance = new getInfo.GetInformation();
var appName = "smartConnector3";
export default {
  name: "endpointGroup",
  components: { endpointComponent },
  props: ["endpointGroupNode"],
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
    this.endPointGroupName = this.endpointGroupNode.name.get();
    this.endPointGroups = this.endpointGroupNode.getChildrenByAppByRelation(
      appName,
      "hasEndpoint"
    );
    // .then(el => {
    //   for (var i = 0; i < el.length; i++) {
    //     _self.endPointGroups.push(getInfoInstance.getDeviceDetail(el[i]));
    //   }
    // });
  }
};
</script>