// src/types/profile.ts

export interface ProfileParameters {
  group_id?: string; // Consulta pelo ID do grupo, pode ser uma string vazia para buscar todos os grupos
  user_id?: string;  // Consulta pelo ID do perfil
  serial_number?: string; // Consulta pelo número de série
  user_sort?: any
  page?: number; // Número da página, padrão 1
  page_size?: number; // Tamanho da página
}

  // Interface para `data` no caso de sucesso
  interface SuccessData {
    list: ProfileParameters[];
    page: number;
    page_size: number;
  }
  
  // Interface para a resposta da API
  export interface ApiResponse {
    code: number;
    data: SuccessData | {}; // Data pode ser `SuccessData` ou um objeto vazio no caso de falha
    msg: string;
  }
  