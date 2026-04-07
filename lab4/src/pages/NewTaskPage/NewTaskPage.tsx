import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasksStore } from "../../store/useTasksStore";
import type { TaskPriority, Task } from "../../types/task";

export function NewTaskPage() {
  const navigate = useNavigate();
  const { addTask } = useTasksStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      status: "todo",
      priority,
      createdAt: new Date(),
    };

    addTask(newTask);
    navigate("/tasks");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "1rem" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>📝 Нова задача</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "white", padding: "1.5rem", borderRadius: "8px", border: "1px solid #ddd" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label>Назва *</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label>Опис</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label>Пріоритет</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button type="submit" style={{ flex: 1, padding: "0.7rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Створити</button>
          <button type="button" onClick={() => navigate("/tasks")} style={{ padding: "0.7rem", background: "#eee", border: "none", borderRadius: "6px", cursor: "pointer" }}>Скасувати</button>
        </div>
      </form>
    </div>
  );
}