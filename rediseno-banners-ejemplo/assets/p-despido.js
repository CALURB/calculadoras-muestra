(function(){ var X=window.Calc2026Extra,U=window.UI,$=U.$;
function run(){
  var o={alta:$("alta").value,baja:$("baja").value,salarioAnual:U.num("bruto",0),tipo:$("tipo").value};
  if(!o.salarioAnual||!o.alta||!o.baja||o.baja<o.alta){ $("out").hidden=true; return; } $("out").hidden=false;
  var r=X.despido(o);
  $("o-big").textContent=U.eur.format(r.importe);
  $("o-sub").innerHTML="<span>Días de indemnización <b>"+U.n2(r.dias)+"</b></span><span>Salario diario <b>"+U.eur.format(r.salarioDiario)+"</b></span><span>Días trabajados <b>"+r.diasTrabajados+"</b></span>";
  var rows=[];
  if(o.tipo==="improcedente"){
    if(r.meses1!=null) rows.push(["Antes del 12/02/2012: "+r.meses1+" meses × 3,75 días",U.n2(r.dias1)+" días"]);
    rows.push([(r.meses1!=null?"Desde el 12/02/2012: ":"")+r.meses2+" meses × 2,75 días",U.n2(r.dias2!=null?r.dias2:r.meses2*2.75)+" días"]);
  } else if(o.tipo==="objetivo"){ rows.push([r.meses2+" meses × 20/12 días",U.n2(r.meses2*20/12)+" días"]); }
  else { rows.push([r.diasTrabajados+" días × "+r.diasPorAnio+"/365",U.n2(r.dias)+" días"]); }
  rows.push(["Días indemnizables"+(r.tope?" (tope máximo legal)":""),U.n2(r.dias)]);
  $("t1").innerHTML=U.ledger("Cálculo (criterios de la herramienta del CGPJ)",null,rows,["Indemnización",U.eur.format(r.importe)]);
  $("o-notes").innerHTML=U.notes([r.tope?"Se ha alcanzado el tope máximo legal de la indemnización.":null,
    "Toda fracción de mes cuenta como mes completo (criterio del Tribunal Supremo que aplica el CGPJ).",
    "La indemnización por despido está exenta de IRPF hasta el límite legal obligatorio (art. 7.e LIRPF); el finiquito va aparte."]);
}
U.bind("f",run); })();
