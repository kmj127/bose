/* =========================================================
   history.js
   BOSE History Page

  1. 공통 footer와 header는 common.js에서 생성
  2. ScrollTrigger 기반 책장 넘김 및 fade-up reveal
   ========================================================= */


/* =========================================================
   HISTORY FOOTER
   ========================================================= */

function renderHistoryFooter() {

  const commonFooter =
    document.querySelector(".site_footer");

  if (commonFooter) {
    commonFooter.remove();
  }


  const footer =
    document.createElement("footer");

  footer.className =
    "history_footer";

  footer.innerHTML = `

    <div class="history_footer_inner">


      <!-- LOGO -->

      <a
        href="home.html"
        class="history_footer_logo"
        aria-label="BOSE 홈으로"
      >
          aria-label="YouTube"
        >

          <img
            src="images/icons/youtube.svg"
            alt=""
          >

        </a>


        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >

          <img
            src="images/icons/instagram.svg"
            alt=""
          >

        </a>

      </div>


      <!-- NAV -->

      <nav
        class="history_footer_nav"
        aria-label="Footer navigation"
      >

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


      <!-- CUSTOMER CENTER -->

      <p class="history_footer_contact">
        고객센터 070-8655-2661 / AS센터 02-3446-3514
      </p>


      <!-- LINE -->

      <div
        class="history_footer_line"
        aria-hidden="true"
      ></div>


      <!-- COMPANY -->

      <p class="history_footer_company">
        더블정보기술(주) 서울특별시 용산구 한강대로52길 25-8 5F
      </p>


      <!-- POLICY -->

      <div class="history_footer_policy">

        <a href="#">
          이용약관
        </a>

        <a href="#">
          개인정보처리방침
        </a>

      </div>

    </div>

  `;


  document.body.appendChild(footer);
}



/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function initHistoryReveal() {

  if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined"
  ) {
    return;
  }


  gsap.registerPlugin(
    ScrollTrigger
  );


  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduceMotion) {

    gsap.set(
      ".history_title, .history_copy, .history_image, .history_quote p",
      {
        opacity: 1,
        y: 0,
        clearProps: "transform"
      }
    );

    return;
  }


  /* =======================================================
     PAGE TURN
     ======================================================= */

  gsap.utils
    .toArray(".history_section")
    .forEach((section) => {

      gsap.fromTo(
        section,

        {
          opacity: 1,
          rotateX: 14,
          y: 96,
          scale: 0.96,
          transformPerspective: 1800,
          transformOrigin: "center top"
        },

        {
          opacity: 1,
          rotateX: 0,
          y: 0,
          scale: 1,
          transformPerspective: 1800,
          transformOrigin: "center top",
          ease: "none",

          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 18%",
            scrub: 1
          }
        }
      );

    });


  /* =======================================================
     TITLE
     ======================================================= */

  gsap.utils
    .toArray(".history_title")
    .forEach((title) => {

      gsap.fromTo(
        title,

        {
          opacity: 0,
          y: 20
        },

        {
          opacity: 1,
          y: 0,

          duration: 0.8,

          ease: "power2.out",

          scrollTrigger: {

            trigger: title.closest(
              ".history_section"
            ),

            start: "top 75%",

            toggleActions:
              "play none none reverse"

          }

        }
      );

    });



  /* =======================================================
     COPY
     ======================================================= */

  gsap.utils
    .toArray(".history_copy")
    .forEach((copy) => {

      const eyebrow =
        copy.querySelector(
          ".history_eyebrow"
        );

      const paragraphs =
        copy.querySelectorAll(
          ".history_body p"
        );


      const targets = [];


      if (eyebrow) {
        targets.push(eyebrow);
      }


      paragraphs.forEach((p) => {
        targets.push(p);
      });


      if (!targets.length) {
        return;
      }


      gsap.fromTo(
        targets,

        {
          opacity: 0,
          y: 20
        },

        {
          opacity: 1,
          y: 0,

          duration: 0.7,

          ease: "power2.out",

          stagger: 0.08,

          scrollTrigger: {

            trigger: copy.closest(
              ".history_section"
            ),

            start: "top 72%",

            toggleActions:
              "play none none reverse"

          }

        }
      );

    });



  /* =======================================================
     IMAGE
     ======================================================= */

  gsap.utils
    .toArray(".history_image")
    .forEach((image) => {

      gsap.fromTo(
        image,

        {
          opacity: 0,
          y: 24
        },

        {
          opacity: 1,
          y: 0,

          duration: 0.9,

          ease: "power2.out",

          scrollTrigger: {

            trigger:
              image.closest(
                ".history_section"
              ),

            start: "top 75%",

            toggleActions:
              "play none none reverse"

          }

        }
      );

    });



  /* =======================================================
     QUOTE
     ======================================================= */

  const quote =
    document.querySelector(
      ".history_quote p"
    );


  if (quote) {

    gsap.fromTo(
      quote,

      {
        opacity: 0,
        y: 20
      },

      {
        opacity: 1,
        y: 0,

        duration: 0.8,

        ease: "power2.out",

        scrollTrigger: {

          trigger:
            ".history_quote",

          start: "top 75%",

          toggleActions:
            "play none none reverse"

        }

      }
    );

  }

}


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initHistoryReveal();


    /*
     * ScrollTrigger가
     * 이미지/텍스트 위치를 정확하게
     * 다시 계산하도록 refresh
     */

    if (
      typeof ScrollTrigger !== "undefined"
    ) {

      ScrollTrigger.refresh();

    }

  }
);