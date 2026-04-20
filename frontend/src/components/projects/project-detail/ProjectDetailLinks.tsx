'use client';

import { Menu, MenuContent, MenuList, MenuTrigger } from '@wanteddev/wds';
import type { Theme } from '@wanteddev/wds-engine';
import { IconPencil, IconPlus, IconTrash } from '@wanteddev/wds-icon';
import { useState } from 'react';

import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';
import { toastStore } from '@/components/commons/custom-toast/toastStore';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { ProjectDetailLinkItem } from '@/components/projects/project-detail/ProjectDetailLinkItem';
import { EXAMPLE_PROJECT_DETAIL_LINKS } from '@/constants/exampleConstant';

import { LinkEditDialogContent, type LinkEditPayload } from './LinkEditDialogContent';

interface LinkContextMenuState {
  x: number;
  y: number;
}

const createLinkId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `link-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const ProjectDetailLinks = () => {
  const { openDialog, closeDialog } = useDialog();
  const showToast = usePositionedToast();
  const [links, setLinks] = useState<LinkEditPayload[]>(() =>
    EXAMPLE_PROJECT_DETAIL_LINKS.map((link) => ({ ...link })),
  );
  const [contextMenu, setContextMenu] = useState<LinkContextMenuState | null>(null);
  const [activeLink, setActiveLink] = useState<LinkEditPayload | null>(null);

  const handleLinkContextMenu =
    (link: LinkEditPayload) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
      });
      setActiveLink(link);
    };

  const upsertLink = (payload: LinkEditPayload) => {
    setLinks((prev) => {
      const index = prev.findIndex((item) => item.id === payload.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = payload;
        return next;
      }
      return [...prev, payload];
    });
  };

  const removeLink = (id: string) => {
    const targetIndex = links.findIndex((item) => item.id === id);
    if (targetIndex < 0) return;
    const target = links[targetIndex];
    setLinks((prev) => prev.filter((item) => item.id !== id));

    const toastId = `link-delete-${target.id}-${Date.now()}`;
    const handleUndo = () => {
      setLinks((prev) => {
        if (prev.some((item) => item.id === target.id)) return prev;
        const next = [...prev];
        next.splice(Math.min(targetIndex, next.length), 0, target);
        return next;
      });
      toastStore.startClose(toastId);
    };

    showToast({
      id: toastId,
      content: (
        <div className="flex min-w-75 items-center justify-between gap-4">
          <span>{`'${target.label}' 링크를 삭제했어요`}</span>
          <button
            type="button"
            onClick={handleUndo}
            className="text-primary-40 hover:text-primary-50 shrink-0 border-none bg-transparent p-0 font-semibold"
          >
            취소하기
          </button>
        </div>
      ),
      variant: 'normal',
      placement: 'bottom-left',
      duration: 'short',
    });
  };

  const handleAddLinkClick = () => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <LinkEditDialogContent
          mode="add"
          initialLink={{ id: createLinkId(), label: '', href: '' }}
          onSave={(link) => {
            upsertLink(link);
            closeDialog();
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  const handleEditLinkClick = () => {
    setContextMenu(null);
    const link = activeLink;
    if (!link) return;

    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <LinkEditDialogContent
          mode="edit"
          initialLink={link}
          onSave={(updated) => {
            upsertLink(updated);
            closeDialog();
          }}
          onDelete={(id) => {
            removeLink(id);
            closeDialog();
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  const handleDeleteLinkClick = () => {
    if (activeLink) {
      removeLink(activeLink.id);
    }
    setContextMenu(null);
  };

  return (
    <>
      <section className="border-line-soft bg-static-white relative z-0 flex h-12 shrink-0 items-center justify-between border-b p-3">
        <div className="flex items-center gap-4">
          {links.map(({ href, id, label }) => (
            <ProjectDetailLinkItem
              key={id}
              label={label}
              href={href}
              onContextMenu={handleLinkContextMenu({ id, label, href })}
            />
          ))}

          <button
            type="button"
            onClick={handleAddLinkClick}
            className="text-label-alternative hover:bg-fill-normal hover:text-label-neutral flex h-7 w-7 appearance-none items-center justify-center rounded-md border-none bg-transparent transition-colors"
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
            <CustomMenuItem value="edit-link" icon={<IconPencil />} onClick={handleEditLinkClick}>
              수정
            </CustomMenuItem>
            <CustomMenuItem
              value="delete-link"
              icon={<IconTrash />}
              textProps={{ variant: 'label2', color: 'semantic.status.negative' }}
              onClick={handleDeleteLinkClick}
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
