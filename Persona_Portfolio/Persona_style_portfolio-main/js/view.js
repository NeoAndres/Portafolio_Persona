/* =====================================================================
   VIEW — everything that draws to the screen. No app logic lives here;
   the Controller tells the View what to show.
   ===================================================================== */

const View = {

  reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,

  els: {
    screens:    {},   // filled in init()
    menuItems:  [],
    wipe:       document.getElementById("wipe"),
    featGrid:   document.getElementById("feat-grid"),
    repoGrid:   document.getElementById("repo-grid"),
    repoStatus: document.getElementById("repo-status"),
    skillsBody: document.getElementById("skills-body"),
    sfx:        document.getElementById("sfx-select"),
    cursor:     document.getElementById("cursor"),
    clock:      document.getElementById("clock"),
  },

  init() {
    this.renderProfile();
    document.querySelectorAll(".screen").forEach(s => {
      this.els.screens[s.id.replace("screen-", "")] = s;
    });
    this.els.menuItems = [...document.querySelectorAll(".menu-item")];
    document.querySelectorAll("[data-ransom]").forEach(el => this.ransomize(el));
    this.els.sfx.volume = 0.45;
    this.startClock();
    this.startParallax();
    this.startCursor();
    document.body.classList.add("loaded");
  },

  renderProfile() {
    const profile = Model.profile;
    document.title = `${profile.name} · Portafolio`;
    document.querySelector('meta[name="description"]').content = profile.tagline;
    document.getElementById("profile-header").textContent = `Portafolio // ${profile.name}`;
    document.getElementById("profile-role").textContent = profile.education;
    document.getElementById("big-name").setAttribute("aria-label", profile.name);
    document.querySelectorAll("#big-name [data-ransom]").forEach((el, i) => {
      el.dataset.ransom = profile.nameLines[i] || "";
    });
    document.getElementById("tagline").textContent = profile.tagline;
    document.getElementById("about-name").textContent = profile.name;
    const monogram = document.getElementById("profile-monogram");
    monogram.textContent = profile.initials;
    const photoFrame = document.getElementById("profile-photo-frame");
    const photo = document.getElementById("profile-photo");
    const hasPhoto = Boolean(profile.photo?.trim());
    photoFrame.hidden = !hasPhoto;
    monogram.hidden = hasPhoto;
    if (hasPhoto) {
      photo.alt = `Retrato de ${profile.name}`;
      document.getElementById("profile-photo-caption").textContent = profile.name;
      photo.addEventListener("error", () => {
        photoFrame.hidden = true;
        monogram.hidden = false;
      }, { once: true });
      // Al reemplazar me.jpg, una recarga debe pedir la foto actual.
      const photoURL = new URL(profile.photo, document.baseURI);
      photoURL.searchParams.set("v", Date.now().toString());
      photo.src = photoURL.href;
    }
    const hasCV = Boolean(profile.cv?.trim());
    document.getElementById("cv-actions").hidden = !hasCV;
    if (hasCV) {
      document.getElementById("cv-view").href = profile.cv;
      document.getElementById("cv-download").href = profile.cv;
    }
    const about = document.getElementById("about-copy");
    profile.about.forEach(text => {
      const p = document.createElement("p");
      p.textContent = text;
      about.appendChild(p);
    });
    document.getElementById("contact-copy").textContent = profile.contact;
    const links = [...Model.links];
    if (Model.contactEmail.trim()) links.unshift({ label: "Correo ✉", url: `mailto:${Model.contactEmail.trim()}` });
    if (Model.githubUser.trim()) links.push({ label: "GitHub ↗", url: `https://github.com/${encodeURIComponent(Model.githubUser.trim())}` });
    const list = document.getElementById("contact-links");
    links.filter(link => /^(https?:|mailto:)/i.test(link.url)).forEach(link => {
      const a = document.createElement("a");
      a.className = "contact-chip";
      a.href = link.url;
      a.textContent = link.label;
      if (/^https?:/i.test(link.url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      list.appendChild(a);
    });
    document.getElementById("contact-pending").hidden = list.childElementCount > 0;
    const journey = document.getElementById("journey-grid");
    Model.journey.forEach(item => {
      const article = document.createElement("article");
      article.className = "journey-card";
      for (const [tag, key] of [["span", "label"], ["h3", "title"], ["p", "detail"], ["small", "status"]]) {
        const el = document.createElement(tag);
        el.textContent = item[key];
        article.appendChild(el);
      }
      journey.appendChild(article);
    });
  },

  // Deterministic pseudo-random hash (so letters look the same every visit)
  hash(str) {
    let h = 9;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 387420489);
    return (h ^ h >>> 9) >>> 0;
  },

  /* ---------- Ransom-note lettering ---------- */
  ransomize(el) {
    const text = el.dataset.ransom || el.textContent;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    [...text].forEach((c, i) => {
      const span = document.createElement("span");
      span.className = "ch display";
      span.textContent = c;
      const h = this.hash(text + i);
      const rot = (h % 17) - 8;                 // -8..8 degrees
      const scale = 0.86 + ((h >> 3) % 30) / 100; // 0.86..1.15
      const dy = ((h >> 5) % 9) - 4;            // -4..4 px
      const t = `rotate(${rot}deg) scale(${scale}) translateY(${dy}px)`;
      span.style.setProperty("--t", t);
      span.style.transform = t;
    const variant = (h >> 7) % 10;

if (variant === 0) {
  span.classList.add("box");
}
else if (variant === 1) {
  span.classList.add("boxw");
}
else if (variant === 2) {
  span.classList.add("red");
}

el.appendChild(span);
    });
  },

  /* ---------- Screens & menu ---------- */
  showScreen(name) {
    const s = this.els.screens;
    Object.values(s).forEach(sc => sc.classList.remove("active"));
    s[name].classList.add("active");
    s[name].scrollTop = 0;
    document.body.dataset.screen = name;
  },

  setMenuSelection(index) {
    this.els.menuItems.forEach((m, j) => m.classList.toggle("sel", j === index));
  },

  // Diagonal wipe; calls swap() mid-way while the screen is covered
  wipe(swap, done) {
    if (this.reducedMotion) { swap(); done(); return; }
    const w = this.els.wipe;
    w.classList.remove("go"); void w.offsetWidth;  // restart animation
    w.classList.add("go");
    setTimeout(swap, 340);
    setTimeout(done, 720);
  },

  /* ---------- Sound ---------- */
  playSelect() {
    try {
      this.els.sfx.currentTime = 0;
      const p = this.els.sfx.play();
      if (p && p.catch) p.catch(() => {});  // blocked before first user gesture — fine
    } catch {}
  },

  /* ---------- Project cards ---------- */
  cardThumb(src) {
    if (!src) return "";
    return `<div class="thumb"><img src="${src}" alt="" loading="lazy"
      onerror="this.closest('.thumb').remove()"></div>`;
  },

  // Split "Medical Image…" so the first word renders red
  splitTitle(title) {
    const first = title.split(" ")[0];
    return `<em>${first}</em>${title.slice(first.length)}`;
  },

  renderFeatured(list) {
    if (this.els.featGrid.childElementCount) return;
    list.forEach((f, i) => {
      const a = document.createElement("a");
      a.className = "card feat";
      a.href = f.url; a.target = "_blank"; a.rel = "noopener";
      a.style.setProperty("--tilt", ((this.hash(f.title) % 5) - 2) * 0.8 + "deg");
      a.style.setProperty("--d", i * 70 + "ms");
      a.innerHTML = `
        ${this.cardThumb(f.img)}
        <span class="lang" style="--lc:${f.color}">${f.tag}</span>
        <h3>${f.live ? '<span class="live-dot"></span>' : ""}${this.splitTitle(f.title)}</h3>
        <p>${f.desc}</p>
        <div class="meta"><span>${f.status || (f.live ? "EN LÍNEA" : "DESTACADO")}</span><span class="go">${f.cta}</span></div>`;
      this.els.featGrid.appendChild(a);
    });
  },

  renderRepos(repos, statusText, model) {
    this.els.repoStatus.textContent = statusText;
    this.els.repoGrid.innerHTML = "";
    repos.forEach((r, i) => {
      const a = document.createElement("a");
      a.className = "card";
      a.href = r.html_url; a.target = "_blank"; a.rel = "noopener";
      a.style.setProperty("--tilt", ((this.hash(r.name) % 5) - 2) * 0.8 + "deg");
      a.style.setProperty("--d", i * 70 + "ms");
      a.style.setProperty("--lc", model.langColors[r.language] || "#e60012");
      const pretty = r.name.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const img = model.projectImages[r.name] || `assets/projects/${r.name}.png`;
      a.innerHTML = `
        ${this.cardThumb(img)}
        <span class="lang">${r.language || "Repo"}</span>
        <h3>${this.splitTitle(pretty)}</h3>
        <p>${r.description || "Descripción próximamente."}</p>
        <div class="meta">
          <span>★ ${r.stargazers_count || 0}</span>
          <span class="go">Ver en GitHub →</span>
        </div>`;
      this.els.repoGrid.appendChild(a);
    });
  },

  /* ---------- Skills ---------- */
  renderSkills(groups) {
    this.els.skillsBody.replaceChildren();
    groups.forEach(group => {
      const article = document.createElement("article");
      article.className = "focus-card";
      for (const [tag, key] of [["span", "group"], ["h3", "title"], ["p", "description"], ["small", "label"]]) {
        const el = document.createElement(tag);
        el.textContent = group[key];
        article.appendChild(el);
      }
      this.els.skillsBody.appendChild(article);
    });
  },

  /* ---------- Ambient: clock, parallax, animated cursor ---------- */
  startClock() {
    setInterval(() => {
      this.els.clock.textContent =
        new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
    }, 1000);
  },

  startParallax() {
    if (this.reducedMotion) return;
    const stripes = document.getElementById("bg-stripes");
    const halftone = document.getElementById("bg-halftone");
    const arts = [...document.querySelectorAll(".menu-art")];
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener("mousemove", e => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
    }, { passive: true });
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      stripes.style.transform = `translate(${cx * 22}px, ${cy * 14}px)`;
      halftone.style.transform = `translate(${cx * -34}px, ${cy * -22}px)`;
      arts.forEach(a => {
        if (a.isConnected)
          a.style.transform = `translate(${cx * 14}px, ${cy * 9}px) scale(1.04)`;
      });
      requestAnimationFrame(loop);
    };
    loop();
  },

  // 30-frame sprite-strip cursor extracted from the original .ani files
  startCursor() {
    if (!matchMedia("(pointer:fine)").matches || this.reducedMotion) return;
    const cur = this.els.cursor;
    document.body.classList.add("cursor-on");
    let x = -100, y = -100, frame = 0, last = 0, visible = false;

    addEventListener("mousemove", e => {
      x = e.clientX; y = e.clientY;
      if (!visible) { cur.style.display = "block"; visible = true; }
      const t = e.target;
      const overLink = t.closest &&
        t.closest("a,button,.card,.menu-item,.back-hint,.contact-chip,#big-name");
      cur.classList.toggle("link", !!overLink);
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", () => {
      cur.style.display = "none"; visible = false;
    });

    const tick = ts => {
      if (ts - last >= 50) {                       // 50ms = original .ani frame rate
        frame = (frame + 1) % 30; last = ts;
        cur.style.backgroundPosition = -frame * 48 + "px 0";
      }
      cur.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },
};
