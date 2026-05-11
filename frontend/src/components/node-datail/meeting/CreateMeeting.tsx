'use client';

import { Button, Theme } from '@wanteddev/wds';
import { IconFolderFill } from '@wanteddev/wds-icon';

export const CreateMeeting = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        {/* 임시용 디자인 - 추후 수정 */}
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex scale-400">
            <IconFolderFill
              color="sementic.label.assistive"
              sx={(theme: Theme) => ({
                color: theme.semantic.label.assistive,
              })}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-body-1-reading text-label-alternative">
              진행 중인 회의가 없어요
            </div>

            <div className="text-body-2 text-label-assistive">
              아래 버튼을 클릭해서 새로운 회의를 생성해 주세요.
            </div>
          </div>
        </div>
        <Button>회의 생성하기</Button>
      </div>
    </div>
  );
};

export default CreateMeeting;
