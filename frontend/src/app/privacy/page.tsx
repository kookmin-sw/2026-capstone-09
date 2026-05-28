export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          플로밋(Flowmeet) 개인정보처리방침
        </h1>
        <p className="mb-10 text-center text-sm text-gray-500">
          <strong>시행일: 2026년 05월 15일</strong>
        </p>

        <hr className="mb-10 border-gray-200" />

        <Section title="제1조 (목적)">
          <p>
            플로밋(이하 &apos;회사&apos;라 합니다)은 회사가 제공하는 AI 기반 프로젝트 협업 플랫폼
            서비스 &apos;Flowmeet&apos;(이하 &apos;서비스&apos;)를 이용하는 개인(이하
            &apos;이용자&apos;)의 개인정보를 보호하기 위해, 개인정보보호법, 정보통신망 이용촉진 및
            정보보호 등에 관한 법률(이하 &apos;정보통신망법&apos;) 등 관련 법령을 준수하고, 이용자의
            개인정보 보호 관련 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이
            개인정보처리방침(이하 &apos;본 방침&apos;)을 수립합니다.
          </p>
        </Section>

        <Section title="제2조 (개인정보 처리의 원칙)">
          <p>
            개인정보 관련 법령 및 본 방침에 따라 회사는 이용자의 개인정보를 수집할 수 있으며, 수집된
            개인정보는 개인의 동의가 있는 경우에 한해 제3자에게 제공될 수 있습니다. 단, 법령의 규정
            등에 의해 적법하게 강제되는 경우 회사는 수집한 이용자의 개인정보를 사전에 개인의 동의
            없이 제3자에게 제공할 수도 있습니다.
          </p>
        </Section>

        <Section title="제3조 (본 방침의 공개)">
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              회사는 이용자가 언제든지 쉽게 본 방침을 확인할 수 있도록 서비스 초기화면 또는
              연결화면을 통해 본 방침을 공개합니다.
            </li>
            <li>
              회사는 제1항에 따라 본 방침을 공개하는 경우 글자 크기, 색상 등을 활용하여 이용자가
              쉽게 확인할 수 있도록 합니다.
            </li>
          </ol>
        </Section>

        <Section title="제4조 (본 방침의 변경)">
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              본 방침은 개인정보 관련 법령·지침·고시 또는 정부나 서비스 정책·내용의 변경에 따라
              개정될 수 있습니다.
            </li>
            <li>
              회사는 본 방침을 개정하는 경우 다음 각 호 하나 이상의 방법으로 공지합니다.
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>서비스 초기화면의 공지사항란 또는 별도 창을 통한 공지</li>
                <li>서면·전자우편 또는 이와 유사한 방법으로 이용자에게 공지</li>
              </ul>
            </li>
            <li>
              본 방침 개정의 시행일로부터 최소 7일 이전에 공지합니다. 다만, 이용자 권리의 중요한
              변경이 있을 경우에는 최소 30일 전에 공지합니다.
            </li>
          </ol>
        </Section>

        <Section title="제5조 (수집하는 개인정보 항목)">
          <p className="mb-4">회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>

          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-800">1. 회원가입 및 인증</p>
              <ul className="mt-1 list-disc space-y-1 pl-6 text-gray-700">
                <li>
                  <strong>필수</strong>: 이메일 주소, 이름(닉네임)
                </li>
                <li>
                  <strong>선택</strong>: 프로필 사진
                </li>
                <li>
                  <strong>소셜 로그인(Google)</strong>: Google 계정 이메일, 이름, 프로필 사진
                  (Google 제공 범위 내)
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800">2. 서비스 이용</p>
              <ul className="mt-1 list-disc pl-6 text-gray-700">
                <li>
                  <strong>필수</strong>: 프로젝트 및 노드 생성·수정 내용, 채팅 메시지, 회의 음성
                  자막, 첨부 파일, 등록 URL
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800">3. 서비스 이용 및 부정 이용 확인</p>
              <ul className="mt-1 list-disc pl-6 text-gray-700">
                <li>
                  <strong>필수</strong>: 서비스 이용 기록, 쿠키, 접속지 정보(IP 주소), 기기 정보
                </li>
              </ul>
              <blockquote className="mt-2 rounded-md border-l-4 border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                부정이용이란 회원탈퇴 후 재가입, 이벤트 혜택 등을 불·편법적으로 수취하는 행위,
                이용약관에서 금지하는 행위, 명의도용 등을 말합니다.
              </blockquote>
            </div>
          </div>
        </Section>

        <Section title="제6조 (개인정보 수집 방법)">
          <p className="mb-2">회사는 다음과 같은 방법으로 이용자의 개인정보를 수집합니다.</p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>이용자가 서비스 내 회원가입 및 정보 수정 화면에서 직접 입력하는 방식</li>
            <li>Google 소셜 로그인 연동 시 OAuth 방식으로 수집되는 방식</li>
            <li>서비스 이용 과정에서 자동으로 생성·수집되는 방식 (로그, 쿠키, 기기 정보 등)</li>
          </ol>
        </Section>

        <Section title="제7조 (개인정보의 이용)">
          <p className="mb-2">회사는 수집한 개인정보를 다음 각 호의 경우에 이용합니다.</p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>회원 식별 및 인증, 서비스 제공을 위한 경우</li>
            <li>프로젝트 멤버 초대 및 알림 발송을 위한 경우</li>
            <li>AI 기능(회의 요약, 노드 분석, 채팅 응답 등) 제공을 위한 경우</li>
            <li>공지사항 전달 등 서비스 운영에 필요한 경우</li>
            <li>이용 문의 회신, 불만 처리 등 이용자 서비스 개선을 위한 경우</li>
            <li>법령 및 약관 위반 행위에 대한 이용 제한·제재, 부정 이용 방지를 위한 경우</li>
            <li>신규 서비스 개발 및 기존 서비스 개선을 위한 경우</li>
            <li>서비스 이용 기록의 통계·분석을 위한 경우</li>
          </ol>
        </Section>

        <Section title="제8조 (개인정보의 제3자 제공)">
          <ol className="list-decimal space-y-3 pl-6">
            <li>
              회사는 이용자의 사전 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음 각
              호에 해당하는 경우는 예외로 합니다.
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>이용자가 사전에 동의한 경우</li>
                <li>
                  법령의 규정에 의하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의
                  요구가 있는 경우
                </li>
              </ul>
            </li>
            <li>
              프로젝트 협업 서비스의 특성상 이용자가 프로젝트에 초대한 멤버에게는 해당 이용자의
              이메일, 닉네임, 프로필 사진이 공개될 수 있습니다. 이는 이용자의 서비스 이용 행위에
              의한 공개로 간주합니다.
            </li>
            <li>
              제3자 제공 관계에 변화가 있거나 제공 관계가 종결될 때 동일한 절차에 의해 이용자에게
              고지 및 동의를 구합니다.
            </li>
          </ol>
        </Section>

        <Section title="제9조 (개인정보의 보유 및 이용기간)">
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              회사는 이용자의 개인정보에 대해 개인정보의 수집·이용 목적 달성을 위한 기간 동안
              개인정보를 보유 및 이용합니다.
            </li>
            <li>
              회원 탈퇴 시 개인정보는 즉시 파기합니다. 단, 다음 각 호의 경우에는 해당 기간 동안
              보관합니다.
              <ul className="mt-2 list-disc pl-6">
                <li>
                  부정 이용 기록: 회원 탈퇴 시점으로부터 최대 <strong>1년</strong>
                </li>
              </ul>
            </li>
          </ol>
        </Section>

        <Section title="제10조 (법령에 따른 개인정보의 보유 및 이용기간)">
          <p className="mb-4">회사는 관계 법령에 따라 다음과 같이 개인정보를 보유 및 이용합니다.</p>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="px-4 py-3 text-left font-medium">근거 법령</th>
                  <th className="px-4 py-3 text-left font-medium">보유 정보</th>
                  <th className="px-4 py-3 text-left font-medium">보유 기간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {[
                  [
                    '전자상거래 등에서의 소비자보호에 관한 법률',
                    '계약 또는 청약철회 등에 관한 기록',
                    '5년',
                  ],
                  [
                    '전자상거래 등에서의 소비자보호에 관한 법률',
                    '대금결제 및 재화 등의 공급에 관한 기록',
                    '5년',
                  ],
                  [
                    '전자상거래 등에서의 소비자보호에 관한 법률',
                    '소비자 불만 또는 분쟁처리에 관한 기록',
                    '3년',
                  ],
                  ['전자상거래 등에서의 소비자보호에 관한 법률', '표시·광고에 관한 기록', '6개월'],
                  ['통신비밀보호법', '웹사이트 로그 기록 자료', '3개월'],
                  ['전자금융거래법', '전자금융거래에 관한 기록', '5년'],
                ].map(([law, info, period]) => (
                  <tr key={info} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{law}</td>
                    <td className="px-4 py-3">{info}</td>
                    <td className="px-4 py-3 font-medium">{period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="제11조 (개인정보의 파기)">
          <ol className="list-decimal space-y-3 pl-6">
            <li>
              <strong>파기 원칙</strong>: 회사는 개인정보의 처리 목적 달성, 보유·이용기간 경과 등
              개인정보가 불필요하게 된 경우 지체 없이 해당 정보를 파기합니다.
            </li>
            <li>
              <strong>파기 절차</strong>: 이용자가 입력한 정보는 목적 달성 후 별도 DB로 이전되어
              내부 방침 및 관련 법령에 따라 일정 기간 보관 후 파기됩니다. 파기는 개인정보보호
              책임자의 승인 절차를 거쳐 진행됩니다.
            </li>
            <li>
              <strong>파기 방법</strong>:
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>전자적 파일: 복구 불가능한 기술적 방법으로 삭제</li>
                <li>종이 출력물: 분쇄기로 분쇄하거나 소각</li>
              </ul>
            </li>
          </ol>
        </Section>

        <Section title="제12조 (광고성 정보의 전송 조치)">
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우 이용자의
              명시적인 사전 동의를 받습니다.
            </li>
            <li>
              수신자가 수신 거부 의사를 표시하거나 사전 동의를 철회한 경우 광고성 정보를 전송하지
              않으며, 처리 결과를 알립니다.
            </li>
            <li>
              오후 9시부터 다음 날 오전 8시까지는 별도의 사전 동의를 받은 경우에만 광고성 정보를
              전송합니다.
            </li>
            <li>광고성 정보 전송 시 회사명·연락처 및 수신 거부 방법을 명시합니다.</li>
          </ol>
        </Section>

        <Section title="제13조 (개인정보 자동 수집 장치의 설치·운영 및 거부)">
          <ol className="list-decimal space-y-3 pl-6">
            <li>
              회사는 이용자에게 맞춤 서비스를 제공하기 위해 쿠키(Cookie)를 사용합니다. 쿠키는 서버가
              이용자의 웹브라우저에 전송하는 소량의 정보로, 이용자의 저장공간에 저장됩니다.
            </li>
            <li>
              이용자는 웹브라우저 설정을 통해 쿠키 허용·거부를 선택할 수 있습니다. 다만, 쿠키를
              거부하면 로그인이 필요한 일부 서비스 이용에 어려움이 있을 수 있습니다.
            </li>
            <li>
              브라우저별 쿠키 설정 방법:
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>
                  <strong>Chrome</strong>: 설정 메뉴 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트
                  데이터
                </li>
                <li>
                  <strong>Edge</strong>: 설정 메뉴 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트
                  데이터 관리 및 삭제
                </li>
                <li>
                  <strong>Whale</strong>: 설정 메뉴 &gt; 개인정보 보호 &gt; 쿠키 및 기타 사이트
                  데이터
                </li>
              </ul>
            </li>
          </ol>
        </Section>

        <Section title="제14조 (이용자의 권리 및 의무)">
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              이용자는 언제든지 마이페이지를 통해 자신의 개인정보를 조회·수정·삭제할 수 있으며, 회원
              탈퇴를 통해 개인정보 처리 정지를 요청할 수 있습니다.
            </li>
            <li>
              이용자는 자신의 개인정보를 최신 상태로 유지해야 하며, 부정확한 정보 입력으로 발생하는
              문제의 책임은 이용자 본인에게 있습니다.
            </li>
            <li>
              타인의 개인정보를 도용하여 회원가입한 경우 이용자 자격을 상실하거나 관련 법령에 의해
              처벌받을 수 있습니다.
            </li>
            <li>
              이용자는 이메일 주소, 비밀번호 등 계정 정보에 대한 보안을 유지할 책임이 있으며,
              제3자에게 양도하거나 대여할 수 없습니다.
            </li>
          </ol>
        </Section>

        <Section title="제15조 (개인정보보호 책임자)">
          <p className="mb-4">
            회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여
            개인정보보호 책임자를 지정합니다. 개인정보와 관련한 문의사항은 서비스 내 고객센터 또는
            아래 연락처로 문의하시기 바랍니다.
          </p>
          <div className="rounded-lg bg-gray-50 px-6 py-4 text-sm text-gray-700">
            <p>
              <strong>개인정보보호 책임자</strong>: 플로밋 운영팀
            </p>
            <p>
              <strong>이메일</strong>:{' '}
              <a className="text-blue-600 underline" href="mailto:privacy@flowmeet.kr">
                flowmeet2026@google.com
              </a>
            </p>
          </div>
        </Section>

        <Section title="제16조 (권익침해에 대한 구제방법)">
          <p className="mb-4">
            이용자는 개인정보 침해로 인한 구제를 받기 위하여 아래 기관에 문의하실 수 있습니다.
          </p>
          <div className="mb-4 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="px-4 py-3 text-left font-medium">기관</th>
                  <th className="px-4 py-3 text-left font-medium">연락처</th>
                  <th className="px-4 py-3 text-left font-medium">웹사이트</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {[
                  ['개인정보분쟁조정위원회', '1833-6972 (국번 없이)', 'www.kopico.go.kr'],
                  ['개인정보침해신고센터', '118 (국번 없이)', 'privacy.kisa.or.kr'],
                  ['대검찰청', '1301 (국번 없이)', 'www.spo.go.kr'],
                  ['경찰청', '182 (국번 없이)', 'ecrm.cyber.go.kr'],
                ].map(([org, tel, site]) => (
                  <tr key={org} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{org}</td>
                    <td className="px-4 py-3">{tel}</td>
                    <td className="px-4 py-3 text-blue-600">{site}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-3 text-sm text-gray-600">
            개인정보보호법 제35조(열람), 제36조(정정·삭제), 제37조(처리정지)에 의한 요구에 대해
            공공기관의 처분 또는 부작위로 권익을 침해받은 경우 행정심판을 청구할 수 있습니다.
          </p>
          <p className="text-sm text-gray-600">
            <strong>중앙행정심판위원회</strong>: 110 (국번 없이) / www.simpan.go.kr
          </p>
        </Section>

        <section className="rounded-lg bg-gray-50 px-6 py-5">
          <h2 className="mb-3 text-lg font-bold text-gray-900">부 칙</h2>
          <p className="text-gray-700">
            <strong>제1조 (시행일)</strong>: 본 방침은 2026년 05월 15일부터 시행합니다.
          </p>
        </section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-gray-900">{title}</h2>
      <div className="leading-7 text-gray-700">{children}</div>
      <hr className="mt-10 border-gray-100" />
    </section>
  );
}
