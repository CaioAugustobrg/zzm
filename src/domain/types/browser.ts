export interface OpenBrowserParameters {
    user_id: string;
    serial_number?: string;
    open_tabs?: number;
    ip_tab?: number;
    new_first_tab?: number;
    launch_args?: string[];
    headless?: false;
    disable_password_filling?: number;
    clear_cache_after_closing?: number;
    enable_password_saving?: number;
    cdp_mask?: number;
}



export interface CloseBrowserParameters {
    user_id: string;
    serial_number?: string;
}

