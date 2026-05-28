import Image from 'next/image';
import { DownloadButton } from '../ui/DownloadButton';
import { GoogleLoginButton } from '../ui/GoogleLoginButton';
import { asset } from '@/lib/asset';

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#040506]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary-50)]/40 to-transparent" />
      <div className="mx-auto max-w-[1080px] px-6 py-20 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-[520px]">
            <Image
              src={asset('/flowmeet-logo.svg')}
              alt="flowMeet"
              width={120}
              height={28}
              className="h-7 w-auto"
            />
            <p className="mt-6 text-[clamp(22px,2.4vw,32px)] font-semibold leading-[1.25] text-white">
              기획이 흐름을 만나는 순간,
              <br />
              <span className="inline-flex items-baseline">
                <Image
                  src={asset('/flowMeet.svg')}
                  alt="flowMeet"
                  width={120}
                  height={20}
                  className="mr-1.5 inline-block h-[0.75em] w-auto align-[-0.02em]"
                />
                <span>으로 시작해요.</span>
              </span>
            </p>
            <div className="mt-8 hidden flex-wrap items-center gap-3 md:flex">
              <GoogleLoginButton size="lg" />
              <DownloadButton size="lg" />
            </div>
          </div>
          <div className="text-[13px]">
            <FooterCol
              title="Legal"
              items={[
                {
                  label: '서비스 이용약관',
                  href: 'https://aerial-mule-b93.notion.site/flowMeet-361733adb1cf809dbe54c089d11702e1',
                },
                {
                  label: '개인정보처리방침',
                  href: 'https://aerial-mule-b93.notion.site/Flowmeet-361733adb1cf805999edff2825aebe05?source=copy_link',
                },
              ]}
            />
          </div>
        </div>
        <div className="mt-16 border-t border-white/[0.06] pt-6 text-[12px] text-[var(--color-text-faint)]">
          <span>© {new Date().getFullYear()} flowMeet. KMU Capstone 2026.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11.5px] uppercase tracking-[0.2em] text-[var(--color-primary-50)]">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] transition-colors hover:text-white"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
