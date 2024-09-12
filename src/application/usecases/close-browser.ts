import { Browser } from "../../domain/entities/browser";
import { Profile } from "../../domain/entities/profile";
import { OpenBrowserParameters } from "../../domain/types/browser";
import { ProfileParameters } from "../../domain/types/profile";
import ApiError from "../../utils/api-error";

export class CloseBrowserUseCase {
    constructor() {}

    async handle(user_id: string): Promise<string | ApiError> {
        let browser = new Browser(user_id);

        //if (!profile) {
         //   return new ApiError({
          //      code: 404,
           //     message: "Profile not found",
            //    log: true,
            //});
       // }


       const url = browser.toUrl("http://local.adspower.net:50555/api/v1/browser/stop");

       console.log('Generated URL CLOSE BROWSER:', url);

        return url;
    }
}
