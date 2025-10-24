
import type { GenerationOption } from './types';

export const STYLE_PROMPTS: { name: string; prompt: string }[] = [
    { name: '시네마틱', prompt: 'cinematic lighting, epic, dramatic' },
    { name: '애니메이션', prompt: 'anime style, vibrant, detailed' },
    { name: '네온', prompt: 'neon punk, glowing lights, dark background' },
    { name: '3D 렌더', prompt: '3D render, octane render, high detail' },
    { name: '수채화', prompt: 'watercolor painting, soft, blended' },
    { name: '스케치', prompt: 'pencil sketch, black and white, hand-drawn' },
];

export const GENERATION_OPTIONS: GenerationOption[] = [
    {
        id: 'multiPose',
        label: '다양한 포즈',
        description: '다양한 포즈와 각도로 이미지를 생성합니다.'
    },
    {
        id: 'highDetail',
        label: '디테일 향상',
        description: '이미지의 디테일과 선명도를 높입니다.'
    },
    {
        id: 'cinematicLook',
        label: '시네마틱 효과',
        description: '영화 같은 조명과 색감을 추가합니다.'
    },
    {
        id: 'artisticStyle',
        label: '예술적 스타일',
        description: '독특한 예술적 감각을 더합니다.'
    },
];

export const ASPECT_RATIOS: string[] = ['9:16', '1:1', '16:9', '4:5', '3:4'];
export const IMAGE_COUNTS: number[] = [1, 2, 3, 4];
