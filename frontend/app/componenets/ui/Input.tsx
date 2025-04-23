import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  id: string;
  placeholderValue: string;
  className: string
}

const Input: React.FC<InputProps> = ({ label, value, onChange, id, placeholderValue, className }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholderValue}
        className={`mt-1 p-2 border border-gray-300 rounded-md w-full`}
      />
    </div>
  );
};

export { Input };
