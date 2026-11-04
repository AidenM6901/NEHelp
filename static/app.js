// NEhelp: routing, button actions and start-up
// Loaded as a plain script; everything shares one global scope, in the order index.html lists.

var VIEWS={"b-issues":bIssues,"b-map":bMap,"b-new":bNew,"b-update":bUpdate,"b-companies":bCompanies,"c-requests":cRequests,"c-add":cAdd,"c-companies":cCompanies,"c-profile":cProfile,"c-map":cMap,"b-account":bAccount,"c-account":cAccount,"b-messages":bMessages,"c-messages":cMessages};
// Colour the whole site by side (blue for small businesses, orange for companies) and keep the top Map button in step with who is signed in.
function topbar(v){document.body.dataset.side=S.role||"";var b=$("#topmap");b.hidden=false;
if(S.role){b.dataset.go=S.role==="business"?"b-map":"c-map";b.removeAttribute("data-a")}else{b.removeAttribute("data-go");b.dataset.a="topmap"}
b.setAttribute("aria-pressed",String(v==="b-map"||v==="c-map"))}
// Signs in as a role and opens its dashboard (or onboarding). Used by the role switch and by the #go-business / #go-company links on other pages.
function enterRole(r){ob={step:1,err:""};
// Only people who already have a business or a company go to a dashboard. Everyone else gets the form that creates one.
if(r==="business"){if(S.claimed){S.role="business";save();go("b-issues")}else go("new-business")}
else{if(S.company.onboarded){S.role="company";save();go("c-requests")}else location.href="company.html"}}
// The home page (index) is the default for everyone: no address, an unknown address, or one you can't use all land here.
function render(){var v=location.hash.slice(1),app=$("#app");if(v==="go-business"||v==="go-company"){enterRole(v.slice(3));return}menu();topbar("");
if(v.indexOf("claim-")===0){var cid=v.slice(6),kind=bizById(cid)?"business":compById(cid)?"company":"";if(ob.id!==cid)ob={step:1,err:"",id:cid,kind:kind};
document.body.dataset.side=kind==="company"?"company":"business";app.innerHTML=kind==="company"?claimCompany():onboarding();return}
if(v==="new-business"){document.body.dataset.side="business";app.innerHTML=newBusiness();return}
var ready=S.role==="business"?S.claimed:S.role==="company"?S.company.onboarded:false;
if(!ready||!VIEWS[v]||v.charAt(0)!==(S.role==="business"?"b":"c")){app.innerHTML=landing();drawMini();return}
app.innerHTML=VIEWS[v]();topbar(v);if(v==="b-map"||v==="c-map")drawBizMap();drawMini()}

function after(m){save();render();refreshDlg();if(m)toast(m)}
function act(a,d,el){var i=d.id?byId(d.id):null;
switch(a){
case"close":closeDlg();break;
case"mapmode":S.ui.mapMode=d.m;after();break;
case"mapshow":S.ui.mapShow=d.m;after();break;
case"topmap":if(S.role==="business")go("b-map");else if(S.role==="company")go("c-map");else location.href="map.html";break;
case"acc-save":var ac=S.accounts[S.role];ac.name=$("#ac-name").value.trim()||ac.name;ac.email=$("#ac-email").value.trim();ac.phone=$("#ac-phone").value.trim();ac.title=$("#ac-title").value.trim()||ac.title;save();render();toast("Account saved");break;
case"acc-notify":S.accounts[S.role].notify[d.k]=el.checked;save();toast("Preference saved");break;
case"acc-download":try{var dat={role:S.role,account:S.accounts[S.role],organisation:S.role==="business"?S.business:S.company,requests:S.role==="business"?mine():S.issues.filter(function(x){return x.company==="tyne"})},bl=new Blob([JSON.stringify(dat,null,2)],{type:"application/json"}),ur=URL.createObjectURL(bl),an=document.createElement("a");an.href=ur;an.download="nehelp-my-data.json";document.body.appendChild(an);an.click();an.remove();setTimeout(function(){URL.revokeObjectURL(ur)},1000);toast("Your data is downloading")}catch(e){toast("Couldn’t prepare the download")}break;
case"acc-delete":confirmDeleteDlg();break;
case"acc-delete-yes":S=seed();save();ob={step:1,err:""};req=null;closeDlg();location.hash="";render();toast("Account deleted");break;
case"bizedit":bizEditDlg();break;
case"bizedit-save":S.business.name=$("#be-name").value.trim()||S.business.name;S.business.hours=$("#be-hours").value.trim()||S.business.hours;S.business.address=$("#be-addr").value.trim()||S.business.address;save();closeDlg();render();toast("Business details saved");break;
case"cotoggle":grabCo();var tk=d.k,tv=d.v;if(tk==="help")S.company.help[tv]=!S.company.help[tv];else{var ta=S.company[tk],tx=ta.indexOf(tv);if(tx>-1)ta.splice(tx,1);else ta.push(tv)}save();render();break;
case"profile-save":grabCo();COMP.tyne=S.company.name;save();render();toast("Profile saved");break;
case"how":var hw=document.getElementById("how");if(hw)hw.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});break;
case"role":enterRole(d.r);break;
case"logout":S.role=null;save();location.hash="";render();break;
case"reset":S=seed();save();ob={step:1,err:""};req=null;closeDlg();$("#menu").hidden=true;location.hash="";render();toast("Demo data reset");break;
case"ob-next":ob.step=2;render();break;
case"ob-finish":if(ob.kind==="company"){var cc=compById(ob.id);if(!cc){go("home");break}adoptCompany(cc,$("#cl-name").value.trim(),parseInt($("#cl-hours").value,10),$("#cl-email").value.trim());save();go("home");toast("You now run "+S.company.name+" on NEhelp");break}
var cb=bizById(ob.id);if(!cb){go("home");break}var sc=S.business;sc.name=$("#ob-name").value.trim()||cb.name;sc.hours=$("#ob-hours").value.trim()||sc.hours;sc.address=$("#ob-addr").value.trim()||cb.area;sc.kind=cb.type;sc.area=cb.area;sc.district=districtOf(cb.area);sc.bizId=cb.id;sc.source="claimed";mine().forEach(function(x){x.district=sc.district});S.claimed=true;S.role="business";save();go("home");toast("You now run "+sc.name+" on NEhelp");break;
case"nb-create":var g=function(id){return $("#"+id).value.trim()},sn=S.business;sn.name=g("nb-name")||sn.name;sn.kind=g("nb-kind")||sn.kind;sn.area=$("#nb-area").value;sn.district=districtOf(sn.area);sn.address=g("nb-addr")||("High Street, "+sn.area);sn.hours=g("nb-hours")||sn.hours;sn.bizId=null;sn.source="created";if(g("nb-person"))S.accounts.business.name=g("nb-person");if(g("nb-email"))S.accounts.business.email=g("nb-email");mine().forEach(function(x){x.district=sn.district});S.claimed=true;S.role="business";save();go("home");toast(sn.name+" is on NEhelp");break;
case"open":showIssue(d.id);break;
case"fav":i.fav=!i.fav;after();break;
case"toggleview":S.ui.view=S.ui.view==="grid"?"list":"grid";after();break;
case"settings":setDlg();break;
case"savesettings":S.ui.hideClosed=$("#hc").checked;if($("#om"))S.ui.onlyMine=$("#om").checked;closeDlg();after("Display saved");break;
case"idea":$("#talk").value=IDEAS[+d.k];break;
case"make":var t0=$("#talk").value.trim();if(!t0){newErr="Tell us what would help first.";render();return}newErr="";req=guess(t0);render();break;
case"rhelp":req.help=d.h;req.title=$("#r-title").value;req.cat=$("#r-cat").value;req.check=$("#r-check").value.split("\n");req.hours=$("#r-hours").value;render();break;
case"rback":req=null;newErr="";render();break;
case"rdraft":case"rsend":var ti=$("#r-title").value.trim(),ch=$("#r-check").value.split("\n").map(function(x){return x.trim()}).filter(Boolean),hr=parseInt($("#r-hours").value,10);
if(!ti){newErr="Add a title.";render();return}if(!ch.length){newErr="Add at least one thing you need.";render();return}
S.issues.unshift({id:"i"+Date.now(),biz:"me",title:ti,cat:$("#r-cat").value,desc:req.desc||ch[0],check:ch,help:req.help,hours:hr>0?hr:ch.length*2,status:a==="rsend"?"open":"draft",district:S.business.district||S.business.area,company:null,employee:null,fav:false});
req=null;newErr="";save();go("b-issues");toast(a==="rsend"?"Request sent to companies":"Draft saved");break;
case"send":i.status="open";after("Request sent to companies");break;
case"notneeded":i.status="notneeded";after("Marked not needed");break;
case"reopen":i.status="open";after("Request reopened");break;
case"del":S.issues=S.issues.filter(function(x){return x.id!==d.id});closeDlg();after("Removed");break;
case"accept":i.status="inprogress";i.signed=today();after("Agreement signed with "+COMP[i.company]);break;
case"decline":i.status="open";i.company=null;i.employee=null;i.price=null;i.note="";after("Offer declined");break;
case"message":case"contact":contactDlg(d.id);break;
case"starter":var mt=$("#msg");mt.value=MSG_STARTERS[S.role==="company"?"company":"business"][+d.k];mt.focus();break;
case"reply":var rt=$("#rp-"+d.c);if(!rt.value.trim()){toast("Write a reply first");break}S.messages.push({id:"m"+Date.now(),biz:"me",issue:d.issue,from:"business",company:d.c,text:rt.value.trim(),at:today(),read:true});after("Reply sent to "+(COMP[d.c]||"the company"));break;
case"sendmsg":var mv=$("#msg").value.trim();if(!mv){$("#msgerr").textContent="Write a message first.";return}var co2=S.role==="company";S.messages.push({id:"m"+Date.now(),biz:i.biz,issue:i.id,from:co2?"company":"business",company:co2?"tyne":i.company,text:mv,at:today(),read:!co2||i.biz!=="me"});closeDlg();after("Message sent to "+(co2?whoFor(i):COMP[i.company]));break;
case"handover":handover(d.id);break;
case"assign":var hh=parseInt($("#ofh").value,10),op=$("#ofp");if(!(hh>0)){$("#oferr").textContent="Enter the hours as a number.";return}
if(op&&!(op.value.trim()!==""&&parseFloat(op.value)>=0)){$("#oferr").textContent="Enter a price in pounds.";return}
i.hours=hh;i.price=op?parseFloat(op.value):0;i.note=$("#ofn").value.trim();i.status="offered";i.company="tyne";i.employee=$("#asg").value;after("Offer sent");break;
case"withdraw":i.status="open";i.company=null;i.employee=null;i.price=null;i.note="";after("Offer withdrawn");break;
case"finish":i.status="done";after("Marked done");break;
case"addemp":var nm=$("#en").value.trim();if(!nm){newErr="Enter a name.";render();return}newErr="";S.employees.push({id:"e"+Date.now(),name:nm,specialty:$("#es").value,available:true});after("Employee added");break;
case"rename":if(el.value.trim()){i.title=el.value.trim();save();toast("Title saved")}break;
case"setstatus":i.status=el.value;after("Status updated");break;
case"espec":emp(d.id).specialty=el.value;after("Specialty updated");break;
case"eavail":emp(d.id).available=el.checked;after("Availability updated");break}}

document.addEventListener("click",function(e){var g=e.target.closest("[data-go]");if(g){closeDlg();go(g.dataset.go);$("#menu").hidden=true;return}
var a=e.target.closest("[data-a]");if(!a||a.tagName==="SELECT"||a.tagName==="INPUT"&&a.type!=="checkbox")return;if(a.tagName==="INPUT")return;
if(a.classList.contains("heart")||a.dataset.a!=="open"||!e.target.closest(".heart")){act(a.dataset.a,a.dataset,a)}
if(!e.target.closest("#menu")&&!e.target.closest("#avatar"))$("#menu").hidden=true;
if(e.target.closest("#menu"))$("#menu").hidden=true});
document.addEventListener("change",function(e){var a=e.target.closest("[data-a]");if(a&&(a.tagName==="SELECT"||a.tagName==="INPUT"))act(a.dataset.a,a.dataset,a)});
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target.classList&&e.target.classList.contains("card")){e.preventDefault();act("open",e.target.dataset,e.target)}if(e.key==="Escape")$("#menu").hidden=true});
document.addEventListener("click",function(e){if(!e.target.closest("#menu")&&!e.target.closest("#avatar"))$("#menu").hidden=true});
$("#avatar").addEventListener("click",function(){var m=$("#menu");m.hidden=!m.hidden;this.setAttribute("aria-expanded",!m.hidden)});
$("#dlg").addEventListener("click",function(e){if(e.target===this)closeDlg()});
window.addEventListener("hashchange",render);
render();
