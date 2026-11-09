/* Дневник состояния — поддержка в трудный момент. Только локальная обработка. */
(function () {
 "use strict";
 var host=document.getElementById("tab-help");
 if(!host)return;
 var $=function(id){return document.getElementById(id)};
 var KEY="dnevnik-support-plan-v1",FEEDBACK_KEY="dnevnik-coping-v1";
 var fields=["signs","helps","trustedName","trustedPhone","doctorName","doctorPhone"];
 var controls={signs:"helpSigns",helps:"helpHelps",trustedName:"helpTrustedName",trustedPhone:"helpTrustedPhone",doctorName:"helpDoctorName",doctorPhone:"helpDoctorPhone"};
 var sessions={
  panic:{title:"Если накрыла паника",caption:"Побудем в настоящем. Не обязательно делать всё идеально.",steps:[
   {heading:"Сначала — опора",text:"Если ты в безопасности, почувствуй пол под ногами или опору спиной. Можно присесть. Посмотри на один обычный предмет рядом. Не нужно торопиться.",hint:"Сейчас можно просто быть здесь и заметить одну вещь вокруг."},
   {heading:"Мягкое дыхание — только если комфортно",text:"Попробуй спокойный вдох и более длинный выдох, без задержек и усилий. Ритм ниже необязателен. Если кружится голова, становится неприятно или трудно дышать — остановись и перейди дальше.",breath:true,hint:"Никаких глубоких вдохов через силу. Твоё обычное дыхание тоже подходит."},
   {heading:"Вернуться к окружению",text:"Не торопясь найди пять вещей, которые видишь; четыре ощущения прикосновения; три звука; два запаха; один вкус. Можно сделать только часть упражнения.",hint:"Не обязательно вспоминать все пять чувств. Достаточно заметить, где ты находишься."},
   {heading:"Когда волна ослабевает",text:"Если можешь, напиши близкому, выпей воды или посиди в спокойном месте. При повторяющихся приступах стоит обсудить их со специалистом.",hint:"Если ощущения новые, необычные или похожи на физическое заболевание, нужна медицинская оценка."}
  ]},
  anxiety:{title:"Когда сильная тревога",caption:"Не нужно решать всё сразу. Начнём с самого малого.",steps:[
   {heading:"Заметь тревогу",text:"Можно назвать про себя: «Сейчас я чувствую тревогу». Попробуй заметить, где она ощущается в теле, не оценивая и не пытаясь немедленно убрать.",hint:"Тревога — ощущение, а не доказательство того, что случится худшее."},
   {heading:"Вернуться к настоящему",text:"Найди три предмета одного цвета, почувствуй опору ногами и назови два звука. Можно просто посмотреть в окно или почувствовать предмет в ладонях.",hint:"Упражнение можно остановить в любой момент."},
   {heading:"Дышать мягко, если хочется",text:"Сядь удобнее. Попробуй неторопливое дыхание без задержек. Если упражнение вызывает дискомфорт, пропусти его.",breath:true,hint:"Тебе не нужно попадать в ритм точно."},
   {heading:"Один маленький следующий шаг",text:"Спроси себя: «Что я могу сделать в ближайшие пять минут?» Это может быть вода, перерыв, короткое сообщение или запись тревожной мысли. Остальные вопросы можно отложить.",hint:"Если тревога часто мешает жить, полезна помощь психолога или врача."}
  ]},
  low:{title:"Когда совсем нет сил",caption:"Одна маленькая задача — уже достаточно.",steps:[
   {heading:"Не требуй от себя многого",text:"Можно не пытаться делать всё сразу. Отдохни или просто побудь в удобном месте. Это не проверка силы воли.",hint:"Даже если сейчас ничего не получается, помощь всё равно доступна."},
   {heading:"Один небольшой шаг",text:"Выбери что-то одно по силам: выпить воды, перекусить, умыться или открыть окно. Можно пропустить этот шаг.",hint:"Пять минут — уже неплохой ориентир, но необязательно устанавливать время."},
   {heading:"Найди поддержку",text:"Если получится, сообщи близкому простыми словами: «Мне сейчас трудно, можешь побыть рядом или помочь с одной задачей?»",hint:"Не нужно подробно объяснять состояние."},
   {heading:"Проверь, насколько безопасно",text:"Если трудно есть, пить, ухаживать за собой или состояние ухудшается, обратись к специалисту. Если есть мысли о самоповреждении, попроси срочной помощи.",hint:"При непосредственной опасности нужна экстренная помощь, а не упражнения в приложении."}
  ]},
  voices:{title:"Когда пугают голоса или необычные переживания",caption:"Сейчас важны спокойная обстановка, безопасность и поддержка.",steps:[
   {heading:"Найди безопасную опору",text:"Если можешь, перейди в спокойное знакомое место и уменьши шум. Не нужно спорить с переживаниями или пытаться сейчас объяснить их причину.",hint:"То, что происходит, может сильно пугать. Можно просто сконцентрироваться на настоящем."},
   {heading:"Заметь то, что рядом",text:"Попробуй назвать несколько реальных предметов вокруг, почувствовать ноги на полу, посмотреть на дату и время. Если техника неприятна, пропусти её.",hint:"Не обязательно проверять каждую мысль или ощущение."},
   {heading:"Свяжись с человеком, которому доверяешь",text:"Попроси близкого побыть рядом. Если голоса новые, усиливаются или мешают, как можно скорее свяжись с лечащим врачом или службой медицинской помощи.",hint:"Не прекращай и не меняй назначенные препараты самостоятельно."},
   {heading:"Если возникла опасность",text:"Если голоса приказывают причинить вред, есть сильная спутанность, ты не можешь оставаться в безопасности или состояние быстро ухудшается, обратись за экстренной помощью.",hint:"В ЕС экстренный номер — 112. В другой стране звони в местную экстренную службу."}
  ]},
  anger:{title:"Когда очень злишься",caption:"Главная цель сейчас — не сделать то, о чём потом пожалеешь.",steps:[
   {heading:"Пауза и расстояние",text:"Если возможно, отойди от конфликта и людей, на которых направлен гнев. Временно прекрати переписку. Если ты за рулём, остановись в безопасном месте.",hint:"Можно сказать: «Мне нужна пауза. Я вернусь к разговору позже»."},
   {heading:"Уменьши напряжение",text:"Расслабь кисти и челюсть, почувствуй опору ногами. Попробуй неторопливый выдох. Некоторым помогает спокойная прогулка в безопасном месте.",hint:"Не нужно заставлять себя немедленно успокоиться."},
   {heading:"Отложи импульсивные действия",text:"Не отправляй резкие сообщения, не принимай важные решения и не выясняй отношения, пока напряжение не уменьшится. Постарайся находиться подальше от предметов, которыми можно навредить.",hint:"Пауза — способ защитить себя и других, а не проигрыш в споре."},
   {heading:"Что стоит за злостью?",text:"Когда станет немного спокойнее, попробуй назвать одну причину: обида, усталость, страх, перегрузка или нарушение границ. Запиши её для себя — не обязательно кому-то отправлять.",hint:"Разобраться можно позже. Сейчас важнее безопасность."},
   {heading:"Поддержка и возвращение к разговору",text:"Если чувствуешь, что теряешь контроль, попроси близкого о поддержке или свяжись со специалистом. К разговору лучше вернуться, когда станет безопаснее.",hint:"Если есть риск причинить вред себе или другому человеку, нужна экстренная помощь."}
  ]}
 };
 var state={mode:null,index:0,interval:null,breathSecond:0};
 function elem(tag,cls,text){var x=document.createElement(tag);if(cls)x.className=cls;if(text!=null)x.textContent=text;return x}
 function validatePlan(p){
  if(!p||typeof p!=="object"||Array.isArray(p))return null;
  var out={};fields.forEach(function(k){out[k]=typeof p[k]==="string"?p[k].trim().slice(0,k.toLowerCase().includes("phone")?40:600):""});
  return out;
 }
 function readFeedback(){
  try{
   var rows=JSON.parse(localStorage.getItem(FEEDBACK_KEY)||"[]");
   if(!Array.isArray(rows))return [];
   return rows.filter(function(x){
    return x&&typeof x==="object"&&typeof x.date==="string"&& /^\d{4}-\d{2}-\d{2}T/.test(x.date)
    &&typeof x.mode==="string"&&Object.prototype.hasOwnProperty.call(sessions,x.mode)
    &&(x.rating===-1||x.rating===0||x.rating===1)
    &&typeof x.note==="string"&&x.note.length<=160;
   }).slice(-120).map(function(x){return {date:x.date.slice(0,30),mode:x.mode,rating:x.rating,note:x.note}});
  }catch(e){return []}
 }
 function writeFeedback(rows){try{localStorage.setItem(FEEDBACK_KEY,JSON.stringify(rows.slice(-120)));return true}catch(e){return false}}
 function renderFeedback(){
  var list=$("helpFeedbackHistory");list.textContent="";
  var rows=readFeedback(),groups={};
  rows.forEach(function(x){if(!groups[x.mode])groups[x.mode]={total:0,helped:0};groups[x.mode].total++;if(x.rating===1)groups[x.mode].helped++});
  var sorted=Object.keys(groups).sort(function(a,b){return groups[b].helped-groups[a].helped});
  if(!sorted.length){list.appendChild(elem("p","note","Пока нет оценок. После упражнения можно отметить, было ли оно полезным."));return}
  sorted.forEach(function(mode){
   var v=groups[mode],label=elem("p","help-feedback-item",sessions[mode].title+" · помогло "+v.helped+" из "+v.total+" раз (по твоим отметкам)");
   list.appendChild(label);
  });
 }
 function finishMode(){
  stopBreathing();
  var done=state.mode;
  state.mode=null;state.index=0;
  $("helpSession").hidden=true;
  $("helpWelcome").hidden=true;
  $("helpFeedback").hidden=false;
  $("helpFeedback").dataset.mode=done;
  $("helpFeedbackNote").value="";
  $("helpFeedbackMessage").textContent="";
  $("helpFeedback").scrollIntoView({behavior:"smooth",block:"start"});
  $("helpFeedbackTitle").focus({preventScroll:true});
 }
 function readPlan(){
  try{var raw=localStorage.getItem(KEY);return validatePlan(raw?JSON.parse(raw):{})||validatePlan({})}
  catch(e){return validatePlan({})}
 }
 function writePlan(p){
  try{localStorage.setItem(KEY,JSON.stringify(validatePlan(p)));return true}catch(e){return false}
 }
 function phoneHref(v){
  var cleaned=(v||"").replace(/[^\d+]/g,"");
  if(!/^\+?\d{3,16}$/.test(cleaned))return null;
  return "tel:"+cleaned;
 }
 function stopBreathing(){
  if(state.interval!==null){clearInterval(state.interval);state.interval=null}
  $("helpBreathStart").textContent="Начать ритм";
  $("helpBreathOrb").setAttribute("data-breath","idle");
  $("helpBreathWord").textContent="Можно дышать в своём ритме";
  $("helpBreathTime").textContent="Без задержек дыхания";
 }
 function tickBreath(){
  var phase=state.breathSecond%10,inhaling=phase<4;
  $("helpBreathOrb").setAttribute("data-breath",inhaling?"in":"out");
  $("helpBreathWord").textContent=inhaling?"Спокойный вдох":"Мягкий выдох";
  $("helpBreathTime").textContent=(inhaling?4-phase:10-phase)+" сек · без усилий";
  state.breathSecond++;
 }
 function startBreathing(){
  if(state.interval!==null){stopBreathing();return}
  state.breathSecond=0;tickBreath();
  state.interval=setInterval(tickBreath,1000);
  $("helpBreathStart").textContent="Остановить ритм";
 }
 function setMode(mode){
  if(!sessions[mode])return;
  stopBreathing();
  state.mode=mode;state.index=0;
  $("helpWelcome").hidden=true;
  $("helpFeedback").hidden=true;
  $("helpSession").hidden=false;
  renderStep();
  $("helpSession").scrollIntoView({behavior:"smooth",block:"start"});
  $("helpStepTitle").focus({preventScroll:true});
 }
 function exitMode(){
  stopBreathing();
  state.mode=null;state.index=0;
  $("helpSession").hidden=true;
  $("helpFeedback").hidden=true;
  $("helpWelcome").hidden=false;
  $("helpWelcome").scrollIntoView({behavior:"smooth",block:"start"});
  var first=$("helpWelcome").querySelector("[data-help-mode]");if(first)first.focus({preventScroll:true});
 }
 function renderStep(){
  stopBreathing();
  var group=sessions[state.mode];if(!group)return;
  var step=group.steps[state.index];
  $("helpModeTitle").textContent=group.title;
  $("helpModeCaption").textContent=group.caption;
  $("helpStepCount").textContent="Шаг "+(state.index+1)+" из "+group.steps.length;
  $("helpStepTitle").textContent=step.heading;
  $("helpStepText").textContent=step.text;
  $("helpStepHint").textContent=step.hint;
  $("helpBreathing").hidden=!step.breath;
  $("helpStepPrevious").disabled=state.index===0;
  $("helpStepNext").textContent=state.index===group.steps.length-1?"Завершить":"Дальше →";
  $("helpProgressFill").style.width=(((state.index+1)/group.steps.length)*100)+"%";
  $("helpProgress").setAttribute("aria-valuenow",String(state.index+1));
  $("helpProgress").setAttribute("aria-valuemax",String(group.steps.length));
  if(document.activeElement&&($("helpStepNext")===document.activeElement||$("helpStepPrevious")===document.activeElement))$("helpStepTitle").focus({preventScroll:true});
 }
 function setPlanLink(node,name,phone){
  node.textContent="";
  if(!name&&!phone)return;
  var link=phoneHref(phone);
  var row=elem("div","help-saved-contact");
  row.appendChild(elem("strong",null,name||"Контакт"));
  if(link){var a=elem("a","btn sec sm","Позвонить");a.href=link;row.appendChild(a)}
  else if(phone)row.appendChild(elem("span","help-phone",phone));
  node.appendChild(row);
 }
 function renderSavedPlan(){
  var p=readPlan();
  var sum=$("helpSavedPlan");sum.textContent="";
  var nonempty=fields.some(function(k){return !!p[k]});
  $("helpPlanEmpty").hidden=nonempty;
  if(p.helps){var x=elem("p","help-plan-summary");x.appendChild(elem("b",null,"Мне помогает: "));x.appendChild(document.createTextNode(p.helps));sum.appendChild(x)}
  if(p.signs){var y=elem("p","help-plan-summary");y.appendChild(elem("b",null,"Ранние признаки: "));y.appendChild(document.createTextNode(p.signs));sum.appendChild(y)}
  setPlanLink($("helpTrustedLink"),p.trustedName,p.trustedPhone);
  setPlanLink($("helpDoctorLink"),p.doctorName,p.doctorPhone);
 }
 function populatePlan(){
  var p=readPlan();
  fields.forEach(function(key){$(controls[key]).value=p[key]});
  renderSavedPlan();
 }
 function savePlan(){
  var p={};fields.forEach(function(key){p[key]=$(controls[key]).value});
  if(!writePlan(p)){$("helpPlanMessage").textContent="Не получилось сохранить: проверь, разрешено ли браузеру хранить данные.";return}
  $("helpPlanMessage").textContent="План сохранён только в этом браузере.";
  renderSavedPlan();
 }
 document.querySelectorAll("[data-help-mode]").forEach(function(btn){
  btn.addEventListener("click",function(){setMode(btn.dataset.helpMode)});
 });
 $("helpStepPrevious").addEventListener("click",function(){
  if(state.mode&&state.index>0){state.index--;renderStep()}
 });
 $("helpStepNext").addEventListener("click",function(){
  if(!state.mode)return;
  if(state.index>=sessions[state.mode].steps.length-1)finishMode();
  else{state.index++;renderStep()}
 });
 $("helpSessionClose").addEventListener("click",exitMode);
 $("helpBreathStart").addEventListener("click",startBreathing);
 document.querySelectorAll("[data-help-rating]").forEach(function(b){
  b.addEventListener("click",function(){
   var mode=$("helpFeedback").dataset.mode;
   if(!sessions[mode])return;
   var value=Number(b.dataset.helpRating);if(value!==-1&&value!==0&&value!==1)return;
   var rows=readFeedback();
   rows.push({date:new Date().toISOString(),mode:mode,rating:value,note:$("helpFeedbackNote").value.trim().slice(0,160)});
   if(!writeFeedback(rows)){$("helpFeedbackMessage").textContent="Не удалось сохранить отзыв в браузере.";return}
   renderFeedback();exitMode();
  });
 });
 $("helpFeedbackSkip").addEventListener("click",exitMode);
 $("helpClearFeedback").addEventListener("click",function(){
  if(!confirm("Удалить все отметки о полезности упражнений?"))return;
  if(writeFeedback([]))renderFeedback();
 });
 $("helpOpenPlan").addEventListener("click",function(){
  var panel=$("helpPlanDetails");panel.open=true;
  panel.scrollIntoView({behavior:"smooth",block:"start"});
 });
 $("helpPlanSave").addEventListener("click",savePlan);
 $("helpPlanDelete").addEventListener("click",function(){
  if(!confirm("Удалить сохранённые контакты и личный план поддержки?"))return;
  if(!writePlan({})){$("helpPlanMessage").textContent="Не удалось удалить план.";return}
  populatePlan();$("helpPlanMessage").textContent="Личный план удалён.";
 });
 document.addEventListener("visibilitychange",function(){if(document.hidden)stopBreathing()});
 document.querySelectorAll('#nav button[data-t]').forEach(function(btn){
  btn.addEventListener("click",stopBreathing);
 });
 window.DnevnikSupport={
  exportPlan:function(){return readPlan()},
  exportFeedback:function(){return readFeedback()},
  importFeedback:function(rows){
   if(!Array.isArray(rows))return 0;
   var old=readFeedback(),existing={};
   old.forEach(function(x){existing[x.date+"|"+x.mode]=1});
   var count=0;
   rows.slice(-120).forEach(function(x){
    if(x&&typeof x.date==="string"&&/^\d{4}-\d{2}-\d{2}T/.test(x.date)&&sessions[x.mode]&&(x.rating===-1||x.rating===0||x.rating===1)){
     var key=x.date+"|"+x.mode;
     if(!existing[key]){old.push({date:x.date.slice(0,30),mode:x.mode,rating:x.rating,note:typeof x.note==="string"?x.note.slice(0,160):""});existing[key]=1;count++}
    }
   });
   if(count&&!writeFeedback(old))return 0;
   renderFeedback();return count;
  },
  importPlan:function(p){
   var data=validatePlan(p);if(!data)return false;
   if(!fields.some(function(k){return data[k]}))return false;
   if(!writePlan(data))return false;
   populatePlan();return true
  }
 };
 populatePlan();renderFeedback();
})();
