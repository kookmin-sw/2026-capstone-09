'use client';

import { Menu, MenuContent, MenuList, MenuTrigger } from '@wanteddev/wds';
import type { Theme } from '@wanteddev/wds-engine';
import { IconPencil, IconPlus, IconTrash } from '@wanteddev/wds-icon';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import {
  LinkEditDialogContent,
  type LinkEditPayload,
} from '@/components/projects/project-detail/link-edit';
import { ProjectDetailLinkItem } from '@/components/projects/project-detail/ProjectDetailLinkItem';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useProjectQuery } from '@/queries/project';
import { useAddUrlMutation, useDeleteUrlMutation, useUpdateUrlMutation } from '@/queries/projectUrl';

interface LinkItem {
  urlId: number;
  url: string;
  /** 서버에 저장된 사용자 라벨. 비어있으면 fallback 라벨을 사용한다. */
  name: string;
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
  const showErrorToast = useErrorToast();
  const [contextMenu, setContextMenu] = useState<LinkContextMenuState | null>(null);

  const { data: project } = useProjectQuery(isProjectIdValid ? (projectId as number) : 0);
  const { mutateAsync: addUrl } = useAddUrlMutation(isProjectIdValid ? (projectId as number) : 0);
  const { mutateAsync: updateUrl } = useUpdateUrlMutation(
    isProjectIdValid ? (projectId as number) : 0,
  );
  const { mutateAsync: deleteUrl } = useDeleteUrlMutation(
    isProjectIdValid ? (projectId as number) : 0,
  );

  const links: LinkItem[] = (project?.urls ?? [])
    .filter(
      (item): item is { urlId: number; url: string; name?: string } =>
        item.urlId !== undefined && item.url !== undefined,
    )
    .map((item) => ({
      urlId: item.urlId,
      url: item.url,
      name: item.name ?? '',
      fallbackLabel: extractFallbackLabel(item.url),
    }));

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
              await addUrl({ name: payload.name, url: payload.url });
              closeDialog();
            } catch (caught) {
              showErrorToast(caught, 'URL 추가에 실패했어요.');
            }
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  const handleDeleteLink = async (urlId: number, onSuccess?: () => void) => {
    try {
      await deleteUrl(urlId);
      onSuccess?.();
      toast({
        content: '링크를 삭제했어요',
        variant: 'normal',
        placement: 'bottom-left',
        duration: 'short',
      });
    } catch (caught) {
      showErrorToast(caught, 'URL 삭제에 실패했어요.');
    }
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
          initialName={link.name}
          onSave={async (payload: LinkEditPayload) => {
            try {
              await updateUrl({ urlId: link.urlId, data: { name: payload.name, url: payload.url } });
              closeDialog();
            } catch (caught) {
              showErrorToast(caught, 'URL 수정에 실패했어요.');
            }
          }}
          onDelete={() => handleDeleteLink(link.urlId, closeDialog)}
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
    await handleDeleteLink(link.urlId);
  };

  return (
    <>
      <section className="border-line-soft bg-static-white relative z-0 flex h-12 shrink-0 items-center justify-between border-b p-3">
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <ProjectDetailLinkItem
              key={link.urlId}
              label={link.name.length > 0 ? link.name : link.fallbackLabel}
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
