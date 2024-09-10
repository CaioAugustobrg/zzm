// src/domain/entities/Profile.ts

import { ProfileParameters } from "../types/profile";

export class Profile {
  public group_id?: string;
  public serial_number?: string;
  public user_id?: string;
  public page?: number;
  public page_size?: number;
  public user_sort?: { [key: string]: 'asc' | 'desc' };

  constructor(props: ProfileParameters) {
    this.group_id = props.group_id;
    this.serial_number = props.serial_number;
    this.user_id = props.user_id;
    this.page = props.page ?? 1; // Define um valor padrão para `page`
    this.page_size = props.page_size;
    this.user_sort = props.user_sort;
  }
}
