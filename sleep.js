/* Дневник состояния · дневник сна v1 · все записи хранятся на устройстве */
(function(){
"use strict";
var KEY="dnevnik-sleep-v1",MAX_ROWS=366;
var form=document.getElementById("sleepForm");if(!form)return;
var $=function(id){return document.getElementById(id)};
function E(t,c,v){var x=document.createElement(t);if(c)x.className=c;if(v!=null)x.textContent=v;return x}
function todayISO(){var d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)}
function pastDays(n){var d=new Date();d.setHours(12,0,0,0);var a=[];
 for(var i=n-1;i>=0;i--){var dt=new Date(d);dt.setDate(dt.getDate()-i);a.push(new Date(dt.getTime()-dt.getTimezoneOffset()*60000).toISOString().slice(0,10))}
 return a;
}
function validDate(x){if(typeof x!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(x))return false;var d=new Date(x+"T12:00:00");return !Number.isNaN(d.getTime())&&new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)===x}
function valid(x){
 return x&&typeof x==="object"&&Number.isFinite(x.hours)&&x.hours>=0&&x.hours<=24
 &&Number.isInteger(x.quality)&&x.quality>=1&&x.quality<=5
 &&Number.isInteger(x.energy)&&x.energy>=1&&x.energy<=5
 &&typeof x.lessNeed==="boolean";
}
function clean(x){return {hours:Math.round(x.hours*2)/2,quality:x.quality,energy:x.energy,lessNeed:x.lessNeed,note:typeof x.note==="string"?x.note.slice(0,240):""}}
function read(){
 try{var v=JSON.parse(localStorage.getItem(KEY)||"{}"),out={};if(!v||typeof v!=="object"||Array.isArray(v))return out;
 Object.keys(v).sort().slice(-MAX_ROWS).forEach(function(k){if(validDate(k)&&valid(v[k]))out[k]=clean(v[k])});
 return out;}catch(e){return {}}
}
function store(d){
 try{var keys=Object.keys(d).sort().slice(-MAX_ROWS),out={};
 keys.forEach(function(k){if(validDate(k)&&valid(d[k]))out[k]=clean(d[k])});
 localStorage.setItem(KEY,JSON.stringify(out));return true;
 }catch(e){return false}
}
function fmtDay(k){var p=k.split("-");return p[2]+"."+p[1]}
function setMsg(v){$("sleepMessage").textContent=v}
function render(){
 var d=read(),days=pastDays(7),week=days.map(function(k){return d[k]}).filter(Boolean);
 var total=week.reduce(function(s,x){return s+x.hours},0),avg=week.length?total/week.length:0;
 $("sleepSummary").textContent=week.length
  ?"За последние 7 дней: "+week.length+" записей · средний сон "+avg.toFixed(1).replace(".",",")+" ч. · среднее качество "+(week.reduce(function(s,x){return s+x.quality},0)/week.length).toFixed(1).replace(".",",")+"/5."
  :"Пока нет записей за последние 7 дней. Начни с любого удобного дня.";
 var lowNeed=week.filter(function(x){return x.lessNeed}).length;
 var highAndShort=week.filter(function(x){return x.lessNeed&&x.hours<=5&&x.energy>=4}).length;
 var note=$("sleepNotice");
 note.hidden=lowNeed===0;
 if(!note.hidden)note.textContent=highAndShort>=2
  ?"За последнюю неделю несколько раз отмечены короткий сон, высокая энергия и уменьшенная потребность во сне. Это не диагноз, но такие изменения важно обсудить с лечащим врачом в ближайшее время."
  :"Ты отметил(а) уменьшенную потребность во сне без обычной усталости. Если это необычно для тебя, особенно вместе с подъёмом энергии или импульсивностью, стоит обсудить с врачом.";
 var chart=$("sleepBars");chart.textContent="";
 days.forEach(function(day){
  var x=d[day],item=E("div","sleep-bar-day");
  var track=E("div","sleep-bar-track"),bar=E("div","sleep-bar-fill");
  var h=x?x.hours:0;
  var dayName=new Date(day+"T12:00:00").toLocaleDateString("ru-RU",{weekday:"short"});
  bar.style.height=(x?Math.max(3,Math.min(100,h/12*100)):0)+"%";
  bar.title=x?h+" ч. · качество "+x.quality+"/5":"Нет записи";
  item.setAttribute("role","img");item.setAttribute("aria-label",day+": "+(x?h+" часов сна":"нет записи"));
  bar.setAttribute("aria-hidden","true");
  track.appendChild(bar);item.appendChild(track);
  item.appendChild(E("span","sleep-bar-label",dayName));
  item.appendChild(E("span","sleep-bar-value",x?h+" ч":"—"));
  chart.appendChild(item);
 });
 var list=$("sleepHistory");list.textContent="";
 var keys=Object.keys(d).sort().reverse().slice(0,30);
 if(!keys.length){list.appendChild(E("p","note","Записей о сне ещё нет."));return}
 keys.forEach(function(k){
  var x=d[k],row=E("div","sleep-history-row"),label=E("div");
  label.appendChild(E("b",null,fmtDay(k)+" · "+x.hours+" ч · качество "+x.quality+"/5"));
  label.appendChild(E("small",null,"Энергия: "+["","очень низкая","низкая","обычная","высокая","очень высокая"][x.energy]+(x.lessNeed?" · меньше потребность во сне":"")));
  if(x.note)label.appendChild(E("small",null,x.note));
  var actions=E("div","sleep-actions");
  var edit=E("button","btn sec sm","Изменить");edit.type="button";edit.addEventListener("click",function(){setFields(k,x);$("sleepDiarySection").scrollIntoView({block:"start",behavior:"smooth"})});
  var del=E("button","btn sec sm","Удалить");del.type="button";del.addEventListener("click",function(){if(!confirm("Удалить запись сна за "+fmtDay(k)+"?"))return;var all=read();delete all[k];if(store(all)){render();setMsg("Запись удалена.")}else setMsg("Не удалось удалить запись.")});
  actions.appendChild(edit);actions.appendChild(del);row.appendChild(label);row.appendChild(actions);list.appendChild(row);
 });
}
function setFields(date,x){
 $("sleepDate").value=date;
 $("sleepHours").value=x?String(x.hours):"";
 $("sleepQuality").value=x?String(x.quality):"";
 $("sleepEnergy").value=x?String(x.energy):"";
 $("sleepLessNeed").checked=x?x.lessNeed:false;
 $("sleepNote").value=x?x.note:"";
 setMsg(x?"Редактирование записи за "+fmtDay(date):"");
}
form.addEventListener("submit",function(e){
 e.preventDefault();
 var date=$("sleepDate").value,hours=Number($("sleepHours").value.replace(",",".")),quality=Number($("sleepQuality").value),energy=Number($("sleepEnergy").value),lessNeed=$("sleepLessNeed").checked;
 if(!validDate(date)||date>todayISO()){setMsg("Выбери существующую дату, не позднее сегодняшней.");return}
 if($("sleepHours").value.trim()===""||!Number.isFinite(hours)||hours<0||hours>24||Math.abs(hours*2-Math.round(hours*2))>.001){setMsg("Укажи часы сна от 0 до 24 с шагом в полчаса.");return}
 var x={hours:hours,quality:quality,energy:energy,lessNeed:lessNeed,note:$("sleepNote").value.trim().slice(0,240)};
 if(!valid(x)){setMsg("Укажи качество сна и уровень энергии.");return}
 var all=read();all[date]=x;
 if(!store(all)){setMsg("Не удалось сохранить запись. Проверь разрешения браузера на хранение данных.");return}
 render();setMsg("Сон за "+fmtDay(date)+" сохранён на этом устройстве.");
});
$("sleepDate").addEventListener("change",function(){
 var d=read()[this.value];setFields(this.value,d||null);
});
$("sleepReset").addEventListener("click",function(){setFields(todayISO(),read()[todayISO()]||null)});
$("sleepClearHistory").addEventListener("click",function(){
 if(!Object.keys(read()).length||!confirm("Удалить все записи о сне на этом устройстве?"))return;
 if(store({})){setFields(todayISO(),null);render();setMsg("История сна очищена.")}else setMsg("Не удалось очистить историю.");
});
window.DnevnikSleep={
 exportEntries:function(){return read()},
 importEntries:function(incoming){
  if(!incoming||typeof incoming!=="object"||Array.isArray(incoming))return 0;
  var all=read(),count=0;
  Object.keys(incoming).slice(0,MAX_ROWS).forEach(function(k){
   if(validDate(k)&&valid(incoming[k])&&k<=todayISO()){all[k]=clean(incoming[k]);count++}
  });
  if(!count)return 0;
  if(!store(all))return 0;
  render();return count;
 }
};
$("sleepDate").max=todayISO();setFields(todayISO(),read()[todayISO()]||null);
render();
})();