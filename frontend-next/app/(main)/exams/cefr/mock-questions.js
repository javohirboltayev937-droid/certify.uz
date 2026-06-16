// CEFR Mock Test — 4 bo'lim, 10 ta savol har birida

export const MOCK_SECTIONS = [
  {
    id: 'listening',
    name: 'Listening',
    nameUz: 'Tinglash',
    icon: '🎧',
    color: '#3b82f6',
    border: 'rgba(59,130,246,0.3)',
    bg: 'rgba(59,130,246,0.08)',
    glow: 'rgba(59,130,246,0.25)',
    time: 600,
    desc: 'Audio matnlarni eshitib, savollarga javob bering',
    questions: [
      {
        id:'l1',
        audio:"[Audio]: 'Hello, my name is Tom. I am from London. I am 25 years old and I work as a teacher.'",
        q:"Where is Tom from?", opts:['Paris','London','Berlin','Madrid'], ans:1,
        exp:"'I am from London' deyilgan — Tom Londondan.",
      },
      {
        id:'l2',
        audio:"[Audio]: 'The train to Manchester departs at 14:30 from platform 3. The journey takes approximately 2 hours.'",
        q:"What time does the train depart?", opts:['12:30','13:30','14:30','15:30'], ans:2,
        exp:"'Departs at 14:30' deyilgan.",
      },
      {
        id:'l3',
        audio:"[Audio]: 'We are sorry to announce that the concert scheduled for Saturday has been postponed to the following Sunday due to the weather forecast.'",
        q:"Why was the concert postponed?", opts:['Illness of the performer','Bad weather forecast','Technical issues','Low ticket sales'], ans:1,
        exp:"'Due to the weather forecast' — ob-havo istiqboli sababli.",
      },
      {
        id:'l4',
        audio:"[Audio]: 'Customer: I'd like to return this jacket. It's too small. Can I get a refund? Shop assistant: I'm afraid we can only offer an exchange, not a refund.'",
        q:"What can the customer get?", opts:['A refund','An exchange','A discount','Nothing'], ans:1,
        exp:"'We can only offer an exchange' — faqat almashtirish mumkin.",
      },
      {
        id:'l5',
        audio:"[Audio]: 'Studies show that people who sleep less than six hours a night are more likely to gain weight, develop heart problems, and suffer from depression.'",
        q:"According to the report, what are the consequences of insufficient sleep?",
        opts:['Better concentration','Weight gain and heart problems','Improved memory','More energy'], ans:1,
        exp:"'Gain weight, develop heart problems, and suffer from depression' — uchta salbiy ta'sir.",
      },
      {
        id:'l6',
        audio:"[Audio]: 'The museum opens at 9 am and closes at 6 pm from Tuesday to Sunday. On Mondays it is closed for maintenance.'",
        q:"When is the museum closed?", opts:['Sundays','Saturdays','Mondays','Tuesdays'], ans:2,
        exp:"'On Mondays it is closed for maintenance' — Dushanba kunlari yopiq.",
      },
      {
        id:'l7',
        audio:"[Audio]: 'Despite initial resistance, the council voted 8 to 3 in favour of constructing the new community centre, which will include a library, gym and café.'",
        q:"What was the result of the vote?", opts:["8 against, 3 in favour","3 against, 8 in favour","Unanimous approval","The vote was postponed"], ans:1,
        exp:"'Voted 8 to 3 in favour' — 8 tasdiqladi, 3 qarshi.",
      },
      {
        id:'l8',
        audio:"[Audio]: 'The phenomenon of code-switching, whereby bilingual speakers alternate between two languages within a single conversation, has been the subject of considerable academic debate regarding its social and cognitive implications.'",
        q:"What is 'code-switching'?", opts:["Learning a new language","Switching between two languages in conversation","Using formal language at work","Forgetting one's native language"], ans:1,
        exp:"'Alternate between two languages within a single conversation' — bir suhbatda ikki til o'rtasida almashinish.",
      },
      {
        id:'l9',
        audio:"[Audio]: 'If you experience any side effects after taking this medication, including dizziness, nausea or blurred vision, discontinue use immediately and consult your doctor.'",
        q:"What should you do if you experience blurred vision?",
        opts:["Take more medication","Wait for it to pass","Stop taking it and see a doctor","Contact the pharmacist"], ans:2,
        exp:"'Discontinue use immediately and consult your doctor' — darhol to'xtating va shifokorga murojaat qiling.",
      },
      {
        id:'l10',
        audio:"[Audio]: 'Notwithstanding the considerable methodological limitations inherent in retrospective studies, the longitudinal data nevertheless suggests a robust correlation between early childhood nutrition and subsequent cognitive development.'",
        q:"What does the research suggest despite its limitations?",
        opts:["Early nutrition has no effect on cognition","There is a strong link between early diet and brain development","Retrospective studies are unreliable","Cognitive development is purely genetic"], ans:1,
        exp:"'Robust correlation between early childhood nutrition and subsequent cognitive development' — chaqaloqlik davridagi ovqatlanish va keyingi kognitiv rivojlanish o'rtasida kuchli bog'liqlik.",
      },
    ],
  },

  {
    id: 'reading',
    name: 'Reading',
    nameUz: "O'qish",
    icon: '📖',
    color: '#8b5cf6',
    border: 'rgba(139,92,246,0.3)',
    bg: 'rgba(139,92,246,0.08)',
    glow: 'rgba(139,92,246,0.25)',
    time: 600,
    desc: "Matnlarni o'qib, savollarga javob bering",
    questions: [
      {
        id:'r1',
        passage:"Tom has two cats. Their names are Max and Luna. Max is black and Luna is white.",
        q:"What colour is Max?", opts:['White','Black','Grey','Orange'], ans:1,
        exp:"'Max is black' deyilgan.",
      },
      {
        id:'r2',
        passage:"The library is open Monday to Friday from 9am to 8pm. On weekends it closes at 5pm.",
        q:"When does the library close on Saturday?", opts:['8pm','9pm','5pm','6pm'], ans:2,
        exp:"'On weekends it closes at 5pm' — dam olish kunlari 17:00 da yopiladi.",
      },
      {
        id:'r3',
        passage:"Anna works as a nurse at City Hospital. She usually starts her shift at 7am. Yesterday she worked extra hours because a colleague was ill.",
        q:"Why did Anna work extra hours yesterday?", opts:['She wanted more money','A colleague was sick','The hospital was busy','Her shift changed'], ans:1,
        exp:"'A colleague was ill' — hamkasbi kasal bo'lgani uchun.",
      },
      {
        id:'r4',
        passage:"Despite the heavy rain, the outdoor concert went ahead as planned. The organisers had provided temporary shelters for the audience, and most people stayed until the end.",
        q:"What can we infer about the audience?", opts:['They left early because of rain','Most enjoyed the concert enough to stay','They were unhappy about the shelters','The concert was cancelled'], ans:1,
        exp:"'Most people stayed until the end' — tomoshabinlarning aksariyati oxirigacha qoldi.",
      },
      {
        id:'r5',
        passage:"The company's profits fell by 12% last quarter, primarily due to rising raw material costs and increased competition from overseas manufacturers. However, the CEO remains optimistic, citing plans to expand into Asian markets.",
        q:"What was the main reason for the profit decline?", opts:['Poor management decisions','Higher material costs and more competition','Expansion into new markets','CEO resignation'], ans:1,
        exp:"'Primarily due to rising raw material costs and increased competition' — asosiy sabab.",
      },
      {
        id:'r6',
        passage:"The advent of social media has fundamentally altered the landscape of political campaigning. Candidates can now bypass traditional gatekeepers such as newspapers and television networks, communicating directly with voters. However, this democratisation of information access has also facilitated the rapid spread of misinformation.",
        q:"What is the author's view on social media and politics?", opts:["It is entirely positive for democracy","It only harms political campaigns","It has both advantages and disadvantages","It has had no significant impact"], ans:2,
        exp:"Yozuvchi ham ijobiy (to'g'ridan-to'g'ri muloqot) ham salbiy (dezinformatsiya) tomonlarni ko'rsatgan.",
      },
      {
        id:'r7',
        passage:"The report indicates that while urban air quality has improved marginally over the past decade owing to stricter vehicle emission standards, the particulate matter released by domestic wood-burning stoves now constitutes a significant and growing health hazard, particularly in suburban and rural areas.",
        q:"According to the report, what is a growing health concern?",
        opts:["Vehicle emissions in cities","Wood-burning stoves in suburban/rural areas","Industrial pollution","Urban population growth"], ans:1,
        exp:"'Domestic wood-burning stoves now constitutes a significant and growing health hazard' — uy o'choqlaridan chiqadigan zarralar.",
      },
      {
        id:'r8',
        passage:"Critics have long argued that the welfare system, by providing unconditional income support, inadvertently creates a dependency culture that disincentivises recipients from seeking employment. Proponents counter that such support serves as a vital safety net, enabling individuals to pursue education or training without immediate financial pressure.",
        q:"What argument do supporters of welfare make?", opts:["It encourages laziness","It creates unemployment","It allows people to pursue education without financial stress","It is too expensive for governments"], ans:2,
        exp:"'Enabling individuals to pursue education or training without immediate financial pressure' — moliyaviy bosimсиз ta'lim olish imkonini beradi.",
      },
      {
        id:'r9',
        passage:"My brother and I went to the park. We played football.",
        q:"Who played football?", opts:['Only the writer','Only the brother','The writer and his brother','Their friends'], ans:2,
        exp:"'My brother and I... played football' — ikkalasi ham o'ynadi.",
      },
      {
        id:'r10',
        passage:"Quantum entanglement, a phenomenon whereby two particles become correlated such that the quantum state of one instantaneously influences the other regardless of the distance separating them, poses profound philosophical questions about the nature of reality and challenges classical notions of locality and causality.",
        q:"What does quantum entanglement challenge?", opts:["The speed of light","Classical ideas about locality and causality","Modern computing","The theory of relativity only"], ans:1,
        exp:"'Challenges classical notions of locality and causality' deyilgan.",
      },
    ],
  },

  {
    id: 'writing',
    name: 'Writing',
    nameUz: 'Yozish',
    icon: '✍️',
    color: '#10b981',
    border: 'rgba(16,185,129,0.3)',
    bg: 'rgba(16,185,129,0.08)',
    glow: 'rgba(16,185,129,0.25)',
    time: 600,
    desc: "Grammatika va yozish ko'nikmalarini tekshiring",
    questions: [
      {
        id:'w1',
        q:"Choose the correct sentence:", opts:["She go to school every day.","She goes to school every day.","She going to school every day.","She goed to school every day."], ans:1,
        exp:"3-shaxs birlikda (She) hozirgi oddiy zamonda fe'lga -s qo'shiladi: goes.",
      },
      {
        id:'w2',
        q:"Choose the correct form: 'He ___ in London since 2010.'", opts:["lives","lived","has lived","is living"], ans:2,
        exp:"'Since 2010' — hozirgi mukammal zamon: has lived.",
      },
      {
        id:'w3',
        q:"Which sentence is grammatically correct?", opts:["If I will have time, I go.","If I have time, I will go.","If I had time, I will go.","If I have time, I would go."], ans:1,
        exp:"1-tip shart gapi: if + present simple → will + infinitive.",
      },
      {
        id:'w4',
        q:"The passive form of 'Someone stole my wallet' is:", opts:["My wallet stolen.","My wallet was stolen.","My wallet is stolen.","My wallet has stolen."], ans:1,
        exp:"O'tgan zamon passiv: was + V3 (stolen).",
      },
      {
        id:'w5',
        q:"Choose the correct reported speech: She said: 'I am tired.'", opts:["She said she is tired.","She said she was tired.","She said she were tired.","She said she has tired."], ans:1,
        exp:"Reported speech: present → past. 'I am' → 'she was'.",
      },
      {
        id:'w6',
        q:"Which option correctly completes the sentence? 'Not only ___ late, but she also forgot her keys.'", opts:["she was","was she","she is","is she"], ans:1,
        exp:"'Not only' bilan inversiya: was she (ega + kesim almashadi).",
      },
      {
        id:'w7',
        q:"Choose the correct phrase: 'The meeting was postponed ___ the CEO's illness.'", opts:["because","despite","due to","although"], ans:2,
        exp:"Ism (illness) oldidan sabab ko'rsatish uchun 'due to' ishlatiladi.",
      },
      {
        id:'w8',
        q:"Which sentence demonstrates correct use of the subjunctive?",
        opts:["I suggest that he goes immediately.","I suggest that he go immediately.","I suggest that he went immediately.","I suggest that he is going immediately."], ans:1,
        exp:"Suggest + that + subjunctive: 'he go' (s qo'shilmaydi).",
      },
      {
        id:'w9',
        q:"'I wish I ___ more money.' Choose the correct form.", opts:["have","had","will have","would have"], ans:1,
        exp:"'I wish + past simple' hozirgi istakni ifodalaydi: 'I wish I had'.",
      },
      {
        id:'w10',
        q:"Identify the error: 'The data shows that crime rates, which has declined significantly, are expected to continue falling.'",
        opts:["'shows' should be 'show'","'which has' should be 'which have'","'are expected' should be 'is expected'","There is no error"], ans:1,
        exp:"'Data' ko'plik (eski ma'noda) va 'rates' ko'plik — 'which have declined' to'g'ri.",
      },
    ],
  },

  {
    id: 'speaking',
    name: 'Speaking',
    nameUz: "Gapirish",
    icon: '🗣️',
    color: '#f59e0b',
    border: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.08)',
    glow: 'rgba(245,158,11,0.25)',
    time: 600,
    desc: "O'z-o'zingizni baholang va eng to'g'ri javobni tanlang",
    questions: [
      {
        id:'s1',
        q:"Someone asks: 'What's your name?' You reply:", opts:["My name is Ali.","I am fine, thanks.","Yes, I do.","I have a name."], ans:0,
        exp:"Ism so'ralganda 'My name is ...' deyiladi.",
      },
      {
        id:'s2',
        q:"A friend says 'I've just got a new job!' The best response is:", opts:["Oh no, I'm sorry to hear that.","That's wonderful news! Congratulations!","Really? That's not very good.","Do you have a job?"], ans:1,
        exp:"Yaxshi yangilik uchun 'Congratulations!' deyiladi.",
      },
      {
        id:'s3',
        q:"You are in a shop and want to know the price. You say:", opts:["Give me the price.","What does this cost?","Price, please!","I need money."], ans:1,
        exp:"Narxni so'rash uchun 'What does this cost?' yoki 'How much is this?' ishlatiladi.",
      },
      {
        id:'s4',
        q:"You disagree with a colleague's idea in a meeting. The most professional response is:", opts:["That's completely wrong!","I see your point, however, I think we should consider...","No! That won't work.","Are you serious?"], ans:1,
        exp:"Professional muhitda fikrni 'I see your point, however...' deb diplomatik tarzda bildirish kerak.",
      },
      {
        id:'s5',
        q:"You want to express that you partially agree but have some reservations. You say:", opts:["I totally agree with everything you've said.","I completely disagree.","That's an interesting point, although I have some reservations about...","I don't understand what you mean."], ans:2,
        exp:"Qisman kelishish va shubhalarni bildirish uchun 'although I have some reservations' ishlatiladi.",
      },
      {
        id:'s6',
        q:"In a formal presentation, how would you introduce a contrasting point?", opts:["But...","However, it is worth noting that...","Anyway...","So what?"], ans:1,
        exp:"Rasmiy nutqda qarama-qarshi fikrni 'However, it is worth noting that...' bilan kiritisg maqbul.",
      },
      {
        id:'s7',
        q:"When asked to elaborate on a complex argument during an academic discussion, you would best begin with:", opts:["Well, it's complicated.","To put it more precisely, what I'm arguing is that...","I already said that.","It depends."], ans:1,
        exp:"Akademik muhokamada 'To put it more precisely, what I'm arguing is that...' aniq va professional.",
      },
      {
        id:'s8',
        q:"You are chairing a meeting and want to bring the discussion back to the main topic. You say:", opts:["Stop talking!","Let's get back on track — the main issue here is...","That's enough.","I'm bored."], ans:1,
        exp:"Muhokamani asosiy mavzuga qaytarish uchun 'Let's get back on track' ishlatiladi.",
      },
      {
        id:'s9',
        q:"Someone misunderstands your point. To clarify, you use:", opts:["What I was trying to say is...","You didn't listen.","Never mind.","It doesn't matter."], ans:0,
        exp:"Tushuntirish uchun 'What I was trying to say is...' ishlatiladi.",
      },
      {
        id:'s10',
        q:"In a high-level academic debate, to concede a point while maintaining your overall argument, you would say:",
        opts:["You're right, I give up.","While I concede that this presents a valid challenge, the broader implications of my argument remain intact.","Fine, whatever.","That's not a problem."], ans:1,
        exp:"Akademik debatda 'While I concede... the broader implications... remain intact' — kuchli diskurs uslubi.",
      },
    ],
  },
]

// Ball → CEFR darajasi
export function calcLevel(correct, total) {
  const pct = total ? (correct / total) * 100 : 0
  if (pct >= 90) return { level:'C2', label:'C2 — Proficiency', color:'#a855f7', desc:"Mukammal daraja! Ona tili darajasida muloqot qilasiz." }
  if (pct >= 78) return { level:'C1', label:'C1 — Advanced', color:'#ef4444', desc:"Ilg'or daraja! Akademik va professional kontekstda erkin muloqot." }
  if (pct >= 65) return { level:'B2', label:'B2 — Upper Intermediate', color:'#f59e0b', desc:"Yuqori o'rta daraja. Murakkab matnlarni tushunasiz." }
  if (pct >= 52) return { level:'B1', label:'B1 — Intermediate', color:'#8b5cf6', desc:"O'rta daraja. Tanish mavzularda erkin muloqot qilasiz." }
  if (pct >= 38) return { level:'A2', label:'A2 — Elementary', color:'#3b82f6', desc:"Asosiy daraja. Kundalik muloqot mavzularini bilasiz." }
  return { level:'A1', label:"A1 — Beginner", color:'#22c55e', desc:"Boshlang'ich daraja. Asosiy so'z va iboralarni bilasiz." }
}
