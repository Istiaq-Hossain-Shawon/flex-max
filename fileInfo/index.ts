import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import FileInfoService from "../service/fileInfo.service";
import * as db from "../lib/flex-max-cosmosdb-mongodb";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        let response = null;
        let fileInfoService:FileInfoService = FileInfoService.getServiceInstance();
    
        // create 1 db connection for all functions
        await db.init();
    
        switch (req.method) {
          case "GET":
            if (req?.query.id || (req?.body && req?.body?.id)) {
              console.log("testing.....")
              response = {
               // documentResponse: await db.findItemById(req?.body?.id),
              };
            } else {
              // allows empty query to return all items
              const dbQuery =
                req?.query?.dbQuery || (req?.body && req?.body?.dbQuery);
              response = {
                documentResponse: await fileInfoService.getList(),
              };
            }
            break;
          case "POST":
            if (req?.body?.document) {
             // const insertOneResponse = await db.addItem(req?.body?.document);
              response = {
                documentResponse: fileInfoService.create(req?.body?.document),
              };
            } else {
              throw Error("No document found");
            }
    
            break;
          case "DELETE":
            if (req?.query?.id || (req?.body && req?.body?.id)) {
              response = {
              //  documentResponse: await db.deleteItemById(req?.body?.id),
              };
            } else {
              throw Error("No id found");
            }
    
            break;
          default:
            throw Error(`${req.method} not allowed`)
        }
    
        context.res = {
          body: response,
        };
      } catch (err) {
        context.log(`*** Error throw: ${JSON.stringify(err)}`);
    
        context.res = {
          status: 500,
          body: err,
        };
      }
    
    

};

export default httpTrigger;