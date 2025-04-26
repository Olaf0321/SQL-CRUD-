// components/Notification.tsx
'use client';

import { useEffect, useState } from 'react';

type Props = {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number; // in milliseconds
};

export default function Notification({
  message,
  visible,
  onClose,
  duration = 3000,
}: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;
    let closeTimeout: NodeJS.Timeout;

    if (visible) {
      setShow(true);
      hideTimeout = setTimeout(() => setShow(false), duration - 300); // Start fade out early
      closeTimeout = setTimeout(() => onClose(), duration); // Remove completely
    }

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(closeTimeout);
    };
  }, [visible, duration, onClose]);

  if (!visible && !show) return null;

  return (
    <div
      className={`
    fixed top-6 right-6 z-50
    px-6 py-3 rounded-lg shadow-lg flex items-center gap-3
    bg-green-600 text-white
    transform transition-all duration-300 ease-in-out
    ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
  `}
    >
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm">{message}</span>
    </div>
  );
}
