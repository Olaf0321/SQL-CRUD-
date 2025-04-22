// frontend/app/components/ui/Button.tsx
import React from 'react';
import clsx from 'clsx'; // Optional: use clsx for cleaner class merging

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'default' | 'destructive';
};

export const Button = ({
  onClick,
  children,
  className = '',
  type = 'button',
  disabled = false,
  variant = 'default',
}: ButtonProps) => {
  const baseStyle = 'px-4 py-2 rounded-md text-white transition-all disabled:bg-gray-300 disabled:cursor-not-allowed';

  const variantStyle = {
    default: 'bg-blue-600 hover:bg-blue-700',
    destructive: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(baseStyle, variantStyle[variant], className)}
    >
      {children}
    </button>
  );
};
