'use client';

import { Menu, MenuContent, MenuList, MenuTrigger } from '@wanteddev/wds';
import type { Theme } from '@wanteddev/wds-engine';
import { IconPencil, IconPlus, IconTrash } from '@wanteddev/wds-icon';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { privateApi } from '@/api';
import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import {
  LinkEditDialogContent,
  type LinkEditPayload,
} from '@/components/projects/project-detail/link-edit';
import { ProjectDetailLinkItem } from '@/components/projects/project-detail/ProjectDetailLinkItem';

interface LinkItem {
  urlId: number;
  url: string;
  /** 자동 추출된 fallback 라벨(hostname). 사용자 라벨이 없을 때 사용. */
  fallbackLabel: string;
}

interface LinkContextMenuState {
  x: number;
  y: number;
  link: LinkItem;
}

/**
 * URL → fallback 라벨 추출.
 * - 정상 URL이면 hostname에서 `www.` 접두 제거.
 * - 파싱 실패하면 입력 그대로 노출.
 */
const extractFallbackLabel = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export const ProjectDetailLinks = () => {
  const params = useParams<{ projectId?: string }>();
  const projectIdRaw = params?.projectId;
  const projectId = projectIdRaw ? Number(projectIdRaw) : undefined;
  const isProjectIdValid = projectId !== undefined && !Number.isNaN(projectId);
  const { openDialog, closeDialog } = useDialog();
  const toast = usePositionedToast();

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [contextMenu, setContextMenu] = useState<LinkContextMenuState | null>(null);
  // 사용자가 다이얼로그에서 입력한 라벨(이름) 캐시.
  // 백엔드 `ProjectUrlRequest`가 `url` 한 필드만 받기 때문에 새로고침 시에는 사라지고
  // hostname fallback으로 돌아간다. (백엔드에 name 필드 추가는 별도 이슈.)
  const [customLabels, setCustomLabels] = useState<Record<number, string>>({});
  // 추가/수정/삭제 후 useEffect를 다시 트리거해 목록을 새로 받아오기 위한 카운터.
  // useEffect 안의 inline async 함수 형태를 유지해 `react-hooks/set-state-in-effect` 룰을 회피한다.
  const [reloadCounter, setReloadCounter] = useState(0);
  const triggerReload = () => setReloadCounter((c) => c + 1);

  useEffect(() => {
    if (!isProjectIdValid || projectId === undefined) return;

    let cancelled = false;

    const fetchLinks = async () => {
      try {
        const response = await privateApi.project.getProject(projectId);
        if (cancelled) return;
        const urls = response.data.data?.urls ?? [];
        const normalized: LinkItem[] = urls
          .filter(
            (item): item is { urlId: number; url: string } =>
              item.urlId !== undefined && item.url !== undefined,
          )
          .map((item) => ({
            urlId: item.urlId,
            url: item.url,
            fallbackLabel: extractFallbackLabel(item.url),
          }));
        setLinks(normalized);
      } catch (caught) {
        if (cancelled) return;
        console.error('프로젝트 URL 목록 조회에 실패했어요.', caught);
      }
    };

    void fetchLinks();

    return () => {
      cancelled = true;
    };
  }, [isProjectIdValid, projectId, reloadCounter]);

  const handleAddClick = () => {
    if (!isProjectIdValid || projectId === undefined) return;
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <LinkEditDialogContent
          mode="add"
          onSave={async (payload: LinkEditPayload) => {
            try {
              const response = await privateApi.projectUrl.addUrl(projectId, { url: payload.url });
              const newUrlId = response.data.data?.urlId;
              if (newUrlId !== undefined && payload.name.length > 0) {
                setCustomLabels((prev) => ({ ...prev, [newUrlId]: payload.name }));
              }
              closeDialog();
              triggerReload();
            } catch (caught) {
              console.error('URL 추가에 실패했어요.', caught);
            }
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  const handleEditDialogOpen = (link: LinkItem) => {
    if (!isProjectIdValid || projectId === undefined) return;
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <LinkEditDialogContent
          mode="edit"
          initialUrl={link.url}
          initialName={customLabels[link.urlId] ?? ''}
          onSave={async (payload: LinkEditPayload) => {
            try {
              await privateApi.projectUrl.updateUrl(projectId, link.urlId, { url: payload.url });
              setCustomLabels((prev) => {
                const next = { ...prev };
                if (payload.name.length > 0) {
                  next[link.urlId] = payload.name;
                } else {
                  delete next[link.urlId];
                }
                return next;
              });
              closeDialog();
              triggerReload();
            } catch (caught) {
              console.error('URL 수정에 실패했어요.', caught);
            }
          }}
          onDelete={async () => {
            try {
              await privateApi.projectUrl.deleteUrl(projectId, link.urlId);
              setCustomLabels((prev) => {
                const next = { ...prev };
                delete next[link.urlId];
                return next;
              });
              closeDialog();
              triggerReload();
              toast({
                content: '링크를 삭제했어요',
                variant: 'normal',
                placement: 'bottom-left',
                duration: 'short',
              });
            } catch (caught) {
              console.error('URL 삭제에 실패했어요.', caught);
            }
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  const handleLinkContextMenu =
    (link: LinkItem) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setContextMenu({ x: event.clientX, y: event.clientY, link });
    };

  const handleEditMenuClick = () => {
    const link = contextMenu?.link;
    setContextMenu(null);
    if (link) handleEditDialogOpen(link);
  };

  const handleDeleteMenuClick = async () => {
    const link = contextMenu?.link;
    setContextMenu(null);
    if (!link || !isProjectIdValid || projectId === undefined) return;
    try {
      await privateApi.projectUrl.deleteUrl(projectId, link.urlId);
      setCustomLabels((prev) => {
        const next = { ...prev };
        delete next[link.urlId];
        return next;
      });
      triggerReload();
      toast({
        content: '링크를 삭제했어요',
        variant: 'normal',
        placement: 'bottom-left',
        duration: 'short',
      });
    } catch (caught) {
      console.error('URL 삭제에 실패했어요.', caught);
    }
  };

  return (
    <>
      <section className="border-line-soft bg-static-white relative z-0 flex h-12 shrink-0 items-center justify-between border-b p-3">
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <ProjectDetailLinkItem
              key={link.urlId}
              label={customLabels[link.urlId] ?? link.fallbackLabel}
              href={link.url}
              onContextMenu={handleLinkContextMenu(link)}
            />
          ))}

          <button
            type="button"
            onClick={handleAddClick}
            disabled={!isProjectIdValid}
            className="text-label-alternative hover:bg-fill-normal hover:text-label-neutral flex h-7 w-7 appearance-none items-center justify-center rounded-md border-none bg-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="링크 추가"
          >
            <IconPlus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      <Menu open={Boolean(contextMenu)} onOpenChange={(isOpen) => !isOpen && setContextMenu(null)}>
        <MenuTrigger>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed h-0 w-0 opacity-0"
            style={{
              left: contextMenu?.x ?? 0,
              top: contextMenu?.y ?? 0,
            }}
          />
        </MenuTrigger>
        <MenuContent offset={0} position="bottom-start" sx={{ width: '4rem' }}>
          <MenuList>
            <CustomMenuItem value="edit-link" icon={<IconPencil />} onClick={handleEditMenuClick}>
              수정
            </CustomMenuItem>
            <CustomMenuItem
              value="delete-link"
              icon={<IconTrash />}
              textProps={{ variant: 'label2', color: 'semantic.status.negative' }}
              onClick={handleDeleteMenuClick}
              sx={(theme: Theme) => ({
                '& svg': {
                  color: theme.semantic.status.negative,
                },
              })}
            >
              삭제
            </CustomMenuItem>
          </MenuList>
        </MenuContent>
      </Menu>
    </>
  );
};
