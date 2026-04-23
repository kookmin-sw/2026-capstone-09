import {
  IconButton,
  Menu,
  MenuContent,
  MenuList,
  MenuTrigger,
} from '@wanteddev/wds';
import {
  IconBubblePlus,
  IconCircleClose,
  IconMoreVertical,
  IconPencil,
  IconPin,
  IconPlus,
  IconTrash,
} from '@wanteddev/wds-icon';
import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';

interface NodeMenuProps {
  variant: 'main' | 'sub-with-meeting' | 'sub-without-meeting';
  onCreateSubNode: () => void;
  onCreateMeeting?: () => void;
  onEditMeeting?: () => void;
  onDeleteMeeting?: () => void;
  onCreateReference: () => void;
  onDelete: () => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}

export function NodeMenu({
  variant,
  onCreateSubNode,
  onCreateMeeting,
  onEditMeeting,
  onDeleteMeeting,
  onCreateReference,
  onDelete,
  onMenuClick,
}: NodeMenuProps) {
  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeout(() => {
      onMenuClick?.(e);
    }, 0);
  };

  return (
    <Menu>
      <MenuTrigger>
        <IconButton size={18} onClick={handleMenuButtonClick}>
          <IconMoreVertical className="shrink-0 text-neutral-60" width={18} height={18} />
        </IconButton>
      </MenuTrigger>
      <MenuContent position="bottom-start" sx={{ width: 154 }}>
        <MenuList>
          <CustomMenuItem
            value="create-sub-node"
            icon={<IconPlus />}
            onClick={onCreateSubNode}
          >
            서브 노드 생성
          </CustomMenuItem>

          {variant === 'sub-without-meeting' && (
            <CustomMenuItem
              value="create-meeting"
              icon={<IconBubblePlus />}
              onClick={onCreateMeeting}
            >
              회의 생성
            </CustomMenuItem>
          )}

          {variant === 'sub-with-meeting' && (
            <CustomMenuItem
              value="edit-meeting"
              icon={<IconPencil />}
              onClick={onEditMeeting}
            >
              회의 수정
            </CustomMenuItem>
          )}

          <CustomMenuItem
            value="create-reference"
            icon={<IconPin />}
            onClick={onCreateReference}
          >
            참조 노드
          </CustomMenuItem>

          {variant === 'sub-with-meeting' && (
            <CustomMenuItem
              value="delete-meeting"
              icon={<IconCircleClose className="text-status-negative" />}
              onClick={onDeleteMeeting}
              textProps={{
                variant: 'label2',
                sx: (theme) => ({ color: theme.semantic.status.negative }),
              }}
            >
              회의 삭제
            </CustomMenuItem>
          )}

          <CustomMenuItem
            value="delete"
            icon={<IconTrash className="text-status-negative" />}
            onClick={onDelete}
            textProps={{
              variant: 'label2',
              sx: (theme) => ({ color: theme.semantic.status.negative }),
            }}
          >
            삭제
          </CustomMenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );
}