const grid = document.getElementById("klimeGrid");

if (grid && Array.isArray(KLIME)) {
  grid.innerHTML = KLIME.slice(0, 4).map(klima => `
    <div class="klima-card">
      ${klima.popust ? `<div class="klima-badge">${klima.popust}</div>` : ""}

      <img src="${klima.slika}" alt="${klima.naziv}">

      <div class="klima-body">
        <div class="klima-title">${klima.naziv}</div>
        <div class="klima-desc">${klima.opis}</div>

        <div>
          <span class="klima-price">${klima.cijena}</span>
          ${klima.staraCijena ? `<span class="klima-old">${klima.staraCijena}</span>` : ""}
        </div>

        <a class="btn-call" href="tel:+38766813039">Pozovi</a>
      </div>
    </div>
  `).join("");
}


