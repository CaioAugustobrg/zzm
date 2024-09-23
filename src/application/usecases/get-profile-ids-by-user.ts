import { User } from '../../domain/entities/user';

export class GetProfilesIdsByUser {
  constructor() {}

  // Método que recebe os IDs diretamente como argumento
  async handle(profilesId: string[]): Promise<User> {
    try {
      // Cria o objeto User a partir da lista de IDs
      const userIds = new User(profilesId);
      return userIds;
    } catch (error) {
      console.error('Erro ao processar os IDs:', error);
      throw error;
    }
  }
}
