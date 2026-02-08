// js/klime-page.js
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("allKlimeGrid");
  const chipsWrap = document.getElementById("activeChips");

  const selBtu = document.getElementById("filterBtu");
  const selBrand = document.getElementById("filterBrand");
  const selNamjena = document.getElementById("filterNamjena");
  const selSort = document.getElementById("sortBy");
  const btnClear = document.getElementById("clearFilters");

  const data = window.KLIME;

  if (!grid || !chipsWrap || !selBtu || !selBrand || !selNamjena || !selSort || !btnClear) {
    console.error("❌ Nedostaje neki element na klime.html (provjeri ID-jeve).");
    return;
  }
  if (!Array.isArray(data)) {
    console.error("❌ KLIME nije učitan. Provjeri data/klime.js");
    return;
  }

  // brendovi
  const brands = Array.from(new Set(data.map(x => x.brand).filter(Boolean))).sort();
  selBrand.innerHTML = `<option value="">Svi</option>` + brands.map(b => `<option value="${esc(b)}">${esc(b)}</option>`).join("");

  const state = { btu:"", brand:"", namjena:"", sort:"popularnost" };

  [selBtu, selBrand, selNamjena, selSort].forEach(el => {
    el.addEventListener("change", () => { sync(); render(); });
  });

  btnClear.addEventListener("click", () => {
    state.btu = ""; state.brand = ""; state.namjena = ""; state.sort = "popularnost";
    selBtu.value = ""; selBrand.value = ""; selNamjena.value = ""; selSort.value = "popularnost";
    render();
  });

  chipsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-chip]");
    if (!btn) return;
    const key = btn.dataset.chip;
    state[key] = "";
    if (key === "btu") selBtu.value = "";
    if (key === "brand") selBrand.value = "";
    if (key === "namjena") selNamjena.value = "";
    render();
  });

  function sync(){
    state.btu = selBtu.value;
    state.brand = selBrand.value;
    state.namjena = selNamjena.value;
    state.sort = selSort.value;
  }

  function render(){
    chipsWrap.innerHTML = makeChips(state);

    let out = data.slice();
    if (state.btu) out = out.filter(x => x.btu === state.btu);
    if (state.brand) out = out.filter(x => x.brand === state.brand);
    if (state.namjena) out = out.filter(x => Array.isArray(x.namjena) && x.namjena.includes(state.namjena));

    if (state.sort === "popularnost") out.sort((a,b) => (b.popularnost||0) - (a.popularnost||0));
    if (state.sort === "cijenaAsc") out.sort((a,b) => (a.cijenaSaUgradnjom||0) - (b.cijenaSaUgradnjom||0));
    if (state.sort === "cijenaDesc") out.sort((a,b) => (b.cijenaSaUgradnjom||0) - (a.cijenaSaUgradnjom||0));

    grid.innerHTML = out.map(k => cardHTML(k)).join("") || emptyHTML();
  }

  function cardHTML(k){
    const hasDiscount = Boolean(k.popust) && Number.isFinite(Number(k.staraCijena));

    return `
      <article class="klima-card">
        ${hasDiscount ? `<div class="klima-badge">${esc(k.popust)}</div>` : ""}

        <img src="${esc(k.slika)}" alt="${esc(k.naziv)}">

        <div class="klima-body">
          <div class="klima-title">${esc(k.naziv)}</div>
          <div class="klima-desc">${esc(k.brand)} • ${esc(k.btu)} • ${formatNamjena(k.namjena)}</div>

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
  }

  function emptyHTML(){
    return `
      <div class="empty">
        <div class="empty-title">Nema rezultata</div>
        <div class="empty-sub">Ukloni neki filter ili klikni “Očisti filtere”.</div>
      </div>
    `;
  }

  function makeChips(s){
    const chips = [];
    if (s.btu) chips.push(chip("btu", s.btu));
    if (s.brand) chips.push(chip("brand", s.brand));
    if (s.namjena) chips.push(chip("namjena", mapNamjena(s.namjena)));
    return chips.join("");
  }

  function chip(key, label){
    return `<button class="chip" type="button" data-chip="${key}">${esc(label)} <span class="x">×</span></button>`;
  }

  function formatCijena(n){
    const num = Number(n);
    return Number.isFinite(num) ? `${num} KM sa ugradnjom` : "";
  }

  function mapNamjena(x){
    const map = { hladjenje:"Hlađenje", dogrijavanje:"Dogrijavanje", grijanje:"Grijanje" };
    return map[x] || x;
  }

  function formatNamjena(arr){
    if (!Array.isArray(arr)) return "";
    return arr.map(mapNamjena).join(", ");
  }

  function upitLink(naziv){
    const base = "https://docs.google.com/forms/d/e/1FAIpQLSeYhW-w2lr-nJ1a4mb3dOPZGwYKs4FWG1p7E_1m_r0HXNr3_Q/viewform?usp=pp_url";
    const entry = "&entry.772952950=" + encodeURIComponent(naziv);
    return base + entry;
  }

  function esc(str){
    return String(str ?? "").replace(/[&<>"']/g, (m) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

  // init
  sync();
  render();
});
