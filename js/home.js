/* =========================================================
   home.js — Home 페이지 전용 스크립트
     1) product 섹션의 가로 슬라이더 (Swiper)
     2) keyword 섹션의 MORE 확대 모션 (섹션 진입 시 재생, GSAP timeline)
     3) 풀페이지 스냅 스크롤 (GSAP Observer)
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

/* ---------- 풀페이지 스냅 스크롤 ---------- */
function initFullPageScroll(reduceMotion, keywordTl) {
  const sections = gsap.utils.toArray(".fp_section");
  if (!sections.length || typeof Observer === "undefined") return;

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
  initFullPageScroll(reduceMotion, keywordTl);
});