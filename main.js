/* Gweleni Construction — shared interactivity (loaded on every page).
   Covers: mobile-nav auto-close, scroll-reveal animation, animated stat
   counters, single-open FAQ accordion, ARIA tabs, back-to-top button and
   the image-gallery lightbox. Written in plain JavaScript (no libraries). */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  /* ---- 1. Mobile menu behaviour -------------------------------------------
     The menu itself is CSS-only (checkbox hack). JavaScript adds the extras:
     close after a link is tapped, close with Esc (focus returns to the toggle),
     close when tapping outside the header, and reset when the window is
     resized up to desktop width. */
  var navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    document.querySelectorAll('.main-nav a').forEach(function (link) {
      link.addEventListener('click', function () { navToggle.checked = false; });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.checked) { navToggle.checked = false; navToggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (navToggle.checked && e.target !== navToggle && !e.target.closest('.site-header')) { navToggle.checked = false; }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) { navToggle.checked = false; }
    });
  }

  /* ---- 2. Scroll-reveal animation (IntersectionObserver) ---------------- */
  var observer = null;
  if ('IntersectionObserver' in window && !reduceMotion) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
          // Clear the stagger delay afterwards so hover effects stay snappy.
          (function (t) { setTimeout(function () { t.style.transitionDelay = ''; }, 1000); })(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  function reveal(el, delay) {
    if (!observer) { return; }           // no support / reduced motion: leave visible
    el.classList.add('reveal');
    el.style.transitionDelay = (delay || 0) + 'ms';
    observer.observe(el);
  }
  document.querySelectorAll('.service-card, .service-tile, .gallery-item, .testimonial-card, .mv-card, .stat, .why-list li, .office-card')
    .forEach(function (el, i) { reveal(el, (i % 3) * 90); });

  /* ---- 3. Animated stat counters ("20+", "100%") ------------------------ */
  document.querySelectorAll('.stat-num').forEach(function (el) {
    var match = el.textContent.trim().match(/^(\d+)(\D*)$/);
    if (!match || reduceMotion || !('IntersectionObserver' in window)) { return; }
    var target = parseInt(match[1], 10), suffix = match[2];
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      if (!entries[0].isIntersecting) { return; }
      obs.disconnect();
      var start = null, duration = 1200;
      function step(ts) {
        if (start === null) { start = ts; }
        var progress = Math.min((ts - start) / duration, 1);
        el.textContent = Math.round(target * progress) + suffix;
        if (progress < 1) { requestAnimationFrame(step); }
      }
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    counterObserver.observe(el);
  });

  /* ---- 4. Accordion: only one FAQ <details> open at a time -------------- */
  var faqItems = document.querySelectorAll('.accordion details');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) { return; }
      faqItems.forEach(function (other) { if (other !== item) { other.open = false; } });
    });
  });

  /* ---- 5. Tabs (WAI-ARIA tabs pattern with arrow-key support) ----------- */
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) { tabs[index].focus(); }
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') { next = (i + 1) % tabs.length; }
        if (e.key === 'ArrowLeft') { next = (i - 1 + tabs.length) % tabs.length; }
        if (e.key === 'Home') { next = 0; }
        if (e.key === 'End') { next = tabs.length - 1; }
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
    select(0, false);
  });

  /* ---- 6. Back-to-top button (created with DOM manipulation) ------------ */
  var topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'back-to-top';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.textContent = '\u2191';
  document.body.appendChild(topBtn);
  window.addEventListener('scroll', function () {
    topBtn.classList.toggle('is-shown', window.scrollY > 600);
  }, { passive: true });
  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---- 7. Gallery lightbox ----------------------------------------------
     Any <a data-lightbox="group" href="full-image" data-caption="..."> opens
     the viewer. Event delegation means cards added later by projects.js work
     too. Supports prev/next buttons, arrow keys, Esc, swipe and a focus trap. */
  var box = null, imgEl, capEl, countEl, items = [], current = 0, lastFocus = null, touchX = null;

  function buildLightbox() {
    box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image viewer');
    box.hidden = true;
    box.innerHTML =
      '<button type="button" class="lb-btn lb-close" aria-label="Close image viewer">\u00d7</button>' +
      '<button type="button" class="lb-btn lb-prev" aria-label="Previous image">\u2039</button>' +
      '<figure class="lb-figure"><img class="lb-img" alt="">' +
      '<figcaption class="lb-caption"></figcaption></figure>' +
      '<button type="button" class="lb-btn lb-next" aria-label="Next image">\u203a</button>' +
      '<p class="lb-count" aria-live="polite"></p>';
    document.body.appendChild(box);
    imgEl = box.querySelector('.lb-img');
    capEl = box.querySelector('.lb-caption');
    countEl = box.querySelector('.lb-count');

    box.querySelector('.lb-close').addEventListener('click', closeLightbox);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) { closeLightbox(); } });
    box.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (touchX === null) { return; }
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) { show(current + (dx < 0 ? 1 : -1)); }
      touchX = null;
    });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) { return; }
      if (e.key === 'Escape') { closeLightbox(); }
      if (e.key === 'ArrowRight') { show(current + 1); }
      if (e.key === 'ArrowLeft') { show(current - 1); }
      if (e.key === 'Tab') {                      // keep focus inside the dialog
        var f = box.querySelectorAll('button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function show(index) {
    current = (index + items.length) % items.length;
    var item = items[current];
    imgEl.classList.remove('is-loaded');
    imgEl.onload = function () { imgEl.classList.add('is-loaded'); };
    imgEl.src = item.href;
    imgEl.alt = item.alt;
    capEl.textContent = item.caption;
    countEl.textContent = (current + 1) + ' / ' + items.length;
    var single = items.length < 2;
    box.querySelector('.lb-prev').hidden = single;
    box.querySelector('.lb-next').hidden = single;
    var next = new Image(); next.src = items[(current + 1) % items.length].href;   // preload neighbour
  }

  function openLightbox(link) {
    if (!box) { buildLightbox(); }
    var group = link.getAttribute('data-lightbox');
    var links = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox="' + group + '"]'));
    items = links.map(function (a) {
      var img = a.querySelector('img');
      return { href: a.getAttribute('href'), alt: img ? img.alt : '', caption: a.getAttribute('data-caption') || (img ? img.alt : '') };
    });
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.classList.add('no-scroll');
    show(links.indexOf(link));
    box.querySelector('.lb-close').focus();
  }

  function closeLightbox() {
    box.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus) { lastFocus.focus(); }
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-lightbox]');
    if (link) { e.preventDefault(); openLightbox(link); }
  });

  /* Expose the small helpers other scripts need. */
  window.Gweleni = { reveal: reveal };
})();
