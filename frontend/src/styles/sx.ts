/**
 * WDS 컴포넌트에 FlowMeet 디자인 토큰을 덮어씌우는 공통 `sx` 오버라이드 모음.
 *
 * WDS 기본 primary(blue) / interactive 색상을 사용할 수 없는 경우가 많아
 * 같은 스코프드 오버라이드를 여러 파일에서 중복해 쓰고 있었다. 한 곳에서만
 * 관리하도록 공통 객체로 빼두었다.
 */

// WDS TextField 포커스 테두리·캐럿 색을 FlowMeet Primary 토큰으로 스코프드 오버라이드
export const textFieldPrimaryFocusSx = {
  '&:has(input:focus) [data-role="text-field-wrapper"]': {
    boxShadow:
      'inset 0 0 0 2px color-mix(in srgb, var(--color-primary-40) 43%, transparent) !important',
  },
  '[data-role="text-field-wrapper"] input': {
    caretColor: 'var(--color-primary-40)',
  },
} as const;

// WDS IconButton hover 시 배경 변화 제거
export const iconButtonNoHoverSx = {
  '&:hover, &:focus-visible, &:active': {
    backgroundColor: 'transparent !important',
  },
} as const;

// 파괴적 액션(프로젝트/노드 삭제 등)에 사용하는 negative 톤 Button sx.
// `disabled`가 아닌 활성 상태일 때만 배경을 negative 토큰으로 바꾼다.
export const buttonNegativeSolidSx = {
  backgroundColor: 'var(--color-status-negative) !important',
  color: 'var(--color-static-white) !important',
  '&:hover, &:focus-visible': {
    backgroundColor:
      'color-mix(in srgb, var(--color-status-negative) 88%, black) !important',
  },
  '&:active': {
    backgroundColor:
      'color-mix(in srgb, var(--color-status-negative) 78%, black) !important',
  },
} as const;

// Primary 톤 solid Button의 hover/active 색상을 FlowMeet primary 토큰에 맞춰
// 오버라이드. WDS 기본 Button은 primary=blue 기준이라 별도 지정이 필요하다.
export const buttonPrimarySolidSx = {
  backgroundColor: 'var(--color-primary-40) !important',
  color: 'var(--color-static-white) !important',
  '&:hover, &:focus-visible': {
    backgroundColor:
      'color-mix(in srgb, var(--color-primary-40) 88%, black) !important',
  },
  '&:active': {
    backgroundColor:
      'color-mix(in srgb, var(--color-primary-40) 78%, black) !important',
  },
} as const;

// TextButton을 negative 톤으로 쓰기 위한 오버라이드 (WDS TextButton의 color prop은
// primary | assistive 만 받아, status-negative는 sx로 따로 적용).
export const textButtonNegativeSx = {
  color: 'var(--color-status-negative) !important',
  '&:hover, &:focus-visible, &:active': {
    color: 'var(--color-status-negative) !important',
  },
} as const;
