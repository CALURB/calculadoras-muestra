/* Motor 2026 (II): IVA, factura de autónomo, finiquito, despido, paro, cuota de autónomos y neto→bruto.
   Fuentes en cada página. Uso en navegador (window.Calc2026Extra) y Node (require). */
(function (root) {
  "use strict";
  var C = (typeof module !== "undefined" && module.exports) ? require("./calc.js") : root.Calc2026;
  function r2(x) { return Math.round((x + 1e-9) * 100) / 100; }

  // ---------- IVA (Ley 37/1992, arts. 90 y 91) ----------
  function iva(o) {
    var t = o.tipo / 100, base, cuota, total;
    if (o.modo === "quitar") { total = o.importe; base = r2(total / (1 + t)); cuota = r2(total - base); }
    else { base = o.importe; cuota = r2(base * t); total = r2(base + cuota); }
    return { base: r2(base), cuota: cuota, total: r2(total) };
  }

  // ---------- Factura de autónomo (IVA + retención IRPF, art. 101.5 LIRPF y art. 95 RIRPF) ----------
  function factura(o) {
    var base = o.base, cuotaIva = r2(base * o.iva / 100), ret = r2(base * o.retencion / 100);
    var re = o.recargo ? r2(base * ({ 21: 5.2, 10: 1.4, 4: 0.5 }[o.iva] || 0) / 100) : 0;
    return { base: r2(base), cuotaIva: cuotaIva, recargo: re, retencion: ret, total: r2(base + cuotaIva + re - ret),
             aHacienda: r2(cuotaIva + re + ret), ingresoReal: r2(base) };
  }
  // A partir del total que quieres cobrar, la base necesaria
  function facturaDesdeTotal(o) {
    var k = 1 + o.iva / 100 + (o.recargo ? ({ 21: 5.2, 10: 1.4, 4: 0.5 }[o.iva] || 0) / 100 : 0) - o.retencion / 100;
    return factura({ base: r2(o.total / k), iva: o.iva, retencion: o.retencion, recargo: o.recargo });
  }

  // ---------- Fechas ----------
  function d(s) { var p = s.split("-").map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2])); }
  function diasEntre(a, b) { return Math.round((d(b) - d(a)) / 86400000) + 1; } // ambos incluidos
  function bisiesto(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  // Meses a efectos indemnizatorios (CGPJ, guía v0.6 jul. 2026): toda fracción de mes cuenta como mes completo
  function mesesCGPJ(a, b) {
    var A = d(a), B = d(b);
    var m = (B.getUTCFullYear() - A.getUTCFullYear()) * 12 + (B.getUTCMonth() - A.getUTCMonth());
    if (B.getUTCDate() >= A.getUTCDate()) m += 1;
    return Math.max(0, m);
  }
  function ymd(dt) { return dt.toISOString().slice(0, 10); }

  // ---------- Despido (arts. 49.1.c, 53.1.b y 56.1 ET; DT 11ª ET; criterios CGPJ) ----------
  function despido(o) {
    var fin = d(o.baja), diasAnio = bisiesto(fin.getUTCFullYear()) ? 366 : 365;
    var sd = o.salarioAnual / diasAnio;
    var res = { salarioDiario: r2(sd), diasTrabajados: diasEntre(o.alta, o.baja), tope: false };
    var corte = "2012-02-12";
    if (o.tipo === "improcedente") {
      if (o.alta < corte) {
        var m1 = mesesCGPJ(o.alta, "2012-02-11"), m2 = o.baja >= corte ? mesesCGPJ(corte, o.baja) : 0;
        var d1 = m1 * 3.75, d2 = m2 * 2.75, dias;
        if (d1 > 720) { dias = Math.min(d1, 1260); res.tope = d1 + d2 > dias; }
        else { dias = Math.min(d1 + d2, 720); res.tope = d1 + d2 > 720; }
        res.meses1 = m1; res.meses2 = m2; res.dias1 = r2(d1); res.dias2 = r2(d2); res.dias = r2(dias);
      } else {
        var m = mesesCGPJ(o.alta, o.baja), dd = m * 2.75;
        res.meses2 = m; res.dias = r2(Math.min(dd, 720)); res.tope = dd > 720;
      }
    } else if (o.tipo === "objetivo") {
      var mo = mesesCGPJ(o.alta, o.baja), dob = mo * 20 / 12;
      res.meses2 = mo; res.dias = r2(Math.min(dob, 360)); res.tope = dob > 360;
    } else { // fin de contrato temporal: días reales × (8..12)/365 según fecha del contrato (DT 8ª ET)
      var y = d(o.alta).getUTCFullYear(), k = y <= 2011 ? 8 : y === 2012 ? 9 : y === 2013 ? 10 : y === 2014 ? 11 : 12;
      res.diasPorAnio = k; res.dias = r2(res.diasTrabajados * k / 365);
    }
    res.importe = r2(res.dias * sd);
    return res;
  }

  // ---------- Finiquito (arts. 26, 31 y 38 ET) ----------
  function finiquito(o) {
    var B = d(o.baja), y = B.getUTCFullYear(), diasAnio = bisiesto(y) ? 366 : 365;
    var inicioAnio = y + "-01-01", desde = o.alta > inicioAnio ? o.alta : inicioAnio;
    var pagas = o.pagas === 14 ? 14 : 12;
    var mensual = o.salarioAnual / pagas;                      // paga ordinaria
    var diasMes = new Date(Date.UTC(y, B.getUTCMonth() + 1, 0)).getUTCDate();
    var inicioMes = ymd(new Date(Date.UTC(y, B.getUTCMonth(), 1)));
    var diasTrabMes = diasEntre(o.alta > inicioMes ? o.alta : inicioMes, o.baja);
    var salarioMes = r2(mensual / diasMes * diasTrabMes);
    var diasAnioTrab = diasEntre(desde, o.baja);
    var vacDevengadas = o.vacacionesAnuales * diasAnioTrab / diasAnio;
    var vacPend = vacDevengadas - (o.vacacionesDisfrutadas || 0);
    var sd = o.salarioAnual / diasAnio;
    var importeVac = r2(vacPend * sd);
    var extras = 0;
    if (pagas === 14) {
      var devengado = 2 * (o.salarioAnual / 14) * diasAnioTrab / diasAnio;
      extras = r2(Math.max(0, devengado - (o.extrasCobradas || 0) * (o.salarioAnual / 14)));
    }
    var total = r2(salarioMes + importeVac + extras);
    return { salarioMes: salarioMes, diasTrabMes: diasTrabMes, diasMes: diasMes, vacDevengadas: r2(vacDevengadas),
             vacPendientes: r2(vacPend), importeVacaciones: importeVac, extras: extras, total: total, salarioDiario: r2(sd) };
  }

  // ---------- Prestación por desempleo (arts. 269 y 270 LGSS; cuantías SEPE 2026) ----------
  var DURACION = [[2160, 720], [1980, 660], [1800, 600], [1620, 540], [1440, 480], [1260, 420], [1080, 360], [900, 300], [720, 240], [540, 180], [360, 120]];
  function paro(o) {
    var br = Math.min(o.baseMensual, 5101.20);
    var hijos = o.hijos || 0;
    var min = hijos > 0 ? 749 : 560, max = hijos === 0 ? 1225 : hijos === 1 ? 1400 : 1575;
    var dur = 0;
    for (var i = 0; i < DURACION.length; i++) if (o.diasCotizados >= DURACION[i][0]) { dur = DURACION[i][1]; break; }
    function clamp(x) { return Math.min(Math.max(x, min), max); }
    var p1 = r2(clamp(br * 0.70)), p2 = r2(clamp(br * 0.60));
    var d1 = Math.min(dur, 180), d2 = Math.max(0, dur - 180);
    var total = r2(p1 * d1 / 30 + p2 * d2 / 30);
    return { baseReguladora: r2(br), duracion: dur, mensual1: p1, mensual2: p2, dias1: d1, dias2: d2, total: total,
             minimo: min, maximo: max, topadoMax: br * 0.70 > max, topadoMin: br * 0.60 < min };
  }

  // ---------- Cuota de autónomos 2026 (art. 18 Orden PJC/297/2026) ----------
  var RETA = [
    { t: "Reducida 1", hasta: 670, min: 653.59, max: 718.94 }, { t: "Reducida 2", hasta: 900, min: 718.95, max: 900 },
    { t: "Reducida 3", hasta: 1166.70, min: 849.67, max: 1166.70, excl: true },
    { t: "General 1", hasta: 1300, min: 950.98, max: 1300 }, { t: "General 2", hasta: 1500, min: 960.78, max: 1500 },
    { t: "General 3", hasta: 1700, min: 960.78, max: 1700 }, { t: "General 4", hasta: 1850, min: 1143.79, max: 1850 },
    { t: "General 5", hasta: 2030, min: 1209.15, max: 2030 }, { t: "General 6", hasta: 2330, min: 1274.51, max: 2330 },
    { t: "General 7", hasta: 2760, min: 1356.21, max: 2760 }, { t: "General 8", hasta: 3190, min: 1437.91, max: 3190 },
    { t: "General 9", hasta: 3620, min: 1519.61, max: 3620 }, { t: "General 10", hasta: 4050, min: 1601.31, max: 4050 },
    { t: "General 11", hasta: 6000, min: 1732.03, max: 5101.20 }, { t: "General 12", hasta: Infinity, min: 1928.10, max: 5101.20 }
  ];
  var TIPO_RETA = { cc: 28.30, atep: 1.30, cese: 0.90, fp: 0.10, mei: 0.90 }; // total 31,50 %
  function autonomos(o) {
    var ded = o.societario ? 0.03 : 0.07;
    var mensual = (o.rendimientoAnual * (1 - ded)) / 12;
    var tr = RETA[RETA.length - 1];
    for (var i = 0; i < RETA.length; i++) {
      var R = RETA[i];
      if (R.excl ? mensual < R.hasta : mensual <= R.hasta) { tr = R; break; }
    }
    var tipo = TIPO_RETA.cc + TIPO_RETA.atep + TIPO_RETA.cese + TIPO_RETA.fp + TIPO_RETA.mei;
    var base = o.base ? Math.min(Math.max(o.base, tr.min), tr.max) : tr.min;
    function desglose(b) { return { cc: r2(b * TIPO_RETA.cc / 100), atep: r2(b * TIPO_RETA.atep / 100), cese: r2(b * TIPO_RETA.cese / 100), fp: r2(b * TIPO_RETA.fp / 100), mei: r2(b * TIPO_RETA.mei / 100) }; }
    return { rendimientoMensual: r2(mensual), deduccion: ded * 100, tramo: tr.t, baseMin: tr.min, baseMax: tr.max, base: r2(base), tipo: tipo,
             cuota: r2(base * tipo / 100), cuotaMin: r2(tr.min * tipo / 100), cuotaMax: r2(tr.max * tipo / 100), desglose: desglose(base),
             anual: r2(base * tipo / 100 * 12) };
  }

  // ---------- Del neto al bruto (inversión numérica del motor de sueldo neto) ----------
  function netoABruto(o) {
    var lo = 0, hi = 1000000, r = null;
    var key = o.netoOrdinaria != null ? "netoOrdinaria" : "netoAnual", target = o[key];
    for (var i = 0; i < 80; i++) {
      var mid = (lo + hi) / 2, p = Object.assign({}, o, { bruto: mid }); r = C.calcular(p);
      if (r[key] < target) lo = mid; else hi = mid;
    }
    var bruto = Math.ceil(hi * 100) / 100, res = C.calcular(Object.assign({}, o, { bruto: bruto }));
    return { bruto: bruto, detalle: res };
  }

  var api = { iva: iva, factura: factura, facturaDesdeTotal: facturaDesdeTotal, despido: despido, mesesCGPJ: mesesCGPJ,
              finiquito: finiquito, paro: paro, autonomos: autonomos, RETA: RETA, TIPO_RETA: TIPO_RETA, netoABruto: netoABruto };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Calc2026Extra = api;
})(this);
