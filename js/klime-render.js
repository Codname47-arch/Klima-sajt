const grid = document.getElementById("klimeGrid");

if (grid && Array.isArray(KLIME)) {
  grid.innerHTML = KLIME.slice(0,4).map(klima => `
    <div class="klima-card">
      <img src="${klima.slika}" alt="${klima.naziv}">
      <div class="klima-body">
        <div class="klima-title">${klima.naziv}</div>
        <div class="klima-desc">${klima.opis}</div>
        <div class="klima-price">${klima.cijena}</div>
        <a class="btn-call" href="tel:+38766813039">Pozovi</a>
      </div>
    </div>
  `).join("");
}

