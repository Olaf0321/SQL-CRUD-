// components/SwitchToggle.tsx
'use client';

type SwitchToggleProps = {
  isOn: boolean;
  toggle: () => void;
};

export default function SwitchToggle({ isOn, toggle }: SwitchToggleProps) {
  return (
    <div className="flex items-center space-x-4">
      <div
        onClick={toggle}
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
          isOn ? 'bg-green-500' : 'bg-gray-400'
        }`}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
            isOn ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
      <span className="text-lg font-medium w-10 mr-3">{isOn ? '絞り込み' : '全体'}</span>
    </div>
  );
}

