# Bocatto Alfa

Landing page estática en HTML, CSS y JavaScript, lista para GitHub Pages. No requiere instalación de dependencias, compilación ni claves privadas.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub.
2. Descomprime `bocatto-github-pages.zip` y sube su contenido a la raíz del repositorio. `index.html` debe quedar directamente en la raíz, no dentro de otra carpeta.
3. En Settings → Pages, selecciona Deploy from a branch, la rama main y / (root). Guarda.
4. Espera a que termine la publicación y abre la dirección que muestre GitHub Pages.

El ZIP contiene únicamente los archivos necesarios de la web y esta documentación. No incluye el PDF académico, capturas, pruebas ni la imagen de referencia.

Si subes los archivos manualmente, incluye:

- index.html
- style.css
- script.js
- config.js
- logo.jpeg
- assets/ (carpeta completa)
- .nojekyll

Puedes añadir README.md y GOOGLE-RESENAS.md como documentación.

## Reseñas

El Google Form está insertado y también tiene un enlace para abrirlo en otra pestaña. Google Sheets almacena las respuestas. La página consulta las reseñas al abrir, al pulsar Actualizar y cada minuto mientras esté visible. Puede haber retrasos por la caché de Google.

La hoja debe seguir accesible para lectura pública. Mantén las columnas actuales y la pestaña de respuestas en primera posición. Consulta GOOGLE-RESENAS.md para detalles. No incluyas información privada en esa hoja.

Activa Obligatorio para Nombre, Calificación y Comentario en Google Forms. Añade allí el aviso de que el nombre y la reseña serán públicos.

La sección de contacto enlaza a las dos ubicaciones y a las reseñas. No hay formulario adicional de captación de correos.

## Vista local

Abre index.html en un navegador o utiliza Live Server de Visual Studio Code. La lectura de reseñas y el formulario requieren conexión a internet. Usa Ctrl + F5 después de actualizar archivos.

## Diseño

Incluye fondo con efecto de vidrio esmerilado, imagen de queque interactiva por arrastre y teclado, pausa de movimiento, adaptación a celulares, beneficios, ubicaciones y reseñas. La rotación transforma una imagen; no es un modelo 3D completo.

Las imágenes del producto proceden del documento proporcionado; el recorte de portada se preparó con ImageGen. Consulta assets/PROCEDENCIA.md.

La página se entrega preparada para subir; todavía no se ha publicado en GitHub Pages.
