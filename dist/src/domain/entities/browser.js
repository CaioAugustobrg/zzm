"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Browser = void 0;
class Browser {
    constructor(user_id) {
        this.user_id = user_id;
    }
    toUrl(baseUrl) {
        const queryParams = new URLSearchParams();
        queryParams.append('user_id', this.user_id);
        //if (this.params.serial_number) queryParams.append('serial_number', this.params.serial_number);
        //if (this.params.open_tabs) queryParams.append('open_tabs', this.params.open_tabs.toString());
        //if (this.params.ip_tab) queryParams.append('ip_tab', this.params.ip_tab.toString());
        //if (this.params.new_first_tab) queryParams.append('new_first_tab', this.params.new_first_tab.toString());
        //if (this.params.launch_args) queryParams.append('launch_args', JSON.//stringify(this.params.launch_args));
        //if (this.params.headless) queryParams.append('headless', this.params.headless.toString());
        //if (this.params.disable_password_filling) queryParams.append('disable_password_filling', this.params.disable_password_filling.toString());
        //if (this.params.clear_cache_after_closing) queryParams.append('clear_cache_after_closing', this.params.clear_cache_after_closing.toString());
        //if (this.params.enable_password_saving) queryParams.append('enable_password_saving', this.params.enable_password_saving.toString());
        //if (this.params.cdp_mask) queryParams.append('cdp_mask', this.params.cdp_mask.toString());
        return `${baseUrl}?${queryParams.toString()}`;
    }
}
exports.Browser = Browser;
