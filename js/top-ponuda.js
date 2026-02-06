// js/top-ponuda.js
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("topPonudaGrid");
  if (!grid) return;

  const data = window.KLIME;
  if (!Array.isArray(data)) {
    console.error("KLIME nije učitan. Provjeri data/klime.js");
    return;
  }

  // prvih 4 featured:true (bez dopunjavanja)
  const featured = data.filter(k => k.featured === true).slice(0, 4);

  grid.innerHTML = featured.map(k => `
    <article class="klima-card">
      <img src="${k.slika}" alt="${k.naziv}">
      <div class="klima-body">
        <div class="klima-title">${k.naziv}</div>
        <div class="klima-desc">${k.brand} • ${k.btu} • ${formatNamjena(k.namjena)}</div>
        <div class="klima-price">${formatCijena(k.cijenaSaUgradnjom)}</div>
        <a class="btn-call" href="tel:+38766813039">Pozovi</a>
      </div>
    </article>
  `).join("");

  function formatCijena(n){
    const num = Number(n);
    if (!Number.isFinite(num)) return "";
    return `${num} KM sa ugradnjom`;
  }

  function formatNamjena(arr){
    const map = { hladjenje:"Hlađenje", dogrijavanje:"Dogrijavanje", grijanje:"Grijanje" };
    if (!Array.isArray(arr)) return "";
    return arr.map(x => map[x] || x).join(", ");
  }
});
