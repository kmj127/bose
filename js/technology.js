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
      const offset = clamp((r.top + r.height / 2 - innerHeight / 2) / innerHeight, -1, 1);   // 화면 중앙 기준 -1 ~ 1
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


  /* ── 노이즈 캔슬링: 실제 소리 (Web Audio, 파일 없이 합성) ── */

  const soundBtn = document.getElementById("anc_sound");
  const soundLabel = document.getElementById("anc_sound_label");

  let audio = null;              // '소리 듣기'를 처음 누를 때 만들어짐
  let soundOn = false;           // 소리 재생 여부
  let player = null;             // 음악을 이어서 연주하는 타이머

  const NOISE_OFF = 0.6;         // 캔슬링 꺼짐: 소음 크기
  const NOISE_ON = 0.03;         // 캔슬링 켜짐: 소음 크기 (거의 안 들림)
  const FILTER_OFF = 2500;       // 꺼짐: 소음에 고음까지 남음
  const FILTER_ON = 400;         // 켜짐: 고음이 깎여 먹먹해짐
  const VOLUME = 0.55;           // 전체 볼륨


  /* ── 음악 데이터: 피아노 · 베이스 기타 · 드럼 밴드 (Am → F → C → G) ── */

  // bass = 베이스 기타 음, piano = 피아노 화음, melody = 피아노 멜로디 음
  const BAND_CHORDS = [
    { bass: 110.00, piano: [261.63, 329.63, 440.00], melody: [659.25, 880.00] },   // Am
    { bass: 87.31,  piano: [261.63, 349.23, 440.00], melody: [698.46, 880.00] },   // F
    { bass: 130.81, piano: [261.63, 329.63, 392.00], melody: [659.25, 784.00] },   // C
    { bass: 98.00,  piano: [246.94, 293.66, 392.00], melody: [587.33, 784.00] }    // G
  ];

  // 베이스 리듬: [박 번호, 음 높이 배율] (1 = 으뜸음, 2 = 한 옥타브 위, 1.5 = 5도)
  const BASS_LINE = [[0, 1], [1, 1], [2, 2], [3, 1], [4, 1], [6, 1.5], [7, 2]];


  /* ── 연주 (tick: 한 박마다 호출되어 악기를 울림) ── */

  // 처음부터 풀 밴드로 연주 (한 마디 = 8박, 4마디마다 크래시 심벌, 마지막 마디는 드럼 필인)
  const BAND = {
    beat: 0.26,                                      // 8분음표 길이(초), 약 115 BPM

    tick: function (step, time, inst) {
      const bar = Math.floor(step / 8);
      const chord = BAND_CHORDS[bar % 4];
      const beat = step % 8;
      const lastBar = bar % 4 === 3;

      // 피아노: 코드를 끊어 치기 (1·4·5·7박)
      if (beat === 0) chord.piano.forEach(function (f) { inst.piano(f, time, 1.2, 0.26); });
      if (beat === 3 || beat === 4 || beat === 7) chord.piano.forEach(function (f) { inst.piano(f, time, 0.5, 0.2); });

      // 피아노 멜로디
      if (beat === 2) inst.piano(chord.melody[0], time, 0.9, 0.2);
      if (beat === 5) inst.piano(chord.melody[1], time, 0.9, 0.2);

      // 베이스 기타
      BASS_LINE.forEach(function (n) {
        if (n[0] === beat) inst.bass(chord.bass * n[1], time);
      });

      // 킥 (1·4·5박), 스네어 (3·7박), 하이햇 (매 박)
      if (beat === 0 || beat === 3 || beat === 4) inst.kick(time);
      if (beat === 2 || beat === 6) inst.snare(time);
      inst.hat(time, beat % 2 === 0 ? 0.13 : 0.08);

      // 4마디마다 크래시 심벌, 마지막 마디 끝은 스네어 연타(필인)
      if (bar % 4 === 0 && beat === 0) inst.crash(time);
      if (lastBar && beat === 7) inst.snare(time);
    }
  };


  /* ── 오디오 만들기 ── */

  function createAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ac = new AC();

    // 전체 볼륨 (처음엔 0, 재생할 때 서서히 올림)
    const master = ac.createGain();
    master.gain.value = 0;

    // 소리가 겹쳐 커져도 깨지지 않게 눌러 주는 장치
    const limiter = ac.createDynamicsCompressor();
    master.connect(limiter);
    limiter.connect(ac.destination);

    // 주변 소음: 지하철·도로처럼 낮게 깔리는 소리 + 지나가는 바람 소리 + 웅성거리는 사람 소리
    const length = ac.sampleRate * 2;
    const buffer = ac.createBuffer(1, length, ac.sampleRate);       // 흰 잡음 (치익)
    const brown = ac.createBuffer(1, length, ac.sampleRate);        // 갈색 잡음 (웅웅)
    const white = buffer.getChannelData(0);
    const low = brown.getChannelData(0);
    let last = 0;

    for (let i = 0; i < length; i++) {
      const w = Math.random() * 2 - 1;
      white[i] = w;
      last = (last + 0.02 * w) / 1.02;
      low[i] = last * 3.5;
    }

    // 모든 소음이 모이는 곳 → 필터 → 크기 (스위치가 이 둘을 조절)
    const noiseMix = ac.createGain();

    const noiseFilter = ac.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = isOn ? FILTER_ON : FILTER_OFF;

    const noiseGain = ac.createGain();
    noiseGain.gain.value = isOn ? NOISE_ON : NOISE_OFF;

    noiseMix.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    // 소음 한 겹 만들기: 잡음, 필터 종류, 중심 주파수, 폭, 크기
    function noiseLayer(buf, type, freq, q, level) {
      const src = ac.createBufferSource();
      const filter = ac.createBiquadFilter();
      const gain = ac.createGain();

      src.buffer = buf;
      src.loop = true;
      filter.type = type;
      filter.frequency.value = freq;
      filter.Q.value = q;
      gain.gain.value = level;

      src.connect(filter);
      filter.connect(gain);
      gain.connect(noiseMix);
      src.start();

      return gain;
    }

    // 소리 크기를 천천히 흔들기 (지나가는 차, 웅성거림 느낌)
    function wobble(layer, rate, depth) {
      const lfo = ac.createOscillator();
      const amount = ac.createGain();

      lfo.frequency.value = rate;
      amount.gain.value = depth;
      lfo.connect(amount);
      amount.connect(layer.gain);
      lfo.start();
    }

    noiseLayer(brown, "lowpass", 300, 0.7, 1.2);                       // 낮게 깔리는 웅웅 소리

    const roar = noiseLayer(buffer, "bandpass", 900, 0.5, 0.35);       // 지나가는 바람·차 소리
    wobble(roar, 0.13, 0.25);

    const voices = noiseLayer(buffer, "bandpass", 650, 1.3, 0.22);     // 웅성거리는 사람 소리
    wobble(voices, 3.3, 0.14);
    wobble(voices, 5.7, 0.08);

    const voices2 = noiseLayer(buffer, "bandpass", 1500, 1.6, 0.12);
    wobble(voices2, 4.1, 0.08);

    noiseLayer(buffer, "highpass", 4500, 0.7, 0.04);                   // 치익 하는 공기 소리

    // 음악 출력 + 울림(리버브): 2.8초 동안 사라지는 잡음으로 넓은 홀 느낌
    const musicGain = ac.createGain();
    musicGain.gain.value = 0.7;

    const irLength = Math.floor(ac.sampleRate * 2.8);
    const ir = ac.createBuffer(2, irLength, ac.sampleRate);

    for (let c = 0; c < 2; c++) {
      const ch = ir.getChannelData(c);
      for (let i = 0; i < irLength; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLength, 2.5);
      }
    }

    const reverb = ac.createConvolver();
    reverb.buffer = ir;

    const wet = ac.createGain();
    wet.gain.value = 0.5;

    musicGain.connect(master);
    musicGain.connect(reverb);
    reverb.connect(wet);
    wet.connect(master);


    /* ── 악기 모음 ── */

    // 음 하나를 울리는 공통 도구: 파형, 높이, 시작, 길이, 크기
    function tone(type, freq, time, attack, length, peak) {
      const osc = ac.createOscillator();
      const env = ac.createGain();

      osc.type = type;
      osc.frequency.value = freq;

      env.gain.setValueAtTime(0.0001, time);
      env.gain.linearRampToValueAtTime(peak, time + attack);
      env.gain.exponentialRampToValueAtTime(0.0001, time + length);

      osc.connect(env);
      env.connect(musicGain);
      osc.start(time);
      osc.stop(time + length + 0.05);
    }

    const inst = {

      // 피아노: 삼각파 + 한 옥타브 위 사인파
      piano: function (freq, time, length, peak) {
        tone("triangle", freq, time, 0.004, length, peak);
        tone("sine", freq * 2, time, 0.004, length * 0.5, peak * 0.3);
      },

      // 베이스 기타: 톱니파를 필터로 둥글게 + 낮은 사인파로 묵직하게
      bass: function (freq, time) {
        const osc = ac.createOscillator();
        const filter = ac.createBiquadFilter();
        const env = ac.createGain();

        osc.type = "sawtooth";
        osc.frequency.value = freq;
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1100, time);
        filter.frequency.exponentialRampToValueAtTime(260, time + 0.3);   // 튕긴 직후 밝았다가 둥글어짐
        filter.Q.value = 2;

        env.gain.setValueAtTime(0.0001, time);
        env.gain.linearRampToValueAtTime(0.45, time + 0.01);
        env.gain.exponentialRampToValueAtTime(0.0001, time + 0.5);

        osc.connect(filter);
        filter.connect(env);
        env.connect(musicGain);
        osc.start(time);
        osc.stop(time + 0.55);

        tone("sine", freq * 2, time, 0.01, 0.4, 0.25);                    // 작은 스피커에서도 들리도록 한 옥타브 위 소리 추가
      },

      // 킥: 낮은 북소리 + 딱 하는 소리
      kick: function (time) {
        const osc = ac.createOscillator();
        const env = ac.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(140, time);
        osc.frequency.exponentialRampToValueAtTime(48, time + 0.14);

        env.gain.setValueAtTime(0.95, time);
        env.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);

        osc.connect(env);
        env.connect(musicGain);
        osc.start(time);
        osc.stop(time + 0.36);

        tone("square", 170, time, 0.001, 0.02, 0.25);
      },

      // 스네어: 잡음 + 짧은 북소리
      snare: function (time) {
        const src = ac.createBufferSource();
        const filter = ac.createBiquadFilter();
        const env = ac.createGain();

        src.buffer = buffer;
        filter.type = "bandpass";
        filter.frequency.value = 1900;

        env.gain.setValueAtTime(0.6, time);
        env.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);

        src.connect(filter);
        filter.connect(env);
        env.connect(musicGain);
        src.start(time, Math.random() * 1.5, 0.25);

        tone("sine", 190, time, 0.002, 0.12, 0.3);
      },

      // 하이햇: 잡음을 아주 짧게 (고음만 남김)
      hat: function (time, peak) {
        const src = ac.createBufferSource();
        const filter = ac.createBiquadFilter();
        const env = ac.createGain();

        src.buffer = buffer;
        filter.type = "highpass";
        filter.frequency.value = 6500;

        env.gain.setValueAtTime(peak, time);
        env.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);

        src.connect(filter);
        filter.connect(env);
        env.connect(musicGain);
        src.start(time, Math.random() * 1.5, 0.1);
      },

      // 크래시 심벌: 길게 울리는 고음 잡음
      crash: function (time) {
        const src = ac.createBufferSource();
        const filter = ac.createBiquadFilter();
        const env = ac.createGain();

        src.buffer = buffer;
        filter.type = "highpass";
        filter.frequency.value = 5000;

        env.gain.setValueAtTime(0.22, time);
        env.gain.exponentialRampToValueAtTime(0.0001, time + 1.4);

        src.connect(filter);
        filter.connect(env);
        env.connect(musicGain);
        src.start(time, Math.random() * 0.5, 1.5);
      }

    };

    return { ac: ac, master: master, noiseGain: noiseGain, noiseFilter: noiseFilter, inst: inst };
  }


  /* ── 음악 연주 시작 / 멈춤 ── */

  function startTrack() {
    stopTrack();

    const ac = audio.ac;
    let step = 0;
    let nextTime = ac.currentTime + 0.1;

    // 0.1초마다 확인해서 다음 0.3초 안에 울릴 음을 미리 예약
    function schedule() {
      while (nextTime < ac.currentTime + 0.3) {
        BAND.tick(step, nextTime, audio.inst);
        step++;
        nextTime += BAND.beat;
      }
    }

    schedule();
    player = setInterval(schedule, 100);
  }

  function stopTrack() {
    clearInterval(player);
    player = null;
  }


  /* ── 스위치 상태에 맞춰 소음 조절 ── */

  function setAncSound(on) {
    if (!audio) return;

    const t = audio.ac.currentTime;
    audio.noiseGain.gain.setTargetAtTime(on ? NOISE_ON : NOISE_OFF, t, 0.25);
    audio.noiseFilter.frequency.setTargetAtTime(on ? FILTER_ON : FILTER_OFF, t, 0.25);
  }


  /* ── '소리 듣기' / '소리 끄기' ── */

  function toggleSound() {
    if (!audio) audio = createAudio();

    const t = audio.ac.currentTime;
    soundOn = !soundOn;

    if (soundOn) {
      audio.ac.resume();
      audio.master.gain.setTargetAtTime(VOLUME, t, 0.3);
      startTrack();
    } else {
      audio.master.gain.setTargetAtTime(0, t, 0.15);
      stopTrack();

      setTimeout(function () {
        if (!soundOn) audio.ac.suspend();
      }, 700);
    }

    soundBtn.setAttribute("aria-pressed", soundOn);
    soundLabel.textContent = soundOn ? "소리 끄기" : "소리 듣기";
  }

  function stopSound() {
    if (soundOn) toggleSound();
  }


  /* ── 노이즈 캔슬링: 스위치 ── */

  function initAnc() {
    if (!canvas) return;

    resizeCanvas();
    addEventListener("resize", resizeCanvas);

    // 화면에 보일 때만 그림 (성능)
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (!visible) stopSound();                 // 섹션을 벗어나면 소리 끔
    }).observe(canvas);

    // 소리 버튼 / 다른 탭으로 이동하면 소리 끔
    soundBtn.addEventListener("click", toggleSound);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopSound();
    });

    btn.addEventListener("click", function () {
      isOn = !isOn;
      setAncSound(isOn);                         // 소리도 함께 바뀜
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