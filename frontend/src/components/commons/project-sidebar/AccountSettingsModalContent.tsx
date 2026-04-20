'use client';

import {
  Avatar,
  Button,
  IconButton,
  TextButton,
  TextField,
  TextFieldButton,
  TextFieldContent,
} from '@wanteddev/wds';
import { IconCircleCheckFill, IconClose, IconPencil } from '@wanteddev/wds-icon';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';

import { ConfirmDialogContent } from './ConfirmDialogContent';

// WDS TextField 포커스 테두리·캐럿 색을 FlowMeet Primary 토큰으로 스코프드 오버라이드
const textFieldPrimaryFocusSx = {
  '&:has(input:focus) [data-role="text-field-wrapper"]': {
    boxShadow:
      'inset 0 0 0 2px color-mix(in srgb, var(--color-primary-40) 43%, transparent) !important',
  },
  '[data-role="text-field-wrapper"] input': {
    caretColor: 'var(--color-primary-40)',
  },
} as const;

// WDS IconButton hover 시 배경 변화 제거
const iconButtonNoHoverSx = {
  '&:hover, &:focus-visible, &:active': {
    backgroundColor: 'transparent !important',
  },
} as const;

interface AccountSettingsModalContentProps {
  userName: string;
  userEmail: string;
  onClose: () => void;
}

export const AccountSettingsModalContent = ({
  userName,
  userEmail,
  onClose,
}: AccountSettingsModalContentProps) => {
  const { openDialog, closeDialog } = useDialog();
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | undefined>(undefined);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleStartEditEmail = () => {
    setIsEditingEmail(true);
    setVerificationCode('');
    setIsVerified(false);
  };

  // 데모 동작: 실제 인증 응답 대신 즉시 인증 성공으로 표시
  const handleRequestVerification = () => {
    setIsVerified(true);
  };

  const handleChangeEmail = () => {
    setIsEditingEmail(false);
  };

  const handleCloseClick = () => {
    if (!isEditingEmail) {
      onClose();
      return;
    }
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ConfirmDialogContent
          title="이메일 수정이 완료되지 않았어요"
          description={'지금 나가면 입력한 내용이 저장되지 않을 수 있습니다.\n계속 등록하시겠어요?'}
          leftButton={{
            label: '취소하기',
            tone: 'assistive',
            onClick: () => {
              closeDialog();
              setIsEditingEmail(false);
              setVerificationCode('');
              setIsVerified(false);
              onClose();
            },
          }}
          rightButton={{
            label: '계속하기',
            tone: 'primary',
            onClick: closeDialog,
          }}
        />
      ),
    });
  };

  const handleLogoutClick = () => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ConfirmDialogContent
          title="로그아웃"
          description="현재 계정에서 로그아웃할까요?"
          leftButton={{
            label: '로그아웃',
            tone: 'assistive',
            onClick: () => {
              closeDialog();
              onClose();
            },
          }}
          rightButton={{
            label: '취소',
            tone: 'primary',
            onClick: closeDialog,
          }}
        />
      ),
    });
  };

  const handleWithdrawClick = () => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ConfirmDialogContent
          title="계정 탈퇴"
          description={'정말로 계정을 탈퇴할까요?\n* 한 번 계정을 탈퇴하시면 복구가 불가능해요!'}
          leftButton={{
            label: '계정 삭제',
            tone: 'negative',
            onClick: () => {
              closeDialog();
              onClose();
            },
          }}
          rightButton={{
            label: '취소',
            tone: 'assistive',
            onClick: closeDialog,
          }}
        />
      ),
    });
  };

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setProfilePreviewUrl(url);
    // 동일 파일 재선택도 허용
    event.target.value = '';
  };

  return (
    <div className="flex w-full flex-col gap-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-heading-1 text-label-normal font-medium">계정 설정</h2>
        <button
          type="button"
          onClick={handleCloseClick}
          aria-label="닫기"
          className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0"
        >
          <IconClose className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex w-full flex-col gap-12">
        <div className="flex w-full flex-col gap-6">
          {/* 프로필 + 이름 */}
          <div className="flex items-center gap-6">
            <label
              htmlFor="account-settings-profile-image"
              aria-label="프로필 사진 변경"
              className="group relative inline-flex cursor-pointer overflow-hidden rounded-full"
            >
              <Avatar variant="person" size={84} src={profilePreviewUrl} alt={name} />
              <span
                aria-hidden="true"
                className="bg-label-normal/0 group-hover:bg-label-normal/20 pointer-events-none absolute inset-0 rounded-full transition-colors duration-150"
              />
              <input
                id="account-settings-profile-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleProfileImageChange}
              />
            </label>

            <div className="flex max-w-84 min-w-0 flex-1 flex-col gap-2">
              <label
                htmlFor="account-settings-name"
                className="text-label-1 text-label-neutral font-semibold"
              >
                이름
              </label>
              <TextField
                id="account-settings-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                width="100%"
                sx={textFieldPrimaryFocusSx}
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="account-settings-email"
                className="text-label-1 text-label-neutral font-semibold"
              >
                이메일
              </label>
              {isEditingEmail ? (
                <TextField
                  id="account-settings-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  width="100%"
                  sx={textFieldPrimaryFocusSx}
                  trailingButton={
                    <TextFieldButton
                      variant="normal"
                      onClick={handleRequestVerification}
                      aria-label="이메일 인증 요청"
                    >
                      인증하기
                    </TextFieldButton>
                  }
                />
              ) : (
                <TextField
                  id="account-settings-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  width="100%"
                  sx={textFieldPrimaryFocusSx}
                  trailingContent={
                    <TextFieldContent variant="icon-button">
                      <IconButton
                        variant="normal"
                        onClick={handleStartEditEmail}
                        aria-label="이메일 수정"
                        sx={iconButtonNoHoverSx}
                      >
                        <IconPencil />
                      </IconButton>
                    </TextFieldContent>
                  }
                />
              )}
            </div>

            {/* 편집 모드: 인증번호 입력 + 변경 버튼 */}
            {isEditingEmail && (
              <div className="flex w-full flex-col gap-6">
                <div className="flex w-full flex-col gap-2">
                  <TextField
                    id="account-settings-verification-code"
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    width="100%"
                    placeholder="인증번호 입력"
                    sx={textFieldPrimaryFocusSx}
                    trailingContent={
                      isVerified ? (
                        <TextFieldContent variant="icon">
                          <IconCircleCheckFill
                            className="text-primary-40 h-5 w-5"
                            aria-hidden="true"
                          />
                        </TextFieldContent>
                      ) : undefined
                    }
                  />
                  {isVerified && (
                    <p className="text-caption-2 text-label-alternative">인증에 성공했어요.</p>
                  )}
                </div>

                <Button
                  variant="solid"
                  color="primary"
                  size="medium"
                  fullWidth
                  onClick={handleChangeEmail}
                  disabled={!isVerified}
                >
                  이메일 변경하기
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 하단 링크 row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TextButton color="assistive" size="small">
              서비스 이용 약관
            </TextButton>
            <div className="bg-label-alternative h-3 w-px" aria-hidden="true" />
            <TextButton color="assistive" size="small">
              개인정보처리방침
            </TextButton>
          </div>
          <div className="flex items-center gap-2">
            <TextButton color="assistive" size="small" onClick={handleLogoutClick}>
              로그아웃
            </TextButton>
            <div className="bg-label-alternative h-3 w-px" aria-hidden="true" />
            <TextButton color="assistive" size="small" onClick={handleWithdrawClick}>
              계정 탈퇴
            </TextButton>
          </div>
        </div>
      </div>
    </div>
  );
};

AccountSettingsModalContent.displayName = 'AccountSettingsModalContent';
