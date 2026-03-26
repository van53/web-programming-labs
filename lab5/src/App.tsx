import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todosApi } from "./api/todos";

export default function App() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  // Отримання списку (Read)
  const { data: todos, isLoading, isError, error } = useQuery({
    queryKey: ["todos"],
    queryFn: todosApi.getAll,
  });

  // Мутація для створення (Create)
  const createMutation = useMutation({
    mutationFn: (newTitle: string) => 
      todosApi.create({ title: newTitle, completed: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
    },
  });

  // 6.1. Мутація для оновлення статусу (Update)
  const updateMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      todosApi.update(id, { completed }),
    onSuccess: () => {
      // Інвалідуємо кеш, щоб отримати актуальні дані з сервера
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // 6.2. Мутація для видалення (Delete)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => todosApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      createMutation.mutate(title);
    }
  };

  if (isLoading) return <p style={{ textAlign: "center", padding: "2rem" }}>⏳ Завантаження...</p>;
  if (isError) return <p style={{ color: "red", textAlign: "center" }}>❌ Помилка: {error.message}</p>;

  return (
    <div style={{ maxWidth: "550px", margin: "0 auto", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", textAlign: "center" }}>📋 Todo List (Lab 5)</h1>

      {/* Форма створення */}
      <form onSubmit={handleAddTodo} style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Що потрібно зробити?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: "0.7rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
        />
        <button
          type="submit"
          disabled={createMutation.isPending || !title.trim()}
          style={{
            padding: "0.7rem 1.2rem",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: createMutation.isPending ? "not-allowed" : "pointer"
          }}
        >
          {createMutation.isPending ? "..." : "Додати"}
        </button>
      </form>

      {/* Список задач */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {todos?.map((todo) => (
          <div
            key={todo.id}
            style={{
              padding: "0.75rem 1rem",
              background: todo.completed ? "#f8fafc" : "white",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
              {/* 6.1. Чекбокс для оновлення */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => 
                  updateMutation.mutate({ id: todo.id, completed: e.target.checked })
                }
                style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
              />
              <span style={{ 
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#94a3b8" : "#1e293b",
                fontSize: "1rem"
              }}>
                {todo.title}
              </span>
            </div>

            {/* 6.2. Кнопка видалення */}
            <button
              onClick={() => deleteMutation.mutate(todo.id)}
              disabled={deleteMutation.isPending}
              style={{
                background: "none",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "6px",
                fontSize: "1.1rem"
              }}
              title="Видалити"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}