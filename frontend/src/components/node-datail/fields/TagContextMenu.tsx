'use client';

import {
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuItemContent,
  MenuList,
  MenuTrigger,
  Theme,
  ThemeColorsToken,
  Typography,
  getColorByToken,
  useTheme,
} from '@wanteddev/wds';
import { IconCheck, IconMoreHorizontal, IconTrash } from '@wanteddev/wds-icon';

import { TagItem } from '@/api/Api';
import { BADGE_INFO, ColorType } from '@/constants/badgeColor';
import { getColorToken } from '@/utils/getBadgeColorInfo';

interface TagContextMenuProps {
  tag: TagItem;
  onDelete: () => void;
  onColorChange: (color: ColorType) => void;
  onOpenChange: (open: boolean) => void;
}

export function TagContextMenu({
  tag,
  onDelete,
  onColorChange,
  onOpenChange,
}: TagContextMenuProps) {
  const theme = useTheme();

  return (
    <Menu
      value={tag.color ?? 'NEUTRAL'}
      onValueChange={(color) => {
        if (color === '__delete__') return;
        onColorChange(color as ColorType);
      }}
      onOpenChange={onOpenChange}
    >
      <MenuTrigger>
        <IconButton>
          <IconMoreHorizontal />
        </IconButton>
      </MenuTrigger>
      <MenuContent position="bottom-end" sx={{ width: 120 }}>
        <MenuList sx={{ gap: '2', padding: '4' }}>
          <MenuItem
            variant="normal"
            value="__delete__"
            onClick={onDelete}
            textProps={{ sx: (t: Theme) => ({ color: t.semantic.status.negative }) }}
            sx={{ alignItems: 'center', height: 18 }}
            leadingContent={
              <MenuItemContent variant="icon-button">
                <IconButton size={14} color="semantic.status.negative">
                  <IconTrash />
                </IconButton>
              </MenuItemContent>
            }
          >
            <Typography variant="label2">태그 삭제</Typography>
          </MenuItem>
          {(Object.entries(BADGE_INFO) as [ColorType, (typeof BADGE_INFO)[ColorType]][]).map(
            ([color, info]) => (
              <MenuItem
                key={color}
                value={color}
                variant="normal"
                sx={{ height: 18, alignItems: 'center' }}
                trailingContent={
                  color === (tag.color ?? 'NEUTRAL') ? (
                    <MenuItemContent variant="icon-button">
                      <IconCheck />
                    </MenuItemContent>
                  ) : undefined
                }
                leadingContent={
                  <MenuItemContent variant="icon-button">
                    <span
                      style={{
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        backgroundColor: getColorByToken(
                          theme,
                          getColorToken(color) as ThemeColorsToken,
                        ),
                        flexShrink: 0,
                      }}
                    />
                  </MenuItemContent>
                }
              >
                <Typography variant="label2" color="semantic.label.neutral">
                  {info.label}
                </Typography>
              </MenuItem>
            ),
          )}
        </MenuList>
      </MenuContent>
    </Menu>
  );
}
