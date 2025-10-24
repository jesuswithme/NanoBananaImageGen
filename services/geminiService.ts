
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const formatImagePart = (image: ImageData) => ({
  inlineData: {
    data: image.base64,
    mimeType: image.mimeType,
  },
});

export const generateImage = async (
  images: ImageData[],
  prompt: string,
  imageCount: number
): Promise<string[]> => {
  if (!images || images.length === 0) {
    throw new Error("Input image is required.");
  }

  const model = 'gemini-2.5-flash-image';
  
  const imageParts = images.map(formatImagePart);
  const textPart = { text: prompt };

  const contents = {
    parts: [...imageParts, textPart],
  };

  const generateSingleImage = async (): Promise<string> => {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image data found in the API response.");
  };

  const generationPromises = Array(imageCount).fill(0).map(() => generateSingleImage());
  
  try {
    const results = await Promise.all(generationPromises);
    return results;
  } catch (error) {
    console.error("Error generating images:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate images: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};
