export class User {
    ids(ids: any) {
      throw new Error("Method not implemented.");
    }
    public userIds: string[]; 
    constructor(userIds: string[]) {
      this.userIds = userIds;
    }
}
