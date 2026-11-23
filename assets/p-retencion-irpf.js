(function(){ var C=window.Calc2026,U=window.UI,$=U.$;
function run(){
  var hijos=Math.round(U.num("n-hijos",0)), h3=Math.min(Math.round(U.num("n-hijos3",0)),hijos), contrato=$("n-contrato").value;
  $("n-inf-wrap").hidden = contrato!=="temporal";
  var o={bruto:U.num("n-bruto",0),pagas:12,grupo:$("n-grupo").value,contrato:contrato,inferiorAnio:contrato==="temporal"&&$("n-inf").checked,
    situacion:$("n-sit").value,hijos:hijos,hijosMenores3:h3,hijosCompartidos:$("n-comp").checked,anioNacimiento:Math.round(U.num("n-nac",1990))};
  if(!o.bruto){ $("out").hidden=true; return; } $("out").hidden=false;
  var r=C.calcular(o), i=r.irpf;
  $("o-big").textContent=U.pct(i.tipo);
  $("o-sub").innerHTML="<span>Retención anual <b>"+U.eur.format(i.importe)+"</b></span><span>Al mes (12 pagas) <b>"+U.eur.format(i.importe/12)+"</b></span><span>Cotizaciones que restan <b>"+U.eur.format(r.ss.totalTrabajador)+"</b></span>";
  $("o-notes").innerHTML=U.notes([i.exento?"+Por debajo del límite exento ("+U.eur0.format(i.limiteExento)+") no hay retención.":null,
    (o.inferiorAnio&&i.tipo===2)?"Contratos de menos de un año: se aplica el tipo mínimo del 2 %.":null]);
  $("t1").innerHTML=U.ledger("Paso a paso (algoritmo AEAT 2026, versión 10/09/2026)",null,[
    ["Retribución anual",U.eur.format(o.bruto)],["Cotizaciones del trabajador","− "+U.eur.format(r.ss.totalTrabajador)],
    ["Otros gastos deducibles","− "+U.eur.format(i.otrosGastos)],["Reducción por rendimientos del trabajo","− "+U.eur.format(i.red20)],
    ["Base para calcular el tipo",U.eur.format(i.base)],["Cuota sobre la base (escala)",U.eur.format(i.cuota1)],
    ["Mínimo personal y familiar",U.eur.format(i.minimo)],["Cuota sobre el mínimo (escala)","− "+U.eur.format(i.cuota2)],
    ["Cuota de retención",U.eur.format(i.cuota)],["Tipo (cuota ÷ retribución, truncado)",U.pct(i.tipo)]]);
}
U.bind("f",run); })();
