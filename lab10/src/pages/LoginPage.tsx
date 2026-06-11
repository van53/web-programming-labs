import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AxiosError } from 'axios';

const schema = z.object({
  email: z.string().email('Некоректний формат email'),
  password: z.string().min(6, 'Пароль має містити щонайменше 6 символів'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: ({ email, password }: FormData) => login(email, password),
    onSuccess: () => navigate('/profile'),
    onError: (error: AxiosError<{ message: string }>) => {
      const status = error.response?.status;
      if (status === 401) {
        setServerError('Невірний email або пароль');
      } else if (status === 400) {
        setServerError('Невалідні дані. Перевірте введені поля');
      } else {
        setServerError('Сталася помилка. Спробуйте ще раз');
      }
    },
  });

  const onSubmit = (data: FormData) => {
    setServerError('');
    mutation.mutate(data);
  };

  return (
    <div className="page-center">
      <div className="card">
        <h1 className="card-title">Вхід</h1>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              {...register('password')}
            />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Завантаження...' : 'Увійти'}
          </button>
        </form>

        <p className="card-footer">
          Немає акаунта? <Link to="/register">Зареєструватися</Link>
        </p>
      </div>
    </div>
  );
}
