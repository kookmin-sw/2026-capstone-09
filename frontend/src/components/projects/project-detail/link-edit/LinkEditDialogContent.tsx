'use client';

import { TextField } from '@wanteddev/wds';

import { cn } from '@/utils/cn';

import {
  type LinkEditMode,
  type LinkEditPayload,
  useLinkEditForm,
} from './useLinkEditForm';

interface LinkEditDialogContentProps {
  /** 'add'면 추가 다이얼로그, 'edit'면 수정 다이얼로그. 기본 'edit'. */
  mode?: LinkEditMode;
  /** 'edit' 모드에서 기존 URL 값. 'add' 모드에선 무시된다. */
  initialUrl?: string;
  /** 'edit' 모드에서 기존 사용자 라벨. 'add' 모드에선 무시된다. */
  initialName?: string;
  /** 저장 버튼을 눌렀을 때 호출. payload는 정규화된 URL과 입력 라벨을 담은 `{ url, name }` 형태. */
  onSave: (payload: LinkEditPayload) => void;
  /** 'edit' 모드에서 좌측 "삭제" 버튼을 눌렀을 때 호출. add 모드에선 노출하지 않음. */
  onDelete?: () => void;
  /** "취소" 버튼 또는 외부에서 닫을 때 호출. 보통 `closeDialog`를 그대로 넘긴다. */
  onClose: () => void;
}

/**
 * 링크 추가/수정 다이얼로그 콘텐츠.
 *
 * - 백드롭/ESC/외부 클릭 닫힘은 공통 다이얼로그(`useDialog` + `commons/custom-dialog`)에 위임.
 * - 폼 상태·검증·payload 생성은 `useLinkEditForm` 훅에 분리.
 * - 백엔드 `ProjectUrlRequest`가 `{ name, url }`을 받으므로 payload의 두 필드 모두 그대로 API에 전달된다.
 * - WDS Button/TextButton의 color prop이 negative 톤을 지원하지 않아, "삭제" / "저장" /
 *   "취소"는 native `<button>` + 디자인 토큰 클래스로 처리한다 (`color-mix`/`!important`로
 *   WDS 내부 스타일을 덮어쓰지 않는 본 프로젝트 컨벤션 준수).
 */
export const LinkEditDialogContent = ({
  mode = 'edit',
  initialUrl,
  initialName,
  onSave,
  onDelete,
  onClose,
}: LinkEditDialogContentProps) => {
  const isAddMode = mode === 'add';
  const { url, setUrl, name, setName, isUrlInvalid, canSave, buildPayload } = useLinkEditForm({
    mode,
    initialUrl,
    initialName,
  });

  const handleSaveClick = () => {
    if (!canSave) return;
    onSave(buildPayload());
  };

  return (
    <div className="flex w-90 flex-col gap-4 pb-2">
      <h3 className="text-headline-1 text-label-normal font-semibold">
        {isAddMode ? '링크 추가' : '링크 수정'}
      </h3>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="link-edit-name"
          className="text-caption-1 text-label-neutral font-semibold"
        >
          이름
        </label>
        <TextField
          id="link-edit-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="이름을 입력해 주세요."
          width="100%"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="link-edit-url" className="text-caption-1 text-label-neutral font-semibold">
          URL
        </label>
        <TextField
          id="link-edit-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          width="100%"
          invalid={isUrlInvalid}
        />
      </div>

      <div
        className={cn(
          'flex items-center gap-6 pt-2',
          !isAddMode && onDelete ? 'justify-between' : 'justify-end',
        )}
      >
        {!isAddMode && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-body-1 text-status-negative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            삭제
          </button>
        )}

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onClose}
            className="text-body-1 text-label-alternative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={handleSaveClick}
            className={cn(
              'text-body-1 rounded-md px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2',
              'focus-visible:ring-primary-40',
              canSave
                ? 'text-primary-40 hover:bg-fill-normal active:bg-fill-strong bg-transparent'
                : 'text-label-disable cursor-not-allowed bg-transparent',
            )}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

LinkEditDialogContent.displayName = 'LinkEditDialogContent';
