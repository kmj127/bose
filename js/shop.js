/* =========================================================
   shop.js — Shop 페이지 전용 스크립트
   결정사항: 필터 칩 / 정렬 / 페이지네이션은 "시각용"이며 실제 목록을
   필터링·정렬하지 않습니다. 색상 스와치는 "첫 제품 카드에만" 동작합니다.
   ========================================================= */

/* ---------- 1) 첫 제품 카드: 컬러 스와치 → 이미지 전환 ---------- */
function initSwatchInteraction() {
  const swatchButtons = document.querySelectorAll(".swatch_btn");
  const productImg = document.getElementById("swatch_product_img");
  if (!swatchButtons.length || !productImg) return;

  const handleSwatchClick = (clicked) => {
    swatchButtons.forEach((btn) => {
      const isSelected = btn === clicked;
      btn.classList.toggle("is_active", isSelected);
      btn.setAttribute("aria-pressed", String(isSelected));
    });
    productImg.src = clicked.dataset.img;
  };

  swatchButtons.forEach((btn) => {
    btn.addEventListener("click", () => handleSwatchClick(btn));
  });
}

/* ---------- 2) 필터 칩: 선택 표시만 전환 (목록 필터링 없음) ---------- */
function initFilterChips() {
  const chips = document.querySelectorAll(".filter_chip");
  if (!chips.length) return;

  const handleChipClick = (clicked) => {
    chips.forEach((chip) => chip.classList.toggle("is_active", chip === clicked));
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => handleChipClick(chip));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSwatchInteraction();
  initFilterChips();
});
