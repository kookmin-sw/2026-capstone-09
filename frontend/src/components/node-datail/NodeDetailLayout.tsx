import { Tab, TabList, TabListItem, TabPanel } from '@wanteddev/wds';

interface NodeDetailLayoutProps {
  nodeId: string | null;
  noteContent: React.ReactNode;
  meetingContent: React.ReactNode;
  value?: string;
  onValueChange?: (tab: string) => void;
}

export function NodeDetailLayout({
  nodeId,
  noteContent,
  meetingContent,
  value, // 외부에서 탭 상태 주입
  onValueChange, // 외부에서 탭 변경 핸들링
}: NodeDetailLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-gray-400">#1-1</span>
        <div className="flex items-center gap-2">
          <ToggleButton />
          <MoreButton />
        </div>
      </div>

      <h1 className="text-[22px] leading-tight font-bold text-gray-900">노드 제목</h1>

      <div className="space-y-2.5">
        <MetaRow icon="🏷️" label="태그">
          <div className="flex flex-wrap gap-1.5">
            {['텍스트', '텍스트', '텍스트', '텍스트', '텍스트'].map((t, i) => (
              <span
                key={i}
                className="rounded-full border border-teal-100 bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700"
              >
                {t}
              </span>
            ))}
          </div>
        </MetaRow>

        <MetaRow icon="👥" label="노드 담당자">
          <div className="flex items-center gap-2">
            <Avatar name="박건민" />
            <Avatar name="박건민" />
          </div>
        </MetaRow>

        <MetaRow icon="📄" label="노드 설명">
          <span className="text-sm text-gray-600">
            노드 설명입니다. 노드 설명입니다. 노드 설명입니다.
          </span>
        </MetaRow>

        <MetaRow icon="⏳" label="진행 상태">
          <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
            <span className="text-teal-500">✓</span> 완료
          </span>
        </MetaRow>
      </div>

      <Tab value={value} onValueChange={onValueChange} defaultValue="notes">
        <TabList size="medium" resize="fill">
          <TabListItem value="note">노트</TabListItem>
          <TabListItem value="meeting">회의</TabListItem>
        </TabList>
        <TabPanel value="note">{noteContent}</TabPanel>
        <TabPanel value="meeting">{meetingContent}</TabPanel>
      </Tab>
    </div>
  );
}

// ────────────────────────────────────────────────
// 로컬 더미 공통 컴포넌트 - 이 아래는 리뷰 안 남겨도 됩니다!
// ────────────────────────────────────────────────
function MetaRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex w-28 shrink-0 items-center gap-1.5 pt-0.5 text-xs text-gray-400">
        <span>{icon}</span>
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-[10px] font-bold text-white">
        {name[0]}
      </div>
      <span className="text-sm text-gray-700">{name}</span>
    </div>
  );
}

function ToggleButton() {
  return (
    <button className="relative h-5 w-10 rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
      <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform" />
    </button>
  );
}

function MoreButton() {
  return (
    <button className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="3" r="1.2" />
        <circle cx="8" cy="8" r="1.2" />
        <circle cx="8" cy="13" r="1.2" />
      </svg>
    </button>
  );
}
