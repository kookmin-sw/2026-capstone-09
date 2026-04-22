import { Avatar } from '@wanteddev/wds';
import { useState, useRef, useEffect } from 'react';

import { EXAMPLE_PROJECT_SIDEBAR_PROFILE } from '@/constants/exampleConstant';
import type { Edge } from '@/types/FlowChartTypes';

type DashedCommentProps =
  | { isCreateMode: true; edge?: never; onCommentCreate?: (comment: string) => void }
  | { isCreateMode?: false; edge: Edge; onCommentCreate?: never };

interface CommentDisplayProps {
  avatarSrc?: string;
  nickname: string;
  timeText: string;
  comment: string;
}

// 공통 코멘트 컴포넌트 (default 상태)
function CommentDisplay({ avatarSrc, nickname, timeText, comment }: CommentDisplayProps) {
  return (
    <div className="flex items-start justify-start gap-2 rounded-lg bg-white p-3">
      <Avatar variant="person" size="xsmall" src={avatarSrc} />
      <div className="flex flex-col items-start justify-center gap-[3px]">
        <div className="flex items-center justify-between self-stretch gap-4">
          <div className="max-w-[100px] truncate text-caption-2 font-medium text-label-neutral">{nickname}</div>
          <div className="shrink-0 text-caption-2 font-regular text-neutral-50">{timeText}</div>
        </div>
        <div className="whitespace-nowrap text-caption-1 font-medium text-label-neutral">
          {comment}
        </div>
      </div>
    </div>
  );
}

export function DashedComment(props: DashedCommentProps) {
  const { isCreateMode, onCommentCreate } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [savedComment, setSavedComment] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleCreateClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    setSavedComment(trimmedValue);
    onCommentCreate?.(trimmedValue);
    setIsEditing(false);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue('');
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    setInputValue('');
  };

  if (isCreateMode === true && savedComment) {
    return (
      <CommentDisplay
        avatarSrc={EXAMPLE_PROJECT_SIDEBAR_PROFILE.profileImageUrl}
        nickname={EXAMPLE_PROJECT_SIDEBAR_PROFILE.userName}
        timeText="방금 전"
        comment={savedComment}
      />
    );
  }

  // Create 상태
  if (isCreateMode === true) {
    if (isEditing) {
      return (
        <div className="flex items-center justify-center rounded bg-white px-3 py-1 outline outline-1 outline-offset-[-1px] outline-primary-40">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              maxLength={50}
              placeholder="코멘트를 입력해주세요"
              className="w-full border-none bg-transparent text-caption-1 font-medium text-label-neutral outline-none placeholder:text-label-neutral/60"
            />
        </div>
      );
    }

    return (
      <button
        type="button"
        className="flex cursor-pointer items-center justify-center rounded bg-white px-3 py-1 outline outline-1 outline-offset-[-1px] outline-primary-40 transition-all hover:outline-primary-50"
        onClick={handleCreateClick}
      >
        <span className="whitespace-nowrap text-caption-1 font-medium text-label-neutral">
          코멘트를 입력해주세요
        </span>
      </button>
    );
  }

  // Default 상태 (코멘트가 있는 경우)
  const { edge } = props;

  return (
    <CommentDisplay
      avatarSrc={edge.createdBy.profileImageUrl}
      nickname={edge.createdBy.nickname}
      timeText="2일 전"
      comment={edge.comment}
    />
  );
}