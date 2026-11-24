(function(){ var X=window.Calc2026Extra,U=window.UI,$=U.$;
function run(){
  var o={alta:$("alta").value,baja:$("baja").value,salarioAnual:U.num("bruto",0),pagas:U.radio("pagas")==="14"?14:12,
    vacacionesAnuales:U.num("vac",30),vacacionesDisfrutadas:U.num("vacd",0),extrasCobradas:Math.round(U.num("extc",0))};
  $("extc-wrap").hidden = o.pagas!==14;
  if(!o.salarioAnual||!o.alta||!o.baja||o.baja<o.alta){ $("out").hidden=true; return; } $("out").hidden=false;
  var r=X.finiquito(o);
  $("o-big").textContent=U.eur.format(r.total);
  $("o-sub").innerHTML="<span>Vacaciones pendientes <b>"+U.n2(r.vacPendientes)+" días</b></span><span>Salario diario <b>"+U.eur.format(r.salarioDiario)+"</b></span>";
  var rows=[["Salario del mes de la baja ("+r.diasTrabMes+" de "+r.diasMes+" días)",U.eur.format(r.salarioMes)],
    ["Vacaciones no disfrutadas ("+U.n2(r.vacPendientes)+" días)",U.eur.format(r.importeVacaciones)]];
  if(o.pagas===14) rows.push(["Parte proporcional de pagas extra",U.eur.format(r.extras)]);
  $("t1").innerHTML=U.ledger("Finiquito bruto",null,rows,["Total bruto",U.eur.format(r.total)]);
  $("o-notes").innerHTML=U.notes([r.vacPendientes<0?"Has disfrutado más vacaciones de las generadas: la empresa puede descontar ese exceso.":null,
    "El finiquito es bruto: sobre él se aplican la retención de IRPF y las cotizaciones del trabajador. Si hay despido, la indemnización va aparte (ver la calculadora de despido)."]);
}
U.bind("f",run); })();
