import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import {
  useEffect,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

type ModalProps = { title?: string; children: ReactNode; onClose: () => void };

const modalRoot = document.getElementById('react-modals');
if (!modalRoot) throw new Error('Контейнер #react-modals не найден');

export const Modal = ({ title = '', children, onClose }: ModalProps): ReactElement => {
  useEffect(() => {
    const handleEscClose = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscClose);
    return (): void => document.removeEventListener('keydown', handleEscClose);
  }, [onClose]);

  const stopPropagation = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    event.stopPropagation();
  };

  return createPortal(
    <>
      <ModalOverlay onClick={onClose} />
      <div className={styles.modal} onKeyDown={stopPropagation}>
        <div className={`${styles.header} mt-10 ml-10 mr-10`}>
          <h3 className="text text_type_main-large">{title}</h3>
          <button
            className={styles.close_button}
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon type="primary" />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </>,
    modalRoot
  );
};
