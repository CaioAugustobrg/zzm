import ApiError from "../../../utils/api-error";
import { ApiResponse, ProfileParameters } from "../../types/profile";

export interface ProfileRepository {
    findProfile: (props: ProfileParameters) => Promise<ApiResponse | ApiError>
    // create
    // delete
    // findBy
}