(function(){ var X=window.Calc2026Extra,U=window.UI,$=U.$;
function run(){
  var o={rendimientoAnual:U.num("rend",0),societario:$("soc").checked,base:U.num("basee",0)||null};
  if(!o.rendimientoAnual&&o.rendimientoAnual!==0){ $("out").hidden=true; return; } $("out").hidden=false;
  var r=X.autonomos(o);
  $("o-big").textContent=U.eur.format(r.cuota);
  $("o-sub").innerHTML="<span>Tramo <b>"+U.esc(r.tramo)+"</b></span><span>Rendimiento computable <b>"+U.eur.format(r.rendimientoMensual)+"/mes</b></span><span>Al año <b>"+U.eur0.format(r.anual)+"</b></span>";
  var g=r.desglose;
  $("t1").innerHTML=U.ledger("Cuota mensual sobre una base de "+U.eur.format(r.base),["Concepto","Tipo","Importe"],[
    ["Contingencias comunes","28,30 %",U.eur.format(g.cc)],["Contingencias profesionales","1,30 %",U.eur.format(g.atep)],
    ["Cese de actividad","0,90 %",U.eur.format(g.cese)],["Formación profesional","0,10 %",U.eur.format(g.fp)],["MEI","0,90 %",U.eur.format(g.mei)]],
    ["Cuota","31,50 %",U.eur.format(r.cuota)]);
  $("t2").innerHTML=U.ledger("Tu tramo en 2026",null,[["Base mínima",U.eur.format(r.baseMin)],["Base máxima",U.eur.format(r.baseMax)],
    ["Cuota mínima",U.eur.format(r.cuotaMin)],["Cuota máxima",U.eur.format(r.cuotaMax)]]);
  $("o-notes").innerHTML=U.notes(["La cuota es provisional: la Seguridad Social la regulariza cuando Hacienda comunica tus rendimientos reales.",
    o.base&&(o.base<r.baseMin||o.base>r.baseMax)?"La base elegida estaba fuera de tu tramo y se ha ajustado a sus límites.":null]);
}
U.bind("f",run); })();
