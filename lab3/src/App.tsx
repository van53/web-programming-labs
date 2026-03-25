import TaskCard from "./components/TaskCard/TaskCard";
import type { Task } from "./types/task"; // Додано 'type'

const mockTask: Task = {
  id: "1",
  title: "Тестова задача",
  description: "Перевірка відображення картки з виправленими імпортами",
  status: "todo",
  priority: "high",
  createdAt: new Date(),
};

function App() {
  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <TaskCard
        task={mockTask}
        onDelete={(id) => console.log("Видалення ID:", id)}
        onStatusChange={(id, status) => console.log("Новий статус для", id, ":", status)}
      />
    </div>
  );
}

export default App;