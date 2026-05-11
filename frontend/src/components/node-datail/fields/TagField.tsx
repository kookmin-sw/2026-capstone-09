'use client';

import { ContentBadge, ThemeColorsToken, Typography } from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';
import { useRef, useState } from 'react';

import { TagItem } from '@/api/Api';
import { ColorType } from '@/constants/badgeColor';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useAddNodeTagMutation, useRemoveNodeTagMutation } from '@/queries/tag';
import { useProjectTagsQuery } from '@/queries/tag';
import { getColorToken } from '@/utils/getBadgeColorInfo';

interface TagFieldProps {
  projectId: number;
  nodeId: number;
  tags: TagItem[];
  onAdd: (tag: TagItem) => void;
  onRemove: (tagId: number) => void;
}

export function TagField({ projectId, nodeId, tags, onAdd, onRemove }: TagFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const showErrorToast = useErrorToast();

  const { data: allTags = [] } = useProjectTagsQuery(projectId);
  const { mutate: addTag } = useAddNodeTagMutation(projectId, nodeId);
  const { mutate: removeTag } = useRemoveNodeTagMutation(projectId, nodeId);

  useClickOutside(containerRef, isPickerOpen, () => setIsPickerOpen(false));

  const handleAdd = (tag: TagItem) => {
    if (!tag.tagId) return;
    onAdd(tag);
    addTag(tag.tagId, {
      onError: (err) => {
        onRemove(tag.tagId!);
        showErrorToast(err, '태그 추가에 실패했어요.');
      },
    });
  };

  const handleRemove = (tagId: number) => {
    const removedTag = tags.find((t) => t.tagId === tagId);
    onRemove(tagId);
    removeTag(tagId, {
      onError: (err) => {
        if (removedTag) onAdd(removedTag);
        showErrorToast(err, '태그 제거에 실패했어요.');
      },
    });
  };

  const assignedTagIds = new Set(tags.map((t) => t.tagId));
  const availableTags = allTags.filter((t) => !assignedTagIds.has(t.tagId));

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => {
          if (!isPickerOpen) setIsPickerOpen(true);
        }}
        className={`flex w-full cursor-text flex-wrap items-center gap-2.5 rounded-t-sm ${isPickerOpen ? 'bg-line-normal-alternative border-line-solid-normal border border-b-0 p-2.5' : ''}`}
      >
        {tags.length === 0 && (
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
        {isPickerOpen && <span className="h-4 w-px self-center" />}
      </div>

      {isPickerOpen && (
        <div className="border-line-solid-normal absolute top-full left-0 z-50 w-full rounded-b-sm border bg-white py-2 shadow-md">
          {availableTags.length === 0 ? (
            <p className="text-label-alternative px-3 py-2">
              {allTags.length === 0 ? (
                <Typography variant="caption1">태그가 없어요</Typography>
              ) : (
                <Typography variant="caption1">모든 태그가 추가되었어요</Typography>
              )}
            </p>
          ) : (
            availableTags.map((tag) => (
              <button
                key={tag.tagId}
                type="button"
                onClick={() => handleAdd(tag)}
                className="flex w-full items-center gap-2 bg-white px-3 py-2 hover:bg-gray-50"
              >
                <ContentBadge
                  color="accent"
                  size="xsmall"
                  accentColor={getColorToken(tag.color as ColorType) as ThemeColorsToken}
                >
                  {tag.name}
                </ContentBadge>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
