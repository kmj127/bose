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


  /* ── 노이즈 캔슬링: 실제 소리 (Web Audio, 파일 없이 합성) ── */

  const soundBtn = document.getElementById("anc_sound");
  const soundLabel = document.getElementById("anc_sound_label");

  let audio = null;              // '소리 듣기'를 처음 누를 때 만들어짐
  let soundOn = false;           // 소리 재생 여부
  let player = null;             // 음악을 이어서 연주하는 타이머

  const NOISE_OFF = 0.5;         // 캔슬링 꺼짐: 소음 크기
  const NOISE_ON = 0.03;         // 캔슬링 켜짐: 소음 크기 (거의 안 들림)
  const FILTER_OFF = 2500;       // 꺼짐: 소음에 고음까지 남음
  const FILTER_ON = 400;         // 켜짐: 고음이 깎여 먹먹해짐
  const VOLUME = 0.5;            // 전체 볼륨


  /* ── 음악 데이터: 잔잔한 팝 밴드 (C → G → Am → F) ── */

  // bass = 베이스 음, piano = 피아노 화음, guitar = 기타 아르페지오 음 4개, melody = 피아노 멜로디 2음
  const BAND_CHORDS = [
    { bass: 130.81, piano: [261.63, 329.63, 392.00], guitar: [130.81, 196.00, 261.63, 329.63], melody: [659.25, 783.99] },   // C
    { bass: 98.00,  piano: [246.94, 293.66, 392.00], guitar: [196.00, 246.94, 293.66, 392.00], melody: [587.33, 783.99] },   // G
    { bass: 110.00, piano: [261.63, 329.63, 440.00], guitar: [110.00, 220.00, 261.63, 329.63], melody: [659.25, 880.00] },   // Am
    { bass: 87.31,  piano: [261.63, 349.23, 440.00], guitar: [174.61, 220.00, 261.63, 349.23], melody: [698.46, 880.00] }    // F
  ];
  const GUITAR_PATTERN = [0, 2, 3, 2, 1, 2, 3, 2];     // 기타 손가락 연주 순서 (8박)


  /* ── 연주 (tick: 한 박마다 호출되어 악기를 울림) ── */

  // 피아노로 시작해 기타·베이스 → 드럼 → 풀 연주 순으로 쌓임
  const BAND = {
    beat: 0.33,                                      // 8분음표 길이(초), 약 91 BPM

    tick: function (step, time, inst) {
      const bar = Math.floor(step / 8) % 16;         // 16마디를 반복
      const chord = BAND_CHORDS[bar % 4];
      const layer = Math.floor(bar / 4);             // 0: 피아노, 1: +기타·베이스, 2: +킥·하이햇, 3: +스네어
      const beat = step % 8;

      // 피아노: 1박과 5박에 화음 (항상)
      if (beat === 0 || beat === 4) {
        chord.piano.forEach(function (f) { inst.piano(f, time); });
      }

      // 기타·베이스 (두 번째 단계부터)
      if (layer >= 1) {
        inst.guitar(chord.guitar[GUITAR_PATTERN[beat]], time);
        if (beat === 0 || beat === 4) inst.bass(chord.bass, time);
        if (beat === 2) inst.piano(chord.melody[0], time);       // 피아노 멜로디
        if (beat === 6) inst.piano(chord.melody[1], time);
      }

      // 킥 + 하이햇 (세 번째 단계부터)
      if (layer >= 2) {
        if (beat === 0 || beat === 3 || beat === 4) inst.kick(time);
        inst.hat(time);
      }

      // 스네어 (네 번째 단계: 2·4박)
      if (layer >= 3 && (beat === 2 || beat === 6)) inst.snare(time);
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

    // 소음: 낮은 웅웅 소리 + 치익 소리를 섞은 2초짜리 반복
    const length = ac.sampleRate * 2;
    const buffer = ac.createBuffer(1, length, ac.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;

    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 2.1 + white * 0.25;
    }

    const noiseSource = ac.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const noiseFilter = ac.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = isOn ? FILTER_ON : FILTER_OFF;

    const noiseGain = ac.createGain();
    noiseGain.gain.value = isOn ? NOISE_ON : NOISE_OFF;

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noiseSource.start();

    // 음악 출력 + 울림(리버브): 2.8초 동안 사라지는 잡음으로 넓은 홀 느낌
    const musicGain = ac.createGain();
    musicGain.gain.value = 0.6;

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

    // 기타 소리 만들기: 줄을 튕긴 뒤 점점 사라지는 소리를 계산해서 만듦 (Karplus-Strong)
    const guitarCache = {};

    function guitarBuffer(freq) {
      if (guitarCache[freq]) return guitarCache[freq];

      const n = Math.floor(ac.sampleRate * 1.8);
      const buf = ac.createBuffer(1, n, ac.sampleRate);
      const d = buf.getChannelData(0);
      const period = Math.round(ac.sampleRate / freq);

      for (let i = 0; i < period + 1; i++) d[i] = Math.random() * 2 - 1;      // 처음 튕김
      for (let i = period + 1; i < n; i++) {
        d[i] = 0.4985 * (d[i - period] + d[i - period - 1]);                  // 평균내며 사라짐
      }

      guitarCache[freq] = buf;
      return buf;
    }

    const inst = {

      // 피아노: 삼각파 + 한 옥타브 위 사인파, 빠르게 사라짐
      piano: function (freq, time) {
        tone("triangle", freq, time, 0.005, 1.4, 0.2);
        tone("sine", freq * 2, time, 0.005, 0.7, 0.06);
      },

      // 어쿠스틱 기타: 줄 튕기는 소리를 살짝 부드럽게
      guitar: function (freq, time) {
        const src = ac.createBufferSource();
        const filter = ac.createBiquadFilter();
        const env = ac.createGain();

        src.buffer = guitarBuffer(freq);
        filter.type = "lowpass";
        filter.frequency.value = 3200;

        env.gain.setValueAtTime(0.5, time);
        env.gain.exponentialRampToValueAtTime(0.0001, time + 1.7);

        src.connect(filter);
        filter.connect(env);
        env.connect(musicGain);
        src.start(time);
      },

      // 베이스
      bass: function (freq, time) {
        tone("sine", freq, time, 0.015, 1.2, 0.5);
      },

      // 킥: 낮은 북소리
      kick: function (time) {
        const osc = ac.createOscillator();
        const env = ac.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(120, time);
        osc.frequency.exponentialRampToValueAtTime(45, time + 0.15);

        env.gain.setValueAtTime(0.7, time);
        env.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

        osc.connect(env);
        env.connect(musicGain);
        osc.start(time);
        osc.stop(time + 0.4);
      },

      // 스네어: 잡음 + 짧은 북소리
      snare: function (time) {
        const src = ac.createBufferSource();
        const filter = ac.createBiquadFilter();
        const env = ac.createGain();

        src.buffer = buffer;
        filter.type = "bandpass";
        filter.frequency.value = 1800;

        env.gain.setValueAtTime(0.35, time);
        env.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

        src.connect(filter);
        filter.connect(env);
        env.connect(musicGain);
        src.start(time, Math.random() * 1.5, 0.2);

        tone("sine", 190, time, 0.002, 0.12, 0.25);
      },

      // 하이햇: 잡음을 아주 짧게 (고음만 남김)
      hat: function (time) {
        const src = ac.createBufferSource();
        const filter = ac.createBiquadFilter();
        const env = ac.createGain();

        src.buffer = buffer;
        filter.type = "highpass";
        filter.frequency.value = 6000;

        env.gain.setValueAtTime(0.1, time);
        env.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);

        src.connect(filter);
        filter.connect(env);
        env.connect(musicGain);
        src.start(time, Math.random() * 1.5, 0.08);
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