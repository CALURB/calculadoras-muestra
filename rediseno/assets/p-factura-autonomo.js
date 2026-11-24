(function(){ var X=window.Calc2026Extra,U=window.UI,$=U.$;
function run(){
  var modo=U.radio("modo"), ivaT=parseFloat($("iva").value), ret=parseFloat($("ret").value), re=$("re").checked, imp=U.num("imp",0);
  $("imp-l").textContent = modo==="total" ? "Lo que quieres cobrar (líquido, €)" : "Base imponible (€)";
  if(!imp){ $("out").hidden=true; return; } $("out").hidden=false;
  var r = modo==="total" ? X.facturaDesdeTotal({total:imp,iva:ivaT,retencion:ret,recargo:re}) : X.factura({base:imp,iva:ivaT,retencion:ret,recargo:re});
  $("o-big").textContent=U.eur.format(modo==="total"?r.base:r.total);
  $("o-big-l").textContent= modo==="total" ? "de base imponible a facturar" : "total a cobrar (líquido de la factura)";
  $("o-sub").innerHTML="<span>Para Hacienda (IVA + retención) <b>"+U.eur.format(r.aHacienda)+"</b></span><span>Tu ingreso antes de impuestos <b>"+U.eur.format(r.base)+"</b></span>";
  var rows=[["Base imponible","",U.eur.format(r.base)],["IVA",U.pct(ivaT),"+ "+U.eur.format(r.cuotaIva)]];
  if(re) rows.push(["Recargo de equivalencia",U.pct({21:5.2,10:1.4,4:0.5}[ivaT]||0),"+ "+U.eur.format(r.recargo)]);
  rows.push(["Retención IRPF",U.pct(ret),"− "+U.eur.format(r.retencion)]);
  $("t1").innerHTML=U.ledger("Cómo queda la factura",["Concepto","Tipo","Importe"],rows,["Total a cobrar","",U.eur.format(r.total)]);
  $("o-notes").innerHTML=U.notes([ret===0?"Sin retención: es lo habitual si facturas a particulares o si no aplicas retención por tu actividad (comprueba tu caso).":null]);
}
U.bind("f",run); })();
