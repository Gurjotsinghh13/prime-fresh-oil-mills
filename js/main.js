(function () {
  var C = window.PFOM, B = C.business;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var byId = function (id) { return C.products.filter(function (p) { return p.id === id; })[0]; };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- illustrated oil drop (used only where no product photo exists) ---------- */
  function dropSVG(color, label) {
    return '<svg viewBox="0 0 120 150" role="img" aria-label="' + esc(label) + ' (illustration)">' +
      '<path d="M60 8C42 42 16 66 16 98a44 44 0 0 0 88 0C104 66 78 42 60 8z" fill="' + color + '"/>' +
      '<path d="M36 100a24 24 0 0 0 20 24" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".65"/></svg>';
  }

  /* ---------- business details ---------- */
  $$("[data-phone]").forEach(function (e) { e.textContent = B.phone; });
  $$("[data-phone-link]").forEach(function (e) { e.href = "tel:+" + B.phoneRaw; });
  $$("[data-address]").forEach(function (e) {
    e.textContent = B.address;
    if (!B.addressConfirmed) e.classList.add("todo");
  });
  $$("[data-email]").forEach(function (e) { e.textContent = B.email; });
  $$("[data-email-link]").forEach(function (e) { e.href = "mailto:" + B.email; });
  if (B.addressConfirmed) {
    var ml = $("#mapLink"); ml.hidden = false;
    ml.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(B.address);
  }
  $("#yr").textContent = new Date().getFullYear();

  function waLink(text) {
    return "https://wa.me/" + B.phoneRaw + "?text=" + encodeURIComponent(text || "Hi Prime Fresh Oil Mills, I'd like to request a quotation.");
  }
  $$("[data-wa]").forEach(function (e) { e.href = waLink(); });
  $("#hpWa").href = waLink("Hi Prime Fresh Oil Mills, I'm interested in Yellow Mustard Oil. Please share price, packing and minimum order details.");

  /* =====================================================================
     QUOTE LIST  (single source of truth: `lines`)
     Each line = one product with its own quantity, unit and packing.
     ===================================================================== */
  var lines = [];                       // [{id, qty, unit, pack}]
  var linesEl = $("#lines"), linesEmpty = $("#linesEmpty"), linesErr = $("#linesErr");
  var addSel = $("#addSel"), tray = $("#tray");
  var has = function (id) { return lines.some(function (l) { return l.id === id; }); };
  var lineOf = function (id) { return lines.filter(function (l) { return l.id === id; })[0]; };

  function packOptions(p) { return (C.packing && C.packing[p.category]) || ["Not sure, please advise"]; }

  function buildLine(l) {
    var p = byId(l.id), el = document.createElement("div");
    el.className = "line"; el.setAttribute("data-id", l.id);
    el.innerHTML =
      '<div class="line__name"><b>' + esc(p.name) + '</b><span>' + esc(p.category) + '</span></div>' +
      '<label class="line__qty">Quantity *<input type="number" min="1" inputmode="numeric" required placeholder="e.g. 5" aria-label="Quantity for ' + esc(p.name) + '"></label>' +
      '<label class="line__unit">Unit<select aria-label="Unit for ' + esc(p.name) + '">' +
        C.units.map(function (u) { return "<option>" + u + "</option>"; }).join("") + '</select></label>' +
      '<label class="line__pack">Packing<select aria-label="Packing for ' + esc(p.name) + '">' +
        packOptions(p).map(function (k) { return "<option>" + esc(k) + "</option>"; }).join("") + '</select></label>' +
      '<button type="button" class="line__rm" data-remove="' + l.id + '" aria-label="Remove ' + esc(p.name) + ' from quote">×</button>';
    var qty = $("input", el), sels = $$("select", el);
    qty.addEventListener("input", function () { l.qty = qty.value; if (qty.classList.contains("invalid")) setErr(qty, ""); });
    sels[0].addEventListener("change", function () { l.unit = sels[0].value; });
    sels[1].addEventListener("change", function () { l.pack = sels[1].value; });
    return el;
  }

  function addProduct(id, focusQty) {
    var p = byId(id); if (!p) return;
    if (!has(id)) {
      var l = { id: id, qty: "", unit: C.units[0], pack: packOptions(p)[0] };
      lines.push(l);
      linesEl.appendChild(buildLine(l));
      linesErr.hidden = true;
    }
    refresh(true);
    if (focusQty) {
      setTimeout(function () {
        var inp = $('.line[data-id="' + id + '"] input', linesEl);
        if (inp) inp.focus({ preventScroll: true });
      }, 700);
    }
  }
  function removeProduct(id) {
    lines = lines.filter(function (l) { return l.id !== id; });
    var el = $('.line[data-id="' + id + '"]', linesEl); if (el) el.remove();
    refresh(false);
  }
  function clearList() { lines = []; linesEl.innerHTML = ""; refresh(false); }

  /* keep every view of the list in sync */
  function refresh(pulse) {
    // catalog buttons
    $$("[data-toggle]").forEach(function (b) {
      var on = has(b.getAttribute("data-toggle"));
      b.classList.toggle("is-added", on);
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "✓ Added · tap to remove" : "+ Add to quote";
    });
    // empty message
    linesEmpty.hidden = lines.length > 0;
    // add-select: disable already-added items
    $$("option", addSel).forEach(function (o) { if (o.value) o.disabled = has(o.value); });
    addSel.value = "";
    // tray
    var n = lines.length;
    $("#trayCount").textContent = n;
    $("#trayLabel").textContent = n === 1 ? "1 product in your quote" : n + " products in your quote";
    tray.hidden = n === 0 || quoteInView;
    if (pulse && n) { tray.classList.remove("pulse"); void tray.offsetWidth; tray.classList.add("pulse"); }
  }

  /* hide the tray while the form itself is on screen */
  var quoteInView = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      quoteInView = en[0].isIntersecting;
      tray.hidden = lines.length === 0 || quoteInView;
    }, { threshold: 0.12 }).observe($("#quote"));
  }

  /* one delegated handler for every quote-related button on the page */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-toggle],[data-remove],[data-product]");
    if (!t) return;
    if (t.hasAttribute("data-toggle")) {
      var id = t.getAttribute("data-toggle");
      has(id) ? removeProduct(id) : addProduct(id, false);
    } else if (t.hasAttribute("data-remove")) {
      removeProduct(t.getAttribute("data-remove"));
    } else if (t.hasAttribute("data-quote-btn")) {   // hero / feature buttons: add, then scroll via href
      addProduct(t.getAttribute("data-product"), true);
    }
  });

  /* add-product dropdown inside the form (grouped by category) */
  (function buildAddSelect() {
    var html = '<option value="">+ Choose a product to add…</option>', groups = {};
    C.products.forEach(function (p) { (groups[p.category] = groups[p.category] || []).push(p); });
    Object.keys(groups).forEach(function (g) {
      html += '<optgroup label="' + esc(g) + '">' + groups[g].map(function (p) { return '<option value="' + p.id + '">' + esc(p.name) + "</option>"; }).join("") + "</optgroup>";
    });
    addSel.innerHTML = html;
  })();
  $("#addBtn").addEventListener("click", function () {
    if (!addSel.value) { linesErr.textContent = "Choose a product from the list first."; linesErr.hidden = false; addSel.focus(); return; }
    var id = addSel.value; addProduct(id, false);
    var inp = $('.line[data-id="' + id + '"] input', linesEl); if (inp) inp.focus();
  });

  /* ---------- catalog ---------- */
  var cats = ["All"];
  C.products.forEach(function (p) { if (cats.indexOf(p.category) < 0) cats.push(p.category); });
  var chips = $("#chips"), grid = $("#grid"), active = "All";

  function renderChips() {
    chips.innerHTML = "";
    cats.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.textContent = c;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(c === active));
      b.onclick = function () { active = c; renderChips(); renderGrid(); };
      chips.appendChild(b);
    });
  }
  function renderGrid() {
    grid.innerHTML = "";
    C.products.filter(function (p) { return active === "All" || p.category === active; }).forEach(function (p) {
      var el = document.createElement("article");
      el.className = "pcard";
      var visual = p.illus
        ? '<div class="pcard__img pcard__img--illus" style="background:linear-gradient(160deg,' + p.color + '33,' + p.color + '0f)">' + dropSVG(p.color, p.name) + '<span class="pcard__ill">Illustration</span>'
        : '<div class="pcard__img"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy" width="600" height="450">';
      el.innerHTML = visual +
        (p.bestseller ? '<span class="pcard__badge">Bestseller</span>' : "") + '</div>' +
        '<div class="pcard__body"><span class="pcard__cat">' + esc(p.category) + '</span><h3>' + esc(p.name) + '</h3><p>' + esc(p.short) + '</p>' +
        '<button type="button" class="btn btn--ghost btn--sm addbtn" data-toggle="' + p.id + '" aria-pressed="false">+ Add to quote</button></div>';
      grid.appendChild(el);
    });
    refresh(false);
  }
  renderChips(); renderGrid();

  /* ---------- quote form ---------- */
  var form = $("#quoteForm"), done = $("#done");

  function setErr(el, msg) {
    var lab = el.closest("label");
    var old = lab.querySelector(".err"); if (old) old.remove();
    el.classList.toggle("invalid", !!msg);
    if (msg) { var s = document.createElement("span"); s.className = "err"; s.textContent = msg; lab.appendChild(s); }
  }
  function validate() {
    var ok = true;
    if (!lines.length) {
      linesErr.textContent = "Add at least one product to your quote."; linesErr.hidden = false; ok = false;
    } else linesErr.hidden = true;
    $$("[required]", form).forEach(function (el) {
      var bad = !el.value.trim();
      var msg = bad ? "Required" : "";
      if (!bad && el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value)) msg = "Enter a valid email";
      if (!bad && el.type === "tel" && el.value.replace(/\D/g, "").length < 8) msg = "Enter a valid phone number";
      if (!bad && el.type === "number" && !(Number(el.value) > 0)) msg = "Enter a quantity above 0";
      setErr(el, msg); if (msg) ok = false;
    });
    return ok;
  }
  function firstProblem() {
    return $(".invalid", form) || (!lines.length ? addSel : null);
  }
  function lineText(l, i) {
    return (i + 1) + ". " + byId(l.id).name + " – " + l.qty + " " + l.unit + ", packing: " + l.pack;
  }
  function summary() {
    var f = new FormData(form);
    return "Hi Prime Fresh Oil Mills, I'd like a consolidated quotation for " + lines.length + (lines.length === 1 ? " product" : " products") + ":\n" +
      lines.map(lineText).join("\n") + "\n\n" +
      "Order type: " + f.get("ordertype") + "\nDelivery: " + (f.get("city") || "-") + "\nOwn brand: " + f.get("pl") +
      "\nCompany: " + (f.get("company") || "-") + " (" + (f.get("type") || "-") + ")" +
      "\nName: " + (f.get("name") || "-") + "\nPhone: " + (f.get("phone") || "-") + "\nEmail: " + (f.get("email") || "-") +
      (f.get("sample") ? "\nSample enquiry: yes" : "") + (f.get("msg") ? "\nNotes: " + f.get("msg") : "");
  }
  form.addEventListener("input", function (e) { if (e.target.classList.contains("invalid") && e.target.value) setErr(e.target, ""); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) { var first = firstProblem(); if (first) first.focus(); return; }
    var f = new FormData(form);
    var items = "<ul class='done__items'>" + lines.map(function (l) {
      return "<li><b>" + esc(byId(l.id).name) + "</b><span>" + esc(l.qty + " " + l.unit + " · " + l.pack) + "</span></li>";
    }).join("") + "</ul>";
    var rows = [
      ["Products (" + lines.length + ")", items, true],
      ["Order type", f.get("ordertype")], ["Delivery to", f.get("city")],
      ["Business type", f.get("type")], ["Own brand", f.get("pl")], ["Company", f.get("company")],
      ["Contact", f.get("phone") + " · " + f.get("email")]
    ];
    if (f.get("sample")) rows.push(["Samples", "Enquiry requested"]);
    if (f.get("msg")) rows.push(["Notes", f.get("msg")]);
    $("#doneSum").innerHTML = rows.map(function (r) {
      return "<div><dt>" + esc(r[0]) + "</dt><dd>" + (r[2] ? r[1] : esc(r[1])) + "</dd></div>";
    }).join("");
    $("#doneName").textContent = f.get("name");
    $("#doneWa").href = waLink(summary());
    form.hidden = true; done.hidden = false; done.focus({ preventScroll: true });
    done.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#doneAgain").addEventListener("click", function () {
    form.reset(); clearList(); linesErr.hidden = true;
    $$(".err", form).forEach(function (n) { if (n.id !== "linesErr") n.remove(); });
    done.hidden = true; form.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#waSend").addEventListener("click", function () {
    if (!validate()) { var first = firstProblem(); if (first) first.focus(); return; }
    window.open(waLink(summary()), "_blank", "noopener");
  });

  /* ---------- mobile nav ---------- */
  var burger = $("#burger"), links = $("#navLinks");
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach(function (a) { a.addEventListener("click", function () { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }); });

  /* ---------- structured data ---------- */
  var ld = { "@context": "https://schema.org", "@type": "Organization", name: B.name, telephone: B.phone, email: B.email };
  if (B.addressConfirmed) ld.address = B.address;
  $("#ld-json").textContent = JSON.stringify(ld);

  refresh(false);
})();
