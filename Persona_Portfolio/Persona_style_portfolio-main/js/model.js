/* CONTENIDO PERSONAL: cambia aquí tus textos, enlaces y próximos proyectos. */
const Model = {
  profile: {
    name: "Andrés Barrera",
    nameLines: ["ANDRÉS", "BARRERA"],
    initials: "AB",
    photo: "assets/me.jpg",
    cv: "assets/cv/CV_SantiagoAndresBarreraAyala.pdf",
    education: "Ingeniería Informática · Politécnico",
    tagline: "Estudio Ingeniería Informática en el Politécnico y actualmente trabajo de forma independiente. Aquí comparto mi camino y mi primer proyecto web: Dragons AR.",
    about: [
      "Soy Andrés Barrera, estudiante de Ingeniería Informática en el Politécnico.",
      "Actualmente trabajo de forma independiente. Estoy dando forma a este portafolio para reunir mi formación, mi experiencia y mis próximos proyectos en un solo lugar.",
      "Mi primer proyecto es una página web para Dragons AR, una empresa de TikTok. El repositorio ya está creado y la página está en preparación; iré compartiendo mis avances en GitHub.",
    ],
    contact: "Actualmente trabajo de forma independiente. Aquí podrás encontrar mis enlaces y formas de contacto cuando estén disponibles.",
  },

  // Déjalos vacíos hasta que quieras mostrar tus datos reales.
  contactEmail: "",
  githubUser: "",
  links: [], // Ejemplo: { label: "LinkedIn ↗", url: "https://www.linkedin.com/in/tu-usuario" }

  journey: [
    { label: "01 · Formación", title: "Ingeniería Informática", detail: "Estudiante en el Politécnico.", status: "En curso" },
    { label: "02 · Actualidad", title: "Trabajo independiente", detail: "Actualmente trabajo de forma independiente.", status: "Mi presente" },
    { label: "03 · Primer proyecto", title: "Dragons AR", detail: "Una página web para una empresa de TikTok. Mi primer proyecto en GitHub.", status: "En preparación" },
  ],
  skills: [
    { group: "Formación", title: "Ingeniería Informática", description: "Mi formación académica en el Politécnico.", label: "Aprendizaje en curso" },
    { group: "Trabajo", title: "Mi camino independiente", description: "Una parte de mi presente que iré reflejando en este espacio.", label: "Actualidad" },
    { group: "Próximo paso", title: "Dar forma a Dragons AR", description: "Convertir mi primer repositorio en la página web de Dragons AR y compartir el proceso.", label: "Desarrollo web" },
  ],

  // Añade proyectos reales cuando los tengas. No se muestran tarjetas ficticias.
  // { title: "Título", tag: "Tecnología", desc: "Descripción", url: "https://...",
  //   cta: "Ver proyecto →", color: "#00a5e6", img: "assets/projects/imagen.png" }
  featured: [
    {
      title: "DRAGONS AR",
      tag: "Desarrollo web",
      color: "#00a5e6",
      status: "En preparación",
      url: "https://github.com/NeoAndres/Dragons-PaginaWEB",
      cta: "Ver en GitHub →",
      img: "",
      desc: "Mi primer proyecto: una página web para Dragons AR, una empresa de TikTok. El repositorio ya está creado; la web está en preparación.",
    },
  ],
  featuredRepoNames: ["Dragons-PaginaWEB"],
  fallbackRepos: [],
  projectImages: {},
  langColors: { JavaScript: "#f1e05a", Python: "#3572A5", HTML: "#e34c26", CSS: "#663399", TypeScript: "#3178c6" },
  state: { screen: "home", menuIndex: 0, reposLoaded: false, skillsBuilt: false },

  async fetchRepos() {
    if (!this.githubUser.trim()) return { repos: [], live: false };
    const skip = new Set(this.featuredRepoNames);
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(this.githubUser)}/repos?per_page=100&sort=updated`);
      if (!res.ok) throw new Error(res.status);
      return { repos: (await res.json()).filter(r => !r.fork && !skip.has(r.name)), live: true };
    } catch {
      return { repos: this.fallbackRepos.filter(r => !skip.has(r.name)), live: false };
    }
  },
};
