import { CloseBrowserUseCase } from "../../application/usecases/close-browser";
import { OpenBrowserUseCase } from "../../application/usecases/open-browser";
import { BrowserController } from "../../presentation/controllers/browser-controller";
import { ProfileController } from "../../presentation/controllers/profile-controller";

const openProfileUseCase = new OpenBrowserUseCase()
const closeBrowserUseCase = new CloseBrowserUseCase()
const browserController = new BrowserController(openProfileUseCase, closeBrowserUseCase)

export { browserController }