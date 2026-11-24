(() => {
  "use strict";
  const one = (query, root = document) => root.querySelector(query);
  const all = (query, root = document) => Array.from(root.querySelectorAll(query));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  const normalized = (value) => value.toLocaleLowerCase("fr").normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();

  function setPressed(buttons, target) {
    for (const button of buttons) button.setAttribute("aria-pressed", String(button === target));
  }

  function initJournal() {
    const tools = one("[data-list-tools]");
    if (!tools) return;

    const input = one("input", tools);
    const buttons = all("[data-filter]", tools);
    const items = all("[data-entry]", one("[data-entry-list]")).map((element) => ({
      element,
      text: normalized(element.textContent + " " + element.dataset.search)
    }));
    const message = one("[data-list-count]");
    const empty = one("[data-list-empty]");
    let selected = "all";

    function update() {
      const words = normalized(input.value).split(/\s+/).filter(Boolean);
      let visible = 0;
      for (const item of items) {
        const matches = (selected === "all" || item.element.dataset.entry === selected) &&
          words.every((word) => item.text.includes(word));
        item.element.hidden = !matches;
        if (matches) visible++;
      }
      empty.hidden = visible > 0;
      message.textContent = visible === 1 ? "1 publication" : visible + " publications";
    }

    for (const button of buttons) {
      button.addEventListener("click", () => {
        selected = button.dataset.filter;
        setPressed(buttons, button);
        update();
      });
    }
    input.addEventListener("input", update);
    tools.hidden = false;
    message.hidden = false;
    update();
  }

  // Adaptation du fragment « gallery-right-image » de Design Memory.
  function initGallery() {
    const grid = one("[data-gallery-list]");
    const dialog = one("[data-photo-dialog]");
    const filters = one("[data-gallery-filters]");
    if (!grid || !dialog || typeof dialog.showModal !== "function") return;

    const large = one("[data-photo-large]", dialog);
    const caption = one("[data-photo-caption-live]", dialog);
    const count = one("[data-photo-count]", dialog);
    const error = one("[data-photo-error]", dialog);
    const stage = one(".photo-view-stage", dialog);
    const previous = one("[data-photo-prev]", dialog);
    const next = one("[data-photo-next]", dialog);
    const buttons = all("[data-series]", filters);
    const items = all("[data-series-item]", grid);
    let current = null;
    let animation;
    let openingFrom = null;
    const visibleLinks = () => items.filter((item) => !item.hidden).map((item) => one("[data-photo]", item));

    function show(link) {
      animation?.cancel();
      current = link;
      const links = visibleLinks();
      const index = links.indexOf(link);
      large.hidden = false;
      error.hidden = true;
      large.alt = one("img", link).alt;
      caption.textContent = one("[data-photo-caption]", link).textContent;
      count.textContent = (index + 1) + " / " + links.length;
      previous.disabled = next.disabled = links.length < 2;
      large.src = link.href;
      if (links.length > 1) {
        const preload = new Image();
        preload.src = links[(index + 1) % links.length].href;
      }
    }

    function animateOpen() {
      if (!dialog.open || !openingFrom || !large.naturalWidth || reduceMotion.matches) return;
      const from = openingFrom;
      openingFrom = null;
      const to = large.getBoundingClientRect();
      if (!to.width || !to.height) return;

      animation = large.animate([
        { transformOrigin: "top left", transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`, opacity: .6 },
        { transformOrigin: "top left", transform: "none", opacity: 1 }
      ], { duration: 360, easing: "cubic-bezier(.22, 1, .36, 1)" });
    }

    function step(delta) {
      const links = visibleLinks();
      if (!current || links.length < 2) return;
      openingFrom = null;
      const index = links.indexOf(current);
      show(links[(index + delta + links.length) % links.length]);
    }

    large.addEventListener("load", animateOpen);
    large.addEventListener("error", () => {
      openingFrom = null;
      large.hidden = true;
      error.hidden = false;
    });

    grid.addEventListener("click", (event) => {
      const link = event.target.closest("[data-photo]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openingFrom = one("img", link).getBoundingClientRect();
      show(link);
      dialog.showModal();
      if (large.complete) animateOpen();
    });

    previous.addEventListener("click", () => step(-1));
    next.addEventListener("click", () => step(1));
    one("[data-photo-close]", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1);
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target === stage) dialog.close();
    });
    dialog.addEventListener("close", () => {
      animation?.cancel();
      openingFrom = null;
      current?.focus();
    });

    for (const button of buttons) {
      button.addEventListener("click", () => {
        setPressed(buttons, button);
        for (const item of items) {
          item.hidden = button.dataset.series !== "all" && item.dataset.seriesItem !== button.dataset.series;
        }
      });
    }
    filters.hidden = false;
  }

  function initArticleToc() {
    const toc = one("[data-toc]");
    const body = one("[data-article-body]");
    if (!toc || !body) return;

    const headings = all("h2", body).filter((heading) => !heading.closest("details"));
    if (headings.length < 2) return;
    const list = one("ul", toc);
    const progress = one("[data-reading-progress]", toc);
    const links = headings.map((heading, index) => {
      if (!heading.id) heading.id = "partie-" + (index + 1);
      const item = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + heading.id;
      a.textContent = heading.textContent.trim();
      item.append(a);
      list.append(item);
      return a;
    });
    let scheduled = false;
    let current = -1;
    function update() {
      scheduled = false;
      const start = Math.min(innerHeight * .27, 190);
      const box = body.getBoundingClientRect();
      progress.value = Math.max(0, Math.min(100, (start - box.top) / Math.max(1, box.height - start) * 100));
      let index = 0;
      for (let i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top <= start) index = i;
        else break;
      }
      if (current === index) return;
      links[current]?.removeAttribute("aria-current");
      links[index].setAttribute("aria-current", "location");
      current = index;
    }
    function onScroll() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    toc.hidden = false;
    update();
  }

  function initAudio() {
    const players = all("audio");
    for (const player of players) {
      player.addEventListener("play", () => {
        for (const other of players) {
          if (other !== player) other.pause();
        }
      });
    }
  }

  function initForms() {
    if (location.protocol === "file:") return;
    for (const form of all("[data-site-form]")) {
      const output = one("[data-form-status]", form);
      const button = one("button[type='submit']", form);

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        button.disabled = true;
        form.setAttribute("aria-busy", "true");
        output.dataset.error = "false";
        output.textContent = "Envoi en cours…";

        try {
          const endpoint = new URL(form.action);
          endpoint.pathname = "/ajax" + endpoint.pathname;
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(form),
            signal: AbortSignal.timeout(15000)
          });
          const result = await response.json();
          if (!response.ok || (result.success !== true && result.success !== "true")) throw new Error("Envoi refusé");
          form.reset();
          output.textContent = form.dataset.success;
        } catch {
          output.dataset.error = "true";
          const link = document.createElement("a");
          link.href = "mailto:agora.dau@gmail.com";
          link.textContent = "écris-nous par e-mail";
          output.replaceChildren("La demande n’a pas été envoyée. Réessaie ou ", link, ".");
        } finally {
          button.disabled = false;
          form.removeAttribute("aria-busy");
        }
      });
    }
  }

  initJournal();
  initGallery();
  initArticleToc();
  initAudio();
  initForms();
})();
