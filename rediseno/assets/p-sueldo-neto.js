(function(){ var C=window.Calc2026,U=window.UI,$=U.$;
function run(){
  var hijos=Math.round(U.num("n-hijos",0)), h3=Math.min(Math.round(U.num("n-hijos3",0)),hijos), contrato=$("n-contrato").value;
  $("n-inf-wrap").hidden = contrato!=="temporal";
  var sit=$("n-sit").value;
  var o={bruto:U.num("n-bruto",0),pagas:U.radio("n-pagas")==="14"?14:12,grupo:$("n-grupo").value,contrato:contrato,inferiorAnio:contrato==="temporal"&&$("n-inf").checked,
    situacion:sit,hijos:hijos,hijosMenores3:h3,hijosCompartidos:$("n-comp").checked,anioNacimiento:Math.round(U.num("n-nac",1990))};
  if(!o.bruto){ $("out").hidden=true; return; } $("out").hidden=false;
  var r=C.calcular(o);
  $("o-big").textContent=U.eur.format(r.netoOrdinaria);
  $("o-big-l").textContent= r.pagas===14 ? "netos al mes (12 nóminas ordinarias)" : "netos al mes (12 pagas)";
  var sub="<span>Neto anual <b>"+U.eur0.format(r.netoAnual)+"</b></span><span>Retención IRPF <b>"+U.pct(r.irpf.tipo)+"</b></span>";
  if(r.netoExtra!=null) sub+="<span>Cada paga extra <b>"+U.eur.format(r.netoExtra)+"</b></span>";
  $("o-sub").innerHTML=sub;
  U.split("o-split",o.bruto,[["neto para ti",r.netoAnual,"neto"],["Seguridad Social",r.ss.totalTrabajador,"ss"],["retención IRPF",r.irpf.importe,"irpf"]]);
  $("o-notes").innerHTML=U.notes([
    r.bajoSMI?"El bruto indicado está por debajo del SMI de 2026 (17.094 € al año a jornada completa). Esta herramienta solo calcula jornada completa.":(r.ss.baseMinimaAplicada?"Tu sueldo prorrateado está por debajo de la base mínima de tu grupo: se cotiza por "+U.eur.format(r.ss.baseMensual)+" al mes.":null),
    r.ss.baseTopada?"Superas la base máxima: se cotiza por 5.101,20 € al mes y se añade la cotización adicional de solidaridad.":null,
    (sit==="1"&&hijos===0)?"La situación monoparental exige al menos un hijo; se calcula como «otras situaciones».":null,
    r.irpf.exento?"+Por tu sueldo y situación familiar no corresponde retención de IRPF (límite exento: "+U.eur0.format(r.irpf.limiteExento)+").":null]);
  var rows=[["Sueldo bruto","",U.eur.format(o.bruto/12),U.eur.format(o.bruto)]];
  r.ss.trabajador.forEach(function(l){ rows.push([l.nombre,U.pct(l.pct),"− "+U.eur.format(l.mensual),"− "+U.eur.format(l.anual)]); });
  rows.push(["Retención IRPF",U.pct(r.irpf.tipo),"− "+U.eur.format(r.irpf.importe/12),"− "+U.eur.format(r.irpf.importe)]);
  $("t1").innerHTML=U.ledger("De bruto a neto (prorrateado en 12 meses)",["Concepto","Tipo","Al mes","Al año"],rows,["Neto","",U.eur.format(r.netoAnual/12),U.eur.format(r.netoAnual)]);
  var i=r.irpf;
  $("t2").innerHTML=U.ledger("Detalle de la retención (algoritmo AEAT 2026)",null,[
    ["Rendimiento neto (bruto − cotizaciones)",U.eur.format(i.rnt)],["Otros gastos deducibles","− "+U.eur.format(i.otrosGastos)],
    ["Reducción por rendimientos del trabajo","− "+U.eur.format(i.red20)],["Base para calcular el tipo",U.eur.format(i.base)],
    ["Mínimo personal y familiar",U.eur.format(i.minimo)],["Cuota (escala sobre base − escala sobre mínimo)",U.eur.format(i.cuota)],["Tipo de retención",U.pct(i.tipo)]]);
}
U.bind("f",run); })();
