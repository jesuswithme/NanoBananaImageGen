
import React from 'react';

interface CreativitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

const CreativitySlider: React.FC<CreativitySliderProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="creativity" className="text-sm font-medium text-gray-400 flex justify-between mb-1">
        <span>창의성</span>
        <span>{value}</span>
      </label>
      <input
        id="creativity"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
    </div>
  );
};

export default CreativitySlider;
