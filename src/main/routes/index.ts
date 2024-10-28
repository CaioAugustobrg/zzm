import express, { Request, Response } from 'express';
import { ProfileFactory } from '../factory/profile-factory';
import { GetProfilesIdsByUser } from '../../application/usecases/get-profile-ids-by-user';
import axios from 'axios';

const router = express.Router();

// Use a ProfileFactory para instanciar o ProfileController
const profileController = ProfileFactory.createProfileController();
const getProfilesIdsByUser = new GetProfilesIdsByUser();

router.post('/cupidbot-verification', async (request: Request, response: Response) => {
    try {
        const { accountsId, socialMedia } = request.body;
        console.log(accountsId);
        const userIds = await getProfilesIdsByUser.handle(accountsId);
        let notWorkingProfiles = await profileController.findAllProfiles(userIds.userIds, socialMedia);
        console.log('notWorkingProfiles', notWorkingProfiles);

        response.status(200).json({ message: 'Profiles processed successfully', notWorkingProfiles });
    } catch (error: any) {
        console.error('Error calling findAllProfiles:', error.message);
        response.status(500).json({ error: 'Failed to process profiles' });
    }
});

router.get('/hv', async (request: Request, response: Response) => {
    const token = '0d958240ece26f2cca4d84e77769c8a0b79f4d00';
  
    try {
        const apiClient = axios.create({
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
  
    } catch (error) {
        console.error('Error fetching device resource:', error);
        response.status(500).json({ message: 'Erro ao buscar o recurso de dispositivo.' });
    }
});

export default router;
