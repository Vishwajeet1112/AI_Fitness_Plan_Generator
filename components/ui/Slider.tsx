
import React from 'react';

interface SliderProps {
  label: string;
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  onChange: (name: string, value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ label, name, min, max, step, value, unit, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, parseInt(e.target.value, 10));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {value} {unit}
        </span>
      </div>
      <input
        id={name}
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};
