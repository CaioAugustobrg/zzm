"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileController = void 0;
const find_profile_1 = require("../../application/usecases/find-profile");
const profile_controller_1 = require("../../presentation/controllers/profile-controller");
const findProfile = new find_profile_1.FindProfileUseCase();
const profileController = new profile_controller_1.ProfileController();
exports.profileController = profileController;
