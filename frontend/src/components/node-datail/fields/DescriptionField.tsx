'use client';

import { EditorContent } from '@tiptap/react';
import { privateApi } from '@/api';
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
  const handleSave = async (text: string) => {
    if (text === (description ?? '')) return;
    const previous = description ?? '';
    onUpdate(text);
    try {
      await privateApi.node.updateNodeDescription(projectId, nodeId, { description: text });
    } catch {
      onUpdate(previous);
    }
  };

  const editor = useDescriptionEditor(description, handleSave);

  return <EditorContent editor={editor} />;
}
