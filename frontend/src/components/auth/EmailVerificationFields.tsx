'use client';

import { FormField, FormLabel, FormControl, TextField, TextFieldContent, TextFieldButton } from '@wanteddev/wds';
import type { Theme } from '@wanteddev/wds-engine';
import { useState, useEffect } from 'react';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { useCountdown } from '@/hooks/useCountdown';
import { useSendEmailVerificationMutation, useVerifyEmailCodeMutation } from '@/queries/auth';

interface EmailVerificationFieldsProps {
  initialEmail?: string;
  onVerificationChange: (isVerified: boolean, verifiedEmail: string) => void;
}

export function EmailVerificationFields({ initialEmail = '', onVerificationChange }: EmailVerificationFieldsProps) {
  const toast = usePositionedToast();
  const sendEmailMutation = useSendEmailVerificationMutation();
  const verifyEmailMutation = useVerifyEmailCodeMutation();

  const [email, setEmail] = useState(initialEmail);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const { timeLeft, start: startTimer, reset: resetTimer, formatTime } = useCountdown();

  const handleSendVerification = () => {
    sendEmailMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: (data) => {
          if (data.code === 'SEND_EMAIL_VERIFICATION') {
            setIsCodeSent(true);
            setIsEmailVerified(false);
            setVerificationError(false);
            setVerificationCode('');
            startTimer(300);
            onVerificationChange(false, '');
            toast({
              content: data.message,
              variant: 'positive',
              placement: 'top-center',
            });
          } else {
            toast({
              content: data.message,
              variant: 'negative',
              placement: 'top-center',
            });
          }
        },
        onError: (error) => {
          toast({
            content: error.message,
            variant: 'negative',
            placement: 'top-center',
          });
        },
      },
    );
  };

  const { mutate: verifyEmail, isPending: isVerifying } = verifyEmailMutation;

  useEffect(() => {
    if (verificationCode.length !== 6) return;
    if (isEmailVerified || !isCodeSent || timeLeft === 0 || isVerifying) return;
    if (verificationError) return;

    verifyEmail(
      {
        email: email.trim(),
        code: verificationCode.trim(),
      },
      {
        onSuccess: (data) => {
          if (data.code === 'VERIFY_EMAIL') {
            setIsEmailVerified(true);
            setVerificationError(false);
            onVerificationChange(true, email.trim());
            toast({
              content: data.message,
              variant: 'positive',
              placement: 'top-center',
            });
          } else {
            setVerificationError(true);
            setIsEmailVerified(false);
            toast({
              content: data.message,
              variant: 'negative',
              placement: 'top-center',
            });
          }
        },
        onError: (error) => {
          setVerificationError(true);
          setIsEmailVerified(false);
          toast({
            content: error.message,
            variant: 'negative',
            placement: 'top-center',
          });
        },
      },
    );
  }, [verificationCode, isEmailVerified, isCodeSent, timeLeft, isVerifying, verificationError, email, verifyEmail, toast, onVerificationChange]);

  return (
    <div className="flex flex-col gap-2">
      <FormField>
        <FormLabel
          htmlFor="email"
          variant="label1"
          sx={(theme: Theme) => ({
            color: theme.semantic.label.neutral,
          })}
        >
          이메일
        </FormLabel>
        <FormControl>
          <TextField
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsEmailVerified(false);
              setIsCodeSent(false);
              setVerificationCode('');
              setVerificationError(false);
              resetTimer();
              onVerificationChange(false, '');
            }}
            placeholder="이메일을 입력해 주세요."
            type="email"
            required
            width="100%"
            trailingButton={
              <TextFieldButton
                onClick={handleSendVerification}
                disabled={sendEmailMutation.isPending || !email.trim()}
              >
                {isCodeSent ? '재전송' : '인증하기'}
              </TextFieldButton>
            }
          />
        </FormControl>
      </FormField>

      <FormField className="gap-2">
        <FormControl>
          <TextField
            value={verificationCode}
            onChange={(e) => {
              const newValue = e.target.value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(newValue);
              setVerificationError(false);
            }}
            placeholder="인증번호를 입력해 주세요."
            disabled={isEmailVerified}
            invalid={verificationError}
            positive={isEmailVerified}
            width="100%"
            maxLength={6}
            trailingContent={
              <>
                {isCodeSent && timeLeft === 0 && (
                  <TextFieldContent variant="text" color="semantic.status.negative">
                    만료됨
                  </TextFieldContent>
                )}
              </>
            }
          />
        </FormControl>
        {isCodeSent && timeLeft > 0 && (
          <div className={verificationError || isEmailVerified ? "flex items-center justify-between" : "flex justify-end"}>
            {verificationError && (
              <p className="text-caption-1 text-status-negative">
                인증번호가 잘못되었어요.
              </p>
            )}
            {isEmailVerified && (
              <p className="text-caption-1 text-label-alternative">인증에 성공했어요.</p>
            )}
            <p className="text-caption-1 text-label-normal tabular-nums">
              유효시간 {formatTime(timeLeft)}
            </p>
          </div>
        )}
      </FormField>
    </div>
  );
}