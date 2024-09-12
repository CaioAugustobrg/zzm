// src/domain/entities/Profile.ts

import { ProfileParameters } from "../types/profile";

export class Profile {
  public group_id?: string;
  public serial_number?: string;
  public user_id?: string;
  public page?: number;
  public page_size?: number;
  // public user_sort?: { [key: string]: 'asc' | 'desc' };

  constructor(props: ProfileParameters) {
    this.group_id = props.group_id;
    this.serial_number = props.serial_number;
    this.user_id = props.user_id;
    this.page = props.page ?? 1; 
    this.page_size = props.page_size;
    // this.user_sort = props.user_sort;
  }

  public toUrl(baseUrl: string): string {
    const queryParams = new URLSearchParams();

    if (this.group_id) queryParams.append('group_id', this.group_id);
    if (this.serial_number) queryParams.append('serial_number', this.serial_number);
    if (this.user_id) queryParams.append('user_id', this.user_id);
    if (this.page) queryParams.append('page', this.page.toString());
    if (this.page_size) queryParams.append('page_size', this.page_size.toString());
    //if (this.user_sort) {
    //  for (const [key, value] of Object.entries(this.user_sort)) {
    //    queryParams.append(`user_sort[${key}]`, value);
    //  }
    // }

    return `${baseUrl}?${queryParams.toString()}`;
  }
}
