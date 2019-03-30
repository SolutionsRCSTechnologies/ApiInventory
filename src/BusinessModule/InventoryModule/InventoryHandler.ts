import { InventoryDBHandle } from './InventoryDBHandler';
import { DBConfig } from '../../DBModule/DBConfig';
import { MethodResponse, DBConfiguaration } from '../../CommonModule/Entities';
import { Util } from '../../CommonModule/UtilHandler';

class InventoryHandler {

  async ValidateHeaderRequest(header: any) {
    let isValid = true;
    if (header) {
      if (!(header.userid && header.userid.length > 0)) {
        isValid = false;
      }
      if (!(header.sessionid && header.sessionid.length > 0)) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }

  async ValidateHeader(header) {
    let retVal: MethodResponse = new MethodResponse();
    try {
      if (header) {
        if (await this.ValidateHeaderRequest(header)) {
          retVal = await InventoryDBHandle.ValidateHeader(header);
        } else {
          retVal.ErrorCode = 2;
          retVal.Message = 'The header request is not valid.';
        }
      } else {
        retVal.ErrorCode = 1;
        retVal.Message = 'The header is empty.';
      }
    } catch (e) {
      throw e;
    }
    return retVal;
  }

  async SetInventoryTypeList(header: any, body: any) {
    let retVal = new MethodResponse();
    try {
      if (header) {
        let sessionInfo: MethodResponse = await this.ValidateHeader(header);
        let config: DBConfiguaration = await Util.GetDBDeatil(sessionInfo);
        if (body) {
          await InventoryDBHandle.SetInventoryTypeList(body, config).then(obj => {
            retVal = obj;
          }).catch(err => {
            throw err;
          });
        } else {
          retVal.ErrorCode = 3;
          retVal.Message = 'Request body is empty.';
        }
      } else {
        retVal.ErrorCode = 1;
        retVal.Message = 'Request header is empty.';
      }
    } catch (error) {
      retVal.ErrorCode = 2;
      retVal.Message = 'Error occurred.';
    }
    return retVal;
  }
  async AddUpdateInventoryType(header: any, body: any[]) {
    let retVal = new MethodResponse();
    let updatedObj: any[];
    let insertedObj: any[];
    console.log(10);
    try {
      if (header) {
        let sessionInfo: MethodResponse = await this.ValidateHeader(header);
        let config: DBConfiguaration = await Util.GetDBDeatil(sessionInfo);
        if (body) {
          console.dir(body);
          try {
            updatedObj = body.filter(item => item.productId);
            insertedObj = body.filter(item => !item.productId);
          }
          catch (error) {
            console.log(20);
            console.log(error);
          }
          if (insertedObj.length > 0) {
            await InventoryDBHandle.SetInventoryTypeList(insertedObj, config).then(obj => {
              retVal = obj;
            }).catch(err => {
              throw err;
            });
          }

          if (updatedObj.length > 0) {
            await InventoryDBHandle.UpdateInventoryTypeList(updatedObj, config).then(obj => {
              console.log('obj');
              console.log(obj);
              retVal.Message = retVal.Message + "</br> " + obj.Message;
            }).catch(err => {
              throw err;
            });
          }



          //  await InventoryDBHandle.SetInventoryTypeList(reqData, config).then(obj=>{
          //    retVal = obj;
          //  }).catch(err=>{
          //    throw err;
          //  });

        } else {
          retVal.ErrorCode = 3;
          retVal.Message = 'Request body is empty.';
        }
      } else {
        retVal.ErrorCode = 2;
        retVal.Message = 'Request header is empty.';
      }
    } catch (error) {
      retVal.ErrorCode = 1;
      retVal.Message = 'Exception Occurred.';
    }
    return retVal;
  }



  async GetInventoryTypeList(header: any, body: any) {
    let retVal = new MethodResponse();
    try {
      if (header) {
        let sessionInfo: MethodResponse = await this.ValidateHeader(header);
        let config: DBConfiguaration = await Util.GetDBDeatil(sessionInfo);
        if (body) {
          retVal = await InventoryDBHandle.GetInventoryTypeList(body, config);
          if (retVal && retVal.Result && retVal.Result.length > 0) {
            retVal.Result.forEach(item => {
              item.CreatedFlag = 'N';
              item.editedFlag = 'N';
            });
          }
        } else {
          retVal.ErrorCode = 3;
          retVal.Message = 'Request body is empty.';
        }
      } else {
        retVal.ErrorCode = 2;
        retVal.Message = 'Request header is empty.';
      }
    } catch (error) {
      retVal.ErrorCode = 1;
      retVal.Message = 'Exception Occurred.';
    }
    return retVal;
  }

  async InventoryTypeGet(header: any, body: any) {
    let retVal = new MethodResponse();
    try {
      if (header) {
        let sessionInfo: MethodResponse = await this.ValidateHeader(header);
        let config: DBConfiguaration = await Util.GetDBDeatil(sessionInfo);
        if (body) {
          await InventoryDBHandle.InventoryTypeGet(body, config).then(obj => {
            retVal = obj;
          }).catch(err => {
            throw err;
          });
        } else {
          retVal.ErrorCode = 3;
          retVal.Message = 'Request body is empty.';
        }
      } else {
        retVal.ErrorCode = 2;
        retVal.Message = 'Request header is empty.';
      }
    } catch (error) {
      retVal.ErrorCode = 1;
      retVal.Message = 'Exception Occurred.';
    }
    return retVal;
  }


  async DeleteInventoryTypeList(header: any, body: any) {
    let retVal = new MethodResponse();
    try {
      if (header) {
        let sessionInfo: MethodResponse = await this.ValidateHeader(header);
        let config: DBConfiguaration = await Util.GetDBDeatil(sessionInfo);
        if (body) {
          await InventoryDBHandle.DeleteInventoryTypeList(body, config).then(obj => {
            retVal = obj;
          }).catch(err => {
            throw err;
          });
        } else {
          retVal.ErrorCode = 3;
          retVal.Message = 'Request body is empty.';
        }
      } else {
        retVal.ErrorCode = 2;
        retVal.Message = 'Request header is empty.';
      }
    } catch (error) {
      retVal.ErrorCode = 1;
      retVal.Message = 'Exception Occurred.';
    }
    return retVal;
  }


  async GetInventoryItems(reqData: any) {
    let retVal: any = null;
    try {

    } catch (e) {
      throw e;
    }
    return retVal;
  }

  async AddOrUpdateInventoryItems(reqData: any) {
    let retVal: any = null;
    try {

    } catch (e) {
      throw e;
    }
    return retVal;
  }

  // async GetInventoryTypeList(listObj: any) {
  //   let retVal = null, retVal1 = null;
  //   if (listObj) {
  //     let config = DBConfig;
  //     config.UserDBName = "MediStockDB";
  //     //  await InventoryDBHandle.GetInventoryTypeList(listObj, config).then(obj=>{
  //     //    retVal = obj;
  //     //  }).catch(err=>{
  //     //    throw err;
  //     //  });
  //     retVal = await InventoryDBHandle.GetInventoryTypeList(listObj, config);
  //     retVal1 = await InventoryDBHandle.GetInventoryProdTypeList(listObj, config);

  //   }
  //   console.log('retVal');
  //   console.log(retVal);
  //   retVal.res.forEach(item => {
  //     item.CreatedFlag = 'N';
  //     item.editedFlag = 'N';
  //   });
  //   retVal1.res.forEach(item => {
  //     item.CreatedFlag = 'N';
  //     item.editedFlag = 'N';
  //   });
  //   return {
  //     "inventoryList": retVal,
  //     "inventoryprodList": retVal1
  //   };
  // }

  async RemoveInventoryItems(reqData: any) {
    let retVal: any = null;
    try {

    } catch (e) {
      throw e;
    }
    return retVal;
  }


  async SetInventoryprodTypeList(reqData: any) {
    // let retVal = null;
    // if(reqData){
    //  let config = DBConfig;
    //  config.UserDBName = "MediStockDB";
    //  await InventoryDBHandle.SetInventoryprodTypeList(reqData, config).then(obj=>{
    //    retVal = obj;
    //  }).catch(err=>{
    //    throw err;
    //  });
    // }
    // return retVal;

    let retVal = null;
    let updatedObj: any[];
    let insertedObj: any[];
    if (reqData) {
      console.dir(reqData);
      let config = DBConfig;
      config.UserDBName = "MediStockDB";
      try {
        updatedObj = reqData.filter(item => item.inventoryId);
        insertedObj = reqData.filter(item => !item.inventoryId);
      }
      catch (error) {
        console.log(error);
      }
      if (insertedObj.length > 0) {
        await InventoryDBHandle.SetInventoryprodTypeList(insertedObj, config).then(obj => {
          retVal = obj;
        }).catch(err => {
          throw err;
        });
      }

      if (updatedObj.length > 0) {
        await InventoryDBHandle.UpdateInventoryprodTypeList(updatedObj, config).then(obj => {
          console.log('obj');
          console.log(obj);
          retVal = retVal + "</br> " + obj;
        }).catch(err => {
          throw err;
        });
      }
    }
    return retVal;
  }
}

export let inventoryHandle = new InventoryHandler();