
import React from 'react';
import { STYLE_PROMPTS } from '../constants';

interface StyleButtonsGridProps {
  onStyleClick: (stylePrompt: string) => void;
}

const StyleButtonsGrid: React.FC<StyleButtonsGridProps> = ({ onStyleClick }) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-400 block mb-2">스타일 추천</label>
      <div className="grid grid-cols-3 gap-2">
        {STYLE_PROMPTS.map(style => (
          <button
            key={style.name}
            onClick={() => onStyleClick(style.prompt)}
            className="bg-gray-700 text-gray-200 text-sm py-2 px-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            {style.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleButtonsGrid;
