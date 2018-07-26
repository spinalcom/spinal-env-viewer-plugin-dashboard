<template>

  <md-content>

    <md-toolbar class="md-primary">
      <h3 class="md-title"
          style="flex: 1">{{endPointGroupName}}</h3>
      <md-button @click="test">Show</md-button>
    </md-toolbar>

    <endpoint-component v-for="endpoint in endPointGroups"
                        :key="endpoint._server_id"
                        :endpoint="endpoint"></endpoint-component>

  </md-content>

</template>


<script>
var getInfo = require("../classes/getInfo.js");
import endpointComponent from "./endpointComponent.vue";
var getInfoInstance = new getInfo.GetInformation();

export default {
  name: "endpointGroup",
  component: { endpointComponent },
  props: ["endpointGroupNode"],
  data() {
    return {
      endPointGroupName: "",
      endPointGroups: []
    };
  },
  methods: {
    test: function() {
      console.log("endpointGroupNode", this.endpointGroupNode);
      console.log("endPointGroupName", this.endPointGroupName);
      console.log("endPointGroups", this.endPointGroups);
    }
  },
  watch: {
    endpointGroupNode: function() {
      _self = this;
      console.log("watch executer");
      this.endPointGroupName = this.endpointGroupNode.name.get();
      this.endpointGroupNode
        .getChildrenElementsByAppByRelation("smartConnector", "hasEndpoint")
        .then(el => {
          for (var i = 0; i < el.length; i++) {
            _self.endPointGroups.push(getInfoInstance.getDeviceDetail(el[i]));
          }
        });
    }
  }
};
</script>