'use client';

import {
  Button,
  Checkbox,
  ContentBadge,
  DatePicker,
  TextField,
  TextFieldContent,
  TimePicker,
} from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';
import { Controller } from 'react-hook-form';

import type { UpdateMeetingRequest } from '@/api/Api';
import {
  useMeetingEditForm,
  type MeetingEditInitialValues,
} from '@/hooks/useMeetingEditForm';

import { ParticipantsSelect, type ParticipantOption } from './ParticipantsSelect';

export type MeetingEditPayload = UpdateMeetingRequest;

interface MeetingEditModalContentProps {
  nodeBadge: string;
  nodeTitle: string;
  participantOptions: readonly ParticipantOption[];
  initialValues?: MeetingEditInitialValues;
  onClose: () => void;
  onEdit?: (payload: MeetingEditPayload) => void;
}

export const MeetingEditModalContent = ({
  nodeBadge,
  nodeTitle,
  participantOptions,
  initialValues,
  onClose,
  onEdit,
}: MeetingEditModalContentProps) => {
  const { form, isDateOpen, setIsDateOpen, isTimeOpen, setIsTimeOpen, buildPayload } =
    useMeetingEditForm(initialValues);
  const {
    control,
    formState: { isSubmitting, isValid },
    handleSubmit,
  } = form;

  const handleEdit = handleSubmit((values) => {
    onEdit?.(buildPayload(values));
  });

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={handleEdit}>
      <div className="flex items-center justify-between">
        <h2 className="text-heading-1 text-label-normal font-medium">회의 수정</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0"
        >
          <IconClose className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="meeting-edit-node"
              className="text-label-1 text-label-neutral font-semibold"
            >
              회의를 진행할 노드
            </label>
            <TextField
              id="meeting-edit-node"
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

          <div className="flex w-full items-start gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-label-1 text-label-neutral font-semibold">날짜</span>
              <Controller
                control={control}
                name="date"
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    format="YYYY-MM-DD"
                    placeholder="날짜 선택"
                    width="100%"
                    locale="ko"
                    open={isDateOpen}
                    onOpenChange={setIsDateOpen}
                    onClick={() => setIsDateOpen(true)}
                    contentProps={{ sx: { zIndex: 10000 } }}
                  />
                )}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-label-1 text-label-neutral font-semibold">시간</span>
              <Controller
                control={control}
                name="time"
                rules={{ required: true }}
                render={({ field }) => (
                  <TimePicker
                    value={field.value}
                    onChange={field.onChange}
                    format="HH:mm"
                    placeholder="시간 선택"
                    width="100%"
                    open={isTimeOpen}
                    onOpenChange={setIsTimeOpen}
                    onClick={() => setIsTimeOpen(true)}
                    contentProps={{ sx: { zIndex: 10000 } }}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <span className="text-label-1 text-label-neutral font-semibold">참여자</span>
            <Controller
              control={control}
              name="participants"
              rules={{ validate: (participants) => participants.length > 0 }}
              render={({ field }) => (
                <ParticipantsSelect
                  options={participantOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="이름 또는 이메일로 검색"
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="isPushEnabled"
            render={({ field }) => (
              <label className="flex w-fit cursor-pointer items-start gap-2">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} size="medium" />
                <span className="text-label-1 text-label-neutral pt-px font-medium">
                  참여자에게 회의 알림 보내기
                </span>
              </label>
            )}
          />
        </div>

        <div className="flex w-full items-center gap-3">
          <Button
            type="button"
            variant="solid"
            color="assistive"
            size="medium"
            fullWidth
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="solid"
            color="primary"
            size="medium"
            fullWidth
            disabled={isSubmitting || !isValid}
          >
            회의 수정
          </Button>
        </div>
      </div>
    </form>
  );
};

MeetingEditModalContent.displayName = 'MeetingEditModalContent';
