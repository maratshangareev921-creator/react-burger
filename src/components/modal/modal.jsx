import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

const modalRoot = document.getElementById('react-modals');

export const Modal = ({ title, children, onClose }) => {
  React.useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscClose);
    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClick={onClose} />
      <div className={styles.modal}>
        <div className={`${styles.header} mt-10 ml-10 mr-10`}>
          <h3 className="text text_type_main-large">{title}</h3>
          <button className={styles.close_button} onClick={onClose}>
            <CloseIcon type="primary" />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </>,
    modalRoot
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};
