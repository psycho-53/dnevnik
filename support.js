/* Дневник состояния — поддержка в трудный момент. Только локальная обработка. */
(function () {
 "use strict";
 var host=document.getElementById("tab-help");
 if(!host)return;
 var $=function(id){return document.getElementById(id)};
 var KEY="dnevnik-support-plan-v1";
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
  $("helpSession").hidden=false;
  renderStep();
  $("helpSession").scrollIntoView({behavior:"smooth",block:"start"});
 }
 function exitMode(){
  stopBreathing();
  state.mode=null;state.index=0;
  $("helpSession").hidden=true;
  $("helpWelcome").hidden=false;
  $("helpWelcome").scrollIntoView({behavior:"smooth",block:"start"});
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
  if(state.index>=sessions[state.mode].steps.length-1)exitMode();
  else{state.index++;renderStep()}
 });
 $("helpSessionClose").addEventListener("click",exitMode);
 $("helpBreathStart").addEventListener("click",startBreathing);
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
  importPlan:function(p){
   var data=validatePlan(p);if(!data)return false;
   if(!fields.some(function(k){return data[k]}))return false;
   if(!writePlan(data))return false;
   populatePlan();return true
  }
 };
 populatePlan();
})();
