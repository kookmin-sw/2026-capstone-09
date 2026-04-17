import { Menu, MenuContent, MenuList, MenuTrigger } from '@wanteddev/wds';
import type { Theme } from '@wanteddev/wds-engine';
import { IconPencil, IconPlus, IconTrash } from '@wanteddev/wds-icon';
import { useState } from 'react';

import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';
import { ProjectDetailLinkItem } from '@/components/projects/project-detail/ProjectDetailLinkItem';
import { EXAMPLE_PROJECT_DETAIL_LINKS } from '@/constants/exampleConstant';

interface LinkContextMenuState {
  x: number;
  y: number;
}

export const ProjectDetailLinks = () => {
  const [contextMenu, setContextMenu] = useState<LinkContextMenuState | null>(null);

  const handleLinkContextMenu = () => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  };

  return (
    <>
      <section className="border-line-soft bg-static-white relative z-0 flex h-12 shrink-0 items-center justify-between border-b p-3">
        <div className="flex items-center gap-4">
          {EXAMPLE_PROJECT_DETAIL_LINKS.map(({ href, id, label }) => (
            <ProjectDetailLinkItem
              key={id}
              label={label}
              href={href}
              onContextMenu={handleLinkContextMenu()}
            />
          ))}

          <button
            type="button"
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
            <CustomMenuItem
              value="edit-link"
              icon={<IconPencil />}
              onClick={() => setContextMenu(null)}
            >
              수정
            </CustomMenuItem>
            <CustomMenuItem
              value="delete-link"
              icon={<IconTrash />}
              textProps={{ variant: 'label2', color: 'semantic.status.negative' }}
              onClick={() => setContextMenu(null)}
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
