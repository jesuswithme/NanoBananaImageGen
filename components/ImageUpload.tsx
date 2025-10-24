
import React, { useCallback, useState } from 'react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
  title: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, previewUrl, title }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative w-full aspect-square border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-colors ${
          isDragging ? 'border-purple-500 bg-gray-700' : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="object-cover w-full h-full rounded-lg" />
        ) : (
          <div className="text-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">이미지를 드래그하거나 클릭하여 업로드</p>
          </div>
        )}
        <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default ImageUpload;
