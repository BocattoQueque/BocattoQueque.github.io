# Verificación de la entrega

Comprobaciones realizadas el 14 de octubre de 2026 en Microsoft Edge mediante Playwright:

- Página y recursos servidos correctamente por HTTP local.
- Imágenes cargadas y sin errores de JavaScript.
- Revisión visual de escritorio y móvil.
- Sin desbordamiento horizontal en 320, 390, 768 y 1440 píxeles.
- Rotación por arrastre de mouse y por teclado; restablecimiento y pausa.
- Respeto a la preferencia de movimiento reducido.
- Sin configuración: el formulario informa que no se enviaron datos.
- Con API simulada: publicación de reseña, lectura posterior, registro de interés y consentimiento.
- El contenido HTML escrito en una reseña se presenta como texto y no se ejecuta.
- Fallo simulado de lectura: mensaje de error y posibilidad de reintentar.
- Sintaxis JavaScript verificada con `node --check`.

Las respuestas simuladas no enviaron datos a Supabase. Falta ejecutar el SQL y verificar las políticas y persistencia en un proyecto Supabase real. Tampoco se ha publicado el sitio en GitHub Pages ni se ha probado en un teléfono físico.
