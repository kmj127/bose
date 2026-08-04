/* =========================================================
   technology.js — Technology 페이지 전용 스크롤 인터랙션
     1) 헤드폰 4컷이 스크롤에 그대로 붙어(scrub) 회전하듯 크로스페이드된 뒤
        분해 이미지(센서 노출)로 전환
     2) CustomTune / Immersive Audio / Noise Cancelling / ActiveSense
        4개 섹션이 화면에 고정(pin)된 채로 이미지·텍스트가 등장
   모두 스크롤 위치와 직접 연결된 모션이라 GSAP ScrollTrigger를 사용합니다.
   ========================================================= */

/* ---------- 1) 회전 → 분해 크로스페이드 ---------- */
function initRotateSequence() {
  const section = document.getElementById("rotate_section");
  if (!section) return;

  const stage = section.querySelector(".rotate_stage");
  const frames = gsap.utils.toArray(".rotate_frame", section);
  if (!stage || frames.length < 2) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      pin: stage,
      anticipatePin: 1,
    },
  });

  // 프레임을 순서대로 하나씩 크로스페이드 (마지막은 분해 이미지)
  for (let i = 1; i < frames.length; i += 1) {
    tl.to(frames[i - 1], { opacity: 0, duration: 1 }, i - 1).to(
      frames[i],
      { opacity: 1, duration: 1 },
      i - 1
    );
  }
}

/* ---------- 2) 기능 섹션: 화면 고정 + 이미지·텍스트 등장 ---------- */
function initFeatureSections() {
  const sections = gsap.utils.toArray("[data-feature]");

  sections.forEach((section) => {
    const stage = section.querySelector(".feature_stage");
    const media = section.querySelector(".feature_media");
    const copyTargets = section.querySelectorAll(
      ".feature_title, .feature_subtitle, .feature_desc"
    );
    if (!stage || !media) return;

    gsap.set(media, { scale: 0.55, opacity: 0 });
    gsap.set(copyTargets, { opacity: 0, y: 24 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin: stage,
        anticipatePin: 1,
      },
    });

    tl.to(media, { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }).to(
      copyTargets,
      { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power2.out" },
      0.6
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 모션 최소화 사용자: 회전·고정 없이 정적으로 표시 (CSS에서 이미 처리)
  if (reduceMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  initRotateSequence();
  initFeatureSections();
});
