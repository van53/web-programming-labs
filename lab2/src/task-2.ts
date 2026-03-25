import { VARIANT } from "./config";

// Повторне оголошення типів для ізоляції файлу
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

// Масив задач із прив'язкою до VARIANT
const tasks: Task[] = [
  {
    id: 1 + VARIANT,
    title: "Розробити API",
    description: "Реалізувати REST API для управління задачами",
    status: "in_progress",
    priority: "high",
    assignee: "Іван Петренко",
    createdAt: new Date("2025-01-10"),
    dueDate: new Date("2025-02-01"),
  },
  {
    id: 2 + VARIANT,
    title: "Написати тести",
    description: "Покрити unit-тестами основну логіку",
    status: "todo",
    priority: "medium",
    assignee: null,
    createdAt: new Date("2025-01-12"),
    dueDate: new Date("2025-02-15"),
  },
  {
    id: 3 + VARIANT,
    title: "Налаштувати БД",
    description: "Підключити PostgreSQL, виконати міграції",
    status: "done",
    priority: "critical",
    assignee: "Олена Коваль",
    createdAt: new Date("2025-01-05"),
    dueDate: new Date("2025-01-20"),
  },
  {
    id: 4 + VARIANT,
    title: "Оновити документацію",
    description: "Описати API у Swagger",
    status: "todo",
    priority: "low",
    assignee: null,
    createdAt: new Date("2025-01-15"),
    dueDate: null,
  },
  {
    id: 5 + VARIANT,
    title: "Code review",
    description: "Перевірити pull request від команди",
    status: "cancelled",
    priority: "medium",
    assignee: "Андрій Лисенко",
    createdAt: new Date("2025-01-18"),
    dueDate: new Date("2025-01-25"),
  },
];

/** 2.1. Generic-інтерфейс та функції відповіді API */
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return { data, status: 200, message: "Success", timestamp: new Date() };
}

function createErrorResponse(message: string): ApiResponse<null> {
  return { data: null, status: 500, message, timestamp: new Date() };
}

/** 2.2. Utility Types: Створення та Оновлення */
// Виключаємо id та createdAt для нових задач
type CreateTaskDto = Omit<Task, "id" | "createdAt">;

// Робимо всі поля (крім id/createdAt) необов'язковими для оновлення
type UpdateTaskDto = Partial<CreateTaskDto>;

/** 2.3. Generic-фільтрація за ключем */
function filterTasks<K extends keyof Task>(tasks: Task[], key: K, value: Task[K]): Task[] {
  return tasks.filter((task) => task[key] === value);
}

// --- Демонстрація ---
console.log("=== Завдання 2: Generics та Utility Types ===");
console.log("Варіант:", VARIANT);

// Тест ApiResponse
const success = createSuccessResponse(tasks[0]);
console.log("2.1 Успішна відповідь:", success.message, success.data.title);

const error = createErrorResponse("База даних недоступна");
console.log("2.1 Помилка:", error.message, error.status);

// Тест DTO (типізація перевіряється під час розробки)
const newTask: CreateTaskDto = {
  title: "Нова задача",
  description: "Опис",
  status: "todo",
  priority: "low",
  assignee: null,
  dueDate: null,
};
console.log("2.2 Створено DTO для нової задачі:", newTask.title);

// Тест filterTasks
const highPriorityTasks = filterTasks(tasks, "priority", "high");
console.log("2.3 Задачі з високим пріоритетом:", highPriorityTasks.map(t => t.title));

const doneTasks = filterTasks(tasks, "status", "done");
console.log("2.3 Завершені задачі:", doneTasks.map(t => t.title));