import { IconButton, MenuItem, MenuItemContent } from '@wanteddev/wds';

import type { ComponentProps, ReactNode } from 'react';

type CustomMenuProps = ComponentProps<typeof MenuItem> & {
  icon?: ReactNode;
};

export const CustomMenuItem = ({ icon, ...props }: CustomMenuProps) => {
  return (
    <MenuItem
      verticalPadding="small"
      variant="radio"
      textProps={{ variant: 'label2' }}
      {...props}
      leadingContent={
        icon && (
          <MenuItemContent variant="icon-button">
            <IconButton size={24}>{icon}</IconButton>
          </MenuItemContent>
        )
      }
    />
  );
};
