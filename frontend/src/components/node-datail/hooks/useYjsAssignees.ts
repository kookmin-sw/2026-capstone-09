'use client';

import { AssigneeItem } from '@/api/Api';
import { YJS_FIELDS } from '@/contexts/YjsContext';
import { useYjsArray } from './useYjsArray';

export function useYjsAssignees(initialAssignees: AssigneeItem[] | undefined) {
  const { items: assignees, yAdd: yAddAssignee, yRemove: yRemoveAssignee } = useYjsArray(
    YJS_FIELDS.assignees,
    initialAssignees,
    'userId',
  );
  return { assignees, yAddAssignee, yRemoveAssignee };
}
