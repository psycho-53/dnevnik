/* Дневник состояния: локальные самоопросники v1 */
(function(){
"use strict";
var KEY="dnevnik-screenings-v1";
var defs={
 gad7:{
  shortTitle:"GAD-7",
  title:"Тревожные симптомы (GAD-7)",
  period:"За последние две недели",
  note:"7 вопросов · 0–21 балл. Стандартная система подсчёта, русские формулировки адаптированы для понятного самонаблюдения.",
  options:["Совсем нет","Несколько дней","Больше половины дней","Почти каждый день"],
  items:[
   "Чувство нервозности, тревоги или напряжения",
   "Не получается остановить или контролировать беспокойство",
   "Слишком сильные переживания по разным поводам",
   "Трудно расслабиться",
   "Неусидчивость или беспокойство, из-за которых трудно оставаться на месте",
   "Легко раздражаюсь или становлюсь вспыльчивым(ой)",
   "Страх, что может произойти что-то ужасное"
  ],
  limit:3
 },
 who5:{
  shortTitle:"WHO-5",
  title:"Психологическое благополучие (по мотивам WHO-5)",
  period:"За последние две недели",
  note:"5 утверждений · 0–100 баллов. Чем выше балл, тем выше субъективное благополучие. Русские формулировки адаптированы.",
  options:["Ни разу","Изредка","Меньше половины времени","Больше половины времени","Почти всё время","Всё время"],
  items:[
   "Я чувствовал(а) себя в хорошем настроении и был(а) бодр(а) духом",
   "Я ощущал(а) спокойствие и расслабленность",
   "У меня были энергия и желание действовать",
   "Просыпаясь, я чувствовал(а) себя отдохнувшим(ей)",
   "В моей повседневной жизни находились интересные и увлекающие занятия"
  ],
  limit:5
 },
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
 },
 pcptsd5:{
  shortTitle:"PC-PTSD-5",title:"Реакции на травматический опыт (PC-PTSD-5)",
  period:"За последний месяц (после вводного вопроса о прошлом опыте)",
  note:"5 вопросов о симптомах + 1 вводный. Русский текст адаптирован и отдельно не валидирован. Можно остановиться в любой момент.",
  options:["Нет","Да"],
  items:[
   "Происходило ли с тобой когда-либо событие, связанное с серьёзной угрозой жизни, физическим или сексуальным насилием, тяжёлой аварией, войной либо похожим травматическим опытом?",
   "За последний месяц возникали ли кошмары об этом событии или нежелательные воспоминания о нём?",
   "За последний месяц старался(ась) ли ты не думать о событии или избегать того, что о нём напоминает?",
   "За последний месяц чувствовал(а) ли ты постоянную настороженность, повышенную бдительность или легко пугался(ась)?",
   "За последний месяц ощущал(а) ли ты эмоциональное онемение или отстранённость от людей, занятий либо окружающего мира?",
   "За последний месяц испытывал(а) ли ты вину или продолжал(а) обвинять себя либо других за случившееся и его последствия?"
  ],limit:1
 },
 auditc:{
  shortTitle:"AUDIT-C",title:"Употребление алкоголя и возможные риски (AUDIT-C)",
  period:"Привычки употребления алкоголя за последний год",
  note:"3 вопроса · 0–12 баллов. Результат не является диагнозом зависимости. Стандартный напиток — порция с определённым количеством чистого алкоголя; в разных странах её размер отличается.",
  choices:[
   ["Никогда","Раз в месяц или реже","2–4 раза в месяц","2–3 раза в неделю","4 раза в неделю или чаще"],
   ["0 напитков","1–2 напитка","3–4 напитка","5–6 напитков","7–9 напитков","10 напитков или больше"],
   ["Никогда","Реже раза в месяц","Ежемесячно","Еженедельно","Ежедневно или почти ежедневно"]
  ],
  items:[
   "Как часто ты употребляешь алкоголь?",
   "Сколько стандартных алкогольных напитков обычно бывает за один день, когда ты пьёшь?",
   "Как часто ты употребляешь шесть или больше стандартных напитков за один раз?"
  ],limit:5
 }
};
var active="phq9",answers={};Object.keys(defs).forEach(function(k){answers[k]=Array(defs[k].items.length).fill(null)});
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
  &&Object.prototype.hasOwnProperty.call(defs,r.kind)&&typeof r.time==="string"&&r.time.length<=40
  &&Array.isArray(r.answers)&&r.answers.length===defs[r.kind].items.length
  &&r.answers.every(function(v,i){var d=defs[r.kind],opts=d.choices?d.choices[i]:d.options;return Number.isInteger(v)&&v>=0&&v<opts.length});
}
function writeStore(rows){
 try{localStorage.setItem(KEY,JSON.stringify(rows.slice(-300)));return true}catch(e){return false}
}
function score(a,kind){
 if(kind==="pcptsd5")return a[0]===0?0:a.slice(1).reduce(function(sum,v){return sum+v},0);
 if(kind==="auditc")return a.reduce(function(sum,v,i){return sum+(i===1?Math.max(0,v-1):v)},0);
 return a.reduce(function(sum,v){return sum+v},0);
}
function maxScore(kind){return {phq9:27,gad7:21,asrm:20,who5:100,pcptsd5:5,auditc:12}[kind]||0}
function dateLabel(v){
 var dt=new Date(v);
 return Number.isNaN(dt.getTime())?v.slice(0,16):dt.toLocaleString("ru-RU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
}
function evaluation(kind,points,a){
 if(kind==="pcptsd5"){
  if(a[0]===0)return {title:"Вводный вопрос: травматический опыт не отмечен",description:"По инструкции PC-PTSD-5 дальнейшие вопросы пропущены, балл 0. Это не исключает трудностей и не заменяет разговор со специалистом.",urgent:false};
  return {title:"Отмечено симптомов: "+points+" из 5",description:points>=1?"Это самоотчёт о переживаниях за последний месяц. Если симптомы мешают, повторяются или пугают, стоит обсудить их со специалистом. По ответам диагноз не ставится.":"По отмеченным ответам симптомы не выявлены, но опросник не исключает ПТСР и другие состояния.",urgent:false};
 }
 if(kind==="auditc"){
  return {title:"AUDIT-C: "+points+" из 12",description:points>=5?"Результат указывает на возможный риск для здоровья и повод обсудить привычки употребления со специалистом. Пороговые значения зависят от ситуации.":"Балл описывает ответы на три вопроса. Даже небольшой результат не гарантирует отсутствие связанных с алкоголем рисков.",urgent:false};
 }
 if(kind==="phq9"){
  var levels=points<=4?"минимальная":points<=9?"лёгкая":points<=14?"умеренная":points<=19?"выраженная":"очень выраженная";
  var advice=points>=10?"Результат стоит обсудить с врачом или специалистом по психическому здоровью.":"Если симптомы мешают повседневной жизни, обсудите их со специалистом независимо от баллов.";
  if(points>=20)advice="Выраженность симптомов высокая. Рекомендуется обратиться за профессиональной оценкой в ближайшее время.";
  return {title:"Выраженность симптомов: "+levels,description:advice,urgent:a[8]>0};
 }
 if(kind==="gad7"){
  var anxiety=points<=4?"минимальные":points<=9?"лёгкие":points<=14?"умеренные":"выраженные";
  return {title:"Тревожные симптомы: "+anxiety,description:points>=10?"Результат стоит обсудить с врачом или специалистом по психическому здоровью. Опросник не определяет причину тревоги.":"Если тревога мешает тебе в повседневной жизни, обратиться за помощью стоит независимо от суммы.",urgent:false};
 }
 if(kind==="who5"){
  var pct=points*4;
  return {title:pct<=50?"Сниженное субъективное благополучие":"Благополучие по ответам выше ориентировочного порога",
   description:pct<=50?"Результат может быть поводом поговорить со специалистом о самочувствии, особенно если ухудшение сохраняется. Это не диагноз депрессии.":"Этот результат описывает последние две недели. Можно сравнить его с последующими ответами; даже высокий балл не исключает трудностей.",urgent:false};
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
  if((active==="pcptsd5"||active==="auditc")&&i>0&&a[0]===0)return;
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
 var total=a.length;if((active==="pcptsd5"||active==="auditc")&&a[0]===0){done=1;total=1}
 document.getElementById("screeningProgress").textContent="Отвечено: "+done+" из "+total+". Можно пропустить опросник в любой момент.";
 document.getElementById("screeningProgressFill").style.width=Math.round(done/total*100)+"%";
 var warn=document.getElementById("screeningInlineSafety");
 warn.hidden=!(active==="phq9"&&a[8]!==null&&a[8]>0);
 if(!warn.hidden)warn.textContent=safetyText();
}
function renderResult(kind,answersRow){
 var a=answersRow||answers[kind],total=score(a,kind),e=evaluation(kind,total,a);
 var out=document.getElementById("screeningResultSection");
 out.hidden=false;out.textContent="";
 out.appendChild(node("div","eyebrow","РЕЗУЛЬТАТ САМООПРОСА"));
 var resultHeading=node("h2",null,e.title);resultHeading.tabIndex=-1;out.appendChild(resultHeading);
 out.appendChild(node("p","screening-total",kind==="who5"?(total*4+" / 100 баллов"):(total+" / "+maxScore(kind)+" баллов")));
 out.appendChild(node("p","note",e.description));
 if(e.urgent){
  var notice=node("div","screening-safety");notice.setAttribute("role","alert");notice.textContent=safetyText();out.appendChild(notice);
 }
 var notes={
 phq9:"PHQ-9 показывает выраженность депрессивных симптомов за 2 недели, но не устанавливает диагноз.",
 asrm:"Это ориентировочный чек-лист по мотивам ASRM (порог 6 баллов). Русские формулировки не проходили отдельной проверки точности; диагноз по сумме ставить нельзя.",
 gad7:"GAD-7 — скрининг тревожных симптомов (0–4, 5–9, 10–14, 15–21). Русские формулировки адаптированы, результаты не являются диагнозом.",
 who5:"Пять пунктов благополучия, адаптированных по мотивам WHO-5: сумма 0–25 × 4 = 0–100. Порог ≤50 ориентировочный, русская адаптация не является официальной версией ВОЗ.",
 pcptsd5:"PC-PTSD-5: создан VA National Center for PTSD (США), общественное достояние. Русский текст — адаптация, отдельно не проверенная на валидность. При тревожных симптомах важна профессиональная оценка.",
 auditc:"AUDIT-C: короткий алкогольный скрининг ВОЗ. Русские формулировки адаптированы; результат не является диагнозом."
 };
 out.appendChild(node("p","note",notes[kind]||"Результат не заменяет профессиональную оценку."));
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
  var points=score(r.answers,r.kind),max=maxScore(r.kind);
  var shown=r.kind==="who5"?points*4:points;
  info.appendChild(node("b",null,(defs[r.kind].shortTitle|| (r.kind==="phq9"?"PHQ-9":"Активация"))+" · "+shown+"/"+max));
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
 var a=answers[active].slice();
 if(active==="pcptsd5"&&a[0]===0)a=[0,0,0,0,0,0];
 if(active==="auditc"&&a[0]===0)a=[0,0,0];
 var missing=a.filter(function(v){return v===null}).length;
 if(missing){
  var first=a.findIndex(function(v){return v===null});
  document.getElementById("screeningValidation").textContent="Осталось ответить на "+missing+" вопрос(ов). Перейди к первому пропущенному.";
  var question=box.children[first];
  if(question){question.scrollIntoView({behavior:"smooth",block:"center"});var firstControl=question.querySelector('input[type="radio"]');if(firstControl)firstControl.focus({preventScroll:true})}
  return;
 }
 var rows=fromStorage();
 rows.push({id:String(Date.now())+"-"+Math.random().toString(36).slice(2,10),kind:active,time:new Date().toISOString(),answers:a.slice()});
 if(!writeStore(rows)){document.getElementById("screeningValidation").textContent="Не удалось сохранить ответы. Проверьте настройки хранения данных браузера.";return}
 document.getElementById("screeningValidation").textContent="Результат сохранён только в этом браузере.";
 renderResult(active,a);history();
 var result=document.getElementById("screeningResultSection");
 result.scrollIntoView({behavior:"smooth",block:"nearest"});
 var title=result.querySelector("h2");if(title)title.focus({preventScroll:true});
}
box.addEventListener("change",function(e){
 var input=e.target;
 if(!input.matches('input[type="radio"][data-question]'))return;
 var q=Number(input.dataset.question),v=Number(input.value);
 var labels=(defs[active].choices?defs[active].choices[q]:defs[active].options)||[];
 if(q>=0&&q<answers[active].length&&Number.isInteger(v)&&v>=0&&v<labels.length){
  if((active==="pcptsd5"||active==="auditc")&&q===0&&answers[active][0]!==v)answers[active]=Array(defs[active].items.length).fill(null);
  answers[active][q]=v;
  document.getElementById("screeningValidation").textContent="";
  document.getElementById("screeningResultSection").hidden=true;
  if((active==="pcptsd5"||active==="auditc")&&q===0)render();else updateProgress();
 }
});
document.querySelectorAll("[data-screening-kind]").forEach(function(b){
 b.addEventListener("click",function(){active=b.dataset.screeningKind;render();document.getElementById("screeningTitle").scrollIntoView({behavior:"smooth",block:"start"})});
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
