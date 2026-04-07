import { Link, useNavigate, useParams } from "react-router-dom";
import { useTasksStore } from "../../store/useTasksStore";
import type { TaskStatus } from "../../types/task";

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask } = useTasksStore();

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>❌ Задачу не знайдено.</p>
        <Link to="/tasks" style={{ color: "#3b82f6" }}>← Назад до списку</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <Link to="/tasks" style={{ display: "block", marginBottom: "1rem", color: "#64748b", textDecoration: "none" }}>← Назад</Link>
      <div style={{ background: "white", padding: "2rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
        <h2 style={{ marginBottom: "1rem" }}>{task.title}</h2>
        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>{task.description}</p>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "bold" }}>Статус: </label>
          <select 
            value={task.status} 
            onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
            style={{ padding: "0.3rem", marginLeft: "0.5rem" }}
          >
            <option value="todo">Очікує</option>
            <option value="in-progress">В роботі</option>
            <option value="done">Виконано</option>
          </select>
        </div>
        <button 
          onClick={() => { deleteTask(task.id); navigate("/tasks"); }}
          style={{ padding: "0.6rem 1.2rem", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          🗑️ Видалити задачу
        </button>
      </div>
    </div>
  );
}