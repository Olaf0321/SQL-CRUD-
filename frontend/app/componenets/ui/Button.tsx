// frontend/app/components/ui/Button.tsx
import React from 'react';

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

export const Button = ({
  onClick,
  children,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all ${className}`}
    >
      {children}
    </button>
  );
};
