import { BADGE_INFO, ColorType } from '@/constants/badgeColor';

// 라벨명만 가져오기
export const getColorLabel = (color: ColorType): string => {
  return BADGE_INFO[color]?.label;
};

// 컬러 토큰만 가져오기
export const getColorToken = (color: ColorType): string => {
  return BADGE_INFO[color]?.colorToken;
};

// 전체 정보 가져오기
export const getColorInfo = (color: ColorType) => {
  return BADGE_INFO[color];
};
