/* =========================================================
   home.js — Home 페이지 전용 스크립트
   ========================================================= */


/* =========================================================
   PRODUCT SLIDER
   ========================================================= */

function initProductSlider(reduceMotion) {

  const sliderEl =
    document.querySelector(".product_slider");

  if (
    !sliderEl ||
    typeof Swiper === "undefined"
  ) {
    return;
  }


  /*
    기존 슬라이드
  */

  const originalSlides =
    Array.from(
      sliderEl.querySelectorAll(
        ".swiper-slide"
      )
    );


  if (!originalSlides.length) {
    return;
  }


  const images =
    Array.from(
      sliderEl.querySelectorAll("img")
    );


  /*
    이미지가 전부 로드된 뒤 실행
  */

  const waitForImages =
    images.map((img) => {

      if (img.complete) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {

        img.addEventListener(
          "load",
          resolve,
          { once: true }
        );

        img.addEventListener(
          "error",
          resolve,
          { once: true }
        );

      });

    });


  Promise.all(waitForImages)
    .then(() => {


      /*
        기존 Swiper 제거
      */

      if (sliderEl.swiper) {

        sliderEl.swiper.destroy(
          true,
          true
        );

      }


      /*
        =====================================================
        WRAPPER
        =====================================================
      */

      const wrapper =
        sliderEl.querySelector(
          ".swiper-wrapper"
        );


      if (!wrapper) {
        return;
      }


      /*
        이전 실행에서 만들어진 복제 슬라이드 제거
      */

      wrapper
        .querySelectorAll(
          ".product_slide_clone"
        )
        .forEach((slide) => {

          slide.remove();

        });


      /*
        =====================================================
        무한 루프용 복제
        =====================================================

        원본을 3세트로 만듦.

        A B C D E
        A B C D E
        A B C D E

        이렇게 충분한 길이를 확보해서
        마지막에서 빈 공간이 생기지 않도록 함.
      */

      originalSlides.forEach(
        (slide) => {

          const clone =
            slide.cloneNode(true);

          clone.classList.add(
            "product_slide_clone"
          );

          clone.setAttribute(
            "aria-hidden",
            "true"
          );

          wrapper.appendChild(
            clone
          );

        }
      );


      originalSlides.forEach(
        (slide) => {

          const clone =
            slide.cloneNode(true);

          clone.classList.add(
            "product_slide_clone"
          );

          clone.setAttribute(
            "aria-hidden",
            "true"
          );

          wrapper.appendChild(
            clone
          );

        }
      );


      /*
        전체 슬라이드
      */

      const allSlides =
        wrapper.querySelectorAll(
          ".swiper-slide"
        );


      /*
        =====================================================
        REDUCED MOTION
        =====================================================
      */

      if (reduceMotion) {

        new Swiper(
          sliderEl,
          {

            slidesPerView: "auto",

            spaceBetween: 48,

            /*
              첫 번째 이미지부터 시작
            */

            initialSlide: 0,

            centeredSlides: false,

            loop: true,

            loopedSlides:
              originalSlides.length,

            loopAdditionalSlides:
              originalSlides.length,

            grabCursor: true,

            allowTouchMove: true,

            watchSlidesProgress: true,

            observer: true,

            observeParents: true,

            observeSlideChildren: true

          }
        );

        return;
      }


      /*
        =====================================================
        CONTINUOUS INFINITE SLIDER
        =====================================================

        freeMode를 사용하지 않음.

        Swiper autoplay 자체로
        일정한 속도로 계속 이동시킴.

        delay: 0
        speed: 5000

        → 슬라이드 사이에 멈춤 없이 이동
      */

      const swiper =
        new Swiper(
          sliderEl,
          {

            /*
              이미지 크기 그대로 사용
            */

            slidesPerView: "auto",

            spaceBetween: 48,


            /*
              중요

              centeredSlides를 끄면
              첫 이미지부터 정상적으로 시작함.

              기존에는 centeredSlides 때문에
              Swiper loop 내부의 복제 슬라이드가
              첫 화면에 먼저 나타날 수 있었음.
            */

            centeredSlides: false,


            /*
              첫 이미지부터 시작
            */

            initialSlide: 0,


            /*
              무한 반복
            */

            loop: true,

            loopedSlides:
              originalSlides.length,

            loopAdditionalSlides:
              originalSlides.length,


            /*
              사용자가 드래그할 수 있도록
            */

            grabCursor: true,

            allowTouchMove: true,


            /*
              transition 계산 안정화
            */

            watchSlidesProgress: true,

            roundLengths: false,


            /*
              =================================================
              AUTOPLAY
              =================================================
            */

            autoplay: {

              /*
                0에 가깝게 설정해서
                슬라이드 사이에 멈춤이 없음.
              */

              delay: 0,

              disableOnInteraction: false,

              /*
                마우스를 올려도 계속 움직임
              */

              pauseOnMouseEnter: false,

              waitForTransition: false

            },


            /*
              이동 속도

              숫자가 작을수록 빠름
              숫자가 클수록 느림

              현재는 5초 기준.
            */

            speed: 5000,


            /*
              키보드
            */

            keyboard: {

              enabled: true,

              onlyInViewport: true

            },


            /*
              observer
            */

            observer: true,

            observeParents: true,

            observeSlideChildren: true,


            /*
              =================================================
              EVENTS
              =================================================
            */

            on: {

              init(swiper) {

                swiper.update();

                /*
                  autoplay 강제 시작
                */

                if (
                  swiper.autoplay
                ) {

                  swiper.autoplay.start();

                }

              },


              resize(swiper) {

                swiper.update();

              },


              /*
                혹시 마지막 구간에서
                autoplay가 멈추는 경우 다시 시작
              */

              reachEnd(swiper) {

                if (
                  swiper.autoplay
                ) {

                  swiper.autoplay.start();

                }

              }

            }

          }
        );


      /*
        =====================================================
        AUTOPLAY 강제 시작
        =====================================================
      */

      requestAnimationFrame(() => {

        requestAnimationFrame(() => {

          if (
            swiper &&
            swiper.autoplay
          ) {

            swiper.autoplay.start();

          }

        });

      });


      /*
        =====================================================
        혹시 브라우저가 autoplay를 멈추는 경우
        다시 실행
        =====================================================
      */

      const restartAutoplay =
        () => {

          if (
            swiper &&
            swiper.autoplay &&
            !swiper.destroyed
          ) {

            swiper.autoplay.start();

          }

        };


      document.addEventListener(
        "visibilitychange",
        () => {

          if (
            document.visibilityState ===
            "visible"
          ) {

            restartAutoplay();

          }

        }
      );


    })
    .catch(() => {

      /*
        이미지 로딩 실패가 있어도
        Home 페이지 다른 기능에는
        영향을 주지 않음.
      */

    });

}


/* =========================================================
   KEYWORD GROW
   ========================================================= */

function initKeywordGrow(reduceMotion) {

  const hearEl =
    document.querySelector(
      ".keyword_word.keyword_main"
    );

  const growEl =
    document.querySelector(
      ".keyword_grow"
    );


  if (
    !hearEl ||
    !growEl ||
    typeof gsap === "undefined"
  ) {
    return null;
  }


  if (reduceMotion) {

    gsap.set(
      [hearEl, growEl],
      {
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0
      }
    );

    return null;
  }


  gsap.set(
    hearEl,
    {
      scale: 0.8,
      opacity: 0,
      y: 16
    }
  );


  gsap.set(
    growEl,
    {
      scale: 0.4,
      opacity: 0.4,
      y: 0
    }
  );


  const tl =
    gsap.timeline({
      paused: true
    });


  tl
    .to(
      hearEl,
      {
        scale: 1,
        opacity: 1,
        y: 0,

        duration: 0.7,

        ease: "power2.out"
      }
    )

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

  const gallery =
    document.querySelector(
      ".gallery"
    );


  const slides =
    Array.from(
      gallery?.querySelectorAll(
        ".gallery_item"
      ) ?? []
    );


  if (
    !gallery ||
    slides.length < 2
  ) {
    return;
  }


  if (reduceMotion) {

    slides.forEach(
      (slide, index) => {

        slide.classList.toggle(
          "is-active",
          index === 0
        );

        slide.classList.remove(
          "is-prev",
          "is-next",
          "is-hidden"
        );

      }
    );

    return;
  }


  let activeIndex = 0;


  function updateSlides() {

    const total =
      slides.length;


    slides.forEach(
      (slide, index) => {

        const offset =
          (
            index -
            activeIndex +
            total
          ) % total;


        slide.classList.remove(
          "is-active",
          "is-prev",
          "is-next",
          "is-hidden"
        );


        if (offset === 0) {

          slide.classList.add(
            "is-active"
          );

        } else if (
          offset === 1
        ) {

          slide.classList.add(
            "is-next"
          );

        } else if (
          offset === total - 1
        ) {

          slide.classList.add(
            "is-prev"
          );

        } else {

          slide.classList.add(
            "is-hidden"
          );

        }

      }
    );

  }


  updateSlides();


  const intervalId =
    window.setInterval(
      () => {

        activeIndex =
          (
            activeIndex + 1
          ) % slides.length;

        updateSlides();

      },
      4000
    );


  return () =>
    window.clearInterval(
      intervalId
    );
}


/* =========================================================
   MENU PREVIEW
   ========================================================= */

function initMenuPreview(reduceMotion) {

  const list =
    document.querySelector(
      ".menu_list"
    );


  const preview =
    list?.querySelector(
      ".menu_preview"
    );


  const img =
    preview?.querySelector(
      ".menu_preview_img"
    );


  const rows =
    list
      ? Array.from(
          list.querySelectorAll(
            ".menu_row"
          )
        )
      : [];


  if (
    !list ||
    !preview ||
    !img ||
    !rows.length
  ) {
    return;
  }


  document.body.appendChild(
    preview
  );


  if (reduceMotion) {

    preview.style.transition =
      "opacity 0.01s linear";

  }


  rows.forEach(
    (row) => {

      const src =
        row.dataset.preview;


      if (!src) {
        return;
      }


      const preload =
        new Image();

      preload.src = src;

    }
  );


  function changePreview(src) {

    if (!src) {
      return;
    }


    img.classList.remove(
      "is-loaded"
    );


    const nextImage =
      new Image();


    nextImage.onload = () => {

      img.src = src;


      requestAnimationFrame(() => {

        img.classList.add(
          "is-loaded"
        );

      });

    };


    nextImage.onerror = () => {

      img.classList.remove(
        "is-loaded"
      );

    };


    nextImage.src = src;

  }


  function moveTo(
    clientX,
    clientY
  ) {

    const previewWidth =
      preview.offsetWidth || 220;

    const previewHeight =
      preview.offsetHeight || 300;


    let x =
      clientX;

    let y =
      clientY -
      previewHeight * 0.25;


    const halfWidth =
      previewWidth / 2;


    const minX =
      halfWidth + 12;


    const maxX =
      window.innerWidth -
      halfWidth -
      12;


    x =
      Math.max(
        minX,
        Math.min(
          x,
          maxX
        )
      );


    const halfHeight =
      previewHeight * 0.6;


    const minY =
      halfHeight + 12;


    const maxY =
      window.innerHeight -
      halfHeight -
      12;


    y =
      Math.max(
        minY,
        Math.min(
          y,
          maxY
        )
      );


    preview.style.left =
      `${x}px`;

    preview.style.top =
      `${y}px`;

  }


  rows.forEach(
    (row) => {

      const src =
        row.dataset.preview;


      row.addEventListener(
        "mouseenter",
        (event) => {

          changePreview(src);

          moveTo(
            event.clientX,
            event.clientY
          );

          preview.classList.add(
            "is-active"
          );

        }
      );


      row.addEventListener(
        "mousemove",
        (event) => {

          moveTo(
            event.clientX,
            event.clientY
          );

        }
      );


      row.addEventListener(
        "mouseleave",
        () => {

          preview.classList.remove(
            "is-active"
          );

        }
      );


      row.addEventListener(
        "focus",
        () => {

          changePreview(src);


          const rect =
            row.getBoundingClientRect();


          const x =
            rect.right -
            100;


          const y =
            rect.top +
            rect.height / 2;


          moveTo(
            x,
            y
          );


          preview.classList.add(
            "is-active"
          );

        }
      );


      row.addEventListener(
        "blur",
        () => {

          preview.classList.remove(
            "is-active"
          );

        }
      );

    }
  );


  window.addEventListener(
    "resize",
    () => {

      if (
        preview.classList.contains(
          "is-active"
        )
      ) {

        const currentX =
          parseFloat(
            preview.style.left
          ) || 0;


        const currentY =
          parseFloat(
            preview.style.top
          ) || 0;


        moveTo(
          currentX,
          currentY
        );

      }

    },
    {
      passive: true
    }
  );


  document.addEventListener(
    "mouseleave",
    () => {

      preview.classList.remove(
        "is-active"
      );

    }
  );

}


/* =========================================================
   APP SECTION
   ========================================================= */

let appTimeline = null;


function playAppReveal(section) {

  if (
    typeof gsap === "undefined"
  ) {
    return;
  }


  const title =
    section.querySelector(
      ".app_title"
    );

  const desc =
    section.querySelector(
      ".app_desc"
    );

  const img =
    section.querySelector(
      ".app_img"
    );

  const tags =
    section.querySelectorAll(
      ".app_tag"
    );

  const link =
    section.querySelector(
      ".app_link"
    );


  if (appTimeline) {
    appTimeline.kill();
  }


  appTimeline =
    gsap.timeline();


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

  const title =
    section.querySelector(
      ".app_title"
    );

  const desc =
    section.querySelector(
      ".app_desc"
    );

  const img =
    section.querySelector(
      ".app_img"
    );

  const tags =
    section.querySelectorAll(
      ".app_tag"
    );

  const link =
    section.querySelector(
      ".app_link"
    );


  if (appTimeline) {
    appTimeline.kill();
  }


  if (
    typeof gsap !== "undefined"
  ) {

    gsap.set(
      [
        title,
        desc,
        img,
        tags,
        link
      ],
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

function initFullPageScroll(
  reduceMotion,
  keywordTl
) {

  if (
    typeof gsap === "undefined" ||
    typeof Observer === "undefined"
  ) {
    return;
  }


  const sections =
    gsap.utils.toArray(
      ".fp_section"
    );


  if (!sections.length) {
    return;
  }


  const wrapper =
    document.querySelector(
      ".fp_wrapper"
    );


  if (wrapper) {

    wrapper.classList.add(
      "is-fp-ready"
    );

  }


  gsap.registerPlugin(
    Observer
  );


  let currentIndex = 0;

  let isAnimating = false;


  gsap.set(
    sections,
    {
      opacity: 0,
      yPercent: 0,
      pointerEvents: "none"
    }
  );


  gsap.set(
    sections[0],
    {
      opacity: 1,
      pointerEvents: "auto"
    }
  );


  sections.forEach(
    (section) => {

      section.classList.remove(
        "is_active"
      );

    }
  );


  sections[0].classList.add(
    "is_active"
  );


  function showSection(index) {

    if (
      index < 0 ||
      index >= sections.length ||
      index === currentIndex
    ) {
      return;
    }


    isAnimating = true;


    const dir =
      index > currentIndex
        ? 1
        : -1;


    const prevSection =
      sections[currentIndex];


    const nextSection =
      sections[index];


    const tl =
      gsap.timeline({

        defaults: {

          duration:
            reduceMotion
              ? 0
              : 0.9,

          ease:
            "power2.inOut"

        },

        onComplete: () => {

          isAnimating = false;

        }

      });


    tl
      .to(
        prevSection,
        {
          yPercent:
            -12 * dir,

          opacity: 0,

          pointerEvents:
            "none"
        }
      )


      .fromTo(
        nextSection,

        {
          yPercent:
            12 * dir,

          opacity: 0,

          pointerEvents:
            "none"
        },

        {
          yPercent: 0,

          opacity: 1,

          pointerEvents:
            "auto"
        },

        0
      );


    prevSection.classList.remove(
      "is_active"
    );


    nextSection.classList.add(
      "is_active"
    );


    prevSection.style.pointerEvents =
      "none";


    nextSection.style.pointerEvents =
      "auto";


    if (keywordTl) {

      if (
        nextSection.classList.contains(
          "keyword"
        )
      ) {

        keywordTl.restart();

      } else if (
        prevSection.classList.contains(
          "keyword"
        )
      ) {

        keywordTl.pause(0);

      }

    }


    if (
      nextSection.classList.contains(
        "app"
      )
    ) {

      playAppReveal(
        nextSection
      );

    } else if (
      prevSection.classList.contains(
        "app"
      )
    ) {

      resetAppReveal(
        prevSection
      );

    }


    currentIndex =
      index;

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

      if (
        scrollReleased &&
        window.scrollY <= 0
      ) {

        relockScroll();

      }

    },
    {
      passive: true
    }
  );


  function attemptMove(
    direction
  ) {

    if (
      isAnimating ||
      scrollReleased
    ) {
      return;
    }


    const section =
      sections[currentIndex];


    if (
      section.hasAttribute(
        "data-fp-scroll"
      )
    ) {

      const atTop =
        section.scrollTop <= 0;


      const atBottom =
        section.scrollTop +
        section.clientHeight >=
        section.scrollHeight - 1;


      if (
        direction > 0 &&
        !atBottom
      ) {

        section.scrollBy({
          top: 150,
          behavior: "smooth"
        });

        return;

      }


      if (
        direction < 0 &&
        !atTop
      ) {

        section.scrollBy({
          top: -150,
          behavior: "smooth"
        });

        return;

      }

    }


    if (
      direction > 0 &&
      currentIndex ===
        sections.length - 1
    ) {

      releaseScrollLock();

      return;

    }


    showSection(
      currentIndex + direction
    );

  }


  const scrollObserver =
    Observer.create({

      target: window,

      type: "wheel,touch",

      wheelSpeed: -1,

      tolerance: 10,

      preventDefault: true,

      onDown: () =>
        attemptMove(-1),

      onUp: () =>
        attemptMove(1)

    });


  window.addEventListener(
    "keydown",
    (e) => {

      if (scrollReleased) {
        return;
      }


      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown"
      ) {

        e.preventDefault();

        attemptMove(1);

      }


      if (
        e.key === "ArrowUp" ||
        e.key === "PageUp"
      ) {

        e.preventDefault();

        attemptMove(-1);

      }

    }
  );

}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const reduceMotion =
      window
        .matchMedia(
          "(prefers-reduced-motion: reduce)"
        )
        .matches;


    /*
      Product
    */

    initProductSlider(
      reduceMotion
    );


    /*
      HEAR MORE
    */

    const keywordTl =
      initKeywordGrow(
        reduceMotion
      );


    /*
      Gallery
    */

    initGalleryCarousel(
      reduceMotion
    );


    /*
      Menu Preview
    */

    initMenuPreview(
      reduceMotion
    );


    /*
      Full Page
    */

    initFullPageScroll(
      reduceMotion,
      keywordTl
    );


    /*
      Reduced Motion에서는
      APP를 바로 보여줌.
    */

    if (reduceMotion) {

      const appSection =
        document.querySelector(
          ".app"
        );


      if (appSection) {

        playAppReveal(
          appSection
        );

      }

    }

  }
);