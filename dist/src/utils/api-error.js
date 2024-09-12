"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
class ApiError extends Error {
    /**
     * @param error.code
     * @param error.error
     * @param error.message
     * @param error.log
     * @param error.logStack
     */
    constructor(error) {
        var _a, _b, _c, _d, _e, _f;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        super((_a = error.error) !== null && _a !== void 0 ? _a : error.message);
        this.code = (_b = error.code) !== null && _b !== void 0 ? _b : 500;
        this.message = (_d = (_c = error.error) !== null && _c !== void 0 ? _c : error.message) !== null && _d !== void 0 ? _d : undefined;
        this.logStack = (_e = error.logStack) !== null && _e !== void 0 ? _e : false;
        this.log = (_f = error.log) !== null && _f !== void 0 ? _f : false;
        if (this.log) {
            logger_1.default.error(`Error Code: ${this.code}, Message: ${this.message}`);
            if (this.logStack) {
                logger_1.default.error(`Stack Trace: ${this.stack}`);
            }
        }
    }
    toString() {
        var _a;
        return ((_a = this.logStack) !== null && _a !== void 0 ? _a : process.env.NODE_ENV === 'development') ? this.stack : super.toString();
    }
}
exports.default = ApiError;
