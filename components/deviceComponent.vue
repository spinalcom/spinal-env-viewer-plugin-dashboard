<template>

  <md-list-item class="endPointComponent"
                @click="openEndPointPanel">
    <p>Hello</p>
  </md-list-item>

</template>


<script>
export default {
  name: "deviceComponent",
  components: {},
  props: ["devices"],
  data() {
    return {
      deviceList: null
    };
  },
  methods: {
    openEndPointPanel: function() {
      console.log(this.devicesList);
    },
    mounted() {
      console.log("mounted");
      var promises = [];

      for (var i = 0; i < this.devices.length; i++) {
        promises.push(this.devices[i].getElement());
      }

      console.log(promises);

      Promise.all(promises).then(function(values) {
        console.log("values", values);
        this.deviceList = values;
      });
    }
  }
};
</script>
