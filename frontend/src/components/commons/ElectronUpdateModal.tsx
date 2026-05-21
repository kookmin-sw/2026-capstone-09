'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

export function ElectronUpdateModal() {
  const [updateVersion, setUpdateVersion] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    window.desktop?.onUpdateAvailable((version) => {
      setUpdateVersion(version);
    });
  }, []);

  const handleUpdate = async () => {
    setIsDownloading(true);
    await window.desktop?.downloadUpdate();
  };

  const handleDismiss = () => {
    setUpdateVersion(null);
  };

  if (!updateVersion) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="animate-in fade-in bg-label-alternative absolute inset-0 backdrop-blur-[2px] duration-200"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-modal-title"
        className="animate-in fade-in zoom-in-95 relative z-20 min-w-90 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full overflow-hidden rounded-xl bg-white px-5 pt-5 pb-3">
          <div className="flex w-90 flex-col gap-4 pb-2">
            <h3 id="update-modal-title" className="text-headline-1 text-label-normal font-semibold">
              업데이트가 있어요
            </h3>
            <p className="text-body-2 text-label-alternative whitespace-pre-line">
              {'FlowMeet '}
              <span className="text-label-normal font-medium">v{updateVersion}</span>
              {
                '이 출시됐어요.\n지금 업데이트하면 최신 기능을 바로 사용할 수 있어요.'
              }
            </p>
            <div className="flex items-center justify-end gap-6 pt-2">
              <button
                type="button"
                onClick={handleDismiss}
                disabled={isDownloading}
                className="text-body-1 text-label-alternative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40"
              >
                나중에
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isDownloading}
                className={cn(
                  'text-body-1 rounded-md px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2',
                  'focus-visible:ring-primary-40',
                  'text-primary-normal hover:bg-fill-normal active:bg-fill-strong bg-transparent disabled:opacity-40',
                )}
              >
                {isDownloading ? '다운로드 중...' : '지금 업데이트'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
