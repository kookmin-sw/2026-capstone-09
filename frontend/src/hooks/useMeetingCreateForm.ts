'use client';

import { type DateType } from '@wanteddev/wds';
import { useMemo, useState } from 'react';

import { type ParticipantOption } from '@/components/projects/project-detail/ParticipantsSelect';
import { EXAMPLE_PROJECT_MEMBERS } from '@/constants/exampleConstant';
import { formatDateToHHmm, formatDateToYYYYMMDD } from '@/utils/formatDate';

/**
 * 회의 생성 모달 내부 폼 상태를 한곳에서 관리한다.
 * 날짜·시간 picker의 open 상태, 참여자 선택, 참여자 옵션까지 묶어 노출해
 * 모달 컴포넌트는 JSX와 이벤트 연결에만 집중할 수 있도록 한다.
 */
export const useMeetingCreateForm = () => {
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

  const buildPayload = () => ({
    date: formatDateToYYYYMMDD(date),
    time: formatDateToHHmm(time),
    participants: participants.map((item) => item.name),
  });

  return {
    date,
    setDate,
    time,
    setTime,
    isDateOpen,
    setIsDateOpen,
    isTimeOpen,
    setIsTimeOpen,
    participants,
    setParticipants,
    participantOptions,
    buildPayload,
  };
};
