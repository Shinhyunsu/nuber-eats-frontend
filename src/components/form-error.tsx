import React from 'react';

interface IFormErroroProps {
    errorMessage: string;
}

export const FormError: React.FC<IFormErroroProps> = ({ errorMessage }) => (
    <span className="font-medium text-red-500">{errorMessage}</span>
);