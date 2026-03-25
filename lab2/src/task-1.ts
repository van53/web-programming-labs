export {}; // Робимо файл ізольованим модулем

// 1.1. Аліас для статусів
type Status = "todo" | "in_progress" | "done" | "cancelled";

// 1.2. Аліас для пріоритетів
type Priority = "low" | "medium" | "high" | "critical";

// 1.3. Інтерфейс задачі
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

// 1.4. Розширення інтерфейсів
interface HasId {
  id: number;
}

interface Project extends HasId {
  name: string;
  description: string;
  tasks: Task[];
  ownerId: number;
}

// 1.5. Функція розрахунку статистики
function getTaskStats(tasks: Task[]) {
  const now = new Date();

  // Рахуємо кількість задач за статусами
  const byStatus: Record<Status, number> = {
    todo: 0,
    in_progress: 0,
    done: 0,
    cancelled: 0
  };

  let overdue = 0;

  tasks.forEach(task => {
    byStatus[task.status]++;

    // Перевіряємо, чи протермінована задача
    if (task.dueDate && task.dueDate < now && task.status !== "done" && task.status !== "cancelled") {
      overdue++;
    }
  });

  return {
    total: tasks.length,
    byStatus,
    overdue
  };
}

// 1.6. Форматування задачі для виводу
function formatTask(task: Task): string {
  return `[#${task.id}] ${task.title} (${task.priority}, ${task.status})`;
}

// --- Демонстрація ---
console.log("=== Завдання 1: Базові типи, інтерфейси та type aliases ===");

const myTasks: Task[] = [
  { id: 1, title: "Налаштувати сервер", description: "Deploy", status: "done", priority: "critical", assignee: "Ivan", createdAt: new Date(), dueDate: null },
  { id: 2, title: "Написати тести", description: "QA", status: "in_progress", priority: "high", assignee: "Oleg", createdAt: new Date(), dueDate: new Date('2024-01-01') },
  { id: 3, title: "Верстка", description: "CSS", status: "todo", priority: "medium", assignee: null, createdAt: new Date(), dueDate: new Date('2023-12-01') },
  { id: 4, title: "Дизайн", description: "Figma", status: "cancelled", priority: "low", assignee: "Anna", createdAt: new Date(), dueDate: new Date('2024-05-01') },
  { id: 5, title: "Документація", description: "Docs", status: "todo", priority: "low", assignee: null, createdAt: new Date(), dueDate: new Date('2026-10-01') },
];

console.log("Список задач:");
myTasks.forEach(t => console.log(formatTask(t)));

console.log("\nСтатистика проєкту:");
console.log(getTaskStats(myTasks));