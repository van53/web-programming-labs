import { create } from 'zustand';
import { Task } from '../types/task';
import { INITIAL_TASKS } from '../data/initialTasks';

interface TasksState {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  // Початковий стан із твоїми задачами з Lab 2 / Етапу 2
  tasks: INITIAL_TASKS,

  // Додавання нової задачі
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  // Видалення за ID
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  // Оновлення полів задачі (наприклад, зміна статусу)
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
}));