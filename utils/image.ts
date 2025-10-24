
import type { ImageData } from '../types';

export const resizeImage = (file: File, maxSize: number): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const { width, height } = img;
        let newWidth = width;
        let newHeight = height;

        if (width > height) {
          if (width > maxSize) {
            newHeight = Math.round((height * maxSize) / width);
            newWidth = maxSize;
          }
        } else {
          if (height > maxSize) {
            newWidth = Math.round((width * maxSize) / height);
            newHeight = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context'));
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const dataUrl = canvas.toDataURL(file.type);
        const [, base64] = dataUrl.split(',');
        
        resolve({
          base64,
          mimeType: file.type,
          width: newWidth,
          height: newHeight,
        });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const cropImageData = (imageData: ImageData, aspectRatio: string): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
        const [aspectW, aspectH] = aspectRatio.split(':').map(Number);
        if (isNaN(aspectW) || isNaN(aspectH) || aspectH === 0) {
            return reject(new Error('Invalid aspect ratio'));
        }
        const targetRatio = aspectW / aspectH;
        
        const img = new Image();
        img.src = `data:${imageData.mimeType};base64,${imageData.base64}`;
        img.onload = () => {
            const sourceWidth = img.width;
            const sourceHeight = img.height;
            const sourceRatio = sourceWidth / sourceHeight;

            let sx = 0, sy = 0, sWidth = sourceWidth, sHeight = sourceHeight;

            if (sourceRatio > targetRatio) { // Image is wider than target, crop width
                sWidth = sourceHeight * targetRatio;
                sx = (sourceWidth - sWidth) / 2;
            } else if (sourceRatio < targetRatio) { // Image is taller than target, crop height
                sHeight = sourceWidth / targetRatio;
                sy = (sourceHeight - sHeight) / 2;
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = sWidth;
            canvas.height = sHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Could not get canvas context'));

            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

            const dataUrl = canvas.toDataURL(imageData.mimeType);
            const [, base64] = dataUrl.split(',');

            resolve({
                base64,
                mimeType: imageData.mimeType,
                width: sWidth,
                height: sHeight,
            });
        };
        img.onerror = (err) => reject(err);
    });
};
