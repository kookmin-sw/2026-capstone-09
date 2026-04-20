'use client';

import {
  Button,
  ContentBadge,
  DatePicker,
  type DateType,
  TextField,
  TextFieldContent,
  TimePicker,
} from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';
import { useMemo, useState } from 'react';

import { EXAMPLE_PROJECT_MEMBERS } from '@/constants/exampleConstant';

import { ParticipantsSelect, type ParticipantOption } from './ParticipantsSelect';

export interface MeetingCreatePayload {
  nodeBadge: string;
  nodeTitle: string;
  date: string;
  time: string;
  participants: readonly string[];
}

interface MeetingCreateModalContentProps {
  nodeBadge: string;
  nodeTitle: string;
  onClose: () => void;
  onCreate?: (payload: MeetingCreatePayload) => void;
}

const formatDate = (value: DateType): string => {
  if (!value) return '';
  const dateObj = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateObj.getTime())) return '';
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatTime = (value: DateType): string => {
  if (!value) return '';
  const dateObj = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateObj.getTime())) return '';
  const hh = String(dateObj.getHours()).padStart(2, '0');
  const mm = String(dateObj.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

export const MeetingCreateModalContent = ({
  nodeBadge,
  nodeTitle,
  onClose,
  onCreate,
}: MeetingCreateModalContentProps) => {
  const [date, setDate] = useState<DateType>(null);
  const [time, setTime] = useState<DateType>(null);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [participants, setParticipants] = useState<readonly ParticipantOption[]>([]);

  const participantOptions = useMemo<ParticipantOption[]>(
    () =>
      EXAMPLE_PROJECT_MEMBERS.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
      })),
    [],
  );

  const handleCreate = () => {
    onCreate?.({
      nodeBadge,
      nodeTitle,
      date: formatDate(date),
      time: formatTime(time),
      participants: participants.map((item) => item.name),
    });
  };

  return (
    <div data-meeting-create-modal="" className="flex w-full flex-col gap-8">
      {/* WDS TextField 포커스 색·캐럿 색 override + TimePicker 드럼 하단 스페이서 제거 */}
      <style>{`
        /* 포커스 상태 — input focus / focus-within */
        [data-meeting-create-modal] [data-role='text-field-wrapper']:has(input:focus),
        [data-meeting-create-modal] [data-role='text-field-wrapper']:focus-within,
        [data-meeting-create-modal] :focus-within > [data-role='text-field-wrapper'],
        [data-meeting-create-modal] :has(input:focus) > [data-role='text-field-wrapper'] {
          box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--color-primary-40) 43%, transparent) !important;
        }
        /* Picker 팝오버가 열려 있을 때 (aria-expanded='true') — 원래 WDS가 파란색으로 그리는 케이스 */
        [data-meeting-create-modal] [data-role='text-field-wrapper']:has(input[aria-expanded='true']),
        [data-meeting-create-modal] [data-role='text-field-wrapper']:has(input[data-role='date-picker-field'][aria-expanded='true']),
        [data-meeting-create-modal] [data-role='text-field-wrapper']:has(input[data-role='time-picker-field'][aria-expanded='true']) {
          box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--color-primary-40) 43%, transparent) !important;
        }
        [data-meeting-create-modal] [data-role='text-field-wrapper'] input {
          caret-color: var(--color-primary-40) !important;
        }
        [data-meeting-create-modal] [data-role='text-field-reset'] {
          display: none !important;
        }
        /* TimePicker 드럼의 하단 스페이서 pseudo 제거 — WDS TimeList(data-role="time-list-*")의 ::after 제거 */
        [data-role^='time-list-']::after {
          display: none !important;
          min-height: 0 !important;
          content: none !important;
        }
      `}</style>

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-heading-1 text-label-normal font-medium">회의 생성</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0"
        >
          <IconClose className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-4">
          {/* 회의를 진행할 노드 (readonly) */}
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="meeting-create-node"
              className="text-label-1 text-label-neutral font-semibold"
            >
              회의를 진행할 노드
            </label>
            <TextField
              id="meeting-create-node"
              value={nodeTitle}
              readOnly
              disabled
              width="100%"
              leadingContent={
                <TextFieldContent variant="badge">
                  <ContentBadge
                    size="xsmall"
                    variant="solid"
                    color="accent"
                    className="!bg-primary-40/10 !text-primary-40"
                  >
                    {nodeBadge}
                  </ContentBadge>
                </TextFieldContent>
              }
            />
          </div>

          {/* 날짜 / 시간 */}
          <div className="flex w-full items-start gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-label-1 text-label-neutral font-semibold">날짜</span>
              <DatePicker
                value={date}
                onChange={(nextValue) => setDate(nextValue)}
                format="YYYY-MM-DD"
                placeholder="날짜 선택"
                width="100%"
                locale="ko"
                open={isDateOpen}
                onOpenChange={setIsDateOpen}
                onClick={() => setIsDateOpen(true)}
                contentProps={{ sx: { zIndex: 10000 } }}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-label-1 text-label-neutral font-semibold">시간</span>
              <TimePicker
                value={time}
                onChange={(nextValue) => setTime(nextValue)}
                format="HH:mm"
                placeholder="시간 선택"
                width="100%"
                open={isTimeOpen}
                onOpenChange={setIsTimeOpen}
                onClick={() => setIsTimeOpen(true)}
                contentProps={{
                  sx: {
                    zIndex: 10000,
                    // WDS TimeView는 Radix ScrollArea 기반이라 커스텀 scrollbar DOM을 숨김
                    '[data-radix-scroll-area-scrollbar]': {
                      display: 'none !important',
                    },
                    '[data-radix-scroll-area-corner]': {
                      display: 'none !important',
                    },
                    // viewport native scrollbar 숨김 (스크롤 기능 자체는 유지)
                    '[data-radix-scroll-area-viewport]': {
                      scrollbarWidth: 'none',
                      overscrollBehavior: 'contain',
                    },
                    '[data-radix-scroll-area-viewport]::-webkit-scrollbar': {
                      display: 'none',
                      width: 0,
                      height: 0,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* 참여자 */}
          <div className="flex w-full flex-col gap-2">
            <span className="text-label-1 text-label-neutral font-semibold">참여자</span>
            <ParticipantsSelect
              options={participantOptions}
              value={participants}
              onChange={setParticipants}
              placeholder="이름 또는 이메일로 검색"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex w-full items-center gap-3">
          <Button
            variant="solid"
            color="assistive"
            size="medium"
            fullWidth
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="solid"
            color="primary"
            size="medium"
            fullWidth
            onClick={handleCreate}
            sx={{
              backgroundColor: 'var(--color-primary-40) !important',
              color: 'var(--color-static-white) !important',
              '&:hover, &:focus-visible': {
                backgroundColor:
                  'color-mix(in srgb, var(--color-primary-40) 88%, black) !important',
              },
              '&:active': {
                backgroundColor:
                  'color-mix(in srgb, var(--color-primary-40) 78%, black) !important',
              },
            }}
          >
            회의 생성
          </Button>
        </div>
      </div>
    </div>
  );
};

MeetingCreateModalContent.displayName = 'MeetingCreateModalContent';
