// NEhelp: the map and the list of local businesses and companies.
// Used by index.html (both dashboards, and the preview on the home page) and by map.html.
// Loaded as a plain script; everything shares one global scope, in the order index.html lists.
// Data comes from businesses.js, which only holds public facts (never private needs or guesses).

var bizMap=null,miniMap=null;
var TEAL="#14B5AE",AMBER="#F2A541";

// Small businesses are round pins (teal when on NEhelp, amber when not). Companies are square pins (navy when on NEhelp, grey-blue when not).
function isCo(p){return !!p.services}
function onNE(p){return isCo(p)?isClaimedCo(p):isClaimed(p)}
function places(show){var l=[];if(show!=="co")l=l.concat(window.BUSINESSES||[]);if(show!=="biz")l=l.concat(companyList());return l}
function helpText(p){var h=["Free","Discounted","Paid"].filter(function(k){return p.help[k]}).join(", ").toLowerCase();return h.charAt(0).toUpperCase()+h.slice(1)}

function placeTags(p){var t=[];
if(isCo(p)){var mine=S.company.onboarded&&(S.company.compId===p.id||(p.id==="tyne"&&!S.company.compId));
t.push('<span class="pill co">Company</span>');
t.push(pill(mine?"Your company":onNE(p)?"On NEhelp":"Not signed up yet",onNE(p)?"good":""));
p.services.forEach(function(s){t.push(svc(s))});
t.push(pill(p.employees+" people"));t.push(pill(helpText(p)+" help"))}
else{var q=p.public,own=S.claimed&&S.business.bizId===p.id;
t.push(pill(own?"Your business":onNE(p)?"On NEhelp":"Not signed up yet",onNE(p)?"good":""));
t.push(pill(q.has_website?"Has a website":p.real?"No website on OpenStreetMap":"No website listed"));
if(q.hygiene_rating!=null)t.push(pill("Food hygiene "+q.hygiene_rating+"/5"+(q.hygiene_date?" ("+q.hygiene_date.slice(0,4)+")":"")));
if(p.real)t.push(pill("Real business, name changed"))}
return'<div class="row" style="gap:6px;margin-top:8px">'+t.join("")+"</div>"}

function placePopup(p,base){var c=claimBtn(p,base);return"<b>"+esc(p.name)+"</b><br>"+esc(p.type+" in "+p.area)+placeTags(p)+(c?'<div style="margin-top:10px">'+c+"</div>":"")}
function placeRow(p,base){return'<div class="lrow"><div class="grow"><b>'+esc(p.name)+'</b><p class="meta">'+esc(p.type)+"</p>"+placeTags(p)+"</div>"+claimBtn(p,base)+"</div>"}

function placeList(show,base){var areas={};places(show).forEach(function(p){(areas[p.area]=areas[p.area]||[]).push(p)});
return Object.keys(areas).sort().map(function(a){return'<h3 class="sec">'+esc(a)+" ("+areas[a].length+')</h3><div class="list-rows">'+
areas[a].sort(function(x,y){return onNE(y)-onNE(x)||x.name.localeCompare(y.name)}).map(function(p){return placeRow(p,base)}).join("")+"</div>"}).join("")}

function placeLayer(p,base){var o=onNE(p),pop=placePopup(p,base);
if(isCo(p))return L.marker([p.lat,p.lng],{icon:L.divIcon({className:"coPin"+(o?" on":""),html:"<i></i>",iconSize:[20,20],iconAnchor:[10,10],popupAnchor:[0,-10]})}).bindPopup(pop);
return L.circleMarker([p.lat,p.lng],{radius:o?9:6,color:"#fff",weight:2,fillColor:o?TEAL:AMBER,fillOpacity:.95}).bindPopup(pop)}

// Draws the map into an element and returns it. compact is the small preview with no scroll-zoom.
function drawPlaces(el,show,base,compact){var m=L.map(el,compact?{scrollWheelZoom:false}:{}).setView([54.975,-1.6],compact?11:12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · Hygiene ratings: FSA, OGL v3.0'}).addTo(m);
// Open on Newcastle and Gateshead, where most pins are. Zoom out for Tynemouth, Sunderland and Durham.
var all=[],core=[];places(show).forEach(function(p){placeLayer(p,base).addTo(m);all.push([p.lat,p.lng]);if(["Newcastle","Gateshead"].indexOf(districtOf(p.area))>-1)core.push([p.lat,p.lng])});
var fit=core.length?core:all;if(fit.length)m.fitBounds(fit,{padding:[30,30]});return m}

function legendHtml(){return'<div class="maplegend"><span><i style="background:#14B5AE"></i>Small business on NEhelp</span><span><i style="background:#F2A541"></i>Small business, not signed up yet</span><span><i class="sq" style="background:#12263A"></i>Company on NEhelp</span><span><i class="sq" style="background:#8CA0B3"></i>Company, not signed up yet</span></div>'}
function seg(label,action,pairs,now){return'<div class="seg" role="group" aria-label="'+label+'">'+pairs.map(function(m){return'<button data-a="'+action+'" data-m="'+m[0]+'" aria-pressed="'+(now===m[0])+'">'+m[1]+"</button>"}).join("")+"</div>"}
function modeSeg(now){return seg("Show as","mapmode",[["map","Map"],["list","List"]],now)}
function showSeg(now){return seg("Show","mapshow",[["all","All"],["biz","Small businesses"],["co","Companies"]],now)}

// The full map screen inside the app (both dashboards).
function mapView(cur,sum){var mode=S.ui.mapMode||"map",show=S.ui.mapShow||"all";
var body='<div class="bar"><h2>Businesses and companies near you</h2>'+modeSeg(mode)+"</div>"+
'<div class="row" style="margin-bottom:12px">'+showSeg(show)+"</div>"+
'<p class="hint" style="margin-bottom:14px">Every small business and company on NEhelp and nearby. You only see what’s public. Zoom out for Tynemouth, Sunderland and Durham. Run one of them? Press <b>Claim this business</b> or <b>Claim this company</b>.</p>'+legendHtml()+
(mode==="map"?'<div id="bizmap" class="bizmap" role="region" aria-label="Map of local businesses and companies"></div>':'<div id="bizlist"></div>');
return shell(cur,body,sum)}
function bMap(){return mapView("b-map",bSum())}
function cMap(){return mapView("c-map",cSum())}

// Called after render() whenever a map view is on screen.
function drawBizMap(){var show=S.ui.mapShow||"all",listEl=document.getElementById("bizlist");
if(listEl){listEl.innerHTML=placeList(show,"");return}
var el=document.getElementById("bizmap");if(!el||typeof L==="undefined")return;
if(bizMap){bizMap.remove();bizMap=null}
bizMap=drawPlaces(el,show,"",false)}

// Small preview map used on the home page and both dashboards (the #minimap card).
function drawMini(){var el=document.getElementById("minimap");if(!el)return;
if(typeof L==="undefined"){el.innerHTML='<p class="hint" style="padding:16px">The map needs an internet connection. <a href="map.html">Open the map page</a>.</p>';return}
if(miniMap){try{miniMap.remove()}catch(e){}miniMap=null}
miniMap=drawPlaces(el,"all","",true)}
