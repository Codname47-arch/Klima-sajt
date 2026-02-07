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

grid.innerHTML = featured.map(k => {
  const hasDiscount = k.popust && k.staraCijena;

  return `
    <article class="klima-card">
      ${hasDiscount ? `<div class="klima-badge">${k.popust}</div>` : ""}

      <img src="${k.slika}" alt="${k.naziv}">

      <div class="klima-body">
        <div class="klima-title">${k.naziv}</div>
        <div class="klima-desc">${k.brand} • ${k.btu} • ${formatNamjena(k.namjena)}</div>

        <div class="price-row">
          <span class="klima-price">${formatCijena(k.cijenaSaUgradnjom)}</span>
          ${hasDiscount ? `<span class="klima-old">${k.staraCijena} KM</span>` : ""}
        </div>

        <a class="btn-call" href="tel:+38766813039">Pozovi</a>
      </div>
    </article>
  `;
}).join("");


  function formatCijena(n){ return `${Number(n)} KM sa ugradnjom`; }
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
