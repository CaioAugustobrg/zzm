import express, { request, response, type Request, type Response } from 'express'
import { profileController } from '../factory/profile-factory'
import { browserController } from '../factory/browser-factory'

const router = express.Router()

router.post("/profile",
    async (request: Request, response: Response) => {
        //        console.log(request)
        //        console.log('ROUTE', response)
        console.log(request.body)
        return await profileController.findProfile(request, response)

    }
)

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
export default router;