// components/Modal.js
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '@/styles/modal.module.css';

const Modal = ({ title, children, onClose }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);  // Component is mounted on the client side
    }, []);

    if (!mounted) return null;  // Ensure it only renders on the client

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button onClick={onClose}>Close</button>
                </div>
                <div className={styles.modalContent}>{children}</div>
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;
