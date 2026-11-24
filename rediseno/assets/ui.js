(function(root){
  "use strict";
  var eur = new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",minimumFractionDigits:2,maximumFractionDigits:2});
  var eur0 = new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0});
  function pct(x){ return x==null ? "—" : Number(x).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})+" %"; }
  function n2(x){ return Number(x).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function $(id){ return document.getElementById(id); }
  function num(id, def){ var el=$(id); if(!el) return def; var v=parseFloat(String(el.value).replace(/\./g,"").replace(",",".")); if(el.type==="number") v=parseFloat(el.value); return isFinite(v)&&v>=0 ? v : def; }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function ledger(caption, head, rows, foot){
    var h="<caption>"+esc(caption)+"</caption>";
    if(head) h+="<thead><tr>"+head.map(function(x){return "<th scope=\"col\">"+esc(x)+"</th>";}).join("")+"</tr></thead>";
    h+="<tbody>"+rows.map(function(r){return "<tr>"+r.map(function(x,i){return i===0?"<th scope=\"row\">"+esc(x)+"</th>":"<td>"+esc(x)+"</td>";}).join("")+"</tr>";}).join("")+"</tbody>";
    if(foot) h+="<tfoot><tr>"+foot.map(function(x){return "<td>"+esc(x)+"</td>";}).join("")+"</tr></tfoot>";
    return h;
  }
  function notes(list){ return list.filter(Boolean).map(function(n){ var ok=n.charAt(0)==="+"; return "<p class=\"note"+(ok?" ok":"")+"\">"+esc(ok?n.slice(1):n)+"</p>"; }).join(""); }
  function bind(formId, fn){ var f=$(formId); if(!f) return; f.addEventListener("input",fn); f.addEventListener("change",fn); f.addEventListener("submit",function(e){e.preventDefault();}); fn(); var o=$("out"); if(o) o.classList.add("ready"); }
  function radio(name){ var el=document.querySelector("input[name='"+name+"']:checked"); return el?el.value:null; }
  // Menú móvil
  document.addEventListener("DOMContentLoaded",function(){
    var b=document.querySelector(".menu-btn"), n=document.getElementById("toolnav");
    if(b&&n){ b.addEventListener("click",function(){ var o=b.getAttribute("aria-expanded")==="true"; b.setAttribute("aria-expanded",String(!o)); n.classList.toggle("open",!o); }); }
  });
  var RM = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
  // Barra «de cada 100 € brutos» (solo visual; no cambia ningún cálculo). parts: [[etiqueta, importe, clase]]
  function split(id, total, parts){
    var el=$(id); if(!el) return;
    if(!(total>0)){ el.hidden=true; return; } el.hidden=false;
    if(!el.querySelector(".split-bar")){
      el.innerHTML="<p class=\"split-t\">De cada 100 € brutos</p><div class=\"split-bar\" aria-hidden=\"true\">"+parts.map(function(p){return "<span class=\"s-"+p[2]+"\"></span>";}).join("")+"</div><ul class=\"split-leg\">"+parts.map(function(p){return "<li class=\"s-"+p[2]+"\"><b></b> <span></span></li>";}).join("")+"</ul>";
    }
    var segs=el.querySelectorAll(".split-bar span"), lis=el.querySelectorAll(".split-leg li");
    parts.forEach(function(p,i){ var w=Math.max(0,p[1]/total*100); segs[i].style.width=w.toFixed(3)+"%"; lis[i].querySelector("b").textContent=n2(w)+" €"; lis[i].querySelector("span").textContent=p[0]; });
  }
  // Animación sutil al cambiar el resultado y contadores de la portada (respetan prefers-reduced-motion)
  document.addEventListener("DOMContentLoaded",function(){
    var big=$("o-big");
    if(big && !RM && root.MutationObserver){
      new MutationObserver(function(){ big.classList.remove("tick"); void big.offsetWidth; big.classList.add("tick"); }).observe(big,{childList:true,characterData:true,subtree:true});
    }
    var cs=document.querySelectorAll("[data-count]");
    if(!cs.length || RM || !root.IntersectionObserver || !root.requestAnimationFrame) return;
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){
      if(!e.isIntersecting) return; io.unobserve(e.target);
      var el=e.target, to=parseInt(el.getAttribute("data-count"),10), t0=null, d=900;
      function step(t){ if(t0===null) t0=t; var k=Math.min(1,(t-t0)/d), v=Math.round(to*(1-Math.pow(1-k,3))); el.textContent=String(v); if(k<1) requestAnimationFrame(step); else el.textContent=String(to); }
      el.textContent="0"; requestAnimationFrame(step);
    }); },{threshold:.4});
    cs.forEach(function(c){ io.observe(c); });
  });
  root.UI={eur:eur,eur0:eur0,pct:pct,n2:n2,$:$,num:num,esc:esc,ledger:ledger,notes:notes,bind:bind,radio:radio,split:split,reducedMotion:RM};
})(this);
/* Descargar o imprimir el resultado: usa la impresión del navegador (sin enviar datos). */
document.addEventListener("click", function (e) {
  var t = e.target;
  if (t && t.classList && t.classList.contains("print-btn")) { e.preventDefault(); window.print(); }
});
/* Envío por email y lista de espera (solo en la versión publicada con PHP). */
document.addEventListener("submit", function (e) {
  var f = e.target;
  if (!f || !f.classList || !f.classList.contains("lead")) return;
  e.preventDefault();
  var st = f.querySelector(".lead-status");
  if (f.getAttribute("data-estado") !== "activo") {
    if (st) { st.className = "lead-status note"; st.textContent = "Disponible en la versión publicada (GitHub Pages es estático)."; }
    return;
  }
  var email = (f.querySelector('input[name="email"]') || {}).value || "";
  var rgpd = !!(f.querySelector('input[name="rgpd"]') || {}).checked;
  var com = !!(f.querySelector('input[name="comercial"]') || {}).checked;
  var hp = (f.querySelector('input[name="website"]') || {}).value || "";
  var btn = f.querySelector('button[type="submit"]');
  function show(ok, msg) {
    if (!st) return;
    st.className = "lead-status note" + (ok ? " ok" : "");
    st.textContent = msg;
  }
  if (!email.trim() || email.indexOf("@") < 1) { show(false, "Introduce una dirección de correo válida."); return; }
  if (!rgpd) { show(false, "Debes marcar la casilla de consentimiento antes de enviar."); return; }
  var payload = {
    modo: f.getAttribute("data-form") === "espera" ? "espera" : "resultado",
    email: email.trim(), consent: true, comercial: com, website: hp,
    calculadora: (document.querySelector(".hero h1") || {}).textContent || document.title,
    url: location.href
  };
  if (payload.modo === "resultado") {
    payload.cifra = (document.getElementById("o-big") || {}).textContent || "";
    payload.unidad = (document.getElementById("o-big-l") || {}).textContent || "";
    payload.sub = (document.getElementById("o-sub") || {}).innerText.replace(/\s+/g, " ").trim();
    payload.filas = [];
    document.querySelectorAll("#t1 tr").forEach(function (tr) {
      var cells = tr.querySelectorAll("th,td");
      if (cells.length >= 2) {
        var k = cells[0].textContent.trim();
        var v = Array.prototype.slice.call(cells, 1).map(function (c) { return c.textContent.trim(); }).filter(Boolean).join(" · ");
        if (k && v && k.toLowerCase() !== "concepto") payload.filas.push([k, v]);
      }
    });
  }
  if (btn) btn.disabled = true;
  show(true, "Enviando…");
  fetch("../api/enviar.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    .then(function (r) { return r.json().catch(function () { return { ok: false, error: "Respuesta no válida del servidor." }; }); })
    .then(function (d) { show(!!d.ok, d.ok ? d.message : (d.error || "No se pudo enviar.")); })
    .catch(function () { show(false, "Error de conexión al enviar. Puedes usar «Descargar o imprimir (PDF)»."); })
    .finally(function () { if (btn) btn.disabled = false; });
});
