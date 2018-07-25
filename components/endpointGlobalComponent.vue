<template>

  <md-content>
    <!-- <button @click="logEndPoind">Hello World !</button> -->

    <div class="endpointContainer">

      <endpoint-component @selectEndpoint="selectEndpoint"
                          v-for="endpoint in endpoints"
                          :key="endpoint._server_id"
                          :endpoint="endpoint"></endpoint-component>
    </div>

  </md-content>

</template>


<script>
const globalType = typeof window === "undefined" ? global : window;
var getInfo = require("../classes/getInfo.js");
import endpointComponent from "./endpointComponent.vue";

var getInfoInstance = new getInfo.GetInformation();

export default {
  name: "endpointGlobalComponent",
  components: { endpointComponent },
  props: ["deviceNode"],
  data() {
    return {
      endpoints: []
    };
  },
  methods: {
    selectEndpoint: function(item) {
      this.$emit("select_endpoint", item);
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
    }
  }
};
</script>


<style>
.endpointContainer {
  height: 400px;
  border: 1px solid red;
}
</style>
