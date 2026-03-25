import { useNavigate } from "react-router-dom";
import type { Task, TaskPriority, TaskStatus } from "../../types/task";
// @ts-ignore
import styles from "./TaskCard.module.css";

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "🟢 Низький",
  medium: "🟡 Середній",
  high: "🔴 Високий",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "📌 Очікує",
  "in-progress": "⚙️ В роботі",
  done: "✅ Виконано",
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const navigate = useNavigate();

  return (
    <div className={`${styles.card} ${styles[task.priority]}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <span className={styles.badge}>{PRIORITY_LABELS[task.priority]}</span>
      </div>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      <div className={styles.footer}>
        <span>{STATUS_LABELS[task.status]}</span>
        <span>{task.createdAt.toLocaleDateString("uk-UA")}</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.detailBtn}
          onClick={() => navigate(`/tasks/${task.id}`)}
        >
          Деталі →
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(task.id)}
        >
          🗑️ Видалити
        </button>
      </div>
    </div>
  );
}