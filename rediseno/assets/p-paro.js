(function(){ var X=window.Calc2026Extra,U=window.UI,$=U.$;
function run(){
  var modo=U.radio("modo"), v=U.num("base",0);
  $("base-l").textContent = modo==="bruto" ? "Sueldo bruto anual (€)" : "Base de cotización mensual media (€)";
  var base = modo==="bruto" ? v/12 : v;
  var o={baseMensual:base,hijos:parseInt($("hijos").value,10),diasCotizados:U.num("dias",0)};
  if(!v){ $("out").hidden=true; return; } $("out").hidden=false;
  var r=X.paro(o);
  if(!r.duracion){ $("o-big").textContent="0 €"; $("o-sub").innerHTML=""; $("t1").innerHTML="";
    $("o-notes").innerHTML=U.notes(["Con menos de 360 días cotizados en los últimos 6 años no se genera prestación contributiva. Puede corresponder un subsidio: consulta al SEPE."]); return; }
  $("o-big").textContent=U.eur.format(r.mensual1);
  $("o-sub").innerHTML="<span>Desde el día 181 <b>"+U.eur.format(r.mensual2)+"</b></span><span>Duración <b>"+r.duracion+" días</b></span><span>Total bruto <b>"+U.eur0.format(r.total)+"</b></span>";
  var rows=[["Base reguladora mensual",U.eur.format(r.baseReguladora)],["Días 1 a "+r.dias1+": 70 %",U.eur.format(r.mensual1)+" /mes"]];
  if(r.dias2) rows.push(["Días 181 a "+r.duracion+": 60 %",U.eur.format(r.mensual2)+" /mes"]);
  rows.push(["Tope mínimo / máximo aplicable",U.eur0.format(r.minimo)+" / "+U.eur0.format(r.maximo)]);
  $("t1").innerHTML=U.ledger("Prestación contributiva (importes brutos)",null,rows,["Total del periodo",U.eur.format(r.total)]);
  $("o-notes").innerHTML=U.notes([r.topadoMax?"Tu prestación llega al tope máximo.":null, r.topadoMin?"Se aplica el tope mínimo.":null,
    "Importes brutos: el SEPE descuenta tu cotización a la Seguridad Social (4,85 % según su tabla de cuantías) y, si procede, la retención de IRPF."]);
}
U.bind("f",run); })();
