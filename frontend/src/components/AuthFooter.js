import React from 'react';

const AuthFooter = () => {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '20px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: 'auto',
            width: '100%',
            backgroundColor: 'var(--bg-body)',
            borderTop: '1px solid var(--border-color)',
            fontFamily: 'Arial, sans-serif'
        }}>
            <p style={{
                margin: 0,
                fontWeight: '600',
                letterSpacing: '1.5px',
                fontFamily: 'Arial, sans-serif',
                textTransform: 'uppercase',
                color: 'var(--primary-plum)'
            }}>
                © 2026 JEWELLERS PARADISE. ALL RIGHTS RESERVED.
            </p>
        </footer>
    );
};

export default AuthFooter;
