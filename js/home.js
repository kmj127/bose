/* =========================================================
   home.js — Home 페이지 전용 스크립트
     1) product 섹션의 가로 슬라이더 (Swiper)
     2) keyword 섹션의 MORE 확대 모션 (섹션 진입 시 재생, GSAP timeline)
     3) menu_list 섹션의 호버 프리뷰 이미지 (커서 따라다니는 썸네일)
     4) app 섹션의 제목/설명 슬라이드인 (섹션 진입 시 재생)
     5) 풀페이지 스냅 스크롤 (GSAP Observer)
   ========================================================= */

function initProductSlider(reduceMotion) {
  const sliderEl = document.querySelector(".product_slider");
  if (!sliderEl || typeof Swiper === "undefined") return;

  new Swiper(sliderEl, {
    slidesPerView: "auto",
    spaceBetween: 48,
    centeredSlides: true,
    loop: true,
    grabCursor: true,
    allowTouchMove: true,
    speed: 6000,
    autoplay: reduceMotion
      ? false
      : { delay: 1, disableOnInteraction: false, pauseOnMouseEnter: true },
    keyboard: { enabled: true },
  });
}

/* MORE: 더 이상 scroll scrub이 아니라, keyword 섹션이 활성화될 때
   한 번 재생되는 타임라인. initFullPageScroll이 이 함수가 반환한
   타임라인을 재생/역재생시켜 줍니다. */
function initKeywordGrow(reduceMotion) {
  const hearEl = document.querySelector(".keyword_word.keyword_main");
  const growEl = document.querySelector(".keyword_grow");
  if (!hearEl || !growEl || typeof gsap === "undefined") return null;

  if (reduceMotion) {
    gsap.set([hearEl, growEl], { scale: 1, opacity: 1, x: 0, y: 0 });
    return null;
  }

  gsap.set(hearEl, { scale: 0.8, opacity: 0, y: 16 });
  gsap.set(growEl, { scale: 0.4, opacity: 0.4, y: 0 });

  const tl = gsap.timeline({ paused: true })
    .to(hearEl, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
    })
    .to(
      growEl,
      {
        y: 28,
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
      },
      "-=0.4"
    );

  return tl;
}

function initGalleryCarousel(reduceMotion) {
  const gallery = document.querySelector(".gallery");
  const slides = Array.from(gallery?.querySelectorAll(".gallery_item") ?? []);
  if (!gallery || slides.length < 2) return;

  if (reduceMotion) {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === 0);
      slide.classList.remove("is-prev", "is-next", "is-hidden");
    });
    return;
  }

  let activeIndex = 0;

  function updateSlides() {
    slides.forEach((slide, index) => {
      const offset = (index - activeIndex + slides.length) % slides.length;
      slide.classList.remove("is-active", "is-prev", "is-next", "is-hidden");

      if (offset === 0) {
        slide.classList.add("is-active");
      } else if (offset === 1 || offset === -(slides.length - 1)) {
        slide.classList.add("is-next");
      } else if (offset === slides.length - 1 || offset === -1) {
        slide.classList.add("is-prev");
      } else {
        slide.classList.add("is-hidden");
      }
    });
  }

  updateSlides();
  const intervalId = window.setInterval(() => {
    activeIndex = (activeIndex + 1) % slides.length;
    updateSlides();
  }, 4000);

  return () => window.clearInterval(intervalId);
}

/* ---------- menu_list : 호버 시 커서를 따라다니는 프리뷰 이미지 ----------
   각 .menu_row의 data-preview 경로를 읽어 .menu_preview_img의 src를 바꾸고,
   mousemove로 .menu_list(섹션) 기준 상대 좌표를 계산해 위치를 갱신합니다. */
function initMenuPreview(reduceMotion) {
  const list = document.querySelector(".menu_list");
  const preview = list?.querySelector(".menu_preview");
  const img = preview?.querySelector(".menu_preview_img");
  const rows = list ? Array.from(list.querySelectorAll(".menu_row")) : [];

  if (!list || !preview || !img || !rows.length) return;

  // 모션을 줄이고 싶은 환경에서는 이미지 자체는 유지하되
  // 부드러운 추적 대신 즉시 위치만 반영합니다.
  const transitionOverride = reduceMotion ? "opacity 0.01s linear" : "";
  if (transitionOverride) preview.style.transition = transitionOverride;

  function moveTo(clientX, clientY) {
    const rect = list.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    preview.style.left = `${x}px`;
    preview.style.top = `${y}px`;
  }

  rows.forEach((row) => {
    const src = row.dataset.preview;

    row.addEventListener("mouseenter", (e) => {
      if (src) img.src = src;
      moveTo(e.clientX, e.clientY);
      preview.classList.add("is-active");
    });

    row.addEventListener("mousemove", (e) => {
      moveTo(e.clientX, e.clientY);
    });

    row.addEventListener("mouseleave", () => {
      preview.classList.remove("is-active");
    });

    // 모바일/터치 환경 대비: 포커스 시에도 최소한 이미지가 보이도록
    row.addEventListener("focus", () => {
      if (src) img.src = src;
      const rect = row.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      preview.style.left = `${rect.left - listRect.left + rect.width / 2}px`;
      preview.style.top = `${rect.top - listRect.top}px`;
      preview.classList.add("is-active");
    });

    row.addEventListener("blur", () => {
      preview.classList.remove("is-active");
    });
  });
}

/* ---------- app : 섹션 진입 시 app_title/app_desc 왼쪽에서 슬라이드인 ---------- */
function playAppReveal(section) {
  const title = section.querySelector(".app_title");
  const desc = section.querySelector(".app_desc");
  if (title) title.classList.add("is-revealed");
  if (desc) desc.classList.add("is-revealed");
}

function resetAppReveal(section) {
  const title = section.querySelector(".app_title");
  const desc = section.querySelector(".app_desc");
  if (title) title.classList.remove("is-revealed");
  if (desc) desc.classList.remove("is-revealed");
}

/* ---------- 풀페이지 스냅 스크롤 ---------- */
function initFullPageScroll(reduceMotion, keywordTl) {
  if (typeof gsap === "undefined" || typeof Observer === "undefined") return;

  const sections = gsap.utils.toArray(".fp_section");
  if (!sections.length) return;

  const wrapper = document.querySelector(".fp_wrapper");
  if (wrapper) wrapper.classList.add("is-fp-ready");

  gsap.registerPlugin(Observer);

  let currentIndex = 0;
  let isAnimating = false;

  gsap.set(sections, { opacity: 0, yPercent: 0, pointerEvents: "none" });
  gsap.set(sections[0], { opacity: 1, pointerEvents: "auto" });
  sections.forEach((section) => section.classList.remove("is_active"));
  sections[0].classList.add("is_active");

  function showSection(index) {
    if (index < 0 || index >= sections.length || index === currentIndex) return;

    isAnimating = true;
    const dir = index > currentIndex ? 1 : -1;
    const prevSection = sections[currentIndex];
    const nextSection = sections[index];

    const tl = gsap.timeline({
      defaults: { duration: reduceMotion ? 0 : 0.9, ease: "power2.inOut" },
      onComplete: () => {
        isAnimating = false;
      },
    });

    tl.to(prevSection, { yPercent: -12 * dir, opacity: 0, pointerEvents: "none" })
      .fromTo(nextSection, { yPercent: 12 * dir, opacity: 0, pointerEvents: "none" }, { yPercent: 0, opacity: 1, pointerEvents: "auto" }, 0);

    prevSection.classList.remove("is_active");
    nextSection.classList.add("is_active");
    prevSection.style.pointerEvents = "none";
    nextSection.style.pointerEvents = "auto";

    if (keywordTl) {
      if (nextSection.classList.contains("keyword")) {
        keywordTl.restart();
      } else if (prevSection.classList.contains("keyword")) {
        keywordTl.pause(0);
      }
    }

    if (nextSection.classList.contains("app")) {
      playAppReveal(nextSection);
    } else if (prevSection.classList.contains("app")) {
      resetAppReveal(prevSection); // 다시 들어왔을 때 애니메이션 재생되도록 초기화
    }

    currentIndex = index;
  }

  function attemptMove(direction) {
    if (isAnimating) return;

    const section = sections[currentIndex];

    if (section.hasAttribute("data-fp-scroll")) {
      const atTop = section.scrollTop <= 0;
      const atBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 1;

      if (direction > 0 && !atBottom) {
        section.scrollBy({ top: 150, behavior: "smooth" });
        return;
      }
      if (direction < 0 && !atTop) {
        section.scrollBy({ top: -150, behavior: "smooth" });
        return;
      }
    }

    showSection(currentIndex + direction);
  }

  /* ---------------------------------------------------------
     wheelSpeed: -1 을 쓰면 델타 부호가 뒤집히기 때문에
     GSAP Observer 컨벤션상 onDown/onUp이 아래처럼 매핑됩니다:
       onDown → 휠을 위로 굴릴 때 → 이전 섹션(-1)
       onUp   → 휠을 아래로 굴릴 때 → 다음 섹션(+1)
     (원래 코드가 맞는 조합이었습니다.)
     --------------------------------------------------------- */
  Observer.create({
    target: window,
    type: "wheel,touch",
    wheelSpeed: -1,
    tolerance: 10,
    preventDefault: true,
    onDown: () => attemptMove(-1),
    onUp: () => attemptMove(1),
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") attemptMove(1);
    if (e.key === "ArrowUp" || e.key === "PageUp") attemptMove(-1);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  initProductSlider(reduceMotion);
  const keywordTl = initKeywordGrow(reduceMotion);
  initGalleryCarousel(reduceMotion);
  initMenuPreview(reduceMotion);
  initFullPageScroll(reduceMotion, keywordTl);

  if (reduceMotion) {
    const appSection = document.querySelector(".app");
    if (appSection) playAppReveal(appSection);
  }
});