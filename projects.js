/* Gweleni Construction — Projects page.
   Dynamic content: project cards are built from window.GWELENI_PROJECTS
   (js/projects-data.js) with DOM manipulation, then filtered / searched /
   sorted live. Also drives the detail modal and the Leaflet map markers. */
(function () {
  'use strict';

  var data = window.GWELENI_PROJECTS || [];
  var grid = document.getElementById('project-grid');
  if (!grid) { return; }

  var searchInput = document.getElementById('project-search');
  var categorySelect = document.getElementById('project-category');
  var sortSelect = document.getElementById('project-sort');
  var resetBtn = document.getElementById('project-reset');
  var countEl = document.getElementById('project-count');
  var emptyEl = document.getElementById('project-empty');

  var map = null, markerLayer = null, markers = {};

  /* ---- Build the category dropdown from the data itself --------------- */
  var categories = data.map(function (p) { return p.category; })
    .filter(function (c, i, all) { return all.indexOf(c) === i; }).sort();
  categories.forEach(function (c) {
    var opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    categorySelect.appendChild(opt);
  });

  /* ---- Filter + search + sort ----------------------------------------- */
  function getResults() {
    var q = searchInput.value.trim().toLowerCase();
    var cat = categorySelect.value;
    var list = data.filter(function (p) {
      var matchesCat = !cat || p.category === cat;
      var haystack = (p.title + ' ' + p.suburb + ' ' + p.category + ' ' + p.summary).toLowerCase();
      var matchesText = !q || q.split(/\s+/).every(function (word) { return haystack.indexOf(word) !== -1; });
      return matchesCat && matchesText;
    });
    var sort = sortSelect.value;
    list.sort(function (a, b) {
      if (sort === 'newest') { return b.year - a.year || a.title.localeCompare(b.title); }
      if (sort === 'oldest') { return a.year - b.year || a.title.localeCompare(b.title); }
      if (sort === 'suburb') { return a.suburb.localeCompare(b.suburb); }
      return a.title.localeCompare(b.title);          // name A–Z
    });
    return list;
  }

  /* ---- Render the cards (textContent only, so data can never inject HTML) */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text) { node.textContent = text; }
    return node;
  }

  function buildCard(p, index) {
    var card = el('article', 'project-card');

    var link = el('a', 'project-thumb');
    link.href = p.image;
    link.setAttribute('data-lightbox', 'projects');
    link.setAttribute('data-caption', p.title + ' \u2014 ' + p.suburb);
    var img = document.createElement('img');
    img.src = p.image; img.alt = p.alt; img.width = 450; img.height = 340;
    img.loading = 'lazy'; img.decoding = 'async';
    link.appendChild(img);
    link.appendChild(el('span', 'project-zoom', 'View larger'));
    card.appendChild(link);

    var body = el('div', 'project-body');
    body.appendChild(el('p', 'project-meta', p.category + ' \u00b7 ' + p.year));
    body.appendChild(el('h3', '', p.title));
    body.appendChild(el('p', 'project-place', p.suburb + ', Cape Town'));

    var actions = el('div', 'project-actions');
    var details = el('button', 'btn-link', 'Details');
    details.type = 'button';
    details.addEventListener('click', function () { openModal(p, details); });
    var onMap = el('button', 'btn-link', 'Show on map');
    onMap.type = 'button';
    onMap.addEventListener('click', function () { focusMarker(p); });
    actions.appendChild(details); actions.appendChild(onMap);
    body.appendChild(actions);
    card.appendChild(body);

    if (window.Gweleni) { window.Gweleni.reveal(card, (index % 3) * 80); }
    return card;
  }

  function render() {
    var results = getResults();
    grid.innerHTML = '';
    results.forEach(function (p, i) { grid.appendChild(buildCard(p, i)); });
    countEl.textContent = results.length === data.length
      ? 'Showing all ' + data.length + ' projects'
      : 'Showing ' + results.length + ' of ' + data.length + ' projects';
    emptyEl.hidden = results.length > 0;
    updateMarkers(results);
  }

  /* ---- Modal with project details ------------------------------------- */
  var modal = null, lastFocus = null;
  function openModal(p, trigger) {
    if (!modal) {
      modal = el('div', 'modal');
      modal.hidden = true;
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'modal-title');
      modal.innerHTML =
        '<div class="modal-card">' +
        '<button type="button" class="modal-close" aria-label="Close project details">\u00d7</button>' +
        '<img class="modal-img" alt="" width="450" height="340">' +
        '<div class="modal-body"><p class="project-meta"></p><h2 id="modal-title"></h2>' +
        '<p class="modal-place"></p><p class="modal-summary"></p>' +
        '<a class="btn btn-gold" href="enquiry.html">Request a quote for similar work</a></div></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', function (e) { if (e.target === modal) { closeModal(); } });
      modal.querySelector('.modal-close').addEventListener('click', closeModal);
      document.addEventListener('keydown', function (e) {
        if (modal.hidden) { return; }
        if (e.key === 'Escape') { closeModal(); }
        if (e.key === 'Tab') {
          var f = modal.querySelectorAll('button, a[href]');
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }
    modal.querySelector('.modal-img').src = p.image;
    modal.querySelector('.modal-img').alt = p.alt;
    modal.querySelector('.project-meta').textContent = p.category + ' \u00b7 ' + p.year;
    modal.querySelector('#modal-title').textContent = p.title;
    modal.querySelector('.modal-place').textContent = p.suburb + ', Cape Town';
    modal.querySelector('.modal-summary').textContent = p.summary;
    lastFocus = trigger;
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    modal.querySelector('.modal-close').focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus) { lastFocus.focus(); }
  }

  /* ---- Leaflet map: one marker per visible project -------------------- */
  function initMap() {
    var mapEl = document.getElementById('projects-map');
    if (!mapEl) { return; }
    if (!window.L) {
      mapEl.classList.add('map-fallback');
      mapEl.textContent = 'The interactive map could not be loaded. Our projects are located across Bellville, Durbanville, Brackenfell, Parow, Tyger Valley and Century City.';
      return;
    }
    map = L.map(mapEl, { scrollWheelZoom: false }).setView([-33.88, 18.62], 11);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
  }

  function popupFor(p) {
    var box = el('div', 'map-popup');
    box.appendChild(el('strong', '', p.title));
    box.appendChild(el('span', '', p.suburb + ' \u00b7 ' + p.category));
    return box;
  }

  function updateMarkers(results) {
    if (!map) { return; }
    markerLayer.clearLayers();
    markers = {};
    var points = [];
    results.forEach(function (p) {
      var m = L.marker([p.lat, p.lng], { title: p.title, alt: p.title }).bindPopup(popupFor(p));
      m.addTo(markerLayer);
      markers[p.id] = m;
      points.push([p.lat, p.lng]);
    });
    if (points.length) { map.fitBounds(points, { padding: [40, 40], maxZoom: 13 }); }
  }

  function focusMarker(p) {
    var mapEl = document.getElementById('projects-map');
    if (!map || !markers[p.id]) { return; }
    mapEl.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    map.setView([p.lat, p.lng], 14);
    markers[p.id].openPopup();
  }

  /* ---- Wire up the controls ------------------------------------------- */
  var timer = null;
  searchInput.addEventListener('input', function () {      // small debounce
    clearTimeout(timer); timer = setTimeout(render, 150);
  });
  categorySelect.addEventListener('change', render);
  sortSelect.addEventListener('change', render);
  resetBtn.addEventListener('click', function () {
    searchInput.value = ''; categorySelect.value = ''; sortSelect.value = 'newest';
    render(); searchInput.focus();
  });
  document.getElementById('project-controls').addEventListener('submit', function (e) { e.preventDefault(); });

  initMap();
  render();
})();
