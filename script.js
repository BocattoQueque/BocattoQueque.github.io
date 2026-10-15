(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const config = window.BOCATTO_CONFIG || {};
  const configured = /^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(config.supabaseUrl || '') && Boolean(config.supabaseKey);
  const pageSize = 12;
  let offset = 0;
  let loading = false;

  // Solo claves publicables/anon. Las claves secretas no pertenecen al navegador.
  async function request(table, { method = 'GET', body, query = '' } = {}) {
    if (!configured) throw new Error('not-configured');
    const headers = { apikey: config.supabaseKey, 'Content-Type': 'application/json' };
    // Las claves publishable modernas van en apikey, no como JWT de Authorization.
    if (config.supabaseKey.startsWith('eyJ')) headers.Authorization = `Bearer ${config.supabaseKey}`;
    if (method === 'POST') headers.Prefer = 'return=minimal';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${config.supabaseUrl}/rest/v1/${table}${query}`, {
        method, headers, body: body ? JSON.stringify(body) : undefined, signal: controller.signal
      });
      if (!response.ok) throw new Error(`request-failed-${response.status}`);
      return method === 'GET' ? await response.json() : null;
    } finally { clearTimeout(timeout); }
  }

  function emptyReviews() {
    const box = document.createElement('div'); box.className = 'empty-state';
    const icon = document.createElement('span'); icon.textContent = '✳'; icon.setAttribute('aria-hidden', 'true');
    const title = document.createElement('h3'); title.textContent = 'La próxima historia puede ser tuya.';
    const text = document.createElement('p'); text.textContent = 'Cuando se publiquen las primeras reseñas, podrás leerlas aquí.';
    box.append(icon, title, text); $('#review-list').replaceChildren(box);
  }
  function renderReview(review) {
    const card = document.createElement('article'); card.className = 'review-card';
    const name = document.createElement('h3'); name.textContent = review.nombre;
    const stars = document.createElement('p'); stars.className = 'stars';
    const rating = Math.max(1, Math.min(5, Number(review.calificacion) || 1));
    stars.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating); stars.setAttribute('aria-label', `${rating} de 5 estrellas`);
    const comment = document.createElement('p'); comment.textContent = review.comentario;
    const date = document.createElement('time');
    const value = new Date(review.fecha);
    if (!Number.isNaN(value.getTime())) { date.dateTime = value.toISOString(); date.textContent = value.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }); }
    card.append(name, stars, comment, date); return card;
  }
  async function loadReviews(reset = true) {
    if (loading) return false;
    if (!configured) { emptyReviews(); $('#reviews-status').textContent = 'Las reseñas estarán disponibles próximamente.'; return false; }
    loading = true;
    $('#refresh-reviews').disabled = true; $('#more-reviews').disabled = true;
    $('#reviews-status').textContent = 'Cargando reseñas…';
    const nextOffset = reset ? 0 : offset;
    try {
      const rows = await request('resenas', { query: `?select=nombre,calificacion,comentario,fecha&order=fecha.desc,id.desc&limit=${pageSize}&offset=${nextOffset}` });
      if (!Array.isArray(rows)) throw new Error('invalid-response');
      if (reset) $('#review-list').replaceChildren();
      rows.forEach(row => $('#review-list').append(renderReview(row)));
      offset = nextOffset + rows.length;
      if (offset === 0) emptyReviews();
      $('#more-reviews').hidden = rows.length < pageSize;
      $('#reviews-status').textContent = offset ? '' : 'Todavía no hay reseñas. ¡Sé la primera persona en compartir su experiencia!';
      return true;
    } catch {
      $('#reviews-status').textContent = 'No pudimos cargar las reseñas. Revisa tu conexión y pulsa Actualizar.';
      return false;
    } finally { loading = false; $('#refresh-reviews').disabled = false; $('#more-reviews').disabled = false; }
  }
  $('#refresh-reviews').addEventListener('click', () => loadReviews());
  $('#more-reviews').addEventListener('click', () => loadReviews(false));

  $('#review-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget; const message = $('#review-message');
    if (!form.reportValidity()) return;
    if (!configured) { message.textContent = 'El formulario de reseñas aún no está habilitado. Tu reseña no se ha enviado.'; return; }
    const data = new FormData(form);
    if (data.get('website')) return;
    const nombre = String(data.get('nombre')).trim();
    const comentario = String(data.get('comentario')).trim();
    const calificacion = Number(data.get('calificacion'));
    if (!nombre || nombre.length > 80 || !comentario || comentario.length > 1000 || !Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
      message.textContent = 'Escribe tu nombre, una reseña y una calificación válida.'; return;
    }
    const button = form.querySelector('[type=submit]'); button.disabled = true;
    message.textContent = 'Publicando tu reseña…';
    try {
      await request('resenas', { method: 'POST', body: { nombre, calificacion, comentario } });
      form.reset();
      message.textContent = '¡Gracias! Tu reseña se publicó correctamente.';
      await loadReviews();
    } catch { message.textContent = 'No pudimos confirmar la publicación. Actualiza las reseñas antes de volver a intentarlo.'; }
    finally { button.disabled = false; }
  });

  $('#contact-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget; const message = $('#contact-message');
    if (!form.reportValidity()) return;
    if (!configured) { message.textContent = 'El registro de interés estará disponible próximamente. Tus datos no se han enviado.'; return; }
    const data = new FormData(form);
    if (data.get('website')) return;
    const nombre = String(data.get('nombre')).trim(); const email = String(data.get('email')).trim().toLowerCase();
    if (!nombre || nombre.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) { message.textContent = 'Revisa tu nombre y correo electrónico.'; return; }
    const button = form.querySelector('[type=submit]'); button.disabled = true;
    message.textContent = 'Registrando tu interés…';
    try {
      await request('interesados', { method: 'POST', body: { nombre, email, consentimiento: true } });
      form.reset(); message.textContent = '¡Gracias! Registramos tu interés. El equipo podrá contactarte con novedades.';
    } catch { message.textContent = 'No pudimos confirmar el registro. Revisa tu conexión e inténtalo más tarde.'; }
    finally { button.disabled = false; }
  });

  // Rotación visual de una fotografía: no es un modelo 3D de 360 grados.
  const scene = $('#cake-scene'); const cake = $('#cake');
  let x = 0, y = 0, z = -12, drag = null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  const draw = () => { cake.style.setProperty('--rx', `${x}deg`); cake.style.setProperty('--ry', `${y}deg`); cake.style.setProperty('--rz', `${z}deg`); };
  const setPaused = () => { scene.classList.toggle('paused', paused); $('#motion-toggle').textContent = paused ? 'Activar movimiento' : 'Pausar movimiento'; $('#motion-toggle').setAttribute('aria-pressed', String(paused)); };
  setPaused();
  scene.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, baseX: x, baseY: y, baseZ: z };
    scene.setPointerCapture(event.pointerId); scene.classList.add('paused');
  });
  scene.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    y = Math.max(-35, Math.min(35, drag.baseY + dx * .14));
    x = Math.max(-25, Math.min(25, drag.baseX - dy * .12));
    z = drag.baseZ + dx * .22; draw();
  });
  const endDrag = () => { drag = null; setPaused(); };
  scene.addEventListener('pointerup', endDrag); scene.addEventListener('pointercancel', endDrag); scene.addEventListener('lostpointercapture', endDrag);
  scene.addEventListener('keydown', (event) => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') z -= 10;
    if (event.key === 'ArrowRight') z += 10;
    if (event.key === 'ArrowUp') x = Math.min(25, x + 5);
    if (event.key === 'ArrowDown') x = Math.max(-25, x - 5);
    if (event.key === 'Home') { x = y = 0; z = -12; }
    draw();
  });
  $('#reset-rotation').addEventListener('click', () => { x = y = 0; z = -12; draw(); });
  $('#motion-toggle').addEventListener('click', () => { paused = !paused; setPaused(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; setPaused(); });
  loadReviews();
})();
