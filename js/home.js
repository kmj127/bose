/* =========================================================
   home.js — Home 페이지 전용 스크립트
   ========================================================= */


/* =========================================================
   PRODUCT SLIDER
   ========================================================= */

function initProductSlider(reduceMotion) {
  const sliderEl = document.querySelector(".product_slider");

  if (!sliderEl || typeof Swiper === "undefined") {
    return;
  }

  const originalSlides = Array.from(
    sliderEl.querySelectorAll(".swiper-slide")
  );

  if (!originalSlides.length) {
    return;
  }

  const images = Array.from(sliderEl.querySelectorAll("img"));

  const waitForImages = images.map((img) => {
    if (img.complete) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    });
  });

  Promise.all(waitForImages)
    .then(() => {
      if (sliderEl.swiper) {
        sliderEl.swiper.destroy(true, true);
      }

      const wrapper = sliderEl.querySelector(".swiper-wrapper");

      if (!wrapper) {
        return;
      }

      wrapper
        .querySelectorAll(".product_slide_clone")
        .forEach((slide) => slide.remove());

      originalSlides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.classList.add("product_slide_clone");
        clone.setAttribute("aria-hidden", "true");
        wrapper.appendChild(clone);
      });

      originalSlides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.classList.add("product_slide_clone");
        clone.setAttribute("aria-hidden", "true");
        wrapper.appendChild(clone);
      });

      if (reduceMotion) {
        new Swiper(sliderEl, {
          slidesPerView: "auto",
          spaceBetween: 48,
          initialSlide: 0,
          centeredSlides: false,
          loop: true,
          loopedSlides: originalSlides.length,
          loopAdditionalSlides: originalSlides.length,
          grabCursor: true,
          allowTouchMove: true,
          watchSlidesProgress: true,
          observer: true,
          observeParents: true,
          observeSlideChildren: true
        });

        return;
      }

      const swiper = new Swiper(sliderEl, {
        slidesPerView: "auto",
        spaceBetween: 48,
        centeredSlides: false,
        initialSlide: 0,
        loop: true,
        loopedSlides: originalSlides.length,
        loopAdditionalSlides: originalSlides.length,
        grabCursor: true,
        allowTouchMove: true,
        watchSlidesProgress: true,
        roundLengths: false,

        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          waitForTransition: false
        },

        speed: 5000,

        keyboard: {
          enabled: true,
          onlyInViewport: true
        },

        observer: true,
        observeParents: true,
        observeSlideChildren: true,

        on: {
          init(swiper) {
            swiper.update();

            if (swiper.autoplay) {
              swiper.autoplay.start();
            }
          },

          resize(swiper) {
            swiper.update();
          },

          reachEnd(swiper) {
            if (swiper.autoplay) {
              swiper.autoplay.start();
            }
          }
        }
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (swiper && swiper.autoplay) {
            swiper.autoplay.start();
          }
        });
      });

      const restartAutoplay = () => {
        if (swiper && swiper.autoplay && !swiper.destroyed) {
          swiper.autoplay.start();
        }
      };

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          restartAutoplay();
        }
      });
    })
    .catch(() => {
      // 이미지 로딩 실패가 있어도 다른 홈 페이지 기능에는 영향을 주지 않습니다.
    });
}


/* =========================================================
   KEYWORD GROW
   ========================================================= */

function initKeywordGrow(reduceMotion) {
  const hearEl = document.querySelector(".keyword_word.keyword_main");
  const growEl = document.querySelector(".keyword_grow");

  if (!hearEl || !growEl || typeof gsap === "undefined") {
    return null;
  }

  if (
    reduceMotion ||
    window.matchMedia("(max-width: 700px)").matches
  ) {
    gsap.set([hearEl, growEl], {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0
    });

    return null;
  }

  gsap.set(hearEl, {
    scale: 0.8,
    opacity: 0,
    y: 16
  });

  gsap.set(growEl, {
    scale: 0.4,
    opacity: 0.4,
    y: 0
  });

  const tl = gsap.timeline({ paused: true });

  tl
    .to(hearEl, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out"
    })
    .to(
      growEl,
      {
        y: 28,
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out"
      },
      "-=0.4"
    );

  return tl;
}


/* =========================================================
   GALLERY CAROUSEL
   ========================================================= */

function initGalleryCarousel(reduceMotion) {
  const gallery = document.querySelector(".gallery");

  const slides = Array.from(
    gallery?.querySelectorAll(".gallery_item") ?? []
  );

  if (!gallery || slides.length < 2) {
    return;
  }

  if (reduceMotion) {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === 0);
      slide.classList.remove("is-prev", "is-next", "is-hidden");
    });

    return;
  }

  let activeIndex = 0;

  function updateSlides() {
    const total = slides.length;

    slides.forEach((slide, index) => {
      const offset = (index - activeIndex + total) % total;

      slide.classList.remove(
        "is-active",
        "is-prev",
        "is-next",
        "is-hidden"
      );

      if (offset === 0) {
        slide.classList.add("is-active");
      } else if (offset === 1) {
        slide.classList.add("is-next");
      } else if (offset === total - 1) {
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


/* =========================================================
   MENU PREVIEW
   ========================================================= */

function initMenuPreview(reduceMotion) {
  const list = document.querySelector(".menu_list");
  const preview = list?.querySelector(".menu_preview");
  const img = preview?.querySelector(".menu_preview_img");

  const rows = list
    ? Array.from(list.querySelectorAll(".menu_row"))
    : [];

  if (!list || !preview || !img || !rows.length) {
    return;
  }

  document.body.appendChild(preview);

  if (reduceMotion) {
    preview.style.transition = "opacity 0.01s linear";
  }

  rows.forEach((row) => {
    const src = row.dataset.preview;

    if (!src) {
      return;
    }

    const preload = new Image();
    preload.src = src;
  });

  function changePreview(src) {
    if (!src) {
      return;
    }

    img.classList.remove("is-loaded");

    const nextImage = new Image();

    nextImage.onload = () => {
      img.src = src;

      requestAnimationFrame(() => {
        img.classList.add("is-loaded");
      });
    };

    nextImage.onerror = () => {
      img.classList.remove("is-loaded");
    };

    nextImage.src = src;
  }

  function moveTo(clientX, clientY) {
    const previewWidth = preview.offsetWidth || 220;
    const previewHeight = preview.offsetHeight || 300;

    let x = clientX;
    let y = clientY - previewHeight * 0.25;

    const halfWidth = previewWidth / 2;
    const minX = halfWidth + 12;
    const maxX = window.innerWidth - halfWidth - 12;

    x = Math.max(minX, Math.min(x, maxX));

    const halfHeight = previewHeight * 0.6;
    const minY = halfHeight + 12;
    const maxY = window.innerHeight - halfHeight - 12;

    y = Math.max(minY, Math.min(y, maxY));

    preview.style.left = `${x}px`;
    preview.style.top = `${y}px`;
  }

  rows.forEach((row) => {
    const src = row.dataset.preview;

    row.addEventListener("mouseenter", (event) => {
      changePreview(src);
      moveTo(event.clientX, event.clientY);
      preview.classList.add("is-active");
    });

    row.addEventListener("mousemove", (event) => {
      moveTo(event.clientX, event.clientY);
    });

    row.addEventListener("mouseleave", () => {
      preview.classList.remove("is-active");
    });

    row.addEventListener("focus", () => {
      changePreview(src);

      const rect = row.getBoundingClientRect();
      const x = rect.right - 100;
      const y = rect.top + rect.height / 2;

      moveTo(x, y);
      preview.classList.add("is-active");
    });

    row.addEventListener("blur", () => {
      preview.classList.remove("is-active");
    });
  });

  window.addEventListener(
    "resize",
    () => {
      if (preview.classList.contains("is-active")) {
        const currentX = parseFloat(preview.style.left) || 0;
        const currentY = parseFloat(preview.style.top) || 0;

        moveTo(currentX, currentY);
      }
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", () => {
    preview.classList.remove("is-active");
  });
}


/* =========================================================
   APP SECTION
   ========================================================= */

let appTimeline = null;

function playAppReveal(section) {
  if (typeof gsap === "undefined") {
    return;
  }

  const title = section.querySelector(".app_title");
  const desc = section.querySelector(".app_desc");
  const img = section.querySelector(".app_img");
  const tags = section.querySelectorAll(".app_tag");
  const link = section.querySelector(".app_link");

  if (appTimeline) {
    appTimeline.kill();
  }

  appTimeline = gsap.timeline();

  appTimeline
    .fromTo(
      [title, desc],
      {
        opacity: 0,
        x: -48
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      }
    )
    .fromTo(
      img,
      {
        opacity: 0,
        scale: 0.9,
        y: 30
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      },
      "-=0.3"
    )
    .fromTo(
      tags,
      {
        opacity: 0,
        scale: 0.7,
        y: 20
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.5)"
      },
      "-=0.4"
    )
    .fromTo(
      link,
      {
        opacity: 0,
        y: 15
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      },
      "-=0.2"
    );
}

function resetAppReveal(section) {
  const title = section.querySelector(".app_title");
  const desc = section.querySelector(".app_desc");
  const img = section.querySelector(".app_img");
  const tags = section.querySelectorAll(".app_tag");
  const link = section.querySelector(".app_link");

  if (appTimeline) {
    appTimeline.kill();
  }

  if (typeof gsap !== "undefined") {
    gsap.set(
      [title, desc, img, tags, link],
      {
        opacity: 0,
        clearProps: "transform"
      }
    );
  }
}


/* =========================================================
   FULL PAGE SNAP SCROLL
   ========================================================= */

function initFullPageScroll(reduceMotion, keywordTl) {
  // Keep normal document scrolling on phones so long sections remain reachable.
  if (window.matchMedia("(max-width: 700px)").matches) {
    return;
  }

  if (typeof gsap === "undefined" || typeof Observer === "undefined") {
    return;
  }

  const sections = gsap.utils.toArray(".fp_section");

  if (!sections.length) {
    return;
  }

  const wrapper = document.querySelector(".fp_wrapper");

  if (wrapper) {
    wrapper.classList.add("is-fp-ready");
  }

  gsap.registerPlugin(Observer);

  let currentIndex = 0;
  let isAnimating = false;

  gsap.set(sections, {
    opacity: 0,
    yPercent: 0,
    pointerEvents: "none"
  });

  gsap.set(sections[0], {
    opacity: 1,
    pointerEvents: "auto"
  });

  sections.forEach((section) => {
    section.classList.remove("is_active");
  });

  sections[0].classList.add("is_active");

  function showSection(index) {
    if (
      index < 0 ||
      index >= sections.length ||
      index === currentIndex
    ) {
      return;
    }

    isAnimating = true;

    const dir = index > currentIndex ? 1 : -1;
    const prevSection = sections[currentIndex];
    const nextSection = sections[index];

    const tl = gsap.timeline({
      defaults: {
        duration: reduceMotion ? 0 : 0.9,
        ease: "power2.inOut"
      },
      onComplete: () => {
        isAnimating = false;
      }
    });

    tl
      .to(prevSection, {
        yPercent: -12 * dir,
        opacity: 0,
        pointerEvents: "none"
      })
      .fromTo(
        nextSection,
        {
          yPercent: 12 * dir,
          opacity: 0,
          pointerEvents: "none"
        },
        {
          yPercent: 0,
          opacity: 1,
          pointerEvents: "auto"
        },
        0
      );

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
      resetAppReveal(prevSection);
    }

    currentIndex = index;
  }

  let scrollReleased = false;

  function releaseScrollLock() {
    if (scrollReleased) {
      return;
    }

    scrollReleased = true;
    scrollObserver.disable();
  }

  function relockScroll() {
    if (!scrollReleased) {
      return;
    }

    scrollReleased = false;
    scrollObserver.enable();
  }

  window.addEventListener(
    "scroll",
    () => {
      if (scrollReleased && window.scrollY <= 0) {
        relockScroll();
      }
    },
    { passive: true }
  );

  function attemptMove(direction) {
    if (isAnimating || scrollReleased) {
      return;
    }

    const section = sections[currentIndex];

    if (section.hasAttribute("data-fp-scroll")) {
      const atTop = section.scrollTop <= 0;

      const atBottom =
        section.scrollTop + section.clientHeight >=
        section.scrollHeight - 1;

      if (direction > 0 && !atBottom) {
        section.scrollBy({
          top: 150,
          behavior: "smooth"
        });

        return;
      }

      if (direction < 0 && !atTop) {
        section.scrollBy({
          top: -150,
          behavior: "smooth"
        });

        return;
      }
    }

    if (
      direction > 0 &&
      currentIndex === sections.length - 1
    ) {
      releaseScrollLock();
      return;
    }

    showSection(currentIndex + direction);
  }

  const scrollObserver = Observer.create({
    target: window,
    type: "wheel,touch",
    wheelSpeed: -1,
    tolerance: 10,
    preventDefault: true,
    onDown: () => attemptMove(-1),
    onUp: () => attemptMove(1)
  });

  window.addEventListener("keydown", (e) => {
    if (scrollReleased) {
      return;
    }

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      attemptMove(1);
    }

    if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      attemptMove(-1);
    }
  });
}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .matches;

  initProductSlider(reduceMotion);

  const keywordTl = initKeywordGrow(reduceMotion);

  initGalleryCarousel(reduceMotion);

  initMenuPreview(reduceMotion);

  initFullPageScroll(reduceMotion, keywordTl);

  if (reduceMotion) {
    const appSection = document.querySelector(".app");

    if (appSection) {
      playAppReveal(appSection);
    }
  }
});