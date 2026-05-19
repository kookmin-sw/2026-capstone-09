'use client';

import { TagItem } from '@/api/Api';
import { YJS_FIELDS } from '@/contexts/YjsContext';
import { useYjsArray } from './useYjsArray';

export function useYjsTags(initialTags: TagItem[] | undefined) {
  const { items: tags, yAdd: yAddTag, yRemove: yRemoveTag } = useYjsArray(
    YJS_FIELDS.tags,
    initialTags,
    'tagId',
  );
  return { tags, yAddTag, yRemoveTag };
}
