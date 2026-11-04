// NEhelp: demo data, saved state and small helpers
// Loaded as a plain script; everything shares one global scope, in the order index.html lists.

var KEY="nehelp-v5",CATS=["Finance","Marketing","Employment","Website & tech","Legal","Design"],
// One colour per service, used on every pill, chip and card so services are easy to spot.
SVC={"Finance":"#2563EB","Marketing":"#DB2777","Employment":"#7C3AED","Website & tech":"#059669","Legal":"#475569","Design":"#D97706"},COMP={tyne:"Tyne Digital",nu:"Northumbria University"};
function extend(a,b){for(var k in b)a[k]=b[k];return a}
// One request. Anything not given gets a sensible default.
function mk(o){return extend({kind:"",area:"Newcastle",district:"Newcastle",status:"open",company:null,employee:null,price:null,signed:null,note:"",fav:false,created:"2026-10-20"},o)}
function seed(){
var issues=[
// The demo business ("me") is The Corner Café: a mix of every stage, so its dashboard looks lived in.
mk({id:"i1",biz:"me",title:"Saturday staff",cat:"Employment",desc:"Two part-time students from March.",check:["Post the role","Shortlist candidates","Arrange interviews"],help:"Free",hours:4,status:"inprogress",company:"nu",signed:"1 Oct 2026",created:"2026-09-26"}),
mk({id:"i2",biz:"me",title:"Invoice setup",cat:"Finance",desc:"Closed. Reopen any time.",check:["Choose an invoice template","Set up payment reminders"],help:"Paid",hours:3,status:"notneeded",created:"2026-09-30"}),
mk({id:"i3",biz:"me",title:"Social media pack",cat:"Marketing",desc:"Photos and a month of posts for Instagram.",check:["Set up the profile","Plan 12 posts","Write captions"],help:"Discounted",hours:5,fav:true,created:"2026-10-30"}),
mk({id:"i12",biz:"me",title:"Online table booking",cat:"Website & tech",desc:"Let customers book a table from our website.",check:["Pick a booking tool","Add it to the website","Test it on a phone"],help:"Paid",hours:6,status:"offered",company:"co_nli",price:180,note:"We can start next week and finish within a fortnight.",created:"2026-10-28"}),
mk({id:"i13",biz:"me",title:"Shop lease check",cat:"Legal",desc:"Read our new lease before we sign it.",check:["Read the lease","Flag risky clauses","Explain it in plain English"],help:"Free",hours:2,status:"done",company:"co_qla",signed:"12 Oct 2026",created:"2026-10-08"}),
mk({id:"i14",biz:"me",title:"Menu and logo refresh",cat:"Design",desc:"A fresh logo and a printable menu.",check:["Sketch three logo ideas","Design the menu","Send print-ready files"],help:"Discounted",hours:6,status:"done",company:"tyne",employee:"e8",price:150,signed:"20 Oct 2026",created:"2026-10-14"}),
// Other small businesses on NEhelp, with requests at different stages.
mk({id:"i4",biz:"Harbour Bakery",kind:"Bakery",area:"Tynemouth",district:"North Tyneside",title:"Invoice setup",cat:"Finance",desc:"Needs a simple invoice template and a way to track unpaid bills.",check:["Create invoice template","Track unpaid bills","Show how to send reminders"],help:"Paid",hours:3,created:"2026-10-24"}),
mk({id:"i20",biz:"Harbour Bakery",kind:"Bakery",area:"Tynemouth",district:"North Tyneside",title:"Weekend baker hire",cat:"Employment",desc:"Looking for a part-time baker for weekend mornings.",check:["Write the job post","Screen applicants","Arrange a trial shift"],help:"Discounted",hours:4,created:"2026-11-02"}),
mk({id:"i5",biz:"Tyne Cycles",kind:"Bike shop",area:"Gateshead",district:"Gateshead",title:"Two part-time hires",cat:"Employment",desc:"Weekend mechanics for the summer season.",check:["Write the job post","Screen applicants","Set up trial shifts"],help:"Free",hours:4,created:"2026-10-22"}),
mk({id:"i6",biz:"Ouseburn Print",kind:"Print shop",area:"Ouseburn",title:"Menu design",cat:"Marketing",desc:"A new menu layout for a local restaurant client.",check:["Draft layout","Pick fonts and colours","Send print-ready file"],help:"Discounted",hours:6,status:"inprogress",company:"tyne",employee:"e1",price:240,signed:"28 Oct 2026",created:"2026-10-21"}),
mk({id:"i7",biz:"Roker Fish Bar",kind:"Fish bar",area:"Sunderland",district:"Sunderland",title:"Cash-flow forecast",cat:"Finance",desc:"A simple forecast so the owner knows when quiet months bite.",check:["Gather last year’s takings","Build a 12-month forecast","Explain it in plain English"],help:"Paid",hours:4,created:"2026-10-20"}),
mk({id:"i8",biz:"Durham Dog Grooming",kind:"Dog groomer",area:"Durham",district:"Durham",title:"Booking website",cat:"Website & tech",desc:"A one-page site with online booking and prices.",check:["Design a one-page site","Add online booking","Connect a payment link"],help:"Discounted",hours:6,created:"2026-10-25"}),
mk({id:"i9",biz:"Jesmond Florist",kind:"Florist",area:"Jesmond",title:"Shop lease check",cat:"Legal",desc:"Wants someone to read a new shop lease before signing.",check:["Read the lease","Flag risky clauses","Explain it in plain English"],help:"Free",hours:2,created:"2026-10-31"}),
mk({id:"i10",biz:"Heaton Barbers",kind:"Barber",area:"Heaton",title:"Online booking",cat:"Website & tech",desc:"Set up online booking and a card reader.",check:["Pick a booking tool","Connect it to Google","Set up the card reader"],help:"Discounted",hours:4,created:"2026-11-01"}),
mk({id:"i11",biz:"Gateshead Deli",kind:"Deli",area:"Gateshead",district:"Gateshead",title:"New logo and menu",cat:"Design",desc:"A fresh logo and a printable menu.",check:["Sketch three logo ideas","Design the menu","Send print-ready files"],help:"Paid",hours:6,created:"2026-10-29"}),
mk({id:"i15",biz:"Quayside Coffee Roasters",kind:"Coffee roaster",area:"Newcastle",title:"Wholesale invoicing",cat:"Finance",desc:"Invoices and payment reminders for café customers.",check:["Create invoice template","Set up payment reminders","Show how to chase late payers"],help:"Paid",hours:5,status:"inprogress",company:"tyne",employee:"e3",price:260,signed:"30 Oct 2026",created:"2026-10-27"}),
mk({id:"i16",biz:"Bookworm Corner",kind:"Bookshop",area:"Jesmond",title:"Hire a weekend assistant",cat:"Employment",desc:"A friendly part-time assistant for Saturdays.",check:["Write the job post","Screen applicants","Arrange interviews"],help:"Free",hours:3,status:"offered",company:"tyne",employee:"e5",price:0,note:"Lee can help with the job post and the interviews.",created:"2026-11-01"}),
mk({id:"i25",biz:"Bloom Lane Florist",kind:"Florist",area:"Jesmond",title:"Wedding enquiry emails",cat:"Marketing",desc:"Reply templates for wedding enquiries.",check:["Write three reply templates","Set up an enquiry form","Explain how to use them"],help:"Discounted",hours:3,status:"offered",company:"tyne",employee:"e2",price:90,note:"Dan has done this for other florists, so it should be quick.",created:"2026-11-02"}),
mk({id:"i17",biz:"Ember Wood-fired Pizza",kind:"Restaurant",area:"Ouseburn",title:"New staff contracts",cat:"Legal",desc:"Written contracts for four new kitchen staff.",check:["Draft the contract","Check it against the rules","Explain it to the owner"],help:"Discounted",hours:4,status:"inprogress",company:"co_qla",price:220,signed:"25 Oct 2026",created:"2026-10-20"}),
mk({id:"i18",biz:"Glow Beauty Bar",kind:"Beauty salon",area:"Tynemouth",district:"North Tyneside",title:"Instagram and booking page",cat:"Marketing",desc:"A booking page and a month of posts.",check:["Set up the booking page","Plan 12 posts","Write captions"],help:"Free",hours:8,status:"done",company:"nu",signed:"5 Oct 2026",created:"2026-09-28"}),
mk({id:"i19",biz:"Glow Beauty Bar",kind:"Beauty salon",area:"Tynemouth",district:"North Tyneside",title:"Brand colours and flyers",cat:"Design",desc:"A simple brand and two flyers.",check:["Pick brand colours","Design two flyers","Send print-ready files"],help:"Paid",hours:5,created:"2026-10-30"}),
mk({id:"i21",biz:"Needle & Thread Alterations",kind:"Tailor",area:"Gateshead",district:"Gateshead",title:"Tidy our accounts",cat:"Finance",desc:"Sort a year of receipts into something the accountant can use.",check:["Sort the receipts","Set up a simple spreadsheet","Show how to keep it tidy"],help:"Free",hours:3,created:"2026-10-15"}),
mk({id:"i22",biz:"Little Oak Café",kind:"Café",area:"Ouseburn",title:"Website refresh",cat:"Website & tech",desc:"New opening hours, photos and a menu page.",check:["Update opening hours","Replace menu photos","Add a menu page"],help:"Discounted",hours:6,status:"inprogress",company:"co_nli",price:240,signed:"2 Nov 2026",created:"2026-10-26"}),
mk({id:"i23",biz:"Amara's Hair Studio",kind:"Hairdresser",area:"Heaton",title:"Online booking",cat:"Website & tech",desc:"Let clients book and pay a deposit online.",check:["Pick a booking tool","Connect payments","Test it on a phone"],help:"Paid",hours:4,status:"done",company:"co_nli",price:160,signed:"14 Oct 2026",created:"2026-10-05"}),
mk({id:"i24",biz:"Spoke & Chain Bike Repair",kind:"Bike shop",area:"Jesmond",title:"Card reader and till setup",cat:"Website & tech",desc:"A card reader that works with the till.",check:["Pick a card reader","Connect it to the till","Show the team how to use it"],help:"Free",hours:2,status:"done",company:"co_nli",signed:"9 Oct 2026",created:"2026-10-02"}),
mk({id:"i26",biz:"Tyne Street Bakehouse",kind:"Bakery",area:"Gateshead",district:"Gateshead",title:"Staff holiday and rota policy",cat:"Employment",desc:"A clear policy for holidays and swapping shifts.",check:["Write the policy","Add a simple rota template","Explain it to the team"],help:"Paid",hours:3,status:"offered",company:"co_durhr",price:120,note:"We can send a draft within three days.",created:"2026-10-30"})
];
var people=[["Sam Okafor","Marketing"],["Dan Whitfield","Marketing"],["Priya Nair","Finance"],["Ava Collins","Finance"],["Lee Hart","Employment"],["Mia Chen","Website & tech"],["Tom Ridley","Legal"],["Zara Ali","Design"],["Jack Turner","Employment"],["Nina Roberts","Marketing"]],
ids=["e1","e2","e3","e4","e5","e6","e7","e8","e9","e10"];
var messages=[
{id:"m1",biz:"me",issue:"i1",from:"company",company:"nu",text:"Hi! Two of our students can start in March. Does Saturday 9 to 5 work for you?",at:"2 Nov 2026",read:false},
{id:"m2",biz:"me",issue:"i3",from:"company",company:"tyne",text:"We saw your social media request. Happy to take photos one morning next week if that suits?",at:"3 Nov 2026",read:false},
{id:"m3",biz:"Harbour Bakery",issue:"i4",from:"company",company:"tyne",text:"Hello, our finance team can set up invoices for you this month.",at:"3 Nov 2026",read:true},
{id:"m4",biz:"me",issue:"i12",from:"company",company:"co_nli",text:"Thanks for the request. Our offer is on your Offers page, and we're happy to talk it through.",at:"29 Oct 2026",read:false},
{id:"m5",biz:"me",issue:"i12",from:"business",company:"co_nli",text:"Thanks, could you work in the evenings?",at:"30 Oct 2026",read:true},
{id:"m6",biz:"me",issue:"i12",from:"company",company:"co_nli",text:"Yes, evenings are fine for us.",at:"31 Oct 2026",read:true},
{id:"m7",biz:"Quayside Coffee Roasters",issue:"i15",from:"business",company:"tyne",text:"Great, when can Priya start?",at:"31 Oct 2026",read:true},
{id:"m8",biz:"Quayside Coffee Roasters",issue:"i15",from:"company",company:"tyne",text:"Monday morning works for us.",at:"1 Nov 2026",read:true},
{id:"m9",biz:"Bookworm Corner",issue:"i16",from:"business",company:"tyne",text:"Thank you, that would be a big help.",at:"2 Nov 2026",read:true}];
return{role:null,claimed:false,
business:{name:"The Corner Café",kind:"Café",area:"Newcastle",district:"Newcastle",hours:"Mon to Sat, 8am to 5pm",address:"12 High Street, Newcastle",bizId:null},
issues:issues,
employees:people.map(function(p,i){return{id:ids[i],name:p[0],specialty:p[1],available:true}}),
messages:messages,
company:{name:"Tyne Digital",num:"",email:"",areas:CATS.slice(),districts:["Newcastle","Gateshead","North Tyneside"],hours:40,help:{Free:true,Discounted:true,Paid:true},terms:true,onboarded:false,compId:null},
accounts:{business:{name:"Alex Morgan",email:"alex@cornercafe.co.uk",phone:"0191 555 0142",title:"Owner",notify:{offers:true,messages:true,weekly:false}},company:{name:"Jordan Reed",email:"jordan@tynedigital.co.uk",phone:"0191 555 0177",title:"Partnerships lead",notify:{offers:true,messages:true,weekly:true}}},
ui:{view:"grid",hideClosed:false,onlyMine:true,mapShow:"all"}}}
var S;try{S=JSON.parse(localStorage.getItem(KEY));}catch(e){S=null}
if(!S||!S.issues||!S.company||!S.accounts||!S.messages)S=seed();
COMP.tyne=S.company.name;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var $=function(s){return document.querySelector(s)};
function esc(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var IC={heart:'<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'};
function ico(n,fill){return'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="'+(fill?"currentColor":"none")+'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+IC[n]+"</svg>"}
function toast(m){var t=$("#toast");t.textContent=m;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(function(){t.hidden=true},2600)}
function go(v){if(location.hash.slice(1)===v)render();else location.hash=v}
function mine(){return S.issues.filter(function(i){return i.biz==="me"})}
// Where a small business can be, and which district each place belongs to (companies cover districts).
var AREAS=["Newcastle","Heaton","Jesmond","Ouseburn","Gateshead","Tynemouth","Sunderland","Durham","Northumberland"],
DISTRICT_OF={Newcastle:"Newcastle",Heaton:"Newcastle",Jesmond:"Newcastle",Ouseburn:"Newcastle",Gateshead:"Gateshead",Tynemouth:"North Tyneside",Sunderland:"Sunderland",Durham:"Durham",Northumberland:"Northumberland"};
function districtOf(a){return DISTRICT_OF[a]||a}
function bizById(id){return(window.BUSINESSES||[]).filter(function(b){return b.id===id})[0]}
function compById(id){return(window.COMPANIES||[]).filter(function(c){return c.id===id})[0]}
function isClaimed(b){return !!b.claimed||(S.claimed&&S.business.bizId===b.id)}
function isClaimedCo(c){return !!c.claimed||(S.company.onboarded&&S.company.compId===c.id)}
// The companies to show. The sample company "tyne" is the one you sign up as, so it takes your company's name,
// and it steps aside if you claimed a different company from the list.
function companyList(){var mine=S.company.onboarded?S.company.compId:null;
return(window.COMPANIES||[]).filter(function(c){return !(c.id==="tyne"&&mine&&mine!=="tyne")}).map(function(c){return c.id==="tyne"&&S.company.onboarded&&!mine?extend(extend({},c),{name:S.company.name}):c})}
// The only way to claim a business or a company: this button on the maps and lists. base is "" inside index.html and "index.html" on other pages.
// Hidden for anything already claimed, and once you already run a business (or a company).
function claimBtn(p,base){var co=!!p.services;if(co?(isClaimedCo(p)||S.company.onboarded):(isClaimed(p)||S.claimed))return"";
return'<a class="btn cta" href="'+base+'#claim-'+esc(p.id)+'" style="text-decoration:none;min-height:36px;padding:0 14px;font-size:14px">Claim this '+(co?"company":"business")+"</a>"}
function bizName(i){return i.biz==="me"?S.business.name:i.biz}
function revealed(i){return i.status==="inprogress"||i.status==="done"}
function whoFor(i){if(revealed(i))return bizName(i);var k=i.biz==="me"?S.business.kind:i.kind,a=i.biz==="me"?S.business.area:i.area;return k+" in "+a}
function emp(id){return S.employees.filter(function(e){return e.id===id})[0]}
function busy(e){return S.issues.some(function(i){return i.employee===e.id&&(i.status==="offered"||i.status==="inprogress")})}
function isFree(e){return e.available&&!busy(e)}
function freeIn(c){return S.employees.filter(function(e){return e.specialty===c&&isFree(e)})}
var BL={draft:["Draft",""],open:["Looking for a company","warn"],offered:["Offer waiting","warn"],inprogress:["In progress","good"],done:["Done","good"],notneeded:["Not needed",""]};
var CL={open:["Needs an employee","warn"],offered:["Offer sent",""],inprogress:["In progress","good"],done:["Done","good"]};
function pill(t,c){return'<span class="pill '+(c||"")+'">'+esc(t)+"</span>"}
function svc(c){return'<span class="pill svc" style="--svc:'+(SVC[c]||"#475569")+'">'+esc(c)+"</span>"}
function catStatus(c){var a=mine().filter(function(i){return i.cat===c});function f(s){return a.filter(function(i){return i.status===s})[0]}
var x;if(x=f("offered"))return["Offer waiting","warn"];if(x=f("open"))return["Looking for a company","warn"];if(x=f("inprogress"))return[COMP[x.company]||"In progress","good"];if(x=f("draft"))return["Draft",""];if(x=f("done"))return["All done","good"];return["Not needed",""]}
function unread(){return S.messages.filter(function(m){return m.biz==="me"&&m.from==="company"&&!m.read}).length}
function nav(){var u=unread();return S.role==="business"?[["b-issues","Overview"],["b-new","Ask for help"],["b-messages","Messages"+(u?" ("+u+")":"")],["b-companies","Offers"],["b-update","Your requests"],["b-map","Map"],["b-account","Account"]]:[["c-requests","Requests"],["c-messages","Contact businesses"],["c-companies","Businesses you work with"],["c-add","Your team"],["c-map","Map"],["c-profile","Company profile"],["c-account","Account"]]}
var ob={step:1,err:""},req=null,openId=null,dlgKind=null,newErr="";

function menu(){var m=$("#menu"),biz=S.role==="business";
m.innerHTML=S.role?'<p>Signed in as <b>'+esc(S.accounts[S.role].name)+'</b><br>'+(biz?esc(S.business.name):esc(S.company.name))+'</p><button data-go="'+(biz?"b-account":"c-account")+'">Your account</button><button data-a="topmap">Open the map</button><button data-a="logout">Log out</button><button data-a="reset">Reset demo data</button>':'<p>Not signed in</p><button data-a="topmap">Open the map</button><button data-a="reset">Reset demo data</button>';
$("#avatar").textContent=S.role?initials(S.accounts[S.role].name):"NE";
var bs=document.querySelectorAll(".rolesw button");for(var k=0;k<bs.length;k++)bs[k].setAttribute("aria-pressed",String(bs[k].dataset.r===S.role))}

// The dropdown behind the top-left menu button. The same on every page; the admin dashboard lives here.
function siteMenu(){var b=document.getElementById("burger"),m=document.getElementById("navmenu");if(!b||!m)return;
var base=document.body.dataset.page==="index"?"":"index.html";
function a(href,label){return'<a href="'+href+'">'+esc(label)+"</a>"}
function html(){var ready=S.role==="business"?S.claimed:S.role==="company"?S.company.onboarded:false,
h='<p class="mm-h">Go to</p>'+a(base+"#home","Home")+a("map.html","Map")+a(base+"#go-business","Small business")+a(base+"#go-company","Company")+a("company.html","Company sign up or log in");
if(ready)h+='<div class="mm-role"><p class="mm-h">Your pages</p>'+nav().map(function(x){return a(base+"#"+x[0],x[1])}).join("")+"</div>";
return h+'<p class="mm-h">NEhelp team</p>'+a("admin.html","Admin dashboard")}
function shut(){m.hidden=true;b.setAttribute("aria-expanded","false")}
b.addEventListener("click",function(e){e.stopPropagation();if(m.hidden)m.innerHTML=html();m.hidden=!m.hidden;b.setAttribute("aria-expanded",String(!m.hidden))});
m.addEventListener("click",shut);
document.addEventListener("click",function(e){if(!m.hidden&&!e.target.closest("#navmenu"))shut()});
document.addEventListener("keydown",function(e){if(e.key==="Escape")shut()})}
siteMenu();
