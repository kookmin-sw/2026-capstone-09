'use client';

import { EditorContent } from '@tiptap/react';

import { useErrorToast } from '@/hooks/useErrorToast';
import { useUpdateNodeDescriptionMutation } from '@/queries/node';
import { useDescriptionEditor } from '../hooks/useDescriptionEditor';

interface DescriptionFieldProps {
  projectId: number;
  nodeId: number;
  description: string | undefined;
  onUpdate: (description: string) => void;
}

export function DescriptionField({
  projectId,
  nodeId,
  description,
  onUpdate,
}: DescriptionFieldProps) {
  const showErrorToast = useErrorToast();
  const { mutate: updateDescription } = useUpdateNodeDescriptionMutation(projectId, nodeId);

  const handleSave = (text: string) => {
    if (text === (description ?? '')) return;
    const previous = description ?? '';
    onUpdate(text);
    updateDescription(text, {
      onError: (err) => {
        onUpdate(previous);
        showErrorToast(err, '설명 수정에 실패했어요.');
      },
    });
  };

  const editor = useDescriptionEditor(description, handleSave);

  return <EditorContent editor={editor} />;
}
