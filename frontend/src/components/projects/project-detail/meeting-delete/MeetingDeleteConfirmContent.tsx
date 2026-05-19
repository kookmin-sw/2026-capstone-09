'use client';

interface MeetingDeleteConfirmContentProps {
  /**
   * "회의 삭제" 버튼을 눌렀을 때 호출.
   * 실제 삭제 API 호출은 본 컴포넌트에서 하지 않고 부모(`useProjectDetailActions` 등)에서 처리한다.
   */
  onConfirm: () => void;
  /** "취소" 버튼을 눌렀을 때 호출. 보통 `closeDialog`를 그대로 넘긴다. */
  onCancel: () => void;
}

/**
 * 회의 삭제 컨펌 다이얼로그 콘텐츠.
 *
 * - 디자인: title + description + 우하단 [회의 삭제, 취소] 두 텍스트 버튼.
 * - 백드롭/ESC/외부 클릭 닫힘은 공통 다이얼로그(`useDialog` + `commons/custom-dialog`)에 위임.
 * - 입력값이 없는 단순 컨펌이라 폼 훅은 분리하지 않는다.
 * - WDS Button/TextButton의 color prop이 negative 톤을 지원하지 않아
 *   부정 액션은 native `<button>` + 디자인 토큰 클래스로 처리한다.
 *   (`color-mix` / `!important` 로 WDS 내부 스타일을 덮어쓰지 않는 본 프로젝트 컨벤션 준수)
 */
export const MeetingDeleteConfirmContent = ({
  onConfirm,
  onCancel,
}: MeetingDeleteConfirmContentProps) => {
  const handleConfirmClick = () => {
    // TODO: privateApi.meeting.deleteMeeting(projectId, meetingId) 생성 후 부모 핸들러에 연결.
    //       현재 Swagger 스펙에 회의 삭제 메서드가 추가돼 있지 않아, 본 컴포넌트는 콜백만 위임한다.
    //       실제 삭제 응답은 표준 envelope `{ status, code, message, data: null }` 형태 가정.
    onConfirm();
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-headline-1 text-label-normal font-semibold">회의 삭제</h3>
        <p className="text-body-2 text-label-alternative">회의를 삭제하시겠어요?</p>
      </div>

      <div className="flex items-center justify-end gap-6">
        <button
          type="button"
          onClick={handleConfirmClick}
          className="text-body-1 text-status-negative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          회의 삭제
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-body-1 text-label-alternative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          취소
        </button>
      </div>
    </div>
  );
};

MeetingDeleteConfirmContent.displayName = 'MeetingDeleteConfirmContent';
