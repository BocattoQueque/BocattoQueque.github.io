# Bocatto Alfa

Landing page en HTML, CSS y JavaScript, editable en Visual Studio Code y compatible con GitHub Pages. No necesita npm ni un proceso de compilación.

## Abrir

Abre esta carpeta en VS Code y utiliza Live Server sobre `index.html`. También puedes abrir `index.html` directamente para revisar la presentación. Para probar las conexiones usa un servidor HTTP local.

## Activar los formularios con Supabase

1. Crea un proyecto Supabase y ejecuta `supabase.sql` una vez en su SQL Editor. El script está pensado para tablas nuevas; no elimina ni reemplaza tablas existentes.
2. Edita `config.js` con la URL HTTPS del proyecto, sin barra final, y su clave **publishable** o **anon**. Nunca uses `service_role` ni una clave secreta. Estos valores públicos se necesitan para la conexión desde GitHub Pages.
3. Publica una reseña y verifica el registro en `resenas`. Abre la web en otro navegador/dispositivo para confirmar que se comparte.
4. Envía un registro de interés y revísalo como administrador en `interesados`. Los visitantes no pueden leer los correos ni los nombres de esa tabla. El formulario almacena los datos; no envía correos automáticos.

Sin configurar Supabase, la página no envía datos ni simula guardados. Muestra estados explícitos de indisponibilidad. No hay reseñas inventadas ni almacenamiento local que se presente como compartido.

Las reseñas se cargan en grupos de 12; Actualizar permite ver nuevas publicaciones. Se utiliza la API REST de Supabase sin bibliotecas externas. Hay validación en el formulario y en PostgreSQL, contenido mostrado mediante `textContent`, consentimiento, límite de tiempo de petición y estados de error. Las fechas y los ID los genera la base de datos.

La configuración incluye RLS y permisos de columnas: los visitantes solo pueden leer y crear reseñas, y crear registros de interés. La tabla de contactos no es pública. Documentación: https://supabase.com/docs/guides/database/postgres/row-level-security

La publicación de reseñas es inmediata, siguiendo el alcance solicitado. El campo trampa del formulario solo filtra bots simples; no es una protección contra peticiones directas. Para una campaña abierta añade CAPTCHA verificado en una Edge Function y límites de envío del lado servidor; en ese caso revoca los permisos de inserción directa. Puedes moderar desde el panel administrativo de Supabase. No se ha probado contra una base real porque no se proporcionaron credenciales del proyecto.

## Publicar en GitHub Pages

Sube únicamente `index.html`, `style.css`, `script.js`, `config.js`, `logo.jpeg` y la carpeta `assets` al repositorio que publicarás. Puedes incluir `README.md` y `supabase.sql` como documentación. No necesitas publicar el PDF del proyecto ni la referencia visual.

En Settings → Pages configura la publicación desde tu rama principal y la carpeta raíz. Todas las rutas de recursos son relativas para soportar repositorios bajo un subdirectorio. Esta entrega está guardada localmente; no crea repositorios ni despliega el sitio.

## Contenido e interacción

- Se tomó la información del documento del proyecto: propuesta de queque de alfalfa de Cajamarca, ingredientes y degustación exploratoria de ocho personas.
- Se muestran resultados del testeo como resultados del prototipo, sin atribuir testimonios ni estrellas ficticias a clientes.
- El enlace de videos es el enlace a la carpeta de Google Drive que figura en el documento; su reproducción depende de los permisos del propietario. No se recibió un archivo de video local.
- Las imágenes `assets/prototipo-1.jpg` y `assets/prototipo-2.jpg` se extrajeron del documento. No se presume que sean fotografías verificadas de un producto comercial.
- El recorte de portada se preparó con ImageGen a partir de la imagen del documento. El prompt y la procedencia están en `assets/PROCEDENCIA.md`.
- El logo original se conserva y se encuadra con CSS.
- La portada rota la imagen con el arrastre horizontal (mouse/dedo), admite flechas del teclado, pausa y restablecimiento. Es una transformación de una imagen, no un modelo 3D de 360°. El deslizamiento vertical en móvil sigue disponible para recorrer la página.
- Se respeta la preferencia de movimiento reducido. La tipografía web tiene alternativas locales si Google Fonts no está disponible.
- No se anuncia un precio o disponibilidad comercial no confirmados, ni se atribuyen propiedades de salud a la preparación.

## Archivos

`index.html`: contenido; `style.css`: diseño adaptable; `script.js`: interacción y formularios; `config.js`: conexión pública; `supabase.sql`: tablas y permisos; `assets/`: imágenes.
