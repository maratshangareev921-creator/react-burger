import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import {
  forgotPasswordRequest,
  login,
  register,
  resetPasswordRequest,
} from '../services/actions/userActions.js';

import styles from './pages.module.css';

const AuthMessage = ({ children }) => (
  <p className={`${styles.message} text text_type_main-default text_color_inactive`}>
    {children}
  </p>
);

const ErrorText = ({ error }) =>
  error ? <p className="text text_type_main-default text_color_error">{error}</p> : null;

const getErrorMessage = (err) => (err instanceof Error ? err.message : String(err));

export const LoginPage = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    dispatch(login(form))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsSending(false));
  };

  return (
    <main className={styles.formPage}>
      <h1 className="text text_type_main-medium mb-6">Вход</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <EmailInput name="email" value={form.email} onChange={handleChange} />
        <PasswordInput name="password" value={form.password} onChange={handleChange} />
        <ErrorText error={error} />
        <Button htmlType="submit" type="primary" size="medium" disabled={isSending}>
          Войти
        </Button>
      </form>
      <div className={styles.links}>
        <AuthMessage>
          Вы новый пользователь? <Link to="/register">Зарегистрироваться</Link>
        </AuthMessage>
        <AuthMessage>
          Забыли пароль? <Link to="/forgot-password">Восстановить пароль</Link>
        </AuthMessage>
      </div>
    </main>
  );
};

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    dispatch(register(form))
      .unwrap()
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsSending(false));
  };

  return (
    <main className={styles.formPage}>
      <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input name="name" placeholder="Имя" value={form.name} onChange={handleChange} />
        <EmailInput name="email" value={form.email} onChange={handleChange} />
        <PasswordInput name="password" value={form.password} onChange={handleChange} />
        <ErrorText error={error} />
        <Button htmlType="submit" type="primary" size="medium" disabled={isSending}>
          Зарегистрироваться
        </Button>
      </form>
      <div className={styles.links}>
        <AuthMessage>
          Уже зарегистрированы? <Link to="/login">Войти</Link>
        </AuthMessage>
      </div>
    </main>
  );
};

export const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    dispatch(forgotPasswordRequest(email))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPasswordAllowed', 'true');
        navigate('/reset-password');
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsSending(false));
  };

  return (
    <main className={styles.formPage}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <EmailInput
          name="email"
          placeholder="Укажите e-mail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
        />
        <ErrorText error={error} />
        <Button htmlType="submit" type="primary" size="medium" disabled={isSending}>
          Восстановить
        </Button>
      </form>
      <div className={styles.links}>
        <AuthMessage>
          Вспомнили пароль? <Link to="/login">Войти</Link>
        </AuthMessage>
      </div>
    </main>
  );
};

export const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ password: '', token: '' });
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  if (localStorage.getItem('resetPasswordAllowed') !== 'true') {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    dispatch(resetPasswordRequest(form))
      .unwrap()
      .then(() => {
        localStorage.removeItem('resetPasswordAllowed');
        navigate('/login', { replace: true });
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsSending(false));
  };

  return (
    <main className={styles.formPage}>
      <h1 className="text text_type_main-medium mb-6">Сброс пароля</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <PasswordInput
          name="password"
          placeholder="Введите новый пароль"
          value={form.password}
          onChange={handleChange}
        />
        <Input
          name="token"
          placeholder="Введите код из письма"
          value={form.token}
          onChange={handleChange}
        />
        <ErrorText error={error} />
        <Button htmlType="submit" type="primary" size="medium" disabled={isSending}>
          Сохранить
        </Button>
      </form>
    </main>
  );
};
