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
import { useState } from 'react';
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
  position?: 'bottom-start' | 'bottom-end' | 'bottom-center';
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
  position = 'bottom-start',
}: NodeMenuProps) {
  const [open, setOpen] = useState(false);

  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeout(() => {
      onMenuClick?.(e);
    }, 0);
  };

  const handleCreateSubNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateSubNode();
    setOpen(false);
  };

  const handleCreateMeeting = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateMeeting?.();
    setOpen(false);
  };

  const handleEditMeeting = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditMeeting?.();
    setOpen(false);
  };

  const handleDeleteMeeting = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteMeeting?.();
    setOpen(false);
  };

  const handleCreateReference = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateReference();
    setOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setOpen(false);
  };

  return (
    <Menu open={open} onOpenChange={setOpen}>
      <MenuTrigger>
        <IconButton size={18} onClick={handleMenuButtonClick}>
          <IconMoreVertical className="shrink-0 text-neutral-60" width={18} height={18} />
        </IconButton>
      </MenuTrigger>
      <MenuContent position={position} sx={{ width: 154 }}>
        <MenuList>
          <CustomMenuItem
            value="create-sub-node"
            icon={<IconPlus />}
            onClick={handleCreateSubNode}
          >
            서브 노드 생성
          </CustomMenuItem>

          {variant === 'sub-without-meeting' && (
            <CustomMenuItem
              value="create-meeting"
              icon={<IconBubblePlus />}
              onClick={handleCreateMeeting}
            >
              회의 생성
            </CustomMenuItem>
          )}

          {variant === 'sub-with-meeting' && !!onEditMeeting && (
            <CustomMenuItem
              value="edit-meeting"
              icon={<IconPencil />}
              onClick={handleEditMeeting}
            >
              회의 수정
            </CustomMenuItem>
          )}

          <CustomMenuItem
            value="create-reference"
            icon={<IconPin />}
            onClick={handleCreateReference}
          >
            참조 노드
          </CustomMenuItem>

          {variant === 'sub-with-meeting' && (
            <CustomMenuItem
              value="delete-meeting"
              icon={<IconCircleClose className="text-status-negative" />}
              onClick={handleDeleteMeeting}
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
            onClick={handleDelete}
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