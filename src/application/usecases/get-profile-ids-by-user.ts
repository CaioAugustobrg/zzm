import { User } from '../../domain/entities/user';

export class GetProfilesIdsByUser {
  constructor() {}

  async handle(profilesId: string[]): Promise<User> {
    try {
      const userIds = new User(profilesId);
      return userIds;
    } catch (error) {
      console.error('Erro ao processar os IDs:', error);
      throw error;
    }
  }
}
