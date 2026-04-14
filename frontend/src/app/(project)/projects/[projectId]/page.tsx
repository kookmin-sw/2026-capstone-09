import Link from 'next/link';

export default function ProjectDetailPage() {
  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
      <section className="flex h-14 shrink-0 items-center justify-between border-b border-line-soft bg-static-white p-3" />
      <section className="flex h-12 shrink-0 items-center justify-between border-b border-line-soft bg-static-white p-3" />
      <section className="bg-surface-canvas flex flex-1 items-center justify-center gap-3 overflow-hidden px-20 py-24">
        <Link
          href="/projects"
          className="rounded-md border border-line-normal-neutral bg-static-white px-4 py-2 text-title-3 font-medium text-label-normal hover:bg-fill-alternative"
        >
          뒤로가기
        </Link>
      </section>
    </div>
  );
}
