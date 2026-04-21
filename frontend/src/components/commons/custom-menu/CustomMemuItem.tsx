import { MenuItem, MenuItemContent } from '@wanteddev/wds';
import type { ComponentProps, ReactNode } from 'react';

type CustomMenuProps = ComponentProps<typeof MenuItem> & {
  /** 메뉴 아이템 왼쪽에 표시될 아이콘 요소입니다. */
  icon?: ReactNode;
};

/**
 * WDS의 `MenuItem`을 확장하여 아이콘을 간편하게 배치할 수 있도록 만든 컴포넌트입니다.
 *
 * - **기본 설정**: `variant="radio"`, `verticalPadding="small"`, `textProps={{ variant: 'label2' }}`가 기본으로 적용됩니다.
 * - **아이콘**: `icon` prop을 전달하면 WDS 권장 방식(`MenuItemContent variant="icon"`)으로
 *   좌측(`leadingContent`)에 래핑되어 렌더링됩니다.
 *
 * @see https://montage.wanted.co.kr/docs/components/presentation/menu/web#with-contents
 *
 * @example
 * ```tsx
 * <CustomMenuItem icon={<IconCheck />} onClick={handleClick}>
 *   메뉴 이름
 * </CustomMenuItem>
 * ```
 */
export const CustomMenuItem = ({ icon, ...props }: CustomMenuProps) => {
  return (
    <MenuItem
      verticalPadding="small"
      variant="radio"
      textProps={{ variant: 'label2' }}
      {...props}
      leadingContent={icon ? <MenuItemContent variant="icon">{icon}</MenuItemContent> : undefined}
    />
  );
};
