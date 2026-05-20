import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Map, Home, User, ShoppingBag, Flame, ChevronRight, ArrowLeft, Check, X, HelpCircle, SkipForward, Zap, TrendingUp, Clock, Target, LogOut, Lock, Sparkles, Compass, BookOpen, FlaskConical, Globe, DollarSign, Heart, Languages, Mountain, Waves, Snowflake, Pickaxe, Gem, Beaker, TreePine, Pencil, Eraser } from "lucide-react";
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
.sb{padding-bottom:max(20px,env(safe-area-inset-bottom,20px))}
.st{padding-top:max(20px,env(safe-area-inset-top,20px))}`;

/* ===== CECE REALMS (Grade 6 Mythology) ===== */
const CR = {
  olympus:{name:"Mount Olympus",subj:"Math — Numbers & Algebra",icon:Zap,c:{p:"#4a90d9",a:"#f0c040",bg:"linear-gradient(135deg,#1a2a4a,#2a3a6a,#1a2040)"}},
  fracFor:{name:"The Sea of Monsters",subj:"Math — Fractions",icon:Sparkles,c:{p:"#2ecc71",a:"#a8e6cf",bg:"linear-gradient(135deg,#0a2a1a,#1a3a2a,#0a2018)"}},
  asgard:{name:"Camp Half-Blood",subj:"Language Arts",icon:BookOpen,c:{p:"#8e44ad",a:"#d4a0f5",bg:"linear-gradient(135deg,#1a102a,#2a1a4a,#1a0a30)"}},
  catacmb:{name:"Tartarus",subj:"French",icon:Languages,c:{p:"#e74c3c",a:"#f5a0a0",bg:"linear-gradient(135deg,#2a0a0a,#3a1a1a,#200a0a)"}},
  atlantis:{name:"Poseidon's Kingdom",subj:"Science",icon:FlaskConical,c:{p:"#00bcd4",a:"#80deea",bg:"linear-gradient(135deg,#0a1a2a,#0a2a3a,#081820)"}},
  sphinx:{name:"The Lotus Casino",subj:"Social Studies",icon:Globe,c:{p:"#e67e22",a:"#f5c88a",bg:"linear-gradient(135deg,#2a1a0a,#3a2a1a,#201508)"}},
  oracle:{name:"The Attic of Prophecy",subj:"Financial Literacy",icon:DollarSign,c:{p:"#d4a843",a:"#f5e6a3",bg:"linear-gradient(135deg,#1a1a0a,#2a2a1a,#1a1808)"}},
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
  // COMMON — Dinosaurs
  {name:"Stegosaurus",fact:"Had plates on its back for temperature control.",rarity:"Common"},
  {name:"Velociraptor",fact:"Only about the size of a turkey!",rarity:"Common"},
  {name:"Triceratops",fact:"Its frill may have attracted mates.",rarity:"Common"},
  {name:"Ankylosaurus",fact:"Had a tail club that could break bones.",rarity:"Common"},
  {name:"Brachiosaurus",fact:"One of the tallest dinosaurs at 13 metres high.",rarity:"Common"},
  {name:"Parasaurolophus",fact:"Its hollow crest could make trumpet-like sounds.",rarity:"Common"},
  {name:"Pachycephalosaurus",fact:"Had a skull dome 25 cm thick for head-butting.",rarity:"Common"},
  {name:"Iguanodon",fact:"Had thumb spikes it used for defense.",rarity:"Common"},
  {name:"Gallimimus",fact:"Ostrich-like dinosaur that could run 50 km/h.",rarity:"Common"},
  {name:"Compsognathus",fact:"One of the smallest dinosaurs — about the size of a chicken.",rarity:"Common"},
  {name:"Diplodocus",fact:"Its tail could crack like a whip.",rarity:"Common"},
  {name:"Oviraptor",fact:"Name means 'egg thief' but it was actually protecting its own eggs.",rarity:"Common"},
  {name:"Edmontosaurus",fact:"Duck-billed dinosaur discovered in Alberta, Canada.",rarity:"Common"},
  {name:"Maiasaura",fact:"Name means 'good mother lizard' — it cared for its babies.",rarity:"Common"},
  {name:"Apatosaurus",fact:"Weighed as much as 4 elephants.",rarity:"Common"},
  {name:"Styracosaurus",fact:"Had 6 long horns sticking out of its frill.",rarity:"Common"},
  {name:"Coelophysis",fact:"One of the earliest dinosaurs from the Triassic period.",rarity:"Common"},
  {name:"Psittacosaurus",fact:"'Parrot lizard' — had bristle-like quills on its tail.",rarity:"Common"},
  {name:"Corythosaurus",fact:"Had a helmet-shaped crest on its head.",rarity:"Common"},
  {name:"Kentrosaurus",fact:"African relative of Stegosaurus, covered in spikes.",rarity:"Common"},
  // COMMON — Marine & Other
  {name:"Ichthyosaurus",fact:"Looked like a dolphin but was actually a reptile.",rarity:"Common"},
  {name:"Ammonite",fact:"Spiral-shelled sea creature that lived for 300 million years.",rarity:"Common"},
  {name:"Trilobite",fact:"One of Earth's first complex animals with compound eyes.",rarity:"Common"},
  {name:"Dimetrodon",fact:"Had a sail on its back — and was NOT actually a dinosaur.",rarity:"Common"},
  // COMMON — Ice Age
  {name:"Woolly Mammoth",fact:"Had fur up to 1 metre long.",rarity:"Common"},
  {name:"Giant Ground Sloth",fact:"Size of an elephant and stood on hind legs to eat.",rarity:"Common"},
  {name:"Woolly Rhinoceros",fact:"Had two horns — one was over a metre long.",rarity:"Common"},
  {name:"Irish Elk",fact:"Largest deer ever — antlers spread 3.5 metres wide.",rarity:"Common"},
  {name:"Cave Bear",fact:"30% larger than a modern grizzly bear.",rarity:"Common"},
  {name:"Cave Lion",fact:"Largest cat to ever live in Europe.",rarity:"Common"},
  {name:"Glyptodon",fact:"An armadillo the size of a small car.",rarity:"Common"},
  {name:"Aurochs",fact:"Wild ancestor of modern cattle — stood 1.8 metres tall.",rarity:"Common"},
  {name:"Doedicurus",fact:"Armadillo with a spiked mace-like tail.",rarity:"Common"},
  {name:"Tanystropheus",fact:"6 metres long but most of it was neck.",rarity:"Common"},
  // RARE — Dinosaurs & Reptiles
  {name:"Sabertooth Tiger",fact:"Fangs were up to 28 cm long.",rarity:"Rare"},
  {name:"Dunkleosteus",fact:"Armored fish with the bite force of an alligator.",rarity:"Rare"},
  {name:"Pteranodon",fact:"Wingspan of 7 metres — wider than a giraffe is tall.",rarity:"Rare"},
  {name:"Spinosaurus",fact:"Largest carnivorous dinosaur — semi-aquatic with a sail on its back.",rarity:"Rare"},
  {name:"Therizinosaurus",fact:"Had 1-metre-long claws — the longest of any animal ever.",rarity:"Rare"},
  {name:"Carnotaurus",fact:"Had tiny arms even smaller than T-Rex and bull-like horns.",rarity:"Rare"},
  {name:"Allosaurus",fact:"Apex predator of the Jurassic period.",rarity:"Rare"},
  {name:"Dilophosaurus",fact:"Had twin crests — no frill or venom despite what movies show.",rarity:"Rare"},
  {name:"Archaeopteryx",fact:"Earliest known bird-like dinosaur with feathers AND teeth.",rarity:"Rare"},
  {name:"Microraptor",fact:"Had 4 wings and could glide between trees.",rarity:"Rare"},
  // RARE — Marine
  {name:"Sarcosuchus",fact:"'SuperCroc' — 12 metres long, twice the size of any living croc.",rarity:"Rare"},
  {name:"Basilosaurus",fact:"Early whale that looked like a sea serpent, up to 18m long.",rarity:"Rare"},
  {name:"Elasmosaurus",fact:"Marine reptile with a 7-metre-long neck.",rarity:"Rare"},
  {name:"Plesiosaur",fact:"Long-necked marine reptile that inspired the Loch Ness Monster legend.",rarity:"Rare"},
  {name:"Helicoprion",fact:"Shark with a circular saw-like spiral of teeth.",rarity:"Rare"},
  {name:"Deinosuchus",fact:"'Terrible crocodile' — could take down dinosaurs.",rarity:"Rare"},
  {name:"Xiphactinus",fact:"6-metre predatory fish that swallowed prey whole.",rarity:"Rare"},
  // RARE — Ice Age & Other
  {name:"Gigantopithecus",fact:"Largest ape ever — stood 3 metres tall.",rarity:"Rare"},
  {name:"Dire Wolf",fact:"25% larger than modern grey wolves.",rarity:"Rare"},
  {name:"Titanoboa",fact:"Largest snake ever at 13 metres — weighed over 1 tonne.",rarity:"Rare"},
  {name:"Terror Bird",fact:"3-metre-tall flightless predator — faster than a horse.",rarity:"Rare"},
  {name:"Entelodon",fact:"'Hell Pig' — massive omnivore with bone-crushing jaws.",rarity:"Rare"},
  {name:"Anomalocaris",fact:"Top predator of the Cambrian — looked like an alien shrimp.",rarity:"Rare"},
  {name:"Ambulocetus",fact:"'Walking whale' — ancestor of modern whales that walked on land.",rarity:"Rare"},
  {name:"Kaprosuchus",fact:"'BoarCroc' — had tusk-like teeth sticking out of its jaw.",rarity:"Rare"},
  {name:"Meganeura",fact:"Dragonfly with a 70 cm wingspan from the Carboniferous period.",rarity:"Rare"},
  // EPIC
  {name:"Megalodon",fact:"Largest shark ever. Teeth the size of a human hand.",rarity:"Epic"},
  {name:"Quetzalcoatlus",fact:"Largest flying animal ever — tall as a giraffe on the ground.",rarity:"Epic"},
  {name:"Argentavis",fact:"Largest flying bird ever with a 7-metre wingspan.",rarity:"Epic"},
  {name:"Liopleurodon",fact:"Massive marine predator with 3-metre-long jaws.",rarity:"Epic"},
  {name:"Giganotosaurus",fact:"Slightly larger than T-Rex — discovered in South America.",rarity:"Epic"},
  {name:"Kronosaurus",fact:"Named after the Titan Kronos — 10-metre marine predator.",rarity:"Epic"},
  {name:"Dreadnoughtus",fact:"One of the heaviest dinosaurs ever at 65 tonnes.",rarity:"Epic"},
  {name:"Yutyrannus",fact:"Largest feathered dinosaur — 9 metres long with a downy coat.",rarity:"Epic"},
  {name:"Arthropleura",fact:"Largest land bug ever — a 2.5-metre-long millipede.",rarity:"Epic"},
  {name:"Livyatan",fact:"Prehistoric killer whale that rivalled Megalodon.",rarity:"Epic"},
  {name:"Paraceratherium",fact:"Largest land mammal ever — stood 5 metres tall at the shoulder.",rarity:"Epic"},
  {name:"Hatzegopteryx",fact:"Island pterosaur that hunted dinosaurs on foot.",rarity:"Epic"},
  // LEGENDARY
  {name:"T-Rex Alpha",fact:"Strongest bite of any land animal: 6 tonnes of force.",rarity:"Legendary"},
  {name:"Mosasaurus",fact:"Ruled the oceans. Could swallow a great white shark whole.",rarity:"Legendary"},
  {name:"Carcharodontosaurus",fact:"'Shark-toothed lizard' with a skull even larger than T-Rex.",rarity:"Legendary"},
  {name:"Deinocheirus",fact:"'Terrible hand' — mysterious giant with 2.4-metre-long arms.",rarity:"Legendary"},
  {name:"Pliosaurus funkei",fact:"One of the most powerful marine predators ever discovered.",rarity:"Legendary"},
  {name:"Mapusaurus",fact:"Hunted the largest dinosaurs in coordinated packs.",rarity:"Legendary"},
];
const RC = {Common:"#9ca3af",Rare:"#3b82f6",Epic:"#a855f7",Legendary:"#f59e0b"};
function pickCreature(acc,owned){const r=Math.random();const ownedNames=owned||[];let p;if(acc===100)p=CREATURES.filter(c=>c.rarity==="Epic"||c.rarity==="Legendary");else if(acc>=80)p=CREATURES.filter(c=>c.rarity==="Rare"||(r>.6&&c.rarity==="Epic")||(r>.95&&c.rarity==="Legendary"));else if(acc>=60)p=CREATURES.filter(c=>c.rarity==="Common"||(r>.6&&c.rarity==="Rare"));else p=CREATURES.filter(c=>c.rarity==="Common"||(r>.85&&c.rarity==="Rare"));if(!p.length)p=CREATURES.filter(c=>c.rarity==="Common");const unowned=p.filter(c=>!ownedNames.includes(c.name));const pool=unowned.length>0?unowned:p;return pool[Math.floor(Math.random()*pool.length)];}

/* ===== CECE QUESTIONS ===== */
const CQ = {
  olympus:[
    {q:"Zeus hid a number: 7 in ten-thousands, 3 in hundreds, 0 elsewhere. What is it?",t:"input",a:"70300",h:"Place value: ten-thousands, thousands, hundreds, tens, ones.",e:"70,300.",d:"easy",tp:"Number Sense"},
    {q:"What is 4,567 × 8?",t:"input",a:"36536",h:"Break it: 4000×8 + 500×8 + 60×8 + 7×8.",e:"36,536.",d:"medium",tp:"Number Sense"},
    {q:"If n + 15 = 42, what is n?",t:"input",a:"27",h:"Subtract 15 from both sides.",e:"n = 27.",d:"easy",tp:"Algebra"},
    {q:"Next in pattern: 2, 6, 18, 54, …?",t:"input",a:"162",h:"Each number × what?",e:"×3 each time. 54×3=162.",d:"medium",tp:"Algebra"},
    {q:"Round 125,430 to nearest thousand?",t:"choice",o:["125,000","126,000","125,400","125,500"],a:"125,000",h:"Hundreds digit is 4 (<5).",e:"Round down to 125,000.",d:"easy",tp:"Number Sense"},
    {q:"What is 15% of 240?",t:"input",a:"36",h:"10%=24, 5%=12, add them.",e:"15% of 240 = 36.",d:"medium",tp:"Number Sense"},
    {q:"Solve: 3n = 45. What is n?",t:"input",a:"15",h:"Divide both sides by 3.",e:"n = 45 ÷ 3 = 15.",d:"easy",tp:"Algebra"},
    {q:"What is 8² (8 squared)?",t:"input",a:"64",h:"8 × 8.",e:"8² = 8 × 8 = 64.",d:"easy",tp:"Number Sense"},
    {q:"Which number is divisible by both 3 and 4?",t:"choice",o:["10","12","14","15"],a:"12",h:"Must divide evenly by BOTH.",e:"12 ÷ 3 = 4 ✓ and 12 ÷ 4 = 3 ✓",d:"medium",tp:"Number Sense"},
    {q:"What is the GCF of 24 and 36?",t:"input",a:"12",h:"List factors of each. Find the greatest common one.",e:"24: 1,2,3,4,6,8,12,24. 36: 1,2,3,4,6,9,12,18,36. GCF=12.",d:"hard",tp:"Number Sense"},
    {q:"Evaluate: 5 + 3 × 4",t:"input",a:"17",h:"Order of operations: multiply first.",e:"3×4=12, then 5+12=17.",d:"easy",tp:"Number Sense"},
    {q:"Pattern: 1, 4, 9, 16, … What comes next?",t:"input",a:"25",h:"These are perfect squares.",e:"1², 2², 3², 4², 5² = 25.",d:"medium",tp:"Algebra"},
    {q:"What is 25% of 80?",t:"input",a:"20",h:"25% = one quarter.",e:"80 ÷ 4 = 20.",d:"easy",tp:"Number Sense"},
    {q:"Express 3/5 as a percentage.",t:"input",a:"60",h:"Divide 3 by 5, then multiply by 100.",e:"3 ÷ 5 = 0.6 × 100 = 60%.",d:"medium",tp:"Number Sense"},
    {q:"What is 1,000,000 ÷ 250?",t:"input",a:"4000",h:"Think: 250 × 4 = 1000, so scale up.",e:"1,000,000 ÷ 250 = 4,000.",d:"hard",tp:"Number Sense"},
    {q:"If y = 2x + 3, what is y when x = 5?",t:"input",a:"13",h:"Substitute 5 for x.",e:"y = 2(5) + 3 = 10 + 3 = 13.",d:"medium",tp:"Algebra"},
    {q:"What is the LCM of 6 and 8?",t:"input",a:"24",h:"List multiples until they match.",e:"6: 6,12,18,24. 8: 8,16,24. LCM=24.",d:"medium",tp:"Number Sense"},
    {q:"A rectangle is 12cm by 8cm. What is its area?",t:"input",a:"96",h:"Area = length × width.",e:"12 × 8 = 96 cm².",d:"easy",tp:"Geometry"},
    {q:"What is the ratio of 15 to 25 in simplest form?",t:"choice",o:["3:5","1:2","5:3","15:25"],a:"3:5",h:"Divide both by their GCF (5).",e:"15÷5=3, 25÷5=5. Ratio is 3:5.",d:"medium",tp:"Number Sense"},
    {q:"If 40% of a number is 28, what is the number?",t:"input",a:"70",h:"28 ÷ 0.4 or 28 × 100 ÷ 40.",e:"28 ÷ 0.4 = 70.",d:"hard",tp:"Number Sense"},
  ],
  fracFor:[
    {q:"What is 2/5 + 1/3?",t:"choice",o:["3/8","11/15","3/15","7/15"],a:"11/15",h:"LCD is 15.",e:"6/15 + 5/15 = 11/15.",d:"easy",tp:"Fractions"},
    {q:"3/4 of a potion minus 1/6. How much left?",t:"choice",o:["2/4","7/12","1/2","5/8"],a:"7/12",h:"LCD is 12.",e:"9/12 − 2/12 = 7/12.",d:"medium",tp:"Fractions"},
    {q:"What is 4 × 2/3?",t:"choice",o:["8/3","6/3","8/12","2/12"],a:"8/3",h:"4×2=8, keep denominator.",e:"4 × 2/3 = 8/3.",d:"easy",tp:"Fractions"},
    {q:"5.67 + 3.8 = ?",t:"input",a:"9.47",h:"Line up decimals: 5.67+3.80.",e:"9.47.",d:"easy",tp:"Decimals"},
    {q:"What is 6 ÷ 3/4?",t:"choice",o:["4.5","8","2","18/4"],a:"8",h:"Keep, change, flip: 6×4/3.",e:"6 ÷ 3/4 = 8.",d:"hard",tp:"Fractions"},
    {q:"Convert 7/4 to a mixed number.",t:"choice",o:["1 1/4","1 3/4","2 1/4","3/4"],a:"1 3/4",h:"How many times does 4 go into 7?",e:"7÷4=1 remainder 3. So 1 3/4.",d:"easy",tp:"Fractions"},
    {q:"What is 0.75 as a fraction?",t:"choice",o:["3/4","7/5","3/5","7/10"],a:"3/4",h:"0.75 = 75/100. Simplify.",e:"75/100 = 3/4.",d:"easy",tp:"Decimals"},
    {q:"Which is greater: 5/8 or 3/5?",t:"choice",o:["5/8","3/5","They are equal","Cannot compare"],a:"5/8",h:"Convert to same denominator (40).",e:"5/8=25/40, 3/5=24/40. 25>24.",d:"medium",tp:"Fractions"},
    {q:"What is 2/3 × 3/5?",t:"choice",o:["6/15","2/5","5/8","6/8"],a:"2/5",h:"Multiply tops, multiply bottoms, simplify.",e:"2×3=6, 3×5=15, 6/15=2/5.",d:"easy",tp:"Fractions"},
    {q:"12.5 − 4.83 = ?",t:"input",a:"7.67",h:"Line up decimals, borrow when needed.",e:"12.50 − 4.83 = 7.67.",d:"medium",tp:"Decimals"},
    {q:"What is 5/6 + 2/3?",t:"choice",o:["7/9","3/2","1 1/6","1 1/2"],a:"1 1/2",h:"LCD is 6. 5/6 + 4/6 = ?",e:"5/6 + 4/6 = 9/6 = 1 3/6 = 1 1/2.",d:"medium",tp:"Fractions"},
    {q:"Convert 2.4 to a fraction.",t:"choice",o:["12/5","24/100","2/4","4/2"],a:"12/5",h:"2.4 = 24/10. Simplify.",e:"24/10 = 12/5.",d:"medium",tp:"Decimals"},
    {q:"A recipe needs 2/3 cup of sugar. You want to make half. How much sugar?",t:"choice",o:["1/3","1/6","2/6","4/3"],a:"1/3",h:"Half of 2/3 = 2/3 × 1/2.",e:"2/3 × 1/2 = 2/6 = 1/3 cup.",d:"medium",tp:"Fractions"},
    {q:"Order from least to greatest: 0.4, 3/8, 1/2",t:"choice",o:["3/8, 0.4, 1/2","0.4, 3/8, 1/2","1/2, 0.4, 3/8","3/8, 1/2, 0.4"],a:"3/8, 0.4, 1/2",h:"Convert all to decimals: 3/8=0.375.",e:"0.375, 0.4, 0.5.",d:"hard",tp:"Fractions"},
    {q:"What is 3 1/2 + 2 2/3?",t:"choice",o:["5 3/5","6 1/6","5 1/5","5 7/6"],a:"6 1/6",h:"Add wholes (5), then fractions with LCD 6.",e:"3/6+4/6=7/6=1 1/6. 5+1 1/6=6 1/6.",d:"hard",tp:"Fractions"},
    {q:"What is 8 × 0.25?",t:"input",a:"2",h:"0.25 = 1/4. What is 8 ÷ 4?",e:"8 × 0.25 = 2.",d:"easy",tp:"Decimals"},
    {q:"What fraction of an hour is 45 minutes?",t:"choice",o:["3/4","4/5","2/3","1/2"],a:"3/4",h:"45 out of 60 minutes.",e:"45/60 = 3/4.",d:"easy",tp:"Fractions"},
    {q:"5/8 ÷ 1/4 = ?",t:"choice",o:["5/32","5/2","2/5","20/8"],a:"5/2",h:"Keep, change, flip: 5/8 × 4/1.",e:"5/8 × 4/1 = 20/8 = 5/2.",d:"hard",tp:"Fractions"},
    {q:"Round 3.847 to the nearest tenth.",t:"input",a:"3.8",h:"Tenths place is 8. Look at hundredths (4).",e:"4 < 5, round down. 3.8.",d:"easy",tp:"Decimals"},
    {q:"What is 1/4 + 0.3?",t:"input",a:"0.55",h:"Convert 1/4 to 0.25 first.",e:"0.25 + 0.30 = 0.55.",d:"medium",tp:"Decimals"},
  ],
  asgard:[
    {q:"Which uses 'who' correctly?",t:"choice",o:["The warrior which fought won.","The warrior who fought won.","The warrior whom fought won.","The warrior whose fought won."],a:"The warrior who fought won.",h:"'Who' for subjects.",e:"'Who' = subject of clause.",d:"easy",tp:"Grammar"},
    {q:"'I've told you a million times' — which device?",t:"choice",o:["Metaphor","Idiom","Hyperbole","Simile"],a:"Hyperbole",h:"Extreme exaggeration?",e:"Hyperbole = exaggeration for emphasis.",d:"easy",tp:"Literary Devices"},
    {q:"Main purpose of a persuasive essay?",t:"choice",o:["Tell a story","Explain how-to","Convince the reader","Describe a place"],a:"Convince the reader",h:"Persuade = convince.",e:"Persuasive writing aims to convince.",d:"easy",tp:"Writing"},
    {q:"What does 'break the ice' mean?",t:"choice",o:["Break frozen water","Start awkward conversation","Fail at something","Cool down"],a:"Start awkward conversation",h:"'Ice' = social stiffness.",e:"Idiom meaning: make people comfortable.",d:"medium",tp:"Literary Devices"},
    {q:"'The wind whispered through the trees' — which device?",t:"choice",o:["Simile","Onomatopoeia","Personification","Alliteration"],a:"Personification",h:"Can wind actually whisper?",e:"Giving human qualities to non-human things.",d:"easy",tp:"Literary Devices"},
    {q:"Which is a compound sentence?",t:"choice",o:["Running fast, she won.","She ran fast and won the race.","She ran fast, and he cheered loudly.","The fast runner won."],a:"She ran fast, and he cheered loudly.",h:"Two independent clauses joined by a conjunction.",e:"Each part could stand alone as a sentence.",d:"medium",tp:"Grammar"},
    {q:"What is the subject in: 'The ancient sword gleamed'?",t:"choice",o:["ancient","sword","gleamed","The ancient sword"],a:"The ancient sword",h:"Who or what is doing the action?",e:"The complete subject is 'The ancient sword'.",d:"easy",tp:"Grammar"},
    {q:"'Brave as a lion' is an example of?",t:"choice",o:["Metaphor","Simile","Hyperbole","Alliteration"],a:"Simile",h:"Uses 'as' or 'like' to compare.",e:"Simile compares using 'like' or 'as'.",d:"easy",tp:"Literary Devices"},
    {q:"What is the purpose of a thesis statement?",t:"choice",o:["Summarize the ending","State the main argument","List all topics","Ask a question"],a:"State the main argument",h:"It's the core claim of your essay.",e:"A thesis tells the reader your main point.",d:"medium",tp:"Writing"},
    {q:"Which word is an adverb?",t:"choice",o:["beautiful","beauty","beautifully","beautify"],a:"beautifully",h:"Adverbs often end in -ly.",e:"Beautifully describes HOW something is done.",d:"easy",tp:"Grammar"},
    {q:"What does 'bite off more than you can chew' mean?",t:"choice",o:["Eat too much food","Take on too much responsibility","Hurt your teeth","Chew faster"],a:"Take on too much responsibility",h:"Think figuratively, not literally.",e:"Idiom: attempting more than you can handle.",d:"medium",tp:"Literary Devices"},
    {q:"Which sentence has correct comma usage?",t:"choice",o:["I bought, apples oranges and milk.","I bought apples, oranges, and milk.","I bought apples oranges, and, milk.","I, bought apples oranges and milk."],a:"I bought apples, oranges, and milk.",h:"Commas separate items in a list.",e:"Oxford comma: between each item and before 'and'.",d:"easy",tp:"Grammar"},
    {q:"'The classroom was a zoo' is an example of?",t:"choice",o:["Simile","Personification","Metaphor","Hyperbole"],a:"Metaphor",h:"Is it using 'like' or 'as'? No.",e:"Metaphor: directly calling one thing another.",d:"easy",tp:"Literary Devices"},
    {q:"What is the plural possessive of 'heroes'?",t:"choice",o:["hero's","heroes'","heroes's","heros'"],a:"heroes'",h:"Plural ending in s — just add apostrophe.",e:"heroes' = belonging to multiple heroes.",d:"medium",tp:"Grammar"},
    {q:"What type of text uses facts to explain a topic?",t:"choice",o:["Narrative","Persuasive","Informational","Poetry"],a:"Informational",h:"Not a story, not persuading — just explaining.",e:"Informational text explains using facts and details.",d:"easy",tp:"Writing"},
    {q:"'Peter Piper picked a peck' — which device?",t:"choice",o:["Simile","Alliteration","Metaphor","Irony"],a:"Alliteration",h:"Listen to the first letter of each word.",e:"Alliteration: repeating the same starting sound.",d:"easy",tp:"Literary Devices"},
    {q:"What is a synonym for 'ancient'?",t:"choice",o:["Modern","Old","Quick","Large"],a:"Old",h:"Ancient temples are very…",e:"Ancient = very old.",d:"easy",tp:"Vocabulary"},
    {q:"Which is an example of first-person point of view?",t:"choice",o:["She walked away.","They fought bravely.","I drew my sword.","The hero stood tall."],a:"I drew my sword.",h:"First person uses 'I' or 'we'.",e:"'I' = first person narrator.",d:"easy",tp:"Writing"},
    {q:"What does the prefix 'un-' mean?",t:"choice",o:["Again","Before","Not","Under"],a:"Not",h:"Unhappy means…",e:"Un- = not. Unhappy = not happy.",d:"easy",tp:"Vocabulary"},
    {q:"Identify the conjunction: 'She trained hard, but she lost.'",t:"choice",o:["She","hard","but","lost"],a:"but",h:"Which word joins the two clauses?",e:"'But' connects two independent clauses.",d:"easy",tp:"Grammar"},
  ],
  catacmb:[
    {q:"Comment dit-on 'hello'?",t:"choice",o:["Merci","Bonjour","Au revoir","S'il vous plaît"],a:"Bonjour",h:"Most common greeting.",e:"Bonjour = Hello.",d:"easy",tp:"Vocabulary"},
    {q:"'Je joue au volleyball avec mes amies' means?",t:"choice",o:["I play volleyball with my friends.","I watch volleyball with family.","I like volleyball.","I played yesterday."],a:"I play volleyball with my friends.",h:"Jouer=play, avec=with.",e:"Je=I, joue=play, avec=with, amies=friends.",d:"easy",tp:"Reading"},
    {q:"'Elle _____ une pomme.' (eats)",t:"choice",o:["mange","manges","mangent","manger"],a:"mange",h:"Elle → 3rd person singular.",e:"Elle mange.",d:"easy",tp:"Grammar"},
    {q:"'The weather is cold today' in French?",t:"choice",o:["Il fait chaud.","Il fait froid aujourd'hui.","Il pleut.","Il neige."],a:"Il fait froid aujourd'hui.",h:"Froid=cold.",e:"Il fait froid = It is cold.",d:"medium",tp:"Vocabulary"},
    {q:"What does 'bibliothèque' mean?",t:"choice",o:["Bookstore","Bible","Library","Desk"],a:"Library",h:"Biblio- relates to books.",e:"Bibliothèque = library.",d:"easy",tp:"Vocabulary"},
    {q:"'Nous _____ au parc.' (go)",t:"choice",o:["allons","allez","vais","vas"],a:"allons",h:"Nous = we. Aller → nous…",e:"Nous allons = we go.",d:"medium",tp:"Grammar"},
    {q:"How do you say 'I am 11 years old' in French?",t:"choice",o:["Je suis onze.","J'ai onze ans.","Je onze ans ai.","J'ans onze ai."],a:"J'ai onze ans.",h:"In French, you 'have' years, not 'are' years.",e:"J'ai = I have. Onze = 11. Ans = years.",d:"easy",tp:"Grammar"},
    {q:"What colour is 'bleu'?",t:"choice",o:["Red","Green","Blue","Yellow"],a:"Blue",h:"Sounds like 'blew'.",e:"Bleu = blue.",d:"easy",tp:"Vocabulary"},
    {q:"'Ils _____ contents.' (are)",t:"choice",o:["est","es","sommes","sont"],a:"sont",h:"Ils = they. Être → ils…",e:"Ils sont = they are.",d:"medium",tp:"Grammar"},
    {q:"What does 'je ne sais pas' mean?",t:"choice",o:["I don't like it","I don't know","I don't want to","I don't have it"],a:"I don't know",h:"Savoir = to know. Ne…pas = not.",e:"Je ne sais pas = I don't know.",d:"easy",tp:"Reading"},
    {q:"'La maison' means?",t:"choice",o:["The car","The school","The house","The store"],a:"The house",h:"Where you live.",e:"La maison = the house.",d:"easy",tp:"Vocabulary"},
    {q:"Which is correct: 'un chat' or 'une chat'?",t:"choice",o:["un chat","une chat","le chat noir only","la chat"],a:"un chat",h:"Chat is masculine in French.",e:"Chat = masculine noun → un chat.",d:"easy",tp:"Grammar"},
    {q:"How do you say 'please' in French?",t:"choice",o:["Merci","Pardon","S'il vous plaît","De rien"],a:"S'il vous plaît",h:"You say this when asking for something politely.",e:"S'il vous plaît = please (formal).",d:"easy",tp:"Vocabulary"},
    {q:"'Tu aimes le sport?' means?",t:"choice",o:["You play sports?","Do you like sports?","You are sporty?","Is sport fun?"],a:"Do you like sports?",h:"Aimer = to like/love. Tu = you.",e:"Tu aimes = do you like.",d:"easy",tp:"Reading"},
    {q:"Translate: 'My brother is tall.'",t:"choice",o:["Mon frère est petit.","Mon frère est grand.","Ma frère est grand.","Mon frère a grand."],a:"Mon frère est grand.",h:"Tall = grand. Brother = frère (masculine → mon).",e:"Mon frère est grand.",d:"medium",tp:"Grammar"},
    {q:"What is 'lundi'?",t:"choice",o:["Month","Monday","Lunch","Moon"],a:"Monday",h:"Days of the week in French.",e:"Lundi = Monday.",d:"easy",tp:"Vocabulary"},
    {q:"'Elles parlent français' means?",t:"choice",o:["She speaks French.","They speak French.","We speak French.","He speaks French."],a:"They speak French.",h:"Elles = they (feminine).",e:"Elles parlent = they (f) speak.",d:"medium",tp:"Reading"},
    {q:"How do you say 'dog' in French?",t:"choice",o:["Chat","Chien","Oiseau","Lapin"],a:"Chien",h:"Man's best friend.",e:"Chien = dog. Chat = cat.",d:"easy",tp:"Vocabulary"},
    {q:"What number is 'vingt'?",t:"choice",o:["12","15","20","25"],a:"20",h:"Dix=10, vingt=?",e:"Vingt = 20.",d:"easy",tp:"Vocabulary"},
    {q:"'Je vais à l'école' means?",t:"choice",o:["I like school.","I go to school.","I left school.","I see the school."],a:"I go to school.",h:"Aller = to go. École = school.",e:"Je vais = I go. À l'école = to school.",d:"easy",tp:"Reading"},
  ],
  atlantis:[
    {q:"Which is NOT a force of flight?",t:"choice",o:["Lift","Drag","Momentum","Thrust"],a:"Momentum",h:"Four forces: lift, drag, thrust, gravity.",e:"Momentum is not a flight force.",d:"easy",tp:"Flight"},
    {q:"Series circuit: one bulb burns out?",t:"choice",o:["Others brighter","Nothing changes","All go out","Only nearby"],a:"All go out",h:"One path for electricity.",e:"Series = single loop. Break one, all stop.",d:"easy",tp:"Electricity"},
    {q:"Which planet has famous rings?",t:"choice",o:["Jupiter","Neptune","Saturn","Uranus"],a:"Saturn",h:"Most visible ring system.",e:"Saturn's rings: ice and rock.",d:"easy",tp:"Space"},
    {q:"What principle explains how wings create lift?",t:"choice",o:["Newton's First Law","Bernoulli's Principle","Law of Conservation","Archimedes' Principle"],a:"Bernoulli's Principle",h:"Faster air = lower pressure.",e:"Air moves faster over the top of a wing, lowering pressure = lift.",d:"medium",tp:"Flight"},
    {q:"In a parallel circuit, one bulb burns out. What happens?",t:"choice",o:["All go out","Others stay lit","Circuit explodes","Voltage doubles"],a:"Others stay lit",h:"Multiple paths for electricity.",e:"Parallel circuits have separate paths — others keep working.",d:"medium",tp:"Electricity"},
    {q:"What is the closest star to Earth?",t:"choice",o:["Polaris","Alpha Centauri","The Sun","Sirius"],a:"The Sun",h:"It rises every morning.",e:"The Sun is a star — the closest one to Earth.",d:"easy",tp:"Space"},
    {q:"What is a conductor?",t:"choice",o:["Blocks electricity","Carries electricity easily","Creates electricity","Stores electricity"],a:"Carries electricity easily",h:"Copper wire is a good one.",e:"Conductors allow electrical current to flow through them easily.",d:"easy",tp:"Electricity"},
    {q:"Which body shape reduces drag in flight?",t:"choice",o:["Flat and wide","Round and bulky","Streamlined","Square"],a:"Streamlined",h:"Think of bird and airplane shapes.",e:"Streamlined shapes let air flow smoothly, reducing drag.",d:"easy",tp:"Flight"},
    {q:"Which planet is known as the Red Planet?",t:"choice",o:["Venus","Mars","Jupiter","Mercury"],a:"Mars",h:"Iron oxide on its surface.",e:"Mars appears red due to iron oxide (rust) on its surface.",d:"easy",tp:"Space"},
    {q:"An insulator does what?",t:"choice",o:["Conducts heat well","Blocks electrical flow","Creates light","Stores energy"],a:"Blocks electrical flow",h:"Rubber gloves protect electricians because…",e:"Insulators resist the flow of electricity (rubber, plastic, wood).",d:"easy",tp:"Electricity"},
    {q:"How many planets are in our solar system?",t:"input",a:"8",h:"Mercury through Neptune.",e:"8 planets. Pluto was reclassified in 2006.",d:"easy",tp:"Space"},
    {q:"What force opposes thrust in flight?",t:"choice",o:["Lift","Weight","Drag","Gravity"],a:"Drag",h:"Air resistance slowing the plane.",e:"Drag opposes forward motion (thrust).",d:"easy",tp:"Flight"},
    {q:"Static electricity is caused by?",t:"choice",o:["Moving magnets","Rubbing objects together","Boiling water","Sound waves"],a:"Rubbing objects together",h:"Rub a balloon on your hair…",e:"Friction transfers electrons between objects, creating static charge.",d:"easy",tp:"Electricity"},
    {q:"Which planet is largest?",t:"choice",o:["Saturn","Neptune","Jupiter","Earth"],a:"Jupiter",h:"It's a gas giant.",e:"Jupiter is the largest planet — over 1,300 Earths could fit inside.",d:"easy",tp:"Space"},
    {q:"Birds have hollow bones to help with?",t:"choice",o:["Swimming","Camouflage","Flight","Hearing"],a:"Flight",h:"Lighter body = easier to fly.",e:"Hollow bones reduce weight, making flight easier.",d:"easy",tp:"Flight"},
    {q:"What unit measures electrical current?",t:"choice",o:["Watts","Volts","Amps","Ohms"],a:"Amps",h:"A = amperes.",e:"Current is measured in amperes (amps).",d:"medium",tp:"Electricity"},
    {q:"Earth's moon takes about how long to orbit Earth?",t:"choice",o:["7 days","14 days","28 days","365 days"],a:"28 days",h:"About one month.",e:"The Moon orbits Earth roughly every 27-28 days.",d:"easy",tp:"Space"},
    {q:"What keeps a plane from falling due to gravity?",t:"choice",o:["Thrust","Drag","Lift","Fuel"],a:"Lift",h:"The upward force on wings.",e:"Lift pushes upward against gravity's downward pull.",d:"easy",tp:"Flight"},
    {q:"A switch in a circuit does what?",t:"choice",o:["Increases voltage","Opens/closes the circuit","Creates resistance","Stores charge"],a:"Opens/closes the circuit",h:"Like a light switch at home.",e:"A switch controls whether current can flow by opening or closing the path.",d:"easy",tp:"Electricity"},
    {q:"Which planet rotates on its side?",t:"choice",o:["Mars","Venus","Uranus","Mercury"],a:"Uranus",h:"Its axis is tilted nearly 90°.",e:"Uranus rotates on its side, likely from an ancient collision.",d:"hard",tp:"Space"},
  ],
  sphinx:[
    {q:"Three levels of Canadian government?",t:"choice",o:["Federal, Provincial, Municipal","Federal, State, Local","National, Regional, District","Parliament, Senate, Court"],a:"Federal, Provincial, Municipal",h:"Provinces, not states.",e:"Federal, Provincial, Municipal.",d:"easy",tp:"Government"},
    {q:"Main economic activity in New France?",t:"choice",o:["Gold mining","Fur trade","Farming","Fishing"],a:"Fur trade",h:"Beaver pelts.",e:"Fur trade was the foundation.",d:"easy",tp:"Heritage"},
    {q:"What does the municipal government handle?",t:"choice",o:["Military","Local roads, garbage, libraries","International trade","Hospitals"],a:"Local roads, garbage, libraries",h:"Services in your neighbourhood.",e:"Municipal: roads, water, garbage, parks, libraries.",d:"easy",tp:"Government"},
    {q:"Who are the Métis?",t:"choice",o:["French settlers only","People of mixed Indigenous and European ancestry","British soldiers","American traders"],a:"People of mixed Indigenous and European ancestry",h:"A unique cultural group in Canada.",e:"Métis have both Indigenous and European heritage.",d:"easy",tp:"Heritage"},
    {q:"What is the role of the Prime Minister?",t:"choice",o:["Head of a province","Head of the federal government","Head of the military only","Head of the courts"],a:"Head of the federal government",h:"Leads the whole country.",e:"The PM leads Canada's federal government.",d:"easy",tp:"Government"},
    {q:"The War of 1812 was between?",t:"choice",o:["Canada and France","Britain/Canada and the United States","France and Spain","Canada and Russia"],a:"Britain/Canada and the United States",h:"Canada was a British colony then.",e:"British North America (Canada) and the US fought from 1812-1814.",d:"medium",tp:"Heritage"},
    {q:"What is a treaty?",t:"choice",o:["A type of map","A formal agreement between groups","A tax on goods","A type of election"],a:"A formal agreement between groups",h:"Nations sign these to agree on terms.",e:"Treaties are formal agreements — Canada signed many with Indigenous nations.",d:"easy",tp:"Heritage"},
    {q:"Provincial government is responsible for?",t:"choice",o:["National defence","Education and healthcare","International trade","Currency"],a:"Education and healthcare",h:"Think about what affects your daily school life.",e:"Provinces manage education, healthcare, and highways.",d:"easy",tp:"Government"},
    {q:"Who lived in Canada long before European contact?",t:"choice",o:["Vikings only","Indigenous peoples","Romans","Chinese explorers"],a:"Indigenous peoples",h:"First Nations, Inuit, and Métis.",e:"Indigenous peoples have lived here for thousands of years.",d:"easy",tp:"Heritage"},
    {q:"What is a democracy?",t:"choice",o:["Rule by a king","Rule by the military","Rule by the people","Rule by the wealthy"],a:"Rule by the people",h:"Citizens vote for representatives.",e:"In a democracy, citizens choose their leaders through elections.",d:"easy",tp:"Government"},
    {q:"What was the main purpose of residential schools?",t:"choice",o:["Teach farming","Assimilate Indigenous children into European culture","Train soldiers","Teach French"],a:"Assimilate Indigenous children into European culture",h:"A dark chapter in Canadian history.",e:"Residential schools forcibly removed Indigenous children from families — now recognized as deeply harmful.",d:"medium",tp:"Heritage"},
    {q:"How often are federal elections held in Canada?",t:"choice",o:["Every 2 years","At least every 4 years","Every 6 years","Every year"],a:"At least every 4 years",h:"Can be sooner if government falls.",e:"Federal elections must happen at least every 4 years.",d:"medium",tp:"Government"},
    {q:"What is a reserve in the Canadian context?",t:"choice",o:["A national park","Land set aside for First Nations","A military base","A wildlife area"],a:"Land set aside for First Nations",h:"Under the Indian Act.",e:"Reserves are lands designated for First Nations under treaties.",d:"medium",tp:"Heritage"},
    {q:"What does a Member of Parliament (MP) do?",t:"choice",o:["Runs a province","Represents a local area in Parliament","Commands the army","Runs a city"],a:"Represents a local area in Parliament",h:"They're elected by voters in a riding.",e:"MPs represent their riding (district) in the House of Commons.",d:"easy",tp:"Government"},
    {q:"Which document protects rights and freedoms in Canada?",t:"choice",o:["The Constitution","The Tax Code","The Highway Act","The Education Act"],a:"The Constitution",h:"Includes the Charter of Rights and Freedoms.",e:"The Canadian Charter of Rights and Freedoms is part of the Constitution.",d:"medium",tp:"Government"},
    {q:"The railway across Canada was called?",t:"choice",o:["Trans-Canada Highway","Canadian Pacific Railway","Great Northern Railway","St. Lawrence Seaway"],a:"Canadian Pacific Railway",h:"Built in the 1880s to connect the country.",e:"The CPR connected Canada coast to coast by rail.",d:"easy",tp:"Heritage"},
    {q:"What rights do all Canadian citizens have?",t:"choice",o:["Right to vote at age 12","Right to free speech and vote at 18","Right to skip taxes","Right to make laws"],a:"Right to free speech and vote at 18",h:"The Charter protects fundamental freedoms.",e:"Citizens can speak freely, assemble, and vote at 18.",d:"easy",tp:"Government"},
    {q:"What does 'Confederation' refer to?",t:"choice",o:["A war","The joining of provinces to form Canada in 1867","A treaty with the US","A railway project"],a:"The joining of provinces to form Canada in 1867",h:"July 1, 1867.",e:"Confederation united Ontario, Quebec, Nova Scotia, and New Brunswick.",d:"medium",tp:"Heritage"},
    {q:"Immigration helped Canada grow by?",t:"choice",o:["Only increasing the military","Bringing diverse cultures, skills, and labour","Reducing the population","Ending all farming"],a:"Bringing diverse cultures, skills, and labour",h:"People came from around the world.",e:"Immigrants brought culture, languages, skills, and built communities.",d:"easy",tp:"Heritage"},
    {q:"Who is the head of state in Canada?",t:"choice",o:["The Prime Minister","The Governor General","The King/Queen","The Chief Justice"],a:"The King/Queen",h:"Canada is a constitutional monarchy.",e:"The King (or Queen) is head of state, represented by the Governor General.",d:"hard",tp:"Government"},
  ],
  oracle:[
    {q:"8 bars for $6.40 or 12 bars for $8.40. Which is the better deal per bar?",t:"choice",o:["8-pack","12-pack","Same price per bar","Not enough info"],a:"12-pack",h:"Divide each price by the number of bars.",e:"$6.40÷8=$0.80 per bar. $8.40÷12=$0.70 per bar. 12-pack is cheaper.",d:"easy",tp:"Unit Pricing"},
    {q:"$50 budget. Spend $12+$8+$15. Left?",t:"input",a:"15",h:"Add spending, subtract.",e:"$50−$35=$15.",d:"easy",tp:"Budgeting"},
    {q:"Which is a NEED, not a want?",t:"choice",o:["Video game console","Winter boots","Movie tickets","Glitter phone case"],a:"Winter boots",h:"Essential for health/safety.",e:"Needs: food, shelter, warm clothing. Wants: nice-to-haves.",d:"easy",tp:"Needs vs Wants"},
    {q:"You earn $8/hour and work 6 hours. What do you earn?",t:"input",a:"48",h:"Multiply hourly rate by hours.",e:"$8 × 6 = $48.",d:"easy",tp:"Earning"},
    {q:"A shirt is $40 with 25% off. What is the sale price?",t:"input",a:"30",h:"25% of 40 = 10. Subtract from original.",e:"$40 − $10 = $30.",d:"medium",tp:"Discounts"},
    {q:"You save $15/week. How many weeks to save $180?",t:"input",a:"12",h:"Divide total by weekly savings.",e:"$180 ÷ $15 = 12 weeks.",d:"easy",tp:"Saving"},
    {q:"What is simple interest on $200 at 5% for 1 year?",t:"input",a:"10",h:"Interest = Principal × Rate.",e:"$200 × 0.05 = $10.",d:"medium",tp:"Interest"},
    {q:"HST in Ontario is 13%. Estimate tax on a $20 item.",t:"choice",o:["$1.30","$2.60","$3.00","$0.13"],a:"$2.60",h:"13% of $20.",e:"$20 × 0.13 = $2.60.",d:"easy",tp:"Tax"},
    {q:"You have $100. You NEED boots ($45) and a coat ($50). Can you afford both?",t:"choice",o:["Yes, with $5 left","Yes, with $15 left","No, $5 short","No, $10 short"],a:"Yes, with $5 left",h:"Add the costs: $45+$50.",e:"$45 + $50 = $95. $100 − $95 = $5 left.",d:"easy",tp:"Budgeting"},
    {q:"Which is a variable expense (changes month to month)?",t:"choice",o:["Rent","Car insurance","Grocery bill","Mortgage payment"],a:"Grocery bill",h:"Some months you buy more food than others.",e:"Variable expenses change. Fixed expenses stay the same.",d:"easy",tp:"Budgeting"},
    {q:"A pack of 6 juice boxes costs $4.50. Price per box?",t:"input",a:"0.75",h:"Divide total by quantity.",e:"$4.50 ÷ 6 = $0.75 per box.",d:"easy",tp:"Unit Pricing"},
    {q:"You get $25 allowance. You spend $7 on snacks and $10 on a book. What's left?",t:"input",a:"8",h:"Subtract both expenses.",e:"$25 − $7 − $10 = $8.",d:"easy",tp:"Budgeting"},
    {q:"What does 'paying yourself first' mean?",t:"choice",o:["Buying what you want immediately","Saving money before spending on wants","Paying bills late","Earning money quickly"],a:"Saving money before spending on wants",h:"Put savings aside FIRST.",e:"Financial strategy: save a portion before spending on extras.",d:"medium",tp:"Saving"},
    {q:"A pair of shoes is $80. Tax is 13%. Total cost?",t:"input",a:"90.40",h:"Find 13% of 80, add to price.",e:"$80 × 0.13 = $10.40. Total: $90.40.",d:"medium",tp:"Tax"},
    {q:"You want a $60 game. You have $22 saved and earn $5/week. How many more weeks?",t:"input",a:"8",h:"How much more do you need? Then divide by weekly earnings.",e:"$60 − $22 = $38 needed. $38 ÷ $5 = 7.6 → 8 weeks.",d:"medium",tp:"Saving"},
    {q:"Which is an example of income?",t:"choice",o:["Buying groceries","Paying rent","Birthday money from grandma","Donating to charity"],a:"Birthday money from grandma",h:"Money coming IN, not going out.",e:"Income = money received. Expenses = money spent.",d:"easy",tp:"Earning"},
    {q:"Two stores sell the same toy. Store A: $24. Store B: $30 with 20% off. Better deal?",t:"choice",o:["Store A","Store B","Same price","Need more info"],a:"Store A",h:"Calculate Store B's sale price first.",e:"Store B: $30 × 0.80 = $24. Same price, but Store A has no conditions.",d:"hard",tp:"Discounts"},
    {q:"What is a budget?",t:"choice",o:["A type of bank account","A plan for spending and saving money","A government tax","A credit card bill"],a:"A plan for spending and saving money",h:"It helps you track where money goes.",e:"A budget is a plan that balances income with expenses and savings.",d:"easy",tp:"Budgeting"},
    {q:"You find a $15 shirt and a $22 shirt. You have $30. Can you buy both before tax?",t:"choice",o:["Yes with $3 left","Yes with $7 left","No, $7 short","No, $3 short"],a:"No, $7 short",h:"Add the prices: $15 + $22.",e:"$15 + $22 = $37. $37 − $30 = $7 short.",d:"easy",tp:"Budgeting"},
    {q:"Why is comparing unit prices important?",t:"choice",o:["Bigger packages are always cheaper","Smaller packages are always better","It helps find the true best deal","It's not important"],a:"It helps find the true best deal",h:"Size alone doesn't determine value.",e:"Unit price = cost per item/gram. Bigger isn't always cheaper.",d:"easy",tp:"Unit Pricing"},
  ],
  elysium:[
    {q:"Largest plate portion per Canada's Food Guide?",t:"choice",o:["Protein","Grains","Fruits & vegetables","Dairy"],a:"Fruits & vegetables",h:"Half the plate.",e:"Fruits & veg = half.",d:"easy",tp:"Nutrition"},
    {q:"Three primary art colours?",t:"choice",o:["Red, green, blue","Red, yellow, blue","Orange, green, purple","Pink, yellow, cyan"],a:"Red, yellow, blue",h:"Can't be mixed from others.",e:"Primary: red, yellow, blue.",d:"easy",tp:"Visual Arts"},
    {q:"How much physical activity should kids get daily?",t:"choice",o:["15 minutes","30 minutes","60 minutes","120 minutes"],a:"60 minutes",h:"About an hour.",e:"Canadian guidelines: 60 min of moderate-to-vigorous activity daily.",d:"easy",tp:"Health"},
    {q:"Healthy way to manage stress?",t:"choice",o:["Skip meals","Stay up very late","Exercise or deep breathing","Avoid all social contact"],a:"Exercise or deep breathing",h:"Move your body or calm your mind.",e:"Exercise releases endorphins. Deep breathing activates relaxation.",d:"easy",tp:"Mental Health"},
    {q:"What are secondary colours in art?",t:"choice",o:["Red, yellow, blue","Orange, green, purple","Black, white, grey","Pink, brown, tan"],a:"Orange, green, purple",h:"Made by mixing two primary colours.",e:"Red+yellow=orange, blue+yellow=green, red+blue=purple.",d:"easy",tp:"Visual Arts"},
    {q:"What does 'consent' mean?",t:"choice",o:["Being forced to do something","Giving permission willingly","Ignoring someone","Following rules at school"],a:"Giving permission willingly",h:"It must be freely given.",e:"Consent = freely agreeing. You can say no, and others must respect that.",d:"easy",tp:"Health"},
    {q:"Which nutrient helps build and repair muscles?",t:"choice",o:["Carbohydrates","Fats","Protein","Vitamins"],a:"Protein",h:"Found in meat, beans, eggs.",e:"Protein builds and repairs body tissues including muscles.",d:"easy",tp:"Nutrition"},
    {q:"What is 'rhythm' in music?",t:"choice",o:["How loud a song is","The pattern of beats in time","The words of a song","The instruments used"],a:"The pattern of beats in time",h:"Tap your foot to the beat.",e:"Rhythm = the pattern of long and short sounds over time.",d:"easy",tp:"Music"},
    {q:"What does empathy mean?",t:"choice",o:["Feeling sorry for yourself","Understanding how someone else feels","Being angry at someone","Ignoring other people"],a:"Understanding how someone else feels",h:"Walking in someone else's shoes.",e:"Empathy = understanding and sharing another person's feelings.",d:"easy",tp:"Mental Health"},
    {q:"Which food group provides the most energy for physical activity?",t:"choice",o:["Protein","Whole grains","Dairy","Fats"],a:"Whole grains",h:"Bread, rice, pasta — lasting fuel.",e:"Carbohydrates from whole grains are the body's main energy source.",d:"easy",tp:"Nutrition"},
    {q:"Warm colours in art include?",t:"choice",o:["Blue, green, purple","Red, orange, yellow","Black, white, grey","Pink, brown, tan"],a:"Red, orange, yellow",h:"Think of fire and sunshine.",e:"Warm colours: red, orange, yellow. Cool: blue, green, purple.",d:"easy",tp:"Visual Arts"},
    {q:"Why is sleep important for kids?",t:"choice",o:["It wastes time","Helps brain process learning and body grow","Only needed when sick","Adults need it, not kids"],a:"Helps brain process learning and body grow",h:"Your brain is busy while you sleep.",e:"Sleep helps memory, growth, mood, and immune function.",d:"easy",tp:"Health"},
    {q:"What is 'tempo' in music?",t:"choice",o:["Volume","Speed of the beat","Type of instrument","Lyrics"],a:"Speed of the beat",h:"Fast tempo vs slow tempo.",e:"Tempo = how fast or slow the music is played.",d:"easy",tp:"Music"},
    {q:"How much water should a kid drink daily?",t:"choice",o:["1-2 glasses","4-6 glasses","6-8 glasses","12+ glasses"],a:"6-8 glasses",h:"About 1.5-2 litres.",e:"Kids need roughly 6-8 glasses (about 1.5-2L) of water daily.",d:"easy",tp:"Nutrition"},
    {q:"A healthy way to deal with anger is?",t:"choice",o:["Hit something","Bottle it up inside","Take deep breaths and talk about it","Yell at someone"],a:"Take deep breaths and talk about it",h:"Calm down first, then communicate.",e:"Healthy coping: pause, breathe, then express feelings with words.",d:"easy",tp:"Mental Health"},
    {q:"What is texture in visual art?",t:"choice",o:["The colour of a piece","How a surface looks or feels","The size of artwork","The frame around it"],a:"How a surface looks or feels",h:"Smooth, rough, bumpy, soft.",e:"Texture = the surface quality — can be real (felt) or implied (drawn).",d:"easy",tp:"Visual Arts"},
    {q:"Screen time before bed can affect sleep because?",t:"choice",o:["Screens are too heavy","Blue light tricks your brain into staying awake","Screens make noise","It doesn't affect sleep"],a:"Blue light tricks your brain into staying awake",h:"Blue light mimics daylight.",e:"Blue light suppresses melatonin, making it harder to fall asleep.",d:"medium",tp:"Health"},
    {q:"What is 'harmony' in music?",t:"choice",o:["Playing very loudly","Two or more notes played together","A solo instrument","The silence between notes"],a:"Two or more notes played together",h:"A chord is harmony.",e:"Harmony = multiple notes sounding simultaneously.",d:"medium",tp:"Music"},
    {q:"Which is NOT a benefit of regular physical activity?",t:"choice",o:["Stronger bones","Better mood","Guaranteed weight loss","Improved sleep"],a:"Guaranteed weight loss",h:"Exercise helps, but 'guaranteed' is too strong.",e:"Exercise has many benefits but weight changes depend on many factors.",d:"medium",tp:"Health"},
    {q:"What is 'balance' in visual art?",t:"choice",o:["Standing on one foot","Equal visual weight on each side","Using only one colour","Making art very large"],a:"Equal visual weight on each side",h:"Symmetry is one type.",e:"Balance = distributing elements so the composition feels stable.",d:"easy",tp:"Visual Arts"},
  ],
};

/* ===== ALEXI QUESTIONS ===== */
const AQ = {
  jurassic:[
    {q:"A T-Rex has 346 bones. Triceratops has 278. Total?",t:"input",a:"624",h:"346+278. Carry when over 9!",e:"346+278=624.",d:"easy",tp:"Addition"},
    {q:"Place value of 5 in 583?",t:"choice",o:["5 ones","5 tens","5 hundreds","5 thousands"],a:"5 hundreds",h:"Leftmost digit in 3-digit number.",e:"5=hundreds, 8=tens, 3=ones.",d:"easy",tp:"Place Value"},
    {q:"Greater: 467 or 476?",t:"choice",o:["467","476","Equal","Can't tell"],a:"476",h:"Compare tens: 6 vs 7.",e:"476 has 7 tens > 6 tens.",d:"easy",tp:"Comparing"},
    {q:"Dino takes 7 steps, 3m each. How far?",t:"input",a:"21",h:"7 groups of 3.",e:"7×3=21 metres.",d:"easy",tp:"Multiplication"},
    {q:"Round 672 to nearest hundred?",t:"choice",o:["600","700","670","680"],a:"700",h:"Tens digit 7 >= 5.",e:"Round up to 700.",d:"easy",tp:"Rounding"},
    {q:"500 + 340 + 28 = ?",t:"input",a:"868",h:"Add hundreds first: 500+300=800.",e:"500+340+28=868.",d:"easy",tp:"Addition"},
    {q:"What is 800 - 365?",t:"input",a:"435",h:"You may need to borrow.",e:"800-365=435.",d:"medium",tp:"Subtraction"},
    {q:"Which number is closest to 500?",t:"choice",o:["453","489","512","547"],a:"489",h:"How far is each from 500?",e:"489 is 11 away. 512 is 12 away.",d:"easy",tp:"Comparing"},
    {q:"Write the number: six hundred and fourteen.",t:"input",a:"614",h:"6 hundreds, 1 ten, 4 ones.",e:"614.",d:"easy",tp:"Place Value"},
    {q:"Estimate 298 + 405 by rounding to the nearest hundred.",t:"input",a:"700",h:"Round each first: 300 + 400.",e:"300+400=700.",d:"easy",tp:"Estimation"},
    {q:"243 + 189 = ?",t:"input",a:"432",h:"Add ones, then tens, then hundreds. Carry!",e:"243+189=432.",d:"easy",tp:"Addition"},
    {q:"What is 5 × 4?",t:"input",a:"20",h:"5 groups of 4.",e:"5×4=20.",d:"easy",tp:"Multiplication"},
    {q:"702 - 458 = ?",t:"input",a:"244",h:"Borrow from hundreds to subtract.",e:"702-458=244.",d:"medium",tp:"Subtraction"},
    {q:"How many tens are in 350?",t:"input",a:"35",h:"350 ÷ 10.",e:"350 has 35 tens.",d:"easy",tp:"Place Value"},
    {q:"Round 445 to the nearest ten.",t:"choice",o:["440","450","400","445"],a:"450",h:"Ones digit is 5, round up.",e:"5 or more: round up. 445 -> 450.",d:"easy",tp:"Rounding"},
    {q:"Is 156 + 244 greater or less than 400?",t:"choice",o:["Greater","Less","Equal","Can't tell"],a:"Equal",h:"Add them up.",e:"156+244=400. Equal!",d:"easy",tp:"Estimation"},
    {q:"What is 3 × 7?",t:"input",a:"21",h:"Skip count by 3s seven times.",e:"3×7=21.",d:"easy",tp:"Multiplication"},
    {q:"Which shows 462 in expanded form?",t:"choice",o:["400+60+2","4+6+2","46+2","462+0"],a:"400+60+2",h:"Break into hundreds, tens, ones.",e:"462 = 400 + 60 + 2.",d:"easy",tp:"Place Value"},
    {q:"999 + 1 = ?",t:"input",a:"1000",h:"What comes after 999?",e:"999+1=1000.",d:"easy",tp:"Addition"},
    {q:"A dinosaur weighs 536 kg. Another weighs 278 kg. Difference?",t:"input",a:"258",h:"Subtract the smaller from the larger.",e:"536-278=258 kg.",d:"medium",tp:"Subtraction"},
  ],
  megalodon:[
    {q:"Megalodon eats 6 fish/day. How many in a week?",t:"input",a:"42",h:"Week = 7 days.",e:"6x7=42.",d:"easy",tp:"Multiplication"},
    {q:"63 / 9 = ?",t:"input",a:"7",h:"How many 9s in 63?",e:"63/9=7.",d:"easy",tp:"Division"},
    {q:"Next: 5, 10, 15, 20, ...?",t:"input",a:"25",h:"Adding what each time?",e:"+5 each time. 25.",d:"easy",tp:"Patterns"},
    {q:"4 x 6 = ?",t:"input",a:"24",h:"4 groups of 6.",e:"24.",d:"easy",tp:"Multiplication"},
    {q:"Pattern: 2, 4, 8, 16, ... rule?",t:"choice",o:["Add 2","Add 4","Double","Multiply by 3"],a:"Double",h:"Each number vs previous?",e:"x2 each time.",d:"hard",tp:"Patterns"},
    {q:"48 / 8 = ?",t:"input",a:"6",h:"How many groups of 8 in 48?",e:"48/8=6.",d:"easy",tp:"Division"},
    {q:"7 x 7 = ?",t:"input",a:"49",h:"Seven groups of seven.",e:"7x7=49.",d:"easy",tp:"Multiplication"},
    {q:"Next: 3, 6, 9, 12, ...?",t:"input",a:"15",h:"Skip counting by 3s.",e:"+3 each time. 15.",d:"easy",tp:"Patterns"},
    {q:"An ocean trench is 48m deep. A fish swims 29m down. How far to bottom?",t:"input",a:"19",h:"Subtract: 48-29.",e:"48-29=19 metres.",d:"easy",tp:"Subtraction"},
    {q:"5 x 3 = ?",t:"input",a:"15",h:"5 groups of 3.",e:"5x3=15.",d:"easy",tp:"Multiplication"},
    {q:"35 / 7 = ?",t:"input",a:"5",h:"7 times what equals 35?",e:"35/7=5.",d:"easy",tp:"Division"},
    {q:"3 x 9 = ?",t:"input",a:"27",h:"3 groups of 9.",e:"3x9=27.",d:"easy",tp:"Multiplication"},
    {q:"Pattern: 100, 90, 80, 70, ... next?",t:"input",a:"60",h:"Going down by what?",e:"-10 each time. 60.",d:"easy",tp:"Patterns"},
    {q:"How many groups of 6 in 42?",t:"input",a:"7",h:"42 / 6.",e:"42/6=7.",d:"easy",tp:"Division"},
    {q:"4 x 8 = ?",t:"input",a:"32",h:"4 groups of 8, or double 4x4.",e:"4x8=32.",d:"easy",tp:"Multiplication"},
    {q:"There are 24 fish split equally into 4 groups. How many per group?",t:"input",a:"6",h:"24 / 4.",e:"24/4=6 fish per group.",d:"easy",tp:"Division"},
    {q:"6 x 7 = ?",t:"input",a:"42",h:"6 groups of 7.",e:"6x7=42.",d:"easy",tp:"Multiplication"},
    {q:"Pattern: 1, 2, 4, 7, 11, ... next?",t:"input",a:"16",h:"Look at the differences: +1, +2, +3, +4, ...",e:"+1,+2,+3,+4,+5. 11+5=16.",d:"hard",tp:"Patterns"},
    {q:"56 / 8 = ?",t:"input",a:"7",h:"What times 8 equals 56?",e:"56/8=7.",d:"easy",tp:"Division"},
    {q:"A megalodon tooth is 7 cm long. A row has 5 teeth. Total length?",t:"input",a:"35",h:"5 x 7.",e:"5x7=35 cm.",d:"easy",tp:"Multiplication"},
  ],
  iceAge:[
    {q:"Which is a proper noun?",t:"choice",o:["mountain","Canada","river","animal"],a:"Canada",h:"Specific place, capital letter.",e:"Canada = proper noun.",d:"easy",tp:"Grammar"},
    {q:"What ends a question?",t:"choice",o:["Period .","Exclamation !","Question mark ?","Comma ,"],a:"Question mark ?",h:"Asking something...",e:"Questions end with ?",d:"easy",tp:"Punctuation"},
    {q:"Correct sentence?",t:"choice",o:["the mammoth walked slow.","The mammoth walked slowly.","the mammoth Walked slowly.","The mammoth walked Slowly."],a:"The mammoth walked slowly.",h:"Capital at start only, period at end.",e:"Slowly = adverb. Capital only at start.",d:"easy",tp:"Grammar"},
    {q:"Which word has a prefix?",t:"choice",o:["undone","sunny","jumping","faster"],a:"undone",h:"Prefix goes at the START.",e:"Un- prefix = not. Undone = not done.",d:"medium",tp:"Vocabulary"},
    {q:"What is the main idea of a story?",t:"choice",o:["The smallest detail","What the story is mostly about","The last event","The author name"],a:"What the story is mostly about",h:"The big picture.",e:"Main idea = the most important point of the whole text.",d:"easy",tp:"Reading"},
    {q:"Which is a complete sentence?",t:"choice",o:["Running through the snow.","The mammoth ran.","Very cold and icy.","Because it was winter."],a:"The mammoth ran.",h:"Needs a subject AND a verb.",e:"Subject (mammoth) + verb (ran) = complete sentence.",d:"easy",tp:"Grammar"},
    {q:"What is a synonym for 'cold'?",t:"choice",o:["Hot","Freezing","Wet","Fast"],a:"Freezing",h:"A word that means the same thing.",e:"Freezing = very cold. Synonyms have similar meanings.",d:"easy",tp:"Vocabulary"},
    {q:"Where does a period go?",t:"choice",o:["Start of a sentence","End of a question","End of a statement","After every word"],a:"End of a statement",h:"Telling sentences end with this.",e:"Periods end statements (telling sentences).",d:"easy",tp:"Punctuation"},
    {q:"What is a verb?",t:"choice",o:["A person or place","An action word","A describing word","A naming word"],a:"An action word",h:"Run, jump, eat, think.",e:"Verbs = action words or state of being (is, am, are).",d:"easy",tp:"Grammar"},
    {q:"Which is an antonym for 'big'?",t:"choice",o:["Large","Huge","Small","Wide"],a:"Small",h:"Antonym = opposite meaning.",e:"Big and small are opposites.",d:"easy",tp:"Vocabulary"},
    {q:"What does a question mark tell us?",t:"choice",o:["Someone is yelling","Someone is asking","The sentence is over","Someone is whispering"],a:"Someone is asking",h:"Questions need answers.",e:"Question marks show that a question is being asked.",d:"easy",tp:"Punctuation"},
    {q:"Which word is a noun?",t:"choice",o:["quickly","beautiful","mammoth","running"],a:"mammoth",h:"Person, place, thing, or animal.",e:"Mammoth is a thing (animal) = noun.",d:"easy",tp:"Grammar"},
    {q:"What is a suffix?",t:"choice",o:["Added to the start of a word","Added to the end of a word","A type of sentence","A punctuation mark"],a:"Added to the end of a word",h:"Like -ing, -ed, -ly.",e:"Suffixes are added to the end: run+ing, slow+ly.",d:"easy",tp:"Vocabulary"},
    {q:"'The ice sparkled like diamonds.' What is 'like diamonds'?",t:"choice",o:["Simile","Metaphor","Verb","Noun"],a:"Simile",h:"Uses 'like' or 'as' to compare.",e:"Simile = comparison using like or as.",d:"medium",tp:"Reading"},
    {q:"Put in order: beginning, middle, or end? 'The hero solves the problem.'",t:"choice",o:["Beginning","Middle","End","Not part of a story"],a:"End",h:"Problems get solved at what part?",e:"Stories: beginning (setup), middle (problem), end (solution).",d:"easy",tp:"Reading"},
    {q:"Which sentence uses an exclamation mark correctly?",t:"choice",o:["What is your name!","I love ice cream!","The cat sat. down!","Where are! you"],a:"I love ice cream!",h:"Exclamation = strong feeling or excitement.",e:"Exclamation marks show excitement, surprise, or strong emotion.",d:"easy",tp:"Punctuation"},
    {q:"What does 'predict' mean when reading?",t:"choice",o:["Read the ending first","Guess what might happen next","Skip ahead","Read backwards"],a:"Guess what might happen next",h:"Use clues to figure out what comes next.",e:"Predicting = using clues from the text to guess what happens next.",d:"easy",tp:"Reading"},
    {q:"What is an adjective?",t:"choice",o:["Action word","Describing word","Naming word","Connecting word"],a:"Describing word",h:"Big, blue, fluffy, cold.",e:"Adjectives describe nouns: the BIG, FLUFFY mammoth.",d:"easy",tp:"Grammar"},
    {q:"Which word is spelled correctly?",t:"choice",o:["becuz","becaus","because","becuse"],a:"because",h:"Sound it out: be-cause.",e:"Because is the correct spelling.",d:"easy",tp:"Spelling"},
    {q:"A story told by a character using 'I' is written in?",t:"choice",o:["Third person","First person","Second person","No person"],a:"First person",h:"The narrator says 'I did this.'",e:"First person = I, me, my. The narrator is a character.",d:"medium",tp:"Reading"},
  ],
  volcanic:[
    {q:"Which force pulls things down?",t:"choice",o:["Friction","Gravity","Magnetism","Push"],a:"Gravity",h:"What makes things fall?",e:"Gravity pulls toward Earth's centre.",d:"easy",tp:"Forces"},
    {q:"Which is NOT a plant part?",t:"choice",o:["Root","Stem","Leaf","Bone"],a:"Bone",h:"Plants don't have skeletons.",e:"Plants: roots, stems, leaves, flowers.",d:"easy",tp:"Plants"},
    {q:"What makes structures strong?",t:"choice",o:["Making them thin","Using triangles","Making them tall","One material only"],a:"Using triangles",h:"Think about bridges.",e:"Triangles distribute force evenly.",d:"easy",tp:"Structures"},
    {q:"What is friction?",t:"choice",o:["Pushes up","Slows things down","Type of gravity","Magnetic"],a:"Slows things down",h:"Rub hands together - what happens?",e:"Friction: force between surfaces that slows movement.",d:"easy",tp:"Forces"},
    {q:"What type of soil holds the most water?",t:"choice",o:["Sandy soil","Clay soil","Gravel","Rocky soil"],a:"Clay soil",h:"Tiny particles packed tight.",e:"Clay = tiny particles, holds water. Sand drains fast.",d:"medium",tp:"Soils"},
    {q:"What do roots do for a plant?",t:"choice",o:["Make food from sunlight","Absorb water and nutrients","Attract bees","Create seeds"],a:"Absorb water and nutrients",h:"Underground, in the soil.",e:"Roots absorb water and nutrients and anchor the plant.",d:"easy",tp:"Plants"},
    {q:"Which material would make the strongest bridge?",t:"choice",o:["Paper","Steel","Fabric","Clay"],a:"Steel",h:"What are real bridges made of?",e:"Steel is strong and can support heavy weight.",d:"easy",tp:"Structures"},
    {q:"A magnet attracts which material?",t:"choice",o:["Wood","Plastic","Iron","Glass"],a:"Iron",h:"Metals that contain iron are magnetic.",e:"Magnets attract iron, steel, nickel, cobalt.",d:"easy",tp:"Forces"},
    {q:"What do plants need to grow?",t:"choice",o:["Water, sunlight, soil","Water, TV, soil","Sunlight, rocks, metal","Air, ice, sand only"],a:"Water, sunlight, soil",h:"Think about what you give garden plants.",e:"Plants need water, sunlight, soil (nutrients), and air.",d:"easy",tp:"Plants"},
    {q:"Which shape is strongest for building?",t:"choice",o:["Circle","Square","Triangle","Oval"],a:"Triangle",h:"Look at bridges and roofs.",e:"Triangles are rigid and don't collapse under force.",d:"easy",tp:"Structures"},
    {q:"Soil is made of?",t:"choice",o:["Only rocks","Tiny rocks, dead plants, water, air","Just sand","Pure dirt"],a:"Tiny rocks, dead plants, water, air",h:"Soil has many ingredients.",e:"Soil = minerals, organic matter, water, air, and living things.",d:"easy",tp:"Soils"},
    {q:"What is a push?",t:"choice",o:["A pull toward you","A force away from you","A type of magnet","A sound"],a:"A force away from you",h:"You PUSH a door open, away from you.",e:"Push = force that moves something away.",d:"easy",tp:"Forces"},
    {q:"Which part of a plant makes seeds?",t:"choice",o:["Root","Stem","Leaf","Flower"],a:"Flower",h:"Bees visit these for pollination.",e:"Flowers produce seeds through pollination.",d:"easy",tp:"Plants"},
    {q:"Sand, silt, and clay are types of?",t:"choice",o:["Rocks","Soil particles","Plants","Minerals"],a:"Soil particles",h:"They differ in size.",e:"Sand (big), silt (medium), clay (tiny) = soil particle sizes.",d:"easy",tp:"Soils"},
    {q:"What simple machine is a ramp?",t:"choice",o:["Lever","Pulley","Inclined plane","Wheel and axle"],a:"Inclined plane",h:"A flat surface at an angle.",e:"A ramp is an inclined plane - makes lifting easier.",d:"medium",tp:"Forces"},
    {q:"Earthworms help soil by?",t:"choice",o:["Eating all the plants","Making tunnels that add air","Removing all water","Adding rocks"],a:"Making tunnels that add air",h:"They dig through soil.",e:"Worm tunnels aerate soil and their waste adds nutrients.",d:"easy",tp:"Soils"},
    {q:"The stem of a plant does what?",t:"choice",o:["Absorbs sunlight","Carries water from roots to leaves","Makes seeds","Attracts insects"],a:"Carries water from roots to leaves",h:"Like a highway for water.",e:"Stems transport water and nutrients between roots and leaves.",d:"easy",tp:"Plants"},
    {q:"A seesaw is an example of which simple machine?",t:"choice",o:["Pulley","Lever","Wedge","Screw"],a:"Lever",h:"It pivots on a point in the middle.",e:"A lever has a fulcrum (pivot point). Seesaws are levers.",d:"medium",tp:"Forces"},
    {q:"Which would have the most friction?",t:"choice",o:["Ice on ice","Rubber on concrete","Glass on glass","Oil on metal"],a:"Rubber on concrete",h:"Which surfaces grip the most?",e:"Rough surfaces create more friction than smooth ones.",d:"easy",tp:"Forces"},
    {q:"Humus in soil comes from?",t:"choice",o:["Outer space","Decomposed plants and animals","Volcanic rock only","Ocean water"],a:"Decomposed plants and animals",h:"Dead leaves break down into...",e:"Humus = decomposed organic matter. Makes soil rich and dark.",d:"medium",tp:"Soils"},
  ],
  fossil:[
    {q:"1800s Ontario: how did people travel far?",t:"choice",o:["Airplanes","Cars","Horses and boats","Trains"],a:"Horses and boats",h:"No cars or planes yet!",e:"Before engines: horses, boats, walking.",d:"easy",tp:"Communities"},
    {q:"Urban vs rural?",t:"choice",o:["Urban=farm","Urban=city, Rural=country","Same thing","Urban=water"],a:"Urban=city, Rural=country",h:"Toronto = urban.",e:"Urban=city, Rural=countryside.",d:"easy",tp:"Communities"},
    {q:"Why are maps useful?",t:"choice",o:["They show yesterday's weather","They help us find places","They tell us what people look like","They show the future"],a:"They help us find places",h:"When lost, you'd look at a...",e:"Maps show locations, distances, and directions.",d:"easy",tp:"Maps"},
    {q:"What is a compass rose on a map?",t:"choice",o:["A type of flower","Shows North, South, East, West","Measures distance","A map border"],a:"Shows North, South, East, West",h:"N, S, E, W.",e:"Compass rose shows cardinal directions on a map.",d:"easy",tp:"Maps"},
    {q:"In early communities, most people's jobs were in?",t:"choice",o:["Technology","Farming and trades","Space travel","Office work"],a:"Farming and trades",h:"Think 1800s, no computers.",e:"Most people farmed or worked trades (blacksmith, carpenter).",d:"easy",tp:"Communities"},
    {q:"A legend on a map shows?",t:"choice",o:["A fairy tale","What the symbols mean","The year it was made","Who drew it"],a:"What the symbols mean",h:"Little pictures need explanations.",e:"The legend (key) explains map symbols and colours.",d:"easy",tp:"Maps"},
    {q:"How is a community today different from 200 years ago?",t:"choice",o:["People lived in caves","There was no food","We now have electricity and cars","Nothing has changed"],a:"We now have electricity and cars",h:"Think about daily life then vs now.",e:"Technology, transportation, and communication have changed drastically.",d:"easy",tp:"Communities"},
    {q:"What are natural resources?",t:"choice",o:["Things made in factories","Things from nature that people use","Video games","Buildings"],a:"Things from nature that people use",h:"Water, trees, minerals...",e:"Natural resources: water, wood, soil, minerals, fish.",d:"easy",tp:"Communities"},
    {q:"Which direction does the sun rise?",t:"choice",o:["North","South","East","West"],a:"East",h:"Sunrise in the morning...",e:"The sun rises in the East and sets in the West.",d:"easy",tp:"Maps"},
    {q:"A suburb is?",t:"choice",o:["Inside a big city","Area between city and countryside","A type of farm","An island"],a:"Area between city and countryside",h:"Not fully city, not fully rural.",e:"Suburbs: residential areas on the edges of cities.",d:"easy",tp:"Communities"},
    {q:"What do municipal services include?",t:"choice",o:["Army and navy","Garbage collection and fire stations","International trade","Space program"],a:"Garbage collection and fire stations",h:"Services in your town or city.",e:"Municipal: garbage, fire, police, parks, libraries, roads.",d:"easy",tp:"Communities"},
    {q:"On a map, a scale shows?",t:"choice",o:["The weight of the map","How far places really are","What colour to use","Who made the map"],a:"How far places really are",h:"1 cm on the map might = 1 km in real life.",e:"Scale converts map distance to real-world distance.",d:"medium",tp:"Maps"},
    {q:"Indigenous peoples were the first to live in?",t:"choice",o:["Europe","Canada","Antarctica","Australia only"],a:"Canada",h:"They were here thousands of years before Europeans.",e:"Indigenous peoples (First Nations, Inuit, Metis) were the original inhabitants.",d:"easy",tp:"Communities"},
    {q:"What is a physical map?",t:"choice",o:["Shows population","Shows mountains, rivers, lakes","Shows city streets","Shows countries only"],a:"Shows mountains, rivers, lakes",h:"Physical = land features.",e:"Physical maps show natural features: mountains, rivers, lakes, plains.",d:"easy",tp:"Maps"},
    {q:"Why did early communities settle near water?",t:"choice",o:["For internet access","Drinking water, farming, and transportation","Better phone service","Closer to airports"],a:"Drinking water, farming, and transportation",h:"Water was essential for survival.",e:"Rivers provided drinking water, crop irrigation, and travel routes.",d:"easy",tp:"Communities"},
    {q:"A political map shows?",t:"choice",o:["Weather patterns","Country and province borders","Mountains only","Ocean currents"],a:"Country and province borders",h:"Political = human-made boundaries.",e:"Political maps show borders, capitals, and cities.",d:"easy",tp:"Maps"},
    {q:"What changed communities the most in the 1800s?",t:"choice",o:["The internet","The railway","Cell phones","Airplanes"],a:"The railway",h:"A new way to travel long distances.",e:"Railways connected communities and allowed goods and people to travel far.",d:"easy",tp:"Communities"},
    {q:"Ontario is a?",t:"choice",o:["Country","Province","City","Continent"],a:"Province",h:"Part of Canada, but not a country.",e:"Ontario is one of Canada's 10 provinces.",d:"easy",tp:"Maps"},
    {q:"What did fur traders trade with Indigenous peoples?",t:"choice",o:["Cars","Metal tools, cloth, and beads","Computers","Electricity"],a:"Metal tools, cloth, and beads",h:"European goods for beaver pelts.",e:"Europeans traded manufactured goods for valuable furs.",d:"easy",tp:"Communities"},
    {q:"Which Great Lake borders southern Ontario?",t:"choice",o:["Lake Winnipeg","Lake Superior","Lake Ontario","Lake Athabasca"],a:"Lake Ontario",h:"It shares Ontario's name.",e:"Lake Ontario borders southern Ontario and New York State.",d:"easy",tp:"Maps"},
  ],
  crystal:[
    {q:"$5 bill, buy snack $3.25. Change?",t:"input",a:"1.75",h:"$5.00 - $3.25.",e:"$1.75.",d:"easy",tp:"Making Change"},
    {q:"Which coins = $0.75?",t:"choice",o:["3 quarters","7 dimes + nickel","2 quarters + 3 dimes","Quarter + 4 dimes"],a:"3 quarters",h:"Quarter = $0.25 x 3.",e:"3 x $0.25 = $0.75.",d:"easy",tp:"Coins"},
    {q:"Winter coat: need or want?",t:"choice",o:["Want","Need","Both","Neither"],a:"Need",h:"Canadian winter = -20C.",e:"In cold climates, it's a need.",d:"easy",tp:"Needs vs Wants"},
    {q:"You save $3 a week. How many weeks to save $21?",t:"input",a:"7",h:"$21 / $3.",e:"$21 / $3 = 7 weeks.",d:"easy",tp:"Saving"},
    {q:"You have 2 loonies and 3 quarters. How much?",t:"input",a:"2.75",h:"Loonie=$1, Quarter=$0.25.",e:"$2.00 + $0.75 = $2.75.",d:"easy",tp:"Coins"},
    {q:"Video game: need or want?",t:"choice",o:["Need","Want","Both","Neither"],a:"Want",h:"Can you survive without it?",e:"Video games are fun but not essential. That's a want.",d:"easy",tp:"Needs vs Wants"},
    {q:"A toy costs $4.50. You pay with a $5. Change?",t:"input",a:"0.50",h:"$5.00 - $4.50.",e:"$5.00 - $4.50 = $0.50.",d:"easy",tp:"Making Change"},
    {q:"You earn $2 for chores Monday-Friday. Total?",t:"input",a:"10",h:"5 days x $2.",e:"$2 x 5 = $10.",d:"easy",tp:"Earning"},
    {q:"How many nickels in a dollar?",t:"input",a:"20",h:"Nickel = $0.05. $1.00 / $0.05.",e:"$1.00 / $0.05 = 20 nickels.",d:"easy",tp:"Coins"},
    {q:"Groceries are $12. You have $10. What do you need?",t:"input",a:"2",h:"How much more?",e:"$12 - $10 = $2 more needed.",d:"easy",tp:"Making Change"},
    {q:"Healthy food: need or want?",t:"choice",o:["Want","Need","Both","Neither"],a:"Need",h:"Your body requires fuel.",e:"Food is a basic need for survival.",d:"easy",tp:"Needs vs Wants"},
    {q:"A book costs $8.75. Tax is $1.14. Total?",t:"input",a:"9.89",h:"Add price + tax.",e:"$8.75 + $1.14 = $9.89.",d:"medium",tp:"Making Change"},
    {q:"3 toonies + 2 dimes = ?",t:"input",a:"6.20",h:"Toonie=$2, Dime=$0.10.",e:"$6.00 + $0.20 = $6.20.",d:"easy",tp:"Coins"},
    {q:"You have $20. Buy a $7 book and $5 snack. Left?",t:"input",a:"8",h:"$20 - $7 - $5.",e:"$20 - $12 = $8.",d:"easy",tp:"Making Change"},
    {q:"Which coin has a beaver on it?",t:"choice",o:["Quarter","Dime","Nickel","Loonie"],a:"Nickel",h:"5-cent coin in Canada.",e:"The Canadian nickel features a beaver.",d:"easy",tp:"Coins"},
    {q:"A new bike: need or want?",t:"choice",o:["Need","Want","Both","Neither"],a:"Want",h:"You can walk or take the bus.",e:"A bike is nice to have but not essential for survival.",d:"easy",tp:"Needs vs Wants"},
    {q:"You want to buy a $15 toy. You have $9. You earn $2/week. How many weeks?",t:"input",a:"3",h:"Need $6 more. $6 / $2.",e:"$15 - $9 = $6 needed. $6 / $2 = 3 weeks.",d:"medium",tp:"Saving"},
    {q:"What is the largest Canadian coin in regular use?",t:"choice",o:["Quarter","Loonie","Toonie","Half dollar"],a:"Toonie",h:"Worth $2.",e:"The toonie ($2) is the largest denomination coin in regular circulation.",d:"easy",tp:"Coins"},
    {q:"You have $1.50 in quarters. How many quarters?",t:"input",a:"6",h:"$1.50 / $0.25.",e:"$1.50 / $0.25 = 6 quarters.",d:"easy",tp:"Coins"},
    {q:"Saving money is important because?",t:"choice",o:["Money expires","You can buy things you need later","Banks will close","Money gets heavier"],a:"You can buy things you need later",h:"Planning for the future.",e:"Saving lets you afford bigger things later and prepare for emergencies.",d:"easy",tp:"Saving"},
  ],
  timeLab:[
    {q:"'Dog' in French?",t:"choice",o:["chat","chien","oiseau","poisson"],a:"chien",h:"Chat=cat. This one's man's best friend.",e:"Chien=dog. Chat=cat.",d:"easy",tp:"Animals"},
    {q:"What is 'merci'?",t:"choice",o:["Hello","Please","Thank you","Goodbye"],a:"Thank you",h:"Said after someone helps.",e:"Merci = Thank you.",d:"easy",tp:"Basics"},
    {q:"'Blue' in French?",t:"choice",o:["rouge","vert","bleu","jaune"],a:"bleu",h:"Sounds like 'blew'!",e:"Bleu=blue. Rouge=red. Vert=green.",d:"easy",tp:"Colours"},
    {q:"'Je m'appelle Alexi' means?",t:"choice",o:["I like Alexi","My name is Alexi","I am from Alexi","Alexi is here"],a:"My name is Alexi",h:"M'appelle = I call myself.",e:"Je m'appelle = My name is.",d:"easy",tp:"Introductions"},
    {q:"How do you say 'cat' in French?",t:"choice",o:["chien","chat","lapin","souris"],a:"chat",h:"Not chien (that's dog).",e:"Chat=cat. Chien=dog. Lapin=rabbit. Souris=mouse.",d:"easy",tp:"Animals"},
    {q:"What colour is 'rouge'?",t:"choice",o:["Blue","Green","Red","Yellow"],a:"Red",h:"Think of 'Rouge' in Moulin Rouge.",e:"Rouge=red.",d:"easy",tp:"Colours"},
    {q:"'Bonjour' means?",t:"choice",o:["Goodbye","Thank you","Hello","Please"],a:"Hello",h:"You say it when you arrive.",e:"Bonjour = Hello/Good day.",d:"easy",tp:"Basics"},
    {q:"How do you say 'fish' in French?",t:"choice",o:["poulet","poisson","cochon","canard"],a:"poisson",h:"Sounds like 'pwah-son'.",e:"Poisson=fish.",d:"easy",tp:"Animals"},
    {q:"What number is 'dix'?",t:"choice",o:["2","5","10","20"],a:"10",h:"Sounds like 'deece'.",e:"Dix=10.",d:"easy",tp:"Numbers"},
    {q:"'Au revoir' means?",t:"choice",o:["Hello","Thank you","See you later","Please"],a:"See you later",h:"You say it when leaving.",e:"Au revoir = Goodbye/See you later.",d:"easy",tp:"Basics"},
    {q:"What colour is 'vert'?",t:"choice",o:["Red","Green","Blue","Orange"],a:"Green",h:"Think of nature - very green.",e:"Vert=green.",d:"easy",tp:"Colours"},
    {q:"How do you say 'bird' in French?",t:"choice",o:["oiseau","lapin","chat","cheval"],a:"oiseau",h:"Sounds like 'wah-zo'.",e:"Oiseau=bird.",d:"easy",tp:"Animals"},
    {q:"What number is 'cinq'?",t:"choice",o:["3","4","5","6"],a:"5",h:"Sounds like 'sank'.",e:"Cinq=5.",d:"easy",tp:"Numbers"},
    {q:"'S'il vous plait' means?",t:"choice",o:["Thank you","Sorry","Please","Hello"],a:"Please",h:"You say it when asking politely.",e:"S'il vous plait = Please (formal).",d:"easy",tp:"Basics"},
    {q:"What colour is 'jaune'?",t:"choice",o:["Green","Yellow","Purple","Black"],a:"Yellow",h:"The colour of the sun.",e:"Jaune=yellow.",d:"easy",tp:"Colours"},
    {q:"How do you say 'rabbit' in French?",t:"choice",o:["chien","lapin","chat","ours"],a:"lapin",h:"Cute, fluffy, hops around.",e:"Lapin=rabbit.",d:"easy",tp:"Animals"},
    {q:"What number is 'trois'?",t:"choice",o:["1","2","3","4"],a:"3",h:"Sounds like 'twah'.",e:"Trois=3.",d:"easy",tp:"Numbers"},
    {q:"'Comment ca va?' means?",t:"choice",o:["What is your name?","How are you?","How old are you?","Where are you?"],a:"How are you?",h:"A common greeting after bonjour.",e:"Comment ca va? = How are you? Reply: Ca va bien! (I'm fine!)",d:"easy",tp:"Basics"},
    {q:"What colour is 'noir'?",t:"choice",o:["White","Brown","Black","Grey"],a:"Black",h:"Think of 'film noir' - dark movies.",e:"Noir=black. Blanc=white.",d:"easy",tp:"Colours"},
    {q:"'J'aime le soccer' means?",t:"choice",o:["I play soccer","I watch soccer","I like soccer","Soccer is hard"],a:"I like soccer",h:"Aimer = to like/love.",e:"J'aime = I like. Le soccer = soccer.",d:"easy",tp:"Basics"},
  ],
  camp:[
    {q:"Best energy food group for sports?",t:"choice",o:["Candy","Whole grains","Soda","Chips"],a:"Whole grains",h:"Bread, rice, pasta = steady fuel.",e:"Whole grains give lasting energy.",d:"easy",tp:"Nutrition"},
    {q:"Three primary colours?",t:"choice",o:["Red, green, blue","Red, yellow, blue","Orange, green, purple","Pink, yellow, cyan"],a:"Red, yellow, blue",h:"Can't be made by mixing.",e:"Red, yellow, blue: mix for secondary.",d:"easy",tp:"Art"},
    {q:"How does exercise help your brain?",t:"choice",o:["It doesn't","Improves focus and mood","Makes you tired","Only helps muscles"],a:"Improves focus and mood",h:"Feel good after playing soccer?",e:"Exercise sends blood to brain and releases feel-good chemicals.",d:"easy",tp:"Health"},
    {q:"What are secondary colours?",t:"choice",o:["Red, yellow, blue","Orange, green, purple","Black, white, grey","Pink, brown, tan"],a:"Orange, green, purple",h:"Made by mixing two primaries.",e:"Red+yellow=orange, blue+yellow=green, red+blue=purple.",d:"easy",tp:"Art"},
    {q:"How much active time should kids get daily?",t:"choice",o:["15 minutes","30 minutes","60 minutes","120 minutes"],a:"60 minutes",h:"About an hour.",e:"Canadian guidelines: 60 minutes of activity daily.",d:"easy",tp:"Health"},
    {q:"What is rhythm in music?",t:"choice",o:["How loud it is","The pattern of beats","The words","The instruments"],a:"The pattern of beats",h:"Tap your foot to the...",e:"Rhythm = the pattern of strong and weak beats over time.",d:"easy",tp:"Music"},
    {q:"Water helps your body by?",t:"choice",o:["Nothing really","Keeping you hydrated and helping organs work","Making you heavier","Replacing food"],a:"Keeping you hydrated and helping organs work",h:"Your body is mostly water.",e:"Water helps digestion, circulation, temperature, and brain function.",d:"easy",tp:"Health"},
    {q:"Which is a warm colour?",t:"choice",o:["Blue","Green","Orange","Purple"],a:"Orange",h:"Think of fire.",e:"Warm colours: red, orange, yellow.",d:"easy",tp:"Art"},
    {q:"What is a healthy snack?",t:"choice",o:["Candy bar","Apple with peanut butter","Soda","Chips"],a:"Apple with peanut butter",h:"Fruit + protein = lasting energy.",e:"Whole foods give better nutrition than processed snacks.",d:"easy",tp:"Nutrition"},
    {q:"What is tempo in music?",t:"choice",o:["Volume","Speed of music","Type of instrument","Lyrics"],a:"Speed of music",h:"Fast songs vs slow songs.",e:"Tempo = how fast or slow the music is.",d:"easy",tp:"Music"},
    {q:"What does 'balance' mean in art?",t:"choice",o:["Standing on one foot","Equal weight on both sides of art","Using one colour","Drawing straight lines"],a:"Equal weight on both sides of art",h:"Symmetry is one type.",e:"Balance = elements arranged so art feels even and stable.",d:"easy",tp:"Art"},
    {q:"Fruits and vegetables should be what portion of your plate?",t:"choice",o:["A quarter","A third","Half","All of it"],a:"Half",h:"The biggest section.",e:"Canada's Food Guide: fruits & vegetables = half your plate.",d:"easy",tp:"Nutrition"},
    {q:"Why is stretching important?",t:"choice",o:["It makes you taller","Helps prevent injuries and increases flexibility","It burns the most calories","It's not important"],a:"Helps prevent injuries and increases flexibility",h:"Before and after exercise.",e:"Stretching warms muscles and improves range of motion.",d:"easy",tp:"Health"},
    {q:"'Line' in art can be?",t:"choice",o:["Only straight","Straight, curved, zigzag, or wavy","Only curved","Only thick"],a:"Straight, curved, zigzag, or wavy",h:"Many types of lines exist.",e:"Lines come in many forms and create movement, texture, and shape.",d:"easy",tp:"Art"},
    {q:"What is a good way to resolve a conflict with a friend?",t:"choice",o:["Yell at them","Ignore them forever","Talk calmly about how you feel","Tell everyone they're wrong"],a:"Talk calmly about how you feel",h:"Use 'I feel...' statements.",e:"Calm communication helps resolve conflicts without hurting feelings.",d:"easy",tp:"Health"},
    {q:"What makes a beat in music?",t:"choice",o:["The words only","A regular, repeating pulse","Random sounds","Silence"],a:"A regular, repeating pulse",h:"Like a heartbeat: steady and even.",e:"A beat is the steady pulse that keeps time in music.",d:"easy",tp:"Music"},
    {q:"What vitamin do you get from the sun?",t:"choice",o:["Vitamin A","Vitamin B","Vitamin C","Vitamin D"],a:"Vitamin D",h:"The 'sunshine vitamin'.",e:"Your skin makes Vitamin D when exposed to sunlight.",d:"easy",tp:"Nutrition"},
    {q:"Mixing blue and yellow makes?",t:"choice",o:["Red","Orange","Green","Purple"],a:"Green",h:"Think of nature.",e:"Blue + yellow = green (secondary colour).",d:"easy",tp:"Art"},
    {q:"Teamwork in sports means?",t:"choice",o:["Only the best player matters","Everyone works together toward a goal","You don't need to listen","Winning is everything"],a:"Everyone works together toward a goal",h:"Together everyone achieves more.",e:"Teamwork = cooperating, communicating, and supporting each other.",d:"easy",tp:"Health"},
    {q:"What is texture in art?",t:"choice",o:["The colour","How a surface looks or feels","The size","The shape"],a:"How a surface looks or feels",h:"Smooth, rough, bumpy.",e:"Texture = surface quality. Can be real or drawn to look textured.",d:"easy",tp:"Art"},
  ],
};

/* ===== REWARDS ===== */
const CRW = {i:[{id:"p1",name:"Phoenix Companion",cost:150,owned:false,desc:"Fiery phoenix follows you"},{id:"p2",name:"Fenrir Wolf Pup",cost:200,owned:false,desc:"Norse wolf companion"},{id:"p3",name:"Golden Banner",cost:100,owned:false,desc:"Shimmering profile banner"},{id:"p4",name:"Celestial Armor",cost:400,owned:false,desc:"Mythic armor set"}],r:[{id:"rb1",name:"Pick a snack at the store",cost:200,tier:"Bronze"},{id:"rb2",name:"Get a drink of your choice",cost:200,tier:"Bronze"},{id:"rs1",name:"Choose Friday's movie",cost:500,tier:"Silver"},{id:"rs2",name:"I pick dinner menu AND music for one night",cost:500,tier:"Silver"},{id:"rs3",name:"A squishy toy (like a Needoh)",cost:500,tier:"Silver"},{id:"rg1",name:"$10 toward something you want",cost:1000,tier:"Gold"},{id:"rg2",name:"Go to a restaurant of your choice on the weekend",cost:1000,tier:"Gold"},{id:"rm1",name:"Special experience outing",cost:2500,tier:"Mythic"},{id:"rm2",name:"Everyone sleeps in a blanket fort on Friday night",cost:2500,tier:"Mythic"}]};
const ARW = {i:[{id:"a1",name:"Rare Creature Boost",cost:150,owned:false,desc:"Next creature guaranteed Rare+"},{id:"a2",name:"Mystery Dino Egg",cost:200,owned:false,desc:"Hatches a random creature"},{id:"a3",name:"Lava Portal Skin",cost:100,owned:false,desc:"Portal glows with lava"},{id:"a4",name:"Camp Upgrade",cost:400,owned:false,desc:"Upgrade expedition camp"}],r:[{id:"rb1",name:"Pick a snack at the store",cost:200,tier:"Bronze"},{id:"rb2",name:"Get a drink of your choice",cost:200,tier:"Bronze"},{id:"rs1",name:"Choose Friday's movie",cost:500,tier:"Silver"},{id:"rs2",name:"I pick dinner menu AND music for one night",cost:500,tier:"Silver"},{id:"rs3",name:"A squishy toy (like a Needoh)",cost:500,tier:"Silver"},{id:"rg1",name:"$10 toward something you want",cost:1000,tier:"Gold"},{id:"rg2",name:"Go to a restaurant of your choice on the weekend",cost:1000,tier:"Gold"},{id:"rl1",name:"Special experience outing",cost:2500,tier:"Legendary"},{id:"rl2",name:"Everyone sleeps in a blanket fort on Friday night",cost:2500,tier:"Legendary"}]};

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
function mkC(id,nm,gr,rl,rw){return{id,name:nm,grade:gr,drachmas:0,totalXP:0,streak:{current:0,longest:0,lastActiveDate:null},realmProgress:Object.fromEntries(Object.keys(rl).map(k=>[k,{questsCompleted:0,correct:0,total:0,visited:false}])),history:[],creatures:[],equipped:{companion:null,banner:null,armor:false,portalSkin:null,campLevel:0},creatureBoost:false,rewards:{inApp:rw.i.map(r=>({...r})),realWorld:rw.r.map(r=>({...r})),pendingClaims:[],rewardLog:[]}}}
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
    <div className="st" style={{background:isPar?"#f8f7f4":pr.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative",overflowX:"hidden"}}>
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
const eq=ch.equipped||{};const comp=eq.companion==="phoenix"?"🔥🦅":eq.companion==="wolf"?"🐺":null;const hasLava=eq.portalSkin==="lava";const hasCamp=eq.campLevel>0;
return(<div style={{padding:"20px 16px 100px"}}>
  <div className="ai" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div><p style={{color:"#8a8070",fontSize:13,textTransform:"uppercase",letterSpacing:1.5}}>Welcome back</p><h1 style={{fontFamily:pr.hf,fontSize:26,fontWeight:700,color:"#e8e0d4"}}>{ch.name} {comp&&<span className="fl" style={{fontSize:20}}>{comp}</span>}</h1></div><div style={{display:"flex",alignItems:"center",gap:6}}>{hasCamp&&<span style={{fontSize:16}}>🏕️</span>}<span style={{fontSize:20}}>{rk.i}</span><span style={{fontFamily:pr.hf,fontSize:12,color:pr.ac}}>{rk.n}</span></div></div>
  <div className="ai" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24,animationDelay:"0.1s"}}><SB i={<Flame size={18} color="#e67e22"/>} l="Streak" v={`${ch.streak.current}d`}/><SB i={pr.ci} l={pr.curr} v={ch.drachmas}/><SB i={<TrendingUp size={18} color="#2ecc71"/>} l="XP" v={ch.totalXP}/></div>
  <div className="ai" style={{animationDelay:"0.2s",background:`${pr.ac}10`,borderRadius:20,padding:20,marginBottom:20,border:`1px solid ${hasLava?"#ef4444":pr.ac+"30"}`,boxShadow:hasLava?"0 0 20px rgba(239,68,68,0.3), 0 0 40px rgba(249,115,22,0.15)":"none"}}><p style={{fontSize:12,textTransform:"uppercase",letterSpacing:2,color:pr.ac,marginBottom:8,fontWeight:700}}>Daily Mission</p><p style={{fontSize:14,color:"#c0b8a8",marginBottom:16,lineHeight:1.5,fontStyle:"italic"}}>{nd}</p><button onClick={()=>nav("realmMap")} style={{width:"100%",padding:16,borderRadius:14,border:"none",background:`linear-gradient(135deg,${pr.ac},${pr.ac}cc)`,color:"#0a0e1a",fontFamily:pr.hf,fontSize:16,fontWeight:700,cursor:"pointer"}}>Begin Mission</button></div>
  {nx&&<div className="ai" style={{animationDelay:"0.3s",background:"#141830",borderRadius:16,padding:16,border:"1px solid #222"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:8}}><span style={{color:"#8a8070"}}>Rank Progress</span><span style={{color:pr.ac}}>{ch.totalXP}/{nx.x} XP</span></div><div style={{height:6,borderRadius:3,background:"#1a1a2a"}}><div style={{height:"100%",borderRadius:3,background:`linear-gradient(90deg,${pr.ac},${pr.ac}88)`,width:`${Math.min(100,ch.totalXP/nx.x*100)}%`}}/></div><p style={{fontSize:11,color:"#8a8070",marginTop:6}}>Next: {nx.i} {nx.n}</p></div>}
</div>);}
function SB({i,l,v}){return<div style={{background:"#141830",borderRadius:14,padding:"14px 10px",textAlign:"center",border:"1px solid #1a1a30"}}><div style={{marginBottom:4,fontSize:typeof i==="string"?18:undefined}}>{i}</div><p style={{fontSize:18,fontWeight:800,color:"#e8e0d4"}}>{v}</p><p style={{fontSize:10,color:"#8a8070",textTransform:"uppercase",letterSpacing:1}}>{l}</p></div>}

/* ===== MAP ===== */
function Rm({ch,pr,nav}){return(<div style={{padding:"20px 16px 100px"}}><h2 style={{fontFamily:pr.hf,fontSize:22,color:pr.ac,marginBottom:4}}>{pr.ml}</h2><p style={{fontSize:13,color:"#8a8070",marginBottom:20}}>Choose your next mission.</p><div style={{display:"flex",flexDirection:"column",gap:12}}>{Object.entries(pr.realms).map(([k,r],i)=>{const p=ch.realmProgress[k],pc=p?.total?Math.round(p.correct/p.total*100):0;return<div key={k} className="ai" onClick={()=>nav("quest",k)} style={{animationDelay:`${i*.06}s`,background:r.c.bg,borderRadius:18,padding:"16px 18px",cursor:"pointer",border:`1px solid ${r.c.p}33`,display:"flex",alignItems:"center",gap:14}}><div style={{width:48,height:48,borderRadius:14,background:`${r.c.p}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><r.icon size={24} color={r.c.p}/></div><div style={{flex:1}}><p style={{fontFamily:pr.hf,fontSize:14,fontWeight:700,color:"#e8e0d4",marginBottom:2}}>{r.name}</p><p style={{fontSize:11,color:"#8a8070"}}>{r.subj}</p><div style={{marginTop:6,display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:4,borderRadius:2,background:"#0a0a1a"}}><div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${r.c.p},${r.c.a})`,width:`${pc}%`,transition:"width .5s"}}/></div><span style={{fontSize:11,color:r.c.p,fontWeight:700}}>{pc}%</span></div></div><ChevronRight size={18} color="#555"/></div>})}</div></div>);}

/* ===== SCRATCHPAD ===== */
function Pad({open,onClose,qIdx}){const cvs=useRef(null);const drawing=useRef(false);const[clr,setClr]=useState("#e8e0d4");const[erasing,setErasing]=useState(false);
const getXY=(e)=>{const r=cvs.current.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return[t.clientX-r.left,t.clientY-r.top]};
const start=(e)=>{e.preventDefault();drawing.current=true;const ctx=cvs.current.getContext("2d");const[x,y]=getXY(e);ctx.beginPath();ctx.moveTo(x,y)};
const move=(e)=>{if(!drawing.current)return;e.preventDefault();const ctx=cvs.current.getContext("2d");const[x,y]=getXY(e);ctx.lineWidth=erasing?24:3;ctx.lineCap="round";ctx.strokeStyle=erasing?"#1a1a2a":clr;ctx.globalCompositeOperation=erasing?"destination-out":"source-over";ctx.lineTo(x,y);ctx.stroke()};
const end=()=>{drawing.current=false};
const clear=()=>{const ctx=cvs.current?.getContext("2d");if(ctx)ctx.clearRect(0,0,cvs.current.width,cvs.current.height)};
useEffect(()=>{clear()},[qIdx]);
useEffect(()=>{if(open&&cvs.current){const c=cvs.current;c.width=c.offsetWidth;c.height=c.offsetHeight}},[open]);
if(!open)return null;
const colors=["#e8e0d4","#3b82f6","#ef4444","#22c55e"];
return(<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.75)",display:"flex",flexDirection:"column"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"#141830"}}>
    <div style={{display:"flex",gap:8,alignItems:"center"}}>{colors.map(c=><button key={c} onClick={()=>{setClr(c);setErasing(false)}} style={{width:28,height:28,borderRadius:"50%",background:c,border:clr===c&&!erasing?`3px solid ${c}55`:"2px solid #333",cursor:"pointer",boxShadow:clr===c&&!erasing?"0 0 8px "+c:"none"}}/>)}<button onClick={()=>setErasing(!erasing)} style={{padding:"6px 10px",borderRadius:8,border:erasing?"2px solid #f59e0b":"1px solid #333",background:erasing?"#f59e0b22":"transparent",color:erasing?"#f59e0b":"#8a8070",cursor:"pointer",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:4}}><Eraser size={14}/>Erase</button></div>
    <div style={{display:"flex",gap:8}}><button onClick={clear} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #333",background:"transparent",color:"#8a8070",cursor:"pointer",fontSize:11,fontWeight:600}}>Clear</button><button onClick={onClose} style={{width:32,height:32,borderRadius:8,border:"none",background:"#e74c3c",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={16}/></button></div>
  </div>
  <canvas ref={cvs} onTouchStart={start} onTouchMove={move} onTouchEnd={end} onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end} style={{flex:1,touchAction:"none",cursor:"crosshair"}}/>
</div>);}

/* ===== QUEST ===== */
function Qst({realm,ch,pr,uid,uC,nav,setQs}){const[idx,setIdx]=useState(0);const[sel,setSel]=useState(null);const[inp,setInp]=useState("");const[rev,setRev]=useState(false);const[ht,setHt]=useState(false);const[res,setRes]=useState([]);const[padOpen,setPadOpen]=useState(false);const t0=useRef(Date.now());
const rc=pr.realms[realm];const pool=(pr.qs[realm]||[]);const qb=useMemo(()=>{const s=[...pool];for(let i=s.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s[i],s[j]]=[s[j],s[i]]}return s.slice(0,5)},[realm]);const q=qb[idx];if(!q)return null;
const cor=q.t==="input"?inp.trim().replace(/,/g,"")===q.a.replace(/,/g,""):sel===q.a;
const sub=()=>{if(q.t==="input"&&!inp.trim())return;if(q.t==="choice"&&!sel)return;setRev(true);setRes(p=>[...p,{correct:cor,q:q.q,tp:q.tp}])};
const fin=(fr)=>{const c=fr.filter(r=>r.correct).length,t=qb.length,acc=Math.round(c/t*100),base=acc>=80?20:acc>=60?15:10,bon=acc===100?15:0,earned=base+bon,el=Math.round((Date.now()-t0.current)/1000),cr=uid==="alexi"?pickCreature(ch.creatureBoost?100:acc,ch.creatures.map(c=>c.name)):null;
const st={realm,correct:c,total:t,accuracy:acc,drachmasEarned:earned,timeSeconds:el,results:fr,creature:cr};setQs(st);
uC(ch=>{ch.drachmas+=earned;ch.totalXP+=earned+c*5;if(ch.realmProgress[realm]){ch.realmProgress[realm].questsCompleted+=1;ch.realmProgress[realm].correct+=c;ch.realmProgress[realm].total+=t;if(!ch.realmProgress[realm].visited){ch.drachmas+=30;ch.realmProgress[realm].visited=true}}const today=td(),last=ch.streak.lastActiveDate;if(last!==today){const y=new Date();y.setDate(y.getDate()-1);if(last===y.toISOString().split("T")[0])ch.streak.current+=1;else if(!last)ch.streak.current=1;else ch.streak.current=Math.max(1,ch.streak.current);ch.streak.lastActiveDate=today;ch.streak.longest=Math.max(ch.streak.longest,ch.streak.current)}ch.history.push({date:today,realm,accuracy:acc,time:el,drachmas:earned});if(cr&&!ch.creatures.find(x=>x.name===cr.name))ch.creatures.push(cr);if(ch.creatureBoost)ch.creatureBoost=false});nav("questComplete")};
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
  <button onClick={()=>setPadOpen(true)} style={{position:"fixed",bottom:80,right:20,width:48,height:48,borderRadius:"50%",border:"none",background:`linear-gradient(135deg,${pr.ac},${pr.ac}cc)`,color:"#0a0e1a",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(0,0,0,0.4)",zIndex:60}}><Pencil size={22}/></button>
  <Pad open={padOpen} onClose={()=>setPadOpen(false)} qIdx={idx}/>
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
const eq=ch.equipped||{};const hasBanner=eq.banner==="gold";const hasArmor=eq.armor;
const rd=Object.entries(pr.realms).map(([k,r])=>{const p=ch.realmProgress[k];return{s:r.name.split(" ")[0],v:p?.total?Math.round(p.correct/p.total*100):0}});
return(<div style={{padding:"20px 16px 100px"}}><div className="ai" style={{textAlign:"center",marginBottom:24,background:hasBanner?"linear-gradient(135deg,#d4a84322,#f5e6a322,#d4a84322)":"transparent",borderRadius:hasBanner?20:0,padding:hasBanner?20:0,border:hasBanner?"1px solid #d4a84344":"none"}}><div style={{width:80,height:80,borderRadius:"50%",background:hasArmor?"linear-gradient(135deg,#4a90d9,#8e44ad,#d4a843)":`linear-gradient(135deg,${pr.ac},${pr.ac}cc)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:36,position:"relative"}}>{rk.i}{hasArmor&&<span style={{position:"absolute",bottom:-2,right:-2,fontSize:18}}>⚔️</span>}</div><h2 style={{fontFamily:pr.hf,fontSize:24,color:"#e8e0d4"}}>{ch.name}</h2><p style={{fontFamily:pr.hf,fontSize:14,color:pr.ac}}>{rk.n}</p>{hasBanner&&<p className="sh" style={{fontSize:11,marginTop:4}}>✦ Golden Banner ✦</p>}</div>
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
const eq=ch.equipped||{};const log=ch.rewards?.rewardLog||[];const pending=log.filter(r=>r.status==="pending"||r.status==="approved");
const buy=it=>{if(ch.drachmas<it.cost)return;
  if(it.id==="a1"){uC(c=>{c.drachmas-=it.cost;c.creatureBoost=true});fl("Creature Boost activated! Next quest = Rare+");return}
  if(it.id==="a2"){const cr=pickCreature(100,ch.creatures.map(c=>c.name));uC(c=>{c.drachmas-=it.cost;if(cr&&!c.creatures.find(x=>x.name===cr.name))c.creatures.push(cr)});fl(cr?`Hatched: ${cr.name} (${cr.rarity})!`:"Egg hatched!");return}
  if(it.owned)return;uC(c=>{c.drachmas-=it.cost;c.rewards.inApp.find(r=>r.id===it.id).owned=true});fl(`Acquired: ${it.name}`)};
const equip=(field,val)=>{uC(c=>{if(!c.equipped)c.equipped={};if(c.equipped[field]===val)c.equipped[field]=null;else c.equipped[field]=val});fl(eq[field]===val?"Unequipped":"Equipped!")};
const equipArmor=()=>{uC(c=>{if(!c.equipped)c.equipped={};c.equipped.armor=!c.equipped.armor});fl(!eq.armor?"Armor equipped!":"Armor removed")};
const equipCamp=()=>{uC(c=>{if(!c.equipped)c.equipped={};c.equipped.campLevel=1})};
const clm=it=>{if(ch.drachmas<it.cost)return;const entry={id:Date.now().toString(),name:it.name,tier:it.tier,cost:it.cost,claimedAt:new Date().toISOString(),approvedAt:null,grantedAt:null,status:"pending"};uC(c=>{c.drachmas-=it.cost;if(!c.rewards.rewardLog)c.rewards.rewardLog=[];c.rewards.rewardLog.push(entry)});fl("Claim submitted for approval")};
return(<div style={{padding:"20px 16px 100px"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div><h2 style={{fontFamily:pr.hf,fontSize:22,color:pr.ac}}>{pr.lbl==="Agent"?"The Outpost":"The Bazaar"}</h2>{!isPar&&<p style={{fontSize:13,color:"#8a8070"}}>{pr.ci} {ch.drachmas}</p>}</div>{isPar&&<button onClick={()=>nav("parentDash")} style={{background:"none",border:"1px solid #333",color:"#8a8070",padding:"8px 14px",borderRadius:10,cursor:"pointer",fontSize:12}}>← Back</button>}</div>
  <div style={{display:"flex",marginBottom:20,borderRadius:12,overflow:"hidden",border:"1px solid #222"}}>{[{id:"inApp",l:"Upgrades"},{id:"real",l:"Real Rewards"},{id:"claims",l:`My Claims (${pending.length})`}].map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:12,border:"none",background:tab===t.id?`${pr.ac}20`:"#141830",color:tab===t.id?pr.ac:"#8a8070",fontSize:11,fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:1}}>{t.l}</button>)}</div>
  {tab==="inApp"&&ch.rewards.inApp.map(it=>{const isConsumable=it.id==="a1"||it.id==="a2";const isEquippable=["p1","p2","p3","p4","a3","a4"].includes(it.id);
  const eqMap={p1:["companion","phoenix"],p2:["companion","wolf"],p3:["banner","gold"],a3:["portalSkin","lava"]};
  const isEq=eqMap[it.id]?eq[eqMap[it.id][0]]===eqMap[it.id][1]:it.id==="p4"?eq.armor:it.id==="a4"?(eq.campLevel||0)>0:false;
  const boostActive=it.id==="a1"&&ch.creatureBoost;
  return<div key={it.id} style={{background:"#141830",borderRadius:14,padding:16,marginBottom:10,border:`1px solid ${isEq?"#2ecc7144":"#222"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{flex:1}}><p style={{fontSize:14,fontWeight:700,color:"#e8e0d4"}}>{it.name}</p><p style={{fontSize:11,color:"#8a8070"}}>{it.desc}</p>{boostActive&&<p style={{fontSize:11,color:"#f59e0b",marginTop:4}}>⚡ Ready — next quest!</p>}</div><div style={{display:"flex",gap:6,alignItems:"center"}}>
  {it.owned&&isEquippable&&<button onClick={()=>{if(it.id==="p4")equipArmor();else if(it.id==="a4")equipCamp();else{const[f,v]=eqMap[it.id];equip(f,v)}}} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${isEq?"#2ecc71":"#555"}`,background:isEq?"#2ecc7122":"transparent",color:isEq?"#2ecc71":"#8a8070",fontSize:11,fontWeight:700,cursor:"pointer"}}>{isEq?"Equipped":"Equip"}</button>}
  {it.owned&&!isEquippable&&!isConsumable&&<span style={{fontSize:11,color:"#2ecc71",fontWeight:700,padding:"6px 12px",borderRadius:8,background:"#2ecc7115"}}>Owned</span>}
  {(!it.owned||isConsumable)&&<button onClick={()=>buy(it)} disabled={ch.drachmas<it.cost} style={{padding:"8px 16px",borderRadius:10,border:"none",background:ch.drachmas>=it.cost?`linear-gradient(135deg,${pr.ac},${pr.ac}cc)`:"#222",color:ch.drachmas>=it.cost?"#0a0e1a":"#555",fontWeight:700,fontSize:12,cursor:ch.drachmas>=it.cost?"pointer":"default"}}>{pr.ci} {it.cost}</button>}
  </div></div>})}
  {tab==="real"&&ch.rewards.realWorld.map(it=><div key={it.id} style={{background:"#141830",borderRadius:14,padding:16,marginBottom:10,border:`1px solid ${TC[it.tier]||"#333"}33`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:10,fontWeight:700,color:TC[it.tier]||"#999",textTransform:"uppercase",padding:"2px 8px",borderRadius:6,background:`${TC[it.tier]||"#999"}15`,display:"inline-block",marginBottom:4}}>{it.tier}</span><p style={{fontSize:14,fontWeight:700,color:"#e8e0d4"}}>{it.name}</p></div><button onClick={()=>clm(it)} disabled={ch.drachmas<it.cost||isPar} style={{padding:"8px 16px",borderRadius:10,border:"none",background:ch.drachmas>=it.cost&&!isPar?`linear-gradient(135deg,${pr.ac},${pr.ac}cc)`:"#222",color:ch.drachmas>=it.cost&&!isPar?"#0a0e1a":"#555",fontWeight:700,fontSize:12,cursor:ch.drachmas>=it.cost&&!isPar?"pointer":"default"}}>{pr.ci} {it.cost}</button></div>)}
  {tab==="claims"&&(log.length===0?<p style={{textAlign:"center",padding:40,color:"#8a8070"}}>No claims yet. Earn {pr.curr} and claim real rewards!</p>:log.slice().reverse().map((c,i)=><div key={i} style={{background:"#141830",borderRadius:14,padding:16,marginBottom:10,border:`1px solid ${c.status==="granted"?"#2ecc7133":c.status==="approved"?"#3b82f633":"#222"}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{fontSize:14,fontWeight:700,color:"#e8e0d4"}}>{c.name}</p><p style={{fontSize:11,color:"#8a8070"}}>{c.tier} · {new Date(c.claimedAt).toLocaleDateString()}</p></div><span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8,background:c.status==="granted"?"#2ecc7122":c.status==="approved"?"#3b82f622":"#f59e0b22",color:c.status==="granted"?"#2ecc71":c.status==="approved"?"#3b82f6":"#f59e0b"}}>{c.status==="granted"?"Granted ✓✓":c.status==="approved"?"Approved ✓":"Pending ⏳"}</span></div></div>))}
  {toast&&<div className="au" style={{position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",background:"#2ecc71",color:"#0a0e1a",padding:"12px 24px",borderRadius:12,fontWeight:700,fontSize:13,zIndex:100,whiteSpace:"nowrap"}}>{toast}</div>}
</div>);}

/* ===== PARENT DASHBOARD ===== */
function PDash({data,setData,nav}){const[ki,setKi]=useState(0);const[tab,setTab]=useState("overview");const[adding,setAdding]=useState(false);const[newName,setNewName]=useState("");const[newTier,setNewTier]=useState("Bronze");
const ch=data.children[ki];const pr=ki===0?PROF.cece:PROF.alexi;
const tq=Object.values(ch.realmProgress).reduce((a,b)=>a+b.questsCompleted,0);const tc=Object.values(ch.realmProgress).reduce((a,b)=>a+b.correct,0);const tt=Object.values(ch.realmProgress).reduce((a,b)=>a+b.total,0);const acc=tt?Math.round(tc/tt*100):0;const tT=ch.history.reduce((a,b)=>a+(b.time||0),0);
const sd=Object.entries(pr.realms).map(([k,r])=>{const p=ch.realmProgress[k];return{name:r.name.split(" ")[0],accuracy:p?.total?Math.round(p.correct/p.total*100):0}});
const streakData=Array.from({length:14},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(13-i));const ds=d.toISOString().split("T")[0];const quests=(ch.history||[]).filter(h=>h.date===ds).length;return{day:d.toLocaleDateString("en-US",{month:"short",day:"numeric"}),quests}});
const logout=()=>{setData(p=>({...p,currentUser:null}));nav("login")};
return(<div style={{padding:"20px 16px 40px",minHeight:"100vh",color:"#1a1a2a"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><p style={{fontSize:12,color:"#888",textTransform:"uppercase",letterSpacing:1.5}}>Parent Dashboard</p><button onClick={logout} style={{background:"none",border:"1px solid #ddd",padding:"8px 12px",borderRadius:8,cursor:"pointer",color:"#888",fontSize:12,display:"flex",alignItems:"center",gap:4}}><LogOut size={14}/> Exit</button></div>
  <div style={{display:"flex",gap:8,marginBottom:16}}>{data.children.map((c,i)=><button key={i} onClick={()=>{setKi(i);setTab("overview")}} style={{flex:1,padding:12,borderRadius:12,border:ki===i?"2px solid #1a1a2a":"1px solid #ddd",background:ki===i?"#1a1a2a":"#fff",color:ki===i?"#fff":"#666",fontWeight:700,fontSize:14,cursor:"pointer"}}>{c.name} (Gr.{c.grade})</button>)}</div>
  <div style={{display:"flex",marginBottom:20,borderRadius:10,overflow:"hidden",border:"1px solid #ddd"}}>{["overview","subjects","rewards"].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:10,border:"none",background:tab===t?"#1a1a2a":"#fff",color:tab===t?"#fff":"#888",fontSize:12,fontWeight:700,cursor:"pointer",textTransform:"capitalize"}}>{t}</button>)}</div>
  {tab==="overview"&&<><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>{[{l:"Time",v:`${Math.floor(tT/60)}m`,i:<Clock size={18} color="#4a90d9"/>},{l:"Sessions",v:tq,i:<Target size={18} color="#2ecc71"/>},{l:"Accuracy",v:`${acc}%`,i:<TrendingUp size={18} color="#e67e22"/>},{l:"Streak",v:`${ch.streak.current}d`,i:<Flame size={18} color="#e74c3c"/>}].map((m,i)=><div key={i} style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee"}}><div style={{marginBottom:8}}>{m.i}</div><p style={{fontSize:22,fontWeight:800,color:"#1a1a2a"}}>{m.v}</p><p style={{fontSize:11,color:"#888"}}>{m.l}</p></div>)}</div>
  <div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee",marginBottom:20}}><p style={{fontSize:12,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Insights</p><p style={{fontSize:14,color:"#333",lineHeight:1.7}}>{ch.name} has completed {tq} quest{tq!==1?"s":""} with {acc}% accuracy.{gW(ch,pr.realms)?` ${pr.realms[gW(ch,pr.realms)].subj} could use more attention.`:""}{ch.streak.current>=3?` A ${ch.streak.current}-day streak shows consistency.`:""}</p></div>
  <div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee",marginBottom:20}}><p style={{fontSize:12,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Daily Activity (14 days)</p><ResponsiveContainer width="100%" height={140}><BarChart data={streakData} barSize={16}><CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false}/><XAxis dataKey="day" tick={{fontSize:8,fill:"#888"}} interval={1}/><YAxis allowDecimals={false} tick={{fontSize:10,fill:"#888"}} width={20}/><Tooltip contentStyle={{background:"#fff",border:"1px solid #eee",borderRadius:8,fontSize:12}} formatter={(v)=>[v,"Quests"]}/><Bar dataKey="quests" fill={pr.ac} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
  <div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee"}}><p style={{fontSize:12,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Accuracy by Subject</p><ResponsiveContainer width="100%" height={200}><BarChart data={sd} barSize={20}><CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="name" tick={{fontSize:9,fill:"#888"}}/><YAxis domain={[0,100]} tick={{fontSize:10,fill:"#888"}}/><Tooltip contentStyle={{background:"#fff",border:"1px solid #eee",borderRadius:8,fontSize:12}}/><Bar dataKey="accuracy" fill={pr.ac} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></>}
  {tab==="subjects"&&Object.entries(pr.realms).map(([k,r])=>{const p=ch.realmProgress[k],pc=p?.total?Math.round(p.correct/p.total*100):0;return<div key={k} style={{background:"#fff",borderRadius:14,padding:16,marginBottom:10,border:"1px solid #eee"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div><p style={{fontSize:14,fontWeight:700}}>{r.name}</p><p style={{fontSize:12,color:"#888"}}>{r.subj}</p></div><span style={{fontSize:18,fontWeight:800,color:pc>=70?"#2ecc71":pc>=40?"#e67e22":"#e74c3c"}}>{pc}%</span></div><div style={{height:6,borderRadius:3,background:"#eee"}}><div style={{height:"100%",borderRadius:3,background:pc>=70?"#2ecc71":pc>=40?"#e67e22":"#e74c3c",width:`${pc}%`}}/></div><p style={{fontSize:11,color:"#888",marginTop:6}}>{p?.questsCompleted||0} quests · {p?.correct||0}/{p?.total||0}</p></div>})}
  {tab==="rewards"&&<>{/* Balance */}<div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee",marginBottom:16}}><p style={{fontSize:14,fontWeight:700,marginBottom:4}}>{ki===0?"Drachma":"Time Crystal"} Balance</p><p style={{fontSize:28,fontWeight:800,color:pr.ac}}>{ch.drachmas}</p></div>
  {/* Active Claims — Approve & Grant */}
  {(()=>{const log=ch.rewards?.rewardLog||[];const active=log.filter(r=>r.status!=="granted");const history=log.filter(r=>r.status==="granted");
  const act=(i,action)=>{setData(p=>{const n=JSON.parse(JSON.stringify(p));const rl=n.children[ki].rewards.rewardLog||[];const item=rl[i];if(item){if(action==="approve"){item.status="approved";item.approvedAt=new Date().toISOString()}else if(action==="grant"){item.status="granted";item.grantedAt=new Date().toISOString()}}return n})};
  return<><div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee",marginBottom:16}}><p style={{fontSize:12,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Active Claims</p>{active.length===0?<p style={{color:"#aaa",fontSize:13}}>No pending claims.</p>:active.map((c,ci)=>{const ri=log.indexOf(c);return<div key={ci} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:ci<active.length-1?"1px solid #eee":"none"}}><div><p style={{fontSize:13,fontWeight:700,color:"#333"}}>{c.name}</p><p style={{fontSize:11,color:"#888"}}>{c.tier} · Claimed {new Date(c.claimedAt).toLocaleDateString()}{c.approvedAt&&` · Approved ${new Date(c.approvedAt).toLocaleDateString()}`}</p></div><div style={{display:"flex",gap:6}}>{c.status==="pending"&&<button onClick={()=>act(ri,"approve")} style={{padding:"6px 12px",borderRadius:8,border:"none",background:"#3b82f6",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer"}}>Approve</button>}{c.status==="approved"&&<button onClick={()=>act(ri,"grant")} style={{padding:"6px 12px",borderRadius:8,border:"none",background:"#2ecc71",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer"}}>Grant</button>}</div></div>})}</div>
  {history.length>0&&<div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee",marginBottom:16}}><p style={{fontSize:12,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Granted History</p>{history.slice().reverse().map((c,i)=><div key={i} style={{padding:"8px 0",borderBottom:i<history.length-1?"1px solid #eee":"none"}}><p style={{fontSize:13,fontWeight:600,color:"#333"}}>{c.name}</p><p style={{fontSize:11,color:"#888"}}>Claimed {new Date(c.claimedAt).toLocaleDateString()} → Granted {new Date(c.grantedAt).toLocaleDateString()}</p></div>)}</div>}</>})()}
  {/* Manage Rewards */}
  {(()=>{const tierCosts={Bronze:200,Silver:500,Gold:1000,Mythic:2500,Legendary:2500};
  const addR=()=>{if(!newName.trim())return;setData(p=>{const n=JSON.parse(JSON.stringify(p));n.children[ki].rewards.realWorld.push({id:"r"+Date.now(),name:newName.trim(),cost:tierCosts[newTier],tier:newTier});return n});setNewName("");setAdding(false)};
  const delR=(i)=>{setData(p=>{const n=JSON.parse(JSON.stringify(p));n.children[ki].rewards.realWorld.splice(i,1);return n})};
  return<div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #eee"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><p style={{fontSize:12,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:1}}>Manage Rewards</p><button onClick={()=>setAdding(!adding)} style={{padding:"6px 12px",borderRadius:8,border:"none",background:adding?"#e74c3c":"#1a1a2a",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer"}}>{adding?"Cancel":"+ Add"}</button></div>
  {adding&&<div style={{background:"#f8f7f4",borderRadius:10,padding:12,marginBottom:12,border:"1px solid #eee"}}><input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Reward name…" style={{width:"100%",padding:10,borderRadius:8,border:"1px solid #ddd",fontSize:13,marginBottom:8}}/><div style={{display:"flex",gap:6,marginBottom:8}}>{Object.keys(tierCosts).map(t=><button key={t} onClick={()=>setNewTier(t)} style={{flex:1,padding:8,borderRadius:8,border:newTier===t?"2px solid #1a1a2a":"1px solid #ddd",background:newTier===t?"#1a1a2a":"#fff",color:newTier===t?"#fff":"#666",fontSize:10,fontWeight:700,cursor:"pointer"}}>{t}</button>)}</div><button onClick={addR} style={{width:"100%",padding:10,borderRadius:8,border:"none",background:"#2ecc71",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>Add Reward ({tierCosts[newTier]} {ki===0?"Drachmas":"Crystals"})</button></div>}
  {ch.rewards.realWorld.map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<ch.rewards.realWorld.length-1?"1px solid #eee":"none"}}><div><span style={{fontSize:10,color:TC[r.tier]||"#888",fontWeight:700}}>{r.tier}</span><p style={{fontSize:13,color:"#333"}}>{r.name}</p></div><button onClick={()=>delR(i)} style={{padding:"4px 10px",borderRadius:6,border:"1px solid #e74c3c44",background:"transparent",color:"#e74c3c",fontSize:11,cursor:"pointer"}}>Remove</button></div>)}</div>})()}</>}
</div>);}

/* ===== BOTTOM NAV ===== */
function BN({scr,nav,pr,uid}){
const it=uid==="alexi"?[{id:"home",ic:Home,l:"Home"},{id:"realmMap",ic:Map,l:"Eras"},{id:"journal",ic:BookOpen,l:"Journal"},{id:"profile",ic:User,l:"Profile"},{id:"bazaar",ic:ShoppingBag,l:"Outpost"}]:[{id:"home",ic:Home,l:"Home"},{id:"realmMap",ic:Map,l:"Realms"},{id:"profile",ic:User,l:"Profile"},{id:"bazaar",ic:ShoppingBag,l:"Bazaar"}];
return<div className="sb" style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:`${pr.bg}ee`,backdropFilter:"blur(10px)",borderTop:"1px solid #1a1a30",display:"flex",padding:"8px 0 0",zIndex:50}}>{it.map(i=>{const on=scr===i.id;return<button key={i.id} onClick={()=>nav(i.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 0"}}><i.ic size={20} color={on?pr.ac:"#555"} strokeWidth={on?2.5:1.5}/><span style={{fontSize:9,color:on?pr.ac:"#555",fontWeight:on?700:400}}>{i.l}</span></button>})}</div>;}
