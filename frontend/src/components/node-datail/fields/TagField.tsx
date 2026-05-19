'use client';

import { ContentBadge, ThemeColorsToken, Typography } from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';

import { TagItem } from '@/api/Api';
import { ColorType } from '@/constants/badgeColor';
import { useErrorToast } from '@/hooks/useErrorToast';
import {
  useAddNodeTagMutation,
  useCreateTagMutation,
  useDeleteTagMutation,
  useProjectTagsQuery,
  useRemoveNodeTagMutation,
  useUpdateTagColorMutation,
} from '@/queries/tag';
import { getColorToken } from '@/utils/getBadgeColorInfo';
import { usePickerState } from '../hooks/usePickerState';
import { useYjsTags } from '../hooks/useYjsTags';
import { TagContextMenu } from './TagContextMenu';

const TAG_COLORS: ColorType[] = [
  'RED', 'RED_ORANGE', 'ORANGE', 'LIME', 'GREEN',
  'CYAN', 'LIGHT_BLUE', 'BLUE', 'VIOLET', 'PURPLE', 'PINK',
];
const randomColor = (): ColorType => TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];

interface TagFieldProps {
  projectId: number;
  nodeId: number;
  initialTags: TagItem[] | undefined;
}

export function TagField({ projectId, nodeId, initialTags }: TagFieldProps) {
  const {
    isPickerOpen,
    setIsPickerOpen,
    inputValue,
    selectedIndex,
    setSelectedIndex,
    containerRef,
    inputRef,
    resetInput,
    handleInputChange,
    setOutsideCloseDisabled,
  } = usePickerState();

  const showErrorToast = useErrorToast();
  const { tags, yAddTag, yRemoveTag } = useYjsTags(initialTags);
  const { data: allTags = [] } = useProjectTagsQuery(projectId);
  const { mutate: addTag } = useAddNodeTagMutation(projectId, nodeId);
  const { mutate: removeTag } = useRemoveNodeTagMutation(projectId, nodeId);
  const { mutate: createTag } = useCreateTagMutation(projectId);
  const { mutate: deleteTag } = useDeleteTagMutation(projectId);
  const { mutate: updateTagColor } = useUpdateTagColorMutation(projectId);

  const assignedTagIds = new Set(tags.map((t) => t.tagId));

  const handleAdd = (tag: TagItem) => {
    if (!tag.tagId) return;
    yAddTag(tag);
    resetInput();
    addTag(tag.tagId, {
      onError: (err) => {
        yRemoveTag(tag.tagId!);
        showErrorToast(err, '태그 추가에 실패했어요.');
      },
    });
  };

  const handleRemove = (tagId: number) => {
    const removedTag = tags.find((t) => t.tagId === tagId);
    yRemoveTag(tagId);
    removeTag(tagId, {
      onError: (err) => {
        if (removedTag) yAddTag(removedTag);
        showErrorToast(err, '태그 제거에 실패했어요.');
      },
    });
  };

  const handleDeleteTag = (tag: TagItem) => {
    if (!tag.tagId) return;
    const isAssigned = assignedTagIds.has(tag.tagId);
    if (isAssigned) yRemoveTag(tag.tagId);
    deleteTag(tag.tagId, {
      onError: (err) => {
        if (isAssigned) yAddTag(tag);
        showErrorToast(err, '태그 삭제에 실패했어요.');
      },
    });
  };

  const handleUpdateTagColor = (tag: TagItem, color: ColorType) => {
    if (!tag.tagId || !tag.name) return;
    const isAssigned = assignedTagIds.has(tag.tagId);
    if (isAssigned) {
      yRemoveTag(tag.tagId);
      yAddTag({ ...tag, color });
    }
    updateTagColor(
      { tagId: tag.tagId, name: tag.name, color },
      {
        onError: (err) => {
          if (isAssigned) {
            yRemoveTag(tag.tagId!);
            yAddTag(tag);
          }
          showErrorToast(err, '태그 색상 변경에 실패했어요.');
        },
      },
    );
  };

  const availableTags = allTags.filter((t) => !assignedTagIds.has(t.tagId));
  const filteredTags = inputValue
    ? availableTags.filter((t) => t.name?.toLowerCase().includes(inputValue.toLowerCase()))
    : availableTags;
  const canCreate =
    inputValue.trim() !== '' &&
    !allTags.some((t) => t.name?.toLowerCase() === inputValue.trim().toLowerCase());
  const totalItems = filteredTags.length + (canCreate ? 1 : 0);

  const handleCreateTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const exactMatch = allTags.find((t) => t.name?.toLowerCase() === trimmed.toLowerCase());
    if (exactMatch) {
      if (!assignedTagIds.has(exactMatch.tagId)) handleAdd(exactMatch);
      return;
    }

    createTag(
      { name: trimmed, color: randomColor() },
      {
        onSuccess: (newTag) => {
          if (!newTag?.tagId) return;
          yAddTag(newTag);
          addTag(newTag.tagId, {
            onError: (err) => {
              yRemoveTag(newTag.tagId!);
              showErrorToast(err, '태그 추가에 실패했어요.');
            },
          });
          resetInput();
        },
        onError: (err) => showErrorToast(err, '태그 생성에 실패했어요.'),
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, totalItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredTags.length) {
        handleAdd(filteredTags[selectedIndex]);
      } else if (selectedIndex === filteredTags.length && canCreate) {
        handleCreateTag();
      } else {
        handleCreateTag();
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => {
          if (!isPickerOpen) setIsPickerOpen(true);
        }}
        className={`flex w-full cursor-text flex-wrap items-center gap-2.5 rounded-t-sm ${isPickerOpen ? 'bg-line-normal-alternative border-line-solid-normal border border-b-0 p-2.5' : ''}`}
      >
        {tags.length === 0 && !isPickerOpen && (
          <div className="text-label-alternative items-center">
            <Typography variant="caption1">선택된 태그가 없어요</Typography>
          </div>
        )}
        {tags.map((tag) => (
          <ContentBadge
            key={tag.tagId}
            color="accent"
            size="xsmall"
            accentColor={getColorToken(tag.color as ColorType) as ThemeColorsToken}
            trailingContent={
              <IconClose
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (tag.tagId) handleRemove(tag.tagId);
                }}
                aria-label={`${tag.name} 태그 제거`}
              />
            }
          >
            {tag.name}
          </ContentBadge>
        ))}
        {isPickerOpen && (
          <input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="text-label-normal min-w-20 flex-1 border-0 bg-transparent text-sm outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {isPickerOpen && (
        <div className="border-line-solid-normal absolute top-full left-0 z-50 w-full rounded-b-sm border bg-white py-2 shadow-md">
          {filteredTags.length === 0 && !canCreate ? (
            <p className="text-label-alternative px-3 py-2">
              {allTags.length === 0 ? (
                <Typography variant="caption1">태그가 없어요</Typography>
              ) : (
                <Typography variant="caption1">모든 태그가 추가되었어요</Typography>
              )}
            </p>
          ) : (
            <>
              {filteredTags.map((tag, i) => (
                <div
                  key={tag.tagId}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleAdd(tag)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAdd(tag); }}
                  className={`flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 ${selectedIndex === i ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
                >
                  <ContentBadge
                    color="accent"
                    size="xsmall"
                    accentColor={getColorToken(tag.color as ColorType) as ThemeColorsToken}
                  >
                    {tag.name}
                  </ContentBadge>
                  <div onClick={(e) => e.stopPropagation()}>
                    <TagContextMenu
                      tag={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      onColorChange={(color) => handleUpdateTagColor(tag, color)}
                      onOpenChange={setOutsideCloseDisabled}
                    />
                  </div>
                </div>
              ))}
              {canCreate && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleCreateTag}
                  className={`text-label-alternative flex w-full items-center gap-2 px-3 py-2 ${selectedIndex === filteredTags.length ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
                >
                  <Typography variant="caption1">
                    &apos;{inputValue.trim()}&apos; 태그 추가
                  </Typography>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
