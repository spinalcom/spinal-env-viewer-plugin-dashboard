<script>
import Vue from "vue";
import dashboardManager from "./dashboardManager.vue";

const ComponentCtor1 = Vue.extend(dashboardManager);
const ClassName = "dashboard";
const globalType = typeof window === "undefined" ? global : window;
const spinalSystem = globalType.spinal.spinalSystem;

const PanelTitle1 = "dashboard";
const ButtonLabel1 = "dashboard";
const ButtonIcon1 = "configuration";
var itemSelected;

/*****
 *
 * Info Panel DashBoard Graph
 *
 */
const graphPanelTitle = "Graph";

const classExtention = class {
  constructor(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.viewer = viewer;
    this.panel1 = null;
    this.graphpanel = null;
  }
  load() {
    if (this.viewer.toolbar) {
      this.createUI();
    } else {
      this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
      this.viewer.addEventListener(
        av.TOOLBAR_CREATED_EVENT,
        this.onToolbarCreatedBinded
      );
    }

    return true;
  }
  onToolbarCreated() {
    this.viewer.removeEventListener(
      av.TOOLBAR_CREATED_EVENT,
      this.onToolbarCreatedBinded
    );
    this.onToolbarCreatedBinded = null;
    this.createUI();
  }
  unload() {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
  }
  // This function is to create your button on viewer, it used autodesk forge api
  createUI() {
    this.panel1 = new PanelClass(this.viewer, PanelTitle1);
    this.panel1.container.style.top = "30%";
    this.panel1.container.style.width = "40%";
    globalType.spinal.panelManager.registerPanel(this.panel1, ClassName);

    // var button1 = new Autodesk.Viewing.UI.Button(ButtonLabel1);
    // globalType.spinal.panelManager.registerButton(button1, ClassName);
    // button1.container.style.color = "red";
    // var icon = button1.container.firstChild;
    // icon.className = "adsk-button-icon md-icon md-icon-font md-theme-default";
    // icon.innerHTML = ButtonIcon1;
    // button1.setToolTip(ButtonLabel1);

    this.initialize();
    // spinal.circularMenu.addButton(this.openClosePanel.bind(this), "folder");
  }
  initialize() {
    var _container1 = document.createElement("div");
    _container1.className = this.panel1.container.id + "-pannelcontainer";
    _container1.style.height = "80% !important";
    _container1.style.overflowY = "auto";
    _container1.style.width = "400px";
    // this.panel1.container.style.width = "600px !important";
    // this.panel1.container.classList.add("dashboard-panel");
    this.panel1.container.appendChild(_container1);
    new ComponentCtor1().$mount(_container1);
  }

  // openClosePanel() {
  //   EventBus.$on("getNodeClick", el => {
  //     itemSelected = el;
  //     console.log("element inside nodeClick", itemSelected);
  //   });
  // }
};
export default new class {
  constructor() {
    Autodesk.Viewing.theExtensionManager.registerExtension(
      ClassName,
      classExtention
    ); // this is the register of your class
    window.spinal.ForgeExtentionManager.addExtention(ClassName);
  }
}();
</script>


<style>
.bkcolor {
  background-color: rgba(17, 48, 223, 0.644);
}
/* .dashboard-panel {
  width: 400px !important;
} */
</style>
