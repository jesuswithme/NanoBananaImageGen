
import React from 'react';
import { GENERATION_OPTIONS } from '../constants';

interface GenerationOptionsGridProps {
  options: Record<string, boolean>;
  onChange: (optionId: string, isChecked: boolean) => void;
}

const GenerationOptionsGrid: React.FC<GenerationOptionsGridProps> = ({ options, onChange }) => {
  const selectedCount = Object.values(options).filter(Boolean).length;

  return (
    <div>
      <label className="text-sm font-medium text-gray-400 block mb-2">고급 옵션 (최대 2개)</label>
      <div className="grid grid-cols-2 gap-3">
        {GENERATION_OPTIONS.map(opt => {
          const isChecked = !!options[opt.id];
          const isDisabled = !isChecked && selectedCount >= 2;
          return (
            <label
              key={opt.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                isChecked ? 'bg-purple-800 border-purple-600' : 'bg-gray-700 border-gray-600'
              } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-600'} border`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onChange(opt.id, e.target.checked)}
                disabled={isDisabled}
                className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-purple-600 focus:ring-purple-500 cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="ml-3 text-sm font-medium text-gray-200">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default GenerationOptionsGrid;
