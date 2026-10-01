const screens=["welcome","password","flowerIntro","home","gallery","letter"];
let entered="";
let flowerTimer=null;

function show(id){
  screens.forEach(name=>{
    const el=document.getElementById(name);
    if(el) el.classList.toggle("hidden",name!==id);
  });

  // Music is ONLY allowed on the Memories and Love Letter pages.
  const musicAllowed = id === "gallery" || id === "letter";
  if(!musicAllowed && !loveSong.paused){
    loveSong.pause();
    loveSong.currentTime = 0;
  }
  if(musicAllowed){
    startLoveSong();
  }
  musicToggle.classList.toggle("music-hidden", !musicAllowed);
  updateMusicButton();
  window.scrollTo({top:0,behavior:"smooth"});
}

const openGift=document.getElementById("openGift");
const closePassword=document.getElementById("closePassword");
const keypad=document.getElementById("keypad");
const dots=[...document.querySelectorAll("#dots span")];
const hint=document.getElementById("hint");
const loveSong=document.getElementById("loveSong");
const musicToggle=document.getElementById("musicToggle");

function updateMusicButton(){
  const playing=!loveSong.paused;
  musicToggle.classList.toggle("playing",playing);
  musicToggle.setAttribute("aria-pressed",String(playing));
  musicToggle.setAttribute("aria-label",playing?"Pause music":"Play music");
  musicToggle.querySelector("span").textContent=playing?"Pause our song":"Play our song";
}

async function startLoveSong(){
  try{ await loveSong.play(); }catch(e){}
  updateMusicButton();
}

musicToggle.addEventListener("click",async()=>{
  if(loveSong.paused) await startLoveSong();
  else loveSong.pause();
  updateMusicButton();
});
loveSong.addEventListener("play",updateMusicButton);
loveSong.addEventListener("pause",updateMusicButton);

openGift.addEventListener("click",()=>{ show("password"); });

closePassword.addEventListener("click",()=>{
  entered="";updateDots();hint.textContent="A little secret, just for us.";show("welcome");
});

document.querySelectorAll("[data-page]").forEach(button=>{
  button.addEventListener("click",()=>show(button.dataset.page));
});
document.querySelectorAll("[data-back]").forEach(button=>{
  button.addEventListener("click",()=>show(button.dataset.back));
});

const PASSKEY="0711";

function updateDots(){
  dots.forEach((dot,index)=>dot.classList.toggle("filled",index<entered.length));
}

function unlock(){
  hint.textContent="Welcome, my love ♡";
  show("flowerIntro");
  clearTimeout(flowerTimer);
  // This is the new full-screen rose/flower page from the supplied reference.
  flowerTimer=setTimeout(()=>show("home"),2400);
}

keypad.addEventListener("click",event=>{
  const button=event.target.closest("button[data-key]");
  if(!button)return;
  const key=button.dataset.key;
  if(key==="clear"){
    entered="";updateDots();hint.textContent="A little secret, just for us.";return;
  }
  if(entered.length>=4)return;
  entered+=key;updateDots();
  if(entered.length===4){
    if(entered===PASSKEY){
      unlock();
    }else{
      hint.textContent="Not quite, try again ♡";
      setTimeout(()=>{
        entered="";updateDots();hint.textContent="A little secret, just for us.";
      },800);
    }
  }
});

document.addEventListener("keydown",event=>{
  if(document.getElementById("password").classList.contains("hidden"))return;
  if(/^[0-9]$/.test(event.key)){
    keypad.querySelector(`[data-key="${event.key}"]`)?.click();
  }else if(event.key==="Backspace"){
    entered=entered.slice(0,-1);updateDots();
  }else if(event.key==="Escape"){
    closePassword.click();
  }
});
