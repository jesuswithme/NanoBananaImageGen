
import React, { useState, useCallback, useMemo } from 'react';
import type { ImageData } from './types';
import { GENERATION_OPTIONS } from './constants';
import { generateImage } from './services/geminiService';
import { resizeImage, cropImageData } from './utils/image';

import ImageUpload from './components/ImageUpload';
import LoadingSpinner from './components/LoadingSpinner';
import StyleButtonsGrid from './components/StyleButtonsGrid';
import GenerationOptionsGrid from './components/GenerationOptionsGrid';
import CreativitySlider from './components/CreativitySlider';
import AspectRatioSelector from './components/AspectRatioSelector';
import ImageCountSelector from './components/ImageCountSelector';
import SeedInput from './components/SeedInput';

const App: React.FC = () => {
    const [mainImage, setMainImage] = useState<ImageData | null>(null);
    const [referenceImage, setReferenceImage] = useState<ImageData | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [creativity, setCreativity] = useState<number>(50);
    const [aspectRatio, setAspectRatio] = useState<string>('9:16');
    const [imageCount, setImageCount] = useState<number>(1);
    const [generationOptions, setGenerationOptions] = useState<Record<string, boolean>>({
        multiPose: true,
    });
    const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 2147483647));


    const mainPreviewUrl = useMemo(() => mainImage ? `data:${mainImage.mimeType};base64,${mainImage.base64}` : null, [mainImage]);
    const referencePreviewUrl = useMemo(() => referenceImage ? `data:${referenceImage.mimeType};base64,${referenceImage.base64}` : null, [referenceImage]);
    
    const handleImageUpload = useCallback(async (file: File, type: 'main' | 'reference') => {
        try {
            setError(null);
            const resized = await resizeImage(file, 1024);
            if (type === 'main') {
                setMainImage(resized);
            } else {
                setReferenceImage(resized);
            }
            setGeneratedImages([]);
        } catch(e) {
            setError('이미지를 리사이징하는 데 실패했습니다.');
            console.error(e);
        }
    }, []);

    const handleStyleButtonClick = (stylePrompt: string) => {
        setPrompt(prev => `${prev} ${stylePrompt},`.trim().replace(/,$/, ''));
    };

    const handleGenerationOptionChange = (optionId: string, isChecked: boolean) => {
        const currentlySelected = Object.values(generationOptions).filter(v => v).length;
        if (currentlySelected >= 2 && isChecked) {
            return;
        }
        setGenerationOptions(prev => ({
            ...prev,
            [optionId]: isChecked
        }));
    };

    const handleGenerateClick = async () => {
        if (!mainImage) {
            setError('메인 이미지를 업로드해주세요.');
            return;
        }
        if (!prompt) {
             setError('프롬프트를 입력하거나 스타일을 선택해주세요.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            // 1. Crop the main image (and reference image if it exists) to the target aspect ratio.
            const croppedMainImage = await cropImageData(mainImage, aspectRatio);
            
            const imageApiData: ImageData[] = [croppedMainImage];
            if (referenceImage) {
                const croppedRefImage = await cropImageData(referenceImage, aspectRatio);
                imageApiData.push(croppedRefImage);
            }
            
            const selectedGenOptions = GENERATION_OPTIONS
                .filter(opt => generationOptions[opt.id])
                .map(opt => opt.label)
                .join(', ');

            const finalPrompt = `
                Perform the following request: "${prompt}".
                The main subject's face and identity, from the input image(s), must be preserved.
                Incorporate these transformations if applicable: ${selectedGenOptions}.
                Creativity level should be around ${creativity} out of 100.
                Use this number as a generation seed for consistency: ${seed}.
            `.trim().replace(/\s+/g, ' ');
            
            const resultBase64Array = await generateImage(
                imageApiData,
                finalPrompt,
                imageCount
            );

            if (resultBase64Array.length === 0) {
                throw new Error("이미지 생성에 실패했습니다.");
            }

            setGeneratedImages(resultBase64Array.map(b64 => `data:image/jpeg;base64,${b64}`));
        } catch (e) {
            setError((e as Error).message || '알 수 없는 오류가 발생했습니다.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const isGenerationDisabled = useMemo(() => {
        return !mainImage || !prompt || isLoading;
    }, [mainImage, prompt, isLoading]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-xl mx-auto"> 
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        NanoBanana 이미지 변환기(고급)
                    </h1>
                    <p className="mt-2 text-gray-400">이미지를 업로드하고, 원하는 스타일로 변환해보세요.</p>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="bg-gray-800 p-6 rounded-lg flex flex-col gap-6 lg:col-span-1">
                        <ImageUpload 
                            onImageUpload={(file) => handleImageUpload(file, 'main')} 
                            previewUrl={mainPreviewUrl} 
                            title="1. 메인 이미지 업로드" 
                        />
                        <ImageUpload 
                            onImageUpload={(file) => handleImageUpload(file, 'reference')} 
                            previewUrl={referencePreviewUrl} 
                            title="2. 참조 이미지 (선택)" 
                        />
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg flex flex-col gap-6 lg:col-span-1">
                        <h3 className="text-xl font-semibold text-gray-200">3. 편집 옵션 설정</h3>
                        
                        <div>
                            <label htmlFor="prompt" className="text-lg font-semibold mb-3 text-gray-300 block">프롬프트</label>
                            <textarea
                                id="prompt"
                                rows={3}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="예: 1번 이미지에 2번 이미지를 합성해줘"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            />
                        </div>
                        
                        <StyleButtonsGrid onStyleClick={handleStyleButtonClick} />
                        
                        <GenerationOptionsGrid 
                            options={generationOptions}
                            onChange={handleGenerationOptionChange}
                        />

                        <hr className="border-gray-700" />
                        
                        <CreativitySlider value={creativity} onChange={setCreativity} />

                        <SeedInput value={seed} onChange={setSeed} />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <AspectRatioSelector selected={aspectRatio} onSelect={setAspectRatio} />
                            <ImageCountSelector selected={imageCount} onSelect={setImageCount} />
                        </div>
                        
                        <hr className="border-gray-700" />

                        <button
                            onClick={handleGenerateClick}
                            disabled={isGenerationDisabled}
                            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-lg"
                        >
                            {isLoading ? '생성 중...' : '✨ 이미지 생성하기'}
                        </button>

                        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg flex flex-col min-h-[520px] lg:col-span-1">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4">생성된 이미지</h3>
                        
                        <div className="relative flex-grow w-full border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center">
                            {isLoading && <LoadingSpinner />}
                            
                            {!isLoading && generatedImages.length > 0 && (
                                <div className="absolute inset-0 w-full h-full overflow-y-auto p-4 space-y-4">
                                    {generatedImages.map((imgSrc, index) => (
                                        <div key={index} className="relative group">
                                            <img src={imgSrc} alt={`Generated image ${index + 1}`} className="object-contain w-full rounded-lg" />
                                            <a
                                                href={imgSrc}
                                                download={`nanobanana-image-${index + 1}.jpg`}
                                                className="absolute bottom-2 right-2 bg-green-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm opacity-0 group-hover:opacity-100"
                                            >
                                                다운로드
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isLoading && generatedImages.length === 0 && (
                                <div className="text-center text-gray-500">
                                    <p>생성된 이미지가 여기에 표시됩니다.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default App;
