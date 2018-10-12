<template>
  <md-content>
    <md-toolbar class="md-dense"
                style="min-height : 30px; height : 30px; padding-right: 10px; 
                background: #356bab">
      <h3 class="md-title"
          style="flex: 1">All Logs</h3>
      <md-button class="md-icon-button md-dense"
                 @click="showHideEndpoints"
                 style="margin-right: 20px;">
        <md-icon v-if="!show">
          keyboard_arrow_down
        </md-icon>
        <md-icon v-if="show">
          keyboard_arrow_up
        </md-icon>
      </md-button>
    </md-toolbar>

    <div class="_endpoint_div_content"
         v-if="show">
      <log-component @selectEndpoint="select_endpoint"
                     v-for="log in allLogs"
                     :key="log._server_id"
                     :endpointNode="log"
                     :endpointSelected="endpointSelected"></log-component>
    </div>
  </md-content>
</template>

<script>
var appName = "logger";
import logComponent from "./logComponent.vue";

export default {
  name: "logGroup",
  components: { logComponent },
  props: ["allLogs", "endpointSelected"],
  data() {
    return {
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
  mounted() {},
  watch: {}
};
</script>