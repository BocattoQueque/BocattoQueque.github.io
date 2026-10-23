# Reseñas con Google Forms y Sheets

Actualización del 23 de octubre de 2026. Las reseñas se reciben con Google Forms y se muestran desde Google Sheets.

- El formulario de Google está insertado en la sección Reseñas y dispone de enlace alternativo para abrirlo en otra pestaña.
- Las tarjetas leen la primera pestaña de la hoja indicada mediante Google Visualization (consulta pública con callback). No se utiliza el endpoint CSV porque el navegador bloqueó su lectura por CORS.
- La consulta espera las cuatro columnas actuales: Marca temporal, Nombre, Calificación, Comentario o Reseña. Mantén esa pestaña primero y esas columnas en ese orden. La web solo muestra nombre, estrellas y comentario; no muestra ni interpreta la fecha.
- El identificador de la hoja está en config.js. No se necesitan claves de API.
- Se actualiza al cargar, al pulsar Actualizar y cada 60 segundos cuando la pestaña está visible. Google puede aplicar caché; no se garantiza aparición instantánea.
- Las reseñas aparecen de la última fila a la primera, en grupos de 12. No se muestran filas sin nombre o comentario, ni calificaciones fuera de los enteros 1–5.
- El formulario actual permite omitir respuestas. Activa Obligatorio para los tres campos en Google Forms para evitar respuestas incompletas.
- La página informa que nombre y reseña son públicos. Añade también ese aviso al propio Google Form, ya que puede abrirse por enlace directo.
- La hoja es accesible públicamente. No agregues datos privados a ella: ocultar columnas en la página NO impide acceder a la hoja original. Para moderación, utiliza una hoja independiente con solo reseñas aprobadas y cambia su identificador en config.js.
- No se enviaron respuestas de prueba reales. Se comprobó la lectura pública real (hoja sin reseñas), la carga del formulario, y el renderizado con respuestas simuladas, incluyendo texto HTML tratado como texto y respuestas incompletas.

La sección de contacto dirige a las ubicaciones y a las reseñas; no recoge datos personales adicionales. No se ha publicado la web.
