"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindProfileUseCase = void 0;
const profile_1 = require("../../domain/entities/profile");
class FindProfileUseCase {
    constructor() { }
    async handle(profileParameters) {
        let profile = new profile_1.Profile(profileParameters);
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
exports.FindProfileUseCase = FindProfileUseCase;
