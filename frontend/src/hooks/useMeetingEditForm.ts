'use client';

import type { DateType } from '@wanteddev/wds';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { UpdateMeetingRequest } from '@/api/Api';
import type { ParticipantOption } from '@/components/projects/node-flow/ParticipantsSelect';

export interface MeetingEditFormValues {
  date: DateType;
  time: DateType;
  isPushEnabled: boolean;
  participants: ParticipantOption[];
}

export interface MeetingEditInitialValues {
  startedAt?: string;
  isPushEnabled?: boolean;
  participants?: { userId?: number; nickname?: string; email?: string }[];
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

const parseInitialDateTime = (
  startedAt?: string,
): { date: DateType; time: DateType } => {
  if (!startedAt) return { date: null, time: null };
  const parsed = new Date(startedAt);
  if (Number.isNaN(parsed.getTime())) return { date: null, time: null };
  return { date: parsed, time: parsed };
};

export const useMeetingEditForm = (initial?: MeetingEditInitialValues) => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const { date, time } = parseInitialDateTime(initial?.startedAt);

  const initialParticipants: ParticipantOption[] = (initial?.participants ?? [])
    .filter((p): p is { userId: number; nickname?: string; email?: string } => !!p.userId)
    .map((p) => ({
      id: p.userId,
      name: p.nickname ?? '',
      email: p.email ?? '',
    }));

  const form = useForm<MeetingEditFormValues>({
    defaultValues: {
      date,
      time,
      isPushEnabled: initial?.isPushEnabled ?? true,
      participants: initialParticipants,
    },
    mode: 'onChange',
  });

  const buildPayload = (values: MeetingEditFormValues): UpdateMeetingRequest => {
    const dateVal = toDate(values.date);
    const timeVal = toDate(values.time);
    if (!dateVal || !timeVal) throw new Error('날짜와 시간을 선택해 주세요.');

    return {
      startedAt: formatDateTime(createStartedAt(dateVal, timeVal)),
      isPushEnabled: values.isPushEnabled,
      participantUserIds: values.participants.map((p) => p.id),
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
