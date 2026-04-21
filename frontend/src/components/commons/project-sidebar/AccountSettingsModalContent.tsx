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
import type { ReactNode } from 'react';

import { useAccountSettings } from '@/hooks/useAccountSettings';
import { useProfileImagePreview } from '@/hooks/useProfileImagePreview';
import { iconButtonNoHoverSx, textFieldPrimaryFocusSx } from '@/styles/sx';

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
  const {
    name,
    setName,
    email,
    setEmail,
    isEditingEmail,
    verificationCode,
    setVerificationCode,
    isVerified,
    handleStartEditEmail,
    handleRequestVerification,
    handleChangeEmail,
    handleCloseClick,
    handleLogoutClick,
    handleWithdrawClick,
  } = useAccountSettings({
    initialName: userName,
    initialEmail: userEmail,
    onCloseModal: onClose,
  });
  const { previewUrl: profilePreviewUrl, handleImageChange: handleProfileImageChange } =
    useProfileImagePreview();

  // 동일한 TextField에 편집 모드/읽기 모드 따라 trailing만 바꾼다.
  // 읽기 모드에서는 readOnly 처리하여 "수정 버튼"을 눌러야만 편집이 가능하다.
  const emailTrailing: ReactNode = isEditingEmail ? (
    <TextFieldButton
      variant="normal"
      onClick={handleRequestVerification}
      aria-label="이메일 인증 요청"
    >
      인증하기
    </TextFieldButton>
  ) : (
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
  );

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
              {/* 편집 모드일 때만 입력이 가능하도록 readOnly로 잠근다.
                  trailing 영역만 "수정 버튼" <-> "인증하기 버튼"으로 교체된다. */}
              <TextField
                id="account-settings-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                readOnly={!isEditingEmail}
                width="100%"
                sx={textFieldPrimaryFocusSx}
                {...(isEditingEmail
                  ? { trailingButton: emailTrailing }
                  : { trailingContent: emailTrailing })}
              />
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
