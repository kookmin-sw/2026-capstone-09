'use client';

import { TextButton } from '@wanteddev/wds';

export type ConfirmDialogButtonTone = 'primary' | 'assistive' | 'negative';

interface ConfirmDialogButtonSpec {
  label: string;
  tone: ConfirmDialogButtonTone;
  onClick: () => void;
}

interface ConfirmDialogContentProps {
  title: string;
  description: string;
  leftButton: ConfirmDialogButtonSpec;
  rightButton: ConfirmDialogButtonSpec;
}

// FlowMeet 토큰 색상으로 TextButton color 오버라이드 (WDS 기본 primary=blue라 별도 지정)
const toneColorMap: Record<ConfirmDialogButtonTone, string> = {
  primary: 'var(--color-primary-40)',
  assistive: 'var(--color-label-alternative)',
  negative: 'var(--color-status-negative)',
};

const toneToTextButtonColor: Record<ConfirmDialogButtonTone, 'primary' | 'assistive'> = {
  primary: 'primary',
  assistive: 'assistive',
  negative: 'assistive',
};

export const ConfirmDialogContent = ({
  title,
  description,
  leftButton,
  rightButton,
}: ConfirmDialogContentProps) => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-heading-2 text-label-normal font-semibold">{title}</h3>
        <p className="text-body-2 text-label-alternative whitespace-pre-line">{description}</p>
      </div>
      <div className="flex items-center justify-end gap-6">
        <TextButton
          size="medium"
          color={toneToTextButtonColor[leftButton.tone]}
          onClick={leftButton.onClick}
          sx={{ color: `${toneColorMap[leftButton.tone]} !important` }}
        >
          {leftButton.label}
        </TextButton>
        <TextButton
          size="medium"
          color={toneToTextButtonColor[rightButton.tone]}
          onClick={rightButton.onClick}
          sx={{ color: `${toneColorMap[rightButton.tone]} !important` }}
        >
          {rightButton.label}
        </TextButton>
      </div>
    </div>
  );
};

ConfirmDialogContent.displayName = 'ConfirmDialogContent';
