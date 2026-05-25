'use client';

import type { DateType } from '@wanteddev/wds';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { CreateMeetingRequest } from '@/api/Api';
import type { ParticipantOption } from '@/components/projects/node-flow/ParticipantsSelect';

export interface MeetingCreateFormValues {
  date: DateType;
  time: DateType;
  isPushEnabled: boolean;
  participants: ParticipantOption[];
}

const toDate = (value: DateType): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const pad2 = (value: number): string => String(value).padStart(2, '0');

const formatDateTime = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(
    date.getHours(),
  )}:${pad2(date.getMinutes())}:00`;

const createStartedAt = (date: Date, time: Date): Date =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    0,
    0,
  );

export const useMeetingCreateForm = () => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const form = useForm<MeetingCreateFormValues>({
    defaultValues: {
      date: null,
      time: null,
      isPushEnabled: true,
      participants: [],
    },
    mode: 'onChange',
  });

  const buildPayload = (values: MeetingCreateFormValues): CreateMeetingRequest => {
    const date = toDate(values.date);
    const time = toDate(values.time);
    if (!date || !time) throw new Error('날짜와 시간을 선택해 주세요.');

    return {
      startedAt: formatDateTime(createStartedAt(date, time)),
      isPushEnabled: values.isPushEnabled,
      participantUserIds: values.participants.map((participant) => participant.id),
    };
  };

  return {
    form,
    isDateOpen,
    setIsDateOpen,
    isTimeOpen,
    setIsTimeOpen,
    buildPayload,
  };
};
