import { LoginHandle } from '../BusinessModule/AuthModule/Login/LoginHandler';
import { RegistrationHandle } from '../BusinessModule/AuthModule/Register/RegistrationHandler';
import { inventoryHandle } from '../BusinessModule/InventoryModule/InventoryHandler';
import { Util } from './UtilHandler';


enum APIMethodType {
    "GET", "POST", "DELETE"
};

class RoutingMethods {
    // public async Login(reqData: any) {
    //     let retVal: any;
    //     try {
    //         retVal = await LoginHandle.Login(reqData);
    //     }
    //     catch (e) {
    //         throw e;
    //     }
    //     return retVal;
    // }
    // public async Register(reqData: any) {
    //     let retVal: any;
    //     try {
    //         retVal = await RegistrationHandle.Register(reqData);
    //     }
    //     catch (e) {
    //         throw e;
    //     }
    //     return retVal;
    // }

    public async InventoryTypeAdd(reqData: any) {
        let retVal: any;
        try {
            retVal = await inventoryHandle.SetInventoryTypeList(reqData);
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

    public async AddUpdateInventoryType(reqData: any) {
        console.log(100);
        console.log(reqData);
        let retVal: any;
        try {
            retVal = await inventoryHandle.AddUpdateInventoryType(reqData);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        return retVal;
    }

    public async InventoryTypeDelete(productNameobj: any) {
        let retVal: any;
        try {
            retVal = await inventoryHandle.DeleteInventoryTypeList(productNameobj);
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

    public async InventoryTypeList(listObj: any) {
        let retVal: any;
        try {
            console.log(1);
            retVal = await inventoryHandle.GetInventoryTypeList(listObj);
            console.log(2);
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

    public async InventoryTypeGet(reqData: any) {
        let retVal: any;
        try {
            retVal = await inventoryHandle.InventoryTypeGet(reqData);
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

}

export const RoutingHandler = [
    // {
    //     url:"/",
    //     handler: Util.ShowEndPoints,
    //     method: APIMethodType.GET,
    //     name: "Show Endpoints"
    // },
    // {
    //     url: "/auth/login",
    //     handler: new RoutingMethods().Login,
    //     method: APIMethodType.POST,
    //     name: "Login Api"

    // },
    // {
    //     url: "/auth/register",
    //     handler: new RoutingMethods().Register,
    //     method: APIMethodType.POST,
    //     name: "Registration Api"
    // },
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
    }
];


