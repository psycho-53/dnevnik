/* Дневник состояния · пять необязательных инструментов v1 */
(function () {
 "use strict";
 var todayPanel=document.getElementById("tab-today");
 var trendPanel=document.getElementById("tab-trend");
 var doctorPanel=document.getElementById("doctorSection");
 if(!todayPanel || !trendPanel || !doctorPanel)return;
 var HOME_KEY="dnevnik-companion-home-v1";
 var EVENT_KEY="dnevnik-events-v1";
 var PREP_KEY="dnevnik-doctor-prep-v1";
 var EVENT_MAX=350;
 var DEFAULT_HOME=["checkin","low","sleep","records"];
 var HOME_ITEMS={
  checkin:{label:"Отметить состояние",icon:"chart"},
  low:{label:"Мне сейчас трудно",icon:"heart"},
  sleep:{label:"Мой сон",icon:"moon"},
  records:{label:"Мои записи",icon:"book"},
  events:{label:"Журнал событий",icon:"clock"},
  doctor:{label:"Подготовка к врачу",icon:"file"},
  meds:{label:"Лекарства",icon:"pill"},
  universe:{label:"Моя вселенная",icon:"sparkle"},
  tests:{label:"Тесты",icon:"clipboard"}
 };
 var ICONS={
  chart:'<path d="M4 18V6m5 12v-7m5 7V4m5 14V9"/>',
  heart:'<path d="M20 12c0 5-8 9-8 9S4 17 4 12a4 4 0 0 1 8 0 4 4 0 0 1 8 0Z"/>',
  moon:'<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
  book:'<path d="M4 5.5c3-1.5 5.5-1.5 8 0 2.5-1.5 5-1.5 8 0V20c-3-1.5-5.5-1.5-8 0-2.5-1.5-5-1.5-8 0Z"/><path d="M12 5.5V20"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  file:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h4M9 13h6m-6 4h6"/>',
  pill:'<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-45 12 12)"/><path d="m9 9 6 6"/>',
  sparkle:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
  clipboard:'<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 3h6v4H9zM9 12h6m-6 4h4"/>',
  phone:'<path d="M6 3h4l1.5 5-2.5 2c1 2 2.6 3.6 5 4.5l2-2.5 5 1.5V18c0 1.7-1.3 3-3 3C9.5 21 3 14.5 3 6c0-1.7 1.3-3 3-3Z"/>'
 };
 var KINDS={anxiety:"Сильная тревога",panic:"Паническая атака",unusual:"Необычное переживание",effect:"Побочный эффект",other:"Другое"};
 var $=function(id){return document.getElementById(id)};
 function el(tag,cls,txt){var node=document.createElement(tag);if(cls)node.className=cls;if(txt!==undefined&&txt!==null)node.textContent=txt;return node}
 function icon(name){
  var e=document.createElement("span");e.setAttribute("aria-hidden","true");
  e.innerHTML='<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[name]||ICONS.sparkle)+'</svg>';
  return e;
 }
 function localDate(d){return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)}
 function dateNow(){return localDate(new Date())}
 function localTime(){var d=new Date();return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")}
 function validDate(s){if(typeof s!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;var d=new Date(s+"T12:00:00");return Number.isFinite(d.getTime())&&localDate(d)===s&&s<=dateNow()}
 function readJSON(key,fallback){try{var data=JSON.parse(localStorage.getItem(key)||"null");return data===null?fallback:data}catch(e){return fallback}}
 function writeJSON(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true}catch(e){return false}}
 function safeText(x,n){return typeof x==="string"?x.trim().slice(0,n):""}
 function later(task){requestAnimationFrame(function(){requestAnimationFrame(task)})}
 function go(tab,target){
  var nav=document.querySelector('#nav button[data-t="'+tab+'"]');
  if(nav)nav.click();
  var elTarget=target?$(target):null;
  if(elTarget){
   if(elTarget.tagName==="DETAILS")elTarget.open=true;
   var parentDetails=elTarget.closest("details");if(parentDetails)parentDetails.open=true;
   later(function(){
    var motionOff=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    elTarget.scrollIntoView({block:"start",behavior:motionOff?"auto":"smooth"});
    if(!elTarget.hasAttribute("tabindex"))elTarget.setAttribute("tabindex","-1");
    elTarget.focus({preventScroll:true});
   });
  }
 }
 function readHome(){
  var selected=readJSON(HOME_KEY,DEFAULT_HOME);
  if(!Array.isArray(selected))return DEFAULT_HOME.slice();
  var seen={},out=[];
  selected.forEach(function(x){if(typeof x==="string"&&HOME_ITEMS[x]&&!seen[x]&&out.length<4){seen[x]=true;out.push(x)}});
  return out.length?out:DEFAULT_HOME.slice();
 }
 function renderHome(){
  var home=$("companionShortcuts");if(!home)return;
  home.textContent="";
  readHome().forEach(function(id){
   var info=HOME_ITEMS[id],btn=el("button","companion-shortcut");
   btn.type="button";btn.dataset.action=id;
   btn.appendChild(icon(info.icon));btn.appendChild(el("span",null,info.label));
   home.appendChild(btn);
  });
  document.querySelectorAll("#companionPicks input").forEach(function(node){node.checked=readHome().indexOf(node.value)>=0});
 }
 function buildHome(){
  var box=el("section","companion-section");box.id="companionHome";
  box.innerHTML='<div class="companion-top"><div><div class="companion-visual-title">КОГДА НУЖНО ЧТО-ТО ЕЩЁ</div><h2>Под рукой</h2><p>Твои быстрые переходы. Можно выбрать другие.</p></div><button type="button" id="companionConfigToggle" class="companion-edit-btn" aria-expanded="false" aria-controls="companionConfig">Настроить</button></div><div class="companion-shortcuts" id="companionShortcuts"></div><div id="companionConfig" class="companion-config" hidden><p>Выбери от одного до четырёх действий.</p><div id="companionPicks" class="companion-picks"></div><p class="companion-config-message" id="companionConfigMessage" role="status"></p><div class="companion-actions"><button type="button" id="companionConfigSave" class="companion-secondary">Применить</button><button type="button" id="companionConfigReset" class="companion-secondary">Вернуть как было</button></div></div>';
  /* Keep the three daily scales first. Support and shortcuts follow the check-in. */
  var checkin=todayPanel.querySelector(".checkin-primary"),support=todayPanel.querySelector(".today-support-row");
  if(checkin){
   checkin.insertAdjacentElement("afterend",box);
   if(support)checkin.insertAdjacentElement("afterend",support);
  }else todayPanel.appendChild(box);
  var header=todayPanel.querySelector(".page-head > div");
  if(header&&!document.getElementById("companionCalmShortcut")){
   var calm=el("button","companion-calm-open","♡ Сегодня нет сил");
   calm.type="button";calm.id="companionCalmShortcut";
   calm.setAttribute("aria-haspopup","dialog");
   calm.addEventListener("click",openCalm);
   header.appendChild(calm);
  }
  var pickBox=$("companionPicks");
  Object.keys(HOME_ITEMS).forEach(function(k){
   var row=el("label","companion-pick"),inp=el("input");inp.type="checkbox";inp.value=k;inp.checked=readHome().indexOf(k)>=0;row.appendChild(inp);row.appendChild(el("span",null,HOME_ITEMS[k].label));pickBox.appendChild(row);
  });
  $("companionConfigToggle").addEventListener("click",function(){
   var config=$("companionConfig"),show=config.hidden;
   config.hidden=!show;this.setAttribute("aria-expanded",String(show));
   this.textContent=show?"Закрыть":"Настроить";
   $("companionConfigMessage").textContent="";
  });
  $("companionConfigSave").addEventListener("click",function(){
   var selected=Array.from(document.querySelectorAll("#companionPicks input:checked")).map(function(x){return x.value});
   if(selected.length<1||selected.length>4){$("companionConfigMessage").textContent="Нужно выбрать от одного до четырёх действий.";return}
   if(!writeJSON(HOME_KEY,selected)){$("companionConfigMessage").textContent="Браузер не разрешил сохранить настройки.";return}
   renderHome();$("companionConfigMessage").textContent="Быстрые действия обновлены.";
  });
  $("companionConfigReset").addEventListener("click",function(){
   if(writeJSON(HOME_KEY,DEFAULT_HOME)){$("companionConfigMessage").textContent="Вернули исходные четыре кнопки.";renderHome()}
  });
  $("companionShortcuts").addEventListener("click",function(e){
   var btn=e.target.closest("button[data-action]");if(btn)openShortcut(btn.dataset.action);
  });
  renderHome();
 }
 function makeCalm(){
  var modal=el("div","companion-overlay");modal.id="companionCalm";modal.hidden=true;
  modal.innerHTML='<section class="companion-calm-card" role="dialog" aria-modal="true" aria-labelledby="companionCalmTitle"><div class="companion-visual-title">СПОКОЙНЫЙ РЕЖИМ</div><h2 id="companionCalmTitle">Сегодня нет сил</h2><p>Не нужно ничего объяснять или выполнять всё сразу. Выбери только одно действие — если хочется.</p><div class="companion-calm-controls"><button type="button" class="companion-calm-action" data-calm="checkin">Отметить состояние</button><button type="button" class="companion-calm-action" data-calm="helps">Что мне помогает</button><button type="button" class="companion-calm-action" data-calm="contact">Связаться с близким</button></div><p id="companionCalmContact" class="companion-calm-contact" role="status" hidden></p><button id="companionCalmExit" type="button" class="companion-calm-exit">Вернуться в дневник</button><p class="companion-calm-note">Ты ничего не обязан(а) отмечать. Можно просто закрыть этот экран.</p><a class="companion-calm-emergency" href="#helpEmergency" id="companionCalmSafety">Если сейчас небезопасно — где найти срочную помощь</a></section>';
  document.body.appendChild(modal);
  ["checkin","helps","contact"].forEach(function(k){
   var btn=modal.querySelector('[data-calm="'+k+'"]');
   btn.insertBefore(icon(k==="checkin"?"chart":k==="helps"?"heart":"phone"),btn.firstChild);
  });
  modal.addEventListener("click",function(e){
   var btn=e.target.closest("[data-calm]");if(!btn)return;
   if(btn.dataset.calm==="checkin"){closeCalm();go("today","scales")}
   if(btn.dataset.calm==="helps"){closeCalm();go("help","helpPlanDetails")}
   if(btn.dataset.calm==="contact"){
    var p=readJSON("dnevnik-support-plan-v1",{}),raw=p&&typeof p.trustedPhone==="string"?p.trustedPhone:"";
    var phone=raw.replace(/[^\d+]/g,"");
    if(/^\+?\d{3,16}$/.test(phone)){window.location.href="tel:"+phone}
    else {$("companionCalmContact").hidden=false;$("companionCalmContact").textContent="Номер близкого пока не указан в плане поддержки. Можно добавить его в разделе «Помощь»."}
   }
  });
  $("companionCalmExit").addEventListener("click",closeCalm);
  $("companionCalmSafety").addEventListener("click",function(e){e.preventDefault();closeCalm();go("help","helpEmergency")});
  modal.addEventListener("keydown",function(e){if(e.key==="Escape"){closeCalm();return}if(e.key==="Tab"){
   var focusables=Array.from(modal.querySelectorAll('button,a[href]')).filter(function(x){return !x.disabled&&x.offsetParent!==null});
   if(!focusables.length)return;var first=focusables[0],last=focusables[focusables.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }});
 }
 var oldFocus=null;
 function openCalm(){
  oldFocus=document.activeElement;
  $("companionCalmContact").hidden=true;
  $("companionCalm").hidden=false;document.body.style.overflow="hidden";
  $("companionCalm").querySelector(".companion-calm-action").focus();
 }
 function closeCalm(){
  $("companionCalm").hidden=true;document.body.style.overflow="";
  if(oldFocus&&typeof oldFocus.focus==="function")oldFocus.focus();
 }
 function openShortcut(id){
  if(id==="low"){openCalm();return}
  if(id==="checkin"){go("today","scales");return}
  if(id==="sleep"){go("tests","sleepDiarySection");return}
  if(id==="records"){go("trend","companionInsightSection");return}
  if(id==="events"){go("trend","companionEventSection");return}
  if(id==="doctor"){go("more","doctorSection");return}
  if(id==="meds"){go("more","medSection");return}
  if(id==="universe"){go("universe","systemSvg");return}
  if(id==="tests"){go("tests","screeningCatalog");return}
 }
 function makeDirectory(){
  var more=$("tab-more");
  if(!more)return;
  var section=el("section","companion-section companion-directory");
  section.id="companionDirectory";
  section.innerHTML='<div class="companion-visual-title">БЫСТРАЯ НАВИГАЦИЯ</div><h2>Куда перейти?</h2><p class="companion-micro">Нужные разделы в одно касание, без поиска в длинных настройках.</p><div class="companion-directory-grid" id="companionDirectoryGrid"></div>';
  var targets=[
   ["records","Мои записи"],["events","Журнал событий"],["sleep","Дневник сна"],
   ["meds","Лекарства"],["doctor","Сводка врачу"],["universe","Моя вселенная"]
  ];
  var grid=section.querySelector("#companionDirectoryGrid");
  targets.forEach(function(item){
   var btn=el("button","companion-directory-btn");
   btn.type="button";btn.dataset.action=item[0];
   btn.appendChild(icon(HOME_ITEMS[item[0]].icon));
   btn.appendChild(el("span",null,item[1]));
   grid.appendChild(btn);
  });
  var guide=more.querySelector(".guide-entry");
  if(guide)more.insertBefore(section,guide);else more.appendChild(section);
  grid.addEventListener("click",function(e){
   var btn=e.target.closest("button[data-action]");
   if(btn)openShortcut(btn.dataset.action);
  });
 }
 function makeReturnLinks(){
  [["trend","МОИ ЗАПИСИ"],["universe","МОЯ ВСЕЛЕННАЯ"]].forEach(function(item){
   var tab=$("tab-"+item[0]),heading=tab&&tab.querySelector("h1");
   if(!heading)return;
   var bar=el("div","companion-return-row");
   var back=el("button","companion-return-btn","← Сегодня");
   var more=el("button","companion-return-btn","Все инструменты");
   back.type="button";more.type="button";
   back.addEventListener("click",function(){go("today")});
   more.addEventListener("click",function(){go("more","companionDirectory")});
   bar.appendChild(back);bar.appendChild(more);
   heading.insertAdjacentElement("afterend",bar);
  });
 }
 function cleanEvent(row){
  if(!row||typeof row!=="object"||Array.isArray(row))return null;
  var date=safeText(row.date,10),time=safeText(row.time,5);
  if(!validDate(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||!Object.prototype.hasOwnProperty.call(KINDS,row.kind))return null;
  var id=safeText(row.id,60);if(!/^[a-zA-Z0-9_-]{5,60}$/.test(id))return null;
  return {id:id,date:date,time:time,kind:row.kind,note:safeText(row.note,240)};
 }
 function readEvents(){
  var value=readJSON(EVENT_KEY,[]);
  return Array.isArray(value)?value.map(cleanEvent).filter(Boolean).slice(-EVENT_MAX):[];
 }
 function saveEvents(rows){return writeJSON(EVENT_KEY,rows.slice(-EVENT_MAX))}
 function renderEvents(){
  var list=$("companionEventList");if(!list)return;
  list.textContent="";
  var records=readEvents().sort(function(a,b){return (b.date+b.time).localeCompare(a.date+a.time)}).slice(0,15);
  if(!records.length){list.appendChild(el("li","companion-micro","Пока событий нет. Заполнять журнал необязательно."));return}
  records.forEach(function(x){
   var row=el("li","companion-record"),copy=el("div");
   copy.appendChild(el("b",null,KINDS[x.kind]));
   copy.appendChild(el("small",null,x.date.split("-").reverse().join(".")+" · "+x.time));
   if(x.note)copy.appendChild(el("small",null,x.note));
   var remove=el("button",null,"Удалить");remove.type="button";remove.dataset.eventDelete=x.id;remove.setAttribute("aria-label","Удалить событие "+x.date+" "+x.time);
   row.appendChild(copy);row.appendChild(remove);list.appendChild(row);
  });
 }
 function makeEvents(){
  var box=el("section","companion-section");
  box.id="companionEventSection";
  box.innerHTML='<div class="companion-visual-title">НЕОБЯЗАТЕЛЬНО · В ЛЮБОЙ МОМЕНТ</div><h2>Журнал событий</h2><p class="companion-micro">Отметь отдельное переживание с датой и временем. Это твоя запись, а не диагноз.</p><form id="companionEventForm"><div class="companion-field-grid"><label class="companion-field">Событие<select id="companionEventKind" required><option value="anxiety">Сильная тревога</option><option value="panic">Паническая атака</option><option value="unusual">Необычное переживание</option><option value="effect">Побочный эффект</option><option value="other">Другое</option></select></label><label class="companion-field">Дата<input id="companionEventDate" type="date" required></label><label class="companion-field">Время<input id="companionEventTime" type="time" required></label><label class="companion-field companion-field-span">Что происходило? (по желанию)<textarea id="companionEventNote" maxlength="240" rows="2" placeholder="Коротко, своими словами"></textarea></label></div><div class="companion-actions"><button type="submit" class="btn">Сохранить событие</button></div><p id="companionEventMessage" class="companion-message" role="status"></p></form><h3 style="font-size:15px;margin:16px 0 0">Недавние события</h3><ul id="companionEventList" class="companion-records"></ul>';
  var history=trendPanel.querySelector("section:last-of-type");
  if(history)trendPanel.insertBefore(box,history);else trendPanel.appendChild(box);
  $("companionEventDate").value=dateNow();$("companionEventDate").max=dateNow();$("companionEventTime").value=localTime();
  $("companionEventForm").addEventListener("submit",function(e){
   e.preventDefault();
   var date=$("companionEventDate").value,time=$("companionEventTime").value,kind=$("companionEventKind").value;
   if(!validDate(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||!KINDS[kind]||(date===dateNow()&&time>localTime())){$("companionEventMessage").textContent="Проверь дату и время: событие не может быть в будущем.";return}
   var x={id:"evt-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9),date:date,time:time,kind:kind,note:safeText($("companionEventNote").value,240)};
   var records=readEvents();records.push(x);
   if(!saveEvents(records)){$("companionEventMessage").textContent="Не получилось сохранить. Проверь хранилище браузера.";return}
   $("companionEventNote").value="";
   $("companionEventMessage").textContent="Событие сохранено только на этом устройстве.";
   renderEvents();renderInsights();
  });
  $("companionEventList").addEventListener("click",function(e){
   var b=e.target.closest("[data-event-delete]");if(!b)return;
   if(!confirm("Удалить это событие из журнала?"))return;
   var records=readEvents().filter(function(x){return x.id!==b.dataset.eventDelete});
   if(saveEvents(records)){renderEvents();renderInsights();$("companionEventMessage").textContent="Событие удалено."}
  });
  renderEvents();
 }
 function dateFrom(days){var d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-days);return localDate(d)}
 function dailyRows(days){
  var value=readJSON("dnevnik-v1",{}),from=dateFrom(days-1),now=dateNow();
  if(!value||typeof value!=="object"||Array.isArray(value))return [];
  return Object.keys(value).filter(function(k){return k>=from&&k<=now&&validDate(k)&&value[k]&&typeof value[k]==="object"}).sort().map(function(k){return {date:k,entry:value[k]}});
 }
 function normMood(entry){
  var v=entry&&entry.v&&entry.v.m,d=entry&&entry.d&&entry.d.m;
  if(!Number.isInteger(v)||!Number.isInteger(d)||d<2||d>10||v<1||v>d)return null;
  return 1+(v-1)/(d-1)*4;
 }
 function insightsText(){
  var result=[],rows=dailyRows(14),mood=rows.map(function(x){return {day:x.date,value:normMood(x.entry),g:x.entry.g}}).filter(function(x){return x.value!==null});
  if(mood.length>=5){
   var low=mood.filter(function(x){return x.value<=2}).length;
   if(low>=2)result.push("Среди "+mood.length+" дней с отметками настроения "+low+" раз оценка была в нижней части шкалы. Это описание записей, а не оценка состояния здоровья.");
   else result.push("За последние 14 дней есть "+mood.length+" отметок настроения. Пропущенные дни в расчёт не входят.");
  }
  var sleep=readJSON("dnevnik-sleep-v1",{}),short=0,total=0,from=dateFrom(13),now=dateNow();
  if(sleep&&typeof sleep==="object"&&!Array.isArray(sleep)){
   Object.keys(sleep).forEach(function(k){
    if(k<from||k>now||!validDate(k))return;
    var n=sleep[k]&&sleep[k].hours;
    if(typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=24){total++;if(n<=6)short++}
   });
  }
  if(total>=3&&short>=1)result.push("В "+short+" из "+total+" дней с отметками сна за последние две недели сон длился не больше шести часов.");
  var walking=mood.filter(function(x){return Array.isArray(x.g)&&x.g.indexOf("wk")>=0}),other=mood.filter(function(x){return !Array.isArray(x.g)||x.g.indexOf("wk")<0});
  if(walking.length>=3&&other.length>=3){
   var avg=function(a){return a.reduce(function(s,x){return s+x.value},0)/a.length};
   var a=avg(walking),b=avg(other);
   if(Math.abs(a-b)>=.6){
    var relation=a>b?"выше":"ниже";
    result.push("В дни с отмеченной прогулкой среднее настроение было "+relation+" ("+a.toFixed(1)+" против "+b.toFixed(1)+" из 5). Это совпадение в записях, не доказательство причины.");
   }
  }
  var events=readEvents().filter(function(x){return x.date>=from&&x.date<=now});
  if(events.length)result.push("За последние 14 дней ты отметил(а) "+events.length+" отдельных событий в журнале. Их можно обсудить со специалистом, если хочется.");
  if(!result.length)result.push("Пока мало записей для наблюдений. Можно просто продолжать отмечать состояние в удобном темпе.");
  return result.slice(0,3);
 }
 function renderInsights(){
  var list=$("companionInsights");if(!list)return;
  list.textContent="";
  insightsText().forEach(function(t){list.appendChild(el("li",null,t))});
  var empty=$("companionInsightsEmpty");
  if(empty)empty.hidden=dailyRows(14).length>0;
 }
 function makeInsights(){
  var box=el("section","companion-section");
  box.id="companionInsightSection";
  box.innerHTML='<div class="companion-visual-title">ДИНАМИКА БЕЗ СЛОЖНЫХ ГРАФИКОВ</div><h2>Что видно в моих записях?</h2><p class="companion-micro">Короткие наблюдения по последним 14 дням. Только то, что ты сам(а) отметил(а), без диагноза или прогнозов.</p><ul id="companionInsights" class="companion-insights" aria-live="polite"></ul><div class="companion-empty" id="companionInsightsEmpty" hidden><span>Начни с одной отметки — этого достаточно.</span><button type="button" id="companionEmptyCheckin" class="companion-secondary">Отметить состояние</button></div><p class="companion-note">Совпадения не доказывают причину. Если тебя что-то беспокоит, покажи данные специалисту.</p>';
  var oldInsights=$("ins"),section=oldInsights?oldInsights.closest("section"):null;
  if(section)section.parentNode.insertBefore(box,section);else trendPanel.appendChild(box);
  $("companionEmptyCheckin").addEventListener("click",function(){go("today","scales")});
  renderInsights();
 }
 function readPrep(){
  var p=readJSON(PREP_KEY,{});
  if(!p||typeof p!=="object"||Array.isArray(p))p={};
  return {changes:safeText(p.changes,300),difficult:safeText(p.difficult,300),ask:safeText(p.ask,300)};
 }
 function prepData(){
  return {changes:safeText($("companionPrepChanges").value,300),difficult:safeText($("companionPrepDifficult").value,300),ask:safeText($("companionPrepAsk").value,300)};
 }
 function makeDoctor(){
  var box=el("div","companion-doctor-prep");
  box.id="companionDoctorPrep";
  box.innerHTML='<div class="companion-visual-title">ПОДГОТОВКА К ПРИЁМУ</div><h3>Три коротких вопроса</h3><p class="companion-micro">Можно заполнить один или все. Ответы сохраняются как черновик только в этом браузере.</p><label class="companion-field">Что изменилось за последнее время?<textarea id="companionPrepChanges" maxlength="300" rows="2" placeholder="Например: стал(а) хуже спать"></textarea></label><label class="companion-field">Что сейчас мешает жить или работать?<textarea id="companionPrepDifficult" maxlength="300" rows="2" placeholder="Можно оставить пустым"></textarea></label><label class="companion-field">О чём хочу спросить врача?<textarea id="companionPrepAsk" maxlength="300" rows="2" placeholder="Один или несколько вопросов"></textarea></label><div class="companion-actions"><button class="btn sec" id="companionDoctorBuild" type="button">Собрать подготовку</button></div><p class="companion-message" id="companionDoctorMessage" role="status"></p><p class="companion-note">В предпросмотр попадут твои ответы и события за последние 14 дней вместе с выбранной сводкой. Ничего не отправляется автоматически.</p>';
  var generate=$("doctorGenerate");if(generate&&generate.parentNode)generate.parentNode.parentNode.insertBefore(box,generate.parentNode);
  else doctorPanel.appendChild(box);
  var saved=readPrep();
  $("companionPrepChanges").value=saved.changes;
  $("companionPrepDifficult").value=saved.difficult;
  $("companionPrepAsk").value=saved.ask;
  ["companionPrepChanges","companionPrepDifficult","companionPrepAsk"].forEach(function(id){
   $(id).addEventListener("input",function(){writeJSON(PREP_KEY,prepData())});
  });
  $("companionDoctorBuild").addEventListener("click",function(){
   var p=prepData();writeJSON(PREP_KEY,p);
   var lines=["ПОДГОТОВКА К ПРИЁМУ"];
   if(p.changes)lines.push("Что изменилось: "+p.changes);
   if(p.difficult)lines.push("Что мешает в жизни: "+p.difficult);
   if(p.ask)lines.push("Вопросы врачу: "+p.ask);
   if(lines.length===1)lines.push("Личных ответов пока нет.");
   var ev=readEvents().filter(function(x){return x.date>=dateFrom(13)}).sort(function(a,b){return(a.date+a.time).localeCompare(b.date+b.time)}).slice(-10);
   if(ev.length){
    lines.push("","ОТДЕЛЬНЫЕ СОБЫТИЯ ЗА 14 ДНЕЙ");
    ev.forEach(function(x){lines.push(x.date+" "+x.time+" — "+KINDS[x.kind]+(x.note?": "+x.note:""))});
   }
   var normal=$("doctorGenerate"),preview=$("doctorPreview");
   if(normal)normal.click();
   var base=preview.value.trim();
   if(base.startsWith("Выбери хотя бы один"))base="";
   preview.value=(base?base+"\n\n":"")+lines.join("\n");
   preview.dispatchEvent(new Event("input",{bubbles:true}));
   $("doctorCopy").disabled=false;$("doctorDownload").disabled=false;
   $("companionDoctorMessage").textContent="Готово. Проверь текст ниже, затем скопируй или сохрани его.";
   preview.scrollIntoView({block:"start",behavior:"smooth"});preview.focus({preventScroll:true});
  });
 }
 function exportData(){return {events:readEvents(),home:readHome(),prep:readPrep()}}
 function importData(data){
  if(!data||typeof data!=="object"||Array.isArray(data))return {events:0};
  var imported=0;
  if(Array.isArray(data.events)){
   var current=readEvents(),seen={};
   current.forEach(function(x){seen[x.id]=true});
   data.events.slice(-EVENT_MAX).forEach(function(x){
    var item=cleanEvent(x);if(item&&!seen[item.id]){current.push(item);seen[item.id]=true;imported++}
   });
   if(imported&&!saveEvents(current))imported=0;
  }
  if(Array.isArray(data.home)){
   var items=[],seenHome={};
   data.home.forEach(function(x){if(typeof x==="string"&&HOME_ITEMS[x]&&!seenHome[x]&&items.length<4){seenHome[x]=true;items.push(x)}});
   if(items.length)writeJSON(HOME_KEY,items);
  }
  if(data.prep&&typeof data.prep==="object"&&!Array.isArray(data.prep)){
   var prep={changes:safeText(data.prep.changes,300),difficult:safeText(data.prep.difficult,300),ask:safeText(data.prep.ask,300)};
   writeJSON(PREP_KEY,prep);
   if($("companionPrepChanges")){$("companionPrepChanges").value=prep.changes;$("companionPrepDifficult").value=prep.difficult;$("companionPrepAsk").value=prep.ask}
  }
  renderEvents();renderInsights();renderHome();
  return {events:imported};
 }
 buildHome();makeCalm();makeDirectory();makeReturnLinks();makeEvents();makeInsights();makeDoctor();
 document.getElementById("nav").addEventListener("click",function(e){var btn=e.target.closest("button[data-t]");if(btn&&btn.dataset.t==="trend")renderInsights()});
 document.addEventListener("visibilitychange",function(){if(!document.hidden)renderInsights()});
 window.DnevnikCompanion={exportData:exportData,importData:importData,renderInsights:renderInsights,renderEvents:renderEvents};
})();