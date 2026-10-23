(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const config = window.BOCATTO_CONFIG || {};
  const pageSize = 12;
  let offset = 0;
  let loading = false;

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
  let reviewRows = [];
  function readGoogleReviews() {
    return new Promise((resolve, reject) => {
      const callback = 'bocattoReviews_' + Date.now();
      const script = document.createElement('script');
      let timeout;
      const cleanup = () => { clearTimeout(timeout); script.remove(); delete window[callback]; };
      window[callback] = payload => {
        cleanup();
        if (payload.status !== 'ok' || !payload.table) { reject(new Error('sheet-unavailable')); return; }
        const table = payload.table;
        resolve([table.cols.map(col => col.label || ''), ...table.rows.map(row => row.c.map(cell => cell ? String(cell.v ?? '') : ''))]);
      };
      script.onerror = () => { cleanup(); reject(new Error('sheet-unavailable')); };
      timeout = setTimeout(() => { cleanup(); reject(new Error('sheet-timeout')); }, 15000);
      const url = new URL('https://docs.google.com/spreadsheets/d/' + config.reviewsSheetId + '/gviz/tq');
      url.searchParams.set('headers', '1');
      url.searchParams.set('tq', 'select A, B, C, D');
      url.searchParams.set('tqx', 'out:json;responseHandler:' + callback);
      script.src = url.href;
      document.head.append(script);
    });
  }
  function mapReviews(rows) {
    const normalize = value => value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const headers = (rows.shift() || []).map(normalize);
    const name = headers.indexOf('nombre'), rating = headers.indexOf('calificacion');
    const comment = headers.findIndex(h => ['comentario o resena', 'comentario', 'resena'].includes(h));
    if ([name, rating, comment].some(index => index < 0)) throw new Error('invalid-columns');
    // Solo se muestran los campos públicos; no se interpretan otras columnas.
    return rows.map(row => ({ nombre: (row[name] || '').trim(), calificacion: Number(row[rating]), comentario: (row[comment] || '').trim(), fecha: '' }))
      .filter(row => row.nombre && row.comentario && Number.isInteger(row.calificacion) && row.calificacion >= 1 && row.calificacion <= 5).reverse();
  }
  function showReviews(reset) {
    if (reset) { offset = 0; $('#review-list').replaceChildren(); }
    reviewRows.slice(offset, offset + pageSize).forEach(row => $('#review-list').append(renderReview(row)));
    offset = Math.min(offset + pageSize, reviewRows.length);
    if (!reviewRows.length) emptyReviews();
    $('#more-reviews').hidden = offset >= reviewRows.length;
  }
  async function loadReviews(reset = true, silent = false) {
    if (loading) return false;
    if (!reset) { showReviews(false); return true; }
    if (!config.reviewsSheetId) { emptyReviews(); $('#reviews-status').textContent = 'Las reseñas estarán disponibles próximamente.'; return false; }
    loading = true;
    $('#refresh-reviews').disabled = true; $('#more-reviews').disabled = true;
    if (!silent) $('#reviews-status').textContent = 'Cargando reseñas…';
    try {
      const nextRows = mapReviews(await readGoogleReviews());
      // No colapsar reseñas expandidas en cada actualización automática.
      if (!silent || JSON.stringify(nextRows) !== JSON.stringify(reviewRows)) {
        reviewRows = nextRows; showReviews(true);
      }
      $('#reviews-status').textContent = reviewRows.length ? 'Reseñas compartidas por nuestros visitantes.' : 'Todavía no hay reseñas completas. ¡Comparte la primera!';
      return true;
    } catch {
      $('#reviews-status').textContent = 'No pudimos actualizar las reseñas. Puedes dejar tu opinión en el formulario y volver a pulsar Actualizar más tarde.';
      return false;
    } finally {
      loading = false;
      $('#refresh-reviews').disabled = false; $('#more-reviews').disabled = false;
    }
  }
  $('#refresh-reviews').addEventListener('click', () => loadReviews());
  $('#more-reviews').addEventListener('click', () => loadReviews(false));
  setInterval(() => { if (!document.hidden) loadReviews(true, true); }, 60000);

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
