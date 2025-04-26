// frontend/app/components/ui/Button.tsx
import clsx from 'clsx'; // Optional: use clsx for cleaner class merging
import React, { useState, useEffect } from 'react';

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'edit' | 'select' | 'deselect';
  isSelectedState?: Boolean;
  parentTableName?: string;
  selectedTableName?: string;
  selectedID?: number;
  curID?: number;
};

export const Button = ({
  onClick,
  children,
  className = '',
  type = 'button',
  variant = 'default',
  isSelectedState,
  parentTableName,
  selectedTableName,
  selectedID,
  curID
}: ButtonProps) => {
  const baseStyle = 'px-4 py-2 rounded-md text-white transition-all disabled:bg-gray-300 disabled:cursor-not-allowed';

  const variantStyle = {
    default: 'bg-blue-600 hover:bg-blue-700',
    destructive: 'bg-red-700 hover:bg-red-600',
    edit: 'bg-indigo-600 hover:bg-indigo-700',
    select: 'bg-emerald-600 hover:bg-emerald-700',
    deselect: 'bg-gray-600 hover:bg-gray-700'
  };

  const [state, setState] = useState(false);

  useEffect(()=>{
    if (isSelectedState == false || isSelectedState == undefined) {
      setState(false);
    } else {
      if (parentTableName != selectedTableName) {
        setState(true);
      } else {
        if (selectedID != curID) {
          setState(true);
        } else {
          setState(false);
        }
      }
    }
  }, [isSelectedState, parentTableName, selectedTableName, selectedID, curID]);
  
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={state}
      className={clsx(baseStyle, variantStyle[variant], className)}
    >
      {children}
    </button>
  );
};
