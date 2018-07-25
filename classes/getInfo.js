var GetInformation = class GetInformation extends Model {
  constructor() {
    super();
  }

  // ReturnDeviceLst(lst) {
  //   var promiseLst = [];
  //   arrayToReturn = [];

  //   for (var i = 0; i < lst.length; i++) {
  //     promiseLst.push(lst[i].getElement());
  //   }

  //   console.log("promiseLst", promiseLst);


  //   return arrayToReturn;
  // }


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
    deviceCopy['min'] = device.min.get();
    deviceCopy['max'] = device.max.get();
    deviceCopy['dataNature'] = device.dataNature.get();
    deviceCopy['unit'] = device.unit.get();
    deviceCopy['currentValue'] = device.currentValue.get();

    return deviceCopy;

  }

};

module.exports.GetInformation = GetInformation;