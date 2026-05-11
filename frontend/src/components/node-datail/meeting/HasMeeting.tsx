'use client';

import { Theme } from '@wanteddev/wds';
import { IconPersonsFill } from '@wanteddev/wds-icon';

export const HasMeeting = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        {/* 임시용 디자인 - 추후 수정 */}
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex scale-400">
            <IconPersonsFill
              color="sementic.label.assistive"
              sx={(theme: Theme) => ({
                color: theme.semantic.label.assistive,
              })}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-body-1-reading text-label-alternative">
              회의가 아직 시작되지 않았어요.
            </div>

            <div className="text-body-2 text-label-assistive">회의 시간을 확인해 주세요.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HasMeeting;
