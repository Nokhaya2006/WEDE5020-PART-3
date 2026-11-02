/* Gweleni Construction — Contact page map (Leaflet + OpenStreetMap).
   Shows both offices; the buttons above the map fly to each location.
   Coordinates are approximate suburb centres. */
(function () {
  'use strict';
  var mapEl = document.getElementById('office-map');
  if (!mapEl) { return; }

  if (!window.L) {
    mapEl.classList.add('map-fallback');
    mapEl.textContent = 'The interactive map could not be loaded. Head office: 318 Ridgeworth, Bellville. Site office: Durbanville, Cape Town.';
    return;
  }

  var offices = {
    bellville:   { name: 'Bellville Head Office', lat: -33.9000, lng: 18.6300, detail: '318 Ridgeworth, Bellville' },
    durbanville: { name: 'Durbanville Site Office', lat: -33.8321, lng: 18.6498, detail: 'Durbanville (by appointment)' }
  };

  var map = L.map(mapEl, { scrollWheelZoom: false }).setView([-33.866, 18.64], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var markers = {};
  Object.keys(offices).forEach(function (key) {
    var o = offices[key];
    var popup = document.createElement('div');
    popup.className = 'map-popup';
    var strong = document.createElement('strong'); strong.textContent = o.name;
    var span = document.createElement('span'); span.textContent = o.detail;
    popup.appendChild(strong); popup.appendChild(span);
    markers[key] = L.marker([o.lat, o.lng], { title: o.name, alt: o.name }).addTo(map).bindPopup(popup);
  });
  map.fitBounds([[offices.bellville.lat, offices.bellville.lng], [offices.durbanville.lat, offices.durbanville.lng]], { padding: [60, 60] });

  document.querySelectorAll('[data-fly]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var o = offices[btn.getAttribute('data-fly')];
      map.flyTo([o.lat, o.lng], 15, { duration: 1.2 });
      markers[btn.getAttribute('data-fly')].openPopup();
    });
  });
})();
