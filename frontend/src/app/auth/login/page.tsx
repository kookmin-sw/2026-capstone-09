import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-1 items-center justify-center px-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="rounded-md border border-[rgba(112,115,124,0.16)] bg-white px-4 py-2 text-[15px] font-medium leading-6 tracking-[0.14px] text-[rgba(23,23,25,1)] hover:bg-[rgba(112,115,124,0.05)]"
        >
          뒤로가기
        </Link>
        <Link
          href="/projects"
          className="rounded-md border border-[rgba(112,115,124,0.16)] bg-white px-4 py-2 text-[15px] font-medium leading-6 tracking-[0.14px] text-[rgba(23,23,25,1)] hover:bg-[rgba(112,115,124,0.05)]"
        >
          프로젝트 선택으로 이동
        </Link>
      </div>
    </main>
  );
}

