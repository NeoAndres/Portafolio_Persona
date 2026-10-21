/* =====================================================================
   CONTROLLER — listens to the user, updates the Model, tells the View.
   ===================================================================== */

const Controller = {

  transitioning: false,
  audioUnlocked: false,

  init() {
  View.init();
  this.bindMenu();
  this.bindKeyboard();
  this.bindAudioButton();
},

  /* ---------- Navigation ---------- */
goTo(screen) { 
  if (this.transitioning || screen === Model.state.screen) return; 
  this.transitioning = true; 
  this.play(); 

  View.wipe( 
      () => {                       // mid-wipe: swap screens while covered
        Model.state.screen = screen;
        View.showScreen(screen);
        if (screen === "projects") this.loadProjects();
        if (screen === "skills") this.loadSkills();
      },
      () => { this.transitioning = false; }
    );
  },

  select(index) {
    const n = View.els.menuItems.length;
    const next = (index + n) % n;
    if (next !== Model.state.menuIndex) this.play();
    Model.state.menuIndex = next;
    View.setMenuSelection(next);
  },

  /* ---------- Screen data loading ---------- */
  async loadProjects() {
    View.renderFeatured(Model.featured);
    document.getElementById("projects-empty").hidden = Model.featured.length > 0;
    if (Model.state.reposLoaded) return;
    if (!Model.githubUser.trim()) {
      View.els.repoStatus.textContent = "";
      Model.state.reposLoaded = true;
      return;
    }
    View.els.repoStatus.textContent = "Consultando GitHub…";
    const { repos, live } = await Model.fetchRepos();
    const status = live
      ? `${repos.length} repositorios · desde GitHub`
      : "GitHub no está disponible en este momento.";
    View.renderRepos(repos, status, Model);
    document.getElementById("projects-empty").hidden = Model.featured.length > 0 || repos.length > 0;
    Model.state.reposLoaded = true;
  },

  loadSkills() {
    if (!Model.state.skillsBuilt) {
      View.renderSkills(Model.skills);
      Model.state.skillsBuilt = true;
    }
  },

  /* ---------- Sound (browsers block audio until first user gesture) ---------- */
  play() {
    if (this.audioUnlocked) View.playSelect();
  },

  bindAudioButton() {
    const button = document.getElementById("audio-toggle");
    if (!button) return;
    button.addEventListener("click", () => {
      this.audioUnlocked = !this.audioUnlocked;
      button.textContent = this.audioUnlocked ? "🔊" : "🔇";
      button.setAttribute("aria-pressed", String(this.audioUnlocked));
      button.setAttribute("aria-label", this.audioUnlocked ? "Silenciar sonido" : "Activar sonido");
      this.play();
    });
  },

  /* ---------- Input bindings ---------- */
  bindMenu() {
    View.els.menuItems.forEach((item, i) => {
      item.addEventListener("mouseenter", () => this.select(i));
      item.addEventListener("click", () => this.goTo(item.dataset.target));
    });

    document.querySelectorAll("[data-back]").forEach(b =>
      b.addEventListener("click", () => this.goTo("home")));

    // Clicking the name always takes you home
    document.getElementById("big-name").addEventListener("click", () => {
      if (Model.state.screen !== "home") this.goTo("home");
      else this.play();
    });
  },

  bindKeyboard() {
    addEventListener("keydown", e => {
      if (e.target.closest("input, textarea, select, [contenteditable=true]")) return;
      if (e.target.closest("button, a") && e.key === "Enter") return;
      if (Model.state.screen === "home") {
        if (e.key === "ArrowDown") { this.select(Model.state.menuIndex + 1); e.preventDefault(); }
        else if (e.key === "ArrowUp") { this.select(Model.state.menuIndex - 1); e.preventDefault(); }
        else if (e.key === "Enter") {
          this.goTo(View.els.menuItems[Model.state.menuIndex].dataset.target);
        }
      } else if (e.key === "Escape") {
        this.goTo("home");
      }
    });
  },
};

Controller.init();
