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
  function bind(formId, fn){ var f=$(formId); if(!f) return; f.addEventListener("input",fn); f.addEventListener("change",fn); f.addEventListener("submit",function(e){e.preventDefault();}); fn(); }
  function radio(name){ var el=document.querySelector("input[name='"+name+"']:checked"); return el?el.value:null; }
  // Menú móvil
  document.addEventListener("DOMContentLoaded",function(){
    var b=document.querySelector(".menu-btn"), n=document.getElementById("toolnav");
    if(b&&n){ b.addEventListener("click",function(){ var o=b.getAttribute("aria-expanded")==="true"; b.setAttribute("aria-expanded",String(!o)); n.classList.toggle("open",!o); }); }
  });
  root.UI={eur:eur,eur0:eur0,pct:pct,n2:n2,$:$,num:num,esc:esc,ledger:ledger,notes:notes,bind:bind,radio:radio};
})(this);
