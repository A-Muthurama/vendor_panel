import React from 'react';

const AuthFooter = () => {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '25px',
            fontSize: '12px',
            color: '#8B6F47',
            marginTop: 'auto',
            width: '100%',
            backgroundColor: 'transparent',
            borderTop: '1px solid rgba(0,0,0,0.05)'
        }}>
            <p style={{
                margin: 0,
                fontWeight: '600',
                letterSpacing: '1px',
                fontFamily: "'Playfair Display', serif",
                textTransform: 'uppercase'
            }}>
                © 2026 JEWELLERS PARADISE. ALL RIGHTS RESERVED.
            </p>
        </footer>
    );
};

export default AuthFooter;
