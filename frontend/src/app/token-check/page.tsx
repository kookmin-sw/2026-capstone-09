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
          <div className="bg-primary flex h-24 w-24 items-end rounded-lg p-2">
            <span className="text-primary-foreground text-xs font-medium">primary</span>
          </div>
          <div className="bg-secondary flex h-24 w-24 items-end rounded-lg p-2">
            <span className="text-secondary-foreground text-xs font-medium">secondary</span>
          </div>
          <div className="bg-muted flex h-24 w-24 items-end rounded-lg p-2">
            <span className="text-muted-foreground text-xs font-medium">muted</span>
          </div>
          <div className="bg-accent flex h-24 w-24 items-end rounded-lg p-2">
            <span className="text-accent-foreground text-xs font-medium">accent</span>
          </div>
          <div className="bg-destructive flex h-24 w-24 items-end rounded-lg p-2">
            <span className="text-destructive-foreground text-xs font-medium">destructive</span>
          </div>
          <div className="bg-card border-border flex h-24 w-24 items-end rounded-lg border p-2">
            <span className="text-card-foreground text-xs font-medium">card</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          ✅ 각 박스가 토큰에 맞는 색으로 보이면 색상 토큰 정상 적용
        </p>
      </section>

      {/* ── 3. 타이포그래피 토큰 확인 ── */}
      <section className="space-y-2">
        <h2 className="text-foreground text-2xl font-bold">3. 타이포그래피 토큰</h2>
        <p className="text-foreground text-xs">text-xs (12px) — 작은 보조 텍스트</p>
        <p className="text-foreground text-sm">text-sm (14px) — 캡션, 레이블</p>
        <p className="text-foreground text-base">text-base (16px) — 본문 기본</p>
        <p className="text-foreground text-lg">text-lg (18px) — 서브헤딩</p>
        <p className="text-foreground text-xl">text-xl (20px) — 헤딩</p>
        <p className="text-foreground text-2xl">text-2xl (24px) — 큰 헤딩</p>
        <p className="text-foreground text-3xl">text-3xl (30px) — 디스플레이</p>
        <p className="text-muted-foreground mt-2 text-sm">
          ✅ 크기 단계가 일정하게 구분되면 타이포그래피 토큰 정상 적용
        </p>
      </section>

      {/* ── 4. 이펙트(Shadow) 토큰 확인 ── */}
      <section className="space-y-4">
        <h2 className="text-foreground text-2xl font-bold">4. 이펙트(Shadow) 토큰</h2>
        <div className="flex flex-wrap gap-6">
          <div className="bg-card text-card-foreground w-36 rounded-lg p-4 text-sm font-medium shadow-sm">
            shadow-sm
          </div>
          <div className="bg-card text-card-foreground w-36 rounded-lg p-4 text-sm font-medium shadow-md">
            shadow-md
          </div>
          <div className="bg-card text-card-foreground w-36 rounded-lg p-4 text-sm font-medium shadow-lg">
            shadow-lg
          </div>
          <div className="bg-card text-card-foreground w-36 rounded-lg p-4 text-sm font-medium shadow-xl">
            shadow-xl
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          ✅ 그림자가 sm → xl 순서로 점점 강해지면 shadow 토큰 정상 적용
        </p>
      </section>

      {/* ── 5. 실제 UI 컴포넌트 조합 테스트 ── */}
      <section className="space-y-4">
        <h2 className="text-foreground text-2xl font-bold">5. 실제 컴포넌트 조합</h2>
        <div className="bg-card border-border max-w-sm space-y-4 rounded-xl border p-6 shadow-md">
          <h3 className="text-card-foreground text-lg font-semibold">FlowMeet 프로젝트</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Pretendard 폰트와 전역 디자인 토큰이 정상 적용되었을 때 이 카드는 깔끔하게 보입니다.
          </p>
          <div className="flex gap-2">
            <button className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90">
              확인
            </button>
            <button className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90">
              취소
            </button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          ✅ 카드, 버튼, 텍스트가 모두 일관된 스타일로 보이면 통합 정상
        </p>
      </section>
    </main>
  );
}
