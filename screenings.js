/* Дневник состояния: локальные самоопросники v1 */
(function(){
"use strict";
var KEY="dnevnik-screenings-v1";
var defs={
 phq9:{
  title:"Депрессивные симптомы (PHQ-9)",
  period:"За последние две недели",
  note:"9 вопросов · 0–27 баллов. Оценка выраженности симптомов, не постановка диагноза.",
  options:["Совсем нет","Несколько дней","Больше половины дней","Почти каждый день"],
  items:[
   "Мало интереса или удовольствия от обычных дел",
   "Подавленность, грусть или ощущение безнадёжности",
   "Трудности со сном: сложно уснуть, частые пробуждения или сон больше обычного",
   "Усталость, ощущение нехватки сил",
   "Снижение аппетита или переедание",
   "Ощущение, что вы неудачник или подвели себя либо близких",
   "Трудности с концентрацией, например при чтении или просмотре передачи",
   "Заметная замедленность движений или речи; либо, наоборот, сильное беспокойство и неусидчивость",
   "Мысли, что лучше было бы умереть, или мысли о причинении вреда себе"
  ],
  limit:3
 },
 asrm:{
  title:"Признаки повышенной активности (по мотивам ASRM)",
  period:"За последние семь дней по сравнению с обычным состоянием",
  note:"5 областей · 0–20 баллов. Неофициальная русская адаптация по мотивам ASRM; не клиническая диагностика.",
  items:[
   "Я чувствовал(а) себя более радостно или воодушевлённо, чем обычно",
   "Я ощущал(а) необычно сильную уверенность в себе",
   "Мне требовалось меньше сна, и при этом я не чувствовал(а) усталости",
   "Я разговаривал(а) заметно больше обычного",
   "Я был(а) заметно активнее обычного: в делах, общении или других занятиях"
  ],
  choices:[
   ["Никаких изменений","Иногда ощущал(а)","Часто ощущал(а)","Большую часть времени","Почти постоянно"],
   ["Обычный уровень уверенности","Изредка увереннее","Часто увереннее","Заметно увереннее почти всегда","Чрезвычайно уверен(а) постоянно"],
   ["Сна требовалось как обычно","Изредка требовалось меньше","Часто требовалось меньше","Почти всегда требовалось меньше","Почти не спал(а) и не уставал(а)"],
   ["Разговаривал(а) как обычно","Иногда больше","Часто больше","Значительно больше почти всегда","Говорил(а) непрерывно, трудно остановиться"],
   ["Активность обычная","Иногда выше обычной","Часто выше обычной","Почти постоянно выше обычной","Постоянно чем-то занят(а), трудно остановиться"]
  ],
  limit:4
 }
};
var active="phq9", answers={phq9:Array(9).fill(null),asrm:Array(5).fill(null)};
var box=document.getElementById("screeningQuestions");
if(!box)return;
function node(tag,className,text){
 var n=document.createElement(tag);
 if(className)n.className=className;
 if(text!=null)n.textContent=text;
 return n;
}
function fromStorage(){
 try{
  var x=JSON.parse(localStorage.getItem(KEY)||"[]");
  if(!Array.isArray(x))return [];
  return x.slice(-300).filter(validRow).map(function(r){
   return {id:r.id.slice(0,90),kind:r.kind,time:r.time,answers:r.answers.slice()};
  });
 }catch(e){return []}
}
function validRow(r){
 return !!r&&typeof r==="object"&&typeof r.id==="string"&&r.id.length<=90&&r.id.length>0
  &&(r.kind==="phq9"||r.kind==="asrm")&&typeof r.time==="string"&&r.time.length<=40
  &&Array.isArray(r.answers)&&r.answers.length===defs[r.kind].items.length
  &&r.answers.every(function(v){return Number.isInteger(v)&&v>=0&&v<=defs[r.kind].limit});
}
function writeStore(rows){
 try{localStorage.setItem(KEY,JSON.stringify(rows.slice(-300)));return true}catch(e){return false}
}
function score(a){return a.reduce(function(sum,v){return sum+v},0)}
function dateLabel(v){
 var dt=new Date(v);
 return Number.isNaN(dt.getTime())?v.slice(0,16):dt.toLocaleString("ru-RU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
}
function evaluation(kind,points,a){
 if(kind==="phq9"){
  var levels=points<=4?"минимальная":points<=9?"лёгкая":points<=14?"умеренная":points<=19?"выраженная":"очень выраженная";
  var advice=points>=10?"Результат стоит обсудить с врачом или специалистом по психическому здоровью.":"Если симптомы мешают повседневной жизни, обсудите их со специалистом независимо от баллов.";
  if(points>=20)advice="Выраженность симптомов высокая. Рекомендуется обратиться за профессиональной оценкой в ближайшее время.";
  return {title:"Выраженность симптомов: "+levels,description:advice,urgent:a[8]>0};
 }
 var title=points>=6?"Есть заметные признаки повышенной активации":"Выраженных признаков повышенной активации по ответам немного";
 var advice=points>=6
  ?"Такой результат — повод обсудить изменения сна, активности и настроения с врачом. Он не означает манию или биполярное расстройство."
  :"Низкий результат не исключает гипоманию или манию. Если поведение заметно изменилось, стоит поговорить со специалистом.";
 if(a[2]===4)advice+=" Особенно важно обсудить почти полное отсутствие потребности во сне.";
 return {title:title,description:advice,urgent:false};
}
function safetyText(){
 return "Вы отметили мысли о смерти или причинении вреда себе. Даже при небольшой общей сумме это важно обсудить со специалистом как можно скорее. Если сейчас есть опасность причинить себе вред, обратитесь в местную экстренную службу (в ЕС — 112) и попросите близкого человека побыть с вами.";
}
function render(){
 document.querySelectorAll("[data-screening-kind]").forEach(function(btn){
  btn.setAttribute("aria-pressed",String(btn.dataset.screeningKind===active));
 });
 var def=defs[active],a=answers[active];
 document.getElementById("screeningTitle").textContent=def.title;
 document.getElementById("screeningPeriod").textContent=def.period;
 document.getElementById("screeningInfo").textContent=def.note;
 box.textContent="";
 def.items.forEach(function(q,i){
  var field=node("fieldset","screening-question");
  var legend=node("legend","screening-legend",(i+1)+". "+q);
  field.appendChild(legend);
  var choices=node("div","screening-choices");
  var labels=def.choices?def.choices[i]:def.options;
  labels.forEach(function(label,j){
   var n=node("label","screening-choice");
   var input=node("input");
   input.type="radio";input.name="screening-"+active+"-"+i;
   input.value=String(j);input.checked=a[i]===j;
   input.dataset.question=String(i);
   input.setAttribute("aria-label",label);
   n.appendChild(input);
   n.appendChild(node("span",null,label));
   choices.appendChild(n);
  });
  field.appendChild(choices);box.appendChild(field);
 });
 document.getElementById("screeningValidation").textContent="";
 document.getElementById("screeningResultSection").hidden=true;
 updateProgress();
}
function updateProgress(){
 var a=answers[active],done=a.filter(function(v){return v!==null}).length;
 document.getElementById("screeningProgress").textContent="Отвечено: "+done+" из "+a.length+". Можно пропустить опросник в любой момент.";
 var warn=document.getElementById("screeningInlineSafety");
 warn.hidden=!(active==="phq9"&&a[8]!==null&&a[8]>0);
 if(!warn.hidden)warn.textContent=safetyText();
}
function renderResult(kind,answersRow){
 var a=answersRow||answers[kind],total=score(a),e=evaluation(kind,total,a);
 var out=document.getElementById("screeningResultSection");
 out.hidden=false;out.textContent="";
 out.appendChild(node("div","eyebrow","РЕЗУЛЬТАТ САМООПРОСА"));
 out.appendChild(node("h2",null,e.title));
 out.appendChild(node("p","screening-total",total+" / "+(kind==="phq9"?27:20)+" баллов"));
 out.appendChild(node("p","note",e.description));
 if(e.urgent){
  var notice=node("div","screening-safety");notice.setAttribute("role","alert");notice.textContent=safetyText();out.appendChild(notice);
 }
 out.appendChild(node("p","note",kind==="phq9"
  ?"PHQ-9 показывает выраженность депрессивных симптомов за 2 недели, но не устанавливает диагноз."
  :"Это ориентировочный чек-лист по мотивам ASRM (порог 6 баллов). Русские формулировки не проходили отдельной проверки точности; диагноз по сумме ставить нельзя."));
 if(kind==="asrm")out.appendChild(node("p","note","При резком уменьшении сна, рискованных поступках, сильном возбуждении или необычных убеждениях лучше обратиться за медицинской помощью, даже если сумма невысокая."));
 var b=node("button","btn sec sm","К истории результатов");b.type="button";
 b.addEventListener("click",function(){document.getElementById("screeningHistorySection").scrollIntoView({behavior:"smooth",block:"start"})});
 out.appendChild(b);
}
function history(){
 var rows=fromStorage().slice().reverse();
 var list=document.getElementById("screeningHistory");
 list.textContent="";
 if(!rows.length){list.appendChild(node("p","note","Сохранённых результатов пока нет."));return}
 rows.forEach(function(r){
  var item=node("div","screening-history-row");
  var info=node("div");
  info.appendChild(node("b",null,(r.kind==="phq9"?"PHQ-9":"Активация") +" · "+score(r.answers)+"/"+(r.kind==="phq9"?"27":"20")));
  info.appendChild(node("small",null,dateLabel(r.time)));
  if(r.kind==="phq9"&&r.answers[8]>0)info.appendChild(node("small",null,"Отмечены мысли о причинении вреда себе — важна оценка специалистом"));
  var actions=node("div","screening-history-actions");
  var view=node("button","btn sec sm","Открыть");view.type="button";view.addEventListener("click",function(){
   active=r.kind;render();renderResult(r.kind,r.answers);
   document.getElementById("screeningResultSection").scrollIntoView({behavior:"smooth",block:"start"});
  });
  var del=node("button","btn sec sm","Удалить");del.type="button";del.addEventListener("click",function(){
   if(!confirm("Удалить этот результат опросника?"))return;
   var ok=writeStore(fromStorage().filter(function(x){return x.id!==r.id}));
   if(!ok){document.getElementById("screeningValidation").textContent="Не удалось удалить результат: хранилище недоступно.";return}
   history();
  });
  actions.appendChild(view);actions.appendChild(del);item.appendChild(info);item.appendChild(actions);list.appendChild(item);
 });
}
function save(){
 var a=answers[active],missing=a.filter(function(v){return v===null}).length;
 if(missing){
  document.getElementById("screeningValidation").textContent="Пожалуйста, ответьте на все вопросы: осталось "+missing+".";
  return;
 }
 var rows=fromStorage();
 rows.push({id:String(Date.now())+"-"+Math.random().toString(36).slice(2,10),kind:active,time:new Date().toISOString(),answers:a.slice()});
 if(!writeStore(rows)){document.getElementById("screeningValidation").textContent="Не удалось сохранить ответы. Проверьте настройки хранения данных браузера.";return}
 document.getElementById("screeningValidation").textContent="Результат сохранён только в этом браузере.";
 renderResult(active,a);history();
 document.getElementById("screeningResultSection").scrollIntoView({behavior:"smooth",block:"nearest"});
}
box.addEventListener("change",function(e){
 var input=e.target;
 if(!input.matches('input[type="radio"][data-question]'))return;
 var q=Number(input.dataset.question),v=Number(input.value);
 if(q>=0&&q<answers[active].length&&Number.isInteger(v)&&v>=0&&v<=defs[active].limit){
  answers[active][q]=v;
  document.getElementById("screeningValidation").textContent="";
  document.getElementById("screeningResultSection").hidden=true;
  updateProgress();
 }
});
document.querySelectorAll("[data-screening-kind]").forEach(function(b){
 b.addEventListener("click",function(){active=b.dataset.screeningKind;render()});
});
document.getElementById("screeningSave").addEventListener("click",save);
document.getElementById("screeningReset").addEventListener("click",function(){
 answers[active]=Array(defs[active].items.length).fill(null);render();
});
document.getElementById("screeningClearHistory").addEventListener("click",function(){
 if(!fromStorage().length)return;
 if(!confirm("Удалить всю историю самоопросников с этого устройства?"))return;
 if(!writeStore([])){document.getElementById("screeningValidation").textContent="Не удалось очистить историю.";return}
 history();
});
window.DnevnikScreenings={
 exportEntries:function(){return fromStorage();},
 importEntries:function(newRows){
  if(!Array.isArray(newRows))return 0;
  var all=fromStorage(),ids={};
  all.forEach(function(x){ids[x.id]=true});
  var count=0;
  newRows.slice(0,300).forEach(function(r){
   if(validRow(r)&&!ids[r.id]){all.push({id:r.id,kind:r.kind,time:r.time,answers:r.answers.slice()});ids[r.id]=true;count++}
  });
  if(count&&!writeStore(all))return 0;
  history();return count;
 }
};
render();history();
})();
