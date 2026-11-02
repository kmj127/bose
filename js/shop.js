/* =========================================================
   shop.js — Shop 페이지 전용 스크립트
   결정사항: 필터 칩 / 정렬 / 페이지네이션은 "시각용"이며 실제 목록을
   필터링·정렬하지 않습니다. 색상 스와치는 "첫 제품 카드에만" 동작합니다.
   ========================================================= */

/* ---------- 1) 첫 제품 카드: 컬러 스와치 → 이미지 전환 ---------- */
function initSwatchInteraction() {
  const swatchList = document.querySelector(".swatch_list:not(.swatch_list--static)");
  const productImg = document.getElementById("swatch_product_img");
  if (!swatchList || !productImg) return;

  const swatchButtons = swatchList.querySelectorAll(".swatch_btn");
  if (!swatchButtons.length) return;

  let latestSrc = productImg.getAttribute("src");
  let hasPreloaded = false;

  /* 큰 이미지(1600×2000)라 깜빡임이 없도록 미리 불러오기 */
  const handlePreload = () => {
    if (hasPreloaded) return;
    hasPreloaded = true;
    swatchButtons.forEach((btn) => {
      const preloader = new Image();
      preloader.src = btn.dataset.img;
    });
  };

  const applyImage = (src) => {
    /* 빠르게 연속 클릭해도 마지막으로 누른 색상만 반영 */
    if (src === latestSrc) productImg.src = src;
  };

  const handleSwatchClick = (clicked) => {
    if (clicked.classList.contains("is_active")) return;

    swatchButtons.forEach((btn) => {
      const isSelected = btn === clicked;
      btn.classList.toggle("is_active", isSelected);
      btn.setAttribute("aria-pressed", String(isSelected));
    });

    const nextSrc = clicked.dataset.img;
    latestSrc = nextSrc;

    const loader = new Image();
    loader.src = nextSrc;

    if (typeof loader.decode === "function") {
      loader.decode().then(() => applyImage(nextSrc), () => applyImage(nextSrc));
    } else {
      applyImage(nextSrc);
    }
  };

  swatchList.addEventListener("pointerenter", handlePreload, { once: true });
  swatchList.addEventListener("focusin", handlePreload, { once: true });

  swatchButtons.forEach((btn) => {
    btn.addEventListener("click", () => handleSwatchClick(btn));
  });
}

/* ---------- 2) 필터 칩: 선택 표시만 전환 (목록 필터링 없음) ---------- */
function initFilterChips() {
  const chips = document.querySelectorAll(".filter_chip");
  if (!chips.length) return;

  const handleChipClick = (clicked) => {
    chips.forEach((chip) => {
      const isSelected = chip === clicked;
      chip.classList.toggle("is_active", isSelected);
      chip.setAttribute("aria-pressed", String(isSelected));
    });
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => handleChipClick(chip));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSwatchInteraction();
  initFilterChips();
});