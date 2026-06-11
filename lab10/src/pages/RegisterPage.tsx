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

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: ({ email, password }: FormData) => registerUser(email, password),
    onSuccess: () => {
      setSuccessMsg('Акаунт успішно створено! Перенаправлення на сторінку входу...');
      setTimeout(() => navigate('/login'), 1500);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const status = error.response?.status;
      if (status === 409) {
        setServerError('Користувач з таким email вже існує');
      } else if (status === 400) {
        setServerError('Невалідні дані. Перевірте введені поля');
      } else {
        setServerError('Сталася помилка. Спробуйте ще раз');
      }
    },
  });

  const onSubmit = (data: FormData) => {
    setServerError('');
    setSuccessMsg('');
    mutation.mutate(data);
  };

  return (
    <div className="page-center">
      <div className="card">
        <h1 className="card-title">Реєстрація</h1>

        {serverError && <div className="alert alert-error">{serverError}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

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
            {mutation.isPending ? 'Завантаження...' : 'Зареєструватися'}
          </button>
        </form>

        <p className="card-footer">
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </p>
      </div>
    </div>
  );
}
