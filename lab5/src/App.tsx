import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todosApi } from "./api/todos";

export default function App() {
  // 5.1. Стан для керованого інпуту
  const [title, setTitle] = useState("");
  
  // Доступ до клієнта запитів для інвалідації
  const queryClient = useQueryClient();

  // 4.1. Отримання даних (вже було)
  const { data: todos, isLoading, isError, error } = useQuery({
    queryKey: ["todos"],
    queryFn: todosApi.getAll,
  });

  // 5.2. Налаштування мутації для створення
  const mutation = useMutation({
    mutationFn: (newTitle: string) => 
      todosApi.create({ title: newTitle, completed: false }),
    onSuccess: () => {
      // 5.2. Інвалідуємо кеш ["todos"], щоб список оновився автоматично
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      // Очищуємо поле введення
      setTitle("");
    },
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      mutation.mutate(title);
    }
  };

  if (isLoading) return <p style={{ textAlign: "center", padding: "2rem" }}>⏳ Завантаження...</p>;
  if (isError) return <p style={{ color: "red", textAlign: "center" }}>❌ Помилка: {error.message}</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>📋 Todo List (Lab 5)</h1>

      {/* 5.1. Форма створення */}
      <form onSubmit={handleAddTodo} style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Що потрібно зробити?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          // 5.3. Блокування кнопки під час виконання запиту
          disabled={mutation.isPending || !title.trim()}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: mutation.isPending ? "not-allowed" : "pointer",
            opacity: mutation.isPending ? 0.7 : 1
          }}
        >
          {mutation.isPending ? "Додавання..." : "Додати"}
        </button>
      </form>

      {/* Список задач */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {todos?.map((todo) => (
          <div
            key={todo.id}
            style={{
              padding: "1rem",
              background: todo.completed ? "#f8fafc" : "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              textDecoration: todo.completed ? "line-through" : "none",
              color: todo.completed ? "#94a3b8" : "#1e293b",
            }}
          >
            <span style={{ marginRight: "0.75rem" }}>{todo.completed ? "✅" : "⬜"}</span>
            {todo.title}
          </div>
        ))}
      </div>
    </div>
  );
}