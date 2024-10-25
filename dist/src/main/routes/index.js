"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_factory_1 = require("../factory/profile-factory");
const get_profile_ids_by_user_1 = require("../../application/usecases/get-profile-ids-by-user");
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
// Use a ProfileFactory para instanciar o ProfileController
const profileController = profile_factory_1.ProfileFactory.createProfileController();
const getProfilesIdsByUser = new get_profile_ids_by_user_1.GetProfilesIdsByUser();
router.post('/get-profiles', async (request, response) => {
    try {
        const { profilesId, socialMedia } = request.body;
        console.log(profilesId);
        const userIds = await getProfilesIdsByUser.handle(profilesId);
        let notWorkingProfiles = await profileController.findAllProfiles(userIds.userIds, socialMedia);
        console.log('notWorkingProfiles', notWorkingProfiles);
        response.status(200).json({ message: 'Profiles processed successfully', notWorkingProfiles });
    }
    catch (error) {
        console.error('Error calling findAllProfiles:', error.message);
        response.status(500).json({ error: 'Failed to process profiles' });
    }
});
router.get('/hv', async (request, response) => {
    const token = '0d958240ece26f2cca4d84e77769c8a0b79f4d00';
    try {
        const apiClient = axios_1.default.create({
            baseURL: 'https://core.hivelocity.net/api/v2/device/?rack_id=0',
            headers: {
                'X-API-KEY': token,
                'Content-Type': 'application/json',
            },
        });
        const apiResponse = await apiClient.get('/devices', {
            params: { rack_id: 0 },
        });
        response.json(apiResponse.data);
    }
    catch (error) {
        console.error('Error fetching device resource:', error);
        response.status(500).json({ message: 'Erro ao buscar o recurso de dispositivo.' });
    }
});
exports.default = router;
