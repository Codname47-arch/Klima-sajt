// js/top-ponuda.js
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("topPonudaGrid");
  if (!grid) return;

  const data = window.KLIME;
  if (!Array.isArray(data)) {
    console.error("❌ KLIME nije učitan. Provjeri da li se data/klime.js učitava prije top-ponuda.js");
    return;
  }

  // Prvih 4 featured:true
  const featured = data.filter(k => k.featured === true).slice(0, 4);

  grid.innerHTML = featured.map(k => {
    const hasDiscount = Boolean(k.popust) && Number.isFinite(Number(k.staraCijena));

    return `
      <article class="klima-card">
        ${hasDiscount ? `<div class="klima-badge">${escapeHtml(k.popust)}</div>` : ""}

        <img src="${escapeHtml(k.slika)}" alt="${escapeHtml(k.naziv)}">

        <div class="klima-body">
          <div class="klima-title">${escapeHtml(k.naziv)}</div>
          <div class="klima-desc">${escapeHtml(k.brand)} • ${escapeHtml(k.btu)} • ${formatNamjena(k.namjena)}</div>

          <div class="price-row">
            <span class="klima-price">${formatCijena(k.cijenaSaUgradnjom)}</span>
            ${hasDiscount ? `<span class="klima-old">${Number(k.staraCijena)} KM</span>` : ""}
          </div>

          <div class="btn-row">
            <a class="btn-call" href="tel:+38766813039">Pozovi</a>
            <a class="btn-upit" href="${upitLink(k.naziv)}" target="_blank" rel="noopener">Pošalji upit</a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // ===== HELPERS =====
  function formatCijena(n) {
    const num = Number(n);
    return Number.isFinite(num) ? `${num} KM sa ugradnjom` : "";
  }

  function formatNamjena(arr) {
    const map = { hladjenje: "Hlađenje", dogrijavanje: "Dogrijavanje", grijanje: "Grijanje" };
    if (!Array.isArray(arr)) return "";
    return arr.map(x => map[x] || x).join(", ");
  }

  function upitLink(naziv) {
    const base =
      "https://docs.google.com/forms/d/e/1FAIpQLSeYhW-w2lr-nJ1a4mb3dOPZGwYKs4FWG1p7E_1m_r0HXNr3_Q/viewform?usp=pp_url";
    const entry = "&entry.772952950=" + encodeURIComponent(naziv);
    return base + entry;
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));
  }
});
