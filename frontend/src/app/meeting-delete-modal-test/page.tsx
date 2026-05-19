'use client';

import { useState } from 'react';

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { MeetingDeleteConfirmContent } from '@/components/projects/project-detail/meeting-delete';
import { EXAMPLE_MEETING_DELETE_TEST } from '@/constants/exampleConstant';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useDeleteMeetingMutation } from '@/queries/meetingDelete';
import { cn } from '@/utils/cn';

/**
 * 회의 삭제 컨펌 다이얼로그 동작 확인용 임시 페이지.
 *
 * - 실제 노드 상세/회의 메뉴에는 연결하지 않는다 (4대 핵심 모달이 아니므로
 *   별도 테스트 페이지에서만 띄우도록 한다).
 * - 공통 다이얼로그(`useDialog`) 위에 도메인 컴포넌트(`MeetingDeleteConfirmContent`)를
 *   올려 백드롭/ESC/외부 클릭 닫힘은 공통 컴포넌트에 위임한다.
 */
const MeetingDeleteModalTestPage = () => {
  const { openDialog, closeDialog } = useDialog();
  const showErrorToast = useErrorToast();
  const [lastResult, setLastResult] = useState<{
    projectId: number;
    nodeId: number;
    meetingId: number;
    title: string;
  } | null>(null);

  const { mutateAsync: deleteMeeting } = useDeleteMeetingMutation(
    EXAMPLE_MEETING_DELETE_TEST.projectId,
  );

  const handleOpenDialog = (meeting: { nodeId: number; meetingId: number; title: string }) => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <MeetingDeleteConfirmContent
          onConfirm={async () => {
            try {
              await deleteMeeting({ nodeId: meeting.nodeId, meetingId: meeting.meetingId });
              setLastResult({
                projectId: EXAMPLE_MEETING_DELETE_TEST.projectId,
                nodeId: meeting.nodeId,
                meetingId: meeting.meetingId,
                title: meeting.title,
              });
              closeDialog();
            } catch (err) {
              showErrorToast(err, '회의 삭제에 실패했어요.');
            }
          }}
          onCancel={closeDialog}
        />
      ),
    });
  };

  return (
    <main className="bg-background-normal-normal min-h-screen w-full px-6 py-10">
      <div className="mx-auto flex w-full max-w-160 flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-heading-1 text-label-normal font-semibold">
            회의 삭제 모달 테스트
          </h1>
          <p className="text-body-2 text-label-alternative">
            아래 회의 카드 중 하나를 눌러 컨펌 다이얼로그가 정상적으로 열리는지 확인합니다. ‘회의
            삭제’를 누르면 호출 정보가 화면 하단에 표시됩니다.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          {EXAMPLE_MEETING_DELETE_TEST.candidates.map((meeting) => (
            <button
              key={meeting.meetingId}
              type="button"
              onClick={() => handleOpenDialog(meeting)}
              className={cn(
                'border-line-normal-normal bg-background-elevated-normal flex flex-col gap-1 rounded-xl border p-4 text-left',
                'hover:border-line-normal-strong hover:shadow-sm',
                'focus-visible:border-primary-40 outline-none',
              )}
            >
              <span className="text-caption-1 text-label-alternative">#{meeting.meetingId}</span>
              <span className="text-body-1 text-label-normal font-medium">{meeting.title}</span>
            </button>
          ))}
        </section>

        <section
          className="border-line-normal-neutral bg-background-normal-alternative flex flex-col gap-2 rounded-xl border p-4"
          aria-live="polite"
        >
          <h2 className="text-label-1 text-label-strong font-medium">최근 제출 결과</h2>
          {lastResult ? (
            <pre className="text-caption-1 text-label-neutral whitespace-pre-wrap break-all">
              {JSON.stringify(lastResult, null, 2)}
            </pre>
          ) : (
            <p className="text-caption-1 text-label-alternative">
              아직 회의 삭제 컨펌이 실행되지 않았어요.
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default MeetingDeleteModalTestPage;
