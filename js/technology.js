/* =========================================================
   technology.js
   목차: 설정 / 공통 / 분해도 / 기능 섹션 패럴랙스 / 노이즈 캔슬링 / 시작
   ========================================================= */

(function () {
  "use strict";


  /* ── 설정 (숫자를 바꾸면 모션이 바뀜) ── */

  const OPEN_END = 0.3;          // 스크롤의 몇 %까지 부품이 벌어지는지
  const SIZE_BY_HEIGHT = 0.4;    // 부품 높이 = 화면 높이 × 0.4
  const SIZE_BY_WIDTH = 0.22;    // 부품 높이 = 화면 너비 × 0.22 (작은 값 사용)
  const STEP_RATIO = 0.8;        // 벌어졌을 때 부품 간격
  const STACK_RATIO = 0.05;      // 겹쳐 있을 때 어긋나는 정도
  const CENTER_Y = 0.44;         // 부품 세로 위치
  const PARALLAX = 60;           // 기능 섹션 이미지가 움직이는 거리(px)

  // 부품 설명 (이미지 순서: 왼쪽 → 오른쪽)
  const PARTS = [
    { name: "외부 캡", desc: "모든 부품을 감싸는 바깥 층입니다. 겉에서는 여기까지만 보입니다." },
    { name: "프로세서 보드", desc: "들어온 소음을 분석해 반대 파형을 계산합니다. 눈에 보이지 않는 계산이 여기서 일어납니다." },
    { name: "마이크 센서 링", desc: "바깥과 안쪽의 소음을 실시간으로 듣습니다. 반대 위상 신호의 재료가 됩니다." },
    { name: "드라이버", desc: "전기 신호를 진동으로 바꿔 소리를 냅니다. 이어컵 안쪽에서 귀를 향해 울립니다." },
    { name: "이어 쿠션", desc: "귀에 닿는 부분입니다. 소음이 새어 들어오지 않도록 물리적으로 먼저 막습니다." }
  ];


  /* ── 공통 ── */

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // 처음엔 천천히, 중간엔 빠르게, 끝엔 다시 천천히
  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }


  /* ── 분해도: 요소 ── */

  const seq = document.getElementById("tech_seq");
  const parts = Array.from(document.querySelectorAll(".seq_part"));
  const svg = document.getElementById("seq_svg");
  const nameEl = document.getElementById("seq_name");
  const descEl = document.getElementById("seq_desc");
  const textBox = document.getElementById("seq_text");
  const barEl = document.getElementById("seq_bar");

  let focusNow = -2;             // 지금 강조 중인 부품 (-1 = 없음)
  let textTimer;


  /* ── 분해도: 지시선 만들기 ── */

  function makeSvg(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const key in attrs) el.setAttribute(key, attrs[key]);
    svg.appendChild(el);
    return el;
  }

  const lead = makeSvg("line", { class: "seq_lead" });
  const dot = makeSvg("circle", { class: "seq_dot", r: 3.5 });


  /* ── 분해도: 설명 글 바꾸기 ── */

  function setText(index) {
    if (index === focusNow) return;
    focusNow = index;

    clearTimeout(textTimer);
    textBox.classList.add("is_out");

    textTimer = setTimeout(function () {
      if (index < 0) {
        nameEl.textContent = "Inside";
        descEl.textContent = "하나의 이어컵 안에 다섯 개의 부품이 겹쳐 있습니다.";
      } else {
        nameEl.textContent = PARTS[index].name;
        descEl.textContent = PARTS[index].desc;
      }
      textBox.classList.remove("is_out");
    }, reduceMotion ? 0 : 160);
  }


  /* ── 분해도: 스크롤에 맞춰 그리기 ── */

  function renderSeq() {
    if (!seq) return;

    // (1) 진행도 0 ~ 1
    const rect = seq.getBoundingClientRect();
    const p = clamp(-rect.top / (rect.height - innerHeight), 0, 1);
    barEl.style.width = (p * 100) + "%";

    // (2) 벌어진 정도 0(겹침) ~ 1(완전히 벌어짐)
    const open = easeInOut(clamp(p / OPEN_END, 0, 1));

    // (3) 강조할 부품: 벌어진 뒤 순서대로 하나씩
    let focus = -1;
    if (p >= OPEN_END) {
      const after = (p - OPEN_END) / (1 - OPEN_END);
      focus = clamp(Math.floor(after * PARTS.length), 0, PARTS.length - 1);
    }
    setText(focus);

    // (4) 크기와 간격
    const partH = Math.min(innerHeight * SIZE_BY_HEIGHT, innerWidth * SIZE_BY_WIDTH);
    const step = partH * STEP_RATIO;
    const cy = innerHeight * CENTER_Y;

    // (5) 부품 배치
    parts.forEach(function (img, i) {
      const spread = step * open;
      const stack = partH * STACK_RATIO * (1 - open);
      const x = (i - 2) * (spread + stack);

      img.style.height = partH + "px";
      img.style.transform = "translate(calc(-50% + " + x + "px), -50%)";
      img.style.zIndex = PARTS.length - i;

      img.classList.toggle("is_on", i === focus);
      img.classList.toggle("is_dim", focus >= 0 && i !== focus);
    });

    // (6) 지시선: 강조된 부품 아래
    const has = focus >= 0;
    lead.classList.toggle("is_on", has);
    dot.classList.toggle("is_on", has);

    if (has) {
      const x = innerWidth / 2 + (focus - 2) * step;
      const y1 = cy + partH / 2 + 12;
      const y2 = y1 + 50;

      lead.setAttribute("x1", x);
      lead.setAttribute("x2", x);
      lead.setAttribute("y1", y1);
      lead.setAttribute("y2", y2);
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y2);
    }
  }


  /* ── 기능 섹션: 이미지 패럴랙스 ── */

  const floaters = Array.from(document.querySelectorAll("[data-parallax]"));

  function renderParallax() {
    if (reduceMotion) return;

    floaters.forEach(function (el) {
      const r = el.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;   // 화면 중앙 기준 -1 ~ 1
      el.style.setProperty("--shift", (-offset * PARALLAX).toFixed(1) + "px");
    });
  }


  /* ── 스크롤 / 리사이즈 연결 ── */

  let waiting = false;

  function renderAll() {
    renderSeq();
    renderParallax();
  }

  addEventListener("scroll", function () {
    if (waiting) return;
    waiting = true;

    requestAnimationFrame(function () {
      waiting = false;
      renderAll();
    });
  }, { passive: true });

  addEventListener("resize", renderAll);


  /* ── 노이즈 캔슬링: 요소 ── */

  const canvas = document.getElementById("anc_canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const btn = document.getElementById("anc_switch");
  const label = document.getElementById("anc_label");

  let isOn = false;              // 스위치 켜짐 여부
  let strength = 0;              // 캔슬링 세기 0 ~ 1 (부드럽게 따라감)
  let cw = 0;
  let ch = 0;
  let t0 = 0;
  let visible = true;


  /* ── 노이즈 캔슬링: 캔버스 크기 ── */

  function resizeCanvas() {
    const ratio = devicePixelRatio || 1;
    const box = canvas.getBoundingClientRect();

    cw = box.width;
    ch = box.height;
    canvas.width = cw * ratio;
    canvas.height = ch * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }


  /* ── 노이즈 캔슬링: 파형 ── */

  // 주변 소음 (사인파 3개를 섞음)
  function noise(x, t) {
    return (
      Math.sin(x * 0.011 + t * 1.7) * 0.50 +
      Math.sin(x * 0.027 - t * 2.6) * 0.32 +
      Math.sin(x * 0.061 + t * 4.1) * 0.18
    );
  }

  function drawLine(getY, color, width, alpha) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;

    for (let x = 0; x <= cw; x += 3) {
      const y = ch / 2 - getY(x) * ch * 0.38;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawWave(now) {
    const t = (now - t0) / 1000;
    strength += ((isOn ? 1 : 0) - strength) * 0.06;

    ctx.clearRect(0, 0, cw, ch);

    // 회색: 주변 소음
    drawLine(function (x) { return noise(x, t); }, "#6b6b6b", 1.3, 1);

    // 주황: 반대 위상 신호 (켜질수록 진하게)
    drawLine(function (x) { return -noise(x, t) * strength; }, "#ff6b35", 1.3, 0.25 + 0.75 * strength);

    // 흰색: 귀에 들리는 소리 (켜질수록 평평해짐)
    drawLine(function (x) { return noise(x, t) * (1 - strength); }, "#f2f2f2", 2.4, 1);
  }

  function loop(now) {
    if (visible) drawWave(now);
    requestAnimationFrame(loop);
  }


  /* ── 노이즈 캔슬링: 스위치 ── */

  function initAnc() {
    if (!canvas) return;

    resizeCanvas();
    addEventListener("resize", resizeCanvas);

    // 화면에 보일 때만 그림 (성능)
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }).observe(canvas);

    btn.addEventListener("click", function () {
      isOn = !isOn;
      btn.setAttribute("aria-pressed", isOn);
      label.textContent = isOn ? "노이즈 캔슬링 켜짐" : "노이즈 캔슬링 꺼짐";

      if (reduceMotion) {
        strength = isOn ? 1 : 0;
        drawWave(performance.now());
      }
    });

    if (reduceMotion) {
      drawWave(0);
    } else {
      requestAnimationFrame(function (now) {
        t0 = now;
        loop(now);
      });
    }
  }


  /* ── 시작 ── */

  renderAll();
  initAnc();

})();