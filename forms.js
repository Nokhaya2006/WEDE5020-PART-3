/* Gweleni Construction — form handling for enquiry.html and contact.html.
   - Client-side validation (JavaScript, on top of the HTML5 attributes) with
     inline, per-field error messages and live feedback.
   - Enquiry form: validated data is processed into an indicative cost range,
     earliest start date and next steps, shown to the user instantly. If the
     form's action URL points at a real form endpoint (e.g. Formspree) the
     data is also sent with fetch() (AJAX) without reloading the page.
   - Contact form: validated data is compiled into an email addressed to
     CONTACT_RECIPIENT; the visitor reviews it and sends it from their mail app. */
(function () {
  'use strict';

  /* ======= Settings you may need to change ================================ */
  var CONTACT_RECIPIENT = 'nokhayasingatha3@gmail.com';   // who contact-form emails go to
  var PHONE_DISPLAY = '+27 69 995 4854';

  /* ======= Shared validation helpers ====================================== */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var NAME_RE = /^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F' .\-]{1,59}$/;
  var PHONE_RE = /^(\+27|0)[1-8]\d{8}$/;                  // South African numbers

  function cleanPhone(value) { return value.replace(/[\s\-()]/g, ''); }
  function trimmed(field) { return field.value.trim(); }

  function todayLocal() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function toISO(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function parseISO(s) {
    var p = s.split('-');
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  }
  function formatDate(d) {
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function formatRand(n) {
    return 'R\u00a0' + Math.round(n).toLocaleString('en-ZA').replace(/,/g, ' ');
  }

  /* Common validators reused by both forms. Each returns '' when valid, or
     the error message to show the user. */
  var common = {
    name: function (f) {
      var v = trimmed(f);
      if (!v) { return 'Please enter your full name.'; }
      if (!NAME_RE.test(v)) { return 'Use letters, spaces, apostrophes, hyphens or full stops only (2\u201360 characters).'; }
      return '';
    },
    email: function (f) {
      var v = trimmed(f);
      if (!v) { return 'Please enter your email address.'; }
      if (!EMAIL_RE.test(v)) { return 'Enter a valid email address, e.g. name@example.com.'; }
      return '';
    },
    phoneRequired: function (f) {
      var v = cleanPhone(f.value);
      if (!v) { return 'Please enter a phone number we can reach you on.'; }
      if (!PHONE_RE.test(v)) { return 'Enter a valid South African number, e.g. 072 419 3088 or +27 72 419 3088.'; }
      return '';
    },
    phoneOptional: function (f) {
      var v = cleanPhone(f.value);
      if (v && !PHONE_RE.test(v)) { return 'Enter a valid South African number, e.g. 072 419 3088, or leave this blank.'; }
      return '';
    },
    message: function (f) {
      var len = trimmed(f).length;
      if (!len) { return 'Please type your message.'; }
      if (len < 20) { return 'Please give us a little more detail (at least 20 characters \u2014 you have ' + len + ').'; }
      if (len > 1000) { return 'Please keep your message under 1000 characters (you have ' + len + ').'; }
      return '';
    },
    consent: function (f) {
      return f.checked ? '' : 'Please tick the box so we can contact you about this request.';
    }
  };

  /* Radio groups come back from form.elements as a RadioNodeList. */
  function radioRequired(message) {
    return function (group) { return group.value ? '' : message; };
  }

  /* ---- Showing / clearing errors ---------------------------------------- */
  function markTarget(control) {
    return (window.RadioNodeList && control instanceof RadioNodeList) ? control[0].closest('fieldset') : control;
  }
  function errorBox(name) { return document.getElementById(name + '-error'); }

  function applyResult(form, name, message) {
    var control = form.elements[name];
    var target = markTarget(control);
    var box = errorBox(name);
    if (box) { box.textContent = message; }
    if (message) {
      target.classList.add('is-invalid'); target.classList.remove('is-valid');
      target.setAttribute('aria-invalid', 'true');
    } else {
      target.classList.remove('is-invalid'); target.classList.add('is-valid');
      target.removeAttribute('aria-invalid');
    }
  }

  function setUp(form, validators, options) {
    var names = Object.keys(validators);
    var touched = {};

    function check(name) {
      var message = validators[name](form.elements[name], form.elements);
      applyResult(form, name, message);
      return message;
    }

    // Live feedback: validate when a field loses focus, then keep it updated.
    names.forEach(function (name) {
      var control = form.elements[name];
      var nodes = (window.RadioNodeList && control instanceof RadioNodeList) ? Array.prototype.slice.call(control) : [control];
      nodes.forEach(function (node) {
        node.addEventListener('blur', function () { touched[name] = true; check(name); });
        node.addEventListener('input', function () { if (touched[name]) { check(name); } });
        node.addEventListener('change', function () { touched[name] = true; check(name); });
      });
    });

    // Character counters on textareas.
    form.querySelectorAll('[data-counter]').forEach(function (area) {
      var out = document.getElementById(area.getAttribute('data-counter'));
      function update() {
        var n = area.value.length;
        out.textContent = n + ' / 1000';
        out.classList.toggle('is-over', n > 1000);
      }
      area.addEventListener('input', update); update();
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var firstBad = null, count = 0;
      names.forEach(function (name) {
        touched[name] = true;
        if (check(name)) {
          count += 1;
          if (!firstBad) {
            var c = form.elements[name];
            firstBad = (window.RadioNodeList && c instanceof RadioNodeList) ? c[0] : c;
          }
        }
      });
      var summary = form.querySelector('.form-summary');
      if (count) {
        summary.textContent = 'Please fix ' + count + (count === 1 ? ' field' : ' fields') + ' marked below before sending.';
        summary.hidden = false;
        firstBad.focus();
        return;
      }
      summary.hidden = true;
      if (form.elements.website && form.elements.website.value) { return; }   // honeypot: bots only
      options.onValid(form);
    });

    form.addEventListener('reset', function () {
      names.forEach(function (name) {
        var target = markTarget(form.elements[name]);
        target.classList.remove('is-invalid', 'is-valid'); target.removeAttribute('aria-invalid');
        var box = errorBox(name); if (box) { box.textContent = ''; }
        touched[name] = false;
      });
      form.querySelector('.form-summary').hidden = true;
      setTimeout(function () { form.querySelectorAll('[data-counter]').forEach(function (a) { a.dispatchEvent(new Event('input')); }); }, 0);
    });
  }

  function node(tag, className, text) {
    var n = document.createElement(tag);
    if (className) { n.className = className; }
    if (text !== undefined) { n.textContent = text; }
    return n;
  }
  function definitionList(rows) {
    var dl = node('dl', 'result-list');
    rows.forEach(function (r) {
      var wrap = node('div');
      wrap.appendChild(node('dt', '', r[0]));
      wrap.appendChild(node('dd', '', r[1]));
      dl.appendChild(wrap);
    });
    return dl;
  }
  function showPanel(form, panel) {
    form.hidden = true; panel.hidden = false;
    var heading = panel.querySelector('h2');
    heading.setAttribute('tabindex', '-1'); heading.focus();
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function backToForm(form, panel) {
    panel.hidden = true; form.hidden = false;
    var first = form.querySelector('input:not([type=hidden]), select, textarea'); if (first) { first.focus(); }
  }

  /* ======================================================================
     ENQUIRY FORM  (enquiry.html)
     ====================================================================== */
  var enquiry = document.getElementById('enquiry-form');
  if (enquiry) {
    var today = todayLocal();
    var maxDate = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
    enquiry.elements.startDate.min = toISO(today);
    enquiry.elements.startDate.max = toISO(maxDate);

    // Indicative pricing and lead times. PLACEHOLDER figures: replace with
    // Gweleni Construction's real rates before relying on them.
    var SERVICES = {
      'new-build':  { label: 'Residential new build',  perM2: [11000, 16000], leadDays: 60 },
      'extension':  { label: 'Home extension',         perM2: [9500, 15000],  leadDays: 45 },
      'kitchen':    { label: 'Kitchen renovation',     fixed: [90000, 250000], typicalM2: 12, leadDays: 21 },
      'bathroom':   { label: 'Bathroom renovation',    fixed: [60000, 160000], typicalM2: 6,  leadDays: 14 },
      'roofing':    { label: 'Roofing',                perM2: [450, 900],     leadDays: 14 },
      'commercial': { label: 'Commercial fit-out',     perM2: [4500, 9000],   leadDays: 30 }
    };
    var BUDGETS = {
      'under-100k': { label: 'Under R100 000', max: 100000 },
      '100k-250k':  { label: 'R100 000 \u2013 R250 000', max: 250000 },
      '250k-500k':  { label: 'R250 000 \u2013 R500 000', max: 500000 },
      '500k-1m':    { label: 'R500 000 \u2013 R1 million', max: 1000000 },
      'over-1m':    { label: 'Over R1 million', max: Infinity },
      'unsure':     { label: 'Not sure yet', max: Infinity }
    };

    var enquiryValidators = {
      name: common.name,
      email: common.email,
      phone: common.phoneRequired,
      service: function (f) { return f.value ? '' : 'Please choose the service you need.'; },
      propertyType: radioRequired('Please select the type of property.'),
      size: function (f) {
        var raw = f.value.trim();
        if (!raw) { return 'Please enter the approximate area in square metres.'; }
        var n = Number(raw);
        if (!isFinite(n) || n < 5 || n > 5000) { return 'Enter an area between 5 and 5000 m\u00b2.'; }
        return '';
      },
      startDate: function (f) {
        if (!f.value) { return 'Please choose your preferred start date.'; }
        var d = parseISO(f.value);
        if (isNaN(d.getTime())) { return 'Enter a valid date.'; }
        if (d < today) { return 'The start date cannot be in the past.'; }
        if (d > maxDate) { return 'Please choose a date within the next two years.'; }
        return '';
      },
      message: common.message,
      consent: common.consent
    };

    var enquiryPanel = document.getElementById('enquiry-result');

    function estimate(data) {
      var s = SERVICES[data.service], size = Number(data.size), low, high;
      if (s.perM2) { low = s.perM2[0] * size; high = s.perM2[1] * size; }
      else {
        var factor = Math.min(Math.max(size / s.typicalM2, 0.6), 2.5);
        low = s.fixed[0] * factor; high = s.fixed[1] * factor;
      }
      var round = function (n) { return Math.round(n / 1000) * 1000; };
      var earliest = new Date(today); earliest.setDate(earliest.getDate() + s.leadDays);
      var wanted = parseISO(data.startDate);
      return { low: round(low), high: round(high), earliest: earliest, wanted: wanted, lead: s.leadDays, label: s.label };
    }

    function sendToEndpoint(form, payload) {
      var url = form.getAttribute('action') || '';
      if (!url || url.indexOf('YOUR_FORM_ID') !== -1 || !window.fetch) { return Promise.resolve('local'); }
      return fetch(url, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) { if (!res.ok) { throw new Error('Request failed'); } return 'sent'; });
    }

    setUp(enquiry, enquiryValidators, {
      onValid: function (form) {
        var e = form.elements;
        var data = {
          name: trimmed(e.name), email: trimmed(e.email), phone: cleanPhone(e.phone.value),
          service: e.service.value, propertyType: e.propertyType.value, size: e.size.value,
          startDate: e.startDate.value, budget: e.budget.value, siteVisit: e.siteVisit.checked,
          message: trimmed(e.message)
        };
        var est = estimate(data);
        var ref = 'GC-' + toISO(new Date()).replace(/-/g, '') + '-' + String(Math.floor(1000 + Math.random() * 9000));

        var submitBtn = form.querySelector('[type=submit]');
        submitBtn.disabled = true; submitBtn.textContent = 'Processing\u2026';

        var payload = { reference: ref, estimateLow: est.low, estimateHigh: est.high };
        Object.keys(data).forEach(function (k) { payload[k] = data[k]; });

        sendToEndpoint(form, payload).then(function (state) { return state; }, function () { return 'failed'; })
          .then(function (state) {
            submitBtn.disabled = false; submitBtn.textContent = 'Get my estimate';

            // Build the response panel with DOM methods (textContent = no HTML injection).
            var body = enquiryPanel.querySelector('.result-body');
            body.innerHTML = '';
            body.appendChild(node('p', 'result-ref', 'Reference ' + ref));
            body.appendChild(node('p', 'result-lead',
              'Thank you, ' + data.name.split(' ')[0] + '. Here is your indicative estimate for ' + est.label.toLowerCase() + '.'));

            var cost = node('div', 'result-cost');
            cost.appendChild(node('span', 'result-cost-label', 'Indicative cost range'));
            cost.appendChild(node('strong', '', formatRand(est.low) + ' \u2013 ' + formatRand(est.high)));
            body.appendChild(cost);

            var budgetNote = '';
            var b = BUDGETS[data.budget];
            if (b && b.max < est.low) {
              budgetNote = 'Your stated budget (' + b.label + ') looks lower than this range. We can talk about phasing the work or adjusting the scope.';
            } else if (b && data.budget !== 'unsure' && b.max !== Infinity && b.max < est.high) {
              budgetNote = 'Your budget (' + b.label + ') overlaps the lower end of this range \u2014 a site visit will show what is achievable.';
            } else if (b && data.budget !== 'unsure') {
              budgetNote = 'Your budget (' + b.label + ') is in line with this range.';
            }

            var availability = est.wanted >= est.earliest
              ? 'Your preferred start date of ' + formatDate(est.wanted) + ' looks achievable, subject to a site visit and any approvals.'
              : 'Our earliest start for this type of work is around ' + formatDate(est.earliest) + ' (roughly ' + Math.round(est.lead / 7) + ' weeks\u2019 lead time). Your preferred date of ' + formatDate(est.wanted) + ' is earlier than we can usually manage.';

            var rows = [
              ['Availability', availability],
              ['Property', e.propertyType.value.charAt(0).toUpperCase() + e.propertyType.value.slice(1) + ', approx. ' + data.size + ' m\u00b2'],
              ['Site visit', data.siteVisit ? 'You asked for a site visit \u2014 we will call you on ' + data.phone + ' to arrange it.' : 'No site visit requested; we can arrange one later if needed.']
            ];
            if (budgetNote) { rows.splice(1, 0, ['Budget', budgetNote]); }
            body.appendChild(definitionList(rows));

            body.appendChild(node('p', 'result-note',
              'This is a rough guide based on typical rates, not a formal quotation. A written quote follows once we have confirmed the details with you.'));

            var status = enquiryPanel.querySelector('.result-status');
            if (state === 'sent') { status.textContent = 'Your enquiry has also been sent to our team \u2014 we will be in touch within one working day.'; }
            else if (state === 'failed') { status.textContent = 'We could not send your enquiry automatically. Please call ' + PHONE_DISPLAY + ' or email ' + CONTACT_RECIPIENT + ' and quote your reference.'; }
            else { status.textContent = 'To confirm this estimate, please quote your reference when you contact us on ' + PHONE_DISPLAY + '.'; }

            showPanel(form, enquiryPanel);
          });
      }
    });

    document.getElementById('enquiry-again').addEventListener('click', function () {
      enquiry.reset(); backToForm(enquiry, enquiryPanel);
    });
    document.getElementById('enquiry-print').addEventListener('click', function () { window.print(); });
  }

  /* ======================================================================
     CONTACT FORM  (contact.html)
     ====================================================================== */
  var contact = document.getElementById('contact-form');
  if (contact) {
    var TYPES = {
      general: 'General question', feedback: 'Feedback or compliment', complaint: 'Complaint',
      careers: 'Careers / work with us', supplier: 'Supplier or partnership', media: 'Media enquiry'
    };
    var contactValidators = {
      name: common.name,
      email: common.email,
      phone: common.phoneOptional,
      messageType: function (f) { return f.value ? '' : 'Please choose what your message is about.'; },
      subject: function (f) {
        var v = trimmed(f);
        if (!v) { return 'Please enter a subject.'; }
        if (v.length < 3) { return 'The subject is too short (at least 3 characters).'; }
        if (v.length > 80) { return 'Please keep the subject under 80 characters.'; }
        return '';
      },
      message: common.message,
      replyVia: radioRequired('Please tell us how you would like us to reply.'),
      consent: common.consent
    };
    var contactPanel = document.getElementById('contact-result');
    var currentMailto = '', currentText = '';

    setUp(contact, contactValidators, {
      onValid: function (form) {
        var e = form.elements;
        var typeLabel = TYPES[e.messageType.value];
        var subject = '[' + typeLabel + '] ' + trimmed(e.subject);
        var lines = [
          'Hello Gweleni Construction,', '',
          trimmed(e.message), '', '--',
          'Name: ' + trimmed(e.name),
          'Email: ' + trimmed(e.email),
          'Phone: ' + (cleanPhone(e.phone.value) || 'not provided'),
          'Preferred reply: ' + (e.replyVia.value === 'phone' ? 'Phone call' : 'Email'),
          'Message type: ' + typeLabel,
          'Sent from the Gweleni Construction website contact form'
        ];
        currentText = 'To: ' + CONTACT_RECIPIENT + '\nSubject: ' + subject + '\n\n' + lines.join('\n');
        currentMailto = 'mailto:' + CONTACT_RECIPIENT +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines.join('\r\n'));

        var body = contactPanel.querySelector('.result-body');
        body.innerHTML = '';
        body.appendChild(node('p', 'result-lead', 'Your message is ready. Check it below, then press \u201cSend email\u201d to open it in your email app.'));
        body.appendChild(definitionList([['To', CONTACT_RECIPIENT], ['Subject', subject]]));
        body.appendChild(node('pre', 'email-preview', lines.join('\n')));

        contactPanel.querySelector('#contact-send').setAttribute('href', currentMailto);
        contactPanel.querySelector('.copy-status').textContent = '';
        showPanel(form, contactPanel);
      }
    });

    document.getElementById('contact-edit').addEventListener('click', function () { backToForm(contact, contactPanel); });
    document.getElementById('contact-copy').addEventListener('click', function () {
      var status = contactPanel.querySelector('.copy-status');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentText).then(function () { status.textContent = 'Email text copied.'; },
          function () { status.textContent = 'Could not copy \u2014 please select the text and copy it manually.'; });
      } else { status.textContent = 'Copying is not supported here \u2014 please select the text and copy it manually.'; }
    });
  }
})();
