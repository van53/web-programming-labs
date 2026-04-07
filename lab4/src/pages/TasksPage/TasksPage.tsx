import TaskCard from "../../components/TaskCard/TaskCard";
import { useTasksStore } from "../../store/useTasksStore";

export function TasksPage() {
  const { tasks, deleteTask } = useTasksStore();

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>📋 Задачі ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <p>Задач поки немає. Створіть першу!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={deleteTask} />
          ))}
        </div>
      )}
    </div>
  );
}