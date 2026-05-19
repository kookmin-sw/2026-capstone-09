'use client';

import { Button } from '@wanteddev/wds';
import { useState } from 'react';

import { useModal } from '@/components/commons/modal/ModalContext';
import {
  MeetingCreateModalContent,
  type MeetingCreatePayload,
} from '@/components/projects/node-flow/MeetingCreateModalContent';
import type { ParticipantOption } from '@/components/projects/node-flow/ParticipantsSelect';
import {
  EXAMPLE_MEETING_CREATE_NODE,
  EXAMPLE_MEETING_PARTICIPANTS,
} from '@/constants/exampleConstant';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useCreateMeetingMutation } from '@/queries/meeting';
import { useProjectMembersQuery } from '@/queries/member';

const TEST_PROJECT_ID = 1;

export default function MeetingModalTestPage() {
  const { openModal, closeModal } = useModal();
  const showErrorToast = useErrorToast();
  const [lastPayload, setLastPayload] = useState<MeetingCreatePayload | null>(null);

  const { data: membersData = [] } = useProjectMembersQuery(TEST_PROJECT_ID);
  const createMeetingMutation = useCreateMeetingMutation(
    TEST_PROJECT_ID,
    EXAMPLE_MEETING_CREATE_NODE.id,
  );

  const handleCreate = async (payload: MeetingCreatePayload) => {
    try {
      await createMeetingMutation.mutateAsync(payload);
      setLastPayload(payload);
      closeModal();
    } catch (err) {
      showErrorToast(err, '회의 생성에 실패했어요.');
    }
  };

  const openModalWith = (participantOptions: readonly ParticipantOption[]) => {
    openModal({
      variant: 'default',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <MeetingCreateModalContent
          nodeBadge={EXAMPLE_MEETING_CREATE_NODE.badge}
          nodeTitle={EXAMPLE_MEETING_CREATE_NODE.title}
          participantOptions={participantOptions}
          onClose={closeModal}
          onCreate={handleCreate}
        />
      ),
    });
  };

  const handleOpenWithApi = () => {
    const participantOptions: ParticipantOption[] = membersData.map((member) => ({
      id: member.userId ?? 0,
      name: member.nickname ?? '',
      email: member.email,
    }));
    openModalWith(participantOptions);
  };

  const handleOpenWithMock = () => {
    openModalWith(EXAMPLE_MEETING_PARTICIPANTS);
  };

  return (
    <main className="bg-background-normal-normal flex min-h-screen items-center justify-center p-10">
      <section className="flex w-full max-w-160 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-1 text-label-normal font-medium">회의 생성 모달 테스트</h1>
        </div>

        <div className="flex flex-col items-start gap-3">
          <Button variant="solid" color="primary" size="medium" onClick={handleOpenWithApi}>
            회의 생성 모달 열기 (API 연결)
          </Button>
          <Button variant="solid" color="assistive" size="medium" onClick={handleOpenWithMock}>
            회의 생성 모달 열기 (예시 목 데이터)
          </Button>
        </div>

        {lastPayload && (
          <div className="border-line-normal-neutral bg-static-white flex flex-col gap-3 rounded-xl border p-5">
            <h2 className="text-heading-2 text-label-normal font-medium">마지막 입력값</h2>
            <pre className="text-body-2 text-label-neutral overflow-auto whitespace-pre-wrap">
              {JSON.stringify(lastPayload, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}
