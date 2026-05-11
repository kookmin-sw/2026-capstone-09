'use client';

export function AmbientOrbs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="animate-orb-float absolute -top-40 left-[8%] h-[640px] w-[640px] rounded-full bg-[var(--color-primary-50)]/[0.22] blur-[150px]" />
      <div
        className="animate-orb-float absolute top-[28%] right-[4%] h-[680px] w-[680px] rounded-full bg-[var(--color-primary-50)]/[0.16] blur-[160px]"
        style={{ animationDelay: '4s' }}
      />
      <div
        className="animate-orb-float absolute bottom-[6%] left-[24%] h-[520px] w-[520px] rounded-full bg-[var(--color-primary-50)]/[0.10] blur-[150px]"
        style={{ animationDelay: '8s' }}
      />
      <div
        className="animate-orb-float absolute top-[55%] left-[3%] h-[440px] w-[440px] rounded-full bg-[var(--color-primary-50)]/[0.10] blur-[150px]"
        style={{ animationDelay: '6s' }}
      />
      <div
        className="animate-orb-float absolute top-[72%] right-[18%] h-[460px] w-[460px] rounded-full bg-[#7BD3FF]/[0.06] blur-[150px]"
        style={{ animationDelay: '10s' }}
      />
    </div>
  );
}
