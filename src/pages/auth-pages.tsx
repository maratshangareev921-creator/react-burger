import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import {
  forgotPasswordRequest,
  login,
  register,
  resetPasswordRequest,
} from '../services/actions/userActions';
import { useAppDispatch } from '../services/hooks';

import type { LoginForm, RegisterForm, ResetPasswordForm } from '../types';

import styles from './pages.module.css';

type AuthMessageProps = { children: ReactNode };
type ErrorTextProps = { error: string };

const AuthMessage = ({ children }: AuthMessageProps): ReactElement => (
  <p className={`${styles.message} text text_type_main-default text_color_inactive`}>
    {children}
  </p>
);

const ErrorText = ({ error }: ErrorTextProps): ReactElement | null =>
  error ? <p className="text text_type_main-default text_color_error">{error}</p> : null;

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const handlePointerCapture = (): void => undefined;

const getPreviousPath = (state: unknown): string => {
  if (typeof state !== 'object' || state === null || !('from' in state)) return '/';
  const from: unknown = state.from;
  if (typeof from !== 'object' || from === null || !('pathname' in from)) return '/';
  return typeof from.pathname === 'string' ? from.pathname : '/';
};

export const LoginPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    if (name === 'email') setForm((current) => ({ ...current, email: value }));
    if (name === 'password') setForm((current) => ({ ...current, password: value }));
    setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsSending(true);
    void dispatch(login(form))
      .unwrap()
      .then(() => navigate(getPreviousPath(location.state), { replace: true }))
      .catch((reason: unknown) => setError(getErrorMessage(reason)))
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

export const RegisterPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<RegisterForm>({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    if (name === 'name') setForm((current) => ({ ...current, name: value }));
    if (name === 'email') setForm((current) => ({ ...current, email: value }));
    if (name === 'password') setForm((current) => ({ ...current, password: value }));
    setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsSending(true);
    void dispatch(register(form))
      .unwrap()
      .catch((reason: unknown) => setError(getErrorMessage(reason)))
      .finally(() => setIsSending(false));
  };

  return (
    <main className={styles.formPage}>
      <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          name="name"
          placeholder="Имя"
          value={form.name}
          onChange={handleChange}
          onPointerEnterCapture={handlePointerCapture}
          onPointerLeaveCapture={handlePointerCapture}
        />
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

export const ForgotPasswordPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsSending(true);
    void dispatch(forgotPasswordRequest(email))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPasswordAllowed', 'true');
        navigate('/reset-password');
      })
      .catch((reason: unknown) => setError(getErrorMessage(reason)))
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
          onChange={(event) => {
            setEmail(event.currentTarget.value);
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

export const ResetPasswordPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<ResetPasswordForm>({ password: '', token: '' });
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  if (localStorage.getItem('resetPasswordAllowed') !== 'true') {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    if (name === 'password') setForm((current) => ({ ...current, password: value }));
    if (name === 'token') setForm((current) => ({ ...current, token: value }));
    setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsSending(true);
    void dispatch(resetPasswordRequest(form))
      .unwrap()
      .then(() => {
        localStorage.removeItem('resetPasswordAllowed');
        navigate('/login', { replace: true });
      })
      .catch((reason: unknown) => setError(getErrorMessage(reason)))
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
          onPointerEnterCapture={handlePointerCapture}
          onPointerLeaveCapture={handlePointerCapture}
        />
        <ErrorText error={error} />
        <Button htmlType="submit" type="primary" size="medium" disabled={isSending}>
          Сохранить
        </Button>
      </form>
    </main>
  );
};
