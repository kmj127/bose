/* =========================================================
   home.js — Home 페이지 전용 스크립트
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
    .to(hearEl, { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
    .to(growEl, { y: 28, scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.4");

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

function initMenuPreview(reduceMotion) {
  const list = document.querySelector(".menu_list");
  const preview = list?.querySelector(".menu_preview");
  const img = preview?.querySelector(".menu_preview_img");
  const rows = list ? Array.from(list.querySelectorAll(".menu_row")) : [];

  if (!list || !preview || !img || !rows.length) return;

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
    row.addEventListener("mousemove", (e) => moveTo(e.clientX, e.clientY));
    row.addEventListener("mouseleave", () => preview.classList.remove("is-active"));

    row.addEventListener("focus", () => {
      if (src) img.src = src;
      const rect = row.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      preview.style.left = `${rect.left - listRect.left + rect.width / 2}px`;
      preview.style.top = `${rect.top - listRect.top}px`;
      preview.classList.add("is-active");
    });
    row.addEventListener("blur", () => preview.classList.remove("is-active"));
  });
}

/* ---------- app : 섹션 진입 시 순차적 애니메이션 ---------- */
let appTimeline = null; 

function playAppReveal(section) {
  const title = section.querySelector(".app_title");
  const desc = section.querySelector(".app_desc");
  const img = section.querySelector(".app_img");
  const tags = section.querySelectorAll(".app_tag");
  const link = section.querySelector(".app_link");

  if (appTimeline) appTimeline.kill();

  appTimeline = gsap.timeline();

  appTimeline
    .fromTo([title, desc], { opacity: 0, x: -48 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" })
    .fromTo(img, { opacity: 0, scale: 0.9, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
    .fromTo(tags, { opacity: 0, scale: 0.7, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.5)" }, "-=0.4")
    .fromTo(link, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2");
}

function resetAppReveal(section) {
  const title = section.querySelector(".app_title");
  const desc = section.querySelector(".app_desc");
  const img = section.querySelector(".app_img");
  const tags = section.querySelectorAll(".app_tag");
  const link = section.querySelector(".app_link");

  if (appTimeline) appTimeline.kill();

  if(typeof gsap !== "undefined") {
    gsap.set([title, desc, img, tags, link], { opacity: 0, clearProps: "transform" });
  }
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
      onComplete: () => { isAnimating = false; },
    });

    tl.to(prevSection, { yPercent: -12 * dir, opacity: 0, pointerEvents: "none" })
      .fromTo(nextSection, { yPercent: 12 * dir, opacity: 0, pointerEvents: "none" }, { yPercent: 0, opacity: 1, pointerEvents: "auto" }, 0);

    prevSection.classList.remove("is_active");
    nextSection.classList.add("is_active");
    prevSection.style.pointerEvents = "none";
    nextSection.style.pointerEvents = "auto";

    if (keywordTl) {
      if (nextSection.classList.contains("keyword")) keywordTl.restart();
      else if (prevSection.classList.contains("keyword")) keywordTl.pause(0);
    }

    if (nextSection.classList.contains("app")) playAppReveal(nextSection);
    else if (prevSection.classList.contains("app")) resetAppReveal(prevSection);

    currentIndex = index;
  }

  let scrollReleased = false;

  function releaseScrollLock() {
    if (scrollReleased) return;
    scrollReleased = true;
    scrollObserver.disable(); 
  }

  function relockScroll() {
    if (!scrollReleased) return;
    scrollReleased = false;
    scrollObserver.enable();
  }

  window.addEventListener("scroll", () => {
    if (scrollReleased && window.scrollY <= 0) relockScroll();
  }, { passive: true });

  function attemptMove(direction) {
    if (isAnimating || scrollReleased) return;

    const section = sections[currentIndex];

    if (section.hasAttribute("data-fp-scroll")) {
      const atTop = section.scrollTop <= 0;
      const atBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 1;

      if (direction > 0 && !atBottom) { section.scrollBy({ top: 150, behavior: "smooth" }); return; }
      if (direction < 0 && !atTop) { section.scrollBy({ top: -150, behavior: "smooth" }); return; }
    }

    if (direction > 0 && currentIndex === sections.length - 1) { releaseScrollLock(); return; }

    showSection(currentIndex + direction);
  }

  const scrollObserver = Observer.create({
    target: window, type: "wheel,touch", wheelSpeed: -1, tolerance: 10, preventDefault: true,
    onDown: () => attemptMove(-1), onUp: () => attemptMove(1),
  });

  window.addEventListener("keydown", (e) => {
    if (scrollReleased) return; 
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