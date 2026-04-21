'use client';

import { useState } from 'react';

import { ConfirmDialogContent } from '@/components/commons/custom-dialog/ConfirmDialogContent';
import { useDialog } from '@/components/commons/custom-dialog/DialogContext';

/**
 * 계정 설정 모달 내 비즈니스 로직(이메일 편집 플로우, 인증 상태, 로그아웃/탈퇴 확인)을 분리.
 * 컴포넌트는 반환 값과 핸들러를 JSX에 그대로 연결만 하면 된다.
 */
interface UseAccountSettingsParams {
  initialName: string;
  initialEmail: string;
  onCloseModal: () => void;
}

export const useAccountSettings = ({
  initialName,
  initialEmail,
  onCloseModal,
}: UseAccountSettingsParams) => {
  const { openDialog, closeDialog } = useDialog();

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const resetEmailEditState = () => {
    setIsEditingEmail(false);
    setVerificationCode('');
    setIsVerified(false);
  };

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
      onCloseModal();
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
              resetEmailEditState();
              onCloseModal();
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
              onCloseModal();
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
              onCloseModal();
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

  return {
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
  };
};
