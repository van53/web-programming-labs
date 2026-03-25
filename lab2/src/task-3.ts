export {};

type Status = "todo" | "in_progress" | "done" | "cancelled";
type Priority = "low" | "medium" | "high" | "critical";

interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string | null;
  createdAt: Date;
  dueDate: Date | null;
}

/** 3.1. Базовий клас TaskManager */
class TaskManager {
  #tasks: Task[];
  #nextId: number = 1;

  constructor(initialTasks: Task[] = []) {
    this.#tasks = [...initialTasks];
    // Встановлюємо наступний ID вище за існуючі
    if (initialTasks.length > 0) {
      this.#nextId = Math.max(...initialTasks.map(t => t.id)) + 1;
    }
  }

  addTask(dto: Omit<Task, "id" | "createdAt">): Task {
    const newTask: Task = {
      ...dto,
      id: this.#nextId++,
      createdAt: new Date()
    };
    this.#tasks.push(newTask);
    return newTask;
  }

  updateTask(id: number, updates: Partial<Omit<Task, "id" | "createdAt">>): Task | null {
    const index = this.#tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.#tasks[index] = { ...this.#tasks[index], ...updates };
    return this.#tasks[index];
  }

  deleteTask(id: number): boolean {
    const initialLength = this.#tasks.length;
    this.#tasks = this.#tasks.filter(t => t.id !== id);
    return this.#tasks.length < initialLength;
  }

  get tasks(): Task[] { return [...this.#tasks]; }
  get count(): number { return this.#tasks.length; }
  getById(id: number): Task | undefined { return this.#tasks.find(t => t.id === id); }
}

/** 3.2. Розширений клас FilteredTaskManager */
class FilteredTaskManager extends TaskManager {
  getByStatus(status: Status): Task[] {
    return this.tasks.filter(t => t.status === status);
  }

  getByPriority(priority: Priority): Task[] {
    return this.tasks.filter(t => t.priority === priority);
  }

  getByAssignee(assignee: string): Task[] {
    return this.tasks.filter(t => t.assignee === assignee);
  }

  getOverdue(): Task[] {
    const now = new Date();
    return this.tasks.filter(t => 
      t.dueDate && t.dueDate < now && t.status !== "done" && t.status !== "cancelled"
    );
  }
}

// --- Демонстрація ---
console.log("=== Завдання 3: Класи та модифікатори доступу ===");

const manager = new FilteredTaskManager();

// Додавання задач
manager.addTask({ title: "Розробити API", description: "REST", status: "in_progress", priority: "high", assignee: "Іван", dueDate: new Date("2025-02-01") });
manager.addTask({ title: "Тести", description: "Unit", status: "todo", priority: "medium", assignee: "Олег", dueDate: new Date("2024-01-01") });
manager.addTask({ title: "Документація", description: "Swagger", status: "done", priority: "low", assignee: "Анна", dueDate: null });
manager.addTask({ title: "Фікс багів", description: "Bugfix", status: "todo", priority: "critical", assignee: "Іван", dueDate: new Date("2024-05-01") });

console.log("Всього задач:", manager.count);

// Оновлення та видалення
manager.updateTask(1, { status: "done" });
console.log("Задача #1 оновлена (status: done)");

manager.deleteTask(3);
console.log("Задача #3 видалена. Залишилось:", manager.count);

// Фільтрація
console.log("Задачі Івана:", manager.getByAssignee("Іван").map(t => t.title));
console.log("Протерміновані задачі:", manager.getOverdue().map(t => t.title));
console.log("Критичні задачі:", manager.getByPriority("critical").map(t => t.title));