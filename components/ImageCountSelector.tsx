
import React from 'react';
import { IMAGE_COUNTS } from '../constants';

interface ImageCountSelectorProps {
  selected: number;
  onSelect: (count: number) => void;
}

const ImageCountSelector: React.FC<ImageCountSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-400 block mb-2">생성 개수</label>
      <div className="grid grid-cols-4 gap-2">
        {IMAGE_COUNTS.map(count => (
          <button
            key={count}
            onClick={() => onSelect(count)}
            className={`py-2 px-1 text-sm rounded-md transition-colors font-semibold ${
              selected === count
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCountSelector;
