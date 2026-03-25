import type { Task, TaskStatus } from "../../types/task"; // Додано 'type'
import styles from "./TaskCard.module.css";
import { clsx } from "clsx";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const TaskCard = ({ task, onDelete, onStatusChange }: TaskCardProps) => {
  // Форматування дати: дд.мм.рррр
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("uk-UA");
  };

  return (
    <div
      className={clsx(styles.card, {
        [styles.cardLow]: task.priority === "low",
        [styles.cardMedium]: task.priority === "medium",
        [styles.cardHigh]: task.priority === "high",
      })}
    >
      <h3 className={styles.title}>{task.title}</h3>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      <div className={styles.meta}>
        <span>
          Пріоритет: <strong>{task.priority}</strong>
        </span>
        <span>Створено: {formatDate(task.createdAt)}</span>
      </div>

      <div className={styles.actions}>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
        >
          <option value="todo">Треба зробити</option>
          <option value="in-progress">У процесі</option>
          <option value="done">Готово</option>
        </select>

        <button onClick={() => onDelete(task.id)} className={styles.deleteBtn}>
          Видалити
        </button>
      </div>
    </div>
  );
};

export default TaskCard;