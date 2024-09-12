"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_factory_1 = require("../factory/profile-factory");
const router = express_1.default.Router();
router.post("/profile", async (request, response) => {
    //        console.log(request)
    //        console.log('ROUTE', response)
    console.log(request.body);
    return await profile_factory_1.profileController.findProfile(request, response);
});
router.get("/all-profiles", async (request, response) => {
    return await profile_factory_1.profileController.findAllProfiles(request, response);
});
//router.get("/open-browser", 
//    async (request: Request, response: Response) => {
//        console.log(request.body)
//        return await browserController.OpenBrowser(request, response)
//    }
//)
exports.default = router;
