import type { Task, TaskStatus } from "../../types/task";
import TaskCard from "../TaskCard/TaskCard";
import styles from "./TaskList.module.css";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const TaskList = ({ tasks, onDelete, onStatusChange }: TaskListProps) => {
  // Перевірка на порожній список
  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Задач немає. Додайте першу задачу!</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id} // Унікальний ключ для React
          task={task}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default TaskList;