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

/** 5.1. Discriminated Union для станів завантаження */
type LoadingState = { status: "loading" };
type SuccessState<T> = { status: "success"; data: T; loadedAt: Date };
type ErrorState = { status: "error"; message: string; code: number };

type FetchState<T> = LoadingState | SuccessState<T> | ErrorState;

/** 5.2. Type Guard функції */
function isLoadingState(state: FetchState<unknown>): state is LoadingState {
  return state.status === "loading";
}

function isSuccessState<T>(state: FetchState<T>): state is SuccessState<T> {
  return state.status === "success";
}

function isErrorState(state: FetchState<unknown>): state is ErrorState {
  return state.status === "error";
}

/** 5.3. Рендеринг стану */
function renderState<T>(state: FetchState<T>, renderData: (data: T) => string): string {
  if (isLoadingState(state)) {
    return "⏳ Завантаження...";
  }
  if (isSuccessState(state)) {
    const time = state.loadedAt.toLocaleTimeString();
    return `✅ Завантажено о ${time}: ${renderData(state.data)}`;
  }
  if (isErrorState(state)) {
    return `❌ Помилка ${state.code}: ${state.message}`;
  }
  return "Невідомий стан";
}

/** 5.4. Обробка різних типів значень */
function processValue(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return "(порожнє значення)";
  }

  if (typeof value === "string") {
    return `Рядок: '${value}' (${value.length} символів)`;
  }

  if (typeof value === "number") {
    const isEven = value % 2 === 0 ? "парне" : "непарне";
    return `Число: ${value} (${isEven})`;
  }

  if (typeof value === "boolean") {
    return `Булеве: ${value ? "так" : "ні"}`;
  }

  return "Непідтримуваний тип";
}

/** 5.5. Exhaustive check (перевірка на вичерпність) */
function getStatusLabel(status: Status): string {
  switch (status) {
    case "todo": return "До виконання";
    case "in_progress": return "У роботі";
    case "done": return "Завершено";
    case "cancelled": return "Скасовано";
    default:
      // Якщо ми додамо новий статус у тип Status, але не додамо його в switch,
      // TypeScript видасть помилку на цьому рядку.
      const _exhaustiveCheck: never = status;
      return _exhaustiveCheck;
  }
}

// --- Демонстрація ---
console.log("=== Завдання 5: Type Guards та звуження типів ===");

// Тест станів завантаження
const states: FetchState<Task[]>[] = [
  { status: "loading" },
  { status: "success", data: [], loadedAt: new Date() },
  { status: "error", message: "Not found", code: 404 },
];

console.log("Результати рендерингу станів:");
states.forEach((state) => {
  console.log(renderState(state, (tasks) => `${tasks.length} задач`));
});

// Демонстрація processValue
console.log("\nРезультати обробки значень:");
const values: (string | number | boolean | null | undefined)[] = [
  "TypeScript",
  42,
  true,
  null,
  undefined,
  0,
  "",
];
values.forEach((v) => console.log(processValue(v)));

// Тест статусів
console.log("\nМітки статусів:");
const testStatuses: Status[] = ["todo", "in_progress", "done", "cancelled"];
testStatuses.forEach(s => console.log(`${s} -> ${getStatusLabel(s)}`));