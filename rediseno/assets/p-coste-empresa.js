(function(){ var C=window.Calc2026,U=window.UI,$=U.$;
function run(){
  var atSel=$("c-at").value; $("c-at-custom-wrap").hidden = atSel!=="custom";
  var at = atSel==="custom" ? U.num("c-at-custom",1.5) : parseFloat(atSel);
  var o={bruto:U.num("c-bruto",0),pagas:12,grupo:$("c-grupo").value,contrato:$("c-contrato").value,atep:at,situacion:"3",hijos:0};
  if(!o.bruto){ $("out").hidden=true; return; } $("out").hidden=false;
  var r=C.calcular(o);
  $("o-big").textContent=U.eur0.format(r.costeEmpresaAnual);
  $("o-sub").innerHTML="<span>Al mes <b>"+U.eur.format(r.costeEmpresaMensual)+"</b></span><span>Cotizaciones empresa <b>"+U.eur0.format(r.ss.totalEmpresa)+"</b></span><span>Sobre el bruto <b>+"+U.pct(Math.round(r.ss.totalEmpresa/o.bruto*10000)/100)+"</b></span>";
  $("o-notes").innerHTML=U.notes([r.ss.baseMinimaAplicada?"El sueldo prorrateado está por debajo de la base mínima del grupo: se cotiza por "+U.eur.format(r.ss.baseMensual)+" al mes.":null,
    r.ss.baseTopada?"Por encima de la base máxima se cotiza por 5.101,20 € al mes y se añade la cotización adicional de solidaridad.":null]);
  var rows=[["Sueldo bruto","",U.eur.format(o.bruto/12),U.eur.format(o.bruto)]];
  r.ss.empresa.forEach(function(l){ rows.push([l.nombre,U.pct(l.pct),"+ "+U.eur.format(l.mensual),"+ "+U.eur.format(l.anual)]); });
  $("t1").innerHTML=U.ledger("Coste para la empresa · base "+U.eur.format(r.ss.baseMensual)+" al mes",["Concepto","Tipo","Al mes","Al año"],rows,["Coste total","",U.eur.format(r.costeEmpresaMensual),U.eur.format(r.costeEmpresaAnual)]);
}
U.bind("f",run); })();
