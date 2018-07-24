
<template>
  <md-content class="dashboard">

    <md-content class='mainButtons'>

      <md-button @click="test()"
                 class="md-icon-button">
        <md-icon>add</md-icon>
      </md-button>

      <md-list>
        <!-- <app-device v-for="dev in devicesList"
                    :bind:="device"
                    :bind::key="dev.id"></app-device> -->
        <device-component :devices="devicesList"></device-component>
      </md-list>

    </md-content>

  </md-content>
</template>

<script>
import getInfo from "./classes/getInfo.js";
const globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
var EventBus;
var graph;
var appName = "smartConnector";
var getInformation;
import deviceComponent from "./components/deviceComponent.vue";

export default {
  name: "dashboard",
  data() {
    return {
      contextList: null,
      inc: 0,
      devicesList: null
    };
  },
  components: { deviceComponent },
  methods: {
    test: function() {
      console.log(this.devicesList);
    },
    getEvents: function() {},
    linkToDB: function() {
      let interval = setInterval(() => {
        if (
          typeof globalType.spinal.contextStudio != "undefined" &&
          typeof globalType.spinal.contextStudio.graph != "undefined"
        ) {
          getInformation = new getInfo.GetInformation();

          graph = globalType.spinal.contextStudio.graph;

          graph.getApp(appName).then(el => {
            this.devicesList = el.startingNode.getChildrenByAppByRelation(
              appName,
              "hasDevice"
            );
          });
          clearInterval(interval);
        }
      }, 500);
    }
  },
  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
    this.linkToDB();
  }
};
</script>

<style scoped>
.dashboard {
  height: calc(100% - 35px);
}
</style>

<style  >
.dashboard button.md-icon-button.md-button.md-theme-default {
  min-width: 20px;
  width: 20px;
  height: 20px;
}

.dashboard .md-toolbar {
  height: 20px;
  min-height: 20px;
}

.dashboard .md-title {
  font-size: 15px;
}

.dashboard .md-list,
.md-list *,
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
}

.dashboard i.md-icon.md-icon-font.md-theme-default {
  font-size: 18px !important;
}

.dashboard span {
  font-size: 14px;
}

.dashboard .md-ripple.md-list-item-content {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}

.small-menu * {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}
</style>
