(function(){
  "use strict";
  var C = window.Calc2026;
  var eur = new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",minimumFractionDigits:2,maximumFractionDigits:2});
  var eur0 = new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0});
  var pct = function(x){ return x==null ? "—" : x.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})+" %"; };
  var $ = function(id){ return document.getElementById(id); };
  function num(id, def){ var v=parseFloat(String($(id).value).replace(",",".")); return isFinite(v)&&v>=0 ? v : def; }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }

  // Pestañas accesibles
  var tabs=[$("tab-neto"),$("tab-coste")];
  function sel(t){ tabs.forEach(function(b){ var on=b===t; b.setAttribute("aria-selected",on); b.tabIndex=on?0:-1; $(b.getAttribute("aria-controls")).hidden=!on; }); }
  tabs.forEach(function(b,i){
    b.addEventListener("click",function(){ sel(b); });
    b.addEventListener("keydown",function(e){ if(e.key==="ArrowRight"||e.key==="ArrowLeft"){ var n=tabs[(i+(e.key==="ArrowRight"?1:tabs.length-1))%tabs.length]; sel(n); n.focus(); e.preventDefault(); } });
  });

  function ledger(caption, head, rows, foot){
    var h="<caption>"+esc(caption)+"</caption>";
    if(head) h+="<thead><tr>"+head.map(function(x,i){return "<th scope=\"col\">"+esc(x)+"</th>";}).join("")+"</tr></thead>";
    h+="<tbody>"+rows.map(function(r){return "<tr>"+r.map(function(x,i){return i===0?"<th scope=\"row\">"+esc(x)+"</th>":"<td>"+esc(x)+"</td>";}).join("")+"</tr>";}).join("")+"</tbody>";
    if(foot) h+="<tfoot><tr>"+foot.map(function(x){return "<td>"+esc(x)+"</td>";}).join("")+"</tr></tfoot>";
    return h;
  }
  function notes(r){
    var n=[];
    if(r.bajoSMI) n.push("El bruto indicado está por debajo del salario mínimo de 2026 (17.094 € al año a jornada completa). Esta versión solo calcula jornada completa: la cotización se hace sobre la base mínima del grupo.");
    else if(r.ss.baseMinimaAplicada) n.push("Tu sueldo prorrateado está por debajo de la base mínima de tu grupo: se cotiza por la base mínima ("+eur.format(r.ss.baseMensual)+" al mes).");
    if(r.ss.baseTopada) n.push("Superas la base máxima: se cotiza por 5.101,20 € al mes y se añade la cotización adicional de solidaridad.");
    return n.map(function(t){return "<p class=\"note\">"+esc(t)+"</p>";}).join("");
  }

  function neto(){
    var hijos=Math.round(num("n-hijos",0)), h3=Math.min(Math.round(num("n-hijos3",0)),hijos);
    var contrato=$("n-contrato").value;
    $("n-inf-wrap").hidden = contrato!=="temporal";
    var sitSel=$("n-sit").value;
    var o={ bruto:num("n-bruto",0), pagas:document.querySelector("input[name=n-pagas]:checked").value==="14"?14:12,
            grupo:$("n-grupo").value, contrato:contrato, inferiorAnio:contrato==="temporal"&&$("n-inf").checked,
            situacion:sitSel, hijos:hijos, hijosMenores3:h3, hijosCompartidos:$("n-comp").checked, anioNacimiento:Math.round(num("n-nac",1990)) };
    if(!o.bruto){ $("o-neto-mes").textContent="—"; $("o-neto-sub").innerHTML=""; $("t-neto").innerHTML=""; $("t-irpf").innerHTML=""; $("o-neto-notes").innerHTML=""; return; }
    var r=C.calcular(o);
    $("o-neto-mes").textContent=eur.format(r.netoOrdinaria);
    $("o-neto-mes-l").textContent= r.pagas===14 ? "netos al mes (12 nóminas ordinarias)" : "netos al mes (12 pagas)";
    var sub="<span>Neto anual <b>"+eur0.format(r.netoAnual)+"</b></span><span>Retención IRPF <b>"+pct(r.irpf.tipo)+"</b></span>";
    if(r.netoExtra!=null) sub+="<span>Cada paga extra <b>"+eur.format(r.netoExtra)+"</b></span>";
    $("o-neto-sub").innerHTML=sub;
    var n=notes(r);
    if(sitSel==="1"&&hijos===0) n+="<p class=\"note\">La situación monoparental exige al menos un hijo; se calcula como «otras situaciones».</p>";
    if(r.irpf.exento) n+="<p class=\"note ok\">Por tu sueldo y situación familiar no corresponde retención de IRPF (límite exento: "+eur0.format(r.irpf.limiteExento)+").</p>";
    $("o-neto-notes").innerHTML=n;
    var rows=[["Sueldo bruto", "", eur.format(o.bruto/12), eur.format(o.bruto)]];
    r.ss.trabajador.forEach(function(l){ rows.push([l.nombre, pct(l.pct), "− "+eur.format(l.mensual), "− "+eur.format(l.anual)]); });
    rows.push(["Retención IRPF", pct(r.irpf.tipo), "− "+eur.format(r.irpf.importe/12), "− "+eur.format(r.irpf.importe)]);
    $("t-neto").innerHTML=ledger("De bruto a neto (importes prorrateados en 12 meses)",["Concepto","Tipo","Al mes","Al año"],rows,["Neto","",eur.format(r.netoAnual/12),eur.format(r.netoAnual)]);
    var i=r.irpf;
    $("t-irpf").innerHTML=ledger("Detalle de la retención (algoritmo AEAT 2026)",null,[
      ["Rendimiento neto (bruto − cotizaciones)", eur.format(i.rnt)],
      ["Otros gastos deducibles", "− "+eur.format(i.otrosGastos)],
      ["Reducción por rendimientos del trabajo", "− "+eur.format(i.red20)],
      ["Base para calcular el tipo", eur.format(i.base)],
      ["Mínimo personal y familiar", eur.format(i.minimo)],
      ["Cuota (escala sobre base − escala sobre mínimo)", eur.format(i.cuota)],
      ["Tipo de retención", pct(i.tipo)]
    ]);
  }

  function coste(){
    var atSel=$("c-at").value; $("c-at-custom-wrap").hidden = atSel!=="custom";
    var at = atSel==="custom" ? num("c-at-custom",1.5) : parseFloat(atSel);
    var o={ bruto:num("c-bruto",0), pagas:12, grupo:$("c-grupo").value, contrato:$("c-contrato").value, atep:at, situacion:"3", hijos:0 };
    if(!o.bruto){ $("o-coste-anual").textContent="—"; $("o-coste-sub").innerHTML=""; $("t-coste").innerHTML=""; $("o-coste-notes").innerHTML=""; return; }
    var r=C.calcular(o);
    $("o-coste-anual").textContent=eur0.format(r.costeEmpresaAnual);
    var extra=r.ss.totalEmpresa/o.bruto*100;
    $("o-coste-sub").innerHTML="<span>Al mes <b>"+eur.format(r.costeEmpresaMensual)+"</b></span><span>Cotizaciones empresa <b>"+eur0.format(r.ss.totalEmpresa)+"</b></span><span>Sobre el bruto <b>+"+pct(Math.round(extra*100)/100)+"</b></span>";
    $("o-coste-notes").innerHTML=notes(r);
    var rows=[["Sueldo bruto","",eur.format(o.bruto/12),eur.format(o.bruto)]];
    r.ss.empresa.forEach(function(l){ rows.push([l.nombre,pct(l.pct),"+ "+eur.format(l.mensual),"+ "+eur.format(l.anual)]); });
    $("t-coste").innerHTML=ledger("Coste para la empresa · base de cotización "+eur.format(r.ss.baseMensual)+" al mes",["Concepto","Tipo","Al mes","Al año"],rows,["Coste total","",eur.format(r.costeEmpresaMensual),eur.format(r.costeEmpresaAnual)]);
  }

  function val(){
    var v=window.VALIDACION||[];
    $("t-val").innerHTML=ledger("Casos enviados al servicio de la AEAT (23/11/2026)",["Caso","Bruto","Cotizaciones","Tipo aquí","Tipo AEAT","Retención aquí","Retención AEAT","Sello AEAT"],
      v.map(function(r){ return [r[0]+" · "+r[1], eur0.format(r[2]), eur.format(r[3]), pct(r[4]), pct(r[5]), eur.format(r[6]), eur.format(r[7]), r[8]]; }));
    var sellos=$("t-val").querySelectorAll("tbody td:last-child"); sellos.forEach(function(td){ td.innerHTML="<code>"+esc(td.textContent)+"</code>"; });
  }

  $("f-neto").addEventListener("input",neto); $("f-neto").addEventListener("change",neto);
  $("f-coste").addEventListener("input",coste); $("f-coste").addEventListener("change",coste);
  [$("f-neto"),$("f-coste")].forEach(function(f){ f.addEventListener("submit",function(e){e.preventDefault();}); });
  neto(); coste(); val();
})();
