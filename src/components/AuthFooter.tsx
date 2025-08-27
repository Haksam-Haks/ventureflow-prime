import React from 'react';

const AuthFooter: React.FC = () => {
    return (
        <div className="mt-8 text-center text-sm text-gray-600">
            <p className="mb-2">
                By signing in or creating an account, you agree with our{' '}
                <a href="#" className="text-primary hover:text-primary/80">
                    Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:text-primary/80">
                    Privacy Statement
                </a>
            </p>
            <p className="text-gray-500">
                All rights reserved.
                <br />
                Copyright (2006-2025) – Egret Hospitality™
            </p>
        </div>
    );
};

export default AuthFooter; 