import { useState } from "react";
import type { Task, TaskStatus } from "./types/task";
import type { TaskFormData } from "./components/TaskForm/TaskForm";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskList from "./components/TaskList/TaskList";
import styles from "./App.module.css";

// 6.1. Початкові дані (Вкажи свій номер варіанту замість 1)
const VARIANT = 1; 

const INITIAL_TASKS: Task[] = [
  {
    id: `task-${VARIANT}-1`,
    title: `Задача А-${VARIANT}: налаштування середовища`,
    description: "Встановити Node.js, VS Code та необхідні розширення",
    status: "done",
    priority: "high",
    createdAt: new Date(2025, 0, (VARIANT % 28) + 1),
  },
  {
    id: `task-${VARIANT}-2`,
    title: `Задача Б-${VARIANT}: вивчення документації`,
    description: "Ознайомитись з офіційною документацією React",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date(2025, 1, (VARIANT % 28) + 1),
  },
  {
    id: `task-${VARIANT}-3`,
    title: `Задача В-${VARIANT}: написати компонент`,
    description: "",
    status: "todo",
    priority: "low",
    createdAt: new Date(2025, 2, (VARIANT % 28) + 1),
  },
];

function App() {
  // 6.2. Стан застосунку
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  // Додавання нової задачі з виправленням типу priority
  const handleAddTask = (data: TaskFormData) => {
    const newTask: Task = {
      title: data.title,
      description: data.description,
      priority: data.priority as Task["priority"], // Явне приведення типу
      id: crypto.randomUUID(),
      status: "todo",
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  // Видалення задачі
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Оновлення статусу
  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  // Фільтрація
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Task Manager</h1>
        <p className={styles.stats}>
          Всього: {tasks.length} | Нові:{" "}
          {tasks.filter((t) => t.status === "todo").length} | В роботі:{" "}
          {tasks.filter((t) => t.status === "in-progress").length} | Виконані:{" "}
          {tasks.filter((t) => t.status === "done").length}
        </p>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <TaskForm onSubmit={handleAddTask} />
        </aside>

        <section className={styles.content}>
          <div className={styles.filters}>
            <label htmlFor="filter">Фільтр: </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as TaskStatus | "all")}
            >
              <option value="all">Усі</option>
              <option value="todo">Нові</option>
              <option value="in-progress">В роботі</option>
              <option value="done">Виконані</option>
            </select>
          </div>

          <TaskList
            tasks={filteredTasks}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        </section>
      </main>
    </div>
  );
}

export default App;