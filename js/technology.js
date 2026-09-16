(function () {
  "use strict";

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (
    reduceMotion ||
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);


  /* =========================================================
     IMAGE PRELOAD
     ========================================================= */

  function preloadImages() {
    const images = document.querySelectorAll(
      ".sequence_frame, .reassemble_frame, .feature_visual img"
    );

    images.forEach((img) => {
      if (img.complete) return;

      const preload = new Image();
      preload.src = img.src;
    });
  }


  /* =========================================================
     INTRO
     ========================================================= */

  function initIntro() {
    const intro =
      document.querySelector(".tech_intro_inner");

    if (!intro) return;

    const items =
      intro.querySelectorAll(
        ".tech_eyebrow, .tech_intro_title, .tech_intro_desc, .tech_scroll_hint"
      );

    gsap.set(items, {
      opacity: 0,
      y: 35
    });

    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.14,
      ease: "power3.out",
      delay: 0.2
    });
  }


  /* =========================================================
     PRODUCT SEQUENCE
     ========================================================= */

  function initProductSequence() {
    const section =
      document.querySelector("#tech_sequence");

    if (!section) return;

    const stage =
      section.querySelector(".tech_sequence_stage");

    const frames =
      gsap.utils.toArray(
        ".sequence_frame",
        section
      );

    const message =
      section.querySelector(".sequence_message");

    const progress =
      section.querySelector(
        ".sequence_progress_line > span"
      );

    if (!stage || frames.length < 2) return;


    /* ---------------------------------------------------------
       FRAME INITIAL STATE
       --------------------------------------------------------- */

    gsap.set(frames, {
      opacity: 0,
      scale: 0.92,
      rotationY: -8,
      filter: "blur(4px)",
      transformOrigin: "center center"
    });

    gsap.set(frames[0], {
      opacity: 1,
      scale: 1,
      rotationY: 0,
      filter: "blur(0px)"
    });

    gsap.set(message, {
      opacity: 0,
      y: 30
    });


    /* ---------------------------------------------------------
       MAIN TIMELINE
       --------------------------------------------------------- */

    const timeline =
      gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: "top top",
          end: "bottom bottom",

          scrub: 1,

          pin: stage,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            if (progress) {
              progress.style.width =
                `${self.progress * 100}%`;
            }
          }
        }
      });


    /* ---------------------------------------------------------
       FRAME TRANSITION
       --------------------------------------------------------- */

    frames.forEach(
      (frame, index) => {

        if (index === 0) return;

        const previous =
          frames[index - 1];

        const start =
          (index - 1) * 1.15;


        /* 이전 프레임 */

        timeline.to(
          previous,
          {
            opacity: 0,
            scale: 1.08,
            rotationY: 8,
            filter: "blur(5px)",

            duration: 1.15,

            ease: "power2.inOut"
          },
          start
        );


        /* 다음 프레임 */

        timeline.fromTo(
          frame,
          {
            opacity: 0,
            scale: 0.9,
            rotationY: -8,
            filter: "blur(5px)"
          },
          {
            opacity: 1,

            scale:
              index === frames.length - 1
                ? 1.08
                : 1,

            rotationY: 0,

            filter: "blur(0px)",

            duration: 1.15,

            ease: "power2.inOut"
          },
          start
        );
      }
    );


    /* ---------------------------------------------------------
       EXPLODED VIEW
       --------------------------------------------------------- */

    const explodeFrame =
      frames[frames.length - 1];

    timeline.to(
      explodeFrame,
      {
        scale: 1.18,

        duration: 1,

        ease: "power2.inOut"
      },
      ">"
    );


    /* ---------------------------------------------------------
       MESSAGE
       --------------------------------------------------------- */

    timeline.to(
      message,
      {
        opacity: 1,
        y: 0,

        duration: 0.8,

        ease: "power3.out"
      },
      "-=0.35"
    );
  }


  /* =========================================================
     FEATURE SECTIONS
     ========================================================= */

  function initFeatureSections() {
    const sections =
      gsap.utils.toArray(
        "[data-feature]"
      );

    sections.forEach(
      (section) => {

        const stage =
          section.querySelector(
            ".tech_feature_stage"
          );

        const media =
          section.querySelector(
            ".feature_visual"
          );

        const image =
          section.querySelector(
            ".feature_visual img"
          );

        const copy =
          section.querySelector(
            ".feature_copy"
          );

        const line =
          section.querySelector(
            ".feature_line"
          );

        const rings =
          section.querySelectorAll(
            ".sound_rings span"
          );

        const noiseWaves =
          section.querySelectorAll(
            ".noise_wave"
          );

        const sensorPoints =
          section.querySelectorAll(
            ".sensor_points span"
          );


        if (
          !stage ||
          !media ||
          !copy
        ) {
          return;
        }


        const textElements =
          copy.querySelectorAll(
            ".feature_kicker, .feature_title, .feature_subtitle, .feature_desc"
          );


        /* -----------------------------------------------------
           INITIAL STATE
           ----------------------------------------------------- */

        gsap.set(media, {
          opacity: 0,
          scale: 0.72,
          y: 35
        });

        gsap.set(image, {
          scale: 0.88
        });

        gsap.set(textElements, {
          opacity: 0,
          y: 25
        });

        gsap.set(line, {
          width: "0%"
        });

        gsap.set(
          [
            ...rings,
            ...noiseWaves,
            ...sensorPoints
          ],
          {
            opacity: 0,
            scale: 0.7
          }
        );


        /* -----------------------------------------------------
           FEATURE TIMELINE
           ----------------------------------------------------- */

        const timeline =
          gsap.timeline({
            scrollTrigger: {
              trigger: section,

              start: "top top",
              end: "bottom bottom",

              scrub: 1,

              pin: stage,

              anticipatePin: 1,

              invalidateOnRefresh: true
            }
          });


        /* -----------------------------------------------------
           VISUAL
           ----------------------------------------------------- */

        timeline.to(
          media,
          {
            opacity: 1,
            scale: 1,
            y: 0,

            duration: 1.3,

            ease: "power3.out"
          }
        );


        /* -----------------------------------------------------
           IMAGE
           ----------------------------------------------------- */

        timeline.to(
          image,
          {
            scale: 1.04,

            duration: 1,

            ease: "power2.out"
          },
          "-=0.5"
        );


        /* -----------------------------------------------------
           TEXT
           ----------------------------------------------------- */

        timeline.to(
          textElements,
          {
            opacity: 1,
            y: 0,

            duration: 1,

            stagger: 0.16,

            ease: "power3.out"
          },
          "-=0.5"
        );


        /* -----------------------------------------------------
           LINE
           ----------------------------------------------------- */

        timeline.to(
          line,
          {
            width: "55%",

            duration: 0.8,

            ease: "power2.out"
          },
          "-=0.3"
        );


        /* -----------------------------------------------------
           SOUND RINGS
           ----------------------------------------------------- */

        if (rings.length) {
          timeline.to(
            rings,
            {
              opacity: 1,
              scale: 1,

              duration: 1,

              stagger: 0.08,

              ease: "power2.out"
            },
            "-=0.5"
          );
        }


        /* -----------------------------------------------------
           NOISE WAVES
           ----------------------------------------------------- */

        if (noiseWaves.length) {
          timeline.to(
            noiseWaves,
            {
              opacity: 1,
              scale: 1,

              duration: 1,

              stagger: 0.12,

              ease: "power2.out"
            },
            "-=0.5"
          );
        }


        /* -----------------------------------------------------
           SENSOR POINTS
           ----------------------------------------------------- */

        if (sensorPoints.length) {
          timeline.to(
            sensorPoints,
            {
              opacity: 1,
              scale: 1,

              duration: 0.8,

              stagger: 0.15,

              ease: "back.out(1.7)"
            },
            "-=0.5"
          );
        }


        timeline.to(
          {},
          {
            duration: 0.8
          }
        );
      }
    );
  }


  /* =========================================================
     REASSEMBLE
     ========================================================= */

  function initReassemble() {
    const section =
      document.querySelector(
        "#tech_reassemble"
      );

    if (!section) return;

    const stage =
      section.querySelector(
        ".tech_reassemble_stage"
      );

    const frames =
      gsap.utils.toArray(
        ".reassemble_frame",
        section
      );

    const copy =
      section.querySelector(
        ".reassemble_copy"
      );

    const progress =
      section.querySelector(
        ".reassemble_progress_line span"
      );


    if (
      !stage ||
      !frames.length
    ) {
      return;
    }


    /* ---------------------------------------------------------
       HEADPHONE ONLY
       --------------------------------------------------------- */

    const headphone =
      frames[0];


    /* ---------------------------------------------------------
       SENSOR / PARTS HIDDEN
       --------------------------------------------------------- */

    gsap.set(
      frames.slice(1),
      {
        display: "none"
      }
    );


    /* ---------------------------------------------------------
       INITIAL STATE
       --------------------------------------------------------- */

    gsap.set(
      headphone,
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        filter: "blur(0px)",
        transformOrigin:
          "center center",
        transformPerspective: 1400
      }
    );

    gsap.set(
      copy,
      {
        opacity: 0,
        y: 35
      }
    );


    /* ---------------------------------------------------------
       TIMELINE
       --------------------------------------------------------- */

    const timeline =
      gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: "top top",
          end: "bottom bottom",

          scrub: 1,

          pin: stage,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            if (progress) {
              progress.style.width =
                `${self.progress * 100}%`;
            }
          }
        }
      });


    /* ---------------------------------------------------------
       HEADPHONE ROTATION
       --------------------------------------------------------- */

    timeline.to(
      headphone,
      {
        rotationY: 360,

        scale: 1.06,

        duration: 3,

        ease: "none"
      }
    );


    /* ---------------------------------------------------------
       COPY
       --------------------------------------------------------- */

    timeline.to(
      copy,
      {
        opacity: 1,
        y: 0,

        duration: 0.8,

        ease: "power3.out"
      },
      "-=0.4"
    );
  }


  /* =========================================================
     SHOP CARDS
     ========================================================= */

  function initShopCards() {
    const cards =
      document.querySelectorAll(
        ".tech_card"
      );

    cards.forEach(
      (card) => {

        const image =
          card.querySelector(
            ".tech_card_visual img"
          );

        if (!image) return;


        card.addEventListener(
          "mouseenter",
          () => {

            gsap.to(
              image,
              {
                scale: 1.06,

                duration: 0.5,

                ease: "power2.out"
              }
            );
          }
        );


        card.addEventListener(
          "mouseleave",
          () => {

            gsap.to(
              image,
              {
                scale: 1,

                duration: 0.5,

                ease: "power2.out"
              }
            );
          }
        );
      }
    );
  }


  /* =========================================================
     REFRESH
     ========================================================= */

  function refreshScroll() {
    window.setTimeout(
      () => {
        ScrollTrigger.refresh();
      },
      500
    );
  }


  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    preloadImages();

    initIntro();

    initProductSequence();

    initFeatureSections();

    initReassemble();

    initShopCards();

    refreshScroll();
  }


  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();