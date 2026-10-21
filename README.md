# Portafolio de Andrés Barrera

Portafolio personal con estética inspirada en Persona. Estudiante de Ingeniería Informática en el Politécnico y trabajador independiente.

## Cambiar el contenido

Abre `js/model.js`. Allí están:

- `profile`: nombre, iniciales, presentación, estudios, biografía y las rutas `photo` (foto) y `cv` (PDF). Deja una ruta vacía para ocultar ese elemento.
- `journey`: las tarjetas de «Mi camino».
- `skills`: las tarjetas de «Enfoque». Puedes sustituirlas por tus habilidades reales; no usan porcentajes de dominio.
- `featured`: proyectos. Está vacío hasta que tengas trabajos para compartir.
- `githubUser`: tu usuario de GitHub, sin la URL. Vacío evita consultar cuentas de ejemplo.
- `contactEmail`: tu correo, si deseas mostrarlo públicamente.
- `links`: otros enlaces. Ejemplo: `{ label: "LinkedIn ↗", url: "https://www.linkedin.com/in/tu-usuario" }`.

Los contactos sin configurar no se muestran. Se retiraron el formulario de terceros y las referencias al CV y la fotografía de ejemplo. En «Sobre mí» se muestran tu foto y los botones «Ver hoja de vida» (abre el PDF en otra pestaña) y «Descargar PDF» (guarda una copia). Puedes reemplazar los archivos o cambiar sus rutas en `profile`.

## Agregar un proyecto

Añade dentro de `featured`:

```js
{
  title: "Nombre del proyecto",
  tag: "Trabajo de clase",
  desc: "Qué hiciste y qué aprendiste.",
  url: "https://github.com/tu-usuario/tu-proyecto",
  cta: "Ver proyecto →",
  color: "#00a5e6",
  img: "", // Opcional: ruta de una imagen real.
}
```

## Abrir la página

Con Python instalado, abre la terminal en esta carpeta y ejecuta `py -3 -m http.server 8000 --bind 127.0.0.1` en Windows, o `python3 -m http.server 8000 --bind 127.0.0.1` donde ese comando esté disponible. Luego visita http://localhost:8000.

Los fondos actuales son imágenes de `assets/menus/`; los videos de la plantilla no estaban incluidos. Las animaciones, el cursor y el sonido del menú se conservan. El sonido se activa con el botón de altavoz.

/=====================/
    Pasos personales
/=====================/

1. `cd "C:\Users\andre\OneDrive\Documents\VsCodeProyects\Persona_Portfolio\Persona_Portfolio\Persona_style_portfolio-main"`
2. `py -3 -m http.server 8000 --bind 127.0.0.1`

## Estructura

- `index.html`: secciones y textos de navegación en español.
- `css/style.css`: diseño y adaptación a dispositivos pequeños.
- `js/model.js`: contenido editable.
- `js/view.js`: presentación del contenido.
- `js/controller.js`: navegación y sonido.

