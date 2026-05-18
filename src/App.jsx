import { useState, useEffect, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Map, Home, User, ShoppingBag, Flame, ChevronRight, ArrowLeft, Check, X, HelpCircle, SkipForward, Zap, TrendingUp, Clock, Target, LogOut, Lock, Sparkles, Compass, BookOpen, FlaskConical, Globe, DollarSign, Heart, Languages, Mountain, Waves, Snowflake, Pickaxe, Gem, Beaker, TreePine } from "lucide-react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Nunito:wght@400;500;600;700;800&family=Lilita+One&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html,body,#root{height:100%;width:100%}
body{font-family:'Nunito',sans-serif;background:#0a0e1a;color:#e8e0d4;overflow-x:hidden;-webkit-font-smoothing:antialiased}input,button{font-family:inherit}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes scaleIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
.ai{animation:fadeIn .4s ease-out both}.as{animation:scaleIn .3s ease-out both}.au{animation:slideUp .4s ease-out both}.fl{animation:float 3s ease-in-out infinite}
.sh{background:linear-gradient(90deg,#d4a843 0%,#f5e6a3 50%,#d4a843 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
.sha{background:linear-gradient(90deg,#f59e0b 0%,#fcd34d 50%,#f59e0b 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
.sb{padding-bottom:max(20px,env(safe-area-inset-bottom,20px))}`;

/* ===== CECE REALMS (Grade 6 Mythology) ===== */
const CR = {
  olympus:{name:"Olympus Peaks",subj:"Math — Numbers & Algebra",icon:Zap,c:{p:"#4a90d9",a:"#f0c040",bg:"linear-gradient(135deg,#1a2a4a,#2a3a6a,#1a2040)"}},
  fracFor:{name:"Fraction Forests",subj:"Math — Fractions",icon:Sparkles,c:{p:"#2ecc71",a:"#a8e6cf",bg:"linear-gradient(135deg,#0a2a1a,#1a3a2a,#0a2018)"}},
  asgard:{name:"Asgard Academy",subj:"Language Arts",icon:BookOpen,c:{p:"#8e44ad",a:"#d4a0f5",bg:"linear-gradient(135deg,#1a102a,#2a1a4a,#1a0a30)"}},
  catacmb:{name:"Paris Catacombs",subj:"French",icon:Languages,c:{p:"#e74c3c",a:"#f5a0a0",bg:"linear-gradient(135deg,#2a0a0a,#3a1a1a,#200a0a)"}},
  atlantis:{name:"Atlantis Archives",subj:"Science",icon:FlaskConical,c:{p:"#00bcd4",a:"#80deea",bg:"linear-gradient(135deg,#0a1a2a,#0a2a3a,#081820)"}},
  sphinx:{name:"Sphinx's Court",subj:"Social Studies",icon:Globe,c:{p:"#e67e22",a:"#f5c88a",bg:"linear-gradient(135deg,#2a1a0a,#3a2a1a,#201508)"}},
  oracle:{name:"Oracle's Vault",subj:"Financial Literacy",icon:DollarSign,c:{p:"#d4a843",a:"#f5e6a3",bg:"linear-gradient(135deg,#1a1a0a,#2a2a1a,#1a1808)"}},
  elysium:{name:"Elysium Gardens",subj:"Health & Arts",icon:Heart,c:{p:"#e91e90",a:"#f5a0d0",bg:"linear-gradient(135deg,#1a0a1a,#2a1a2a,#180a18)"}},
};

/* ===== ALEXI REALMS (Grade 3 Time Travel) ===== */
const AR = {
  jurassic:{name:"Jurassic Jungle",subj:"Math — Number Sense",icon:TreePine,c:{p:"#22c55e",a:"#86efac",bg:"linear-gradient(135deg,#0c1f0e,#1a3a1a,#0a1f0a)"}},
  megalodon:{name:"Megalodon Deep",subj:"Math — Operations",icon:Waves,c:{p:"#0ea5e9",a:"#7dd3fc",bg:"linear-gradient(135deg,#0a1520,#0c2a3a,#081a28)"}},
  iceAge:{name:"Ice Age Tundra",subj:"Language Arts",icon:Snowflake,c:{p:"#a5b4fc",a:"#e0e7ff",bg:"linear-gradient(135deg,#1a1a2e,#252545,#1a1a30)"}},
  volcanic:{name:"Volcanic Forge",subj:"Science",icon:Mountain,c:{p:"#ef4444",a:"#fca5a5",bg:"linear-gradient(135deg,#2a0f0f,#3a1a1a,#2a0a0a)"}},
  fossil:{name:"Fossil Fields",subj:"Social Studies",icon:Pickaxe,c:{p:"#d97706",a:"#fcd34d",bg:"linear-gradient(135deg,#1f1a0a,#2a2010,#1a1508)"}},
  crystal:{name:"Crystal Caves",subj:"Financial Literacy",icon:Gem,c:{p:"#a855f7",a:"#d8b4fe",bg:"linear-gradient(135deg,#1a0a2a,#2a1540,#1a0a28)"}},
  timeLab:{name:"The Time Lab",subj:"French Intro",icon:Beaker,c:{p:"#06b6d4",a:"#67e8f9",bg:"linear-gradient(135deg,#0a1a20,#0c2830,#081820)"}},
  camp:{name:"Expedition Camp",subj:"Health & Arts",icon:Mountain,c:{p:"#f59e0b",a:"#fcd34d",bg:"linear-gradient(135deg,#1a150a,#2a2010,#1a1508)"}},
};

const CRK = [{n:"Novice Explorer",x:0,i:"🗺️"},{n:"Apprentice Seeker",x:200,i:"⚡"},{n:"Realm Seeker",x:500,i:"🔱"},{n:"Guardian",x:1200,i:"🛡️"},{n:"Mythic Explorer",x:2500,i:"👑"}];
const ARK = [{n:"Rookie Agent",x:0,i:"🔍"},{n:"Field Agent",x:200,i:"🦕"},{n:"Senior Agent",x:500,i:"🦈"},{n:"Elite Agent",x:1200,i:"⚡"},{n:"Time Master",x:2500,i:"🌀"}];

/* ===== CREATURES (Alexi) ===== */
const CREATURES = [
  {name:"Stegosaurus",fact:"Had plates on its back for temperature control.",rarity:"Common"},
  {name:"Velociraptor",fact:"Only about the size of a turkey!",rarity:"Common"},
  {name:"Woolly Mammoth",fact:"Had fur up to 1 metre long.",rarity:"Common"},
  {name:"Triceratops",fact:"Its frill may have attracted mates.",rarity:"Common"},
  {name:"Ankylosaurus",fact:"Had a tail club that could break bones.",rarity:"Common"},
  {name:"Sabertooth Tiger",fact:"Fangs were up to 28 cm long.",rarity:"Rare"},
  {name:"Dunkleosteus",fact:"Armored fish that could bite like an alligator.",rarity:"Rare"},
  {name:"Pteranodon",fact:"Wingspan of 7 metres — wider than a giraffe is tall.",rarity:"Rare"},
  {name:"Megalodon",fact:"Largest shark ever. Teeth the size of a human hand.",rarity:"Epic"},
  {name:"Quetzalcoatlus",fact:"Largest flying animal ever — tall as a giraffe.",rarity:"Epic"},
  {name:"T-Rex Alpha",fact:"Strongest bite of any land animal: 6 tonnes of force.",rarity:"Legendary"},
  {name:"Mosasaurus",fact:"Could swallow a great white shark whole.",rarity:"Legendary"},
];
const RC = {Common:"#9ca3af",Rare:"#3b82f6",Epic:"#a855f7",Legendary:"#f59e0b"};
function pickCreature(acc){const r=Math.random();let p;if(acc===100)p=CREATURES.filter(c=>c.rarity==="Epic"||c.rarity==="Legendary");else if(acc>=80)p=CREATURES.filter(c=>c.rarity==="Rare"||c.rarity==="Epic");else p=CREATURES.filter(c=>c.rarity==="Common"||(r>.7&&c.rarity==="Rare"));if(!p.length)p=CREATURES.filter(c=>c.rarity==="Common");return p[Math.floor(Math.random()*p.length)];}

/* ===== CECE QUESTIONS ===== */
const CQ = {
  olympus:[
    {q:"Zeus hid a number: 7 in ten-thousands, 3 in hundreds, 0 elsewhere. What is it?",t:"input",a:"70300",h:"Place value: ten-thousands, thousands, hundreds, tens, ones.",e:"70,300.",d:"easy",tp:"Number Sense"},
    {q:"What is 4,567 × 8?",t:"input",a:"36536",h:"Break it: 4000×8 + 500×8 + 60×8 + 7×8.",e:"36,536.",d:"medium",tp:"Number Sense"},
    {q:"If n + 15 = 42, what is n?",t:"input",a:"27",h:"Subtract 15 from both sides.",e:"n = 27.",d:"easy",tp:"Algebra"},
    {q:"Next in pattern: 2, 6, 18, 54, …?",t:"input",a:"162",h:"Each number × what?",e:"×3 each time. 54×3=162.",d:"medium",tp:"Algebra"},
    {q:"Round 125,430 to nearest thousand?",t:"choice",o:["125,000","126,000","125,400","125,500"],a:"125,000",h:"Hundreds digit is 4 (<5).",e:"Round down to 125,000.",d:"easy",tp:"Number Sense"},
    {q:"What is 15% of 240?",t:"input",a:"36",h:"10%=24, 5%=12, add them.",e:"15% of 240 = 36.",d:"medium",tp:"Number Sense"},
  ],
  fracFor:[
    {q:"What is 2/5 + 1/3?",t:"choice",o:["3/8","11/15","3/15","7/15"],a:"11/15",h:"LCD is 15.",e:"6/15 + 5/15 = 11/15.",d:"easy",tp:"Fractions"},
    {q:"3/4 of a potion minus 1/6. How much left?",t:"choice",o:["2/4","7/12","1/2","5/8"],a:"7/12",h:"LCD is 12.",e:"9/12 − 2/12 = 7/12.",d:"medium",tp:"Fractions"},
    {q:"What is 4 × 2/3?",t:"choice",o:["8/3","6/3","8/12","2/12"],a:"8/3",h:"4×2=8, keep denominator.",e:"4 × 2/3 = 8/3.",d:"easy",tp:"Fractions"},
    {q:"5.67 + 3.8 = ?",t:"input",a:"9.47",h:"Line up decimals: 5.67+3.80.",e:"9.47.",d:"easy",tp:"Decimals"},
    {q:"What is 6 ÷ 3/4?",t:"choice",o:["4.5","8","2","18/4"],a:"8",h:"Keep, change, flip: 6×4/3.",e:"6 ÷ 3/4 = 8.",d:"hard",tp:"Fractions"},
  ],
  asgard:[
    {q:"Which uses 'who' correctly?",t:"choice",o:["The warrior which fought won.","The warrior who fought won.","The warrior whom fought won.","The warrior whose fought won."],a:"The warrior who fought won.",h:"'Who' for subjects.",e:"'Who' = subject of clause.",d:"easy",tp:"Grammar"},
    {q:"'I've told you a million times' — which device?",t:"choice",o:["Metaphor","Idiom","Hyperbole","Simile"],a:"Hyperbole",h:"Extreme exaggeration?",e:"Hyperbole = exaggeration for emphasis.",d:"easy",tp:"Literary Devices"},
    {q:"Main purpose of a persuasive essay?",t:"choice",o:["Tell a story","Explain how-to","Convince the reader","Describe a place"],a:"Convince the reader",h:"Persuade = convince.",e:"Persuasive writing aims to convince.",d:"easy",tp:"Writing"},
    {q:"What does 'break the ice' mean?",t:"choice",o:["Break frozen water","Start awkward conversation","Fail at something","Cool down"],a:"Start awkward conversation",h:"'Ice' = social stiffness.",e:"Idiom meaning: make people comfortable.",d:"medium",tp:"Literary Devices"},
  ],
  catacmb:[
    {q:"Comment dit-on 'hello'?",t:"choice",o:["Merci","Bonjour","Au revoir","S'il vous plaît"],a:"Bonjour",h:"Most common greeting.",e:"Bonjour = Hello.",d:"easy",tp:"Vocabulary"},
    {q:"'Je joue au volleyball avec mes amies' means?",t:"choice",o:["I play volleyball with my friends.","I watch volleyball with family.","I like volleyball.","I played yesterday."],a:"I play volleyball with my friends.",h:"Jouer=play, avec=with.",e:"Je=I, joue=play, avec=with, amies=friends.",d:"easy",tp:"Reading"},
    {q:"'Elle _____ une pomme.' (eats)",t:"choice",o:["mange","manges","mangent","manger"],a:"mange",h:"Elle → 3rd person singular.",e:"Elle mange.",d:"easy",tp:"Grammar"},
    {q:"'The weather is cold today' in French?",t:"choice",o:["Il fait chaud.","Il fait froid aujourd'hui.","Il pleut.","Il neige."],a:"Il fait froid aujourd'hui.",h:"Froid=cold.",e:"Il fait froid = It is cold.",d:"medium",tp:"Vocabulary"},
  ],
  atlantis:[
    {q:"Which is NOT a force of flight?",t:"choice",o:["Lift","Drag","Momentum","Thrust"],a:"Momentum",h:"Four forces: lift, drag, thrust, gravity.",e:"Momentum is not a flight force.",d:"easy",tp:"Flight"},
    {q:"Series circuit: one bulb burns out?",t:"choice",o:["Others brighter","Nothing changes","All go out","Only nearby"],a:"All go out",h:"One path for electricity.",e:"Series = single loop. Break one, all stop.",d:"easy",tp:"Electricity"},
    {q:"Which planet has famous rings?",t:"choice",o:["Jupiter","Neptune","Saturn","Uranus"],a:"Saturn",h:"Most visible ring system.",e:"Saturn's rings: ice and rock.",d:"easy",tp:"Space"},
  ],
  sphinx:[
    {q:"Three levels of Canadian government?",t:"choice",o:["Federal, Provincial, Municipal","Federal, State, Local","National, Regional, District","Parliament, Senate, Court"],a:"Federal, Provincial, Municipal",h:"Provinces, not states.",e:"Federal, Provincial, Municipal.",d:"easy",tp:"Government"},
    {q:"Main economic activity in New France?",t:"choice",o:["Gold mining","Fur trade","Farming","Fishing"],a:"Fur trade",h:"Beaver pelts.",e:"Fur trade was the foundation.",d:"easy",tp:"Heritage"},
  ],
  oracle:[
    {q:"8 bars/$6.40 or 12/$8.40. Better deal?",t:"choice",o:["8-pack ($0.80)","12-pack ($0.70)","Same","Need info"],a:"12-pack ($0.70)",h:"Divide price by quantity.",e:"$8.40÷12=$0.70 < $0.80.",d:"easy",tp:"Unit Pricing"},
    {q:"$50 budget. Spend $12+$8+$15. Left?",t:"input",a:"15",h:"Add spending, subtract.",e:"$50−$35=$15.",d:"easy",tp:"Budgeting"},
  ],
  elysium:[
    {q:"Largest plate portion per Canada's Food Guide?",t:"choice",o:["Protein","Grains","Fruits & vegetables","Dairy"],a:"Fruits & vegetables",h:"Half the plate.",e:"Fruits & veg = half.",d:"easy",tp:"Nutrition"},
    {q:"Three primary art colours?",t:"choice",o:["Red, green, blue","Red, yellow, blue","Orange, green, purple","Pink, yellow, cyan"],a:"Red, yellow, blue",h:"Can't be mixed from others.",e:"Primary: red, yellow, blue.",d:"easy",tp:"Visual Arts"},
  ],
};

/* ===== ALEXI QUESTIONS ===== */
const AQ = {
  jurassic:[
    {q:"A T-Rex has 346 bones. Triceratops has 278. Total?",t:"input",a:"624",h:"346+278. Carry when over 9!",e:"346+278=624.",d:"easy",tp:"Addition"},
    {q:"Place value of 5 in 583?",t:"choice",o:["5 ones","5 tens","5 hundreds","5 thousands"],a:"5 hundreds",h:"Leftmost digit in 3-digit number.",e:"5=hundreds, 8=tens, 3=ones.",d:"easy",tp:"Place Value"},
    {q:"Greater: 467 or 476?",t:"choice",o:["467","476","Equal","Can't tell"],a:"476",h:"Compare tens: 6 vs 7.",e:"476 has 7 tens > 6 tens.",d:"easy",tp:"Comparing"},
    {q:"Dino takes 7 steps, 3m each. How far?",t:"input",a:"21",h:"7 groups of 3.",e:"7×3=21 metres.",d:"easy",tp:"Multiplication"},
    {q:"Round 672 to nearest hundred?",t:"choice",o:["600","700","670","680"],a:"700",h:"Tens digit 7 ≥ 5.",e:"Round up to 700.",d:"easy",tp:"Rounding"},
  ],
  megalodon:[
    {q:"Megalodon eats 6 fish/day. How many in a week?",t:"input",a:"42",h:"Week = 7 days.",e:"6×7=42.",d:"easy",tp:"Multiplication"},
    {q:"63 ÷ 9 = ?",t:"input",a:"7",h:"How many 9s in 63?",e:"63÷9=7.",d:"easy",tp:"Division"},
    {q:"Next: 5, 10, 15, 20, …?",t:"input",a:"25",h:"Adding what each time?",e:"+5 each time. 25.",d:"easy",tp:"Patterns"},
    {q:"4 × 6 = ?",t:"input",a:"24",h:"4 groups of 6.",e:"24.",d:"easy",tp:"Multiplication"},
    {q:"Pattern: 2, 4, 8, 16, … rule?",t:"choice",o:["Add 2","Add 4","Double","Multiply by 3"],a:"Double",h:"Each number vs previous?",e:"×2 each time.",d:"hard",tp:"Patterns"},
  ],
  iceAge:[
    {q:"Which is a proper noun?",t:"choice",o:["mountain","Canada","river","animal"],a:"Canada",h:"Specific place, capital letter.",e:"Canada = proper noun.",d:"easy",tp:"Grammar"},
    {q:"What ends a question?",t:"choice",o:["Period .","Exclamation !","Question mark ?","Comma ,"],a:"Question mark ?",h:"Asking something…",e:"Questions end with ?",d:"easy",tp:"Punctuation"},
    {q:"Correct sentence?",t:"choice",o:["the mammoth walked slow.","The mammoth walked slowly.","the mammoth Walked slowly.","The mammoth walked Slowly."],a:"The mammoth walked slowly.",h:"Capital at start only, period at end.",e:"'Slowly' = adverb. Capital only at start.",d:"easy",tp:"Grammar"},
    {q:"Which word has a prefix?",t:"choice",o:["undone","sunny","jumping","faster"],a:"undone",h:"Prefix goes at the START.",e:"'Un-' prefix = not. Undone = not done.",d:"medium",tp:"Vocabulary"},
  ],
  volcanic:[
    {q:"Which force pulls things down?",t:"choice",o:["Friction","Gravity","Magnetism","Push"],a:"Gravity",h:"What makes things fall?",e:"Gravity pulls toward Earth's centre.",d:"easy",tp:"Forces"},
    {q:"Which is NOT a plant part?",t:"choice",o:["Root","Stem","Leaf","Bone"],a:"Bone",h:"Plants don't have skeletons.",e:"Plants: roots, stems, leaves, flowers.",d:"easy",tp:"Plants"},
    {q:"What makes structures strong?",t:"choice",o:["Making them thin","Using triangles","Making them tall","One material only"],a:"Using triangles",h:"Think about bridges.",e:"Triangles distribute force evenly.",d:"easy",tp:"Structures"},
    {q:"What is friction?",t:"choice",o:["Pushes up","Slows things down","Type of gravity","Magnetic"],a:"Slows things down",h:"Rub hands together — what happens?",e:"Friction: force between surfaces that slows movement.",d:"easy",tp:"Forces"},
  ],
  fossil:[
    {q:"1800s Ontario: how did people travel far?",t:"choice",o:["Airplanes","Cars","Horses and boats","Trains"],a:"Horses and boats",h:"No cars or planes yet!",e:"Before engines: horses, boats, walking.",d:"easy",tp:"Communities"},
    {q:"Urban vs rural?",t:"choice",o:["Urban=farm","Urban=city, Rural=country","Same thing","Urban=water"],a:"Urban=city, Rural=country",h:"Toronto = urban.",e:"Urban=city, Rural=countryside.",d:"easy",tp:"Communities"},
  ],
  crystal:[
    {q:"$5 bill, buy snack $3.25. Change?",t:"input",a:"1.75",h:"$5.00 − $3.25.",e:"$1.75.",d:"easy",tp:"Making Change"},
    {q:"Which coins = $0.75?",t:"choice",o:["3 quarters","7 dimes + nickel","2 quarters + 3 dimes","Quarter + 4 dimes"],a:"3 quarters",h:"Quarter = $0.25 × 3.",e:"3 × $0.25 = $0.75.",d:"easy",tp:"Coins"},
    {q:"Winter coat: need or want?",t:"choice",o:["Want","Need","Both","Neither"],a:"Need",h:"Canadian winter = −20°C.",e:"In cold climates, it's a need.",d:"easy",tp:"Needs vs Wants"},
  ],
  timeLab:[
    {q:"'Dog' in French?",t:"choice",o:["chat","chien","oiseau","poisson"],a:"chien",h:"Chat=cat. This one's man's best friend.",e:"Chien=dog. Chat=cat.",d:"easy",tp:"Animals"},
    {q:"What is 'merci'?",t:"choice",o:["Hello","Please","Thank you","Goodbye"],a:"Thank you",h:"Said after someone helps.",e:"Merci = Thank you.",d:"easy",tp:"Basics"},
    {q:"'Blue' in French?",t:"choice",o:["rouge","vert","bleu","jaune"],a:"bleu",h:"Sounds like 'blew'!",e:"Bleu=blue. Rouge=red. Vert=green.",d:"easy",tp:"Colours"},
    {q:"'Je m'appelle Alexi' means?",t:"choice",o:["I like Alexi","My name is Alexi","I am from Alexi","Alexi is here"],a:"My name is Alexi",h:"M'appelle = I call myself.",e:"Je m'appelle = My name is.",d:"easy",tp:"Introductions"},
  ],
  camp:[
    {q:"Best energy food group for sports?",t:"choice",o:["Candy","Whole grains","Soda","Chips"],a:"Whole grains",h:"Bread, rice, pasta = steady fuel.",e:"Whole grains give lasting energy.",d:"easy",tp:"Nutrition"},
    {q:"Three primary colours?",t:"choice",o:["Red, green, blue","Red, yellow, blue","Orange, green, purple","Pink, yellow, cyan"],a:"Red, yellow, blue",h:"Can't be made by mixing.",e:"Red, yellow, blue → mix for secondary.",d:"easy",tp:"Art"},
  ],
};

/* ===== REWARDS ===== */
const CRW = {i:[{id:"p1",name:"Phoenix Companion",cost:150,owned:false,desc:"Fiery phoenix follows you"},{id:"p2",name:"Fenrir Wolf Pup",cost:200,owned:false,desc:"Norse wolf companion"},{id:"p3",name:"Golden Banner",cost:100,owned:false,desc:"Shimmering profile banner"},{id:"p4",name:"Celestial Armor",cost:400,owned:false,desc:"Mythic armor set"}],r:[{id:"b",name:"Pick a snack",cost:200,tier:"Bronze"},{id:"s",name:"Choose Friday's movie",cost:500,tier:"Silver"},{id:"g",name:"$10 toward anything",cost:1000,tier:"Gold"},{id:"m",name:"Special experience",cost:2500,tier:"Mythic"}]};
const ARW = {i:[{id:"a1",name:"Rare Creature Boost",cost:150,owned:false,desc:"Next creature guaranteed Rare+"},{id:"a2",name:"Mystery Dino Egg",cost:200,owned:false,desc:"Hatches a random creature"},{id:"a3",name:"Lava Portal Skin",cost:100,owned:false,desc:"Portal glows with lava"},{id:"a4",name:"Camp Upgrade",cost:400,owned:false,desc:"Upgrade expedition camp"}],r:[{id:"b",name:"Pick a snack",cost:200,tier:"Bronze"},{id:"s",name:"30 min extra screen time",cost:500,tier:"Silver"},{id:"g",name:"$10 toward anything",cost:1000,tier:"Gold"},{id:"l",name:"Special experience",cost:2500,tier:"Legendary"}]};

const CN=["The Oracle senses {r} calling…","Ancient whispers from {r}.","A mystery stirs in {r}."];
const AN=["Time disturbance in {r}!","Creatures spotted near {r}.","The Portal flickers toward {r}…","HQ says {r} needs backup."];

/* ===== PROFILES ===== */
const PROF={
  cece:{realms:CR,qs:CQ,ranks:CRK,nudges:CN,curr:"Drachmas",ci:"🏛️",hf:"'Cinzel',serif",ac:"#d4a843",bg:"#0a0e1a",sc:"sh",lbl:"Explorer",ml:"Realm Map",rw:CRW},
  alexi:{realms:AR,qs:AQ,ranks:ARK,nudges:AN,curr:"Time Crystals",ci:"💎",hf:"'Lilita One',sans-serif",ac:"#f59e0b",bg:"#0c1f0e",sc:"sha",lbl:"Agent",ml:"Era Map",rw:ARW},
};

/* ===== STORAGE ===== */
const FD=doc(db,"appData","realmquest");const LK="rq_v3";
function lL(){try{return JSON.parse(localStorage.getItem(LK))}catch{return null}}
function sL(d){try{localStorage.setItem(LK,JSON.stringify(d))}catch{}}
async function sC(d){try{const s={...d};delete s.currentUser;await setDoc(FD,s)}catch(e){console.error("Cloud:",e)}}
function mkC(id,nm,gr,rl,rw){return{id,name:nm,grade:gr,drachmas:0,totalXP:0,streak:{current:0,longest:0,lastActiveDate:null},realmProgress:Object.fromEntries(Object.keys(rl).map(k=>[k,{questsCompleted:0,correct:0,total:0,visited:false}])),history:[],creatures:[],rewards:{inApp:rw.i.map(r=>({...r})),realWorld:rw.r.map(r=>({...r})),pendingClaims:[]}}}
function fresh(){return{currentUser:null,parent:{pin:"1234"},children:[mkC("cece","Cece",6,CR,CRW),mkC("alexi","Alexi",3,AR,ARW)]}}
function gR(ranks,xp){return[...ranks].reverse().find(r=>xp>=r.x)||ranks[0]}
function gN(ranks,xp){const r=gR(ranks,xp);return ranks[ranks.indexOf(r)+1]||null}
function td(){return new Date().toISOString().split("T")[0]}
function gW(ch,rl){let w=null,lo=101;Object.entries(ch.realmProgress).forEach(([k,p])=>{if(p.total>0){const pc=p.correct/p.total*100;if(pc<lo){lo=pc;w=k}}else if(lo>100){w=k;lo=-1}});return w}
const TC={Bronze:"#cd7f32",Silver:"#c0c0c0",Gold:"#d4a843",Mythic:"#8e44ad",Legendary:"#f59e0b"};

/* ===== APP ===== */
export default function App(){
  const[data,setData]=useState(()=>lL()||fresh());
  const[scr,setScr]=useState("login");
  const[realm,setRealm]=useState(null);
  const[qs,setQs]=useState(null);
  const[ld,setLd]=useState(true);
  const tm=useRef(null);const lf=useRef(false);

  useEffect(()=>{const u=onSnapshot(FD,s=>{if(s.exists()&&!lf.current){const c=s.data();setData(p=>({...c,currentUser:p.currentUser}));sL({...c})}lf.current=false;setLd(false)},()=>setLd(false));return()=>u()},[]);
  useEffect(()=>{sL(data);if(tm.current)clearTimeout(tm.current);tm.current=setTimeout(()=>{lf.current=true;sC(data)},500)},[data]);

  const uid=data.currentUser;const isPar=uid==="parent";
  const ci=uid==="alexi"?1:0;const ch=data.children[ci];const pr=PROF[uid]||PROF.cece;
  const uC=useCallback(fn=>{setData(p=>{const n=JSON.parse(JSON.stringify(p));fn(n.children[uid==="alexi"?1:0]);return n})},[uid]);
  const nav=useCallback((s,r)=>{setScr(s);if(r!==undefined)setRealm(r);window.scrollTo(0,0)},[]);

  if(ld)return<div style={{background:"#0a0e1a",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{CSS}</style><div className="fl" style={{textAlign:"center"}}><div style={{fontSize:48}}>⚡</div><p style={{fontFamily:"'Cinzel',serif",color:"#d4a843",fontSize:18,marginTop:12}}>Loading…</p></div></div>;

  return(
    <div style={{background:isPar?"#f8f7f4":pr.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative",overflowX:"hidden"}}>
      <style>{CSS}</style>
      {scr==="login"&&<Login data={data} setData={setData} nav={nav}/>}
      {scr==="home"&&!isPar&&<Hm ch={ch} pr={pr} nav={nav}/>}
      {scr==="realmMap"&&<Rm ch={ch} pr={pr} nav={nav}/>}
      {scr==="quest"&&<Qst realm={realm} ch={ch} pr={pr} uid={uid} uC={uC} nav={nav} setQs={setQs}/>}
      {scr==="questComplete"&&<QC qs={qs} pr={pr} uid={uid} nav={nav}/>}
      {scr==="profile"&&<Prof ch={ch} pr={pr}/>}
      {scr==="journal"&&uid==="alexi"&&<Jrnl ch={ch} pr={pr}/>}
      {scr==="bazaar"&&<Baz ch={ch} pr={pr} uC={uC} nav={nav} isPar={isPar}/>}
      {scr==="parentDash"&&<PDash data={data} setData={setData} nav={nav}/>}
      {!isPar&&!["login","quest","questComplete"].includes(scr)&&<BN scr={scr} nav={nav} pr={pr} uid={uid}/>}
    </div>
  );
}

/* ===== LOGIN ===== */
function Login({data,setData,nav}){const[sp,setSp]=useState(false);const[pin,setPin]=useState("");const[err,setErr]=useState("");
const go=(u,s)=>{setData(p=>({...p,currentUser:u}));nav(s)};
return(<div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(180deg,#0a0e1a,#141830,#0a0e1a)"}}>
  <div className="ai" style={{textAlign:"center",marginBottom:40}}><div style={{fontSize:56,marginBottom:12}} className="fl">⚡</div><h1 style={{fontFamily:"'Cinzel',serif",fontSize:28,fontWeight:900}} className="sh">RealmQuest</h1><p style={{color:"#8a8070",fontSize:13,letterSpacing:2,textTransform:"uppercase",marginTop:4}}>Choose Your Adventure</p></div>
  <div className="ai" style={{width:"100%",maxWidth:320,animationDelay:"0.2s",display:"flex",flexDirection:"column",gap:12}}>
    <button onClick={()=>go("cece","home")} style={{width:"100%",padding:"16px",borderRadius:16,border:"2px solid #d4a843",background:"linear-gradient(135deg,#1a1a0a,#2a2a1a)",color:"#f5e6a3",fontFamily:"'Cinzel',serif",fontSize:16,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}><Compass size={20}/> Cece's Adventure</button>
    <button onClick={()=>go("alexi","home")} style={{width:"100%",padding:"16px",borderRadius:16,border:"2px solid #f59e0b",background:"linear-gradient(135deg,#0c1f0e,#1a3018)",color:"#fcd34d",fontFamily:"'Lilita One',sans-serif",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>🦕 Alexi's Mission</button>
    {!sp?<button onClick={()=>setSp(true)} style={{width:"100%",padding:"14px",borderRadius:16,border:"1px solid #333",background:"transparent",color:"#8a8070",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Lock size={16}/> Parent Dashboard</button>
    :<div style={{background:"#141830",borderRadius:16,padding:20,border:"1px solid #222"}}><p style={{fontSize:13,color:"#8a8070",marginBottom:12}}>Parent PIN:</p><input type="password" maxLength={4} value={pin} onChange={e=>{setPin(e.target.value);setErr("")}} placeholder="••••" style={{width:"100%",padding:12,borderRadius:10,border:"1px solid #333",background:"#0a0e1a",color:"#e8e0d4",fontSize:24,textAlign:"center",letterSpacing:12}}/>{err&&<p style={{color:"#e74c3c",fontSize:12,marginTop:8}}>{err}</p>}<button onClick={()=>pin===data.parent.pin?go("parent","parentDash"):setErr("Incorrect PIN.")} style={{width:"100%",marginTop:12,padding:12,borderRadius:10,border:"none",background:"#333",color:"#e8e0d4",fontSize:14,cursor:"pointer",fontWeight:600}}>Enter</button></div>}
  </div>
</div>);}

/* ===== HOME ===== */
function Hm({ch,pr,nav}){const rk=gR(pr.ranks,ch.totalXP);const nx=gN(pr.ranks,ch.totalXP);const w=gW(ch,pr.realms);const nd=pr.nudges[Math.floor(Date.now()/86400000)%pr.nudges.length].replace("{r}",w?pr.realms[w].name:"unknown lands");
return(<div style={{padding:"20px 16px 100px"}}>
  <div className="ai" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div><p style={{color:"#8a8070",fontSize:13,textTransform:"uppercase",letterSpacing:1.5}}>Welcome back</p><h1 style={{fontFamily:pr.hf,fontSize:26,fontWeight:700,color:"#e8e0d4"}}>{ch.name}</h1></div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:20}}>{rk.i}</span><span style={{fontFamily:pr.hf,fontSize:12,color:pr.ac}}>{rk.n}</span></div></div>
  <div className="ai" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24,animationDelay:"0.1s"}}><SB i={<Flame size={18} color="#e67e22"/>} l="Streak" v={`${ch.streak.current}d`}/><SB i={pr.ci} l={pr.curr} v={ch.drachmas}/><SB i={<TrendingUp size={18} color="#2ecc71"/>} l="XP" v={ch.totalXP}/></div>
  <div className="ai" style={{animationDelay:"0.2s",background:`${pr.ac}10`,borderRadius:20,padding:20,marginBottom:20,border:`1px solid ${pr.ac}30`}}><p style={{fontSize:12,textTransform:"uppercase",letterSpacing:2,color:pr.ac,marginBottom:8,fontWeight:700}}>Daily Mission</p><p style={{fontSize:14,color:"#c0b8a8",marginBottom:16,lineHeight:1.5,fontStyle:"italic"}}>{nd}</p><button onClick={()=>nav("realmMap")} style={{width:"100%",padding:16,borderRadius:14,border:"none",background:`linear-gradient(135deg,${pr.ac},${pr.ac}cc)`,color:"#0a0e1a",fontFamily:pr.hf,fontSize:16,fontWeight:700,cursor:"pointer"}}>Begin Mission</button></div>
  {nx&&<div className="ai" style={{animationDelay:"0.3s",background:"#141830",borderRadius:16,padding:16,border:"1px solid #222"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:8}}><span style={{color:"#8a8070"}}>Rank Progress</span><span style={{color:pr.ac}}>{ch.totalXP}/{nx.x} XP</span></div><div style={{height:6,borderRadius:3,background:"#1a1a2a"}}><div style={{height:"100%",borderRadius:3,background:`linear-gradient(90deg,${pr.ac},${pr.ac}88)`,width:`${Math.min(100,ch.totalXP/nx.x*100)}%`}}/></div><p style={{fontSize:11,color:"#8a8070",marginTop:6}}>Next: {nx.i} {nx.n}</p></div>}
</div>);}
function SB({i,l,v}){return<div style={{background:"#141830",borderRadius:14,padding:"14px 10px",textAlign:"center",border:"1px solid #1a1a30"}}><div style={{marginBottom:4,fontSize:typeof i==="string"?18:undefined}}>{i}</div><p style={{fontSize:18,fontWeight:800,color:"#e8e0d4"}}>{v}</p><p style={{fontSize:10,color:"#8a8070",textTransform:"uppercase",letterSpacing:1}}>{l}</p></div>}

/* ===== MAP ===== */
function Rm({ch,pr,nav}){return(<div style={{padding:"20px 16px 100px"}}><h2 style={{fontFamily:pr.hf,fontSize:22,color:pr.ac,marginBottom:4}}>{pr.ml}</h2><p style={{fontSize:13,color:"#8a8070",marginBottom:20}}>Choose your next mission.</p><div style={{display:"flex",flexDirection:"column",gap:12}}>{Object.entries(pr.realms).map(([k,r],i)=>{const p=ch.realmProgress[k],pc=p?.total?Math.round(p.correct/p.total*100):0;return<div key={k} className="ai" onClick={()=>nav("quest",k)} style={{animationDelay:`${i*.06}s`,background:r.c.bg,borderRadius:18,padding:"16px 18px",cursor:"pointer",border:`1px solid ${r.c.p}33`,display:"flex",alignItems:"center",gap:14}}><div style={{width:48,height:48,borderRadius:14,background:`${r.c.p}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><r.icon size={24} color={r.c.p}/></div><div style={{flex:1}}><p style={{fontFamily:pr.hf,fontSize:14,fontWeight:700,color:"#e8e0d4",marginBottom:2}}>{r.name}</p><p style={{fontSize:11,color:"#8a8070"}}>{r.subj}</p><div style={{marginTop:6,display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:4,borderRadius:2,background:"#0a0a1a"}}><div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${r.c.p},${r.c.a})`,width:`${pc}%`,transition:"width .5s"}}/></div><span style={{fontSize:11,color:r.c.p,fontWeight:700}}>{pc}%</span></div></div><ChevronRight size={18} color="#555"/></div>})}</div></div>);}

/* ===== QUEST ===== */
function Qst({realm,ch,pr,uid,uC,nav,setQs}){const[idx,setIdx]=useState(0);const[sel,setSel]=useState(null);const[inp,setInp]=useState("");const[rev,setRev]=useState(false);const[ht,setHt]=useState(false);const[res,setRes]=useState([]);const t0=useRef(Date.now());
const rc=pr.realms[realm];const qb=(pr.qs[realm]||[]).slice(0,5);const q=qb[idx];if(!q)return null;
const cor=q.t==="input"?inp.trim().replace(/,/g,"")===q.a.replace(/,/g,""):sel===q.a;
const sub=()=>{if(q.t==="input"&&!inp.trim())return;if(q.t==="choice"&&!sel)return;setRev(true);setRes(p=>[...p,{correct:cor,q:q.q,tp:q.tp}])};
const fin=(fr)=>{const c=fr.filter(r=>r.correct).length,t=qb.length,acc=Math.round(c/t*100),base=acc>=80?20:acc>=60?15:10,bon=acc===100?15:0,earned=base+bon,el=Math.round((Date.now()-t0.current)/1000),cr=uid==="alexi"?pickCreature(acc):null;
const st={realm,correct:c,total:t,accuracy:acc,drachmasEarned:earned,timeSeconds:el,results:fr,creature:cr};setQs(st);
uC(ch=>{ch.drachmas+=earned;ch.totalXP+=earned+c*5;if(ch.realmProgress[realm]){ch.realmProgress[realm].questsCompleted+=1;ch.realmProgress[realm].correct+=c;ch.realmProgress[realm].total+=t;if(!ch.realmProgress[realm].visited){ch.drachmas+=30;ch.realmProgress[realm].visited=true}}const today=td(),last=ch.streak.lastActiveDate;if(last!==today){const y=new Date();y.setDate(y.getDate()-1);if(last===y.toISOString().split("T")[0])ch.streak.current+=1;else if(!last)ch.streak.current=1;else ch.streak.current=Math.max(1,ch.streak.current);ch.streak.lastActiveDate=today;ch.streak.longest=Math.max(ch.streak.longest,ch.streak.current)}ch.history.push({date:today,realm,accuracy:acc,time:el,drachmas:earned});if(cr&&!ch.creatures.find(x=>x.name===cr.name))ch.creatures.push(cr)});nav("questComplete")};
const nxt=()=>{setSel(null);setInp("");setRev(false);setHt(false);if(idx+1>=qb.length)fin([...res]);else setIdx(i=>i+1)};
const skp=()=>{const r=[...res,{correct:false,q:q.q,tp:q.tp,skip:true}];setRes(r);setSel(null);setInp("");setRev(false);setHt(false);if(idx+1>=qb.length)fin(r);else setIdx(i=>i+1)};
const eM=uid==="alexi"?"Whoa, the T-Rex didn't buy that one.":"The realm resists.";const oM=uid==="alexi"?"Nailed it, Agent!":"The realm accepts.";
return(<div style={{minHeight:"100vh",background:rc.c.bg,paddingBottom:32}}>
  <div style={{padding:"16px 16px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><button onClick={()=>nav("realmMap")} style={{background:"none",border:"none",color:"#8a8070",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:13}}><ArrowLeft size={18}/> Leave</button><span style={{fontFamily:pr.hf,fontSize:13,color:rc.c.p}}>{idx+1}/{qb.length}</span></div>
  <div style={{padding:"0 16px",marginBottom:20}}><div style={{height:4,borderRadius:2,background:"#0a0a0a"}}><div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${rc.c.p},${rc.c.a})`,width:`${((idx+(rev?1:0))/qb.length)*100}%`,transition:"width .4s"}}/></div></div>
  <div style={{padding:"0 16px",marginBottom:16}}><div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:20,background:`${rc.c.p}15`,border:`1px solid ${rc.c.p}30`}}><rc.icon size={14} color={rc.c.p}/><span style={{fontSize:11,color:rc.c.p,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{rc.name}</span></div></div>
  <div className="as" key={idx} style={{padding:"0 16px",marginBottom:24}}><p style={{fontFamily:pr.hf,fontSize:17,fontWeight:600,color:"#e8e0d4",lineHeight:1.6,marginBottom:4}}>{q.q}</p><span style={{fontSize:11,color:"#8a8070"}}>{q.tp} · {q.d}</span></div>
  <div style={{padding:"0 16px"}}>
    {q.t==="choice"&&(q.o||[]).map((o,i)=>{const pk=sel===o,isA=rev&&o===q.a,isW=rev&&pk&&!cor;let bg="#141830",bd="#222";if(pk&&!rev){bg=`${rc.c.p}22`;bd=rc.c.p}if(isA){bg="#1a3a2a";bd="#2ecc71"}if(isW){bg="#3a1a1a";bd="#e74c3c"}return<button key={i} onClick={()=>!rev&&setSel(o)} disabled={rev} style={{width:"100%",padding:"14px 16px",borderRadius:14,border:`2px solid ${bd}`,background:bg,color:"#e8e0d4",fontSize:14,textAlign:"left",cursor:rev?"default":"pointer",marginBottom:10,display:"flex",alignItems:"center",gap:10,transition:"all .2s"}}>{isA&&<Check size={18} color="#2ecc71"/>}{isW&&<X size={18} color="#e74c3c"/>}<span>{o}</span></button>})}
    {q.t==="input"&&<><input type="text" inputMode="decimal" value={inp} onChange={e=>setInp(e.target.value)} disabled={rev} placeholder="Your answer…" onKeyDown={e=>e.key==="Enter"&&!rev&&sub()} style={{width:"100%",padding:"16px",borderRadius:14,border:`2px solid ${rev?(cor?"#2ecc71":"#e74c3c"):"#333"}`,background:"#141830",color:"#e8e0d4",fontSize:18}}/>{rev&&!cor&&<p style={{fontSize:13,color:"#2ecc71",marginTop:8}}>Answer: {q.a}</p>}</>}
    {ht&&!rev&&<div className="ai" style={{marginTop:12,padding:14,borderRadius:12,background:`${pr.ac}15`,border:`1px solid ${pr.ac}30`}}><p style={{fontSize:13,color:pr.ac,lineHeight:1.5}}>💡 {q.h}</p></div>}
    {rev&&<div className="ai" style={{marginTop:16,padding:16,borderRadius:14,background:cor?"rgba(46,204,113,.08)":"rgba(231,76,60,.08)",border:`1px solid ${cor?"#2ecc7133":"#e74c3c33"}`}}><p style={{fontSize:14,fontWeight:700,color:cor?"#2ecc71":"#e8e0d4",marginBottom:6}}>{cor?oM:eM}</p><p style={{fontSize:13,color:"#b0a898",lineHeight:1.6}}>{q.e}</p></div>}
  </div>
  <div style={{padding:"20px 16px 0",display:"flex",gap:10}}>
    {!rev?<><button onClick={skp} style={{padding:"14px 16px",borderRadius:12,border:"1px solid #333",background:"transparent",color:"#8a8070",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:6}}><SkipForward size={16}/>Skip</button>{!ht&&<button onClick={()=>setHt(true)} style={{padding:"14px 16px",borderRadius:12,border:"1px solid #333",background:"transparent",color:pr.ac,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:6}}><HelpCircle size={16}/>Hint</button>}<button onClick={sub} style={{flex:1,padding:14,borderRadius:12,border:"none",background:`linear-gradient(135deg,${rc.c.p},${rc.c.a})`,color:"#0a0e1a",fontWeight:700,fontSize:15,cursor:"pointer"}}>Submit</button></>
    :<button onClick={nxt} style={{flex:1,padding:16,borderRadius:12,border:"none",background:`linear-gradient(135deg,${pr.ac},${pr.ac}cc)`,color:"#0a0e1a",fontFamily:pr.hf,fontWeight:700,fontSize:16,cursor:"pointer"}}>{idx+1>=qb.length?"Complete Mission":"Next Challenge"}</button>}
  </div>
</div>);}

/* ===== QUEST COMPLETE ===== */
function QC({qs,pr,uid,nav}){if(!qs)return null;const r=pr.realms[qs.realm];
return(<div style={{minHeight:"100vh",background:"linear-gradient(180deg,#0a0e1a,#141830)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
  <div className="as" style={{textAlign:"center",marginBottom:32}}><div style={{fontSize:56,marginBottom:8}}>{qs.accuracy>=80?"⚡":qs.accuracy>=50?"🔱":"🗺️"}</div><h2 style={{fontFamily:pr.hf,fontSize:24,color:pr.ac,marginBottom:4}}>Mission Complete</h2><p style={{color:"#8a8070",fontSize:14}}>{r.name}</p></div>
  <div className="ai" style={{width:"100%",maxWidth:320,animationDelay:"0.2s"}}>
    <div style={{background:"#141830",borderRadius:20,padding:24,border:"1px solid #222",marginBottom:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}><div style={{textAlign:"center"}}><p style={{fontSize:28,fontWeight:800,color:qs.accuracy>=70?"#2ecc71":"#e67e22"}}>{qs.accuracy}%</p><p style={{fontSize:11,color:"#8a8070"}}>Accuracy</p></div><div style={{textAlign:"center"}}><p style={{fontSize:28,fontWeight:800,color:"#e8e0d4"}}>{qs.correct}/{qs.total}</p><p style={{fontSize:11,color:"#8a8070"}}>Correct</p></div></div>
      <div style={{borderTop:"1px solid #222",paddingTop:16,display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:22}}>{pr.ci}</span><div><p style={{fontSize:20,fontWeight:800}} className={pr.sc}>+{qs.drachmasEarned}</p><p style={{fontSize:11,color:"#8a8070"}}>{pr.curr}</p></div></div><div style={{textAlign:"right"}}><p style={{fontSize:14,color:"#e8e0d4",fontWeight:600}}>{Math.floor(qs.timeSeconds/60)}:{String(qs.timeSeconds%60).padStart(2,"0")}</p><p style={{fontSize:11,color:"#8a8070"}}>Time</p></div></div>
    </div>
    {uid==="alexi"&&qs.creature&&<div className="as" style={{background:"#141830",borderRadius:16,padding:16,border:`1px solid ${RC[qs.creature.rarity]}44`,marginBottom:16,textAlign:"center"}}><p style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:RC[qs.creature.rarity],fontWeight:700,marginBottom:4}}>Creature Discovered — {qs.creature.rarity}</p><p style={{fontSize:20,fontWeight:800,color:"#e8e0d4",marginBottom:4}}>🦕 {qs.creature.name}</p><p style={{fontSize:12,color:"#b0a898",fontStyle:"italic"}}>{qs.creature.fact}</p></div>}
    <div style={{display:"flex",gap:10}}><button onClick={()=>nav("realmMap")} style={{flex:1,padding:16,borderRadius:14,border:"1px solid #333",background:"transparent",color:"#e8e0d4",fontWeight:600,fontSize:14,cursor:"pointer"}}>{pr.ml}</button><button onClick={()=>nav("home")} style={{flex:1,padding:16,borderRadius:14,border:"none",background:`linear-gradient(135deg,${pr.ac},${pr.ac}cc)`,color:"#0a0e1a",fontFamily:pr.hf,fontWeight:700,fontSize:14,cursor:"pointer"}}>Home</button></div>
  </div>
</div>);}

/* ===== PROFILE ===== */
function Prof({ch,pr}){const rk=gR(pr.ranks,ch.totalXP);const tq=Object.values(ch.realmProgress).reduce((a,b)=>a+b.questsCompleted,0);const tc=Object.values(ch.realmProgress).reduce((a,b)=>a+b.correct,0);const tt=Object.values(ch.realmProgress).reduce((a,b)=>a+b.total,0);const acc=tt?Math.round(tc/tt*100):0;
const rd=Object.entries(pr.realms).map(([k,r])=>{const p=ch.realmProgress[k];return{s:r.name.split(" ")[0],v:p?.total?Math.round(p.correct/p.total*100):0}});
return(<div style={{padding:"20px 16px 100px"}}><div className="ai" style={{textAlign:"center",marginBottom:24}}><div style={{width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,${pr.ac},${pr.ac}cc)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:36}}>{rk.i}</div><h2 style={{fontFamily:pr.hf,fontSize:24,color:"#e8e0d4"}}>{ch.name}</h2><p style={{fontFamily:pr.hf,fontSize:14,color:pr.ac}}>{rk.n}</p></div>
<div className="ai" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:24,animationDelay:"0.1s"}}>{[{l:"Quests",v:tq},{l:"Accuracy",v:`${acc}%`},{l:"Streak",v:ch.streak.current},{l:"Best",v:ch.streak.longest}].map((s,i)=><div key={i} style={{background:"#141830",borderRadius:12,padding:"12px 8px",textAlign:"center",border:"1px solid #1a1a30"}}><p style={{fontSize:18,fontWeight:800,color:"#e8e0d4"}}>{s.v}</p><p style={{fontSize:9,color:"#8a8070",textTransform:"uppercase"}}>{s.l}</p></div>)}</div>
<div style={{background:"#141830",borderRadius:18,padding:16,border:"1px solid #222"}}><p style={{fontSize:12,color:"#8a8070",textTransform:"uppercase",letterSpacing:1.5,marginBottom:8}}>Power Map</p><ResponsiveContainer width="100%" height={220}><RadarChart data={rd}><PolarGrid stroke="#222"/><PolarAngleAxis dataKey="s" tick={{fill:"#8a8070",fontSize:10}}/><PolarRadiusAxis angle={30} domain={[0,100]} tick={false} axisLine={false}/><Radar dataKey="v" stroke={pr.ac} fill={pr.ac} fillOpacity={0.25} strokeWidth={2}/></RadarChart></ResponsiveContainer></div>
</div>);}

/* ===== FIELD JOURNAL (Alexi) ===== */
function Jrnl({ch,pr}){return(<div style={{padding:"20px 16px 100px"}}><h2 style={{fontFamily:pr.hf,fontSize:22,color:pr.ac,marginBottom:4}}>Field Journal</h2><p style={{fontSize:13,color:"#8a8070",marginBottom:20}}>{ch.creatures.length} creature{ch.creatures.length!==1?"s":""} discovered</p>
{ch.creatures.length===0?<p style={{textAlign:"center",color:"#555",padding:40}}>Complete missions to discover creatures!</p>
:ch.creatures.map((c,i)=><div key={i} className="ai" style={{animationDelay:`${i*.05}s`,background:"#141830",borderRadius:14,padding:16,marginBottom:10,border:`1px solid ${RC[c.rarity]}33`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:16,fontWeight:800,color:"#e8e0d4"}}>🦕 {c.name}</span><span style={{fontSize:10,fontWeight:700,color:RC[c.rarity],textTransform:"uppercase",padding:"2px 8px",borderRadius:6,background:`${RC[c.rarity]}15`}}>{c.rarity}</span></div><p style={{fontSize:12,color:"#b0a898",fontStyle:"italic"}}>{c.fact}</p></div>)}
</div>);}

/* ===== BAZAAR ===== */
function Baz({ch,pr,uC,nav,isPar}){const[tab,setTab]=useState("inApp");const[toast,setToast]=useState(null);
const fl=m=>{setToast(m);setTimeout(()=>setToast(null),2500)};
const buy=it=>{if(ch.drachmas<it.cost||it.owned)return;uC(c=>{c.drachmas-=it.cost;c.rewards.inApp.find(r=>r.id===it.id).owned=true});fl(`Acquired: ${it.name}`)};
const clm=it=>{if(ch.drachmas<it.cost)return;uC(c=>{c.drachmas-=it.cost;c.rewards.pendingClaims.push({...it,at:new Date().toISOString()})});fl("Claim sent for approval")};
const apv=i=>{uC(c=>{c.rewards.pendingClaims.splice(i,1)})};
return(<div style={{padding:"20px 16px 100px"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div><h2 style={{fontFamily:pr.hf,fontSize:22,color:pr.ac}}>{pr.lbl==="Agent"?"The Outpost":"The Bazaar"}</h2>{!isPar&&<p style={{fontSize:13,color:"#8a8070"}}>{pr.ci} {ch.drachmas}</p>}</div>{isPar&&<button onClick={()=>nav("parentDash")} style={{background:"none",border:"1px solid #333",color:"#8a8070",padding:"8px 14px",borderRadius:10,cursor:"pointer",fontSize:12}}>← Back</button>}</div>
  <div style={{display:"flex",marginBottom:20,borderRadius:12,overflow:"hidden",border:"1px solid #222"}}>{[{id:"inApp",l:"Upgrades"},{id:"real",l:"Real Rewards"},...(isPar?[{id:"claims",l:`Claims (${ch.rewards.pendingClaims.length})`}]:[])].map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:12,border:"none",background:tab===t.id?`${pr.ac}20`:"#141830",color:tab===t.id?pr.ac:"#8a8070",fontSize:12,fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:1}}>{t.l}</button>)}</div>
  {tab==="inApp"&&ch.rewards.inApp.map(it=><div key={it.id} style={{background:"#141830",borderRadius:14,padding:16,marginBottom:10,border:"1px solid #222",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{fontSize:14,fontWeight:700,color:"#e8e0d4"}}>{it.name}</p><p style={{fontSize:11,color:"#8a8070"}}>{it.desc}</p></div>{it.owned?<span style={{fontSize:11,color:"#2ecc71",fontWeight:700,padding:"6px 12px",borderRadius:8,background:"#2ecc7115"}}>Owned</span>:<button onClick={()=>buy(it)} disabled={ch.drachmas<it.cost} style={{padding:"8px 16px",borderRadius:10,border:"none",background:ch.drachmas>=it.cost?`linear-gradient(135deg,${pr.ac},${pr.ac}cc)`:"#222",color:ch.drachmas>=it.cost?"#0a0e1a":"#555",fontWeight:700,fontSize:12,cursor:ch.drachmas>=it.cost?"pointer":"default"}}>{pr.ci} {it.cost}</button>}</div>)}
  {tab==="real"&&ch.rewards.realWorld.map(it=><div key={it.id} style={{background:"#141830",borderRadius:14,padding:16,marginBottom:10,border:`1px solid ${TC[it.tier]||"#333"}33`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:10,fontWeight:700,color:TC[it.tier]||"#999",textTransform:"uppercase",padding:"2px 8px",borderRadius:6,background:`${TC[it.tier]||"#999"}15`,display:"inline-block",marginBottom:4}}>{it.tier}</span><p style={{fontSize:14,fontWeight:700,color:"#e8e0d4"}}>{it.name}</p></div><button onClick={()=>clm(it)} disabled={ch.drachmas<it.cost||isPar} style={{padding:"8px 16px",borderRadius:10,border:"none",background:ch.drachmas>=it.cost&&!isPar?`linear-gradient(135deg,${pr.ac},${pr.ac}cc)`:"#222",color:ch.drachmas>=it.cost&&!isPar?"#0a0e1a":"#555",fontWeight:700,fontSize:12,cursor:ch.drachmas>=it.cost&&!isPar?"pointer":"default"}}>{pr.ci} {it.cost}</button></div>)}
  {tab==="claims"&&isPar&&(ch.rewards.pendingClaims.length===0?<p style={{textAlign:"center",padding:40,color:"#8a8070"}}>No pending claims.</p>:ch.rewards.pendingClaims.map((c,i)=><div key={i} style={{background:"#141830",borderRadius:14,padding:16,marginBottom:10,border:"1px solid #222",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{fontSize:14,fontWeight:700,color:"#e8e0d4"}}>{c.name}</p><p style={{fontSize:11,color:"#8a8070"}}>{c.tier}</p></div><button onClick={()=>apv(i)} style={{padding:"8px 16px",borderRadius:10,border:"none",background:"#2ecc71",color:"#0a0e1a",fontWeight:700,fontSize:12,cursor:"pointer"}}>Approve</button></div>))}
  {toast&&<div className="au" style={{position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",background:"#2ecc71",color:"#0a0e1a",padding:"12px 24px",borderRadius:12,fontWeight:700,fontSize:13,zIndex:100,whiteSpace:"nowrap"}}>{toast}</div>}
</div>);}

/* ===== PARENT DASHBOARD ===== */
function PDash({data,setData,nav}){const[ki,setKi]=useState(0);const[tab,setTab]=useState("overview");
const ch=data.children[ki];const pr=ki===0?PROF.cece:PROF.alexi;
const tq=Object.values(ch.realmProgress).reduce((a,b)=>a+b.questsCompleted,0);const tc=Object.values(ch.realmProgress).reduce((a,b)=>a+b.correct,0);const tt=Object.values(ch.realmProgress).reduce((a,b)=>a+b.total,0);const acc=tt?Math.round(tc/tt*100):0;const tT=ch.history.reduce((a,b)=>a+(b.time||0),0);
const sd=Object.entries(pr.realms).map(([k,r])=>{const p=ch.realmProgress[k];return{name:r.name.split(" ")[0],accuracy:p?.total?Math.round(p.correct/p.total*100):0}});
const logout=()=>{setData(p=>({...p,currentUser:null}));nav("login")};
return(<div style={{padding:"20px 16px 40px",minHeight:"100vh",color:"#1a1a2a"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><p style={{fontSize:12,color:"#888",textTransform:"uppercase",letterSpacing:1.5}}>Parent Dashboard</p><button onClick={logout} style={{background:"none",border:"1px solid #ddd",padding:"8px 12px",borderRadius:8,cursor:"pointer",color:"#888",fontSize:12,display:"flex",alignItems:"center",gap:4}}><LogOut size={14}/> Exit</button></div>
  <div style={{display:"flex",gap:8,marginBottom:16}}>{data.children.map((c,i)=><button key={i} onClick={()=>{setKi(i);setTab("overview")}} style={{flex:1,padding:12,borderRadius:12,border:ki===i?"2px solid #1a1a2a":"1px solid #ddd",background:ki===i?"#1a1a2a":"#fff",color:ki===i?"#fff":"#666",fontWeight:700,fontSize:14,cursor:"pointer"}}>{c.name} (Gr.{c.grade})</button>)}</div>
  <div style={{display:"flex",marginBottom:20,borderRadius:10,overflow:"hidden",border:"1px solid #ddd"}}>{["overview","subjects","rewards"].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:10,border:"none",background:tab===t?"#1a1a2a":"#fff",color:tab===t?"#fff":"#888",fontSize:12,fontWeight:700,cursor:"pointer",textTransform:"capitalize"}}>{t}</button>)}</div>
  {tab==="overview"&&<><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>{[{l:"Time",v:`${Math.floor(tT/60)}m`,i:<Clock size={18} color="#4a90d9"/>},{l:"Sessions",v:tq,i:<Target size={18} color="#2ecc71"/>},{l:"Accuracy",v:`${acc}%`,i:<TrendingUp size={18} color="#e67e22"/>},{l:"Streak",v:`${ch.streak.current}d`,i:<Flame size={18} color="#e74c3c"/>}].map((m,i)=><div key={i} style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee"}}><div style={{marginBottom:8}}>{m.i}</div><p style={{fontSize:22,fontWeight:800,color:"#1a1a2a"}}>{m.v}</p><p style={{fontSize:11,color:"#888"}}>{m.l}</p></div>)}</div>
  <div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee",marginBottom:20}}><p style={{fontSize:12,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Insights</p><p style={{fontSize:14,color:"#333",lineHeight:1.7}}>{ch.name} has completed {tq} quest{tq!==1?"s":""} with {acc}% accuracy.{gW(ch,pr.realms)?` ${pr.realms[gW(ch,pr.realms)].subj} could use more attention.`:""}{ch.streak.current>=3?` A ${ch.streak.current}-day streak shows consistency.`:""}</p></div>
  <div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee"}}><p style={{fontSize:12,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Accuracy by Subject</p><ResponsiveContainer width="100%" height={200}><BarChart data={sd} barSize={20}><CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="name" tick={{fontSize:9,fill:"#888"}}/><YAxis domain={[0,100]} tick={{fontSize:10,fill:"#888"}}/><Tooltip contentStyle={{background:"#fff",border:"1px solid #eee",borderRadius:8,fontSize:12}}/><Bar dataKey="accuracy" fill={pr.ac} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></>}
  {tab==="subjects"&&Object.entries(pr.realms).map(([k,r])=>{const p=ch.realmProgress[k],pc=p?.total?Math.round(p.correct/p.total*100):0;return<div key={k} style={{background:"#fff",borderRadius:14,padding:16,marginBottom:10,border:"1px solid #eee"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div><p style={{fontSize:14,fontWeight:700}}>{r.name}</p><p style={{fontSize:12,color:"#888"}}>{r.subj}</p></div><span style={{fontSize:18,fontWeight:800,color:pc>=70?"#2ecc71":pc>=40?"#e67e22":"#e74c3c"}}>{pc}%</span></div><div style={{height:6,borderRadius:3,background:"#eee"}}><div style={{height:"100%",borderRadius:3,background:pc>=70?"#2ecc71":pc>=40?"#e67e22":"#e74c3c",width:`${pc}%`}}/></div><p style={{fontSize:11,color:"#888",marginTop:6}}>{p?.questsCompleted||0} quests · {p?.correct||0}/{p?.total||0}</p></div>})}
  {tab==="rewards"&&<><div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee",marginBottom:16}}><p style={{fontSize:14,fontWeight:700,marginBottom:4}}>{ki===0?"Drachma":"Time Crystal"} Balance</p><p style={{fontSize:28,fontWeight:800,color:pr.ac}}>{ch.drachmas}</p></div>{ch.rewards.pendingClaims.length>0&&<div style={{background:"#fff5e6",borderRadius:14,padding:16,border:"1px solid #e67e22"}}><p style={{fontSize:13,fontWeight:700,color:"#e67e22",marginBottom:8}}>Pending Claims</p>{ch.rewards.pendingClaims.map((c,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0"}}><p style={{fontSize:13,color:"#333"}}>{c.name}</p><button onClick={()=>{setData(p=>{const n=JSON.parse(JSON.stringify(p));n.children[ki].rewards.pendingClaims.splice(i,1);return n})}} style={{padding:"6px 12px",borderRadius:8,border:"none",background:"#2ecc71",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer"}}>Approve</button></div>)}</div>}</>}
</div>);}

/* ===== BOTTOM NAV ===== */
function BN({scr,nav,pr,uid}){
const it=uid==="alexi"?[{id:"home",ic:Home,l:"Home"},{id:"realmMap",ic:Map,l:"Eras"},{id:"journal",ic:BookOpen,l:"Journal"},{id:"profile",ic:User,l:"Profile"},{id:"bazaar",ic:ShoppingBag,l:"Outpost"}]:[{id:"home",ic:Home,l:"Home"},{id:"realmMap",ic:Map,l:"Realms"},{id:"profile",ic:User,l:"Profile"},{id:"bazaar",ic:ShoppingBag,l:"Bazaar"}];
return<div className="sb" style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:`${pr.bg}ee`,backdropFilter:"blur(10px)",borderTop:"1px solid #1a1a30",display:"flex",padding:"8px 0 0",zIndex:50}}>{it.map(i=>{const on=scr===i.id;return<button key={i.id} onClick={()=>nav(i.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 0"}}><i.ic size={20} color={on?pr.ac:"#555"} strokeWidth={on?2.5:1.5}/><span style={{fontSize:9,color:on?pr.ac:"#555",fontWeight:on?700:400}}>{i.l}</span></button>})}</div>;}
