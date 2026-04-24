import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
      <section className="bg-surface-canvas flex flex-1 items-center justify-center gap-3 overflow-hidden px-20 py-24">
        <Link
          href="/auth/login"
          className="border-line-normal-neutral bg-static-white text-title-3 text-label-normal hover:bg-fill-alternative rounded-md border px-4 py-2 font-medium"
        >
          뒤로가기
        </Link>
        <Link
          href="/projects/1"
          className="border-line-normal-neutral bg-static-white text-title-3 text-label-normal hover:bg-fill-alternative rounded-md border px-4 py-2 font-medium"
        >
          프로젝트 상세로 이동
        </Link>
      </section>
    </div>
  );
}
