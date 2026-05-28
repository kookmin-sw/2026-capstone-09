'use client';

import { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import type { CreateEdgeRequest, LinkedNodeItem } from '@/api/Api';

export type ReferenceNodeKind = 'main' | 'sub';

export interface ReferenceNodeOption {
  nodeId: number;
  nodeNumber: string;
  nodeTitle: string;
  /** 노드 종류. 미지정 시 nodeNumber에 '.' 포함 여부로 판단한다. */
  kind?: ReferenceNodeKind;
}

/** 참조 중인 노드 목록 항목. Swagger `LinkedNodeItem` 스키마를 그대로 사용한다. */
export type ReferencedNodeItem = LinkedNodeItem;

export interface CreateReferenceNodePathParams {
  projectId: number;
}

export interface CreateReferenceNodeResponse {
  status: 200;
  code: 'OK';
  message: '요청에 성공했습니다.';
  data: null;
}

export type CreateReferenceNodeErrorCode = 'NODE_NOT_FOUND' | 'EDGE_DUPLICATE';

export type ReferenceNodeCreatePayload = CreateEdgeRequest;

export interface ReferenceNodeFormValues {
  nodeKeyword: string;
  comment: string;
}

export type ReferenceNodeViewMode = 'list' | 'add';

interface UseReferenceNodeFormProps {
  startNodeId: number;
  nodeOptions: readonly ReferenceNodeOption[];
}

const MAX_COMMENT_LENGTH = 50;

export const getNodeKind = (option: ReferenceNodeOption): ReferenceNodeKind =>
  option.kind ?? (option.nodeNumber.includes('.') ? 'sub' : 'main');

export const useReferenceNodeForm = ({ startNodeId, nodeOptions }: UseReferenceNodeFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid },
  } = useForm<ReferenceNodeFormValues>({
    defaultValues: {
      nodeKeyword: '',
      comment: '',
    },
    mode: 'onChange',
  });

  const [viewMode, setViewMode] = useState<ReferenceNodeViewMode>('list');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const nodeKeyword = useWatch({ control, name: 'nodeKeyword' });
  const comment = useWatch({ control, name: 'comment' });
  const trimmedNodeKeyword = nodeKeyword.trim();
  const trimmedComment = comment.trim();

  // 타이틀이 중복되는 노드가 있을 수 있으므로, 사용자가 드롭다운에서 선택한 nodeId를 기준으로 식별한다.
  const selectedNode = useMemo(
    () =>
      selectedNodeId !== null
        ? nodeOptions.find((node) => node.nodeId === selectedNodeId) ?? null
        : null,
    [nodeOptions, selectedNodeId],
  );

  const searchResults = useMemo(() => {
    if (!trimmedNodeKeyword) return [...nodeOptions];
    const lower = trimmedNodeKeyword.toLowerCase();
    return nodeOptions.filter((option) => {
      const titleMatch = option.nodeTitle.toLowerCase().includes(lower);
      const numberMatch =
        option.nodeNumber.toLowerCase().includes(lower) ||
        `#${option.nodeNumber}`.toLowerCase().includes(lower);
      return titleMatch || numberMatch;
    });
  }, [nodeOptions, trimmedNodeKeyword]);

  const commentLength = comment.length;
  const canCreate = isValid && selectedNode !== null && commentLength <= MAX_COMMENT_LENGTH;

  const buildPayload = (): ReferenceNodeCreatePayload => ({
    startNodeId,
    endNodeId: selectedNode?.nodeId ?? 0,
    ...(trimmedComment && { comment: trimmedComment }),
  });

  const openAddView = useCallback(() => {
    setViewMode('add');
  }, []);

  const closeAddView = useCallback(() => {
    setViewMode('list');
    setIsSearchOpen(false);
    setSelectedNodeId(null);
    reset({ nodeKeyword: '', comment: '' });
  }, [reset]);

  const selectNodeOption = useCallback(
    (option: ReferenceNodeOption) => {
      setSelectedNodeId(option.nodeId);
      setValue('nodeKeyword', option.nodeTitle, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setIsSearchOpen(false);
    },
    [setValue],
  );

  const clearSelectedNode = useCallback(() => {
    setSelectedNodeId(null);
    setValue('nodeKeyword', '', { shouldValidate: true, shouldDirty: true });
  }, [setValue]);

  return {
    control,
    handleSubmit,
    selectedNode,
    commentLength,
    maxCommentLength: MAX_COMMENT_LENGTH,
    canCreate,
    buildPayload,
    viewMode,
    openAddView,
    closeAddView,
    isSearchOpen,
    setIsSearchOpen,
    searchResults,
    selectNodeOption,
    clearSelectedNode,
  };
};
