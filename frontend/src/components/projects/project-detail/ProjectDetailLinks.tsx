import { Menu, MenuContent, MenuList, MenuTrigger } from '@wanteddev/wds';
import { IconPlus } from '@wanteddev/wds-icon';
import { useState } from 'react';

import { CustomMenu } from '@/components/commons/custom-menu/CustomMemu';
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
        <MenuContent offset={4} position="bottom-center" sx={{ width: '9.625rem' }}>
          <MenuList>
            <CustomMenu value="edit-link" onClick={() => setContextMenu(null)}>
              수정
            </CustomMenu>
            <CustomMenu value="delete-link" onClick={() => setContextMenu(null)}>
              삭제
            </CustomMenu>
          </MenuList>
        </MenuContent>
      </Menu>
    </>
  );
};
