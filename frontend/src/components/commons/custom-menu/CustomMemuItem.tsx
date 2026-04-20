import { MenuItem } from '@wanteddev/wds';
import type { ComponentProps, ReactNode } from 'react';

type CustomMenuProps = ComponentProps<typeof MenuItem> & {
  /** 메뉴 아이템 왼쪽에 표시될 아이콘 요소입니다. */
  icon?: ReactNode;
};

/**
 * WDS의 `MenuItem`을 확장하여 아이콘을 간편하게 배치할 수 있도록 만든 컴포넌트입니다.
 * * - **기본 설정**: `variant="radio"`, `verticalPadding="small"`, `textProps={{ variant: 'label2' }}`가 기본으로 적용됩니다.
 * - **아이콘**: `icon` prop을 전달하면 좌측(`leadingContent`)에 24×24 sizing box로 자동 렌더링됩니다.
 * @param props - `MenuItem`의 모든 속성과 `icon` 속성을 포함합니다.
 * @param {ReactNode} [props.icon] - 아이콘으로 사용할 React 요소를 전달합니다.
 *
 * @example
 * ```tsx
 * <CustomMenuItem
 * icon={<IconCheck />}
 * onClick={handleClick}
 * >
 * 메뉴 이름
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
      leadingContent={
        icon && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5">
            {icon}
          </span>
        )
      }
    />
  );
};
