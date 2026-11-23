/* Editor de contenido SAYME: dibuja los formularios definidos en inc/schema.php */
(function () {
  'use strict';
  var CFG = window.SAYME_EDITOR;
  if (!CFG) return;
  var state = (CFG.state && !Array.isArray(CFG.state)) ? CFG.state : {};
  var target = document.getElementById(CFG.target);

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function save() { if (target) target.value = JSON.stringify(state); }
  function key(f) { return f.data_key || f.key; }
  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }

  function visible(f, obj) {
    if (!f.show_if) return true;
    return Object.keys(f.show_if).every(function (dep) { return f.show_if[dep].indexOf(obj[dep]) !== -1; });
  }
  function dependsOn(fields) {
    var set = {};
    fields.forEach(function (f) { if (f.show_if) Object.keys(f.show_if).forEach(function (d) { set[d] = true; }); });
    return set;
  }
  function blank(fields) {
    var o = {};
    fields.forEach(function (f) {
      var k = key(f);
      if (f.type === 'select') o[k] = f.options.length ? f.options[0][0] : '';
      else if (f.type === 'repeater' || f.type === 'checklist') o[k] = [];
      else if (f.type === 'group') o[k] = blank(f.fields);
      else if (f.type === 'checkbox') o[k] = false;
      else o[k] = '';
    });
    return o;
  }

  /* Dibuja una lista de campos dentro de `box`, leyendo/escribiendo en `obj` */
  function renderFields(fields, obj, box) {
    box.innerHTML = '';
    var deps = dependsOn(fields);
    fields.forEach(function (f) {
      if (!visible(f, obj)) return;
      var k = key(f);
      var onChange = function () { save(); if (deps[k]) renderFields(fields, obj, box); };
      var node = renderField(f, obj, k, onChange);
      if (node) box.appendChild(node);
    });
  }

  function help(f) { return f.help ? el('p', { 'class': 'description', text: f.help }) : null; }

  function renderField(f, obj, k, onChange) {
    var t = f.type, v = obj[k], w;
    if (t === 'text') {
      if (typeof v !== 'string') v = '';
      return el('div', { 'class': 'sayme-field' }, [
        el('label', { 'class': 'sayme-lbl', text: f.label }),
        el('input', { type: 'text', value: v, oninput: function (e) { obj[k] = e.target.value; onChange(); } }),
        help(f)]);
    }
    if (t === 'textarea' || t === 'rich') {
      if (typeof v !== 'string') v = '';
      var ta = el('textarea', { rows: f.rows || 3, 'class': f.raw ? 'sayme-raw' : '', oninput: function (e) { obj[k] = e.target.value; onChange(); } });
      ta.value = v;
      return el('div', { 'class': 'sayme-field' }, [
        el('label', { 'class': 'sayme-lbl', text: f.label }), ta,
        t === 'rich' && !f.help ? el('p', { 'class': 'description', text: 'Puedes usar <b>negrita</b> y <br> para saltos de línea.' }) : help(f)]);
    }
    if (t === 'select') {
      var sel = el('select', { onchange: function (e) { obj[k] = e.target.value; onChange(); prev(); } });
      f.options.forEach(function (o) { var op = el('option', { value: o[0], text: o[1] }); if (o[0] === v) op.selected = true; sel.appendChild(op); });
      if (typeof v !== 'string' || !f.options.some(function (o) { return o[0] === v; })) { v = f.options.length ? f.options[0][0] : ''; obj[k] = v; sel.value = v; }
      var pv = el('span', { 'class': 'sayme-icon-prev' });
      function prev() { if (f.key === 'icon') { pv.innerHTML = CFG.iconSvg[sel.value] || ''; } }
      prev();
      return el('div', { 'class': 'sayme-field' }, [el('label', { 'class': 'sayme-lbl', text: f.label }), el('div', {}, [sel, f.key === 'icon' ? pv : null]), help(f)]);
    }
    if (t === 'checkbox') {
      var cb = el('input', { type: 'checkbox', onchange: function (e) { obj[k] = e.target.checked; onChange(); } });
      cb.checked = !!v;
      return el('div', { 'class': 'sayme-field' }, [el('label', {}, [cb, el('span', { text: ' ' + f.label })]), help(f)]);
    }
    if (t === 'image') return renderImage(f, obj, k, onChange);
    if (t === 'group') {
      if (!isObj(v)) { v = obj[k] = {}; }
      var gb = el('div');
      renderFields(f.fields, v, gb);
      return el('div', { 'class': 'sayme-group' }, [el('div', { 'class': 'sayme-glbl', text: f.label }), gb]);
    }
    if (t === 'repeater') return renderRepeater(f, obj, k, onChange);
    if (t === 'checklist') return renderChecklist(f, obj, k, onChange);
    return null;
  }

  function imgUrl(v) {
    if (!v) return '';
    if (/^\d+$/.test(String(v))) {
      if (window.wp && wp.media && wp.media.attachment) {
        var a = wp.media.attachment(parseInt(v, 10));
        return a.get('url') || '';
      }
      return '';
    }
    if (/^(https?:)?\/\//.test(v)) return v;
    return CFG.themeUri + '/' + String(v).replace(/^\//, '');
  }

  function renderImage(f, obj, k, onChange) {
    var v = obj[k];
    var prev = el('div', { 'class': 'sayme-prev' });
    function paint() {
      var u = imgUrl(obj[k]);
      prev.style.backgroundImage = u ? 'url("' + u + '")' : '';
      if (!u && /^\d+$/.test(String(obj[k] || '')) && window.wp && wp.media) {
        var a = wp.media.attachment(parseInt(obj[k], 10));
        a.fetch().then(function () { prev.style.backgroundImage = 'url("' + a.get('url') + '")'; });
      }
    }
    paint();
    var pick = el('button', { type: 'button', 'class': 'button', text: 'Elegir imagen', onclick: function () {
      var frame = wp.media({ title: 'Elegir imagen', button: { text: 'Usar esta imagen' }, multiple: false, library: { type: 'image' } });
      frame.on('select', function () {
        var a = frame.state().get('selection').first().toJSON();
        obj[k] = a.id; prev.style.backgroundImage = 'url("' + a.url + '")'; onChange();
      });
      frame.open();
    } });
    var rm = el('button', { type: 'button', 'class': 'button-link', text: 'Quitar', onclick: function () { obj[k] = ''; paint(); onChange(); } });
    return el('div', { 'class': 'sayme-field' }, [el('label', { 'class': 'sayme-lbl', text: f.label }), el('div', { 'class': 'sayme-image' }, [prev, pick, rm]), help(f)]);
  }

  function rowLabel(f, row, i) {
    var lf = f.item_label, txt = '';
    if (lf) {
      var sub = f.fields.filter(function (x) { return key(x) === lf; })[0];
      var val = row[lf];
      if (sub && sub.type === 'select') {
        var o = sub.options.filter(function (x) { return x[0] === val; })[0]; txt = o ? o[1] : '';
      } else if (typeof val === 'string') txt = val.replace(/<[^>]+>/g, '');
    }
    return txt || ('Elemento ' + (i + 1));
  }

  function renderRepeater(f, obj, k, onChange) {
    if (!Array.isArray(obj[k])) obj[k] = [];
    var list = obj[k];
    var wrap = el('div', { 'class': 'sayme-rep' });
    var openState = {};
    function paint() {
      wrap.innerHTML = '';
      wrap.appendChild(el('span', { 'class': 'sayme-rlbl', text: f.label }));
      list.forEach(function (row, i) {
        var rowEl = el('div', { 'class': 'sayme-row' + (openState[i] || list.length === 1 ? ' open' : '') });
        var title = el('span', { 'class': 'sayme-t', text: rowLabel(f, row, i) });
        var head = el('div', { 'class': 'sayme-rhead', onclick: function (e) {
          if (e.target.tagName === 'BUTTON') return;
          rowEl.classList.toggle('open'); openState[i] = rowEl.classList.contains('open');
        } }, [
          el('span', { 'class': 'sayme-n', text: (i + 1) + '.' }), title,
          el('button', { type: 'button', 'class': 'button-link', title: 'Subir', text: '↑', onclick: function () { move(i, -1); } }),
          el('button', { type: 'button', 'class': 'button-link', title: 'Bajar', text: '↓', onclick: function () { move(i, 1); } }),
          el('button', { type: 'button', 'class': 'button-link', title: 'Duplicar', text: '⧉', onclick: function () { list.splice(i + 1, 0, JSON.parse(JSON.stringify(row))); onChange(); paint(); } }),
          el('button', { type: 'button', 'class': 'button-link-delete', title: 'Eliminar', text: '✕', onclick: function () { if (confirm('¿Eliminar este elemento?')) { list.splice(i, 1); onChange(); paint(); } } })
        ]);
        var body = el('div', { 'class': 'sayme-rbody' });
        renderFields(f.fields, row, body);
        /* actualizar el rótulo al escribir */
        body.addEventListener('input', function () { title.textContent = rowLabel(f, row, i); });
        body.addEventListener('change', function () { title.textContent = rowLabel(f, row, i); });
        rowEl.appendChild(head); rowEl.appendChild(body); wrap.appendChild(rowEl);
      });
      wrap.appendChild(el('button', { type: 'button', 'class': 'button', text: '+ Añadir', onclick: function () {
        list.push(blank(f.fields)); openState[list.length - 1] = true; onChange(); paint();
      } }));
    }
    function move(i, d) {
      var j = i + d; if (j < 0 || j >= list.length) return;
      var t = list[i]; list[i] = list[j]; list[j] = t;
      var o = openState[i]; openState[i] = openState[j]; openState[j] = o;
      onChange(); paint();
    }
    paint();
    return wrap;
  }

  function renderChecklist(f, obj, k, onChange) {
    if (!Array.isArray(obj[k])) obj[k] = [];
    var sel = obj[k], all = (CFG.choices[f.source] || []);
    var names = {}; all.forEach(function (c) { names[c[0]] = c[1]; });
    var wrap = el('div', { 'class': 'sayme-field' });
    function paint() {
      wrap.innerHTML = '';
      wrap.appendChild(el('label', { 'class': 'sayme-lbl', text: f.label }));
      sel.forEach(function (id, i) {
        wrap.appendChild(el('div', { 'class': 'sayme-check on' }, [
          el('input', { type: 'checkbox', checked: 'checked', onchange: function () { sel.splice(i, 1); onChange(); paint(); } }),
          el('span', { 'class': 'sayme-t', text: names[id] || id }),
          el('button', { type: 'button', 'class': 'button-link', text: '↑', onclick: function () { if (i > 0) { var t = sel[i]; sel[i] = sel[i - 1]; sel[i - 1] = t; onChange(); paint(); } } }),
          el('button', { type: 'button', 'class': 'button-link', text: '↓', onclick: function () { if (i < sel.length - 1) { var t = sel[i]; sel[i] = sel[i + 1]; sel[i + 1] = t; onChange(); paint(); } } })
        ]));
      });
      all.forEach(function (c) {
        if (sel.indexOf(c[0]) !== -1) return;
        wrap.appendChild(el('div', { 'class': 'sayme-check' }, [
          el('input', { type: 'checkbox', onchange: function () { sel.push(c[0]); onChange(); paint(); } }),
          el('span', { 'class': 'sayme-t', text: c[1] })
        ]));
      });
      if (f.help) wrap.appendChild(help(f));
    }
    paint();
    return wrap;
  }

  /* Montaje: un recuadro por cada grupo de campos */
  var groups = {};
  CFG.schema.forEach(function (g) { groups[g.key] = g; });
  document.querySelectorAll('.sayme-mount').forEach(function (m) {
    var g = groups[m.getAttribute('data-group')];
    if (g) renderFields(g.fields, state, m);
  });
  save();
})();
