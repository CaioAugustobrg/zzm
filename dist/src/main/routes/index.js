"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//router.post("/profile",
//  async (request: Request, response: Response) => {
//        console.log(request)
//        console.log('ROUTE', response)
//    console.log(request.body)
//  return await profileController.findProfile(request, response)
//  }//
//)
//router.get("/all-profiles",
// async (request: Request, response: Response) => {
//     return await profileController.findAllProfiles()
//   }
//)
//router.get("/open-browser", 
//    async (request: Request, response: Response) => {
//        console.log(request.body)
//        return await browserController.OpenBrowser(request, response)
//    }
//)
exports.default = router;
