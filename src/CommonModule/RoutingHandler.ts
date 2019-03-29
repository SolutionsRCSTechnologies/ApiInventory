import { inventoryHandle } from '../BusinessModule/InventoryModule/InventoryHandler';
import { Util } from './UtilHandler';


enum APIMethodType {
    "GET", "POST", "DELETE"
};

class RoutingMethods {
    public async InventoryTypeAdd(reqData: any) {
        let retVal: any;
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await inventoryHandle.SetInventoryTypeList(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

    public async AddUpdateInventoryType(reqData: any) {
        let retVal: any;
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await inventoryHandle.AddUpdateInventoryType(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

    public async InventoryTypeDelete(reqData: any) {
        let retVal: any;
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await inventoryHandle.DeleteInventoryTypeList(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

    public async InventoryTypeList(reqData: any) {
        let retVal: any;
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await inventoryHandle.GetInventoryTypeList(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

    public async InventoryTypeGet(reqData: any) {
        let retVal: any;
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await inventoryHandle.InventoryTypeGet(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

    public async GetInventoryItems(reqData: any) {
        let retVal: any;
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                //retVal = await inventoryHandle.InventoryTypeGet(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

    public async AddOrUpdateInventoryItems(reqData: any) {
        let retVal: any;
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                //retVal = await inventoryHandle.InventoryTypeGet(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

    public async RemoveInventoryItems(reqData: any) {
        let retVal: any;
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                //retVal = await inventoryHandle.InventoryTypeGet(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

}

export const RoutingHandler = [
    {
        url: "/inventory/type/add",
        handler: new RoutingMethods().InventoryTypeAdd,
        method: APIMethodType.POST,
        name: "Inventory Type Add Api"
    },
    {
        url: "/inventory/type/delete",
        handler: new RoutingMethods().InventoryTypeDelete,
        method: APIMethodType.POST,
        name: "Inventory Type Delete Api"
    },
    {
        url: "/inventory/type/list",
        handler: new RoutingMethods().InventoryTypeList,
        method: APIMethodType.POST,
        name: "Inventory Type List Api"
    },
    {
        url: "/inventory/type/addupdate",
        handler: new RoutingMethods().AddUpdateInventoryType,
        method: APIMethodType.POST,
        name: "Inventory Type Add/Update Api"
    },
    {
        url: "/inventory/type/get",
        handler: new RoutingMethods().InventoryTypeGet,
        method: APIMethodType.POST,
        name: "Inventory Type Get Api"
    },
    {
        url: "/inventory/items/get",
        handler: new RoutingMethods().GetInventoryItems,
        method: APIMethodType.POST,
        name: "Inventory Get Api"
    },
    {
        url: "/inventory/items/update",
        handler: new RoutingMethods().AddOrUpdateInventoryItems,
        method: APIMethodType.POST,
        name: "Inventory Add/Update Api"
    },
    {
        url: "/inventory/items/remove",
        handler: new RoutingMethods().RemoveInventoryItems,
        method: APIMethodType.POST,
        name: "Inventory Delete Api"
    }
];


