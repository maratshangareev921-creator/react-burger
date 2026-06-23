import type { MouseEvent, ReactElement } from 'react';

import styles from './modal-overlay.module.css';

type ModalOverlayProps = { onClick: () => void };

export const ModalOverlay = ({ onClick }: ModalOverlayProps): ReactElement => {
  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) onClick();
  };

  return <div className={styles.overlay} onClick={handleClick} />;
};
