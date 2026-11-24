(() => {
  "use strict";
  const one = (query, root = document) => root.querySelector(query);
  const all = (query, root = document) => Array.from(root.querySelectorAll(query));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const easing = "cubic-bezier(.22,1,.36,1)";

  // Shapes Slideshow, variante circulaire adaptée à l’ovale du logo.
  const stage = one("[data-stage]");
  if (stage) {
    const controls = one("[data-stage-controls]", stage);
    const keys = all("[data-stage-key]", controls);
    const figures = all("[data-stage-scene]", stage);
    const caption = one("[data-stage-caption]", stage);
    const action = one("[data-stage-action]", stage);
    const actionText = one("[data-stage-action-text]", action);
    const rotation = one("[data-stage-rotation]", stage);
    const compactStage = matchMedia("(max-width: 760px)");
    let current = figures.find((figure) => !figure.hidden);
    let wipe;
    let autoplay = !reduced.matches;
    let onScreen = true;
    let hovered = false;
    let clock;

    function select(key, animate = true) {
      const next = figures.find((figure) => figure.dataset.stageScene === key.dataset.stageKey);
      if (!next || next === current) return;
      wipe?.cancel();
      for (const figure of figures) {
        figure.hidden = figure !== current;
        figure.style.zIndex = "";
      }
      const previous = current;
      current = next;
      previous.setAttribute("aria-hidden", "true");
      next.removeAttribute("aria-hidden");
      next.hidden = false;
      next.style.zIndex = "2";
      caption.textContent = key.dataset.caption;
      actionText.textContent = key.dataset.link;
      action.href = key.dataset.href;
      for (const item of keys) item.setAttribute("aria-pressed", String(item === key));

      if (!animate || reduced.matches || !next.animate) {
        previous.hidden = true;
        return;
      }
      wipe = next.animate(compactStage.matches ? [
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0)" }
      ] : [
        { clipPath: "ellipse(0% 0% at 69% 50%)" },
        { clipPath: "ellipse(115% 110% at 69% 50%)" }
      ], { duration: 560, easing });
      wipe.onfinish = () => { previous.hidden = true; };
    }

    function schedule() {
      clearTimeout(clock);
      rotation.dataset.rotating = String(autoplay);
      rotation.setAttribute("aria-label", autoplay ? "Mettre les images en pause" : "Relancer le défilement des images");
      caption.setAttribute("aria-live", autoplay ? "off" : "polite");
      if (!autoplay || hovered || !onScreen || document.hidden) return;
      clock = setTimeout(() => {
        const index = keys.findIndex((key) => key.dataset.stageKey === current.dataset.stageScene);
        select(keys[(index + 1) % keys.length]);
        schedule();
      }, 7000);
    }

    function stop() {
      if (!autoplay) return;
      autoplay = false;
      schedule();
    }

    keys.forEach((key, index) => {
      key.addEventListener("click", () => { stop(); select(key); });
      key.addEventListener("keydown", (event) => {
        const offset = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
        if (!offset) return;
        event.preventDefault();
        const target = keys[(index + offset + keys.length) % keys.length];
        target.focus();
        select(target);
      });
    });
    rotation.addEventListener("click", () => {
      autoplay = !autoplay;
      schedule();
    });
    stage.addEventListener("focusin", (event) => {
      if (event.target !== rotation) stop();
    });
    stage.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse") return;
      hovered = true;
      schedule();
    });
    stage.addEventListener("pointerleave", () => {
      hovered = false;
      schedule();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        schedule();
      }).observe(stage);
    }
    reduced.addEventListener("change", (event) => { if (event.matches) stop(); });
    document.addEventListener("visibilitychange", schedule);
    action.addEventListener("click", () => {
      if (action.getAttribute("href") !== "#podcast") return;
      const player = one("#podcast audio");
      const button = one("#podcast [data-deck-interface]:not([hidden]) [data-deck-play]");
      if (player?.paused && button) button.click();
    });
    one("[data-stage-fallback]", stage).hidden = true;
    if (compactStage.matches) select(keys[0], false);
    controls.hidden = false;
    rotation.hidden = false;
    schedule();
  }

  // Hover Grid, ouverture directionnelle de l’affiche par survol ou focus.
  const edition = one("[data-edition]");
  if (edition) {
    const links = all("[data-edition-link]", edition);
    const previews = all(".edition-previews picture", edition);
    const hover = matchMedia("(hover: hover) and (pointer: fine)");
    const desktop = matchMedia("(min-width: 761px)");
    const clips = [
      "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
    ];
    let active;
    let animation;

    function show(link) {
      const next = link && desktop.matches &&
        previews.find((preview) => preview.classList.contains(link.dataset.editionLink));
      if (active === next) return;
      animation?.cancel();
      active?.classList.remove("is-preview");
      active = next || null;
      if (!active) return;
      active.classList.add("is-preview");
      if (reduced.matches || !active.animate) return;
      animation = active.animate([
        { clipPath: clips[links.indexOf(link) % clips.length] },
        { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }
      ], { duration: 360, easing });
    }

    for (const link of links) {
      link.addEventListener("pointerenter", () => { if (hover.matches) show(link); });
      link.addEventListener("pointerleave", () => show(links.find((item) => item === document.activeElement)));
      link.addEventListener("focus", () => show(link));
      link.addEventListener("blur", () => show(null));
    }
    desktop.addEventListener("change", () => show(null));
  }

  // Section Transitions, volet de photo observé par son parent stable.
  if ("IntersectionObserver" in window && !reduced.matches) {
    const parents = new Map();
    const reveal = (child, instant = false) => {
      if (instant) child.setAttribute("data-instant", "");
      child.removeAttribute("data-await");
    };
    for (const child of all("[data-enter]")) {
      if (child.getBoundingClientRect().top <= innerHeight + 28) continue;
      child.setAttribute("data-await", "");
      const parent = child.parentElement;
      if (!parents.has(parent)) parents.set(parent, []);
      parents.get(parent).push(child);
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting && entry.boundingClientRect.bottom >= 0) continue;
        for (const child of parents.get(entry.target)) reveal(child);
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -12% 0px" });
    for (const parent of parents.keys()) observer.observe(parent);
    addEventListener("focusin", (event) => {
      const child = event.target.closest("[data-enter][data-await]");
      if (child) reveal(child, true);
    });
    addEventListener("hashchange", () => {
      const id = location.hash.slice(1);
      const target = id && document.getElementById(id);
      if (target) for (const child of all("[data-enter][data-await]", target)) reveal(child, true);
    });
    reduced.addEventListener("change", (event) => {
      if (!event.matches) return;
      observer.disconnect();
      for (const child of all("[data-await]")) reveal(child, true);
    });
  }

  function setupDeck(deck) {
    const audio = one("audio", deck);
    const ui = one("[data-deck-interface]", deck);
    const canvas = one("canvas", deck);
    const peaks = canvas.dataset.wave.split(",").map(Number).filter((peak) => peak > 0 && peak <= 100);
    const context = canvas.getContext("2d");
    if (!context || !peaks.length || !window.ResizeObserver) return;

    const play = one("[data-deck-play]", ui);
    const seek = one("[data-deck-seek]", ui);
    const elapsed = one("[data-deck-time]", ui);
    const duration = one("[data-deck-duration]", ui);
    const status = one("[data-deck-status]", ui);
    const timecode = (seconds) => {
      const whole = Math.floor(seconds || 0);
      return Math.floor(whole / 60) + ":" + String(whole % 60).padStart(2, "0");
    };

    function draw() {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      const width = Math.round(bounds.width * ratio);
      const height = Math.round(bounds.height * ratio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.clearRect(0, 0, width, height);
      const progress = audio.duration ? audio.currentTime / audio.duration : 0;
      const bars = Math.max(1, Math.min(peaks.length, Math.floor(bounds.width / 3)));
      const pitch = width / bars;
      for (let i = 0; i < bars; i++) {
        const peak = peaks[Math.floor(i * peaks.length / bars)];
        const barHeight = Math.max(3 * ratio, (peak / 100) * height * .88);
        context.fillStyle = i / bars < progress ? "#ff3b30" : "#bb9f96";
        context.fillRect(i * pitch, (height - barHeight) / 2, Math.max(1, pitch - ratio), barHeight);
      }
    }

    function sync() {
      const ready = Number.isFinite(audio.duration) && audio.duration > 0;
      seek.disabled = !ready;
      seek.value = ready ? String(Math.round(audio.currentTime / audio.duration * 1000)) : "0";
      seek.setAttribute("aria-valuetext", timecode(audio.currentTime) + (ready ? " sur " + timecode(audio.duration) : ""));
      elapsed.textContent = timecode(audio.currentTime);
      if (ready) duration.textContent = timecode(audio.duration);
      play.dataset.playing = String(!audio.paused && !audio.ended);
      play.setAttribute("aria-label", audio.paused || audio.ended ? "Lire l’épisode" : "Mettre l’épisode en pause");
      draw();
    }

    play.addEventListener("click", async () => {
      status.hidden = true;
      if (!audio.paused) {
        audio.pause();
        return;
      }
      try {
        await audio.play();
      } catch {
        status.hidden = false;
      }
    });
    seek.addEventListener("input", () => {
      if (!seek.disabled) audio.currentTime = Number(seek.value) / 1000 * audio.duration;
    });
    for (const event of ["loadedmetadata", "durationchange", "timeupdate", "play", "pause", "ended"]) {
      audio.addEventListener(event, sync);
    }
    audio.addEventListener("error", () => { status.hidden = false; });
    new ResizeObserver(draw).observe(canvas);
    audio.hidden = true;
    ui.hidden = false;
    sync();
  }

  for (const deck of all("[data-deck]")) setupDeck(deck);
})();
