import { FindProfileUseCase } from "../../application/usecases/find-profile";
import { ProfileController } from "../../presentation/controllers/profile-controller";

const findProfile = new FindProfileUseCase()
const profileController = new ProfileController(findProfile)

export { profileController }