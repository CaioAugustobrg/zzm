// src/types/profile.ts

export interface ProfileParameters {
  group_id?: string; 
  user_id?: string; 
  serial_number?: string;
  // user_sort?: { [key: string]: 'asc' | 'desc' };

  page?: number; 
  page_size?: number;
}

  interface SuccessData {
    list: ProfileParameters[];
    page: number;
    page_size: number;
  }
  
  export interface ApiResponse {
    code: number;
    data: SuccessData | {}; 
    msg: string;
  }
  