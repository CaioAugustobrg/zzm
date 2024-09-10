import { Profile } from "../../domain/entities/profile";
import { ProfileRepository } from "../../domain/interfaces/repositories/profile-repository";
import { ApiResponse, ProfileParameters } from "../../domain/types/profile";
import ApiError from "../../utils/api-error";

export class FindProfileUseCase {
    constructor(private readonly profileRepository: ProfileRepository) {}
    async handle(profileParameters: ProfileParameters): Promise<ApiResponse | ApiError> {
        let profile = new Profile(profileParameters)
        const findProfile = await this.profileRepository.findProfile(profile)
        if (!findProfile) {
            throw new ApiError({
                code: 404,
                    message: "Profile not found",
                    log: true, 
              });
        }
        
        return {
            code: 0,
            data: {
                list: [findProfile],
                page: 1, 
                page_size: 1
            },
            msg: "Success"
        };
    }
}