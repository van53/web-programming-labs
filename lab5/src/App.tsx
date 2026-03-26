import { useQuery } from "@tanstack/react-query";
import { todosApi } from "./api/todos";

export default function App() {
  // Викликаємо useQuery для отримання списку задач
  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: todosApi.getAll,
  });

  // 4.2. Обробка стану завантаження
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
        <p>⏳ Завантаження списку задач...</p>
      </div>
    );
  }

  // 4.2. Обробка стану помилки
  if (isError) {
    return (
      <div style={{ padding: "2rem", color: "#ef4444", textAlign: "center" }}>
        <h3>❌ Не вдалося завантажити дані</h3>
        <p>{error instanceof Error ? error.message : "Сталася невідома помилка"}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        📋 Мої задачі (Lab 5)
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {todos?.map((todo) => (
          <div
            key={todo.id}
            style={{
              padding: "1rem",
              background: todo.completed ? "#f1f5f9" : "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              // 4.3. Стилізація закреслення для виконаних задач
              textDecoration: todo.completed ? "line-through" : "none",
              color: todo.completed ? "#94a3b8" : "#1e293b",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ marginRight: "0.75rem" }}>
              {todo.completed ? "✅" : "⬜"}
            </span>
            <span style={{ fontSize: "1rem", fontWeight: 500 }}>
              {todo.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}