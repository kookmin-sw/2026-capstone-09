import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
      <section className="bg---surface---canvas flex flex-1 items-center justify-center gap-3 overflow-hidden px-20 py-[100px]">
        <Link
          href="/auth/login"
          className="rounded-md border border-[rgba(112,115,124,0.16)] bg-white px-4 py-2 text-[1.5rem] font-medium leading-[1.5rem] tracking-[0.014rem] text-[rgba(23,23,25,1)] hover:bg-[rgba(112,115,124,0.05)]"
        >
          뒤로가기
        </Link>
        <Link
          href="/projects/flowmeet-plan"
          className="rounded-md border border-[rgba(112,115,124,0.16)] bg-white px-4 py-2 text-[1.5rem] font-medium leading-[1.5rem] tracking-[0.014rem] text-[rgba(23,23,25,1)] hover:bg-[rgba(112,115,124,0.05)]"
        >
          프로젝트 상세로 이동
        </Link>
      </section>
    </div>
  );
}

