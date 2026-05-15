'use client';

import { Avatar, Theme, Typography } from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';

import { AssigneeItem, ProjectMemberInfo } from '@/api/Api';
import { useErrorToast } from '@/hooks/useErrorToast';
import {
  useAddAssigneeMutation,
  useProjectMembersQuery,
  useRemoveAssigneeMutation,
} from '@/queries/member';
import { usePickerState } from '../hooks/usePickerState';
import { useYjsAssignees } from '../hooks/useYjsAssignees';

interface AssigneeFieldProps {
  projectId: number;
  nodeId: number;
  initialAssignees: AssigneeItem[] | undefined;
}

export function AssigneeField({ projectId, nodeId, initialAssignees }: AssigneeFieldProps) {
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
  } = usePickerState();

  const showErrorToast = useErrorToast();
  const { assignees, yAddAssignee, yRemoveAssignee } = useYjsAssignees(initialAssignees);
  const { data: members = [] } = useProjectMembersQuery(projectId);
  const { mutate: addAssignee } = useAddAssigneeMutation(projectId, nodeId);
  const { mutate: removeAssignee } = useRemoveAssigneeMutation(projectId, nodeId);

  const handleAdd = (member: ProjectMemberInfo) => {
    if (!member.userId) return;
    const newAssignee: AssigneeItem = {
      userId: member.userId,
      nickname: member.nickname,
      email: member.email,
      profileImageUrl: member.profileImageUrl,
    };
    yAddAssignee(newAssignee);
    resetInput();
    addAssignee(member.userId, {
      onError: (err) => {
        yRemoveAssignee(member.userId!);
        showErrorToast(err, '담당자 추가에 실패했어요.');
      },
    });
  };

  const handleRemove = (assigneeId: number) => {
    const removedAssignee = assignees.find((a) => a.assigneeId === assigneeId);
    if (removedAssignee?.userId) yRemoveAssignee(removedAssignee.userId);
    removeAssignee(assigneeId, {
      onError: (err) => {
        if (removedAssignee) yAddAssignee(removedAssignee);
        showErrorToast(err, '담당자 제거에 실패했어요.');
      },
    });
  };

  const assignedUserIds = new Set(assignees.map((a) => a.userId));
  const availableMembers = members.filter((m) => !assignedUserIds.has(m.userId));
  const filteredMembers = inputValue
    ? availableMembers.filter(
        (m) =>
          m.nickname?.toLowerCase().includes(inputValue.toLowerCase()) ||
          m.email?.toLowerCase().includes(inputValue.toLowerCase()),
      )
    : availableMembers;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredMembers.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredMembers.length) {
        handleAdd(filteredMembers[selectedIndex]);
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
        {assignees.length === 0 && !isPickerOpen && (
          <div className="text-label-alternative items-center">
            <Typography variant="caption1">선택된 담당자가 없어요</Typography>
          </div>
        )}
        {assignees.map((assignee) => (
          <div key={assignee.userId} className="group flex items-center gap-1">
            <div className="scale-75">
              <Avatar variant="person" size="xsmall" src={assignee.profileImageUrl || undefined} />
            </div>
            <Typography variant="label1">{assignee.nickname}</Typography>
            <IconClose
              width={10}
              height={10}
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                if (assignee.assigneeId) handleRemove(assignee.assigneeId);
              }}
              aria-label={`${assignee.nickname} 담당자 제거`}
            />
          </div>
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
          {filteredMembers.length === 0 ? (
            <p className="text-label-alternative px-3 py-2">
              <Typography variant="caption1">
                {members.length === 0
                  ? '멤버가 없어요'
                  : availableMembers.length === 0
                    ? '모든 멤버가 추가되었어요'
                    : '검색 결과가 없어요'}
              </Typography>
            </p>
          ) : (
            filteredMembers.map((member, i) => (
              <button
                key={member.userId}
                type="button"
                onClick={() => handleAdd(member)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 ${selectedIndex === i ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    variant="person"
                    size="xsmall"
                    src={member.profileImageUrl || undefined}
                  />
                  <div className="flex flex-col text-left">
                    <Typography variant="label2">{member.nickname}</Typography>
                  </div>
                </div>
                <Typography
                  variant="caption1"
                  sx={(theme: Theme) => ({
                    color: theme.semantic.label.alternative,
                  })}
                >
                  {member.email}
                </Typography>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
