
import React from 'react';
import { ASPECT_RATIOS } from '../constants';

interface AspectRatioSelectorProps {
  selected: string;
  onSelect: (aspectRatio: string) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-400 block mb-2">종횡비</label>
      <div className="grid grid-cols-5 gap-2">
        {ASPECT_RATIOS.map(ratio => (
          <button
            key={ratio}
            onClick={() => onSelect(ratio)}
            className={`py-2 px-1 text-xs rounded-md transition-colors font-semibold ${
              selected === ratio
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
