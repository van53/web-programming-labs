import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import { TasksPage } from "./pages/TasksPage/TasksPage";
import { TaskDetailPage } from "./pages/TaskDetailPage/TaskDetailPage";
import { NewTaskPage } from "./pages/NewTaskPage/NewTaskPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Редирект з головної на список задач */}
          <Route index element={<Navigate to="/tasks" replace />} />
          
          {/* Основні маршрути */}
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/new" element={<NewTaskPage />} />
          <Route path="tasks/:id" element={<TaskDetailPage />} />
          
          {/* Обробка 404 (опціонально) */}
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}