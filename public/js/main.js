(function () {
  var C = window.PFOM, B = C.business;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var byId = function (id) { return C.products.filter(function (p) { return p.id === id; })[0]; };
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- illustrated oil drop (fallback illustration) ---------- */
  function dropSVG(color, label) {
    return '<svg viewBox="0 0 120 150" role="img" aria-label="' + esc(label) + ' (illustration)">' +
      '<path d="M60 8C42 42 16 66 16 98a44 44 0 0 0 88 0C104 66 78 42 60 8z" fill="' + color + '"/>' +
      '<path d="M36 100a24 24 0 0 0 20 24" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".65"/></svg>';
  }

  /* ---------- business details ---------- */
  $$("[data-phone]").forEach(function (e) { e.textContent = B.phone; });
  $$("[data-phone-link]").forEach(function (e) { e.href = "tel:+" + B.phoneRaw; });
  $$("[data-address]").forEach(function (e) { e.textContent = B.address; });
  $$("[data-email]").forEach(function (e) { e.textContent = B.email; });
  $$("[data-email-link]").forEach(function (e) { e.href = "mailto:" + B.email; });
  
  var ml = $("#mapLink");
  if (ml && B.mapsUrl) {
    ml.href = B.mapsUrl;
  }
  var yrEl = $("#yr");
  if (yrEl) yrEl.textContent = new Date().getFullYear();

  function waLink(text) {
    return "https://wa.me/" + B.phoneRaw + "?text=" + encodeURIComponent(text || "Hi Prime Fresh Oil Mills, I'd like to request a trade quotation.");
  }
  $$("[data-wa]").forEach(function (e) { e.href = waLink(); });
  var hpWa = $("#hpWa");
  if (hpWa) hpWa.href = waLink("Hi Prime Fresh Oil Mills, I am inquiring from our business regarding Yellow Mustard Oil. Please share current bulk and private-label rates, packing formats, and minimum order terms.");

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
    
    var unitOptions = C.units.map(function (u) {
      return '<option value="' + u + '"' + (l.unit === u ? ' selected' : '') + '>' + u + '</option>';
    }).join("");

    var pOptions = packOptions(p).map(function (k) {
      return '<option value="' + esc(k) + '"' + (l.pack === k ? ' selected' : '') + '>' + esc(k) + '</option>';
    }).join("");

    el.innerHTML =
      '<div class="line__name">' +
        '<b>' + esc(p.name) + '</b>' +
        '<span>' + esc(p.category) + (p.grade ? ' · ' + esc(p.grade) : '') + '</span>' +
      '</div>' +
      '<div class="line__qty-wrap">' +
        '<label class="line__qty">Quantity *' +
          '<input type="number" min="1" step="any" inputmode="numeric" required placeholder="e.g. 10" value="' + esc(l.qty) + '" aria-label="Quantity for ' + esc(p.name) + '">' +
        '</label>' +
        '<div class="line__presets" aria-label="Quick volume presets">' +
          '<button type="button" class="line__preset-btn" data-preset="5">5</button>' +
          '<button type="button" class="line__preset-btn" data-preset="10">10</button>' +
          '<button type="button" class="line__preset-btn" data-preset="20">20</button>' +
          '<button type="button" class="line__preset-btn" data-preset="50">50</button>' +
        '</div>' +
      '</div>' +
      '<label class="line__unit">Unit<select aria-label="Unit for ' + esc(p.name) + '">' + unitOptions + '</select></label>' +
      '<label class="line__pack">Packing<select aria-label="Packing for ' + esc(p.name) + '">' + pOptions + '</select></label>' +
      '<button type="button" class="line__rm" data-remove="' + l.id + '" aria-label="Remove ' + esc(p.name) + ' from quote">×</button>';

    var qty = $("input", el), sels = $$("select", el);
    qty.addEventListener("input", function () {
      l.qty = qty.value;
      if (qty.classList.contains("invalid")) setErr(qty, "");
    });

    // Preset button clicks
    $$(".line__preset-btn", el).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var val = btn.getAttribute("data-preset");
        qty.value = val;
        l.qty = val;
        if (qty.classList.contains("invalid")) setErr(qty, "");
      });
    });

    sels[0].addEventListener("change", function () { l.unit = sels[0].value; });
    sels[1].addEventListener("change", function () { l.pack = sels[1].value; });
    return el;
  }

  function addProduct(id, focusQty, initialQty, initialUnit, initialPack) {
    if (!id) id = "yellow-mustard-oil"; // graceful fallback to flagship
    var p = byId(id); if (!p) return;
    
    if (!has(id)) {
      var l = {
        id: id,
        qty: initialQty !== undefined ? String(initialQty) : "",
        unit: initialUnit || (p.category === "Oils" ? "Litres" : C.units[0]),
        pack: initialPack || packOptions(p)[0]
      };
      lines.push(l);
      linesEl.appendChild(buildLine(l));
      if (linesErr) linesErr.hidden = true;
    } else if (initialQty !== undefined) {
      // update existing line
      var existing = lineOf(id);
      existing.qty = String(initialQty);
      if (initialUnit) existing.unit = initialUnit;
      if (initialPack) existing.pack = initialPack;
      var row = $('.line[data-id="' + id + '"]', linesEl);
      if (row) {
        var inp = $("input", row);
        if (inp) inp.value = existing.qty;
      }
    }
    refresh(true);
    if (focusQty) {
      setTimeout(function () {
        var inp = $('.line[data-id="' + id + '"] input', linesEl);
        if (inp) inp.focus({ preventScroll: true });
      }, 600);
    }
  }

  function removeProduct(id) {
    lines = lines.filter(function (l) { return l.id !== id; });
    var el = $('.line[data-id="' + id + '"]', linesEl);
    if (el) el.remove();
    refresh(false);
  }

  function clearList() {
    lines = [];
    linesEl.innerHTML = "";
    refresh(false);
  }

  /* keep every view of the list in sync */
  function refresh(pulse) {
    var n = lines.length;

    // catalog buttons & cards
    $$("[data-toggle]").forEach(function (b) {
      var pid = b.getAttribute("data-toggle");
      var on = has(pid);
      b.classList.toggle("is-added", on);
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "✓ Added · tap to remove" : "+ Add to quote";
      var card = b.closest(".pcard");
      if (card) card.classList.toggle("is-added", on);
    });

    // catalog staged summary counter
    $$(".catalog-summary-count").forEach(function (c) { c.textContent = n; });

    // empty message
    if (linesEmpty) linesEmpty.hidden = n > 0;

    // add-select: disable already-added items
    $$("option", addSel).forEach(function (o) { if (o.value) o.disabled = has(o.value); });
    addSel.value = "";

    // tray
    var trayCount = $("#trayCount"), trayLabel = $("#trayLabel");
    if (trayCount) trayCount.textContent = n;
    if (trayLabel) trayLabel.textContent = n === 1 ? "1 product staged" : n + " products staged";
    if (tray) {
      tray.hidden = n === 0 || quoteInView;
      document.body.classList.toggle("has-tray", !tray.hidden);
      if (pulse && n) {
        tray.classList.remove("pulse");
        void tray.offsetWidth;
        tray.classList.add("pulse");
      }
    }
  }

  /* hide the tray while the form itself is on screen */
  var quoteInView = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      quoteInView = en[0].isIntersecting;
      if (tray) {
        tray.hidden = lines.length === 0 || quoteInView;
        document.body.classList.toggle("has-tray", !tray.hidden);
      }
    }, { threshold: 0.12 }).observe($("#quote"));
  }

  /* delegated click handler for quote toggles and buttons */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-toggle],[data-remove],[data-product]");
    if (!t) return;
    if (t.hasAttribute("data-toggle")) {
      var id = t.getAttribute("data-toggle");
      has(id) ? removeProduct(id) : addProduct(id, false);
    } else if (t.hasAttribute("data-remove")) {
      removeProduct(t.getAttribute("data-remove"));
    } else if (t.hasAttribute("data-quote-btn")) {
      var pid = t.getAttribute("data-product");
      addProduct(pid || "yellow-mustard-oil", true);
    }
  });

  // Quick add flagship shortcut inside empty state
  var quickAddBtn = $("#quickAddFlagship");
  if (quickAddBtn) {
    quickAddBtn.addEventListener("click", function () {
      addProduct("yellow-mustard-oil", true, "10", "Litres", "200L MS/HDPE drums");
    });
  }

  /* add-product dropdown inside the form (grouped by category) */
  (function buildAddSelect() {
    var html = '<option value="">+ Choose a product to add…</option>', groups = {};
    C.products.forEach(function (p) { (groups[p.category] = groups[p.category] || []).push(p); });
    Object.keys(groups).forEach(function (g) {
      html += '<optgroup label="' + esc(g) + '">' + groups[g].map(function (p) { return '<option value="' + p.id + '">' + esc(p.name) + "</option>"; }).join("") + "</optgroup>";
    });
    addSel.innerHTML = html;
  })();

  var addBtn = $("#addBtn");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      if (!addSel.value) {
        linesErr.textContent = "Choose a product from the list first.";
        linesErr.hidden = false;
        addSel.focus();
        return;
      }
      var id = addSel.value;
      addProduct(id, true);
    });
  }

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
      el.className = "pcard" + (has(p.id) ? " is-added" : "");
      
      var visual = p.illus
        ? '<div class="pcard__img pcard__img--illus" style="background:linear-gradient(160deg,' + p.color + '33,' + p.color + '0f)">' + dropSVG(p.color, p.name) + '<span class="pcard__ill">Illustration</span>'
        : '<div class="pcard__img"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy" width="600" height="450">';
      
      el.innerHTML = visual +
        (p.bestseller ? '<span class="pcard__badge">Bestseller</span>' : "") + '</div>' +
        '<div class="pcard__body">' +
          '<span class="pcard__cat">' + esc(p.category) + '</span>' +
          '<h3>' + esc(p.name) + '</h3>' +
          (p.grade ? '<span class="pcard__grade">' + esc(p.grade) + '</span>' : '') +
          '<p>' + esc(p.short) + '</p>' +
          (p.packSummary ? '<div class="pcard__pack">Available in: ' + esc(p.packSummary) + '</div>' : '') +
          '<button type="button" class="btn btn--ghost btn--sm addbtn' + (has(p.id) ? ' is-added' : '') + '" data-toggle="' + p.id + '" aria-pressed="' + has(p.id) + '">' +
            (has(p.id) ? "✓ Added · tap to remove" : "+ Add to quote") +
          '</button>' +
        '</div>';
      grid.appendChild(el);
    });
    refresh(false);
  }
  renderChips(); renderGrid();

  /* =====================================================================
     B2B OIL YIELD & PROCUREMENT PLANNER LOGIC
     ===================================================================== */
  var planSeed = $("#planSeedSelect"), planQty = $("#planQtyInput");
  var planUnit = $("#planUnitSelect"), planMethod = $("#planMethodSelect");
  var resOilL = $("#resOilL"), resOilT = $("#resOilT"), resCakeT = $("#resCakeT");
  var resCakeBags = $("#resCakeBags"), resPack = $("#resPack"), planAddBtn = $("#plannerAddBtn");

  function calculateYield() {
    if (!planSeed || !C.yieldBenchmarks) return;
    var seedKey = planSeed.value;
    var bm = C.yieldBenchmarks[seedKey] || C.yieldBenchmarks["yellow-mustard-seeds"];
    var rawQty = parseFloat(planQty.value) || 0;
    var unit = planUnit.value;
    var isCold = planMethod.value === "cold";

    // Normalize raw quantity to Metric Tonnes (MT)
    var seedTonnes = rawQty;
    if (unit === "Quintals") seedTonnes = rawQty / 10;
    else if (unit === "Kg") seedTonnes = rawQty / 1000;

    // Extraction percentages
    var oilPct = isCold ? bm.coldPressOil : bm.expellerOil;
    var cakePct = bm.cakeRecovery;

    // Outputs
    var oilTonnes = seedTonnes * (oilPct / 100);
    var oilLitres = (oilTonnes * 1000) / bm.oilDensity;
    var cakeTonnes = seedTonnes * (cakePct / 100);
    var cakeBags = Math.round((cakeTonnes * 1000) / 50);

    // Format display
    if (resOilL) resOilL.innerHTML = Math.round(oilLitres).toLocaleString('en-IN') + ' <small>Litres</small>';
    if (resOilT) resOilT.textContent = "(approx. " + oilTonnes.toFixed(2) + " Metric Tonnes)";
    if (resCakeT) resCakeT.innerHTML = cakeTonnes.toFixed(2) + ' <small>Tonnes</small>';
    if (resCakeBags) resCakeBags.textContent = "(approx. " + cakeBags.toLocaleString('en-IN') + " bags of 50kg)";

    // Packaging guidance
    var drums200 = Math.round(oilLitres / 200);
    var tins15 = Math.round(oilLitres / 15);
    var packText = "";
    if (oilLitres >= 15000) {
      var tankers = (oilLitres / 20000).toFixed(1);
      packText = "Suitable for ~" + tankers + " bulk tanker parcel, or ~" + drums200 + " standard 200L drums";
    } else {
      packText = "Equivalent to ~" + drums200 + " drums (200L) or ~" + tins15.toLocaleString('en-IN') + " commercial tins (15L)";
    }
    if (resPack) resPack.textContent = packText;

    return {
      oilId: bm.oilId,
      cakeId: bm.cakeId,
      oilLitres: Math.round(oilLitres),
      cakeTonnes: parseFloat(cakeTonnes.toFixed(2))
    };
  }

  if (planSeed && planQty && planUnit && planMethod) {
    [planSeed, planQty, planUnit, planMethod].forEach(function (el) {
      el.addEventListener("input", calculateYield);
      el.addEventListener("change", calculateYield);
    });
    calculateYield();
  }

  if (planAddBtn) {
    planAddBtn.addEventListener("click", function () {
      var r = calculateYield();
      if (!r) return;
      
      // Add oil product
      addProduct(r.oilId, false, r.oilLitres, "Litres", "Bulk tanker load");
      // Add cake product
      addProduct(r.cakeId, false, r.cakeTonnes, "Tonnes", "Bulk 50kg HDPE bags");

      // Scroll smoothly to quote form
      var q = $("#quote");
      if (q) q.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* =====================================================================
     QUOTE FORM HANDLING & STRUCTURED OUTPUT
     ===================================================================== */
  var form = $("#quoteForm"), done = $("#done");

  function setErr(el, msg) {
    var lab = el.closest("label");
    if (!lab) return;
    var old = lab.querySelector(".err"); if (old) old.remove();
    el.classList.toggle("invalid", !!msg);
    if (msg) {
      var s = document.createElement("span");
      s.className = "err"; s.textContent = msg;
      lab.appendChild(s);
    }
  }

  function validate() {
    var ok = true;
    if (!lines.length) {
      linesErr.textContent = "Please add at least one product to your quote.";
      linesErr.hidden = false;
      ok = false;
    } else {
      linesErr.hidden = true;
    }

    $$("[required]", form).forEach(function (el) {
      var bad = !el.value.trim();
      var msg = bad ? "Required field" : "";
      if (!bad && el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value)) msg = "Enter a valid business email";
      if (!bad && el.type === "tel" && el.value.replace(/\D/g, "").length < 8) msg = "Enter a valid phone number";
      if (!bad && el.type === "number" && !(Number(el.value) > 0)) msg = "Enter a quantity above 0";
      setErr(el, msg);
      if (msg) ok = false;
    });
    return ok;
  }

  function firstProblem() {
    return $(".invalid", form) || (!lines.length ? addSel : null);
  }

  function lineText(l, i) {
    return (i + 1) + ". " + byId(l.id).name + " — " + l.qty + " " + l.unit + " (Packing: " + l.pack + ")";
  }

  function summary() {
    var f = new FormData(form);
    return "*PRIME FRESH OIL MILLS — TRADE QUOTATION REQUEST*\n" +
      "------------------------------------------\n" +
      "*Items Requested (" + lines.length + "):*\n" +
      lines.map(lineText).join("\n") + "\n\n" +
      "*Procurement Details:*\n" +
      "• Order Frequency: " + f.get("ordertype") + "\n" +
      "• Delivery Location: " + (f.get("city") || "-") + "\n" +
      "• Private Label Requirement: " + f.get("pl") + "\n" +
      "• Sample Testing Requested: " + (f.get("sample") ? "Yes (Lab COA required)" : "No") + "\n\n" +
      "*Company & Contact:*\n" +
      "• Company: " + (f.get("company") || "-") + " (" + (f.get("type") || "-") + ")\n" +
      "• Contact Person: " + (f.get("name") || "-") + "\n" +
      "• Phone: " + (f.get("phone") || "-") + "\n" +
      "• Email: " + (f.get("email") || "-") +
      (f.get("msg") ? "\n\n*Special Notes/Specifications:*\n" + f.get("msg") : "");
  }

  form.addEventListener("input", function (e) {
    if (e.target.classList.contains("invalid") && e.target.value) setErr(e.target, "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var first = firstProblem();
      if (first) first.focus();
      return;
    }
    var f = new FormData(form);
    var items = "<ul class='done__items'>" + lines.map(function (l) {
      return "<li><b>" + esc(byId(l.id).name) + "</b><span>" + esc(l.qty + " " + l.unit + " · " + l.pack) + "</span></li>";
    }).join("") + "</ul>";

    var rows = [
      ["Products Staged (" + lines.length + ")", items, true],
      ["Order Frequency", f.get("ordertype")],
      ["Delivery Destination", f.get("city")],
      ["Business Category", f.get("type")],
      ["Private Label", f.get("pl")],
      ["Company / Brand", f.get("company")],
      ["Contact Details", f.get("name") + " (" + f.get("phone") + " · " + f.get("email") + ")"]
    ];
    if (f.get("sample")) rows.push(["Lab QA Samples", "Physical samples requested with batch COA"]);
    if (f.get("msg")) rows.push(["Specifications / Notes", f.get("msg")]);

    $("#doneSum").innerHTML = rows.map(function (r) {
      return "<div><dt>" + esc(r[0]) + "</dt><dd>" + (r[2] ? r[1] : esc(r[1])) + "</dd></div>";
    }).join("");

    $("#doneName").textContent = f.get("name");
    $("#doneWa").href = waLink(summary());

    form.hidden = true;
    done.hidden = false;
    done.focus({ preventScroll: true });
    done.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Copy Summary to Clipboard
  var copyBtn = $("#copySummaryBtn"), copiedMsg = $("#copiedMsg");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = summary();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopied);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showCopied();
      }
    });
  }

  function showCopied() {
    if (copiedMsg) {
      copiedMsg.hidden = false;
      setTimeout(function () { copiedMsg.hidden = true; }, 3500);
    }
  }

  // Print Summary
  var printBtn = $("#printSummaryBtn");
  if (printBtn) {
    printBtn.addEventListener("click", function () { window.print(); });
  }

  $("#doneAgain").addEventListener("click", function () {
    form.reset();
    clearList();
    if (linesErr) linesErr.hidden = true;
    $$(".err", form).forEach(function (n) { if (n.id !== "linesErr") n.remove(); });
    done.hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#waSend").addEventListener("click", function () {
    if (!validate()) {
      var first = firstProblem();
      if (first) first.focus();
      return;
    }
    window.open(waLink(summary()), "_blank", "noopener");
  });

  /* ---------- mobile nav ---------- */
  var burger = $("#burger"), links = $("#navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    $$("#navLinks a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- structured data ---------- */
  var ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": B.name,
    "telephone": B.phone,
    "email": B.email,
    "address": B.address,
    "url": window.location.href
  };
  var ldEl = $("#ld-json");
  if (ldEl) ldEl.textContent = JSON.stringify(ld);

  refresh(false);
})();
