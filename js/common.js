/* =========================================================
   common.js — 전 페이지 공통 스크립트

   역할
     1) 공통 헤더 / 네비 오버레이 / 푸터 주입
     2) 햄버거 열기·닫기
     3) 현재 페이지 메뉴 활성화
     4) 스크롤 등장 애니메이션

   각 HTML <body>에
   data-page="home|about|history|technology|shop"
   를 지정하면 해당 메뉴가 자동으로 활성화됩니다.
   ========================================================= */


/* =========================================================
   공통 데이터 : 네비 메뉴
   ========================================================= */

const NAV_ITEMS = [
  { key: "home", label: "Home", href: "home.html" },
  { key: "about", label: "About", href: "about.html" },
  { key: "history", label: "History", href: "history.html" },
  { key: "technology", label: "Technology", href: "technology.html" },
  { key: "shop", label: "Shop", href: "shop.html" },
  { key: "support", label: "Support", href: "#footer_contact" },
];


/* =========================================================
   오버레이 하단 링크
   ========================================================= */

const NAV_SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Join Bose", href: "#" },
  { label: "Contact", href: "#footer_contact" },
];


/* =========================================================
   1) 헤더 + 네비 오버레이 마크업 생성
   ========================================================= */

function renderHeader(currentPage) {

  const header = document.createElement("header");

  header.className = "site_header";

  header.innerHTML = `
    <div class="site_header__inner">

      <button
        class="header_menu_btn"
        type="button"
        aria-label="메뉴 열기"
        aria-expanded="false"
        aria-controls="nav_overlay"
      >
        <span
          class="icon_mask icon_menu"
          aria-hidden="true"
        ></span>

        <span class="sr_only">
          메뉴
        </span>
      </button>


      <a
        class="header_logo"
        href="home.html"
        aria-label="BOSE 홈으로"
      >
        BOSE
      </a>


      <div class="header_actions">

        <a href="shop.html">
          SHOP NOW
        </a>

        <a
          href="shop.html"
          aria-label="장바구니 (표시 전용)"
        >
          CART
        </a>

      </div>

    </div>
  `;


  /* -------------------------------------------------------
     네비게이션 오버레이
     ------------------------------------------------------- */

  const overlay = document.createElement("nav");

  overlay.className = "nav_overlay";

  overlay.id = "nav_overlay";

  overlay.setAttribute(
    "aria-label",
    "주 메뉴"
  );


  overlay.innerHTML = `

    <div class="nav_overlay__top">

      <button
        class="nav_close_btn"
        type="button"
        aria-label="메뉴 닫기"
      >
        <span
          class="nav_close_line nav_close_line--1"
          aria-hidden="true"
        ></span>

        <span
          class="nav_close_line nav_close_line--2"
          aria-hidden="true"
        ></span>

      </button>

    </div>


    <ul class="nav_list">

      ${NAV_ITEMS.map(
        (item) => `

        <li>

          <a
            href="${item.href}"
            data-label="${item.label}"
            class="${item.key === currentPage ? "is_active" : ""}"
            ${item.key === currentPage
              ? 'aria-current="page"'
              : ""}
          >
            ${item.label}
          </a>

        </li>

      `
      ).join("")}

    </ul>


    <div class="nav_overlay__bottom">

      ${NAV_SOCIAL_LINKS.map(
        (item) => `
          <a href="${item.href}">
            ${item.label}
          </a>
        `
      ).join("")}

    </div>

  `;


  document.body.prepend(overlay);

  document.body.prepend(header);


  wireMenu(
    header,
    overlay
  );
}


/* =========================================================
   햄버거 열기 / 닫기 동작
   ========================================================= */

function wireMenu(header, overlay) {

  const openBtn =
    header.querySelector(".header_menu_btn");

  const closeBtn =
    overlay.querySelector(".nav_close_btn");


  const handleOpen = () => {

    overlay.classList.add("is_open");

    openBtn.setAttribute(
      "aria-expanded",
      "true"
    );

    document.body.style.overflow = "hidden";

    closeBtn.focus();
  };


  const handleClose = () => {

    overlay.classList.remove("is_open");

    openBtn.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.style.overflow = "";

    openBtn.focus();
  };


  openBtn.addEventListener(
    "click",
    handleOpen
  );


  closeBtn.addEventListener(
    "click",
    handleClose
  );


  /* ESC 로 닫기 */

  document.addEventListener(
    "keydown",
    (e) => {

      if (
        e.key === "Escape" &&
        overlay.classList.contains("is_open")
      ) {
        handleClose();
      }

    }
  );
}


/* =========================================================
   2) 푸터 마크업 생성
   ========================================================= */

function renderFooter() {

  const footer =
    document.createElement("footer");


  footer.className =
    "site_footer";


  footer.id =
    "footer_contact";


  footer.innerHTML = `

    <div class="site_footer__inner">


      <!-- =================================================
           푸터 상단
           ================================================= -->

      <div class="site_footer__top">


        <!-- BOSE 로고 -->

        <a
          class="footer_logo"
          href="home.html"
          lang="en"
          aria-label="BOSE 홈으로"
        >
          BOSE
        </a>


        <!-- =================================================
             오른쪽 영역
             ================================================= -->

        <div class="footer_right">


          <!-- SNS -->

          <div class="footer_social">


            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >

              <span
                class="icon_mask icon_youtube"
                aria-hidden="true"
              ></span>

            </a>


            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >

              <span
                class="icon_mask icon_instagram"
                aria-hidden="true"
              ></span>

            </a>


          </div>


          <!-- =================================================
               푸터 메뉴

               이미지 기준:
               Home / About / History /
               Technology / Product
               ================================================= -->

          <nav
            class="footer_nav"
            lang="en"
            aria-label="푸터 메뉴"
          >

            <a href="home.html">
              Home
            </a>

            <a href="about.html">
              About
            </a>

            <a href="history.html">
              History
            </a>

            <a href="technology.html">
              Technology
            </a>

            <a href="shop.html">
              Product
            </a>

          </nav>


          <!-- =================================================
               고객센터
               ================================================= -->

          <p class="footer_contact">
            고객센터 070-8655-2261 / AS센터 02-3446-3514
          </p>


        </div>

      </div>


      <!-- =================================================
           푸터 하단
           ================================================= -->

      <div class="site_footer__bottom">


        <!-- 회사 정보 -->

        <div class="footer_info">

          <p>
            더블정보기술(주) 서울특별시 용산구 한강대로52길 25-8 5F
          </p>

        </div>


        <!-- 약관 -->

        <div class="footer_policy">

          <a href="#">
            이용약관
          </a>

          <a href="#">
            개인정보처리방침
          </a>

        </div>


      </div>


    </div>

  `;


  document.body.appendChild(
    footer
  );
}


/* =========================================================
   3) 헤더 스크롤 방향 감지

   아래로 스크롤 → 숨김
   위로 스크롤 → 표시
   ========================================================= */

function initHeaderScrollBehavior() {

  const header =
    document.querySelector(".site_header");


  if (!header) return;


  let lastScrollY =
    window.scrollY;


  let ticking =
    false;


  let touchStartY =
    0;


  /* -------------------------------------------------------
     헤더 표시 / 숨김
     ------------------------------------------------------- */

  const setHeaderVisibility =
    (shouldShow) => {

      if (shouldShow) {

        header.classList.remove(
          "is_hidden"
        );

        header.classList.add(
          "is_visible"
        );

      } else {

        header.classList.remove(
          "is_visible"
        );

        header.classList.add(
          "is_hidden"
        );

      }

    };


  /* -------------------------------------------------------
     스크롤 위치 확인
     ------------------------------------------------------- */

  const updateHeaderByScroll =
    () => {

      const currentScrollY =
        window.scrollY;


      const isScrollingDown =
        currentScrollY >
          lastScrollY &&
        currentScrollY >
          24;


      setHeaderVisibility(
        !isScrollingDown
      );


      lastScrollY =
        currentScrollY;


      ticking =
        false;
    };


  /* -------------------------------------------------------
     Scroll
     ------------------------------------------------------- */

  const onScroll =
    () => {

      if (!ticking) {

        window.requestAnimationFrame(
          updateHeaderByScroll
        );

        ticking =
          true;
      }

    };


  /* -------------------------------------------------------
     Mouse Wheel
     ------------------------------------------------------- */

  const onWheel =
    (event) => {

      if (event.deltaY > 0) {

        setHeaderVisibility(
          false
        );

      } else if (
        event.deltaY < 0
      ) {

        setHeaderVisibility(
          true
        );

      }

    };


  /* -------------------------------------------------------
     Touch Start
     ------------------------------------------------------- */

  const onTouchStart =
    (event) => {

      touchStartY =
        event.changedTouches?.[0]?.clientY ?? 0;

    };


  /* -------------------------------------------------------
     Touch End
     ------------------------------------------------------- */

  const onTouchEnd =
    (event) => {

      const endY =
        event.changedTouches?.[0]?.clientY ??
        touchStartY;


      const deltaY =
        endY -
        touchStartY;


      if (deltaY > 0) {

        setHeaderVisibility(
          false
        );

      } else if (
        deltaY < 0
      ) {

        setHeaderVisibility(
          true
        );

      }

    };


  /* -------------------------------------------------------
     Keyboard
     ------------------------------------------------------- */

  const onKeyDown =
    (event) => {

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown"
      ) {

        setHeaderVisibility(
          false
        );

      }


      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp"
      ) {

        setHeaderVisibility(
          true
        );

      }

    };


  /* -------------------------------------------------------
     Event 등록
     ------------------------------------------------------- */

  window.addEventListener(
    "scroll",
    onScroll,
    {
      passive: true
    }
  );


  window.addEventListener(
    "wheel",
    onWheel,
    {
      passive: true
    }
  );


  window.addEventListener(
    "touchstart",
    onTouchStart,
    {
      passive: true
    }
  );


  window.addEventListener(
    "touchend",
    onTouchEnd,
    {
      passive: true
    }
  );


  window.addEventListener(
    "keydown",
    onKeyDown
  );


  header.classList.add(
    "is_visible"
  );
}


/* =========================================================
   4) 스크롤 등장 애니메이션

   [data-reveal] 요소가 화면에 들어오면
   .is_in 클래스 부여
   ========================================================= */

function initScrollReveal() {

  const targets =
    document.querySelectorAll(
      "[data-reveal]"
    );


  if (!targets.length) return;


  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduceMotion) {

    targets.forEach(
      (el) => {

        el.classList.add(
          "is_in"
        );

      }
    );

    return;
  }


  const observer =
    new IntersectionObserver(

      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting
            ) {

              const delay =
                entry.target.dataset
                  .revealDelay;


              if (delay) {

                entry.target.style
                  .transitionDelay =
                  `${delay}ms`;

              }


              entry.target.classList.add(
                "is_in"
              );


              observer.unobserve(
                entry.target
              );

            }

          }
        );

      },

      {
        threshold: 0.15,
        rootMargin:
          "0px 0px -8% 0px"
      }

    );


  targets.forEach(
    (el) => {

      observer.observe(
        el
      );

    }
  );
}


/* =========================================================
   초기화
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const currentPage =
      document.body.dataset.page ||
      "home";


    /* 헤더 */

    renderHeader(
      currentPage
    );


    /* 푸터 */

    renderFooter();


    /* 헤더 스크롤 */

    initHeaderScrollBehavior();


    /* 스크롤 등장 */

    initScrollReveal();

  }
);