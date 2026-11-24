(function(){ var X=window.Calc2026Extra,U=window.UI,$=U.$;
function run(){
  var hijos=Math.round(U.num("n-hijos",0)), h3=Math.min(Math.round(U.num("n-hijos3",0)),hijos), pagas=U.radio("n-pagas")==="14"?14:12;
  var netoMes=U.num("n-neto",0), modo=U.radio("n-modo");
  var o={pagas:pagas,grupo:$("n-grupo").value,contrato:$("n-contrato").value,situacion:$("n-sit").value,hijos:hijos,hijosMenores3:h3,anioNacimiento:Math.round(U.num("n-nac",1990))};
  if(!netoMes){ $("out").hidden=true; return; } $("out").hidden=false;
  if(modo==="anual") o.netoAnual=netoMes; else o.netoOrdinaria=netoMes;
  var r=X.netoABruto(o), d=r.detalle;
  $("o-big").textContent=U.eur0.format(r.bruto);
  $("o-sub").innerHTML="<span>Bruto por paga <b>"+U.eur.format(r.bruto/pagas)+"</b></span><span>Retención IRPF <b>"+U.pct(d.irpf.tipo)+"</b></span><span>Coste empresa <b>"+U.eur0.format(d.costeEmpresaAnual)+"</b></span>";
  U.split("o-split",r.bruto,[["neto para ti",d.netoAnual,"neto"],["Seguridad Social",d.ss.totalTrabajador,"ss"],["retención IRPF",d.irpf.importe,"irpf"]]);
  $("t1").innerHTML=U.ledger("Comprobación: de ese bruto al neto",null,[["Bruto anual",U.eur.format(r.bruto)],["Seguridad Social del trabajador","− "+U.eur.format(d.ss.totalTrabajador)],["Retención IRPF","− "+U.eur.format(d.irpf.importe)]],["Neto anual",U.eur.format(d.netoAnual)]);
  $("o-notes").innerHTML=U.notes(["El IRPF es progresivo y tiene límites exentos, así que pequeñas diferencias de neto pueden pedir saltos mayores de bruto."]);
}
U.bind("f",run); })();
