(function(){ var X=window.Calc2026Extra,U=window.UI,$=U.$;
function run(){
  var modo=U.radio("modo"), tipo=parseFloat($("tipo").value), imp=U.num("imp",0);
  $("imp-l").textContent = modo==="quitar" ? "Precio con IVA (€)" : "Precio sin IVA (€)";
  if(!imp){ $("out").hidden=true; return; } $("out").hidden=false;
  var r=X.iva({importe:imp,tipo:tipo,modo:modo});
  $("o-big").textContent=U.eur.format(modo==="quitar"?r.base:r.total);
  $("o-big-l").textContent= modo==="quitar" ? "sin IVA" : "con IVA";
  $("o-sub").innerHTML="<span>Cuota de IVA <b>"+U.eur.format(r.cuota)+"</b></span><span>Tipo <b>"+U.pct(tipo)+"</b></span>";
  $("t1").innerHTML=U.ledger("Desglose",null,[["Base imponible",U.eur.format(r.base)],["IVA "+U.pct(tipo),U.eur.format(r.cuota)]],["Total",U.eur.format(r.total)]);
}
U.bind("f",run); })();
