import {
  Avatar,
  AvatarGroup,
  ContentBadge,
  IconButton,
  Menu,
  MenuContent,
  MenuList,
  MenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipGroup,
  TooltipTrigger,
} from '@wanteddev/wds';
import {
  IconBubblePlus,
  IconPencil,
  IconMoreVertical,
  IconPin,
  IconPlus,
  IconTrash,
  IconCircleClose
} from '@wanteddev/wds-icon';
import { useState } from 'react';

import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';
import type { Node } from '@/types/FlowChartTypes';
import { formatDate, getVisibleTags } from '@/utils/nodeUtils';

interface SubNodeProps {
  node: Node;
}

export function SubNode({ node }: SubNodeProps) {
  const { visibleTags, remainingTagsCount } = getVisibleTags(node.tags);
  const [isFocused, setIsFocused] = useState(false);
  const nodeNumber = node.parentId ? `#${node.parentId}-${node.nodeId}` : `#${node.nodeId}`;

  const handleClick = () => {
    setIsFocused(!isFocused);
  };

  const handleCreateSubNode = () => {
    // TODO: 서브 노드 생성 모달 열기
  };

  const handleCreateMeeting = () => {
    // TODO: 회의 생성 모달 열기
  };

  const handleEditMeeting = () => {
    // TODO: 회의 수정 모달 열기
  };

  const handleDeleteMeeting = () => {
    // TODO: 회의 삭제 확인 모달 열기
  };

  const handleCreateReference = () => {
    // TODO: 참조 노드 생성 모달 열기
  };

  const handleDelete = () => {
    // TODO: 삭제 확인 모달 열기
  };

  return (
    <div
      className={`bg-white flex w-60 flex-col gap-3 overflow-hidden rounded-xl p-4 outline outline-1 outline-offset-[-1px] cursor-pointer transition-all
        ${isFocused ? 'outline-primary-40' : 'outline-neutral-200 hover:outline-primary-40'}`}
      style={
        isFocused
          ? {
              boxShadow:
                '-2px -2px 4px 0px color-mix(in srgb, var(--color-primary-40) 20%, transparent), 2px 2px 4px 0px color-mix(in srgb, var(--color-primary-40) 20%, transparent)',
            }
          : undefined
      }
      onClick={handleClick}
    >
      <div className="flex flex-col gap-1 self-stretch">
        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <ContentBadge size="xsmall" variant="outlined" color="neutral">
              {nodeNumber}
            </ContentBadge>

            <div className="min-w-0 truncate text-caption-2 font-normal text-label-alternative">
              {formatDate(node.updatedAt)}
            </div>
          </div>

          <Menu>
            <MenuTrigger>
              <IconButton size={18} onClick={(e) => e.stopPropagation()}>
                <IconMoreVertical className="shrink-0 text-neutral-60" width={18} height={18} />
              </IconButton>
            </MenuTrigger>
            <MenuContent position="bottom-start" sx={{ width: 154 }}>
              <MenuList>
                <CustomMenuItem value="create-sub-node" icon={<IconPlus />} onClick={handleCreateSubNode}>
                  서브 노드 생성
                </CustomMenuItem>
                {node.hasMeeting ? (
                  <>
                    <CustomMenuItem
                      value="edit-meeting"
                      icon={<IconPencil />}
                      onClick={handleEditMeeting}
                    >
                      회의 수정
                    </CustomMenuItem>
                    <CustomMenuItem
                      value="create-reference"
                      icon={<IconPin />}
                      onClick={handleCreateReference}
                    >
                      참조 노드
                    </CustomMenuItem>
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
                  </>
                ) : (
                  <>
                    <CustomMenuItem
                      value="create-meeting"
                      icon={<IconBubblePlus />}
                      onClick={handleCreateMeeting}
                    >
                      회의 생성
                    </CustomMenuItem>
                    <CustomMenuItem
                      value="create-reference"
                      icon={<IconPin />}
                      onClick={handleCreateReference}
                    >
                      참조 노드
                    </CustomMenuItem>
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
                  </>
                )}
              </MenuList>
            </MenuContent>
          </Menu>
        </div>

        <div className="line-clamp-1 text-body-1 font-medium">{node.title}</div>
      </div>

      <div className="flex items-center justify-between gap-2 self-stretch overflow-hidden">
        <div className="flex min-w-0 items-center gap-1 overflow-hidden">
          {visibleTags.map((tag) => (
            <ContentBadge
              key={tag.tagId}
              size="xsmall"
              variant="solid"
              color="neutral"
              sx={{
                backgroundColor: `${tag.color}1A`,
                color: tag.color,
              }}
            >
              {tag.name}
            </ContentBadge>
          ))}
          {remainingTagsCount > 0 && (
            <ContentBadge size="xsmall" variant="solid" color="neutral">
              +{remainingTagsCount}
            </ContentBadge>
          )}
        </div>

        {node.assignees.length > 0 && (
          <div className="shrink-0">
            <TooltipGroup>
              <AvatarGroup size="xsmall">
                {node.assignees.slice(0, 3).map((assignee, index) => (
                  <Tooltip key={assignee.userId}>
                    <TooltipTrigger>
                      <div className={index === 0 ? '' : '-ml-1'} style={{ zoom: 0.75 }}>
                        <Avatar
                          variant="person"
                          size="xsmall"
                          src={assignee.profileImageUrl}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      size="small"
                      position={index === node.assignees.length - 1 ? 'bottom-end' : 'bottom-center'}
                    >
                      <div className="flex min-w-[100px] items-center gap-2 px-1 py-1.5">
                        <Avatar variant="person" size="xsmall" src={assignee.profileImageUrl} />
                        <span className="text-caption-1 font-medium text-neutral-100">
                          {assignee.nickname}
                        </span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </AvatarGroup>
            </TooltipGroup>
          </div>
        )}
      </div>
    </div>
  );
}