/* Дневник состояния: самостоятельное наблюдение, лекарства, отчёт для врача.
   Никаких сетевых запросов, автоматических диагнозов или изменений лечения. */
(function(){
"use strict";
var root=document.getElementById("wellbeingTools");
if(!root)return;
var $=function(id){return document.getElementById(id)};
var MED_KEY="dnevnik-meds-v1",WARN_KEY="dnevnik-warning-settings-v1";
var statuses={taken:"Принято по плану",missed:"Пропущено",unsure:"Не уверен(а)"};
function E(t,c,text){var el=document.createElement(t);if(c)el.className=c;if(text!=null)el.textContent=text;return el}
function iso(dt){var d=new Date(dt.getTime()-dt.getTimezoneOffset()*60000);return d.toISOString().slice(0,10)}
function today(){return iso(new Date())}
function dates(count){var out=[],d=new Date();d.setHours(12,0,0,0);
 for(var i=0;i<count;i++){var x=new Date(d);x.setDate(x.getDate()-i);out.push(iso(x))}return out}
function validDate(s){if(typeof s!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
 var d=new Date(s+"T12:00:00");return Number.isFinite(d.getTime())&&iso(d)===s}
function readObj(key){try{var d=JSON.parse(localStorage.getItem(key)||"{}");return d&&typeof d==="object"&&!Array.isArray(d)?d:{}}catch(e){return {}}}
function readArr(key){try{var d=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(d)?d:[]}catch(e){return []}}
function write(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true}catch(e){return false}}
function validMed(x){return x&&typeof x==="object"&&typeof x.id==="string"&&x.id.length>0&&x.id.length<=80
 &&validDate(x.date)&&typeof x.name==="string"&&x.name.trim().length>=1&&x.name.length<=80
 &&Object.prototype.hasOwnProperty.call(statuses,x.status)&&typeof x.effects==="string"&&x.effects.length<=240
 &&typeof x.note==="string"&&x.note.length<=240}
function medClean(x){return {id:x.id.slice(0,80),date:x.date,name:x.name.trim().slice(0,80),status:x.status,effects:x.effects.slice(0,240),note:x.note.slice(0,240)}}
function meds(){return readArr(MED_KEY).filter(validMed).slice(-400).map(medClean)}
function saveMeds(rows){return write(MED_KEY,rows.slice(-400))}
function message(id,value){$(id).textContent=value}
function resetMed(){ $("medDate").value=today();$("medName").value="";$("medStatus").value="taken";$("medEffects").value="";$("medNote").value="";$("medEditId").value="";$("medSave").textContent="Сохранить отметку";$("medFormState").textContent="Новая отметка"}
function fillMed(x){$("medDate").value=x.date;$("medName").value=x.name;$("medStatus").value=x.status;
 $("medEffects").value=x.effects;$("medNote").value=x.note;$("medEditId").value=x.id;
 $("medSave").textContent="Сохранить изменения";$("medFormState").textContent="Редактирование отметки за "+x.date;
 $("medSection").open=true;$("medSection").scrollIntoView({block:"start",behavior:"smooth"})}
function renderMeds(){
 var list=$("medList");list.textContent="";var arr=meds().slice().sort(function(a,b){return b.date.localeCompare(a.date)}).slice(0,45);
 if(!arr.length){list.appendChild(E("p","note","Пока нет отметок о лекарствах."));return}
 arr.forEach(function(x){
  var row=E("div","wb-med-row"),body=E("div","wb-med-info");
  body.appendChild(E("b",null,x.date+" · "+x.name));
  body.appendChild(E("small","wb-med-status wb-med-status-"+x.status,statuses[x.status]));
  if(x.effects)body.appendChild(E("small",null,"Наблюдения: "+x.effects));
  if(x.note)body.appendChild(E("small",null,"Заметка: "+x.note));
  var actions=E("div","wb-med-actions"),edit=E("button","btn sec sm","Изменить"),del=E("button","btn sec sm","Удалить");
  edit.type=del.type="button";
  edit.addEventListener("click",function(){fillMed(x)});
  del.addEventListener("click",function(){
   if(!confirm("Удалить отметку о препарате «"+x.name+"» за "+x.date+"?"))return;
   if(saveMeds(meds().filter(function(y){return y.id!==x.id}))){renderMeds();message("medMsg","Отметка удалена.")}else message("medMsg","Не удалось удалить отметку.");
  });
  actions.appendChild(edit);actions.appendChild(del);row.appendChild(body);row.appendChild(actions);list.appendChild(row);
 });
}
$("medForm").addEventListener("submit",function(e){
 e.preventDefault();var current=meds(),name=$("medName").value.trim().slice(0,80),date=$("medDate").value;
 if(!name||!validDate(date)||date>today()){message("medMsg","Проверь название и дату (не позже сегодняшней).");return}
 var id=$("medEditId").value||Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);
 var rec={id:id,date:date,name:name,status:$("medStatus").value,effects:$("medEffects").value.trim().slice(0,240),note:$("medNote").value.trim().slice(0,240)};
 if(!validMed(rec)){message("medMsg","Проверь заполненные поля.");return}
 var ix=current.findIndex(function(x){return x.id===id});if(ix>=0)current[ix]=rec;else current.push(rec);
 if(!saveMeds(current)){message("medMsg","Не удалось сохранить: хранилище браузера недоступно.");return}
 resetMed();renderMeds();message("medMsg","Отметка сохранена только на этом устройстве.");
});
$("medReset").addEventListener("click",function(){resetMed();message("medMsg","")});
$("medClear").addEventListener("click",function(){
 if(!meds().length||!confirm("Удалить всю историю отметок о лекарствах?"))return;
 if(saveMeds([])){renderMeds();resetMed();message("medMsg","История очищена.")}else message("medMsg","Не удалось очистить историю.");
});
function settings(){
 var saved=readObj(WARN_KEY),hours=Number(saved.shortHours);
 return {shortHours:Number.isInteger(hours)&&hours>=3&&hours<=9?hours:5}
}
function setSettings(){var v=Number($("warningShortHours").value);
 if(!Number.isInteger(v)||v<3||v>9){message("warningMsg","Выбери порог от 3 до 9 часов.");return}
 if(!write(WARN_KEY,{shortHours:v})){message("warningMsg","Настройки не удалось сохранить.");return}
 message("warningMsg","Порог сохранён. Он меняет только подсказки, не диагнозы.");
}
$("warningSaveSettings").addEventListener("click",setSettings);
function normMood(entry){
 var val=entry&&entry.v&&entry.v.m,max=entry&&entry.d&&entry.d.m;
 if(!Number.isInteger(val)||!Number.isInteger(max)||max<2||val<1||val>max)return null;
 return Math.round((val-1)/(max-1)*4+1);
}
function checkWarnings(){
 var days=dates(5),sleep=readObj("dnevnik-sleep-v1"),mood=readObj("dnevnik-v1"),limit=settings().shortHours;
 var sleepValid=[],moodValid=[],signs=[],shortEnergetic=0;
 days.forEach(function(day){
  var x=sleep[day],e=Number(x&&x.energy),h=Number(x&&x.hours);
  if(x&&Number.isFinite(h)&&h>=0&&h<=24&&Number.isInteger(e)&&e>=1&&e<=5){
   sleepValid.push({day:day,hours:h,energy:e,lessNeed:x.lessNeed===true});
   if(h<=limit&&e>=4&&x.lessNeed===true)shortEnergetic++;
  }
  var v=normMood(mood[day]);if(v!==null)moodValid.push(v);
 });
 if(shortEnergetic>=2){
  signs.push("За последние 5 дней как минимум два раза отмечены короткий сон (до "+limit+" ч), высокая энергия и уменьшенная потребность во сне. Это может быть важным изменением: проверь личный план и свяжись с лечащим врачом в ближайшее время.");
 }else if(sleepValid.length<3){
  signs.push("Для сравнения сна пока мало записей: есть "+sleepValid.length+" за последние 5 дней. Это не означает, что с состоянием всё в порядке или что есть проблема.");
 }else{
  var shortCount=sleepValid.filter(function(x){return x.hours<=limit}).length;
  signs.push("Отметок сна за последние 5 дней: "+sleepValid.length+"; короткий сон (до "+limit+" ч) отмечен "+shortCount+" раз. По одним цифрам нельзя определить причину изменений.");
 }
 if(moodValid.length>=4){
  var low=moodValid.filter(function(x){return x<=2}).length,high=moodValid.filter(function(x){return x>=4}).length;
  if(low>=3)signs.push("В "+low+" из "+moodValid.length+" записанных дней настроение было в нижней части твоей шкалы. Если это необычно, долго держится или мешает жить — расскажи специалисту.");
  else if(high>=3)signs.push("В "+high+" из "+moodValid.length+" записанных дней настроение было выше нейтрального. Само по себе это не признак гипомании; важны сон, поведение и изменения относительно привычного уровня.");
 }else signs.push("Для оценки записей настроения пока недостаточно данных (нужно хотя бы 4 дня из последних 5).");
 var result=$("warningResults");result.textContent="";
 signs.forEach(function(t){result.appendChild(E("p","wb-warning-line",t))});
 var support=readObj("dnevnik-support-plan-v1");
 if(typeof support.signs==="string"&&support.signs.trim()){
  result.appendChild(E("p","wb-warning-line","Твои собственные ранние признаки из плана: "+support.signs.slice(0,600)));
 }
 result.appendChild(E("p","note","Этот просмотр запускается только вручную. Он не выявляет и не предотвращает эпизоды, не анализирует лекарства и не заменяет медицинскую оценку."));
 message("warningMsg","Проверено только по записям этого браузера.");
}
$("warningCheck").addEventListener("click",checkWarnings);
function dateWithin(day,valid){return typeof day==="string"&&day>=valid&&day<=today()}
function buildReport(){
 var n=Number($("doctorDays").value),allowed=[7,14,30];
 if(allowed.indexOf(n)===-1)n=14;
 var since=dates(n)[n-1],lines=["Сводка самонаблюдений для обсуждения с врачом","Дата составления: "+today(),"Период: "+since+" — "+today(),"", "Внимание: данные введены пользователем; это не диагноз и не медицинское заключение.",""];
 var selected=0;
 if($("doctorMood").checked){
  selected++;
  var d=readObj("dnevnik-v1"),keys=Object.keys(d).filter(function(k){return dateWithin(k,since)&&normMood(d[k])!==null}).sort();
  lines.push("НАСТРОЕНИЕ (пересчитано в шкалу 1–5)");
  if(!keys.length)lines.push("Нет отметок за период.");
  else{
   var sum=0;keys.forEach(function(k){sum+=normMood(d[k])});
   lines.push("Отметок: "+keys.length+"; среднее: "+(sum/keys.length).toFixed(1)+" / 5");
   keys.forEach(function(k){lines.push(k+": "+normMood(d[k])+" / 5");
    if($("doctorNotes").checked&&typeof d[k].note==="string"&&d[k].note.trim())lines.push("  Заметка: "+d[k].note.slice(0,500))
   });
  }
  lines.push("");
 }
 if($("doctorSleep").checked){
  selected++;
  var sl=readObj("dnevnik-sleep-v1"),days=Object.keys(sl).filter(function(k){return dateWithin(k,since)&&sl[k]&&typeof sl[k].hours==="number"&&sl[k].hours>=0&&sl[k].hours<=24}).sort();
  lines.push("СОН И ЭНЕРГИЯ");
  if(!days.length)lines.push("Нет отметок за период.");
  else{
   var t=0;days.forEach(function(k){t+=sl[k].hours});
   lines.push("Записей: "+days.length+"; средний сон: "+(t/days.length).toFixed(1)+" ч");
   days.forEach(function(k){var x=sl[k];lines.push(k+": "+x.hours+" ч; качество "+x.quality+"/5; энергия "+x.energy+"/5"+(x.lessNeed?" · снижена потребность во сне":""));
    if($("doctorNotes").checked&&typeof x.note==="string"&&x.note.trim())lines.push("  Заметка: "+x.note.slice(0,240))
   });
  }lines.push("");
 }
 if($("doctorTests").checked){
  selected++;
  var records=readArr("dnevnik-screenings-v1"),names={phq9:"PHQ-9",asrm:"Активация (адапт. ASRM)",gad7:"GAD-7",who5:"Благополучие (адапт. WHO-5)",pcptsd5:"PC-PTSD-5 (адапт. перевод)",auditc:"AUDIT-C"};
  lines.push("САМООПРОСНИКИ");
  var qualifying=records.filter(function(r){return r&&Object.prototype.hasOwnProperty.call(names,r.kind)&&typeof r.time==="string"&&dateWithin(r.time.slice(0,10),since)&&Array.isArray(r.answers)&&r.answers.length>0&&r.answers.every(function(x){return Number.isInteger(x)&&x>=0&&x<=5})}).sort(function(a,b){return a.time.localeCompare(b.time)});
  if(!qualifying.length)lines.push("Нет результатов за период.");
  qualifying.forEach(function(r){
   var total=r.answers.reduce(function(a,b){return a+b},0);
   if(r.kind==="pcptsd5")total=r.answers[0]===0?0:r.answers.slice(1).reduce(function(a,b){return a+b},0);
   if(r.kind==="auditc")total=r.answers.reduce(function(a,b,i){return a+(i===1?Math.max(0,b-1):b)},0);
   var max={phq9:27,asrm:20,gad7:21,who5:100,pcptsd5:5,auditc:12}[r.kind];
   lines.push(r.time.slice(0,10)+": "+names[r.kind]+" — "+(r.kind==="who5"?total*4:total)+"/"+max+(r.kind==="pcptsd5"&&r.answers[0]===0?" (вводный ответ «нет»)":""));
  });
  lines.push("");
 }
 if($("doctorMeds").checked){
  selected++;lines.push("ЛЕКАРСТВА (отметки пользователя, не назначения)");
  var md=meds().filter(function(x){return dateWithin(x.date,since)}).sort(function(a,b){return a.date.localeCompare(b.date)});
  if(!md.length)lines.push("Нет отметок за период.");
  md.forEach(function(x){lines.push(x.date+": "+x.name+" — "+statuses[x.status]+(x.effects?"; наблюдения: "+x.effects:"")+(($("doctorNotes").checked&&x.note)?"; заметка: "+x.note:""))});
  lines.push("");
 }
 if(!selected)return "Выбери хотя бы один раздел для сводки.";
 var questions=$("doctorQuestions").value.trim().slice(0,800);
 if(questions)lines.push("ВОПРОСЫ, КОТОРЫЕ ХОЧУ ЗАДАТЬ ВРАЧУ",questions,"");
 lines.push("Составлено локально в «Дневнике состояния». Решения о диагностике и лечении принимаются вместе со специалистом.");
 return lines.join("\n");
}
function reportFresh(valid){
 $("doctorCopy").disabled=!valid;
 $("doctorDownload").disabled=!valid;
}
function invalidateReport(){
 if(!$("doctorPreview").value)return;
 reportFresh(false);
 message("doctorMsg","Параметры изменились. Подготовь сводку заново, чтобы включить новые настройки.");
}
["doctorDays","doctorMood","doctorSleep","doctorTests","doctorMeds","doctorNotes","doctorQuestions"].forEach(function(id){
 $(id).addEventListener("change",invalidateReport);
 if(id==="doctorQuestions")$(id).addEventListener("input",invalidateReport);
});
$("doctorGenerate").addEventListener("click",function(){
 $("doctorPreview").value=buildReport();
 reportFresh(!$("doctorPreview").value.startsWith("Выбери хотя бы один"));
 message("doctorMsg","Сводка подготовлена на этом устройстве. Проверь содержание перед тем, как кому-либо отправить.");
});
$("doctorCopy").addEventListener("click",function(){
 var t=$("doctorPreview").value;if(!t){message("doctorMsg","Сначала сформируй сводку.");return}
 if(navigator.clipboard&&navigator.clipboard.writeText){
  navigator.clipboard.writeText(t).then(function(){message("doctorMsg","Текст скопирован. Осторожно: он содержит личные сведения.")},function(){message("doctorMsg","Не удалось скопировать автоматически. Выдели текст и скопируй вручную.")});
 }else{$("doctorPreview").focus();$("doctorPreview").select();message("doctorMsg","Текст выделен — скопируй его вручную.")}
});
$("doctorDownload").addEventListener("click",function(){
 var t=$("doctorPreview").value;if(!t){message("doctorMsg","Сначала сформируй сводку.");return}
 try{
  var blob=new Blob([t],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),link=E("a");
  link.href=url;link.download="dnevnik-vrach-"+today()+".txt";document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url)},2000);
  message("doctorMsg","Файл сохранён. Он содержит личную информацию; храни его в безопасном месте.");
 }catch(e){message("doctorMsg","Не удалось сохранить файл. Можно скопировать текст вручную.")}
});
window.DnevnikWellbeing={
 exportData:function(){return {meds:meds(),settings:settings()}},
 importData:function(data){
  if(!data||typeof data!=="object"||Array.isArray(data))return {meds:0};
  var entries=Array.isArray(data.meds)?data.meds:[],current=meds(),existing={};current.forEach(function(x){existing[x.id]=1});
  var count=0;
  entries.slice(-400).forEach(function(x){if(validMed(x)&&!existing[x.id]){current.push(medClean(x));existing[x.id]=1;count++}});
  if(count&&!saveMeds(current))return {meds:0};
  if(data.settings&&Number.isInteger(data.settings.shortHours)&&data.settings.shortHours>=3&&data.settings.shortHours<=9){
   write(WARN_KEY,{shortHours:data.settings.shortHours});$("warningShortHours").value=String(data.settings.shortHours);
  }
  renderMeds();return {meds:count};
 }
};
$("medDate").max=today();resetMed();renderMeds();$("warningShortHours").value=String(settings().shortHours);
})();