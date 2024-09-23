import express, { Request, Response } from 'express';
import { ProfileController } from '../../presentation/controllers/profile-controller';
import { GetProfilesIdsByUser } from '../../application/usecases/get-profile-ids-by-user';

const router = express.Router();


const profileController = new ProfileController();
const getProfilesIdsByUser = new GetProfilesIdsByUser();


router.post('/get-profiles', async (request: Request, response: Response) => {
    try {

        const idsInput = request.body.profilesId; 
        const socialMedia = request.body.socialMedia
        console.log(idsInput, socialMedia)

        const userIds = await getProfilesIdsByUser.handle(idsInput);
        

        let notWorkingProfiles = await profileController.findAllProfiles(userIds.userIds, socialMedia);
            console.log('notWorkingProfiles',notWorkingProfiles)
        response.status(200).json({ message: 'Profiles processed successfully',  notWorkingProfiles});
    } catch (error: any) {
        console.error('Error calling findAllProfiles:', error.message);
        response.status(500).json({ error: 'Failed to process profiles' });
    }
});

export default router;