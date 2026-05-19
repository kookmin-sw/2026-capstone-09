'use client';

import { ContentBadge, ThemeColorsToken, Typography } from '@wanteddev/wds';
import { useRef, useState } from 'react';

import { NODE_STATUS_INFO, NodeStatusType } from '@/constants/nodeStatus';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useUpdateNodeStatusMutation } from '@/queries/node';
import { getNodeStatusColor, getNodeStatusIcon, getNodeStatusLabel } from '@/utils/getNodeStatus';
import { useYjsMeta } from '../hooks/useYjsMeta';

interface StatusFieldProps {
  projectId: number;
  nodeId: number;
  initialStatus: NodeStatusType | undefined;
}

export function StatusField({ projectId, nodeId, initialStatus }: StatusFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const showErrorToast = useErrorToast();

  const { status, ySetStatus } = useYjsMeta(initialStatus);
  const { mutate: updateStatus } = useUpdateNodeStatusMutation(projectId, nodeId);

  useClickOutside(containerRef, isOpen, () => setIsOpen(false));

  const handleSelect = (newStatus: NodeStatusType) => {
    setIsOpen(false);
    const previous = status;
    ySetStatus(newStatus);
    updateStatus(newStatus, {
      onError: (err) => {
        if (previous) ySetStatus(previous);
        showErrorToast(err, '상태 업데이트에 실패했어요.');
      },
    });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => {
          if (!isOpen) setIsOpen(true);
        }}
        className={`flex w-full cursor-text flex-wrap items-center gap-2.5 rounded-t-sm ${isOpen ? 'bg-line-normal-alternative border-line-solid-normal border border-b-0 p-2.5' : ''}`}
      >
        {!status && (
          <div className="text-label-alternative items-center">
            <Typography variant="caption1">선택된 상태가 없어요</Typography>
          </div>
        )}
        {status && (
          <ContentBadge
            size="xsmall"
            color="accent"
            accentColor={getNodeStatusColor(status) as ThemeColorsToken}
            leadingContent={getNodeStatusIcon(status)}
          >
            {getNodeStatusLabel(status)}
          </ContentBadge>
        )}
        {isOpen && <span className="h-4 w-px self-center" />}
      </div>

      {isOpen && (
        <div className="border-line-solid-normal absolute top-full left-0 z-50 w-full rounded-b-sm border bg-white py-2 shadow-md">
          {(Object.keys(NODE_STATUS_INFO) as NodeStatusType[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSelect(s)}
              className="flex w-full items-center gap-2 bg-white px-3 py-2 hover:bg-gray-50"
            >
              <ContentBadge
                size="xsmall"
                color="accent"
                accentColor={getNodeStatusColor(s) as ThemeColorsToken}
                leadingContent={getNodeStatusIcon(s)}
              >
                {getNodeStatusLabel(s)}
              </ContentBadge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
