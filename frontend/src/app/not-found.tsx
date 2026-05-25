import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="bg-background-normal-normal flex min-h-screen items-center justify-center px-6 py-12">
      <section className="flex w-full max-w-xl flex-col items-center text-center">
        <p className="text-display-1 text-primary-40 font-semibold">404</p>
        <h1 className="text-title-1 text-label-normal mt-4 font-semibold">
          페이지를 찾을 수 없어요
        </h1>
        <p className="text-body-1-reading text-label-alternative mt-3">
          주소가 잘못되었거나, 이동하려는 페이지가 더 이상 존재하지 않아요.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/projects"
            className="bg-primary-40 text-static-white hover:opacity-90 active:opacity-80 text-body-1 flex h-10 items-center justify-center rounded-lg px-4 font-medium transition-opacity"
          >
            프로젝트 목록으로 이동
          </Link>
        </div>
      </section>
    </main>
  );
}
