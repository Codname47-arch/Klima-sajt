document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("klimeGrid");

  if (!grid) {
    console.error("❌ Ne postoji element #klimeGrid u HTML-u.");
    return;
  }

  // KLIME mora postojati iz klime-data.js
  if (!window.KLIME && typeof KLIME === "undefined") {
    console.error("❌ KLIME nije definisan. Provjeri da li se klime-data.js učitava PRIJE klime-render.js");
    return;
  }

  const data = window.KLIME || KLIME;

  if (!Array.isArray(data) || data.length === 0) {
    console.error("❌ KLIME nije niz ili je prazan:", data);
    return;
  }

  grid.innerHTML = data.slice(0, 4).map((klima) => {
    const naziv = klima.naziv || "Naziv klime";
    const opis = klima.opis || "";
    const cijena = klima.cijena || "";
    const slika = klima.slika || "";
    const popust = klima.popust || "";
    const staraCijena = klima.staraCijena || "";

    return `
      <div class="klima-card">
        ${popust ? `<div class="klima-badge">${popust}</div>` : ""}

        <img src="${slika}" alt="${naziv}">

        <div class="klima-body">
          <div class="klima-title">${naziv}</div>
          ${opis ? `<div class="klima-desc">${opis}</div>` : ""}

          <div>
            ${cijena ? `<span class="klima-price">${cijena}</span>` : ""}
            ${staraCijena ? `<span class="klima-old">${staraCijena}</span>` : ""}
          </div>

          <a class="btn-call" href="tel:+38766813039">Pozovi</a>
        </div>
      </div>
    `;
  }).join("");

  console.log("✅ Top ponuda renderovana:", data.slice(0, 4));
});




