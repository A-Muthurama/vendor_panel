import React from 'react';
import './PremiumModal.css';
import { CheckCircle, AlertCircle, Info, X, Loader2 } from 'lucide-react';

const PremiumModal = ({ isOpen, onClose, title, message, type = 'success', onConfirm, confirmText = 'OK', cancelText = 'Cancel', isConfirm = false }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle className="modal-icon success" size={48} />;
            case 'error': return <AlertCircle className="modal-icon error" size={48} />;
            case 'warning': return <Info className="modal-icon warning" size={48} />;
            case 'loading': return <Loader2 className="modal-icon loading animate-spin" size={48} />;
            default: return <Info className="modal-icon info" size={48} />;
        }
    };

    return (
        <div className="premium-modal-overlay">
            <div className="premium-modal-container animate-pop">
                {type !== 'loading' && (
                    <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                )}

                <div className="modal-body">
                    <div className="icon-wrapper">
                        {getIcon()}
                    </div>

                    <h2 className="modal-title">{title}</h2>
                    <p className="modal-message">{message}</p>
                </div>

                {type !== 'loading' && (
                    <div className="modal-footer">
                        {isConfirm && (
                            <button className="modal-btn btn-cancel" onClick={onClose}>
                                {cancelText}
                            </button>
                        )}
                        <button className="modal-btn btn-confirm" onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}>
                            {confirmText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PremiumModal;
