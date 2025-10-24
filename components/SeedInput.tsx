
import React from 'react';

interface SeedInputProps {
  value: number;
  onChange: (value: number) => void;
}

const SeedInput: React.FC<SeedInputProps> = ({ value, onChange }) => {
  const randomizeSeed = () => {
    onChange(Math.floor(Math.random() * 2147483647));
  };

  return (
    <div>
      <label htmlFor="seed" className="text-sm font-medium text-gray-400 block mb-1">시드</label>
      <div className="flex items-center gap-2">
        <input
          id="seed"
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition"
        />
        <button
          onClick={randomizeSeed}
          title="Randomize seed"
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SeedInput;
