'use client';

import { FormField, FormLabel, FormControl, TextField, Button } from '@wanteddev/wds';
import type { Theme } from '@wanteddev/wds-engine';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { EmailVerificationFields } from '@/components/auth/EmailVerificationFields';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { useAuth } from '@/contexts/AuthContext';
import { useSignupMutation } from '@/queries/auth';

interface SignupPending {
  socialProvider: string;
  socialAccessToken: string;
  socialRefreshToken: string;
  name: string;
  email: string;
}

const getSignupPending = (): SignupPending | null => {
  if (typeof window === 'undefined') return null;

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
  const { login } = useAuth();
  const toast = usePositionedToast();
  const signupMutation = useSignupMutation();

  const pending = useMemo<SignupPending | null>(() => getSignupPending(), []);
  const [name, setName] = useState(pending?.name || '');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  useEffect(() => {
    if (!pending) {
      router.replace('/auth/login');
    }
  }, [router, pending]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pending || !verifiedEmail) return;

    signupMutation.mutate(
      {
        socialProvider: pending.socialProvider,
        socialAccessToken: pending.socialAccessToken,
        socialRefreshToken: pending.socialRefreshToken,
        nickname: name.trim(),
        email: verifiedEmail,
      },
      {
        onSuccess: (data) => {
          if (data.code === 'SUCCESS' || data.code === 'SIGNUP') {
            if (data.data?.accessToken && data.data?.refreshToken) {
              sessionStorage.removeItem('signup_pending');
              login(data.data.accessToken, data.data.refreshToken);
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
      {/* 왼쪽 1/3 */}
      <div className="w-1/3">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-screen object-cover"
        >
          <source src="/videos/login.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

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

            <EmailVerificationFields
              initialEmail={pending?.email}
              onVerificationChange={(verified, email) => {
                setIsEmailVerified(verified);
                setVerifiedEmail(email);
              }}
            />

            <Button
              type="submit"
              disabled={
                signupMutation.isPending ||
                !name.trim() ||
                !isEmailVerified ||
                !verifiedEmail
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