/* Motor de cálculo 2026 — salario neto y coste empresa (Régimen General, jornada completa).
   Fuentes: Orden PJC/297/2026 (BOE-A-2026-7296); RD 126/2026 (SMI); RDL 3/2026 (tarifa AT/EP);
   AEAT, Algoritmo de cálculo de retenciones 2026 (versión 10-sept-2026). */
(function (root) {
  "use strict";
  var SS = {
    baseMax: 5101.20,
    baseMin: { "1": 1989.30, "2": 1649.70, "3": 1435.20, "4-7": 1424.40, "8-11": 1424.40 },
    cc: { emp: 23.60, tra: 4.70 },
    desempleo: { indefinido: { emp: 5.50, tra: 1.55 }, temporal: { emp: 6.70, tra: 1.60 } },
    fogasa: { emp: 0.20, tra: 0 },
    fp: { emp: 0.60, tra: 0.10 },
    mei: { emp: 0.75, tra: 0.15 },
    // Cotización adicional de solidaridad (art. 17 Orden PJC/297/2026), tramos mensuales sobre la base máxima
    solidaridad: [
      { hasta: 5611.32, emp: 0.96, tra: 0.19 },
      { hasta: 7651.80, emp: 1.04, tra: 0.21 },
      { hasta: Infinity, emp: 1.22, tra: 0.24 }
    ],
    smiAnual: 17094
  };
  function r2(x) { return Math.round((x + 1e-9) * 100) / 100; }        // REDONDEAR1 (0,005 -> 0,01)
  function trunc2(x) { return Math.floor(x * 100 + 1e-7) / 100; }      // TRUNCAR al 2º decimal

  function cotizaciones(o) {
    var mensual = o.bruto / 12;                       // retribución mensual con prorrata de pagas extra
    var min = SS.baseMin[o.grupo] || 1424.40;
    var base = Math.min(Math.max(mensual, min), SS.baseMax);
    var des = SS.desempleo[o.contrato === "temporal" ? "temporal" : "indefinido"];
    var at = o.atep == null ? 1.50 : o.atep;
    var solE = 0, solT = 0, prev = SS.baseMax;
    if (mensual > SS.baseMax) {
      SS.solidaridad.forEach(function (t) {
        var tramo = Math.max(0, Math.min(mensual, t.hasta) - prev);
        solE += tramo * t.emp / 100; solT += tramo * t.tra / 100; prev = t.hasta;
      });
    }
    function linea(nombre, pct) { return { nombre: nombre, pct: pct, mensual: r2(base * pct / 100), anual: r2(base * pct / 100 * 12) }; }
    var tra = [
      linea("Contingencias comunes", SS.cc.tra),
      linea("Desempleo", des.tra),
      linea("Formación profesional", SS.fp.tra),
      linea("MEI (equidad intergeneracional)", SS.mei.tra)
    ];
    if (solT > 0) tra.push({ nombre: "Cotización adicional de solidaridad", pct: null, mensual: r2(solT), anual: r2(solT * 12) });
    var emp = [
      linea("Contingencias comunes", SS.cc.emp),
      linea("Desempleo", des.emp),
      linea("FOGASA", SS.fogasa.emp),
      linea("Formación profesional", SS.fp.emp),
      linea("MEI (equidad intergeneracional)", SS.mei.emp),
      linea("AT/EP (orientativo)", at)
    ];
    if (solE > 0) emp.push({ nombre: "Cotización adicional de solidaridad", pct: null, mensual: r2(solE), anual: r2(solE * 12) });
    function suma(a) { return r2(a.reduce(function (s, l) { return s + l.anual; }, 0)); }
    return { baseMensual: r2(base), baseTopada: mensual > SS.baseMax, baseMinimaAplicada: mensual < min,
             trabajador: tra, empresa: emp, totalTrabajador: suma(tra), totalEmpresa: suma(emp) };
  }

  var ESCALA = [[0, 0, 19], [12450, 2365.50, 24], [20200, 4225.50, 30], [35200, 8725.50, 37], [60000, 17901.50, 45], [300000, 125901.50, 47]];
  function escala(b) {
    if (b <= 0) return 0;
    for (var i = ESCALA.length - 1; i >= 0; i--) if (b > ESCALA[i][0]) return ESCALA[i][1] + (b - ESCALA[i][0]) * ESCALA[i][2] / 100;
    return 0;
  }
  var LIMEX = { "1": [null, 17644, 18694], "2": [17197, 18130, 19262], "3": [15876, 16342, 16867] };

  // IRPF: algoritmo AEAT 2026 (subconjunto: trabajador activo, sin discapacidad, sin ascendientes,
  // sin movilidad geográfica, sin pensión compensatoria/anualidades, sin préstamo vivienda, residente fuera de Ceuta/Melilla/La Palma)
  function irpf(o) {
    var RETRIB = o.bruto, COT = o.cotizaciones;
    var hijos = o.hijos || 0, hijos3 = Math.min(o.hijosMenores3 || 0, hijos);
    var ent = o.hijosCompartidos ? 0.5 : 1;
    var edad = 2026 - (o.anioNacimiento || 1990);
    var otros = 2000;
    if (RETRIB - COT < 0) otros = 0; else if (otros > RETRIB - COT) otros = RETRIB - COT;
    var RNT = Math.max(0, RETRIB - COT);
    var RED20;
    if (RNT <= 14852) RED20 = 7302;
    else if (RNT <= 17673.52) RED20 = 7302 - 1.75 * (RNT - 14852);
    else if (RNT < 19747.50) RED20 = 2364.34 - 1.14 * (RNT - 17673.52);
    else RED20 = 0;
    RED20 = r2(RED20);
    var RNTREDU = Math.max(0, RNT - otros - RED20);
    var HIJOS = hijos > 2 ? 600 : 0;
    var BASE = RNTREDU > HIJOS ? RNTREDU - HIJOS : 0;
    var MINCON = 5550 + (edad > 64 ? 1150 : 0) + (edad > 74 ? 1400 : 0);
    var MINDESG = 0, imp = [2400, 2700, 4000, 4500];
    for (var i = 0; i < hijos; i++) MINDESG += imp[Math.min(i, 3)] * ent;
    var MINDES3 = 2800 * ent * hijos3;
    var MINPERFA = MINCON + r2(MINDESG) + r2(MINDES3);
    var sit = String(o.situacion || "3");
    if (sit === "1" && hijos === 0) sit = "3";
    var col = Math.min(hijos, 2), lim = LIMEX[sit][col];
    var exento = lim != null && RETRIB <= lim;
    var CUOTA = 0, c1 = 0, c2 = 0;
    if (!exento) {
      c1 = escala(BASE); c2 = escala(MINPERFA);
      CUOTA = c1 > c2 ? c1 - c2 : 0;
      if (RETRIB <= 35200 && lim != null) { var L = (RETRIB - lim) * 0.43; if (CUOTA > L) CUOTA = L; }
    }
    var TIPO = trunc2(Math.max(0, CUOTA) / RETRIB * 100);
    if (o.contratoInferiorAnio && TIPO < 2) TIPO = 2;
    return { rnt: r2(RNT), otrosGastos: otros, red20: RED20, base: r2(BASE), minimo: r2(MINPERFA),
             cuota1: r2(c1), cuota2: r2(c2), cuota: r2(CUOTA), exento: exento, limiteExento: lim,
             tipo: TIPO, importe: r2(RETRIB * TIPO / 100) };
  }

  function calcular(o) {
    var c = cotizaciones(o);
    var i = irpf({ bruto: o.bruto, cotizaciones: c.totalTrabajador, hijos: o.hijos, hijosMenores3: o.hijosMenores3,
                   hijosCompartidos: o.hijosCompartidos, anioNacimiento: o.anioNacimiento, situacion: o.situacion,
                   contratoInferiorAnio: o.contrato === "temporal" && o.inferiorAnio });
    var pagas = o.pagas === 14 ? 14 : 12;
    var netoAnual = r2(o.bruto - c.totalTrabajador - i.importe);
    var brutoPaga = o.bruto / pagas;
    var ssMes = c.totalTrabajador / 12;
    var netoOrdinaria = r2(brutoPaga - ssMes - brutoPaga * i.tipo / 100);
    var netoExtra = pagas === 14 ? r2(brutoPaga - brutoPaga * i.tipo / 100) : null;
    return { ss: c, irpf: i, pagas: pagas, netoAnual: netoAnual, netoOrdinaria: netoOrdinaria, netoExtra: netoExtra,
             costeEmpresaAnual: r2(o.bruto + c.totalEmpresa), costeEmpresaMensual: r2((o.bruto + c.totalEmpresa) / 12),
             bajoSMI: o.bruto < SS.smiAnual };
  }
  var api = { calcular: calcular, cotizaciones: cotizaciones, irpf: irpf, escala: escala, SS: SS };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Calc2026 = api;
})(this);
