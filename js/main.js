(function () {
  "use strict";
  var cfg = window.KOB_CONFIG || {};
  var doc = document.documentElement;
  doc.classList.add("js");

  /* ---------- header + mobile nav ---------- */
  var header = document.querySelector(".site-header");
  var nav = document.getElementById("main-nav");
  var toggle = document.querySelector(".nav-toggle");

  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false); });

  /* ---------- active nav link ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (l) { var s = document.querySelector(l.getAttribute("href")); if (s) spy.observe(s); });
  }

  /* ---------- countdown ---------- */
  var cd = document.getElementById("countdown");
  var target = new Date(cfg.raceStart || "2027-03-19T08:00:00Z").getTime();
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function tick() {
    var diff = Math.max(0, target - Date.now());
    var d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
    cd.querySelector('[data-cd="d"]').textContent = d;
    cd.querySelector('[data-cd="h"]').textContent = pad(h);
    cd.querySelector('[data-cd="m"]').textContent = pad(m);
    cd.querySelector('[data-cd="s"]').textContent = pad(s);
  }
  if (cd) { tick(); setInterval(tick, 1000); }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (en.isIntersecting) {
          en.target.style.transitionDelay = (i % 4) * 80 + "ms";
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- hero parallax ---------- */
  var heroImg = document.querySelector(".hero-media img");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroImg && !reduce) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) heroImg.style.translate = "0 " + (y * 0.25) + "px";
    }, { passive: true });
  }

  /* ---------- gallery (local or Supabase) ---------- */
  var grid = document.getElementById("gallery-grid");
  var photos = [];

  function renderGallery(list) {
    photos = list;
    grid.innerHTML = "";
    list.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Open photo: " + (p.alt || "King of Britain"));
      if (p.size) b.className = p.size;
      var img = document.createElement("img");
      img.src = p.src; img.alt = p.alt || "King of Britain"; img.loading = "lazy"; img.decoding = "async";
      b.appendChild(img);
      b.addEventListener("click", function () { openLightbox(i); });
      grid.appendChild(b);
    });
  }

  function loadSupabase(sb) {
    var folder = sb.folder ? sb.folder.replace(/\/$/, "") + "/" : "";
    return fetch(sb.url.replace(/\/$/, "") + "/storage/v1/object/list/" + encodeURIComponent(sb.bucket), {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": sb.anonKey, "Authorization": "Bearer " + sb.anonKey },
      body: JSON.stringify({ prefix: folder, limit: 200, sortBy: { column: "name", order: "asc" } })
    })
      .then(function (r) { if (!r.ok) throw new Error("Supabase " + r.status); return r.json(); })
      .then(function (files) {
        var sizes = ["wide", "", "tall", "", "", "wide", "", ""];
        return files
          .filter(function (f) { return /\.(jpe?g|png|webp|avif)$/i.test(f.name); })
          .map(function (f, i) {
            return {
              src: sb.url.replace(/\/$/, "") + "/storage/v1/object/public/" + sb.bucket + "/" + folder + encodeURIComponent(f.name),
              alt: "King of Britain photo",
              size: sizes[i % sizes.length]
            };
          });
      });
  }

  if (grid) {
    var sb = cfg.supabase || {};
    if (sb.url && sb.anonKey && sb.bucket) {
      loadSupabase(sb)
        .then(function (list) { renderGallery(list.length ? list : cfg.localGallery || []); })
        .catch(function () { renderGallery(cfg.localGallery || []); });
    } else {
      renderGallery(cfg.localGallery || []);
    }
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = lb && lb.querySelector("img");
  var current = 0;
  function show(i) {
    current = (i + photos.length) % photos.length;
    lbImg.src = photos[current].src;
    lbImg.alt = photos[current].alt || "";
  }
  function openLightbox(i) {
    if (!lb || typeof lb.showModal !== "function") { window.open(photos[i].src, "_blank"); return; }
    show(i); lb.showModal();
  }
  if (lb) {
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
    var sx = null;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------- contact form ---------- */
  var form = document.getElementById("contact-form");
  var topic = document.getElementById("topic");
  var status = document.getElementById("form-status");
  var entryOnly = form && form.querySelector(".entry-only");

  function syncTopic() { if (entryOnly) entryOnly.hidden = topic.value !== "Race entry"; }
  if (topic) { topic.addEventListener("change", syncTopic); syncTopic(); }

  // Buttons with data-topic preselect the form topic
  document.querySelectorAll("[data-topic]").forEach(function (a) {
    a.addEventListener("click", function () {
      var t = a.getAttribute("data-topic");
      for (var i = 0; i < topic.options.length; i++) {
        if (topic.options[i].text === t) { topic.selectedIndex = i; break; }
      }
      syncTopic();
    });
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status"; status.textContent = "";
      var ok = true;
      ["name", "email", "message"].forEach(function (n) {
        var el = form.elements[n];
        var bad = !el.value.trim() || (n === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
        el.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      if (!form.elements.consent.checked) ok = false;
      if (!ok) {
        status.className = "form-status err";
        status.textContent = "Please fill in your name, a valid email, a message and tick the consent box.";
        return;
      }

      var data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        topic: topic.value,
        vehicle: topic.value === "Race entry" ? form.elements.vehicle.value.trim() : "",
        message: form.elements.message.value.trim()
      };

      if (cfg.formEndpoint) {
        var btn = form.querySelector("button[type=submit]");
        btn.disabled = true;
        fetch(cfg.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
          .then(function (r) {
            if (!r.ok) throw new Error();
            form.reset(); syncTopic();
            status.className = "form-status ok";
            status.textContent = "Thanks! Your message has been sent. We'll get back to you soon.";
          })
          .catch(function () {
            status.className = "form-status err";
            status.textContent = "Sorry, sending failed. Please email " + cfg.contactEmail + " directly.";
          })
          .then(function () { btn.disabled = false; });
        return;
      }

      // Fallback: open the visitor's email app with the message filled in
      var body = "Name: " + data.name + "\nEmail: " + data.email +
        (data.phone ? "\nPhone: " + data.phone : "") +
        (data.vehicle ? "\nClass & vehicle: " + data.vehicle : "") +
        "\n\n" + data.message;
      window.location.href = "mailto:" + (cfg.contactEmail || "") +
        "?subject=" + encodeURIComponent("King of Britain 2027 · " + data.topic) +
        "&body=" + encodeURIComponent(body);
      status.className = "form-status ok";
      status.textContent = "Your email app should open with the message ready. Just press send.";
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
