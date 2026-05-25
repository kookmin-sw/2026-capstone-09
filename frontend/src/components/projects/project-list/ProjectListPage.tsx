'use client';

import {
  Avatar,
  Button,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  MenuTrigger,
  TextField,
  TextFieldContent,
} from '@wanteddev/wds';
import { IconChevronDownThickSmall, IconSearchThick } from '@wanteddev/wds-icon';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ProjectSidebar } from '@/components/commons/project-sidebar/ProjectSidebar';
import { Users } from '@/components/commons/user/UserAvatarGroup';
import { useProjectMembersQuery } from '@/queries/member';
import { useCreateProjectMutation, useProjectListQuery } from '@/queries/project';

type SortType = 'LATEST' | 'NAME';

function ProjectMemberAvatars({ projectId }: { projectId: number }) {
  const { data: members = [] } = useProjectMembersQuery(projectId);
  const users = members.map((m) => ({
    userId: m.userId,
    nickname: m.nickname,
    email: m.email,
    profileImageUrl: m.profileImageUrl,
  }));
  if (users.length === 0) return null;
  return <Users users={users} maxVisible={3} compact={false} size="xsmall" />;
}

const SORT_OPTIONS: { label: string; value: SortType }[] = [
  { label: '최신순', value: 'LATEST' },
  { label: '가나다순', value: 'NAME' },
];

const normalizeImageUrl = (raw?: string): string | undefined => {
  if (!raw) return undefined;
  if (/^(https?:)?\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export const ProjectListPage = () => {
  const router = useRouter();

  const [sort, setSort] = useState<SortType>('LATEST');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useProjectListQuery({ sort, search: debouncedSearch });
  const projects = data?.content ?? [];

  const createMutation = useCreateProjectMutation();
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? '정렬';

  const handleNewProject = () => {
    if (createMutation.isPending) return;
    createMutation.mutate(
      { name: '새 프로젝트' },
      {
        onSuccess: (res) => {
          const projectId = res.data?.data?.projectId;
          if (projectId) router.push(`/projects/${projectId}`);
        },
      },
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ProjectSidebar />

      <main className="bg-surface-canvas flex h-full flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4">
          <Menu
            value={[sort]}
            onValueChange={(vals) => {
              if (!vals) return;
              const next = vals[vals.length - 1] as SortType | undefined;
              if (next) setSort(next);
            }}
          >
            <MenuTrigger>
              <button
                type="button"
                className="border-line-normal-neutral bg-static-white text-body-2 text-label-normal hover:bg-fill-alternative flex h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3 transition-colors"
              >
                {currentSortLabel}
                <IconChevronDownThickSmall
                  className="text-label-assistive h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            </MenuTrigger>
            <MenuContent offset={4} position="bottom-start" sx={{ minWidth: '8rem' }}>
              <MenuList>
                {SORT_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </MenuList>
            </MenuContent>
          </Menu>

          <div className="flex-1">
            <TextField
              id="project-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="프로젝트 검색"
              width="100%"
              leadingContent={
                <TextFieldContent variant="icon">
                  <IconSearchThick className="text-label-alternative h-5 w-5" aria-hidden="true" />
                </TextFieldContent>
              }
            />
          </div>

          <Button onClick={handleNewProject} disabled={createMutation.isPending}>
            {createMutation.isPending ? '생성 중...' : '새 프로젝트'}
          </Button>
        </div>

        {/* Project list */}
        <div className="bg-surface-canvas flex-1 overflow-y-auto">
          {isLoading && (
            <p className="text-body-2 text-label-assistive py-12 text-center">불러오는 중...</p>
          )}

          {!isLoading && projects.length === 0 && (
            <p className="text-body-2 text-label-assistive py-12 text-center">
              {debouncedSearch
                ? '검색 결과가 없어요.'
                : '프로젝트가 없어요. 새 프로젝트를 만들어 보세요.'}
            </p>
          )}

          {projects.length > 0 && (
            <ul className="bg-surface-canvas">
              {projects.map((project) => {
                return (
                  <li
                    key={project.projectId}
                    className="border-line-normal-neutral bg-surface-canvas border-b"
                  >
                    <button
                      type="button"
                      onClick={() => router.push(`/projects/${project.projectId}`)}
                      className="bg-surface-canvas hover:bg-fill-alternative flex w-full items-center gap-4 px-6 py-5 text-left transition-colors"
                    >
                      {/* Project icon */}
                      <div className="shrink-0 overflow-hidden rounded-xl">
                        <Avatar
                          variant="company"
                          size={48}
                          src={normalizeImageUrl(project.profileImageUrl)}
                          alt={project.name ?? '프로젝트'}
                        />
                      </div>

                      {/* Name & date */}
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-label-1 text-label-normal truncate font-semibold">
                          {project.name}
                        </span>
                        <span className="text-caption-1 text-label-alternative font-normal">
                          최근 활동 {formatDate(project.lastActivityAt)}
                        </span>
                      </div>

                      {/* Members */}
                      <div className="flex shrink-0 items-center gap-2">
                        {project.projectId && <ProjectMemberAvatars projectId={project.projectId} />}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};
