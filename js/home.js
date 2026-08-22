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
    이미지가 전부 로드된 뒤 Swiper를 생성.
    이미지 크기 계산 전에 Swiper가 실행되면서
    슬라이드 위치가 순간적으로 튀는 현상을 방지.
  */
  const images =
    Array.from(
      sliderEl.querySelectorAll("img")
    );


  const waitForImages = images.map((img) => {

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

      if (sliderEl.swiper) {
        sliderEl.swiper.destroy(
          true,
          true
        );
      }


      const swiper =
        new Swiper(
          sliderEl,
          {

            slidesPerView: "auto",

            spaceBetween: 48,

            centeredSlides: true,

            loop: true,

            loopAdditionalSlides: 5,

            loopPreventsSliding: false,

            grabCursor: true,

            allowTouchMove: true,

            watchSlidesProgress: true,

            roundLengths: true,

            speed: 6000,

            autoplay: reduceMotion
              ? false
              : {
                  delay: 1,

                  disableOnInteraction: false,

                  pauseOnMouseEnter: true,

                  waitForTransition: false
                },

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

                if (
                  !reduceMotion &&
                  swiper.autoplay
                ) {
                  swiper.autoplay.start();
                }
              },

              resize(swiper) {
                swiper.update();
              }

            }

          }
        );

      return swiper;

    })
    .catch(() => {

      /*
        이미지 로딩 실패가 있어도
        나머지 Home 페이지 기능에는
        영향을 주지 않도록 함.
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


  /*
    reduced motion 대응
  */

  if (reduceMotion) {

    preview.style.transition =
      "opacity 0.01s linear";

  }


  /*
    이미지 미리 로드
    ------------------
    hover 순간에 처음 이미지를
    다운로드하면서 깜빡이는 현상 방지.
  */

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


  /*
    이미지 변경
  */

  function changePreview(src) {

    if (!src) {
      return;
    }


    /*
      기존 이미지 숨김
    */

    img.classList.remove(
      "is-loaded"
    );


    /*
      새 이미지 생성 후 로드
    */

    const nextImage =
      new Image();


    nextImage.onload = () => {

      img.src = src;

      img.classList.add(
        "is-loaded"
      );

    };


    nextImage.onerror = () => {

      /*
        파일 경로가 잘못된 경우
        preview를 깨진 이미지로
        보여주지 않음.
      */

      img.classList.remove(
        "is-loaded"
      );

    };


    nextImage.src = src;

  }


  /*
    viewport 기준으로 preview 이동
  */

  function moveTo(
    clientX,
    clientY
  ) {

    /*
      이미지 크기
    */

    const previewWidth =
      preview.offsetWidth || 220;

    const previewHeight =
      preview.offsetHeight || 300;


    /*
      기본 위치.
      마우스 기준으로 약간 위쪽에 위치.
    */

    let x =
      clientX;

    let y =
      clientY -
      previewHeight * 0.25;


    /*
      화면 오른쪽 밖으로 나가는 것 방지
    */

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


    /*
      화면 위쪽/아래쪽 보정
    */

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


  /*
    마우스가 row에 들어왔을 때
  */

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


      /*
        키보드 접근성
      */

      row.addEventListener(
        "focus",
        () => {

          changePreview(src);


          const rect =
            row.getBoundingClientRect();


          /*
            focus 상태에서는
            row의 오른쪽 근처에 표시.
          */

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


  /*
    창 크기가 바뀌어도
    preview가 화면 밖에 남지 않게 처리
  */

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


  /*
    초기 상태
  */

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


    /*
      HEAR MORE
    */

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


    /*
      APP
    */

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


    /*
      Gallery 내부 스크롤
    */

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


    /*
      마지막 섹션에서 아래로 내려가면
      일반 페이지 스크롤로 반환
    */

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


  /*
    Full-page Observer
  */

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


  /*
    키보드 이동
  */

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