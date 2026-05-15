'use client';

import { FormField, FormLabel, FormControl, TextField, TextFieldContent, TextFieldButton, Button } from '@wanteddev/wds';
import type { Theme } from '@wanteddev/wds-engine';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { authStorage } from '@/api/authStorage';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { useCountdown } from '@/hooks/useCountdown';
import {
  useSignupMutation,
  useSendEmailVerificationMutation,
  useVerifyEmailCodeMutation,
} from '@/queries/auth';

interface SignupPending {
  socialProvider: string;
  socialAccessToken: string;
  name: string;
  email: string;
}

const getSignupPending = (): SignupPending | null => {
  try {
    const data = sessionStorage.getItem('signup_pending');
    return data ? JSON.parse(data) : null;
  } catch {
    sessionStorage.removeItem('signup_pending');
    return null;
  }
};

export default function SignupPage() {
  const router = useRouter();
  const toast = usePositionedToast();
  const signupMutation = useSignupMutation();
  const sendEmailMutation = useSendEmailVerificationMutation();
  const verifyEmailMutation = useVerifyEmailCodeMutation();

  const pending = useMemo<SignupPending | null>(() => getSignupPending(), []);
  const [name, setName] = useState(pending?.name || '');
  const [email, setEmail] = useState(pending?.email || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const { timeLeft, start: startTimer, reset: resetTimer, formatTime } = useCountdown();

  useEffect(() => {
    if (!pending) {
      router.replace('/auth/login');
    }
  }, [router, pending]);

  const handleSendVerification = () => {
    if (!pending) return;

    sendEmailMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: (data) => {
          if (data.code === 'SEND_EMAIL_VERIFICATION') {
            setIsCodeSent(true);
            setIsEmailVerified(false);
            setVerifiedEmail('');
            setVerificationError(false);
            setVerificationCode('');
            startTimer(300);
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
    if (!pending) return;

    verifyEmail(
      {
        email: email.trim(),
        code: verificationCode.trim(),
      },
      {
        onSuccess: (data) => {
          if (data.code === 'VERIFY_EMAIL') {
            setIsEmailVerified(true);
            setVerifiedEmail(email.trim());
            setVerificationError(false);
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
  }, [verificationCode, isEmailVerified, isCodeSent, timeLeft, isVerifying, pending, email, verifyEmail, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pending || email.trim() !== verifiedEmail) return;

    signupMutation.mutate(
      {
        socialProvider: pending.socialProvider,
        socialAccessToken: pending.socialAccessToken,
        nickname: name.trim(),
        email: email.trim(),
      },
      {
        onSuccess: (data) => {
          if (data.code === 'SUCCESS' || data.code === 'SIGNUP') {
            if (data.data?.accessToken && data.data?.refreshToken) {
              sessionStorage.removeItem('signup_pending');
              authStorage.setTokens(data.data.accessToken, data.data.refreshToken);
              router.replace('/projects');
            } else {
              toast({
                content: data.message,
                variant: 'negative',
                placement: 'top-center',
              });
            }
          } else {
            toast({
              content: data.message,
              variant: 'negative',
              placement: 'top-center',
            });

            if (data.code === 'AUTH_INVALID_SOCIAL_TOKEN') {
              setTimeout(() => {
                sessionStorage.removeItem('signup_pending');
                router.replace('/auth/login');
              }, 2000);
            }
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

  if (!pending) {
    return null;
  }

  return (
    <main className="flex min-h-screen">
      <style>{`
        [wds-component="text-field"]:is(:focus-within, :has(input:focus)) [data-role="text-field-wrapper"] {
          box-shadow: inset 0 0 0 2px #04E6A2 !important;
        }
      `}</style>
      {/* 왼쪽 1/3 빈 공간 */}
      <div className="w-1/3" />

      <div className="flex w-2/3 items-center justify-center">
        <div className="flex flex-col gap-8">
          <div className="inline-flex items-start justify-start overflow-hidden">
            <h1 className="text-title-1 font-bold">회원가입</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-84">
            <FormField>
              <FormLabel
                htmlFor="name"
                variant="label1"
                sx={(theme: Theme) => ({
                  color: theme.semantic.label.neutral,
                })}
              >
                이름
              </FormLabel>
              <FormControl>
                <TextField
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해 주세요."
                  required
                  width="100%"
                />
              </FormControl>
            </FormField>

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
                      setVerifiedEmail('');
                      setIsCodeSent(false);
                      setVerificationCode('');
                      setVerificationError(false);
                      resetTimer();
                    }}
                    placeholder="이메일을 입력해 주세요."
                    type="email"
                    required
                    width="100%"
                    trailingButton={
                      <TextFieldButton
                        onClick={handleSendVerification}
                        disabled={sendEmailMutation.isPending || !email.trim() || (timeLeft > 0 && isCodeSent)}
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
                        {isCodeSent && timeLeft > 0 && (
                          <TextFieldContent variant="timer">
                            {formatTime(timeLeft)}
                          </TextFieldContent>
                        )}
                        {isCodeSent && timeLeft === 0 && (
                          <TextFieldContent variant="text" color="semantic.status.negative">
                            만료됨
                          </TextFieldContent>
                        )}
                      </>
                    }
                  />
                </FormControl>
                {verificationError && (
                  <p className="text-caption-1 text-status-negative">인증번호가 잘못되었어요.</p>
                )}
                {isEmailVerified && (
                  <p className="text-caption-1 text-label-alternative">인증에 성공했어요.</p>
                )}
              </FormField>
            </div>

            <Button
              type="submit"
              disabled={
                signupMutation.isPending ||
                !name.trim() ||
                !email.trim() ||
                !isEmailVerified ||
                email.trim() !== verifiedEmail
              }
              variant="solid"
              color="primary"
              size="large"
              sx={{ width: '100%' }}
            >
              회원가입
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}