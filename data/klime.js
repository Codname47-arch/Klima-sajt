// data/klime.js
window.KLIME = [

  /* ================= TESLA ================= */

  {
    id: "tesla-9",
    naziv: "Tesla Inverter 9",
    brand: "Tesla",
    btu: "9k",
    namjena: ["hladjenje", "dogrijavanje"],
    cijenaSaUgradnjom: 690,
    staraCijena: null,      // ⬅️ NEMA POPUSTA
    popust: null,
    popularnost: 78,
    featured: false,
    slika: "img/tesla9.jpg"
  },

  {
    id: "tesla-12",
    naziv: "Tesla Inverter 12",
    brand: "Tesla",
    btu: "12k",
    namjena: ["hladjenje", "dogrijavanje", "grijanje"],
    cijenaSaUgradnjom: 750,
    staraCijena: 820,       // ⬅️ POPUST AKTIVAN
    popust: "-9%",
    popularnost: 95,
    featured: true,         // ⬅️ ULAZI U TOP PONUDU
    slika: "img/tesla12.jpg"
  },

  {
    id: "tesla-18",
    naziv: "Tesla Inverter 18",
    brand: "Tesla",
    btu: "18k",
    namjena: ["hladjenje", "grijanje"],
    cijenaSaUgradnjom: 1050,
    staraCijena: null,
    popust: null,
    popularnost: 88,
    featured: true,
    slika: "img/tesla18.jpg"
  },

  {
    id: "tesla-24",
    naziv: "Tesla Inverter 24",
    brand: "Tesla",
    btu: "24k",
    namjena: ["hladjenje", "grijanje"],
    cijenaSaUgradnjom: 1350,
    staraCijena: 1480,      // ⬅️ POPUST
    popust: "-8%",
    popularnost: 82,
    featured: false,
    slika: "img/tesla24.jpg"
  },

  /* ================= VIVAX ================= */

  {
    id: "vivax-12",
    naziv: "Vivax Inverter 12",
    brand: "Vivax",
    btu: "12k",
    namjena: ["hladjenje", "grijanje"],
    cijenaSaUgradnjom: 820,
    staraCijena: null,
    popust: null,
    popularnost: 84,
    featured: false,
    slika: "img/vivax12.jpg"
  },

  {
    id: "vivax-18",
    naziv: "Vivax Inverter 18",
    brand: "Vivax",
    btu: "18k",
    namjena: ["hladjenje", "grijanje"],
    cijenaSaUgradnjom: 1150,
    staraCijena: 1250,      // ⬅️ POPUST
    popust: "-8%",
    popularnost: 91,
    featured: true,         // ⬅️ TOP PONUDA
    slika: "img/vivax18.jpg"
  },

  /* ================= HAIER ================= */

  {
    id: "haier-9",
    naziv: "Haier Inverter 9",
    brand: "Haier",
    btu: "9k",
    namjena: ["hladjenje"],
    cijenaSaUgradnjom: 760,
    staraCijena: null,
    popust: null,
    popularnost: 72,
    featured: false,
    slika: "img/haier9.jpg"
  },

  {
    id: "haier-12",
    naziv: "Haier Inverter 12",
    brand: "Haier",
    btu: "12k",
    namjena: ["hladjenje", "grijanje"],
    cijenaSaUgradnjom: 890,
    staraCijena: 950,       // ⬅️ POPUST
    popust: "-6%",
    popularnost: 86,
    featured: false,
    slika: "img/haier12.jpg"
  }

];
