"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("../../presentation/controllers/profile-controller");
const get_profile_ids_by_user_1 = require("../../application/usecases/get-profile-ids-by-user");
const router = express_1.default.Router();
const profileController = new profile_controller_1.ProfileController();
const getProfilesIdsByUser = new get_profile_ids_by_user_1.GetProfilesIdsByUser();
router.post('/get-profiles', async (request, response) => {
    try {
        const idsInput = request.body.profilesId;
        const socialMedia = request.body.socialMedia;
        console.log(idsInput, socialMedia);
        const userIds = await getProfilesIdsByUser.handle(idsInput);
        let notWorkingProfiles = await profileController.findAllProfiles(userIds.userIds, socialMedia);
        console.log('notWorkingProfiles', notWorkingProfiles);
        response.status(200).json({ message: 'Profiles processed successfully', notWorkingProfiles });
    }
    catch (error) {
        console.error('Error calling findAllProfiles:', error.message);
        response.status(500).json({ error: 'Failed to process profiles' });
    }
});
exports.default = router;
