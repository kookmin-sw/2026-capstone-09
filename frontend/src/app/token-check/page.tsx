export default function TokenCheckPage() {
  return (
    <main className="bg-background min-h-screen space-y-16 p-10">
      {/* ── 1. 폰트 확인 ── */}
      <section className="space-y-4">
        <h2 className="text-foreground text-2xl font-bold">1. Pretendard 폰트</h2>
        <p className="text-base font-thin">Thin (100) — 가나다라마바사 FlowMeet ABCabc 1234</p>
        <p className="text-base font-light">Light (300) — 가나다라마바사 FlowMeet ABCabc 1234</p>
        <p className="text-base font-normal">Regular (400) — 가나다라마바사 FlowMeet ABCabc 1234</p>
        <p className="text-base font-medium">Medium (500) — 가나다라마바사 FlowMeet ABCabc 1234</p>
        <p className="text-base font-semibold">
          SemiBold (600) — 가나다라마바사 FlowMeet ABCabc 1234
        </p>
        <p className="text-base font-bold">Bold (700) — 가나다라마바사 FlowMeet ABCabc 1234</p>
        <p className="text-base font-extrabold">
          ExtraBold (800) — 가나다라마바사 FlowMeet ABCabc 1234
        </p>
        <p className="text-muted-foreground text-sm">
          ✅ 위 텍스트들이 굵기별로 구분되고 Pretendard 자형(ㄱ,ㅏ 등)으로 표시되면 폰트 정상 적용
        </p>
      </section>

      {/* ── 2. 색상 토큰 확인 ── */}
      <section className="space-y-4">
        <h2 className="text-foreground text-2xl font-bold">2. 색상 토큰</h2>
        <div className="flex flex-wrap gap-3">
          <div className="bg-theme---primary-60 flex h-24 w-24 items-end rounded-lg p-2">
            <span className="text-xs font-medium text-white">primary</span>
          </div>
          <div className="bg-atomic---neutral---40 flex h-24 w-24 items-end rounded-lg p-2">
            <span className="text-xs font-medium text-white">atomic neutral</span>
          </div>
          <div className="bg-theme---label---normal flex h-24 w-24 items-end rounded-lg p-2">
            <span className="text-xs font-medium text-white">label</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          ✅ 각 박스가 토큰에 맞는 색으로 보이면 색상 토큰 정상 적용
        </p>
      </section>

      {/* ── 3. 타이포그래피 토큰 확인 ── */}
      <section className="space-y-2">
        <h2 className="text-display-1">타이포 확인</h2>
        {/* Display */}
        <p className="text-display-1">디스플레이 1</p>
        <p className="text-display-2">디스플레이 2</p>
        <p className="text-display-3">디스플레이 3</p>

        {/* Title */}
        <p className="text-title-1">타이틀 1</p>
        <p className="text-title-2">타이틀 2</p>
        <p className="text-title-3">타이틀 3</p>

        {/* Heading */}
        <p className="text-heading-1">헤딩 1</p>
        <p className="text-heading-2">헤딩 2</p>

        {/* Headline */}
        <p className="text-headline-1">헤드라인 1</p>
        <p className="text-headline-2">헤드라인 2</p>

        {/* Body */}
        <p className="text-body-1">바디 1</p>
        <p className="text-body-1-reading">바디 1 리딩</p>
        <p className="text-body-2">바디 2</p>
        <p className="text-body-2-reading">바디 2 리딩</p>

        {/* Label */}
        <p className="text-label-1">라벨 1</p>
        <p className="text-label-1-reading">라벨 1 리딩</p>
        <p className="text-label-2">라벨 2</p>

        {/* Caption */}
        <p className="text-caption-1">캡션 1</p>
        <p className="text-caption-2">캡션 2</p>
        <p className="text-muted-foreground mt-2 text-sm">
          ✅ 크기 단계가 일정하게 구분되면 타이포그래피 토큰 정상 적용
        </p>
      </section>
    </main>
  );
}
