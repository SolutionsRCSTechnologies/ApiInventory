import { Response } from 'express';
import { RoutingHandler } from './RoutingHandler';
import { DBConfigEntity, MethodResponse, DBConfiguaration } from './Entities';
class Utilies {
    SendResponse(res: Response, obj: any) {
        try {
            if (obj) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(obj));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ message: "No data found!" }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    SendErrorResponse(res: Response, err: Error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(JSON.stringify(err));
    }

    async GetDBDeatil(obj: MethodResponse) {
        let retVal: DBConfiguaration = null;
        try {
            if (obj && obj.Result) {
                retVal.UserDBName = obj.Result.userdbname && obj.Result.userdbname.length > 0 ? obj.Result.userdbname : '';
                retVal.UserDBUrl = obj.Result.userdburl && obj.Result.userdburl.length > 0 ? obj.Result.userdburl : '';
            }
        } catch (error) {
            throw error;
        }
        return retVal;
    }

    async ValidateRequestStructure(req: any) {
        let isValid: boolean = false;
        try {
            if (req) {
                if (req.header && req.header.userid && req.header.userid.length > 0) {
                    if ((req.header.password && req.header.password.length > 0) ||
                        (req.header.sessionid && req.header.sessionid.length > 0)) {
                        isValid = true;
                    }
                }
            }
        } catch (e) {
            throw e;
        }
        return isValid;
    }

    // async ShowEndPoints(reqData:any){
    //     let retVal:any[]=[];
    //     await RoutingHandler.forEach(route=>{
    //         retVal.push({name: route.name, endpoint: route.url});
    //     });
    //     return retVal;
    // }
}

export let Util = new Utilies();