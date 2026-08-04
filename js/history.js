/* =========================================================
   history.js — History 페이지 전용 스크립트
     1) decade 카드 전체가 스크롤에 걸릴 때 "책장을 넘기듯" 펼쳐지는 모션
     2) 제목·문단이 순서대로 자연스럽게 떠오르며 등장하는 텍스트 모션
   둘 다 스크롤과 직접 연결된 모션이라 GSAP(+ScrollTrigger)을 사용합니다.
   ========================================================= */

/* ---------- 1) 카드(이미지 포함) 책장 넘김 모션 ---------- */
function initPageTurn() {
  const pages = gsap.utils.toArray(".decade_page");
  if (!pages.length) return;

  gsap.registerPlugin(ScrollTrigger);

  pages.forEach((page) => {
    gsap.fromTo(
      page,
      { rotateX: -22, transformOrigin: "top center", opacity: 0, y: 50 },
      {
        rotateX: 0,
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: page,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
}

/* ---------- 2) 텍스트 자연스러운 순차 등장 ---------- */
function initTextReveal() {
  // .decade_title 은 CSS에서 left:50% + translateX(-50%) 로 가운데 정렬됩니다.
  // GSAP이 y를 애니메이션하면서 transform을 덮어써도 중앙 정렬이 유지되도록
  // xPercent를 먼저 GSAP에 등록해 둡니다.
  gsap.set(".decade_title", { xPercent: -50 });

  const sections = gsap.utils.toArray(".decade_page, .history_quote");

  sections.forEach((section) => {
    const targets = section.querySelectorAll(
      ".decade_title, .decade_eyebrow, .decade_body p, .history_quote_page"
    );
    if (!targets.length) return;

    gsap.from(targets, {
      opacity: 0,
      y: 22,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  initPageTurn();
  initTextReveal();
});
