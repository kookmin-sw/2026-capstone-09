'use client';

import { Avatar, Button, IconButton, TextField, TextFieldButton, TextFieldContent } from '@wanteddev/wds';
import { IconCircleCheckFill, IconClose, IconPencil } from '@wanteddev/wds-icon';
import { useRouter } from 'next/navigation';

import { privateApi } from '@/api';
import { authStorage } from '@/api/authStorage';
import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';

import { AccountLogoutConfirmContent } from './AccountLogoutConfirmContent';
import { AccountWithdrawConfirmContent } from './AccountWithdrawConfirmContent';
import { useAccountSettingsForm } from './useAccountSettingsForm';
import { useEmailEditForm } from './useEmailEditForm';

interface AccountSettingsModalContentProps {
  onClose: () => void;
}

/**
 * 계정 설정 모달 콘텐츠 (디자인 시안 기반).
 *
 * 기본 상태(보조 이메일 있는 경우):
 * - 헤더 + 닫기 + 프로필 + 이름 input + 이메일 readonly + 우측 연필(IconButton).
 *
 * 이메일 편집 상태(연필 클릭 시):
 * - 이메일 input + 우측 "인증하기" TextFieldButton.
 * - 인증번호 input + 인증 성공 시 IconCircleCheckFill + "인증에 성공했어요." 캡션.
 * - 하단 Primary Solid "이메일 변경하기" 버튼.
 *
 * - 닉네임은 1초 debounce 자동 저장(`updateMe`) — `useAccountSettingsForm` 훅 분리.
 * - 이메일 편집/인증/변경은 `useEmailEditForm` 훅 분리. 인증 API 미구현 → 클라이언트 fake.
 * - 로그아웃: `authStorage.clear()` + `/auth/login`.
 * - 회원 탈퇴: 닉네임 정확 입력 컨펌 → `deleteMe` → `authStorage.clear()` + `/auth/login`.
 */
export const AccountSettingsModalContent = ({ onClose }: AccountSettingsModalContentProps) => {
  const router = useRouter();
  const { openDialog, closeDialog } = useDialog();
  const toast = usePositionedToast();

  const { info, setInfoEmail, nickname, setNickname, nicknameMaxLength } = useAccountSettingsForm({
    onSaveSuccess: () => {
      toast({
        content: '닉네임을 수정했어요',
        variant: 'normal',
        placement: 'bottom-left',
        duration: 'short',
      });
    },
  });

  const emailForm = useEmailEditForm({
    nickname,
    onChanged: (nextEmail) => {
      setInfoEmail(nextEmail);
      toast({
        content: '이메일을 변경했어요',
        variant: 'normal',
        placement: 'bottom-left',
        duration: 'short',
      });
    },
  });

  const handleLogoutClick = () => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <AccountLogoutConfirmContent
          onConfirm={() => {
            authStorage.clear();
            closeDialog();
            onClose();
            router.push('/auth/login');
            toast({
              content: '로그아웃했어요',
              variant: 'normal',
              placement: 'bottom-left',
              duration: 'short',
            });
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  const handleWithdrawClick = () => {
    if (!info) return;
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <AccountWithdrawConfirmContent
          nickname={info.nickname}
          onConfirm={async () => {
            try {
              await privateApi.user.deleteMe();
              authStorage.clear();
              closeDialog();
              onClose();
              router.push('/auth/login');
              toast({
                content: '계정을 탈퇴했어요',
                variant: 'normal',
                placement: 'bottom-left',
                duration: 'short',
              });
            } catch (caught) {
              console.error('회원 탈퇴에 실패했어요.', caught);
            }
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  return (
    <div className="flex w-full flex-col gap-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-heading-1 text-label-normal font-medium">계정 설정</h2>
        <button
          type="button"
          onClick={onClose}
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
          <div className="flex items-center gap-8">
            <Avatar
              variant="person"
              size={84}
              src={info?.profileImageUrl}
              alt={info?.nickname ?? '프로필'}
            />
            <div className="flex w-84 min-w-0 flex-col gap-2">
              <label
                htmlFor="account-settings-nickname"
                className="text-label-1 text-label-neutral font-semibold"
              >
                이름
              </label>
              <TextField
                id="account-settings-nickname"
                value={nickname}
                maxLength={nicknameMaxLength}
                onChange={(event) => setNickname(event.target.value)}
                width="100%"
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
              {emailForm.isEditing ? (
                <TextField
                  id="account-settings-email"
                  type="email"
                  value={emailForm.email}
                  onChange={(event) => emailForm.setEmail(event.target.value)}
                  width="100%"
                  invalid={emailForm.isEmailInvalid}
                  trailingButton={
                    <TextFieldButton
                      variant="normal"
                      onClick={emailForm.requestVerification}
                      disabled={!emailForm.canRequestVerification}
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
                  value={info?.email ?? ''}
                  readOnly
                  width="100%"
                  trailingContent={
                    <TextFieldContent variant="icon-button">
                      <IconButton
                        variant="normal"
                        onClick={() => emailForm.startEdit(info?.email ?? '')}
                        aria-label="이메일 수정"
                      >
                        <IconPencil />
                      </IconButton>
                    </TextFieldContent>
                  }
                />
              )}
            </div>

            {/* 편집 모드: 인증번호 + 변경 버튼 */}
            {emailForm.isEditing && (
              <div className="flex w-full flex-col gap-6">
                <div className="flex w-full flex-col gap-2">
                  <TextField
                    id="account-settings-verification-code"
                    value={emailForm.verificationCode}
                    onChange={(event) => emailForm.setVerificationCode(event.target.value)}
                    width="100%"
                    placeholder="인증번호 입력"
                    trailingContent={
                      emailForm.isVerified ? (
                        <TextFieldContent variant="icon">
                          <IconCircleCheckFill
                            className="text-primary-40 h-5 w-5"
                            aria-hidden="true"
                          />
                        </TextFieldContent>
                      ) : undefined
                    }
                  />
                  {emailForm.isVerified && (
                    <p className="text-caption-1 text-label-alternative">인증에 성공했어요.</p>
                  )}
                </div>

                <Button
                  variant="solid"
                  color="primary"
                  size="medium"
                  fullWidth
                  onClick={() => void emailForm.applyChange()}
                  disabled={!emailForm.canApplyChange}
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
            <button
              type="button"
              className="text-label-2 text-label-alternative hover:text-label-neutral focus-visible:ring-primary-40 rounded-md bg-transparent font-normal outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              서비스 이용 약관
            </button>
            <div className="bg-label-alternative h-3 w-px" aria-hidden="true" />
            <button
              type="button"
              className="text-label-2 text-label-alternative hover:text-label-neutral focus-visible:ring-primary-40 rounded-md bg-transparent font-normal outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              개인정보처리방침
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogoutClick}
              className="text-label-2 text-label-alternative hover:text-label-neutral focus-visible:ring-primary-40 rounded-md bg-transparent font-normal outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              로그아웃
            </button>
            <div className="bg-label-alternative h-3 w-px" aria-hidden="true" />
            <button
              type="button"
              onClick={handleWithdrawClick}
              disabled={!info}
              className="text-label-2 text-label-alternative hover:text-status-negative focus-visible:ring-primary-40 rounded-md bg-transparent font-normal outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              계정 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AccountSettingsModalContent.displayName = 'AccountSettingsModalContent';
