
<template>
  <div class="dashboard">

    <endpoint-global-component @select_endpoint="on_item_selected"
                               :deviceNode="deviceNodes"
                               :severalEndpoints="severalEndpoints"
                               :appName="appName"
                               :endpointSelected="endpointSelected"
                               :logNodes="logNodes"></endpoint-global-component>

    <!-- <graph-component :endpointSelected="endpointSelected"
                     :appName="appName"></graph-component> -->

  </div>
</template>

<script>
var config = require("./config.js");
const globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
var EventBus;
var graph;
var appName = config.appName;

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
      bimObjectSelected: null,
      severalEndpoints: null,
      logNodes: null
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
    changeDashBoardPanelTitle(name) {
      if (globalType.spinal.panelManager.panelsGroup.dashboard[0].isVisible()) {
        globalType.spinal.panelManager.panelsGroup.dashboard[0].setTitle(
          "Dashboard : " + name
        );
      }
    },
    getEvents: function() {
      var _self = this;

      EventBus.$on("nodeContext", el => {
        _self.appName = el.context.name.get();

        if (_self.appName != "logger") {
          _self.deviceNodes = el.node;
          _self.severalEndpoints = null;
          _self.logNodes = null;
        } else {
          _self.logNodes = el.node;
          _self.deviceNodes = null;
          _self.severalEndpoints = null;
        }

        this.changeDashBoardPanelTitle(el.node.name.get());
        // _self.openClosePanel();
      });

      EventBus.$on("openDashboard", el => {
        _self.appName = el.context.name.get();

        if (_self.appName != "logger") {
          _self.deviceNodes = el.node;
          _self.severalEndpoints = null;
          _self.logNodes = null;
        } else {
          _self.deviceNodes = null;
          _self.severalEndpoints = null;
          _self.logNodes = el.node;
        }

        _self.openClosePanel();
        _self.changeDashBoardPanelTitle(el.node.name.get());
      });

      /****** Bon */
      EventBus.$on("getNodeClick", el => {
        _self.bimObjectSelected = el;
      });

      EventBus.$on("dashBoardBimObject", el => {
        globalType.spinal.panelManager.panelsGroup.dashboard[0].setTitle(
          "Dashboard : " + el.name.get()
        );
        _self.bimObjectSelected = el;
        _self.selectBimObject();
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
    getNodeItem: function(nodeI) {
      nodeI.getElement().then(el => {
        if (
          el.constructor.name === "SpinalEndpoint" ||
          el.constructor.name === "SpinalDevice"
        ) {
          this.severalEndpoints.push(nodeI);
        }
      });
    },
    selectBimObject() {
      var _self = this;

      let relations = this.bimObjectSelected.getRelationsByAppNameByType(
        "linker",
        "link"
      );
      if (relations.length > 0) {
        var relation = relations[0];

        relation.bind(() => {
          var node = relation.getNodeList2();

          if (node.length > 1) {
            _self.deviceNodes = null;
            _self.logNodes = null;

            _self.severalEndpoints = [];
            _self.appName = appName; //_self.apppName;

            for (var i = 0; i < node.length; i++) {
              var x = node[i];
              this.getNodeItem(x);
            }
          } else {
            var t = node[0];
            t.getElement().then(ele => {
              if (
                ele.constructor.name === "SpinalEndpoint" ||
                ele.constructor.name === "SpinalDevice"
              ) {
                _self.appName = appName; //_self.apppName
                _self.deviceNodes = t;
                _self.severalEndpoints = null;
                _self.logNodes = null;
              }
            });
          }
        });

        _self.openClosePanel();
      } else {
        alert("no relation found !");
      }
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
</style>

