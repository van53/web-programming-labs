import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./TaskForm.module.css";

// 5.1. Схема валідації
const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Заголовок має містити щонайменше 3 символи")
    .max(100, "Заголовок не може перевищувати 100 символів"),
  description: z.string().max(500, "Опис не може перевищувати 500 символів"),
  priority: z.string().min(1, "Оберіть пріоритет"), // Спрощений варіант для уникнення помилок Overload
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
}

// 5.2. Компонент форми
const TaskForm = ({ onSubmit }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "",
    },
  });

  const handleFormSubmit = (data: TaskFormData) => {
    // Явно вказуємо тип, щоб відповідати нашому домену
    onSubmit(data as TaskFormData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="title">Назва задачі</label>
        <input 
          id="title" 
          {...register("title")} 
          placeholder="Введіть назву..." 
        />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="description">Опис (необов'язково)</label>
        <textarea 
          id="description" 
          {...register("description")} 
          placeholder="Додайте опис задачі" 
        />
        {errors.description && <span className={styles.error}>{errors.description.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="priority">Пріоритет</label>
        <select id="priority" {...register("priority")}>
          <option value="">Оберіть пріоритет</option>
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
        {errors.priority && <span className={styles.error}>{errors.priority.message}</span>}
      </div>

      <button type="submit" className={styles.submit}>
        Додати задачу
      </button>
    </form>
  );
};

export default TaskForm;