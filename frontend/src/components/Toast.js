import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'error', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000); // Auto close after 4 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast-container ${type}`}>
            <div className="toast-content">
                <span className="toast-message">{message}</span>
                <button className="toast-close" onClick={onClose}>×</button>
            </div>
            <div className="toast-progress"></div>
        </div>
    );
};

export default Toast;
