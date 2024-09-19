import { Profile } from "../../domain/entities/profile";
import { ProfileParameters } from "../../domain/types/profile";
import ApiError from "../../utils/api-error";

export class FindProfileUseCase {
    constructor() {}

    async handle(profileParameters: ProfileParameters): Promise<string | ApiError> {
        let profile = new Profile(profileParameters);

        // Verifica se o perfil existe
        //if (!profile) {
         //   return new ApiError({
          //      code: 404,
           //     message: "Profile not found",
            //    log: true,
            //});
       // }


       const url = profile.toUrl("http://local.adspower.net:50555/api/v1/user/list");
        return url;
    }
}
