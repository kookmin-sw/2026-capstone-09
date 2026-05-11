'use client';

import { Button } from '@wanteddev/wds';
import { useState } from 'react';

import { privateApi } from '@/api';
import { useModal } from '@/components/commons/modal/ModalContext';
import {
  MeetingCreateModalContent,
  type MeetingCreatePayload,
} from '@/components/projects/node-flow/MeetingCreateModalContent';
import { EXAMPLE_MEETING_CREATE_NODE } from '@/constants/exampleConstant';
import { useErrorToast } from '@/hooks/useErrorToast';

const TEST_PROJECT_ID = 1;

export default function MeetingModalTestPage() {
  const { openModal, closeModal } = useModal();
  const showErrorToast = useErrorToast();
  const [lastPayload, setLastPayload] = useState<MeetingCreatePayload | null>(null);

  const handleCreate = async (payload: MeetingCreatePayload) => {
    try {
      await privateApi.meeting.createMeeting(
        TEST_PROJECT_ID,
        EXAMPLE_MEETING_CREATE_NODE.id,
        payload,
      );
      setLastPayload(payload);
      closeModal();
    } catch (err) {
      showErrorToast(err, '회의 생성에 실패했어요.');
    }
  };

  const handleOpenClick = () => {
    openModal({
      variant: 'default',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <MeetingCreateModalContent
          nodeBadge={EXAMPLE_MEETING_CREATE_NODE.badge}
          nodeTitle={EXAMPLE_MEETING_CREATE_NODE.title}
          onClose={closeModal}
          onCreate={handleCreate}
        />
      ),
    });
  };

  return (
    <main className="bg-background-normal-normal flex min-h-screen items-center justify-center p-10">
      <section className="flex w-full max-w-160 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-1 text-label-normal font-medium">회의 생성 모달 테스트</h1>
        </div>

        <div>
          <Button variant="solid" color="primary" size="medium" onClick={handleOpenClick}>
            회의 생성 모달 열기
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
