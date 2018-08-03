
<template>
  <div class="dashboard">

    <md-button @click="test()"
               class="md-icon-button">
      <md-icon>add</md-icon>
    </md-button>

    <endpoint-global-component @select_endpoint="on_item_selected"
                               :deviceNode="deviceNodes"
                               :appName="appName"></endpoint-global-component>

    <graph-component :endpointSelected="endpointSelected"
                     :appName="appName"></graph-component>

    <!-- <md-list>
        <device-component @itemSelected="on_item_selected"
                          :devices="devicesList"></device-component>
      </md-list>

      <p>{{item_selected}}</p> -->

  </div>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
var EventBus;
var graph;
// var appName = "smartConnector3";

import endpointGlobalComponent from "./components/endpointGlobalComponent.vue";
import graphComponent from "./components/graphComponent.vue";
export default {
  name: "dashboard",
  data() {
    return {
      contextList: null,
      inc: 0,
      deviceNodes: null,
      appName: null,
      endpointSelected: null,
      bimObjectSelected: null
    };
  },
  components: { endpointGlobalComponent, graphComponent },
  methods: {
    test: function() {
      console.log(this.deviceNodes);
    },
    on_item_selected: function(item) {
      this.endpointSelected = item;
    },
    openClosePanel() {
      var _panel = globalType.spinal.panelManager.panelsGroup.dashboard[0];

      if (!_panel.isVisible()) {
        _panel.setVisible(true);
      }
    },
    getEvents: function() {
      var _self = this;

      EventBus.$on("nodeContext", el => {
        console.log("nodeContext", el);
        _self.appName = el.context.name.get();
        _self.deviceNodes = el.node;
        // _self.openClosePanel();
      });

      EventBus.$on("openDashboard", el => {
        console.log("openDashboard", el);
        _self.appName = el.context.name.get();
        _self.deviceNodes = el.node;
        _self.openClosePanel();
      });

      EventBus.$on("getNodeClick", el => {
        console.log("getNodeClick", el);
        _self.bimObjectSelected = el;
        let relations = el.getRelationsByAppNameByType("linker", "link");
        if (relations.length > 0) {
          let relation = relations[0];
          let node = relation.getNodeList2()[0];
          node.getElement().then(ele => {
            if (
              ele.constructor.name === "SpinalEndpoint" ||
              ele.constructor.name === "SpinalDevice"
            ) {
              _self.appName = "smartConnector";
              _self.deviceNodes = node;
              _self.openClosePanel();
            }
          });
        }
      });
    },
    linkToDB: function() {
      let interval = setInterval(() => {
        if (
          typeof globalType.spinal.contextStudio != "undefined" &&
          typeof globalType.spinal.contextStudio.graph != "undefined"
        ) {
          graph = globalType.spinal.contextStudio.graph;
          clearInterval(interval);
        }
      }, 500);
    },
    selectBimObject() {
      console.log("click", this.bimObjectSelected);
    }
  },
  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
    spinal.circularMenu.addButton(this.selectBimObject, "show_chart");
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

dashboard .md-icon-button {
  width: 100%;
  height: 20px;
}

.md-toolbar.md-dense {
  min-height: 30px !important;
}

.dashboard .md-toolbar {
  height: 20px;
  min-height: 20px;
}

.dashboard .md-title {
  font-size: 15px;
}
</style>
