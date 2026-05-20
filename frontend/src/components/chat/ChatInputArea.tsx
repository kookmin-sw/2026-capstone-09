'use client';

import { MultiSelectInput, type MultiSelectInputValue, type NodeOption, type UserOption } from '@/components/commons/custom-input/MultiSelectInput';

interface ChatInputAreaProps {
  value: MultiSelectInputValue;
  onChange: (value: MultiSelectInputValue) => void;
  onSubmit: (value: MultiSelectInputValue) => void;
  userOptions: UserOption[];
  nodeOptions: NodeOption[];
}

export function ChatInputArea({ value, onChange, onSubmit, userOptions, nodeOptions }: ChatInputAreaProps) {
  return (
    <div className="w-96 py-4 inline-flex flex-col justify-start items-start gap-4">
      <div className="self-stretch h-px bg-line-normal-normal" />
      <div className="self-stretch px-5">
        <MultiSelectInput
          placeholder="@로 사용자나 노드를 참조할 수 있어요."
          userOptions={userOptions}
          nodeOptions={nodeOptions}
          value={value}
          autoFocus
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}