import { useState, useEffect, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Shield, Map, Home, User, ShoppingBag, Flame, Star, ChevronRight, ChevronLeft, ArrowLeft, Check, X, HelpCircle, SkipForward, Zap, Trophy, TrendingUp, Clock, Target, Award, Settings, Bell, LogOut, Lock, Crown, Sparkles, Compass, BookOpen, FlaskConical, Globe, DollarSign, Heart, Palette, Languages } from "lucide-react";

/* ================================================================
   REALMQUEST — Cece's Learning Adventure
   A mythology-themed learning app for Ontario Grade 6 curriculum
   ================================================================ */

// ========== GLOBAL STYLES ==========
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Nunito:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; width: 100%; }
  body {
    font-family: 'Nunito', sans-serif;
    background: #0a0e1a;
    color: #e8e0d4;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  input, button { font-family: inherit; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulseGlow { 0%, 100% { filter: drop-shadow(0 0 6px var(--glow)); } 50% { filter: drop-shadow(0 0 18px var(--glow)); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes scaleIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .anim-in { animation: fadeIn 0.4s ease-out both; }
  .anim-scale { animation: scaleIn 0.3s ease-out both; }
  .anim-slide { animation: slideUp 0.4s ease-out both; }
  .float { animation: float 3s ease-in-out infinite; }
  .shimmer-text {
    background: linear-gradient(90deg, #d4a843 0%, #f5e6a3 50%, #d4a843 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }
  /* Safe area padding for notch phones */
  .safe-bottom { padding-bottom: max(20px, env(safe-area-inset-bottom, 20px)); }
`;

// ========== REALM CONFIG ==========
const REALMS = {
  olympus:        { name: "Olympus Peaks",       subject: "Math — Number Sense & Algebra",    icon: Zap,          colors: { primary: "#4a90d9", accent: "#f0c040", bg: "linear-gradient(135deg,#1a2a4a,#2a3a6a,#1a2040)", glow: "#4a90d9" }, mythology: "Greek" },
  fractionForest: { name: "Fraction Forests",     subject: "Math — Fractions & Operations",    icon: Sparkles,     colors: { primary: "#2ecc71", accent: "#a8e6cf", bg: "linear-gradient(135deg,#0a2a1a,#1a3a2a,#0a2018)", glow: "#2ecc71" }, mythology: "Celtic" },
  asgard:         { name: "Asgard Academy",       subject: "Language Arts",                    icon: BookOpen,     colors: { primary: "#8e44ad", accent: "#d4a0f5", bg: "linear-gradient(135deg,#1a102a,#2a1a4a,#1a0a30)", glow: "#8e44ad" }, mythology: "Norse" },
  catacombs:      { name: "The Paris Catacombs",  subject: "French",                           icon: Languages,    colors: { primary: "#e74c3c", accent: "#f5a0a0", bg: "linear-gradient(135deg,#2a0a0a,#3a1a1a,#200a0a)", glow: "#e74c3c" }, mythology: "French" },
  atlantis:       { name: "Atlantis Archives",    subject: "Science",                          icon: FlaskConical, colors: { primary: "#00bcd4", accent: "#80deea", bg: "linear-gradient(135deg,#0a1a2a,#0a2a3a,#081820)", glow: "#00bcd4" }, mythology: "Atlantean" },
  sphinx:         { name: "The Sphinx's Court",   subject: "Social Studies",                   icon: Globe,        colors: { primary: "#e67e22", accent: "#f5c88a", bg: "linear-gradient(135deg,#2a1a0a,#3a2a1a,#201508)", glow: "#e67e22" }, mythology: "Egyptian" },
  oracle:         { name: "The Oracle's Vault",   subject: "Financial Literacy",               icon: DollarSign,   colors: { primary: "#d4a843", accent: "#f5e6a3", bg: "linear-gradient(135deg,#1a1a0a,#2a2a1a,#1a1808)", glow: "#d4a843" }, mythology: "Greek" },
  elysium:        { name: "Elysium Gardens",      subject: "Health & Arts",                    icon: Heart,        colors: { primary: "#e91e90", accent: "#f5a0d0", bg: "linear-gradient(135deg,#1a0a1a,#2a1a2a,#180a18)", glow: "#e91e90" }, mythology: "Paradise" },
};

// ========== QUESTION BANK (Ontario Grade 6 Curriculum) ==========
const QUESTIONS = {
  olympus: [
    { q: "Zeus has hidden a number. It has 7 in the ten-thousands place, 3 in the hundreds place, and 0 everywhere else. What is the number?", type: "input", answer: "70300", hint: "Think about place value: ten-thousands, thousands, hundreds, tens, ones.", explain: "70,300 — the 7 is worth 70,000 and the 3 is worth 300. All other digits are 0.", difficulty: "easy", topic: "Number Sense" },
    { q: "Athena challenges you: What is 4,567 × 8?", type: "input", answer: "36536", hint: "Break it down: 4000×8, 500×8, 60×8, 7×8, then add them.", explain: "4,567 × 8 = 36,536. Breaking large multiplications into parts makes them manageable.", difficulty: "medium", topic: "Number Sense" },
    { q: "Order these from least to greatest: 0.45, 3/8, 0.4, 2/5", type: "choice", options: ["3/8, 2/5, 0.4, 0.45", "0.4, 3/8, 2/5, 0.45", "3/8, 0.4, 2/5, 0.45", "2/5, 3/8, 0.4, 0.45"], answer: "3/8, 0.4, 2/5, 0.45", hint: "Convert everything to decimals: 3/8 = 0.375, 2/5 = 0.4", explain: "3/8 = 0.375, 2/5 = 0.4, so the order is: 0.375, 0.4, 0.4, 0.45. Since 2/5 and 0.4 are equal, they can be in either order.", difficulty: "hard", topic: "Number Sense" },
    { q: "Hermes says: If n + 15 = 42, what is n?", type: "input", answer: "27", hint: "To find n, subtract 15 from both sides of the equation.", explain: "n = 42 − 15 = 27. To solve for a variable, do the opposite operation to both sides.", difficulty: "easy", topic: "Algebra" },
    { q: "What comes next in this pattern? 2, 6, 18, 54, …", type: "input", answer: "162", hint: "Look at how each number relates to the one before it. What operation repeats?", explain: "Each number is multiplied by 3. So 54 × 3 = 162. This is a geometric pattern.", difficulty: "medium", topic: "Algebra" },
    { q: "Apollo's code runs a loop 5 times. Each time, it doubles a number starting at 3. What's the final value?", type: "input", answer: "96", hint: "Start at 3. After loop 1: 6. Keep going…", explain: "3 → 6 → 12 → 24 → 48 → 96. Doubling 5 times. Loops repeat an operation a set number of times.", difficulty: "hard", topic: "Algebra" },
    { q: "What is 125,430 rounded to the nearest thousand?", type: "choice", options: ["125,000", "126,000", "125,400", "125,500"], answer: "125,000", hint: "Look at the hundreds digit. Is it 5 or more?", explain: "The hundreds digit is 4, which is less than 5, so we round down to 125,000.", difficulty: "easy", topic: "Number Sense" },
    { q: "Poseidon challenges: What is 15% of 240?", type: "input", answer: "36", hint: "15% means 15/100. Find 10% first (24) then add half of that (12).", explain: "15% of 240 = 0.15 × 240 = 36. Quick method: 10% = 24, 5% = 12, total = 36.", difficulty: "medium", topic: "Number Sense" },
  ],
  fractionForest: [
    { q: "The forest spirits ask: What is 2/5 + 1/3?", type: "choice", options: ["3/8", "11/15", "3/15", "7/15"], answer: "11/15", hint: "Find a common denominator for 5 and 3. The LCD is 15.", explain: "2/5 = 6/15 and 1/3 = 5/15. So 6/15 + 5/15 = 11/15.", difficulty: "easy", topic: "Fractions" },
    { q: "A Celtic druid has 3/4 of a potion. She uses 1/6 of it. How much is left?", type: "choice", options: ["2/4", "7/12", "1/2", "5/8"], answer: "7/12", hint: "Find a common denominator for 4 and 6, which is 12.", explain: "3/4 = 9/12, and 1/6 = 2/12. So 9/12 − 2/12 = 7/12 of the potion remains.", difficulty: "medium", topic: "Fractions" },
    { q: "What is 4 × 2/3?", type: "choice", options: ["8/3", "6/3", "8/12", "2/12"], answer: "8/3", hint: "Multiply the whole number by the numerator: 4 × 2 = 8. Keep the denominator.", explain: "4 × 2/3 = 8/3 (or 2 and 2/3). When multiplying a whole number by a fraction, multiply the numerator.", difficulty: "easy", topic: "Fractions" },
    { q: "The enchanted tree shows: 5.67 + 3.8 = ?", type: "input", answer: "9.47", hint: "Line up the decimal points. Add a zero: 5.67 + 3.80", explain: "5.67 + 3.80 = 9.47. Aligning decimal points helps avoid errors.", difficulty: "easy", topic: "Decimals" },
    { q: "A forest path is 12.5 km. You've walked 7.83 km. How far is left?", type: "input", answer: "4.67", hint: "Subtract: 12.50 − 7.83. Borrow from the ones place when needed.", explain: "12.50 − 7.83 = 4.67 km remaining.", difficulty: "medium", topic: "Decimals" },
    { q: "What is 6 ÷ 3/4?", type: "choice", options: ["4.5", "8", "2", "18/4"], answer: "8", hint: "Dividing by a fraction means multiplying by its reciprocal. Flip 3/4 to 4/3.", explain: "6 ÷ 3/4 = 6 × 4/3 = 24/3 = 8. 'Keep, change, flip' is the method.", difficulty: "hard", topic: "Fractions" },
  ],
  asgard: [
    { q: "The rune master tests you: Which sentence uses a relative pronoun correctly?", type: "choice", options: ["The warrior which fought bravely won.", "The warrior who fought bravely won.", "The warrior whom fought bravely won.", "The warrior whose fought bravely won."], answer: "The warrior who fought bravely won.", hint: "'Who' is used for the subject of a clause (the person doing the action).", explain: "'Who' is the correct relative pronoun for a subject. 'Which' is for things, 'whom' for objects, 'whose' for possession.", difficulty: "easy", topic: "Grammar" },
    { q: "Identify the literary device: 'I've told you a million times to clean your room.'", type: "choice", options: ["Metaphor", "Idiom", "Hyperbole", "Simile"], answer: "Hyperbole", hint: "Is this statement literally true, or is it an extreme exaggeration?", explain: "Hyperbole is an extreme exaggeration used for emphasis. No one has literally said something a million times.", difficulty: "easy", topic: "Literary Devices" },
    { q: "Which word best completes: 'The thunder _____ across the valley.'", type: "choice", options: ["echoed", "echo", "echoing", "echos"], answer: "echoed", hint: "The sentence is in past tense — look for the past tense form.", explain: "'Echoed' is the correct past tense form of 'echo.'", difficulty: "easy", topic: "Grammar" },
    { q: "Odin asks: What is the main purpose of a persuasive essay?", type: "choice", options: ["To tell a story", "To explain how to do something", "To convince the reader of a viewpoint", "To describe a person or place"], answer: "To convince the reader of a viewpoint", hint: "Persuade means to make someone believe or do something.", explain: "Persuasive writing aims to convince the reader using arguments, evidence, and sometimes emotional appeal.", difficulty: "easy", topic: "Writing" },
    { q: "What does the idiom 'break the ice' mean?", type: "choice", options: ["To literally break frozen water", "To start a conversation in an awkward situation", "To fail at something important", "To cool down when angry"], answer: "To start a conversation in an awkward situation", hint: "Think about what 'ice' represents in social situations — stiffness, awkwardness.", explain: "Idioms have figurative meanings different from their literal words. 'Break the ice' means to make people feel more comfortable.", difficulty: "medium", topic: "Literary Devices" },
    { q: "In 'Running through the forest, the wolf howled,' who is running?", type: "choice", options: ["The forest", "The wolf", "It's unclear — dangling modifier", "The narrator"], answer: "The wolf", hint: "A participial phrase at the start of a sentence modifies the subject that follows.", explain: "The phrase 'Running through the forest' modifies 'the wolf' — the subject of the main clause.", difficulty: "hard", topic: "Grammar" },
  ],
  catacombs: [
    { q: "Comment dit-on 'hello' en français?", type: "choice", options: ["Merci", "Bonjour", "Au revoir", "S'il vous plaît"], answer: "Bonjour", hint: "This is one of the most common French greetings.", explain: "Bonjour = Hello/Good day. Merci = Thank you. Au revoir = Goodbye. S'il vous plaît = Please.", difficulty: "easy", topic: "Vocabulary" },
    { q: "Translate to English: 'Je joue au volleyball avec mes amies.'", type: "choice", options: ["I play volleyball with my friends.", "I watch volleyball with my family.", "I like volleyball and my friends.", "I played volleyball yesterday."], answer: "I play volleyball with my friends.", hint: "'Jouer' = to play. 'Avec' = with. 'Amies' = friends (female).", explain: "Je = I, joue = play, au volleyball = volleyball, avec = with, mes amies = my friends (female).", difficulty: "easy", topic: "Reading" },
    { q: "Fill in the blank: 'Elle _____ une pomme.' (She eats an apple.)", type: "choice", options: ["mange", "manges", "mangent", "manger"], answer: "mange", hint: "For 'elle' (she), use the third person singular form of 'manger'.", explain: "'Mange' is correct for elle/il. Conjugation: je mange, tu manges, il/elle mange, nous mangeons, vous mangez, ils/elles mangent.", difficulty: "easy", topic: "Grammar" },
    { q: "How do you say 'What is your name?' in French?", type: "choice", options: ["Quel âge as-tu?", "Comment t'appelles-tu?", "Où habites-tu?", "Comment vas-tu?"], answer: "Comment t'appelles-tu?", hint: "'Comment' means 'how' or 'what.' 'T'appeler' relates to calling/naming.", explain: "Comment t'appelles-tu? = What is your name? (literally: How do you call yourself?)", difficulty: "easy", topic: "Speaking" },
    { q: "Translate to French: 'The weather is cold today.'", type: "choice", options: ["Il fait chaud aujourd'hui.", "Il fait froid aujourd'hui.", "Il pleut aujourd'hui.", "Il neige aujourd'hui."], answer: "Il fait froid aujourd'hui.", hint: "'Froid' = cold. 'Il fait' is used for weather expressions in French.", explain: "Il fait froid = It is cold. French uses 'il fait + adjective' for weather. Chaud = hot, Il pleut = it rains, Il neige = it snows.", difficulty: "medium", topic: "Vocabulary" },
    { q: "Which correctly uses 'avoir' (to have)? 'Nous _____ deux chats.'", type: "choice", options: ["avons", "avez", "ont", "as"], answer: "avons", hint: "'Nous' (we) takes 'avons.' Think: j'ai, tu as, il a, nous avons…", explain: "Avoir: j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont. 'Nous avons' = We have.", difficulty: "medium", topic: "Grammar" },
  ],
  atlantis: [
    { q: "Which of these is NOT one of the four forces of flight?", type: "choice", options: ["Lift", "Drag", "Momentum", "Thrust"], answer: "Momentum", hint: "The four forces are: lift, drag, thrust, and… gravity.", explain: "The four forces of flight are Lift, Drag, Thrust, and Gravity. Momentum is not one of them.", difficulty: "easy", topic: "Flight" },
    { q: "In a series circuit, if one light bulb burns out, what happens?", type: "choice", options: ["Other bulbs get brighter", "Nothing changes", "All bulbs go out", "Only nearby bulbs go out"], answer: "All bulbs go out", hint: "In a series circuit, there's only one path for electricity to flow.", explain: "In a series circuit, components are in a single loop. If one breaks, the circuit is broken and all stop.", difficulty: "easy", topic: "Electricity" },
    { q: "Which planet in our solar system is famous for its rings?", type: "choice", options: ["Jupiter", "Neptune", "Saturn", "Uranus"], answer: "Saturn", hint: "While several planets have rings, this one's are the most famous and visible.", explain: "Saturn is famous for its prominent ring system made of ice and rock particles.", difficulty: "easy", topic: "Space" },
    { q: "What scientific principle explains why airplane wings create lift?", type: "choice", options: ["Newton's Third Law only", "Bernoulli's Principle", "Conservation of Energy", "Archimedes' Principle"], answer: "Bernoulli's Principle", hint: "This principle is about the relationship between air speed and pressure.", explain: "Bernoulli's Principle: faster-moving air has lower pressure. Wings are shaped so air moves faster over the top, creating lift.", difficulty: "medium", topic: "Flight" },
    { q: "An ecosystem with many different species has high ___.", type: "choice", options: ["Population", "Biodiversity", "Habitat", "Competition"], answer: "Biodiversity", hint: "'Bio' = life, 'diversity' = variety.", explain: "Biodiversity means the variety of life in an ecosystem. Higher biodiversity usually means a healthier ecosystem.", difficulty: "easy", topic: "Biodiversity" },
    { q: "What is the difference between a conductor and an insulator?", type: "choice", options: ["Conductors are always metal; insulators always plastic", "Conductors allow electricity to flow; insulators block it", "Conductors are hot; insulators are cold", "There is no difference"], answer: "Conductors allow electricity to flow; insulators block it", hint: "Think about what copper wire does vs. rubber coating around it.", explain: "Conductors (like metals) allow current to flow easily. Insulators (rubber, plastic, wood) resist electricity.", difficulty: "easy", topic: "Electricity" },
  ],
  sphinx: [
    { q: "The Sphinx asks: What are the three levels of government in Canada?", type: "choice", options: ["Federal, Provincial, Municipal", "Federal, State, Local", "National, Regional, District", "Parliament, Senate, Court"], answer: "Federal, Provincial, Municipal", hint: "Canada uses provinces, not states. The local level governs cities and towns.", explain: "Canada's three levels: Federal (national — Ottawa), Provincial/Territorial, and Municipal (cities/towns).", difficulty: "easy", topic: "Government" },
    { q: "Which Indigenous peoples formed alliances with the French in New France?", type: "choice", options: ["Inuit", "Haudenosaunee (Iroquois)", "Wendat (Huron) and Algonquin", "Métis"], answer: "Wendat (Huron) and Algonquin", hint: "These nations were key fur trade partners with the French.", explain: "The Wendat and Algonquin formed important alliances with the French. The Haudenosaunee often allied with the British.", difficulty: "medium", topic: "Heritage" },
    { q: "What was the main economic activity in New France?", type: "choice", options: ["Gold mining", "Fur trade", "Farming wheat", "Fishing only"], answer: "Fur trade", hint: "Beaver pelts were extremely valuable in Europe for making hats.", explain: "The fur trade, especially beaver pelts, was the economic foundation of New France.", difficulty: "easy", topic: "Heritage" },
    { q: "In a democracy, how do citizens choose their leaders?", type: "choice", options: ["Leaders inherit positions", "Through elections and voting", "The military decides", "Random selection"], answer: "Through elections and voting", hint: "In Canada, citizens aged 18+ can participate in this process.", explain: "In a democracy, citizens vote in elections to choose representatives. Canada is a parliamentary democracy.", difficulty: "easy", topic: "Government" },
    { q: "What responsibility does the municipal level of government have?", type: "choice", options: ["Military and defense", "Local roads, garbage, libraries", "International trade", "Healthcare and hospitals"], answer: "Local roads, garbage, libraries", hint: "Think about services that affect your neighbourhood directly.", explain: "Municipal: local roads, water, garbage, parks, libraries. Provincial: health, education. Federal: military, trade.", difficulty: "medium", topic: "Government" },
  ],
  oracle: [
    { q: "A pack of 8 granola bars for $6.40, or 12 bars for $8.40. Which has the better unit price?", type: "choice", options: ["8-pack ($0.80 each)", "12-pack ($0.70 each)", "They're the same", "Need more info"], answer: "12-pack ($0.70 each)", hint: "Divide the total price by the number of items.", explain: "8-pack: $6.40 ÷ 8 = $0.80. 12-pack: $8.40 ÷ 12 = $0.70. The 12-pack wins.", difficulty: "easy", topic: "Unit Pricing" },
    { q: "You have $50. You spend $12 on lunch, $8 on a book, $15 on a gift. How much is left?", type: "input", answer: "15", hint: "Add all spending first, then subtract from $50.", explain: "$12 + $8 + $15 = $35 spent. $50 − $35 = $15 remaining.", difficulty: "easy", topic: "Budgeting" },
    { q: "Which of these is a NEED, not a want?", type: "choice", options: ["A new video game", "Winter boots", "Movie tickets", "A glitter phone case"], answer: "Winter boots", hint: "A need is essential for health, safety, or survival.", explain: "Needs: food, shelter, clothing, healthcare. Wants: things we'd like but can live without.", difficulty: "easy", topic: "Needs vs Wants" },
    { q: "If you save $25 per week, how many weeks until you can buy something that costs $175?", type: "input", answer: "7", hint: "Divide the goal amount by weekly savings.", explain: "$175 ÷ $25 = 7 weeks. Setting a savings goal and dividing by regular savings gives you the timeline.", difficulty: "medium", topic: "Budgeting" },
  ],
  elysium: [
    { q: "According to Canada's Food Guide, which should fill the largest part of your plate?", type: "choice", options: ["Protein foods", "Whole grains", "Fruits and vegetables", "Dairy"], answer: "Fruits and vegetables", hint: "The Food Guide recommends filling half your plate with these.", explain: "Fruits and vegetables = half the plate. Whole grains + protein = the other half.", difficulty: "easy", topic: "Nutrition" },
    { q: "What is a healthy way to manage stress?", type: "choice", options: ["Avoid talking about it", "Physical activity or deep breathing", "Stay up late on screens", "Skip meals to save time"], answer: "Physical activity or deep breathing", hint: "Healthy coping involves moving your body or calming your mind.", explain: "Exercise releases endorphins. Deep breathing activates relaxation. Both are evidence-based strategies.", difficulty: "easy", topic: "Mental Health" },
    { q: "What are the three primary colours in art?", type: "choice", options: ["Red, green, blue", "Red, yellow, blue", "Orange, green, purple", "Pink, yellow, cyan"], answer: "Red, yellow, blue", hint: "These can't be made by mixing other colours.", explain: "Primary: red, yellow, blue. They mix to create secondary colours: orange, green, purple.", difficulty: "easy", topic: "Visual Arts" },
    { q: "In music, how many beats does a whole note get?", type: "choice", options: ["1 beat", "2 beats", "3 beats", "4 beats"], answer: "4 beats", hint: "A half note gets 2 beats. A whole note is double that.", explain: "Whole = 4 beats, half = 2, quarter = 1, eighth = 1/2.", difficulty: "easy", topic: "Music" },
    { q: "Which could signal someone is struggling with mental health?", type: "choice", options: ["They smile sometimes", "They withdraw from friends and activities", "They eat lunch at school", "They do homework"], answer: "They withdraw from friends and activities", hint: "Big changes in behaviour can be a signal.", explain: "Withdrawal from friends and favourite activities can signal struggles. Check in and talk to a trusted adult.", difficulty: "medium", topic: "Mental Health" },
  ],
};

// ========== RANK SYSTEM ==========
const RANKS = [
  { name: "Novice Explorer",    minXP: 0,    icon: "🗺️" },
  { name: "Apprentice Seeker",  minXP: 200,  icon: "⚡" },
  { name: "Realm Seeker",       minXP: 500,  icon: "🔱" },
  { name: "Guardian",           minXP: 1200, icon: "🛡️" },
  { name: "Mythic Explorer",    minXP: 2500, icon: "👑" },
];

const DEFAULT_REWARDS = {
  inApp: [
    { id: "pet_phoenix",  name: "Phoenix Companion",       cost: 150, type: "cosmetic", owned: false, desc: "A fiery phoenix follows you on quests" },
    { id: "pet_wolf",     name: "Fenrir Wolf Pup",         cost: 200, type: "cosmetic", owned: false, desc: "A Norse wolf companion" },
    { id: "banner_gold",  name: "Golden Realm Banner",     cost: 100, type: "cosmetic", owned: false, desc: "A shimmering banner for your profile" },
    { id: "title_legend", name: "Title: Legend of Olympus", cost: 300, type: "cosmetic", owned: false, desc: "A legendary title for your explorer name" },
    { id: "avatar_armor", name: "Celestial Armor Set",     cost: 400, type: "cosmetic", owned: false, desc: "Mythic armor for your avatar" },
  ],
  realWorld: [
    { id: "bronze", name: "Pick a snack at the store",       cost: 200,  tier: "Bronze", claimed: false },
    { id: "silver", name: "Choose Friday's movie",           cost: 500,  tier: "Silver", claimed: false },
    { id: "gold",   name: "$10 toward something you want",   cost: 1000, tier: "Gold",   claimed: false },
    { id: "mythic", name: "Special experience outing",       cost: 2500, tier: "Mythic", claimed: false },
  ],
};

const NUDGES = [
  "The Oracle senses {realm} calling to you…",
  "Ancient whispers from {realm} grow louder.",
  "A new mystery stirs in {realm}. Investigate?",
  "The guardians of {realm} await a worthy Explorer.",
  "{realm} holds secrets you haven't uncovered yet.",
];

// ========== STORAGE (Firebase Firestore — syncs across devices) ==========
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const FIRESTORE_DOC = doc(db, "appData", "realmquest");
const LOCAL_KEY = "realmquest_data_v1"; // local cache for fast load

function loadLocal() {
  try { const r = localStorage.getItem(LOCAL_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveLocal(data) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch {}
}
async function saveToCloud(data) {
  try {
    // Strip currentUser before saving — each device tracks its own login
    const toSave = { ...data, currentUser: undefined };
    delete toSave.currentUser;
    await setDoc(FIRESTORE_DOC, toSave);
  } catch (e) { console.error("Cloud save failed:", e); }
}

function freshData() {
  return {
    currentUser: null,
    parent: { pin: "1234", alerts: { inactiveDays: 3, lowAccuracy: 60 } },
    children: [{
      id: "cece", name: "Cece", grade: 6,
      drachmas: 0, totalXP: 0,
      streak: { current: 0, longest: 0, lastActiveDate: null },
      realmProgress: Object.fromEntries(
        Object.keys(REALMS).map(k => [k, { questsCompleted: 0, correct: 0, total: 0, visited: false }])
      ),
      history: [],
      rewards: {
        inApp: DEFAULT_REWARDS.inApp.map(r => ({ ...r })),
        realWorld: DEFAULT_REWARDS.realWorld.map(r => ({ ...r })),
        pendingClaims: [],
      },
    }],
  };
}

// ========== HELPERS ==========
function getWeakest(child) {
  let weakest = null, low = 101;
  Object.entries(child.realmProgress).forEach(([k, p]) => {
    if (p.total > 0) {
      const pct = (p.correct / p.total) * 100;
      if (pct < low) { low = pct; weakest = k; }
    } else if (low > 100) { weakest = k; low = -1; }
  });
  return weakest;
}

function getRank(xp) { return [...RANKS].reverse().find(r => xp >= r.minXP) || RANKS[0]; }
function getNextRank(xp) { const r = getRank(xp); return RANKS[RANKS.indexOf(r) + 1] || null; }
function todayStr() { return new Date().toISOString().split("T")[0]; }

const tierColor = { Bronze: "#cd7f32", Silver: "#c0c0c0", Gold: "#d4a843", Mythic: "#8e44ad" };

// ========== MAIN APP ==========
export default function App() {
  const [data, setData] = useState(() => loadLocal() || freshData());
  const [screen, setScreen] = useState("login");
  const [activeRealm, setActiveRealm] = useState(null);
  const [questState, setQuestState] = useState(null);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);
  const isLocalUpdate = useRef(false);

  // Real-time listener — syncs from cloud to all devices
  useEffect(() => {
    const unsub = onSnapshot(FIRESTORE_DOC, (snap) => {
      if (snap.exists() && !isLocalUpdate.current) {
        const cloud = snap.data();
        setData(prev => ({ ...cloud, currentUser: prev.currentUser }));
        saveLocal({ ...cloud });
      }
      isLocalUpdate.current = false;
      setLoading(false);
    }, () => { setLoading(false); });
    return () => unsub();
  }, []);

  // Debounced save to cloud on every data change
  useEffect(() => {
    saveLocal(data);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      isLocalUpdate.current = true;
      saveToCloud(data);
    }, 500);
  }, [data]);

  const child = data.children[0];
  const isParent = data.currentUser === "parent";

  const updateChild = useCallback((fn) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      fn(next.children[0]);
      return next;
    });
  }, []);

  const nav = useCallback((s, realm) => {
    setScreen(s);
    if (realm !== undefined) setActiveRealm(realm);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "#0a0e1a", minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", overflowX: "hidden" }}>
      <style>{globalCSS}</style>

      {screen === "login"         && <LoginScreen data={data} setData={setData} nav={nav} />}
      {screen === "home"          && <ExplorerHome child={child} nav={nav} />}
      {screen === "realmMap"      && <RealmMapScreen child={child} nav={nav} />}
      {screen === "quest"         && <QuestScreen realm={activeRealm} child={child} updateChild={updateChild} nav={nav} questState={questState} setQuestState={setQuestState} />}
      {screen === "questComplete" && <QuestComplete qs={questState} nav={nav} />}
      {screen === "profile"       && <ExplorerProfile child={child} nav={nav} />}
      {screen === "bazaar"        && <BazaarStore child={child} updateChild={updateChild} nav={nav} isParent={isParent} />}
      {screen === "parentDash"    && <ParentDash child={child} data={data} setData={setData} nav={nav} />}

      {!isParent && !["login", "quest", "questComplete"].includes(screen) && (
        <BottomNav screen={screen} nav={nav} />
      )}
    </div>
  );
}

// ========== LOGIN ==========
function LoginScreen({ data, setData, nav }) {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "linear-gradient(180deg,#0a0e1a,#141830,#0a0e1a)" }}>
      <div className="anim-in" style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }} className="float">⚡</div>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 32, fontWeight: 900, marginBottom: 4 }} className="shimmer-text">RealmQuest</h1>
        <p style={{ color: "#8a8070", fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Explore · Learn · Conquer</p>
      </div>

      <div className="anim-in" style={{ width: "100%", maxWidth: 320, animationDelay: "0.2s" }}>
        <button onClick={() => { setData(p => ({ ...p, currentUser: "cece" })); nav("home"); }}
          style={{ width: "100%", padding: "18px 24px", borderRadius: 16, border: "2px solid #d4a843", background: "linear-gradient(135deg,#1a1a0a,#2a2a1a)", color: "#f5e6a3", fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 700, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Compass size={22} /> Cece's Adventure
        </button>

        {!showPin ? (
          <button onClick={() => setShowPin(true)}
            style={{ width: "100%", padding: "14px 24px", borderRadius: 16, border: "1px solid #333", background: "transparent", color: "#8a8070", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Lock size={16} /> Parent Dashboard
          </button>
        ) : (
          <div style={{ background: "#141830", borderRadius: 16, padding: 20, border: "1px solid #222" }}>
            <p style={{ fontSize: 13, color: "#8a8070", marginBottom: 12 }}>Enter parent PIN:</p>
            <input type="password" maxLength={4} value={pin}
              onChange={e => { setPin(e.target.value); setErr(""); }}
              placeholder="• • • •"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #333", background: "#0a0e1a", color: "#e8e0d4", fontSize: 24, textAlign: "center", letterSpacing: 12 }} />
            {err && <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 8 }}>{err}</p>}
            <button onClick={() => pin === data.parent.pin ? (setData(p => ({ ...p, currentUser: "parent" })), nav("parentDash")) : setErr("Incorrect PIN.")}
              style={{ width: "100%", marginTop: 12, padding: 12, borderRadius: 10, border: "none", background: "#333", color: "#e8e0d4", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>Enter</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ========== EXPLORER HOME ==========
function ExplorerHome({ child, nav }) {
  const rank = getRank(child.totalXP);
  const next = getNextRank(child.totalXP);
  const w = getWeakest(child);
  const nudge = NUDGES[Math.floor(Date.now() / 86400000) % NUDGES.length].replace("{realm}", w ? REALMS[w].name : "the realms");

  return (
    <div style={{ padding: "20px 16px 100px", background: "linear-gradient(180deg,#0a0e1a,#101428)" }}>
      {/* Header */}
      <div className="anim-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <p style={{ color: "#8a8070", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5 }}>Welcome back</p>
          <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 26, fontWeight: 700, color: "#e8e0d4" }}>Cece</h1>
        </div>
        <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>{rank.icon}</span>
          <span style={{ fontFamily: "'Cinzel',serif", fontSize: 13, color: "#d4a843" }}>{rank.name}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="anim-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24, animationDelay: "0.1s" }}>
        <Stat icon={<Flame size={18} color="#e67e22" />} label="Streak" val={`${child.streak.current}d`} />
        <Stat icon="🏛️" label="Drachmas" val={child.drachmas} />
        <Stat icon={<TrendingUp size={18} color="#2ecc71" />} label="XP" val={child.totalXP} />
      </div>

      {/* Daily Quest */}
      <div className="anim-in" style={{ animationDelay: "0.2s", background: "linear-gradient(135deg,#1a1830,#242040)", borderRadius: 20, padding: 20, marginBottom: 20, border: "1px solid rgba(212,168,67,0.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,168,67,0.1),transparent 70%)" }} />
        <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: "#d4a843", marginBottom: 8, fontWeight: 700 }}>Daily Quest</p>
        <p style={{ fontSize: 14, color: "#c0b8a8", marginBottom: 16, lineHeight: 1.5, fontStyle: "italic" }}>{nudge}</p>
        <button onClick={() => nav("realmMap")} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#d4a843,#b8922a)", color: "#0a0e1a", fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Compass size={20} /> Begin Quest
        </button>
      </div>

      {/* Realm Powers (top 4) */}
      <p className="anim-in" style={{ animationDelay: "0.3s", fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: "#8a8070", marginBottom: 12, fontWeight: 700 }}>Realm Powers</p>
      <div className="anim-in" style={{ animationDelay: "0.3s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {Object.entries(REALMS).slice(0, 4).map(([k, r]) => {
          const p = child.realmProgress[k], pct = p.total ? Math.round(p.correct / p.total * 100) : 0;
          return (
            <div key={k} onClick={() => nav("quest", k)} style={{ background: r.colors.bg, borderRadius: 14, padding: 14, cursor: "pointer", border: `1px solid ${r.colors.primary}22`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 8, right: 10, fontSize: 10, color: r.colors.primary, fontWeight: 700 }}>{pct}%</div>
              <r.icon size={20} color={r.colors.primary} style={{ marginBottom: 6 }} />
              <p style={{ fontSize: 12, fontWeight: 700, color: "#e8e0d4", marginBottom: 2 }}>{r.name.split(" ")[0]}</p>
              <p style={{ fontSize: 10, color: "#8a8070" }}>{r.subject.split("—")[0]}</p>
              <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: "#1a1a2a" }}>
                <div style={{ height: "100%", borderRadius: 2, background: r.colors.primary, width: `${pct}%`, transition: "width 0.5s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rank Progress */}
      {next && (
        <div className="anim-in" style={{ animationDelay: "0.4s", background: "#141830", borderRadius: 16, padding: 16, border: "1px solid #222" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
            <span style={{ color: "#8a8070" }}>Rank Progress</span>
            <span style={{ color: "#d4a843" }}>{child.totalXP} / {next.minXP} XP</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "#1a1a2a" }}>
            <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#d4a843,#f5e6a3)", width: `${Math.min(100, child.totalXP / next.minXP * 100)}%` }} />
          </div>
          <p style={{ fontSize: 11, color: "#8a8070", marginTop: 6 }}>Next: {next.icon} {next.name}</p>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, val }) {
  return (
    <div style={{ background: "#141830", borderRadius: 14, padding: "14px 10px", textAlign: "center", border: "1px solid #1a1a30" }}>
      <div style={{ marginBottom: 4, fontSize: typeof icon === "string" ? 18 : undefined }}>{icon}</div>
      <p style={{ fontSize: 18, fontWeight: 800, color: "#e8e0d4" }}>{val}</p>
      <p style={{ fontSize: 10, color: "#8a8070", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
    </div>
  );
}

// ========== REALM MAP ==========
function RealmMapScreen({ child, nav }) {
  return (
    <div style={{ padding: "20px 16px 100px", background: "linear-gradient(180deg,#0a0e1a,#0e1222)" }}>
      <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 22, color: "#d4a843", marginBottom: 4 }}>Realm Map</h2>
      <p style={{ fontSize: 13, color: "#8a8070", marginBottom: 20 }}>Choose your next quest, Explorer.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.entries(REALMS).map(([k, r], i) => {
          const p = child.realmProgress[k], pct = p.total ? Math.round(p.correct / p.total * 100) : 0;
          return (
            <div key={k} className="anim-in" onClick={() => nav("quest", k)}
              style={{ animationDelay: `${i * 0.06}s`, background: r.colors.bg, borderRadius: 18, padding: "16px 18px", cursor: "pointer", border: `1px solid ${r.colors.primary}33`, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${r.colors.primary}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <r.icon size={24} color={r.colors.primary} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 700, color: "#e8e0d4", marginBottom: 2 }}>{r.name}</p>
                <p style={{ fontSize: 11, color: "#8a8070" }}>{r.subject}</p>
                <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: "#0a0a1a" }}>
                    <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg,${r.colors.primary},${r.colors.accent})`, width: `${pct}%`, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: r.colors.primary, fontWeight: 700 }}>{pct}%</span>
                </div>
              </div>
              <ChevronRight size={18} color="#555" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========== QUEST ENGINE ==========
function QuestScreen({ realm, child, updateChild, nav, questState, setQuestState }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [inp, setInp] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [hint, setHint] = useState(false);
  const [results, setResults] = useState([]);
  const t0 = useRef(Date.now());

  const rc = REALMS[realm];
  const qs = (QUESTIONS[realm] || []).slice(0, 5);
  const q = qs[idx];
  if (!q) return null;

  const correct = q.type === "input"
    ? inp.trim().replace(/,/g, "") === q.answer.replace(/,/g, "")
    : sel === q.answer;

  const submit = () => {
    if (q.type === "input" && !inp.trim()) return;
    if (q.type === "choice" && !sel) return;
    setRevealed(true);
    setResults(p => [...p, { correct, question: q.q, topic: q.topic }]);
  };

  const next = () => {
    setSel(null); setInp(""); setRevealed(false); setHint(false);
    if (idx + 1 >= qs.length) finish([...results]);
    else setIdx(i => i + 1);
  };

  const skip = () => {
    const r = [...results, { correct: false, question: q.q, topic: q.topic, skipped: true }];
    setResults(r);
    setSel(null); setInp(""); setRevealed(false); setHint(false);
    if (idx + 1 >= qs.length) finish(r);
    else setIdx(i => i + 1);
  };

  const finish = (finalResults) => {
    const c = finalResults.filter(r => r.correct).length;
    const t = qs.length;
    const acc = Math.round(c / t * 100);
    const base = acc >= 80 ? 20 : acc >= 60 ? 15 : 10;
    const bonus = acc === 100 ? 15 : 0;
    const earned = base + bonus;
    const elapsed = Math.round((Date.now() - t0.current) / 1000);
    const today = todayStr();

    const state = { realm, correct: c, total: t, accuracy: acc, drachmasEarned: earned, timeSeconds: elapsed, results: finalResults };
    setQuestState(state);

    updateChild(ch => {
      ch.drachmas += earned;
      ch.totalXP += earned + c * 5;
      ch.realmProgress[realm].questsCompleted += 1;
      ch.realmProgress[realm].correct += c;
      ch.realmProgress[realm].total += t;
      if (!ch.realmProgress[realm].visited) { ch.drachmas += 30; ch.realmProgress[realm].visited = true; }
      const last = ch.streak.lastActiveDate;
      if (last !== today) {
        const y = new Date(); y.setDate(y.getDate() - 1);
        if (last === y.toISOString().split("T")[0]) ch.streak.current += 1;
        else if (!last) ch.streak.current = 1;
        else ch.streak.current = Math.max(1, ch.streak.current);
        ch.streak.lastActiveDate = today;
        ch.streak.longest = Math.max(ch.streak.longest, ch.streak.current);
      }
      ch.history.push({ date: today, realm, accuracy: acc, time: elapsed, drachmas: earned });
    });
    nav("questComplete");
  };

  return (
    <div style={{ minHeight: "100vh", background: rc.colors.bg, paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ padding: "16px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => nav("realmMap")} style={{ background: "none", border: "none", color: "#8a8070", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <ArrowLeft size={18} /> Leave Quest
        </button>
        <span style={{ fontFamily: "'Cinzel',serif", fontSize: 13, color: rc.colors.primary }}>{idx + 1} / {qs.length}</span>
      </div>

      {/* Progress */}
      <div style={{ padding: "0 16px", marginBottom: 20 }}>
        <div style={{ height: 4, borderRadius: 2, background: "#0a0a0a" }}>
          <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg,${rc.colors.primary},${rc.colors.accent})`, width: `${((idx + (revealed ? 1 : 0)) / qs.length) * 100}%`, transition: "width 0.4s" }} />
        </div>
      </div>

      {/* Badge */}
      <div style={{ padding: "0 16px", marginBottom: 16 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: `${rc.colors.primary}15`, border: `1px solid ${rc.colors.primary}30` }}>
          <rc.icon size={14} color={rc.colors.primary} />
          <span style={{ fontSize: 11, color: rc.colors.primary, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{rc.name}</span>
        </div>
      </div>

      {/* Question */}
      <div className="anim-scale" key={idx} style={{ padding: "0 16px", marginBottom: 24 }}>
        <p style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: "#e8e0d4", lineHeight: 1.6, marginBottom: 4 }}>{q.q}</p>
        <span style={{ fontSize: 11, color: "#8a8070" }}>{q.topic} · {q.difficulty}</span>
      </div>

      {/* Answers */}
      <div style={{ padding: "0 16px" }}>
        {q.type === "choice" && q.options.map((o, i) => {
          const picked = sel === o;
          const isAns = revealed && o === q.answer;
          const isWrong = revealed && picked && !correct;
          let bg = "#141830", bdr = "#222";
          if (picked && !revealed) { bg = `${rc.colors.primary}22`; bdr = rc.colors.primary; }
          if (isAns)  { bg = "#1a3a2a"; bdr = "#2ecc71"; }
          if (isWrong) { bg = "#3a1a1a"; bdr = "#e74c3c"; }
          return (
            <button key={i} onClick={() => !revealed && setSel(o)} disabled={revealed}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: `2px solid ${bdr}`, background: bg, color: "#e8e0d4", fontSize: 14, textAlign: "left", cursor: revealed ? "default" : "pointer", marginBottom: 10, display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s" }}>
              {isAns && <Check size={18} color="#2ecc71" />}
              {isWrong && <X size={18} color="#e74c3c" />}
              <span>{o}</span>
            </button>
          );
        })}

        {q.type === "input" && (
          <>
            <input type="text" value={inp} onChange={e => setInp(e.target.value)} disabled={revealed}
              placeholder="Your answer…" onKeyDown={e => e.key === "Enter" && !revealed && submit()}
              style={{ width: "100%", padding: "16px 18px", borderRadius: 14, border: `2px solid ${revealed ? (correct ? "#2ecc71" : "#e74c3c") : "#333"}`, background: "#141830", color: "#e8e0d4", fontSize: 18 }} />
            {revealed && !correct && <p style={{ fontSize: 13, color: "#2ecc71", marginTop: 8 }}>Answer: {q.answer}</p>}
          </>
        )}

        {hint && !revealed && (
          <div className="anim-in" style={{ marginTop: 12, padding: 14, borderRadius: 12, background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.2)" }}>
            <p style={{ fontSize: 13, color: "#d4a843", lineHeight: 1.5 }}>💡 {q.hint}</p>
          </div>
        )}

        {revealed && (
          <div className="anim-in" style={{ marginTop: 16, padding: 16, borderRadius: 14, background: correct ? "rgba(46,204,113,0.08)" : "rgba(231,76,60,0.08)", border: `1px solid ${correct ? "#2ecc7133" : "#e74c3c33"}` }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: correct ? "#2ecc71" : "#e8e0d4", marginBottom: 6 }}>
              {correct ? "The realm accepts your answer." : "The realm resists. Here's why:"}
            </p>
            <p style={{ fontSize: 13, color: "#b0a898", lineHeight: 1.6 }}>{q.explain}</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ padding: "20px 16px 0", display: "flex", gap: 10 }}>
        {!revealed ? (
          <>
            <Btn onClick={skip} variant="ghost" style={{ flex: 0 }}><SkipForward size={16} /> Skip</Btn>
            {!hint && <Btn onClick={() => setHint(true)} variant="ghost" style={{ flex: 0, color: "#d4a843" }}><HelpCircle size={16} /> Hint</Btn>}
            <Btn onClick={submit} color={rc.colors.primary} accent={rc.colors.accent} style={{ flex: 1 }}>Submit</Btn>
          </>
        ) : (
          <Btn onClick={next} gold style={{ flex: 1 }}>{idx + 1 >= qs.length ? "Complete Quest" : "Next Challenge"}</Btn>
        )}
      </div>
    </div>
  );
}

// ========== QUEST COMPLETE ==========
function QuestComplete({ qs, nav }) {
  if (!qs) return null;
  const r = REALMS[qs.realm];
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a0e1a,#141830)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="anim-scale" style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{qs.accuracy >= 80 ? "⚡" : qs.accuracy >= 50 ? "🔱" : "🗺️"}</div>
        <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 24, color: "#d4a843", marginBottom: 4 }}>Quest Complete</h2>
        <p style={{ color: "#8a8070", fontSize: 14 }}>{r.name}</p>
      </div>
      <div className="anim-in" style={{ width: "100%", maxWidth: 320, animationDelay: "0.2s" }}>
        <div style={{ background: "#141830", borderRadius: 20, padding: 24, border: "1px solid #222", marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: qs.accuracy >= 70 ? "#2ecc71" : "#e67e22" }}>{qs.accuracy}%</p>
              <p style={{ fontSize: 11, color: "#8a8070" }}>Accuracy</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#e8e0d4" }}>{qs.correct}/{qs.total}</p>
              <p style={{ fontSize: 11, color: "#8a8070" }}>Correct</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #222", paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>🏛️</span>
              <div>
                <p style={{ fontSize: 20, fontWeight: 800 }} className="shimmer-text">+{qs.drachmasEarned}</p>
                <p style={{ fontSize: 11, color: "#8a8070" }}>Drachmas earned</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 14, color: "#e8e0d4", fontWeight: 600 }}>{Math.floor(qs.timeSeconds / 60)}:{String(qs.timeSeconds % 60).padStart(2, "0")}</p>
              <p style={{ fontSize: 11, color: "#8a8070" }}>Time</p>
            </div>
          </div>
        </div>

        <div style={{ background: "#141830", borderRadius: 16, padding: 16, border: "1px solid #222", marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: "#8a8070", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Breakdown</p>
          {qs.results.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < qs.results.length - 1 ? "1px solid #1a1a2a" : "none" }}>
              {r.correct ? <Check size={14} color="#2ecc71" /> : r.skipped ? <SkipForward size={14} color="#8a8070" /> : <X size={14} color="#e74c3c" />}
              <span style={{ fontSize: 12, color: "#b0a898", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.question?.substring(0, 40)}…</span>
              <span style={{ fontSize: 10, color: "#8a8070" }}>{r.topic}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => nav("realmMap")} variant="ghost" style={{ flex: 1 }}>Realm Map</Btn>
          <Btn onClick={() => nav("home")} gold style={{ flex: 1 }}>Home</Btn>
        </div>
      </div>
    </div>
  );
}

// ========== PROFILE ==========
function ExplorerProfile({ child, nav }) {
  const rank = getRank(child.totalXP);
  const tq = Object.values(child.realmProgress).reduce((a, b) => a + b.questsCompleted, 0);
  const tc = Object.values(child.realmProgress).reduce((a, b) => a + b.correct, 0);
  const tt = Object.values(child.realmProgress).reduce((a, b) => a + b.total, 0);
  const acc = tt ? Math.round(tc / tt * 100) : 0;
  const radar = Object.entries(REALMS).map(([k, r]) => {
    const p = child.realmProgress[k];
    return { subject: r.name.split(" ")[0], power: p.total ? Math.round(p.correct / p.total * 100) : 0 };
  });

  return (
    <div style={{ padding: "20px 16px 100px", background: "linear-gradient(180deg,#0a0e1a,#101428)" }}>
      <div className="anim-in" style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#d4a843,#b8922a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 36 }}>{rank.icon}</div>
        <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 24, color: "#e8e0d4" }}>Cece</h2>
        <p style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: "#d4a843" }}>{rank.name}</p>
      </div>

      <div className="anim-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 24, animationDelay: "0.1s" }}>
        {[{ l: "Quests", v: tq }, { l: "Accuracy", v: `${acc}%` }, { l: "Streak", v: child.streak.current }, { l: "Best", v: child.streak.longest }].map((s, i) => (
          <div key={i} style={{ background: "#141830", borderRadius: 12, padding: "12px 8px", textAlign: "center", border: "1px solid #1a1a30" }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#e8e0d4" }}>{s.v}</p>
            <p style={{ fontSize: 9, color: "#8a8070", textTransform: "uppercase" }}>{s.l}</p>
          </div>
        ))}
      </div>

      <div className="anim-in" style={{ animationDelay: "0.2s", background: "#141830", borderRadius: 18, padding: 16, border: "1px solid #222", marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: "#8a8070", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Realm Power Map</p>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radar}><PolarGrid stroke="#222" /><PolarAngleAxis dataKey="subject" tick={{ fill: "#8a8070", fontSize: 10 }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} /><Radar dataKey="power" stroke="#d4a843" fill="#d4a843" fillOpacity={0.25} strokeWidth={2} /></RadarChart>
        </ResponsiveContainer>
      </div>

      {Object.entries(REALMS).map(([k, r]) => {
        const p = child.realmProgress[k], pct = p.total ? Math.round(p.correct / p.total * 100) : 0;
        return (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #1a1a30" }}>
            <r.icon size={18} color={r.colors.primary} />
            <div style={{ flex: 1 }}><p style={{ fontSize: 13, fontWeight: 600, color: "#e8e0d4" }}>{r.name}</p><p style={{ fontSize: 11, color: "#8a8070" }}>{p.questsCompleted} quests · {pct}%</p></div>
            <span style={{ fontSize: 13, fontWeight: 700, color: r.colors.primary }}>{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ========== BAZAAR ==========
function BazaarStore({ child, updateChild, nav, isParent }) {
  const [tab, setTab] = useState("inApp");
  const [toast, setToast] = useState(null);
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const buy = (item) => { if (child.drachmas < item.cost || item.owned) return; updateChild(c => { c.drachmas -= item.cost; c.rewards.inApp.find(r => r.id === item.id).owned = true; }); flash(`Acquired: ${item.name}`); };
  const claim = (item) => { if (child.drachmas < item.cost) return; updateChild(c => { c.drachmas -= item.cost; c.rewards.pendingClaims.push({ ...item, claimedAt: new Date().toISOString() }); }); flash(`Claim submitted for parent approval`); };
  const approve = (i) => { updateChild(c => { c.rewards.pendingClaims.splice(i, 1); }); };

  const tabs = [{ id: "inApp", label: "Cosmetics" }, { id: "realWorld", label: "Real Rewards" }, ...(isParent ? [{ id: "claims", label: `Claims (${child.rewards.pendingClaims.length})` }] : [])];

  return (
    <div style={{ padding: "20px 16px 100px", background: "linear-gradient(180deg,#0a0e1a,#101428)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 22, color: "#d4a843" }}>The Bazaar</h2>
          {!isParent && <p style={{ fontSize: 13, color: "#8a8070" }}>🏛️ {child.drachmas} Drachmas</p>}
        </div>
        {isParent && <Btn onClick={() => nav("parentDash")} variant="ghost" style={{ fontSize: 12, padding: "8px 14px" }}>← Dashboard</Btn>}
      </div>

      <div style={{ display: "flex", marginBottom: 20, borderRadius: 12, overflow: "hidden", border: "1px solid #222" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: 12, border: "none", background: tab === t.id ? "#d4a84320" : "#141830", color: tab === t.id ? "#d4a843" : "#8a8070", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>{t.label}</button>
        ))}
      </div>

      {tab === "inApp" && child.rewards.inApp.map(item => (
        <div key={item.id} style={{ background: "#141830", borderRadius: 14, padding: 16, marginBottom: 10, border: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><p style={{ fontSize: 14, fontWeight: 700, color: "#e8e0d4" }}>{item.name}</p><p style={{ fontSize: 11, color: "#8a8070" }}>{item.desc}</p></div>
          {item.owned ? <span style={{ fontSize: 11, color: "#2ecc71", fontWeight: 700, padding: "6px 12px", borderRadius: 8, background: "#2ecc7115" }}>Owned</span>
            : <button onClick={() => buy(item)} disabled={child.drachmas < item.cost} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: child.drachmas >= item.cost ? "linear-gradient(135deg,#d4a843,#b8922a)" : "#222", color: child.drachmas >= item.cost ? "#0a0e1a" : "#555", fontWeight: 700, fontSize: 12, cursor: child.drachmas >= item.cost ? "pointer" : "default" }}>🏛️ {item.cost}</button>}
        </div>
      ))}

      {tab === "realWorld" && child.rewards.realWorld.map(item => (
        <div key={item.id} style={{ background: "#141830", borderRadius: 14, padding: 16, marginBottom: 10, border: `1px solid ${tierColor[item.tier]}33`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: tierColor[item.tier], textTransform: "uppercase", letterSpacing: 1, padding: "2px 8px", borderRadius: 6, background: `${tierColor[item.tier]}15`, display: "inline-block", marginBottom: 4 }}>{item.tier}</span>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#e8e0d4" }}>{item.name}</p>
          </div>
          <button onClick={() => claim(item)} disabled={child.drachmas < item.cost || isParent} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: child.drachmas >= item.cost && !isParent ? "linear-gradient(135deg,#d4a843,#b8922a)" : "#222", color: child.drachmas >= item.cost && !isParent ? "#0a0e1a" : "#555", fontWeight: 700, fontSize: 12, cursor: child.drachmas >= item.cost && !isParent ? "pointer" : "default" }}>🏛️ {item.cost}</button>
        </div>
      ))}

      {tab === "claims" && isParent && (child.rewards.pendingClaims.length === 0
        ? <p style={{ textAlign: "center", padding: 40, color: "#8a8070" }}>No pending claims.</p>
        : child.rewards.pendingClaims.map((c, i) => (
          <div key={i} style={{ background: "#141830", borderRadius: 14, padding: 16, marginBottom: 10, border: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><p style={{ fontSize: 14, fontWeight: 700, color: "#e8e0d4" }}>{c.name}</p><p style={{ fontSize: 11, color: "#8a8070" }}>{c.tier} · {new Date(c.claimedAt).toLocaleDateString()}</p></div>
            <button onClick={() => approve(i)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#2ecc71", color: "#0a0e1a", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Approve</button>
          </div>
        )))}

      {toast && <div className="anim-slide" style={{ position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", background: "#2ecc71", color: "#0a0e1a", padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 13, zIndex: 100, whiteSpace: "nowrap" }}>{toast}</div>}
    </div>
  );
}

// ========== PARENT DASHBOARD ==========
function ParentDash({ child, data, setData, nav }) {
  const [tab, setTab] = useState("overview");
  const tq = Object.values(child.realmProgress).reduce((a, b) => a + b.questsCompleted, 0);
  const tc = Object.values(child.realmProgress).reduce((a, b) => a + b.correct, 0);
  const tt = Object.values(child.realmProgress).reduce((a, b) => a + b.total, 0);
  const acc = tt ? Math.round(tc / tt * 100) : 0;
  const totalTime = child.history.reduce((a, b) => a + (b.time || 0), 0);
  const subjectData = Object.entries(REALMS).map(([k, r]) => {
    const p = child.realmProgress[k];
    return { name: r.name.split(" ")[0], accuracy: p.total ? Math.round(p.correct / p.total * 100) : 0, quests: p.questsCompleted };
  });

  const logout = () => { setData(p => ({ ...p, currentUser: null })); nav("login"); };

  return (
    <div style={{ padding: "20px 16px 40px", background: "#f8f7f4", minHeight: "100vh", color: "#1a1a2a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: 1.5 }}>Parent Dashboard</p>
          <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 22, color: "#1a1a2a" }}>Cece's Progress</h1>
        </div>
        <button onClick={logout} style={{ background: "none", border: "1px solid #ddd", padding: "8px 12px", borderRadius: 8, cursor: "pointer", color: "#888", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><LogOut size={14} /> Exit</button>
      </div>

      <div style={{ display: "flex", marginBottom: 20, borderRadius: 10, overflow: "hidden", border: "1px solid #ddd" }}>
        {["overview", "subjects", "rewards"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: 10, border: "none", background: tab === t ? "#1a1a2a" : "#fff", color: tab === t ? "#fff" : "#888", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { l: "Total Time", v: `${Math.floor(totalTime / 60)}m ${totalTime % 60}s`, icon: <Clock size={18} color="#4a90d9" /> },
              { l: "Sessions", v: tq, icon: <Target size={18} color="#2ecc71" /> },
              { l: "Accuracy", v: `${acc}%`, icon: <TrendingUp size={18} color="#e67e22" /> },
              { l: "Streak", v: `${child.streak.current} days`, icon: <Flame size={18} color="#e74c3c" /> },
            ].map((m, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 16, border: "1px solid #eee" }}>
                <div style={{ marginBottom: 8 }}>{m.icon}</div>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2a" }}>{m.v}</p>
                <p style={{ fontSize: 11, color: "#888" }}>{m.l}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: 16, border: "1px solid #eee", marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Insights</p>
            <p style={{ fontSize: 14, color: "#333", lineHeight: 1.7 }}>
              Cece has completed {tq} quest{tq !== 1 ? "s" : ""} with {acc}% overall accuracy.
              {getWeakest(child) && ` ${REALMS[getWeakest(child)].subject} could use more attention.`}
              {child.streak.current >= 3 ? ` Her ${child.streak.current}-day streak shows solid consistency.` : child.streak.current === 0 ? ` She hasn't started a streak yet.` : ""}
            </p>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: 16, border: "1px solid #eee" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Accuracy by Subject</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#888" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#888" }} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #eee", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="accuracy" fill="#d4a843" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {tab === "subjects" && Object.entries(REALMS).map(([k, r]) => {
        const p = child.realmProgress[k], pct = p.total ? Math.round(p.correct / p.total * 100) : 0;
        return (
          <div key={k} style={{ background: "#fff", borderRadius: 14, padding: 16, marginBottom: 10, border: "1px solid #eee" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div><p style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</p><p style={{ fontSize: 12, color: "#888" }}>{r.subject}</p></div>
              <span style={{ fontSize: 18, fontWeight: 800, color: pct >= 70 ? "#2ecc71" : pct >= 40 ? "#e67e22" : "#e74c3c" }}>{pct}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "#eee" }}>
              <div style={{ height: "100%", borderRadius: 3, background: pct >= 70 ? "#2ecc71" : pct >= 40 ? "#e67e22" : "#e74c3c", width: `${pct}%` }} />
            </div>
            <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>{p.questsCompleted} quests · {p.correct}/{p.total} correct</p>
          </div>
        );
      })}

      {tab === "rewards" && (
        <>
          <div style={{ background: "#fff", borderRadius: 14, padding: 16, border: "1px solid #eee", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Drachma Balance</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#d4a843" }}>{child.drachmas}</p>
          </div>
          <button onClick={() => nav("bazaar")} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "#1a1a2a", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 16 }}>Manage Reward Store →</button>
          {child.rewards.pendingClaims.length > 0 && (
            <div style={{ background: "#fff5e6", borderRadius: 14, padding: 16, border: "1px solid #e67e22" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#e67e22", marginBottom: 8 }}>Pending Claims ({child.rewards.pendingClaims.length})</p>
              {child.rewards.pendingClaims.map((c, i) => <p key={i} style={{ fontSize: 13, color: "#333" }}>• {c.name} ({c.tier})</p>)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ========== BOTTOM NAV ==========
function BottomNav({ screen, nav }) {
  const items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "realmMap", icon: Map, label: "Realms" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "bazaar", icon: ShoppingBag, label: "Bazaar" },
  ];
  return (
    <div className="safe-bottom" style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#0c1020ee", backdropFilter: "blur(10px)", borderTop: "1px solid #1a1a30", display: "flex", padding: "8px 0 0", zIndex: 50 }}>
      {items.map(it => {
        const on = screen === it.id;
        return (
          <button key={it.id} onClick={() => nav(it.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 0" }}>
            <it.icon size={22} color={on ? "#d4a843" : "#555"} strokeWidth={on ? 2.5 : 1.5} />
            <span style={{ fontSize: 10, color: on ? "#d4a843" : "#555", fontWeight: on ? 700 : 400 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ========== SHARED BUTTON ==========
function Btn({ children, onClick, variant, gold, color, accent, style = {}, ...rest }) {
  const base = {
    padding: "14px 16px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    border: "none", fontFamily: gold ? "'Cinzel',serif" : "inherit",
    ...(variant === "ghost" ? { background: "transparent", border: "1px solid #333", color: "#8a8070" }
      : gold ? { background: "linear-gradient(135deg,#d4a843,#b8922a)", color: "#0a0e1a" }
      : color ? { background: `linear-gradient(135deg,${color},${accent || color})`, color: "#0a0e1a" }
      : { background: "#d4a843", color: "#0a0e1a" }),
    ...style,
  };
  return <button onClick={onClick} style={base} {...rest}>{children}</button>;
}
