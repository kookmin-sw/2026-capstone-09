import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-1 items-center justify-center">
      <Link
        href="/auth/login"
        className="rounded-md border border-[rgba(112,115,124,0.16)] bg-white px-4 py-2 text-[1.5rem] font-medium leading-[1.5rem] tracking-[0.014rem] text-[rgba(23,23,25,1)] hover:bg-[rgba(112,115,124,0.05)]"
      >
        로그인 페이지로 이동
      </Link>
    </main>
  );
}