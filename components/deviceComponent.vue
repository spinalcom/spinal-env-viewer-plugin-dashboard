<template>

  <md-list>
    <md-list-item class="endPointComponent"
                  v-for="device in deviceList"
                  :key="device._server_id"
                  @click="openEndPointPanel(device)">
      <p>{{device.name}}</p>
    </md-list-item>
  </md-list>
</template>


<script>
var info = require("../classes/getInfo.js");

var information = new info.GetInformation();
const globalType = typeof window === "undefined" ? global : window;
export default {
  name: "deviceComponent",
  components: {},
  props: ["devices"],
  data() {
    return {
      deviceList: []
    };
  },
  methods: {
    openEndPointPanel: function(device) {
      this.$emit("itemSelected", device);
    }
  },
  watch: {
    devices: function() {
      var _self = this;
      var promises = [];

      if (this.devices != null) {
        for (var i = 0; i < this.devices.length; i++) {
          promises.push(this.devices[i].getElement());
        }

        Promise.all(promises).then(function(values) {
          for (var i = 0; i < values.length; i++) {
            _self.deviceList.push(information.getDeviceDetail(values[i]));
          }
        });
      } else {
        console.log("devices undefined");
      }
    }
  }
};
</script>
