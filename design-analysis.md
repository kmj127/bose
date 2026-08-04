# [bose] 디자인 분석표

## 확인한 자료

- 디자인 원본: [이 1개의 디자인을 Figma에서 구현하세요.
@https://www.figma.com/design/2wHicEsAeYVlXcMARhlEHN/%EA%B9%80%EB%AF%BC%EC%A3%BC?node-id=1365-2679&m=dev]
- 확인한 화면: [home,about,history,technology,shop]
- 실제 에셋 위치: [images]

## 화면 목록

| 화면         | 목적                                     | 주요 행동                                  | 필요한 상태  |
| ------------ | ---------------------------------------- | ------------------------------------------ | ------------ |
| [Home] | [Bose 브랜드와 주요 콘텐츠를 탐색하고 원하는 페이지로 이동] | [스크롤, CTA 버튼 클릭, 메뉴 이동] | 
[기본, 로딩] |
| [About] | [Bose의 브랜드 철학과 스토리를 확인] | [스크롤, 이미지 확인] | 
[기본, 로딩, 스크롤] |
| [History] | [타임라인 스크롤] | [기본, 로딩] | 
[기본·로딩] |
| [Technology] | [핵심 기술(CustomTune, Immersive Audio 등)을 이해] | [스크롤, 기술 정보 확인, 제품 이동] | 
[기본, 로딩, 인터랙션] |
| [Shop] | [제품을 탐색하고 원하는 제품을 선택] | [카테고리 선택, 제품 클릭, 스크롤] | 
[기본, 로딩, 빈 상태(검색 결과 없음), 오류] |

## 공통 영역

- 헤더: [ 
  - BOSE 로고
  - Home / About / History / Technology / Product 메뉴
  - 현재 페이지 Active 표시]
- 푸터: [  
  - BOSE 로고
  - Home / About / History / Technology / Product 링크
  - YouTube, Instagram SNS 아이콘
  - 고객센터 및 AS센터 연락처
  - 회사 주소
  - 이용약관
  - 개인정보처리방침]
- 공통 버튼: [기본, hover, focus, disabled]
- 공통 카드: 
- [Product Card
제품 이미지
제품명
가격
Hover 시 강조 효과
동일한 카드 크기와 간격 반복]
- [Technology Card
기술 이미지
기술명
설명
좌우 교차 레이아웃 반복]
- [History Card
연도
이미지
설명
Timeline 형식 반복]

## 디자인 토큰

- 배경색: [#0D0D0D]
- 본문색: [#F2F2F2]
- 강조색: [#FF6B35]
- 제목 폰트: [Montserrat Medium
font-size: 48px;
font-weight: 700;
line-height: 120%;]
- 본문 폰트: [font-family: Pretendard;
font-size: 16px;
font-weight: 400;
line-height: 160%;]
- 기본 간격: [4px, 8px 등 확인한 규칙]
- 라운드: [- 라운드:
  - 버튼: 999px
  - 카드: 12px
  - 입력창: 8px]
- 그림자: [- 그림자: 사용하지 않음]

## 반응형

- 360px: [  
  - 메뉴는 햄버거 메뉴로 변경
  - 카드와 이미지는 세로 배치
  - 일부 장식 요소 및 큰 배경 이미지는 숨김]
- 768px: 
- [
  - 2열(Grid 2 Columns) 레이아웃
  - 이미지와 텍스트를 좌우 배치
  - Navigation은 축약 형태 유지
  - 카드 크기 및 여백 조정
]
- 1920px: [
 - 최대 콘텐츠 폭 1280px
  - 12-Column Grid 사용
  - Hero, Technology, Product 영역은 좌우 2열 구성
  - Header와 Footer 전체 메뉴 표시]

## 인터랙션

- 메뉴: [- 메뉴
  - 메뉴 클릭 시 해당 섹션으로 이동
  - 현재 페이지(메뉴) 활성화 표시
  - 모바일에서는 햄버거 메뉴 열기/닫기]
- 버튼: [  - Hover: 배경 또는 텍스트 색상 변경으로 클릭 가능 상태 강조
  - Pressed: 클릭 시 페이지 또는 해당 섹션으로 이동
  - Disabled: 비활성 상태(필요 시 opacity 적용)
]
- 스크롤: [ Hero → About → History → Technology → Shop 순으로 스크롤
  - 스크롤 시 섹션별 콘텐츠 순차 등장(Fade In)
  - Technology 섹션에서는 스크롤에 따라 이미지와 텍스트가 변경됨
  - Header는 상단에 고정(Sticky)]
- 애니메이션: [  - Hero: 페이지 진입 시 텍스트와 이미지 Fade In
  - About/History: 스크롤 진입 시 Fade Up
  - Technology: 스크롤에 따라 제품 이미지 전환 및 설명 변경
  - Shop: 카드 Hover 시 이미지 또는 버튼 강조]

## 에셋

- 로고: [images/]
- 이미지: [images/]
- 아이콘: [실제 파일 또는 사용 중인 아이콘 세트]
- 폰트: [Montserrat, Pretendard]

## 확인된 사실

- [메인 페이지는 Hero, About, History, Technology, Shop 섹션으로 구성되어 있다.
- 데스크톱 프레임은 1920×1080 기준으로 제작되었다.
- 브랜드의 메인 컬러는 Black 계열이며, Orange를 포인트 컬러로 사용하였다.
- 영문은 Montserrat, 국문은 Pretendard 폰트를 사용하였다.
- Header와 Footer는 모든 화면에서 공통 컴포넌트로 사용된다.
- CTA 버튼은 페이지 이동 및 섹션 이동 기능을 수행한다.
- Technology 섹션은 스크롤에 따라 콘텐츠가 순차적으로 변경되도록 설계되었다.
- Product 카드는 동일한 레이아웃과 간격을 반복하여 사용한다.
- 아이콘은 SVG 형식을 사용하였다.
- 로고와 제품 이미지는 images폴더로 관리한다.
]

## 아직 확인하지 못한 내용

- [추정하지 말고 질문하거나 확인해야 할 내용
  - 모바일(360px) 및 태블릿(768px) 반응형 레이아웃 적용 여부
- 로딩 화면 및 오류 화면 디자인 유무
- 빈 상태(Empty State) 화면 구성 여부
- 접근성(키보드 탐색, 포커스 표시, 색상 대비) 적용 여부
- 실제 아이콘 라이브러리(Font Awesome, Material Icons 등) 사용 여부
- 최종 이미지 및 로고 파일 경로
- 실제 웹 구현 시 사용한 애니메이션 라이브러리(GSAP, CSS Animation 등) 적용 범위]