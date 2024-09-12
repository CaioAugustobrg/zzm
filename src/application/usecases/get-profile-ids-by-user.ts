import { User } from "../../domain/entities/user";
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export class GetProfilesIdsByUser {
  constructor() {}

  private askQuestion(query: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        resolve(answer);
      });
    });
  }

  async handle(): Promise<User> {
    try {
      // Pergunta ao usuário por IDs separados por espaço
      const idsInput = await this.askQuestion('Por favor, insira os IDs separados por espaço: ');

      // Divide os IDs por espaço e remove espaços em branco adicionais
      const ids = idsInput.split(/\s+/).map(id => id.trim()).filter(id => id.length > 0);

      // Cria uma instância de User com os IDs
      const userIds = new User(ids);
      console.log('User IDs:', userIds);

      return userIds;
    } catch (error) {
      console.error('Erro ao fazer a pergunta:', error);
      throw error;
    } finally {
      // Fecha a interface readline
      rl.close();
    }
  }
}
