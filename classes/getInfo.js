var GetInformation = class GetInformation extends Model {
  constructor() {
    super();
  }



  getAllEndPoint(deviceNode) {
    deviceNode.get
  }


  getDeviceDetail(device) {
    var deviceCopy = {};

    deviceCopy['id'] = device.id.get();
    // deviceCopy['ipAddress'] = device.ipAddress.get();
    deviceCopy['model_id'] = device.model_id;
    deviceCopy['name'] = device.name.get();
    deviceCopy['path'] = device.path.get();
    // deviceCopy['type'] = device.type.get();
    deviceCopy['_server_id'] = device._server_id;
    deviceCopy['min'] = device.seuilMin.get();
    deviceCopy['max'] = device.seuilMax.get();
    deviceCopy['dataNature'] = device.dataNature.get();
    deviceCopy['unit'] = (device.unit.get() && device.unit.get().trim().length >
      0 && device.unit.get() != "none") ? device.unit.get() : "-";

    // deviceCopy['type'] = typeof device.currentValue.get();
    deviceCopy['type'] = device.dataType.get() ? device.dataType.get() :
      "string";

    if (deviceCopy['type'] != "string" && isNaN(device.currentValue.get())) {
      deviceCopy["currentValue"] = "Not defined"
    } else {
      deviceCopy["currentValue"] = device
        .currentValue
        .get()
    }

    // deviceCopy['currentValue'] = ! &&
    //   deviceCopy['type'] != "string" ?  : "Not defined";

    return deviceCopy;

  }

};

module.exports.GetInformation = GetInformation;