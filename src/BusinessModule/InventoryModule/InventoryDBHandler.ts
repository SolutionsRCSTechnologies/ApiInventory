import { MongoClient, Db } from 'mongodb';

import { DBConfigEntity, MethodResponse, DBConfiguaration } from '../../CommonModule/Entities';
import { DBConfig, MainDBCollection, UserDBCollection } from '../../DBModule/DBConfig';
import { DBClient } from '../../DBModule/DBClient';
import { v4 } from 'uuid';
import { isDate } from 'util';

class InventoryDBHandler {
    private uuidv4 = v4;

    // Method to insert new data

    async ValidateHeader(header: any) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let errorCode: number = 0;
        try {
            let result = null;
            let config = DBConfig;
            mClient = await DBClient.GetMongoClient(config);
            let db: Db = await mClient.db(config.MainDBName);
            let sessionId: string = '';
            let userId: string = '';
            if (header && header.sessionid) {
                sessionId = header.sessionid;
                userId = header.userid;
            }
            if (sessionId && sessionId.length > 0 && userId && userId.length > 0) {
                await db.collection(MainDBCollection.ActiveSession).findOne({ sessionid: sessionId, userid: userId, active: 'Y' }).then(res => {
                    if (res) {
                        let currenttime = new Date();
                        if (isDate(res.endtime) && currenttime < res.endtime) {
                            result = res;
                        } else {
                            errorCode = 3;
                        }
                    } else {
                        errorCode = 2;
                    }
                }).catch(err => {
                    throw err;
                });
            } else {
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'Header is not valid, it does not contain any session id.';
                    break;
                case 2:
                    retVal.Message = 'No active session found.';
                    break;
                case 3:
                    retVal.Message = 'Session timeout, login again.';
                    break;
                default:
                    retVal.Result = {
                        sessionid: result.sessionid,
                        userid: result.userid,
                        elapsedtime: result.endtime,
                        usertype: result.usertype,
                        userrole: result.role,
                        username: result.username,
                        userdb: result.userdb,
                        userdburl: result.userdburl
                    };
                    break;
            }
        } catch (e) {
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    async SetInventoryTypeList(reqData: any[], config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        try {
            if (reqData) {
                let initconfig: DBConfigEntity = DBConfig;
                initconfig.UserDBUrl = config.UserDBUrl;
                initconfig.UserDBName = config.UserDBName;
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(initconfig);
                //config.UserDBName = "MediStockDB";
                let db: Db = await mClient.db(config.UserDBName);
                reqData = this.InsertDataManupulation(reqData, 'PRO');
                await db.collection("inventoryType").insertMany(reqData).then(
                    res => {
                        retVal.Message = "1 Product Successfully Inserted";
                    },
                    err => {
                        retVal.Message = err.errmsg;
                        console.log('err.errmsg');
                        console.log(err.errmsg);
                    }
                );
            }
        }
        catch (e) {
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    //Product Id Creation
    public InsertDataManupulation(reqData: any[], type?) {
        reqData.forEach(element => {

            element.createddate = new Date();
            element.createdBy = "Sourav C";
            element.updatedDate = new Date();
            element.updatedBy = "Sourav C";
            element.Status = "Y";
            if (type == 'PRO') {
                element.productId = type + "_" + this.uuidv4();
                element._id = element.productName.trim().replace(" ", "_");
            }
            else {
                element.inventoryId = type + "_" + this.uuidv4();
            }
        });

        return reqData;
    }

    //Remove a inventory product
    async DeleteInventoryTypeList(productNameobj: any, config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        try {
            if (productNameobj) {
                let initconfig: DBConfigEntity = DBConfig;
                initconfig.UserDBUrl = config.UserDBUrl;
                initconfig.UserDBName = config.UserDBName;
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(initconfig);
                let db: Db = await mClient.db(config.UserDBName);
                console.log(productNameobj.productId);

                if (productNameobj.inventorytype == 'PRO') {

                    await db.collection("inventoryType").updateOne(
                        { "productId": productNameobj.productId },
                        {
                            $set: {
                                "Status": 'N',
                                "updatedDate": new Date(),
                                "updatedBy": "Sourav C"
                            }
                        }
                    ).then(
                        res => {
                            //retVal = res;
                            console.log('res.result.nModified');
                            console.log(res.result.nModified);
                            //noofUpdate = noofUpdate + res.result.nModified;
                            retVal.Message = res.result.nModified + "product" + " updated";
                        }
                    );
                }
                else {
                    await db.collection("inventoryprodType").updateOne(
                        { "inventoryId": productNameobj.productId },
                        {
                            $set: {
                                "Status": 'N',
                                "updatedDate": new Date(),
                                "updatedBy": "Sourav C"
                            }
                        }
                    ).then(
                        res => {
                            //retVal = res;
                            console.log('res.result.nModified');
                            console.log(res.result.nModified);
                            //noofUpdate = noofUpdate + res.result.nModified;
                            retVal.Message = res.result.nModified + "product" + " updated";
                        }
                    );
                }

                // db.collection("inventoryType").updateOne(
                //     { "productId" : productNameobj.productId },
                //     { $set: { "Status": "N"} }
                //  ).then(
                //     res => {
                //         console.log(res);
                //         retVal = res;
                //     }
                // );;
                // db.collection("inventoryType").deleteMany(myquery, function(err, obj) {
                //     if (err) throw err;
                //     console.log("1 document deleted");
                // });
            }
        }
        catch (e) {
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    // Update bulk product 
    async UpdateInventoryTypeList(productobj: any[], config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let noofUpdate: any = 0;
        try {
            if (productobj) {
                let initconfig: DBConfigEntity = DBConfig;
                initconfig.UserDBUrl = config.UserDBUrl;
                initconfig.UserDBName = config.UserDBName;
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(initconfig);
                let db: Db = await mClient.db(config.UserDBName);
                console.log("productobj");
                console.log(productobj);

                for (let i = 0; i < productobj.length; i++) {
                    await db.collection("inventoryType").updateOne(
                        { "productId": productobj[i].productId },
                        {
                            $set: {
                                "companyName": productobj[i].companyName,
                                "basecutOff": productobj[i].basecutOff,
                                "updatedDate": new Date(),
                                "updatedBy": "Sourav C"
                            }
                        }
                    ).then(
                        res => {
                            //retVal = res;
                            console.log('res.result.nModified');
                            console.log(res.result.nModified);
                            noofUpdate = noofUpdate + res.result.nModified;
                            //retVal = res.result.nModified + "product"+ " updated";
                        }
                    );
                }

                // productobj.forEach(async item => 

                // );


                // db.collection("inventoryType").deleteMany(myquery, function(err, obj) {
                //     if (err) throw err;
                //     console.log("1 document deleted");
                // });
            }
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        retVal.Message = noofUpdate + "Updated";
        return retVal;
    }

    //List of Inventory Product Type

    async GetInventoryTypeList(listObj: any, config: DBConfiguaration) {
        let mClient: MongoClient;
        let retVal: MethodResponse = new MethodResponse();
        try {
            let initconfig: DBConfigEntity = DBConfig;
            initconfig.UserDBUrl = config.UserDBUrl;
            initconfig.UserDBName = config.UserDBName;
            //if(listObj){
            //let config:DBConfigEntity = DBConfig;
            mClient = await DBClient.GetMongoClient(initconfig);
            let db: Db = await mClient.db(config.UserDBName);
            //config.UserDBName = "MediStockDB";
            // db.collection("inventoryType").find().limit(listObj.itemNo).toArray().then(res=>{
            //     retVal = res;
            // });

            // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).toArray(function(err,docs) {
            //     console.log(docs);
            // });
            // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).toArray(function(err,docs) {
            //     console.log(docs);
            // });

            // await db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).skip(0*2).limit(2).toArray(function(err,docs) {
            //     console.log(docs);
            //     console.log("First two");
            //     retVal = docs; 
            // });

            await db.collection("inventoryType").find({}, { "sort": ['updatedDate', 'asc'] }).skip(0 * 2).limit(20).toArray().then(res => {
                retVal.Result = res;
            }).catch(err => {
                console.log(err);
            });

            await db.collection("inventoryType").find({}).count().then(res => {
                retVal.ResultCount = res;
            }).catch(err => {
                console.log(err);
            });

            // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).skip(1*2).limit(2).toArray(function(err,docs) {
            //     console.log(docs);
            //     console.log("Second two");
            // });

            // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).skip(2*2).limit(2).toArray(function(err,docs) {
            //     console.log(docs);
            //     console.log("Third two");
            // });

            // }
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }

        return retVal;
    }

    async InventoryTypeGet(listObj: any, config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        try {
            if (listObj) {
                let initconfig: DBConfigEntity = DBConfig;
                initconfig.UserDBUrl = config.UserDBUrl;
                initconfig.UserDBName = config.UserDBName;
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(initconfig);
                let db: Db = await mClient.db(config.UserDBName);
                //config.UserDBName = "MediStockDB";
                // db.collection("inventoryType").find().limit(listObj.itemNo).toArray().then(res=>{
                //     retVal = res;
                // });

                // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).toArray(function(err,docs) {
                //     console.log(docs);
                // });
                // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).toArray(function(err,docs) {
                //     console.log(docs);
                // });
                let regexp = new RegExp("^" + listObj.productName);
                db.collection("inventoryType").find({ productName: regexp }).toArray().then(arr => {
                    retVal.Result = arr;
                    console.log(arr);
                })
                    .catch(err => {
                        throw err;
                    });
            }
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    async SetInventoryprodTypeList(reqData: any[], config: DBConfigEntity) {
        let retVal: any;
        let mClient: MongoClient;
        try {
            if (reqData) {
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                //config.UserDBName = "MediStockDB";
                let db: Db = await mClient.db(config.UserDBName);
                console.log("reqData 1");
                console.log(reqData);
                reqData = this.InsertDataManupulation(reqData, 'INV');
                console.log("reqData");
                console.log(reqData);
                await db.collection("inventoryprodType").insertMany(reqData).then(
                    res => {
                        retVal = "1 inventory Product Successfully Inserted";
                    },
                    err => {
                        retVal = err.errmsg;
                        console.log('err.errmsg');
                        console.log(err.errmsg);
                    }
                );
            }
        }
        catch (e) {
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    async GetInventoryProdTypeList(listObj: any, config: DBConfigEntity) {
        let retdataVal: any;
        let Count: number;
        let mClient: MongoClient;

        let retVal = {
            "res": retdataVal,
            "Count": Count
        }

        try {
            //if(listObj){
            //let config:DBConfigEntity = DBConfig;
            mClient = await DBClient.GetMongoClient(config);
            let db: Db = await mClient.db(config.UserDBName);
            // await db.collection("inventoryprodType").find({}, {"sort" : ['updatedDate', 'asc']} ).skip(0*2).limit(20).toArray().then(res=>{
            //     retVal.res = res;
            // }).catch(err=>{
            //     console.log(err);
            // });
            // await db.collection("inventoryprodType").find({}).count().then(res=>{
            //     retVal.Count = res;
            // }).catch(err=>{
            //     console.log(err);
            // });

            await db.collection("inventoryprodType").find({ Status: "Y" }).toArray().then(res => {
                retVal.res = res;
                retVal.Count = res.length;
            }).catch(err => {
                console.log(err);
            });
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }

        return retVal;
    }



    async UpdateInventoryprodTypeList(productobj: any[], config: DBConfigEntity) {
        let retVal: any;
        let mClient: MongoClient;
        let noofUpdate: any = 0;
        try {
            if (productobj) {
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.UserDBName);
                console.log("productobj");
                console.log(productobj);

                for (let i = 0; i < productobj.length; i++) {
                    await db.collection("inventoryprodType").updateOne(
                        { "inventoryId": productobj[i].inventoryId },
                        {
                            $set: {
                                "count": productobj[i].count,
                                "discount": productobj[i].discount,
                                "mrp": productobj[i].mrp,
                                "salesprice": productobj[i].salesprice,
                                "updatedDate": new Date(),
                                "updatedBy": "Sourav C"
                            }
                        }
                    ).then(
                        res => {
                            //retVal = res;
                            console.log('res.result.nModified');
                            console.log(res.result.nModified);
                            noofUpdate = noofUpdate + res.result.nModified;
                            //retVal = res.result.nModified + "product"+ " updated";
                        }
                    );
                }

                // productobj.forEach(async item =>

                // );


                // db.collection("inventoryType").deleteMany(myquery, function(err, obj) {
                //     if (err) throw err;
                //     console.log("1 document deleted");
                // });
            }
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        retVal = noofUpdate + "Updated";
        return retVal;
    }
}

export let InventoryDBHandle = new InventoryDBHandler();