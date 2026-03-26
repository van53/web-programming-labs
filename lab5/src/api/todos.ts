import axios from 'axios';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo';

const BASE_URL = 'http://localhost:3001/todos';

export const todosApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await axios.get<Todo[]>(BASE_URL);
    return response.data;
  },

  create: async (data: CreateTodoDto): Promise<Todo> => {
    const response = await axios.post<Todo>(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateTodoDto): Promise<Todo> => {
    const response = await axios.patch<Todo>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  }
};