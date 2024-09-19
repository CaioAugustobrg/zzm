import readline from 'readline';
import { User } from '../../domain/entities/user';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export class GetProfilesIdsByUser {
  constructor() {}

  private askQuestion(query: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(query, (answer: string | PromiseLike<string>) => {
        resolve(answer);
      });
    });
  }

  async handle(): Promise<User> {
    try {
      const idsInput = await this.askQuestion('Please enter the IDs separated by spaces: ');
      const ids = idsInput.trim().split(/\s+/).filter(id => id.length > 0);
      const userIds = new User(ids);
      return userIds;
    } catch (error) {
      console.error('Erro ao fazer a pergunta:', error);
      throw error;
    }
  }

  close() {
    rl.close();
  }
}