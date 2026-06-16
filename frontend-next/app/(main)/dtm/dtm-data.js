// DTM Test — statik ma'lumotlar
// Har bir yo'nalish uchun: majburiy fanlar (O'zbek tili + 2 ta fan)
// Har bir fandan 35+ savol pool (30 tasi tasodifiy tanlanadi)

/* ─── Savol pool yaratish yordamchilari ─── */
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pick30(pool) {
  return shuffle(pool).slice(0, 30).map((q, i) => ({ ...q, _idx: i }))
}

/* ══════════════════════════════════════════════════════════
   O'ZBEK TILI — majburiy fan (barcha yo'nalishlar uchun)
   ═══════════════════════════════════════════════════════ */
export const UZBEK_TILI_POOL = [
  { id:'uz1',  q:"Qaysi so'z ot turkumiga kiradi?", opts:["Chiroyli","Kitob","O'qish","Tez"], ans:1, exp:"'Kitob' predmetni bildiradi — ot." },
  { id:'uz2',  q:"'Men maktabga boraman' — bu qaysi zamon?", opts:["O'tgan","Hozirgi","Kelasi","Shartli"], ans:1, exp:"'-aman' qo'shimchasi hozirgi-kelasi zamonni bildiradi." },
  { id:'uz3',  q:"Qaysi so'zda imloviy xato bor?", opts:["Baxt","Maktab","Kitob","Xotin"], ans:3, exp:"To'g'ri yozilishi: 'Xotin'." },
  { id:'uz4',  q:"'Ota-ona' so'zi qaysi usulda yasalgan?", opts:["Qo'shimcha","Qo'shma","Juft","Takror"], ans:2, exp:"Ikkita mustaqil so'z birikkan — juft so'z." },
  { id:'uz5',  q:"Ko'plik qo'shimchasi qaysi?", opts:["-li","-lar","-chi","-siz"], ans:1, exp:"Ko'plik qo'shimchasi: -lar (kitob-lar)." },
  { id:'uz6',  q:"'Kutubxona' so'zining ma'nosi nima?", opts:["Do'kon","Maktab","Kitob xonasi","Kasalxona"], ans:2, exp:"'Kutub' — arabcha kitoblar, 'xona' — joy. Kitoblar joylashadigan xona." },
  { id:'uz7',  q:"Qaysi gap to'g'ri tuzilgan?", opts:["Men ketdim uyga.","Men uyga ketdim.","Uyga men ketdim.","Ketdim men uyga."], ans:1, exp:"O'zbek tilida odatiy tartib: Ega + To'ldiruvchi + Kesim." },
  { id:'uz8',  q:"'Yulduz' so'ziga antonim toping?", opts:["Quyosh","Oy","Qorong'ulik","Tungi"], ans:2, exp:"Yulduz kechasi ko'rinadi; to'g'ridan-to'g'ri antonim yo'q, ma'no jihatidan qorong'ulik qarama-qarshi." },
  { id:'uz9',  q:"'Chaqmoq' so'zining sinonimi qaysi?", opts:["Momaqaldiroq","Yashun","Yomg'ir","Shamol"], ans:1, exp:"'Yashun' — chaqmoqning sinonimidir." },
  { id:'uz10', q:"Qaysi so'z sifat?", opts:["Yugurmoq","Baland","Tog'","Tez-tez"], ans:1, exp:"'Baland' predmetning belgisini bildiradi — sifat." },
  { id:'uz11', q:"'-ish' qo'shimchasi qaysi so'z turkumini yasaydi?", opts:["Sifat","Fe'l","Ot","Ravish"], ans:2, exp:"'O'qi-sh', 'yur-ish' — harakat oti yasaladi." },
  { id:'uz12', q:"'Sog'lom tana — sog'lom ruh' — bu nima?", opts:["Maqol","She'r","Xabar","Ertak"], ans:0, exp:"Qisqa hikmatli so'z — maqol." },
  { id:'uz13', q:"'U kitob o'qiyapti' — kesim qaysi so'z?", opts:["U","Kitob","O'qiyapti","Hammasi"], ans:2, exp:"'O'qiyapti' — gapning asosiy kesimi." },
  { id:'uz14', q:"Qaysi so'zda 'ng' tovushi bor?", opts:["Bola","Unga","Kela","Bordi"], ans:1, exp:"'Unga' — u-nga, 'ng' undoshi bor." },
  { id:'uz15', q:"'Bugun havo issiq' — to'ldiruvchi bormi?", opts:["Ha, 'bugun'","Ha, 'havo'","Ha, 'issiq'","Yo'q"], ans:3, exp:"'Havo' ega, 'issiq' kesim-sifat, 'bugun' ravish. To'ldiruvchi yo'q." },
  { id:'uz16', q:"Qaysi qator barcha so'zlari fe'l?", opts:["Yurmoq, o'qimoq, yugurmoq","Uy, yo'l, kitob","Baland, tez, yaxshi","Men, sen, u"], ans:0, exp:"Harakat bildiruvchi so'zlar — fe'l." },
  { id:'uz17', q:"'O'zbekiston' so'zida nechta harf bor?", opts:["9","10","11","12"], ans:1, exp:"O-'-z-b-e-k-i-s-t-o-n = 11 harf." },
  { id:'uz18', q:"Qaysi gapda ega aniq?", opts:["Yomg'ir yog'di.","Tez yur.","Chiqma!","Kutish kerak."], ans:0, exp:"'Yomg'ir yog'di' — ega: Yomg'ir." },
  { id:'uz19', q:"'Mehriban' so'zi qaysi turkum?", opts:["Ot","Sifat","Fe'l","Ravish"], ans:1, exp:"Belgini bildiradi — sifat." },
  { id:'uz20', q:"Imlo qoidasiga ko'ra, qaysi so'z to'g'ri yozilgan?", opts:["ham'ma","hammá","hamma","Hamma"], ans:2, exp:"'Hamma' to'g'ri yoziladi, gapda katta harf bilan emas." },
  { id:'uz21', q:"Qaysi so'z ravish?", opts:["Baland","Tez","Ko'k","Og'ir"], ans:1, exp:"'Tez' fe'lni izohlaydi — ravish. (Tez yugurdi)." },
  { id:'uz22', q:"'U maktabdan qaytdi' — 'maktabdan' qaysi bo'lak?", opts:["Ega","Kesim","Hol","To'ldiruvchi"], ans:3, exp:"'Dan' kelishigi to'ldiruvchi yasaydi." },
  { id:'uz23', q:"'Inson' so'ziga qo'shimcha qo'shib ko'plik yasang:", opts:["Insonlar","Insonli","Insonsiz","Insonlik"], ans:0, exp:"Ko'plik -lar qo'shimchasi bilan: insonlar." },
  { id:'uz24', q:"O'zbek alifbosida nechta unli harf bor?", opts:["4","6","8","10"], ans:1, exp:"O'zbek lotin alifbosida 6 unli: a, e, i, o, u, o'." },
  { id:'uz25', q:"'Yangi' so'zining antonimi:", opts:["Eski","Katta","Yaxshi","Qizil"], ans:0, exp:"'Yangi' ↔ 'Eski' — qarama-qarshi ma'no." },
  { id:'uz26', q:"'Kitob o'qish yaxshi odat' — bu nima?", opts:["Oddiy gap","Qo'shma gap","Maqol","She'r"], ans:0, exp:"Bir kesmli oddiy gap." },
  { id:'uz27', q:"Qaysi so'zda to'rt bo'g'in bor?", opts:["Kitob","O'zbekiston","Maktab","Uy"], ans:1, exp:"O'-zbe-kis-ton = 4 bo'g'in." },
  { id:'uz28', q:"Fe'lning noaniq shakli qo'shimchasi:", opts:["-di","-moq","-lar","-lik"], ans:1, exp:"'-moq' — fe'lning noaniq shakli: yur-moq, o'qi-moq." },
  { id:'uz29', q:"'Baxt' so'zining sinonimi:", opts:["G'am","Saodat","Qayg'u","Alamzadalik"], ans:1, exp:"Saodat = baxt, xursandlik." },
  { id:'uz30', q:"'Men, sen, u' — bu qaysi so'z turkumi?", opts:["Ot","Olmosh","Sifat","Ravish"], ans:1, exp:"Otning o'rnida qo'llaniladigan so'zlar — olmosh." },
  { id:'uz31', q:"'O'rta maktab o'quvchisi' — bu qaysi turdagi so'z birikmasi?", opts:["Ot+sifat","Ot+ot","Sifat+ot","Fe'l+ot"], ans:1, exp:"'O'rta maktab' + 'o'quvchisi' — ot+ot birikmasi." },
  { id:'uz32', q:"'Uy-ro'zg'or' qaysi so'z turiga kiradi?", opts:["Qo'shma","Juft","Takroriy","Yasama"], ans:1, exp:"Ikkita so'z chiziqcha bilan yozilgan — juft so'z." },
  { id:'uz33', q:"Qaysi gapda noto'g'ri tinish belgisi ishlatilgan?", opts:["Salom, do'stim!","U keldi, va gapirdi.","Nima, qilaylik?","Ha, albatta."], ans:1, ans_note:"'Keldi va gapirdi' — bog'lovchidan oldin vergul qo'yilmaydi.", exp:"Va bog'lovchisi oldidan vergul qo'yilmaydi." },
  { id:'uz34', q:"'Gul' so'ziga egalik qo'shimchasini qo'shing (birinchi shaxs):", opts:["Gulim","Guli","Gulimiz","Guling"], ans:0, exp:"1-shaxs birlik egalik: gul-im." },
  { id:'uz35', q:"'Mushuk miyovladi' — bu qaysi uslub?", opts:["Ilmiy","Badiiy","Rasmiy","So'zlashuv"], ans:1, exp:"Hayvon tasviri, jonlantirish — badiiy uslub." },
]

/* ══════════════════════════════════════════════════════════
   MATEMATIKA
   ═══════════════════════════════════════════════════════ */
export const MATEMATIKA_POOL = [
  { id:'m1',  q:"2³ × 2⁴ = ?", opts:["2⁷","2¹²","4⁷","2⁶"], ans:0, exp:"Darajalar qo'shiladi: 2³⁺⁴ = 2⁷." },
  { id:'m2',  q:"x² − 5x + 6 = 0 tenglamaning ildizlari:", opts:["2 va 3","1 va 6","−2 va −3","3 va 4"], ans:0, exp:"(x−2)(x−3)=0 → x=2, x=3." },
  { id:'m3',  q:"sin²α + cos²α = ?", opts:["0","1","2","α"], ans:1, exp:"Trigonometriyaning asosiy identifikatori." },
  { id:'m4',  q:"log₂ 8 = ?", opts:["2","3","4","1"], ans:1, exp:"2³ = 8, shuning uchun log₂8 = 3." },
  { id:'m5',  q:"∫ 2x dx = ?", opts:["x²+C","2x²+C","x+C","2+C"], ans:0, exp:"∫2x dx = x² + C." },
  { id:'m6',  q:"1 dan 10 gacha bo'lgan juft sonlar yig'indisi:", opts:["25","30","20","35"], ans:1, exp:"2+4+6+8+10 = 30." },
  { id:'m7',  q:"Agar f(x) = 3x+1 bo'lsa, f(2) = ?", opts:["5","6","7","8"], ans:2, exp:"f(2) = 3×2+1 = 7." },
  { id:'m8',  q:"To'g'ri burchakli uchburchakda katetlar 3 va 4. Gipotenuza = ?", opts:["5","6","7","4"], ans:0, exp:"Pifagor: √(9+16) = √25 = 5." },
  { id:'m9',  q:"Arifmetik progressiyada a₁=2, d=3, a₅ = ?", opts:["12","14","16","17"], ans:1, exp:"a₅ = 2 + (5−1)×3 = 14." },
  { id:'m10', q:"2/3 + 1/4 = ?", opts:["3/7","11/12","7/12","5/6"], ans:1, exp:"8/12 + 3/12 = 11/12." },
  { id:'m11', q:"Kvadratning tomoni 5 sm. Yuzi = ?", opts:["10","20","25","15"], ans:2, exp:"S = a² = 25 sm²." },
  { id:'m12', q:"(a+b)² = ?", opts:["a²+b²","a²+2ab+b²","a²−b²","2a+2b"], ans:1, exp:"Kvadrat formulasi." },
  { id:'m13', q:"Doiraning radiusi 7. Uzunligi = ? (π≈22/7)", opts:["22","44","11","14"], ans:1, exp:"C = 2πr = 2×22/7×7 = 44." },
  { id:'m14', q:"5! = ?", opts:["25","100","120","60"], ans:2, exp:"5! = 120." },
  { id:'m15', q:"Agar 3x = 27 bo'lsa, x = ?", opts:["3","4","9","2"], ans:0, exp:"3³ = 27, x = 3." },
  { id:'m16', q:"Ikkita son 4 va 6. EKUK = ?", opts:["12","24","6","2"], ans:0, exp:"Eng kichik umumiy karrali = 12." },
  { id:'m17', q:"Vektor a⃗ = (3, 4). |a⃗| = ?", opts:["7","5","√7","√13"], ans:1, exp:"|a⃗| = √(9+16) = 5." },
  { id:'m18', q:"tan 45° = ?", opts:["0","1","√3","1/2"], ans:1, exp:"tan 45° = 1." },
  { id:'m19', q:"Kubning qirrasi 3. Hajmi = ?", opts:["9","18","27","81"], ans:2, exp:"V = a³ = 27." },
  { id:'m20', q:"100 dan 1 gacha bo'lgan sonlar yig'indisi:", opts:["5000","5050","4950","5100"], ans:1, exp:"S = n(n+1)/2 = 100×101/2 = 5050." },
  { id:'m21', q:"cos 60° = ?", opts:["1","0.5","0","√3/2"], ans:1, exp:"cos 60° = 0.5." },
  { id:'m22', q:"y = x² funksiyasining hosila:", opts:["2","x","2x","x²"], ans:2, exp:"(x²)' = 2x." },
  { id:'m23', q:"3x + 2 < 11. x ning qiymatlari:", opts:["x < 3","x > 3","x < 4","x > 4"], ans:0, exp:"3x < 9 → x < 3." },
  { id:'m24', q:"Uch xonali eng kichik natural son:", opts:["99","100","101","10"], ans:1, exp:"100 — uch xonali eng kichik son." },
  { id:'m25', q:"Yig'indi: 1 + 3 + 5 + ... + 19 = ?", opts:["100","90","80","110"], ans:0, exp:"n² = 10² = 100 (10 ta toq son)." },
  { id:'m26', q:"Agar a:b = 2:3 va b = 9 bo'lsa, a = ?", opts:["3","4","6","9"], ans:2, exp:"a/9 = 2/3 → a = 6." },
  { id:'m27', q:"Kombinatsiya C(5,2) = ?", opts:["5","10","20","15"], ans:1, exp:"5!/(2!3!) = 10." },
  { id:'m28', q:"f(x) = x³ − x ning nolga teng nuqtalari:", opts:["0, 1","−1, 0, 1","0, −1","1, −1"], ans:1, exp:"x(x²−1)=0 → x=0, ±1." },
  { id:'m29', q:"Ehtimollik: 52 varaqli kartadan tuznoma chiqish ehtimoli:", opts:["1/4","1/13","1/52","4/52"], ans:1, exp:"4 tuznoma / 52 = 1/13." },
  { id:'m30', q:"2x − y = 5 va x + y = 4. x = ?", opts:["2","3","4","1"], ans:1, exp:"3x = 9, x = 3." },
  { id:'m31', q:"√144 = ?", opts:["11","12","13","14"], ans:1, exp:"12² = 144." },
  { id:'m32', q:"Trapetsiyada parallel tomonlar 6 va 10, balandlik 4. Yuzi = ?", opts:["32","36","40","28"], ans:0, exp:"S = (6+10)/2 × 4 = 32." },
  { id:'m33', q:"Agar log₁₀ x = 2 bo'lsa, x = ?", opts:["10","100","20","1000"], ans:1, exp:"10² = 100." },
  { id:'m34', q:"Geometrik progressiya: 2, 6, 18, ... Keyingi son:", opts:["36","54","72","48"], ans:1, exp:"q = 3, a₄ = 18×3 = 54." },
  { id:'m35', q:"n = 0 bo'lganda 0! = ?", opts:["0","1","boshqacha","aniqlanmagan"], ans:1, exp:"0! = 1 — ta'rifdan." },
]

/* ══════════════════════════════════════════════════════════
   FIZIKA
   ═══════════════════════════════════════════════════════ */
export const FIZIKA_POOL = [
  { id:'f1',  q:"Nyutonning 2-qonuni: F = ?", opts:["mv","ma","m/a","m+a"], ans:1, exp:"F = ma — kuch, massa va tezlanish o'rtasidagi bog'liqlik." },
  { id:'f2',  q:"Yorug'likning vakuumdagi tezligi:", opts:["3×10⁶","3×10⁸","3×10¹⁰","3×10⁴"], ans:1, exp:"c = 3×10⁸ m/s." },
  { id:'f3',  q:"Archimed kuchi formulasi:", opts:["F = mg","F = ρgV","F = ma","F = kx"], ans:1, exp:"Suyuqlikka botirilgan jismga ta'sir etuvchi ko'tarish kuchi: ρgV." },
  { id:'f4',  q:"Elektr qarshiligi birligi:", opts:["Amper","Volt","Om","Farad"], ans:2, exp:"Ohm (Ω) — qarshilik birligidir." },
  { id:'f5',  q:"Og'irlik kuchi quyida ko'rsatilgan formulalar ichida to'g'ri qaysi?", opts:["P = m/g","P = m×g","P = m+g","P = mg²"], ans:1, exp:"P = mg, g ≈ 9.8 m/s²." },
  { id:'f6',  q:"Ohm qonuni: U = ?", opts:["I/R","IR","I+R","R/I"], ans:1, exp:"U = IR." },
  { id:'f7',  q:"Kinetik energiya formulasi:", opts:["mgh","½mv²","mv","Fs"], ans:1, exp:"Ek = ½mv²." },
  { id:'f8',  q:"Potentsial energiya formulasi:", opts:["½mv²","mgh","mv²","Ft"], ans:1, exp:"Ep = mgh." },
  { id:'f9',  q:"Harorat birligi SI da:", opts:["Daraja Selsiy","Kelvin","Farengeyt","Rankine"], ans:1, exp:"SI sistemasida harorat birligi — Kelvin (K)." },
  { id:'f10', q:"Induksiya hodisasini kim kashf etgan?", opts:["Nyuton","Faradey","Amper","Volt"], ans:1, exp:"Elektromagnit induksiyasini Faradey kashf etgan (1831)." },
  { id:'f11', q:"Tovush to'lqinlari quyidagilar ichida nimada tarqala olmaydi?", opts:["Havo","Suv","Vakuum","Po'lat"], ans:2, exp:"Tovush — mexanik to'lqin, vakuumda tarqalmaydi." },
  { id:'f12', q:"Impuls formulasi:", opts:["p = mv","p = ma","p = Ft","p = F/m"], ans:0, exp:"p = mv — massaviy tezlik." },
  { id:'f13', q:"Parallel ulangan ikkita 6 Omli qarshilikning umumiy qarshiligi:", opts:["12 Om","6 Om","3 Om","2 Om"], ans:2, exp:"1/R = 1/6+1/6 = 2/6 → R = 3 Om." },
  { id:'f14', q:"Erkin tushish tezlanishi yer sirtida taxminan:", opts:["9.8 m/s","9.8 m/s²","10 km/s","0.98 m/s"], ans:1, exp:"g ≈ 9.8 m/s² (yoki ≈ 10 m/s² yaxlitlab)." },
  { id:'f15', q:"Issiqlik miqdori formulasi:", opts:["Q = mc∆T","Q = mgh","Q = ½mv²","Q = Pt"], ans:0, exp:"Q = mc∆T." },
  { id:'f16', q:"Atom yadrosi nimalarden tashkil topgan?", opts:["Elektron va proton","Proton va neytron","Neytron va elektron","Foton va proton"], ans:1, exp:"Yadro: proton + neytron." },
  { id:'f17', q:"Elektromagnit to'lqinlar qaysi tartibda joylashgan (chastota oshib borishi bilan)?", opts:["Gamma, X, UV, ko'rinadigan, IR, mikro, radio","Radio, mikro, IR, ko'rinadigan, UV, X, gamma","Ko'rinadigan, UV, IR, X, gamma, radio","Mikro, radio, gamma, UV, X, IR, ko'rinadigan"], ans:1, exp:"Chastota: radio < mikro < IR < ko'rinadigan < UV < X < gamma." },
  { id:'f18', q:"Transformatorning ishlash prinsipi:", opts:["Mexanik ish","Elektromagnit induksiya","Termoelektrik effekt","Fotoelektrik effekt"], ans:1, exp:"Elektromagnit induksiya asosida ishlaydi." },
  { id:'f19', q:"1 kVt·soat = ?", opts:["1000 J","36 000 J","3 600 000 J","100 J"], ans:2, exp:"1 kW·h = 1000 W × 3600 s = 3 600 000 J." },
  { id:'f20', q:"Gaz holat tenglamasi (ideal gaz uchun):", opts:["PV=nRT","PV=mRT","P=ρgh","P=F/S"], ans:0, exp:"Ideal gaz tenglamasi: PV = nRT." },
  { id:'f21', q:"Linzaning fokus masofasi formulasi: 1/f = ?", opts:["1/d + 1/f'","1/a + 1/b","a + b","1/a − 1/b"], ans:1, exp:"1/f = 1/a + 1/b (a — predmet masofasi, b — tasvir masofasi)." },
  { id:'f22', q:"Yuklanmagan prujina kuchi (Guk qonuni):", opts:["F = kx","F = k/x","F = kx²","F = mg"], ans:0, exp:"F = kx, k — bikrlik koeffitsienti." },
  { id:'f23', q:"Radioaktiv yarım yemirilish davri nima?", opts:["Atomlar to'lig'icha parchalanish vaqti","Yarmining parchalanish vaqti","To'lig'icha stabillashuv vaqti","Yadroning aktivlashuv davri"], ans:1, exp:"T₁/₂ — radioaktiv materialning yarmisi parchalanguncha o'tgan vaqt." },
  { id:'f24', q:"Nyutonning 3-qonuni:", opts:["Harakatlanuvchi jism to'g'ri chiziqli harakatlanadi","Har bir ta'sirga teng va qarama-qarshi reaktsiya bor","Kuch = massa × tezlanish","Tortishish kuchi teskari proporsional"], ans:1, exp:"'Har bir ta'sirga teng va qarama-qarshi reaktsiya bor.'" },
  { id:'f25', q:"Yorug'lik 1 yilda o'tadigan masofa (yorug'lik yili):", opts:["9.46×10¹² km","9.46×10¹³ km","9.46×10¹⁵ km","3×10⁸ km"], ans:2, exp:"1 yorug'lik yili ≈ 9.46×10¹² km = 9.46×10¹⁵ m." },
  { id:'f26', q:"Kondensatorning sig'imi birligi:", opts:["Farad","Genri","Om","Veber"], ans:0, exp:"Farad (F) — elektr sig'im birligi." },
  { id:'f27', q:"Absolut nol harorat (Kelvinda):", opts:["0 K","−273 K","273 K","−273.15 K"], ans:0, exp:"Absolut nol = 0 K = −273.15 °C." },
  { id:'f28', q:"Fotonnning energiyasi:", opts:["E = mc²","E = hf","E = ½mv²","E = qU"], ans:1, exp:"E = hf, h — Plank doimiysi, f — chastota." },
  { id:'f29', q:"Issiqlikning uzatilish yo'llaridan biri — konveksiya bu:", opts:["To'g'ridan-to'g'ri aloqa orqali","Muhit harakati orqali","Nurlanish orqali","Mexanik to'lqin orqali"], ans:1, exp:"Konveksiya — suyuqlik yoki gaz oqimi orqali issiqlik uzatish." },
  { id:'f30', q:"Magnit induksiyasi birligi:", opts:["Testa","Genri","Veber","Om"], ans:0, exp:"Magnit induksiyasi birligi — Testa (T)." },
  { id:'f31', q:"Mexanik to'lqin uzunligi λ = ?", opts:["v/f","f/v","vf","v+f"], ans:0, exp:"λ = v/f (tezlik / chastota)." },
  { id:'f32', q:"Ideal mashinaning FIK:", opts:["100% dan katta","100%","100% dan kichik","0%"], ans:1, exp:"Ideal (Karnо) mashinasi uchun FIK = 100%." },
  { id:'f33', q:"Elektr quvvat birligi:", opts:["Joul","Vatt","Amper","Volt"], ans:1, exp:"Quvvat birligi — Vatt (W)." },
  { id:'f34', q:"Yer atrofida aylanuvchi sun'iy yo'ldosh markazga tortish kuchi bilan qaysi kuch muvozanatda?", opts:["Tortishish","Markazdan qochma kuch","Harakatlantiruvchi kuch","Aerodinamik kuch"], ans:1, exp:"Markazga tortish = markazdan qochma kuch." },
  { id:'f35', q:"Snell qonuni (yorug'lik sinishi):", opts:["n₁sinθ₁ = n₂sinθ₂","n₁cosθ₁ = n₂cosθ₂","n₁θ₁ = n₂θ₂","n₁/sinθ₁ = n₂/sinθ₂"], ans:0, exp:"n₁sinθ₁ = n₂sinθ₂ — Snell qonuni." },
]

/* ══════════════════════════════════════════════════════════
   KIMYO
   ═══════════════════════════════════════════════════════ */
export const KIMYO_POOL = [
  { id:'k1',  q:"Vodorodning atom raqami:", opts:["1","2","3","4"], ans:0, exp:"H — birinchi element, Z = 1." },
  { id:'k2',  q:"Suv formulasi:", opts:["H₂O₂","HO","H₂O","H₃O"], ans:2, exp:"H₂O — ikki vodorod, bir kislorod." },
  { id:'k3',  q:"NaCl ning eritmasida qanday ionlar bor?", opts:["Na⁺ va Cl⁻","Na va Cl","NaCl molekulasi","Na⁺ va O²⁻"], ans:0, exp:"Elektrolitning dissotsiatsiyasi: NaCl → Na⁺ + Cl⁻." },
  { id:'k4',  q:"Kislotalar va asoslar reaksiyasi nima deyiladi?", opts:["Oksidlanish","Neytrallash","Redokslanish","Gidroliz"], ans:1, exp:"Kislota + Asos → Tuz + Suv — neytrallash reaksiyasi." },
  { id:'k5',  q:"Mis elementining kimyoviy belgisi:", opts:["Co","Cu","Cr","Cs"], ans:1, exp:"Cu — Cuprum (mis)." },
  { id:'k6',  q:"Mendeleev jadvalida davr deb nimaga aytiladi?", opts:["Ustun","Gorizontal qator","Diagonal","Guruh"], ans:1, exp:"Davr — gorizontal qator (Period)." },
  { id:'k7',  q:"HCl kislotasi suvda qaysi ionlarni beradi?", opts:["H⁺ va O²⁻","H⁺ va Cl⁻","Na⁺ va Cl⁻","H₂ va Cl₂"], ans:1, exp:"HCl → H⁺ + Cl⁻." },
  { id:'k8',  q:"Oksidlanish-qaytarilish reaksiyasida elektron beruvchi modda:", opts:["Oksidlovchi","Qaytaruvchi","Katalizator","Inhibitor"], ans:1, exp:"Elektron beruvchi — qaytaruvchi modda." },
  { id:'k9',  q:"Metanning formulasi:", opts:["C₂H₆","CH₄","C₃H₈","C₂H₄"], ans:1, exp:"Metan — CH₄, eng oddiy uglevodorod." },
  { id:'k10', q:"pH = 7 qanday muhit bildiradi?", opts:["Kislotali","Ishqoriy","Neytral","Kuchli kislotali"], ans:2, exp:"pH = 7 — neytral muhit." },
  { id:'k11', q:"Oltingugurtning kimyoviy belgisi:", opts:["St","Si","S","Su"], ans:2, exp:"S — Sulfur (oltingugurt)." },
  { id:'k12', q:"Avogadro soni taxminan:", opts:["6.02×10²³","6.02×10²²","6.02×10²⁴","3.14×10²³"], ans:0, exp:"NA ≈ 6.022×10²³ mol⁻¹." },
  { id:'k13', q:"Etilening formulasi:", opts:["C₂H₆","C₂H₂","C₂H₄","CH₄"], ans:2, exp:"Etilen — C₂H₄, ikkilamchi bog'li uglevodorod." },
  { id:'k14', q:"Temir-3 oksidining formulasi:", opts:["FeO","Fe₂O₃","Fe₃O₄","FeO₂"], ans:1, exp:"Fe₂O₃ — temir-3 oksid." },
  { id:'k15', q:"Kaliy permanganatining formulasi:", opts:["K₂MnO₄","KMnO₄","KMnO₂","K₂MnO₃"], ans:1, exp:"KMnO₄ — kaliy permanganat." },
  { id:'k16', q:"Qaysi elementlar inert (noble) gazlar guruhiga kiradi?", opts:["He, Ne, Ar","H, O, N","Na, K, Ca","F, Cl, Br"], ans:0, exp:"Noble gazlar: He, Ne, Ar, Kr, Xe, Rn." },
  { id:'k17', q:"Ammiakni sovuq konsentrlangan kislota bilan reaksiyasi mahsuloti:", opts:["N₂ va H₂O","NH₄NO₃","Aralashish reaksiya bermaydi","NH₃ gazida qoladi"], ans:2, exp:"NH₃ sovuq konsentrlangan HNO₃ bilan sekin reaksiyaga kirishadi." },
  { id:'k18', q:"Organik kimyoda 'aromatic' birikmalar nima?", opts:["Benzol halqasiga ega birikmalar","Xushbo'y hidli birikmalar","Uglevodorodlar","Aminokislotalar"], ans:0, exp:"Aromatik — benzol yoki shunga o'xshash halqaga ega birikmalar." },
  { id:'k19', q:"Mis rangi nima?", opts:["Kumushsifat","Qizil-jigarrang","Sariq","Ko'k"], ans:1, exp:"Mis — qizil-jigarrang metall." },
  { id:'k20', q:"Natriy gidroksid (NaOH) qaysi guruhga kiradi?", opts:["Kislota","Asos (ishqor)","Tuz","Oksid"], ans:1, exp:"NaOH — kuchli asos (ishqor)." },
  { id:'k21', q:"Fosfor atomining massa soni 31, proton soni 15. Neytron soni:", opts:["15","16","31","46"], ans:1, exp:"N = A − Z = 31 − 15 = 16." },
  { id:'k22', q:"H₂SO₄ kislotasi nomi:", opts:["Xlorid kislota","Sulfat kislota","Nitrat kislota","Fosfat kislota"], ans:1, exp:"H₂SO₄ — sulfat (kukurt) kislota." },
  { id:'k23', q:"Qaysi birikma efir?", opts:["CH₃COOH","CH₃OCH₃","CH₃CHO","C₆H₅OH"], ans:1, exp:"CH₃-O-CH₃ — dimetil efir." },
  { id:'k24', q:"Reaksiya tezligini oshiradigan modda:", opts:["Inhibitor","Katalizator","Reaktiv","Mahsulot"], ans:1, exp:"Katalizator — reaksiyani tezlashtiradi." },
  { id:'k25', q:"Xlor (Cl₂) qaysi fizik holatda bo'ladi?", opts:["Rangsiz gaz","Sariq-yashil gaz","Qattiq modda","Suyuqlik"], ans:1, exp:"Cl₂ — xona haroratida sariq-yashil gaz." },
  { id:'k26', q:"Karbonat kislota formulasi:", opts:["CO₂","H₂CO₃","Ca(HCO₃)₂","HCO₃⁻"], ans:1, exp:"H₂CO₃ — karbonat kislota." },
  { id:'k27', q:"Oltin kimyoviy jadvaldagi belgisi:", opts:["Go","Gl","Au","Gd"], ans:2, exp:"Au — Aurum (oltin)." },
  { id:'k28', q:"Kimyoviy reaksiyada massa saqlanish qonuni kim kashf etgan?", opts:["Dalton","Lomonosov-Lavuaz'e","Mendeleev","Avogadro"], ans:1, exp:"Massa saqlanish qonunini Lomonosov (1748) va Lavuaz'e mustaqil kashf etgan." },
  { id:'k29', q:"Elektrolitik dissotsiatsiya — bu:", opts:["Ionlarga bo'linish","Atomlarga bo'linish","Elektronlar chiqarish","Kristallanish"], ans:0, exp:"Erigan yoki eritilgan elektrolitning ionlarga bo'linishi." },
  { id:'k30', q:"Neftning asosiy tarkibi:", opts:["Uglevodorodlar","Aminokislotalar","Tuzlar","Kislotalar"], ans:0, exp:"Neft — asosan uglevodorodlardan iborat." },
  { id:'k31', q:"Gliukoza formulasi:", opts:["C₁₂H₂₂O₁₁","C₆H₁₂O₆","C₂H₅OH","CH₂O"], ans:1, exp:"C₆H₁₂O₆ — gliukoza." },
  { id:'k32', q:"Qaysi element eng og'ir tabiiy element?", opts:["Plutoniy","Uran","Oltin","Osmiy"], ans:1, exp:"Uran (Z=92) — eng og'ir tabiiy element." },
  { id:'k33', q:"Metanol va etanolning farqi:", opts:["Bir CH₂ guruhi","Bir OH guruhi","Bir kislorod","Bir vodorod"], ans:0, exp:"CH₃OH va C₂H₅OH — bir CH₂ guruhiga farq qiladi." },
  { id:'k34', q:"Aseton (CH₃COCH₃) qaysi funktsional guruhga ega?", opts:["Keton","Aldegid","Kislota","Spirt"], ans:0, exp:"C=O guruh o'rtada — keton." },
  { id:'k35', q:"Qaysi modda oksidlovchi agentdir?", opts:["H₂","Na","KMnO₄","CO"], ans:2, exp:"KMnO₄ — kuchli oksidlovchi." },
]

/* ══════════════════════════════════════════════════════════
   BIOLOGIYA
   ═══════════════════════════════════════════════════════ */
export const BIOLOGIYA_POOL = [
  { id:'b1',  q:"Hujayra nazariyasini kim asoslagan?", opts:["Darvin","Shleyden va Shvann","Mendel","Pastern"], ans:1, exp:"Hujayra nazariyasi: Shleyden (o'simliklar, 1838) va Shvann (hayvonlar, 1839)." },
  { id:'b2',  q:"DNK ning to'liq nomi:", opts:["Dezoksiribonuklein kislota","Ribonuklein kislota","Diferoklein kislota","Nukleotid kislota"], ans:0, exp:"Dezoksiribonuklein kislota — irsiyat molekulasi." },
  { id:'b3',  q:"Fotosintez qayerda sodir bo'ladi?", opts:["Mitoxondriya","Xloroplast","Yadro","Ribosoma"], ans:1, exp:"Xloroplast — yashil rangli plastid, fotosintez markazi." },
  { id:'b4',  q:"Qon guruhlarini kim kashf etgan?", opts:["Pastern","Landshteyne","Fleming","Koch"], ans:1, exp:"Karl Landshteyne 1901-yilda qon guruhlarini (A, B, O) kashf etgan." },
  { id:'b5',  q:"Mitoz bo'linishning nechi fazasi bor?", opts:["2","3","4","5"], ans:2, exp:"Mitoz: profaza, metafaza, anafaza, telofaza — 4 faza." },
  { id:'b6',  q:"Odam organizmidagi xromosomalar soni:", opts:["23","46","48","44"], ans:1, exp:"46 xromosoma (23 juft)." },
  { id:'b7',  q:"ATP nima uchun ishlatiladi?", opts:["Oqsil sintezi uchun","Energiya manbayi sifatida","Hujayra bo'linishi uchun","Hormonal signal sifatida"], ans:1, exp:"ATP — hujayradagi universal energiya valyutasi." },
  { id:'b8',  q:"Darvin evoluion nazariyasining asosi nima?", opts:["Lamark irsiyati","Tabiiy tanlanish","Mutatsiya","Izolyatsiya"], ans:1, exp:"Tabiiy tanlanish — Darvin nazariyasining asosi." },
  { id:'b9',  q:"Qaysi to'qima xurmo olmasidan yon elementdir?", opts:["Epiteliy","Biriktiruvchi","Nervlar","Muskul"], ans:1, exp:"Biriktiruvchi to'qima (suyak, qon, yog') — xilma-xil." },
  { id:'b10', q:"Meioz necha marta sodir bo'ladi va natijada nechta hujayra hosil bo'ladi?", opts:["1 marta, 2 hujayra","2 marta, 4 hujayra","1 marta, 4 hujayra","2 marta, 2 hujayra"], ans:1, exp:"Meioz 2 marta bo'linadi, natijada 4 ta gaploid hujayra hosil bo'ladi." },
  { id:'b11', q:"Insulinni qaysi bez ishlab chiqaradi?", opts:["Qalqonsimon bez","Oshqozon osti bezi","Buyrak usti bezi","Gipofiz"], ans:1, exp:"Oshqozon osti bezining beta-hujayralari insulin ishlab chiqaradi." },
  { id:'b12', q:"O'simliklarda suv va tuzlarning harakatlanish naycha tizimi:", opts:["Floema","Ksilema","Sitoplazma","Vakuola"], ans:1, exp:"Ksilema — suv va mineral tuzlar o'tkazuvchi naycha." },
  { id:'b13', q:"Ekologik piramida nima?", opts:["Oziq zanjiri tasvirlanishi","Populyatsiya piramidasi","Trofik darajalar o'rtasidagi energiya nisbati","Biosfera katlamlari"], ans:2, exp:"Trofik darajalar bo'yicha energiya (yoki biomassa) ko'rsatkichlar nisbati." },
  { id:'b14', q:"Viruslar qaysi belgi bo'yicha tirik mavjudotlar toifasiga kirmaydi?", opts:["DNK yoki RNK ga ega","Mustaqil metabolizm yo'q","Ko'payishi mumkin","Evolyutsiya qilishi mumkin"], ans:1, exp:"Viruslar mustaqil metabolizmga ega emas, faqat mezbonda ko'payadi." },
  { id:'b15', q:"Mendel irsiyat qonunlarida nechta asosiy qonun bor?", opts:["1","2","3","4"], ans:2, exp:"Mendel 3 ta qonun: ajralish, mustaqil kombinatsiyalanish va dominant-retsessiv." },
  { id:'b16', q:"Yurakning o'ng qorinchasi qayerga qon pompalaydi?", opts:["Aortaga","O'pka arteriyasiga","Koronar arteriyalarga","Buyraklarga"], ans:1, exp:"O'ng qorincha → o'pka arteriyasi → o'pkalar (venoz qon uchun)." },
  { id:'b17', q:"Ekosistemada parrandapoylar qaysi o'rinda turadi?", opts:["Produtsent","Konsument 1-tartib","Konsument 2-tartib","Redutsent"], ans:3, exp:"Redutsent — organik moddalarni parchalovchi mikro- va makroorganizmlar." },
  { id:'b18', q:"Hayvonlarda ontogenezning boshlang'ich bosqichi:", opts:["Lichinka","Zigota","Embrion","Pupal"], ans:1, exp:"Ontogenez zigotadan boshlanadi (urug'langan tuxum hujayra)." },
  { id:'b19', q:"Fermentlar kimyoviy jihatdan asosan:", opts:["Lipidlar","Oqsillar","Uglevodlar","Nukleotidlar"], ans:1, exp:"Fermentlar — biologik katalizatorlar, asosan oqsillardan iborat." },
  { id:'b20', q:"Homiladorlik muddatida ayol organizmida ko'payuvchi gormon:", opts:["Testosteron","Estrogen","Progesteron","Insulin"], ans:2, exp:"Progesteron — homiladorlikni saqlovchi asosiy gormon." },
  { id:'b21', q:"Qaysi organoid hujayrani qayta ishlaydi va lizis qiladi?", opts:["Ribosoma","Lizosoma","Mitoxondriya","Gol'ji apparati"], ans:1, exp:"Lizosoma — hujayra ichidagi 'hazm qilish' organoidi." },
  { id:'b22', q:"O'simlik hujayrasi hayvon hujayrasi dan qanday farqlanadi?", opts:["Yadro yo'q","Xloroplast va hujayra devori bor","Mitoxondriya yo'q","Ribosoma yo'q"], ans:1, exp:"O'simlik hujayrasi: xloroplast + qattiq hujayra devori." },
  { id:'b23', q:"Qonning qaysi tarkibiy qismi kislorod tashiydi?", opts:["Leykositlar","Trombositlar","Eritrositlar","Plazma"], ans:2, exp:"Eritrositlar (qizil qon tanachalari) — gemoglobin orqali O₂ tashiydi." },
  { id:'b24', q:"Qaysi vitamin nurdan hosil bo'ladi?", opts:["A vitamini","B₁₂ vitamini","D vitamini","C vitamini"], ans:2, exp:"D vitamini — teri quyosh nuri (UV) ta'sirida sintez qiladi." },
  { id:'b25', q:"Tabiiy muhitda o'z-o'zidan hosil bo'lgan organizmlarning turlanishi:", opts:["Abiogenez","Biopoez","Evolyutsiya","Spekulyatsiya"], ans:2, exp:"Evolyutsiya — tabiiy selektsiya asosida tur o'zgarishi." },
  { id:'b26', q:"Bezgak kasalligini qo'zg'atuvchi organizmning turi:", opts:["Bakteriya","Virus","Zamburug'","Sodda hayvon (protozoa)"], ans:3, exp:"Bezgak — Plasmodium sp. (sodda hayvon) qo'zg'atadi." },
  { id:'b27', q:"Ko'pchilik o'simliklarning urug'lantirish jarayoni qayerda sodir bo'ladi?", opts:["Changchi","Urug'chi","Gulbargi","Sapka"], ans:1, exp:"Urug'chi (pistil) tarkibidagi tuguncha — urug'lanish joyi." },
  { id:'b28', q:"Energiya metabolizmidagi glikoliz qayerda sodir bo'ladi?", opts:["Xloroplast","Mitoxondriya","Sitoplazma","Yadro"], ans:2, exp:"Glikoliz — sitoplazma matriksida (10 ta fermentli reaksiya)." },
  { id:'b29', q:"O'pka alveolalarida qanday gaz almashinuvi sodir bo'ladi?", opts:["CO₂ kiradi, O₂ chiqadi","O₂ kiradi, CO₂ chiqadi","Faqat O₂ o'tadi","Faqat CO₂ o'tadi"], ans:1, exp:"O₂ qonga o'tadi, CO₂ o'pkadan chiqariladi." },
  { id:'b30', q:"Hayvonlarda homeostatik asosiy organ — buyrak — bajaruvchi asosiy vazifa:", opts:["Oqsil sintezi","Qon tozalash va moddalar almashinuvi tartibga solish","Insulin ishlab chiqarish","Immunitet"], ans:1, exp:"Buyrak — qon filtratsiyasi, homeostaz, ionlar muvozanati." },
  { id:'b31', q:"O'rgimchaklar nechi oyoqli?", opts:["6","8","10","12"], ans:1, exp:"O'rgimchaklar — 8 oyoqli artropodlar." },
  { id:'b32', q:"Fotosintez uchun kerakli moddalar:", opts:["O₂ va CO₂","CO₂ va H₂O","O₂ va H₂O","N₂ va O₂"], ans:1, exp:"Fotosintez: CO₂ + H₂O + yorug'lik → glyukoza + O₂." },
  { id:'b33', q:"Eng kichik tirik organizmlar:", opts:["Bakteriyalar","Viruslar","Zamburug'lar","Suvo'tlar"], ans:1, exp:"Viruslar — 20–300 nm, eng kichik biologik vositalar." },
  { id:'b34', q:"Jigar qanday vazifani bajaradi?", opts:["Nafas olish","Detoksifikatsiya va o't ishlab chiqarish","Qon pompalash","Oqsil hazm qilish"], ans:1, exp:"Jigar — detoks, o't ishlab chiqarish, glikogen saqlash va boshqalar." },
  { id:'b35', q:"Tropik o'rmonlarda biota xilma-xilligi shunday yuqori bo'lishining sababi:", opts:["Kam yomg'ir","Yuqori harorat va namlik","Kam yer maydoni","Sanoat yo'qligi"], ans:1, exp:"Tropik o'rmonlar: yuqori harorat + ko'p yomg'ir → maqbul o'sish sharoiti." },
]

/* ══════════════════════════════════════════════════════════
   TARIX
   ═══════════════════════════════════════════════════════ */
export const TARIX_POOL = [
  { id:'t1',  q:"O'zbekiston mustaqilligini qachon e'lon qildi?", opts:["1990","1991","1992","1989"], ans:1, exp:"O'zbekiston mustaqilligi — 1991-yil 1-sentabr." },
  { id:'t2',  q:"Amir Temur poytaxti qaysi shaharda bo'lgan?", opts:["Buxoro","Samarqand","Toshkent","Xiva"], ans:1, exp:"Amir Temur poytaxti — Samarqand." },
  { id:'t3',  q:"Ikkinchi Jahon urushi qachon tugagan?", opts:["1944","1945","1946","1943"], ans:1, exp:"II Jahon urushi — 1945-yil 8-may (Yevropa) va 2-sentabr (Tinch okeani)." },
  { id:'t4',  q:"Buyuk Ipak Yo'li qaysi shaharlarni bog'lagan?", opts:["Rim–Hindiston","Xitoy–O'rta er","Misr–Xitoy","Rim–Xitoy"], ans:3, exp:"Buyuk Ipak Yo'li: Xitoydan O'rta yer dengiziga qadar, Rim shahrlarigacha." },
  { id:'t5',  q:"Birinchi Jahon urushi qachon boshlangan?", opts:["1912","1914","1916","1918"], ans:1, exp:"I Jahon urushi — 1914-yil 28-iyul." },
  { id:'t6',  q:"Al-Xorazmiy qaysi sohada buyuk olim?", opts:["Astronomiya","Matematika va algebra","Tibbiyot","Falsafa"], ans:1, exp:"Al-Xorazmiy — algebra fanining asoschisi." },
  { id:'t7',  q:"Amerikaning mustaqillik deklaratsiyasi qachon imzolangan?", opts:["1774","1775","1776","1777"], ans:2, exp:"1776-yil 4-iyul — AQSh mustaqillik deklaratsiyasi." },
  { id:'t8',  q:"Frantsuz inqilobi qachon boshlangan?", opts:["1787","1788","1789","1790"], ans:2, exp:"Frantsuz inqilobi — 1789-yil (Bastiliya qaml 14-iyul)." },
  { id:'t9',  q:"Ibn Sino (Avitsenna) asosiy asari:", opts:["Al-Jabr","Qonun fit-tibb","Muqaddima","Ruboiylar"], ans:1, exp:"Ibn Sinoning 'Qonun fit-tibb' — tibbiyot ensiklopediyasi." },
  { id:'t10', q:"Sovet Ittifoqi qachon tarqab ketdi?", opts:["1989","1990","1991","1992"], ans:2, exp:"SSSR rasman 1991-yil 25-dekabrda tarqab ketdi." },
  { id:'t11', q:"O'zbekiston Respublikasi Konstitutsiyasi qachon qabul qilingan?", opts:["1991","1992","1993","1994"], ans:1, exp:"O'zbekiston Konstitutsiyasi — 1992-yil 8-dekabr." },
  { id:'t12', q:"Chingizxon kim bo'lgan?", opts:["Arab xalifalari","Mo'g'ul imperiyasi asoschisi","Turk sultoni","Xitoy imperatori"], ans:1, exp:"Chingizxon — Mo'g'ul imperiyasi asoschisi (1206)." },
  { id:'t13', q:"Temurylar sulolasi kim tomonidan asos solingan?", opts:["Shohruh","Ulug'bek","Amir Temur","Bobur"], ans:2, exp:"Temurylar sulolasi — Amir Temur tomonidan, 1370-yil." },
  { id:'t14', q:"Qaysi shahar O'zbek xonliklarining asosiy markazi bo'lgan?", opts:["Toshkent","Buxoro","Farg'ona","Qarshi"], ans:1, exp:"Buxoro — markaziy O'rta Osiyodagi muhim siyosiy-madaniy markaz." },
  { id:'t15', q:"Ulug'bek rasadxonasi qayerda joylashgan?", opts:["Buxoro","Samarqand","Xiva","Toshkent"], ans:1, exp:"Ulug'bek rasadxonasi — Samarqandda, XV asr." },
  { id:'t16', q:"Janubi-Sharqiy Osiyo millatlari assotsiatsiyasi (ASEAN) qachon tashkil etilgan?", opts:["1955","1961","1967","1975"], ans:2, exp:"ASEAN — 1967-yil 8-avgust, Bangkok deklaratsiyasi." },
  { id:'t17', q:"Sobiq mustamlakachilik davrida 'Buyuk o'yin' nima?", opts:["Olimpiya o'yinlari","Angliya va Rossiyaning O'rta Osiyo uchun raqobati","Savdo shartnomasi","Xarbiy ittifoq"], ans:1, exp:"'Buyuk o'yin' — XIX asrda Angliya va Rossiyaning O'rta Osiyo ta'sirini nazorat uchun raqobati." },
  { id:'t18', q:"Noma'lum askarga bag'ishlangan monumentda O'zbek shahidlari nechta?", opts:["400 ming","500 ming","400 000 dan ortiq","600 000"], ans:2, exp:"400 000 dan ortiq o'zbek fuqarosi II Jahon urushida halok bo'lgan." },
  { id:'t19', q:"Movarounnahr nima?", opts:["Tog'li o'lka","Amudaryo va Sirdaryoning oralig'i","Janubiy O'zbekiston","Farg'ona vodiysi"], ans:1, exp:"Movarounnahr — arabcha 'daryolar orasidagi hudud', Amudaryo va Sirdaryo oralig'i." },
  { id:'t20', q:"Birinchi xalqaro olimpiya o'yinlari qachon va qayerda bo'lgan?", opts:["1892 Parijda","1896 Afinada","1900 Londonda","1904 Rim"], ans:1, exp:"1896-yil Afina — I zamonaviy olimpiya o'yinlari." },
  { id:'t21', q:"Qozonxon kim edi?", opts:["Xorazmshoh","Oltin O'rda xoni","Chig'atoy xoni","Temuriy shoh"], ans:2, exp:"Qozon — XIV asrda Chig'atoy ulusi xoni." },
  { id:'t22', q:"O'zbekiston SSRining birinchi rahbari:", opts:["Xo'jayev","Rahimov","Sharafiddinov","Yunusov"], ans:0, exp:"Fayzulla Xo'jayev — O'zbekiston SSR birinchi rahbari." },
  { id:'t23', q:"Xorazmshohlar sulolasi poytaxti:", opts:["Samarqand","Urgench","Xiva","Termiz"], ans:1, exp:"Gurganj (Urgench) — Xorazmshohlar sulolasining poytaxti." },
  { id:'t24', q:"NATO qachon tashkil etilgan?", opts:["1945","1947","1949","1951"], ans:2, exp:"NATO — 1949-yil 4-aprel, Vashington shartnomasiga asosan." },
  { id:'t25', q:"Birinchi kosmik yo'lovchi Kim edi?", opts:["Neil Armstrong","Yuriy Gagarin","Alan Shepard","Valentina Tereşkova"], ans:1, exp:"Yuriy Gagarin — 1961-yil 12-aprel, birinchi kosmik yo'lovchi." },
  { id:'t26', q:"Temuriylar davlatining eng katta hududiy qamrovi qaysi davrda bo'lgan?", opts:["Amir Temur davrida","Ulug'bek davrida","Shohruh davrida","Husayn Boyqaro davrida"], ans:0, exp:"Amir Temur davrida (XIV asr) eng katta hudud." },
  { id:'t27', q:"Nishon shahri (Karshi) kimning hukmronligi paytida rivojlangan?", opts:["Buxoro amirligida","Xiva xonligida","Qo'qon xonligida","Qashqadaryoda mustaqil"], ans:0, exp:"Qarshi (Nasaf/Nakhshab) — Buxoro amirligi tarkibida rivojlangan." },
  { id:'t28', q:"Qaysi shaxs O'zbekistonda ham xon, ham shoir bo'lgan?", opts:["Ulug'bek","Bobur","Haydar Mirzo","Navoiy"], ans:1, exp:"Bobur — Farg'ona xoni va buyuk shoir (Boburnoma)." },
  { id:'t29', q:"XDT (Xalqaro Demokratik Tartibot) tashkiloti deb qaysi tashkilot ham tanilgan?", opts:["BMT","NATO","Komintern","Varshava Pakti"], ans:2, exp:"Komintern — xalqaro kommunistik tashkilot (1919–1943)." },
  { id:'t30', q:"Samarqandning Registon maydoni qachon qurilgan?", opts:["XIV asr","XV asr","XVI–XVII asr","XIII asr"], ans:2, exp:"Registon ansambli XV–XVII asrlarda yakunlangan." },
  { id:'t31', q:"Rus imperiyasi O'rta Osiyoni qachon bosib oldi?", opts:["1840-1850","1860-1880","1890-1900","1850-1860"], ans:1, exp:"1865–1876-yillar — Rossiya O'rta Osiyoni bosib oldi." },
  { id:'t32', q:"Berlin devori qachon qurilgan?", opts:["1959","1961","1963","1965"], ans:1, exp:"Berlin devori — 1961-yil 13-avgust." },
  { id:'t33', q:"BMT qachon tashkil etilgan?", opts:["1943","1944","1945","1946"], ans:2, exp:"BMT — 1945-yil 24-oktabr." },
  { id:'t34', q:"O'zbekistonda siyosiy birlik tizimi qaysi yillarda bo'lgan?", opts:["1924–1936","1925–1991","1930–1991","1924–1991"], ans:3, exp:"O'zbekiston SSR — 1924 yil tashkil etildi, 1991 yilda tarqaldi." },
  { id:'t35', q:"Qaysi jang O'rta Osiyoning Mongol qo'shinlari tomonidan bosib olinishini yakunladi?", opts:["Otrar jangi","Samarqand jangi","Indus jangi","Merv jangi"], ans:0, exp:"Otrar jangi (1219) — Chingizxon O'rta Osiyo yurishining boshlanishi." },
]

/* ══════════════════════════════════════════════════════════
   GEOGRAFIYA
   ═══════════════════════════════════════════════════════ */
export const GEOGRAFIYA_POOL = [
  { id:'g1',  q:"O'zbekistonning eng baland tog'i:", opts:["Chimyon","Xazratishoh","Beshtor","Chilonzor"], ans:1, exp:"Xazratishoh tog'i — O'zbekistondagi eng baland tog' (4643 m)." },
  { id:'g2',  q:"Dunyo bo'yicha eng katta okean:", opts:["Atlantika","Hind","Tinch (Pasifik)","Shimoliy Muz"], ans:2, exp:"Tinch okean — dunyodagi eng katta va chuqur okean." },
  { id:'g3',  q:"O'zbekistonning poytaxti:", opts:["Samarqand","Buxoro","Toshkent","Navoiy"], ans:2, exp:"Toshkent — O'zbekiston poytaxti." },
  { id:'g4',  q:"Eng uzun daryo:", opts:["Amazon","Nil","Yangtze","Missisipi"], ans:1, exp:"Nil — 6650 km bilan eng uzun daryo." },
  { id:'g5',  q:"O'zbekistonda eng ko'p aholi qaysi viloyatda?", opts:["Toshkent","Farg'ona","Samarqand","Andijon"], ans:0, exp:"Toshkent viloyati (shahar bilan birga) — eng ko'p aholi." },
  { id:'g6',  q:"O'rta er dengizining eng katta oroli:", opts:["Sitsiliya","Korsika","Krit","Malta"], ans:0, exp:"Sitsiliya — O'rta er dengizining eng katta oroli." },
  { id:'g7',  q:"Sahara cho'lining maydoni taxminan:", opts:["5 mln km²","7 mln km²","9 mln km²","11 mln km²"], ans:2, exp:"Sahara ≈ 9.2 mln km² — dunyo cho'llarining eng kattasi." },
  { id:'g8',  q:"O'zbekiston nechanchi kenglikda joylashgan?", opts:["30–45° sh.k.","37–45° sh.k.","25–40° sh.k.","35–42° sh.k."], ans:1, exp:"O'zbekiston — taxminan 37°–45° shimoliy kenglikda joylashgan." },
  { id:'g9',  q:"Dunyo bo'yicha eng katta mamlakat (maydon):", opts:["Xitoy","Kanada","Rossiya","AQSh"], ans:2, exp:"Rossiya — 17.1 mln km² bilan eng katta davlat." },
  { id:'g10', q:"Kaspiy dengizi aslida nima?", opts:["Dengiz","Ko'l","Daryo","Qo'ltiq"], ans:1, exp:"Kaspiy — dunyodagi eng katta yopiq ko'l (tuzli)." },
  { id:'g11', q:"O'zbekiston qancha viloyatdan iborat?", opts:["11","12","13","14"], ans:2, exp:"O'zbekistonda 12 viloyat + Qoraqalpog'iston Respublikasi + Toshkent shahri." },
  { id:'g12', q:"Amazon o'rmonlari qaysi qit'ada joylashgan?", opts:["Afrika","Osiyo","Janubiy Amerika","Shimoliy Amerika"], ans:2, exp:"Amazonka basseynidagi yomg'ir o'rmonlari — Janubiy Amerika." },
  { id:'g13', q:"Yer sharining eng chuqur joyи:", opts:["Mariana botqog'i","Puerto-Riko cho'kmasi","Sund cho'kmasi","Tonga cho'kmasi"], ans:0, exp:"Mariana (Marian) cho'kmasi — Tinch okeanida, ≈ 11 000 m." },
  { id:'g14', q:"Orol dengizining qurishiga asosiy sabab:", opts:["Global isish","Amudaryo va Sirdaryo suvining irrigatsiyaga olishi","Sanoat iflosligi","Zilzila"], ans:1, exp:"Amudaryo va Sirdaryo paxtachilik irrigatsiyasiga yo'naltirildi → Orol qurib qoldi." },
  { id:'g15', q:"Evropaning eng uzun daryosi:", opts:["Dnepr","Volga","Rein","Dunay"], ans:1, exp:"Volga — Evropadagi eng uzun daryo (3 530 km)." },
  { id:'g16', q:"Antarktida qit'asida harorat qaysi chegarada turadi?", opts:["−20°C gacha","−40°C gacha","−89°C gacha","−60°C gacha"], ans:2, exp:"Antarktida rekord: −89.2°C (Vostok stantsiyasi, 1983)." },
  { id:'g17', q:"Farg'ona vodiysi qaysi tog' tizmalari orasida joylashgan?", opts:["Hisor va Zararshon","Tyan-Shan va Pomir","Kopetdag va Orol","Oltoy va Sayan"], ans:1, exp:"Farg'ona vodiysi — Tyan-Shan va Pomir tog' tizmalari orasida." },
  { id:'g18', q:"Hind okeaniga qo'yiluvchi eng katta daryo:", opts:["Ganga","Brahmaputra","Zambezi","Amur"], ans:0, exp:"Ganga — Hind okeaniga quyiluvchi eng muhim daryolardan biri." },
  { id:'g19', q:"Islandiya qaysi plita chegarasida joylashgan?", opts:["Yevroosiyo va Shimoliy Amerika","Afrika va Yevroosiyo","Hind-Avstraliya va Yevroosiyo","Tinch okean va Yevroosiyo"], ans:0, exp:"Islandiya — Yevroosiyo va Shimoliy Amerika litosfera plitalarining chegarasida." },
  { id:'g20', q:"O'zbekistondan o'tuvchi asosiy temir yo'l:", opts:["Poyezdlik Yo'li","Transsib","O'rta Osiyo temir yo'li","Ipak Yo'li tranzit"], ans:2, exp:"O'rta Osiyo temir yo'li — Rossiya va O'rta Osiyoni bog'laydi." },
  { id:'g21', q:"Dunyo bo'yicha eng baland daryo tizimi qaysi tog'da?", opts:["Alp","And","Gimalay","Kavkaz"], ans:2, exp:"Gimalay — Gangotri muzligi va eng baland daryolar manbai." },
  { id:'g22', q:"O'zbekiston chegaradosh mamlakatlar soni:", opts:["3","4","5","6"], ans:2, exp:"5 ta: Qozog'iston, Tojikiston, Qirg'iziston, Afg'oniston, Turkmaniston." },
  { id:'g23', q:"Nechta qit'a bor?", opts:["5","6","7","8"], ans:2, exp:"7 ta qit'a: Yevroosiyo, Afrika, Shimoliy Amerika, Janubiy Amerika, Antarktida, Avstraliya, Okeaniya (5 yoki 6 hisoblanadigan versiyalar ham bor — bu yer 7)." },
  { id:'g24', q:"Qaysi davlatda eng ko'p aholi?", opts:["Hindiston","Xitoy","AQSh","Indoneziya"], ans:0, exp:"2023-yildan Hindiston dunyodagi eng ko'p aholiga ega davlat." },
  { id:'g25', q:"Yer yuzasining necha foizini okeanlar egallaydi?", opts:["51%","61%","71%","81%"], ans:2, exp:"Okeanlar ≈ 71% ni egallaydi." },
  { id:'g26', q:"Sahroi Kabir (Sahara) qaysi qit'ada joylashgan?", opts:["Osiyo","Afrika","Janubiy Amerika","Avstraliya"], ans:1, exp:"Sahara — Shimoliy Afrikada." },
  { id:'g27', q:"Toshkent shahri qaysi daryoning bo'yida joylashgan?", opts:["Amudaryo","Chirchiq","Norin","Sirdaryo"], ans:1, exp:"Toshkent — Chirchiq daryosi bo'yida joylashgan." },
  { id:'g28', q:"Dunyo bo'yicha eng katta cho'l (muzlik sanalsa):", opts:["Sahara","Gobi","Antarktida","Arabian"], ans:2, exp:"Antarktida — eng katta cho'l (sovuq va quruq, ≈14 mln km²)." },
  { id:'g29', q:"O'zbekiston qaysi mintaqada joylashgan?", opts:["Sharqiy Osiyo","Janubi-G'arbiy Osiyo","Markaziy Osiyo","G'arbiy Osiyo"], ans:2, exp:"O'zbekiston — Markaziy Osiyo mintaqasida." },
  { id:'g30', q:"Yer sharining magnit qutblari joylashgan joylar:", opts:["Geografik qutblar bilan bir xil","Geografik qutblardan farqli joylarda","Ekvator yaqinida","Tropiklardan o'tadi"], ans:1, exp:"Magnit qutblar geografik qutblar bilan to'g'ri kelmaydi va harakatlanib turadi." },
  { id:'g31', q:"Dunyo bo'yicha eng katta ko'l:", opts:["Kaspiy","Baykal","Tanganika","Viktoriya"], ans:0, exp:"Kaspiy — maydoni bo'yicha eng katta ko'l (agar ko'l deb hisoblasak)." },
  { id:'g32', q:"O'zbekistonning janubidagi tog' tizmalari:", opts:["Tyan-Shan","Pomir-Oloy","Hisor-Oloy","Kopetdag"], ans:2, exp:"Hisor-Oloy tizimi — janubiy va janubi-sharqiy chegarada." },
  { id:'g33', q:"Yevropa va Osiyoni ajratib turuvchi chegara:", opts:["Dnepr daryosi","Ural tog'lari va Kaspiy","Bolqon tog'lari","Don daryosi"], ans:1, exp:"Ural tog'lari + Ural daryosi + Kaspiy dengizi — Yevropa va Osiyo chegarasi." },
  { id:'g34', q:"Qizildaryo qaysi okean qo'ltig'i?", opts:["Atlantika","Hind","Tinch okean","Shimoliy Muz"], ans:1, exp:"Qizil dengiz — Hind okeanining ko'rfazi." },
  { id:'g35', q:"O'zbekistonning eng issiq viloyati:", opts:["Xorazm","Surxondaryo","Qashqadaryo","Buxoro"], ans:1, exp:"Surxondaryo viloyati — eng issiq viloyat (yozda +50°C ga yetadi)." },
]

/* ══════════════════════════════════════════════════════════
   INGLIZ TILI
   ═══════════════════════════════════════════════════════ */
export const INGLIZ_TILI_POOL = [
  { id:'i1',  q:"'She ___ to school every day.' Fill in the blank.", opts:["go","goes","went","going"], ans:1, exp:"3rd person singular present: goes." },
  { id:'i2',  q:"Translate: 'Kitob'", opts:["Pen","Book","Table","Chair"], ans:1, exp:"Kitob = Book." },
  { id:'i3',  q:"Choose the correct past tense of 'go':", opts:["Goed","Goes","Went","Gone"], ans:2, exp:"Go → Went (irregular verb)." },
  { id:'i4',  q:"'I have lived here ___ 2010.'", opts:["for","since","from","during"], ans:1, exp:"'Since' — ma'lum bir vaqtdan beri." },
  { id:'i5',  q:"Which is a preposition?", opts:["Run","Beautiful","On","Quickly"], ans:2, exp:"'On' — predlog (preposition)." },
  { id:'i6',  q:"Plural of 'child':", opts:["Childs","Children","Childes","Child"], ans:1, exp:"Irregular plural: child → children." },
  { id:'i7',  q:"'He ___ reading a book now.' (Present Continuous)", opts:["is","are","was","be"], ans:0, exp:"He + is + Verb-ing — present continuous." },
  { id:'i8',  q:"Synonym of 'happy':", opts:["Sad","Angry","Joyful","Tired"], ans:2, exp:"Joyful = happy (xursand)." },
  { id:'i9',  q:"'If I ___ you, I would study harder.'", opts:["am","was","were","be"], ans:2, exp:"2nd conditional: If I were you… (subjunctive)." },
  { id:'i10', q:"Passive voice: 'They built the house.' →", opts:["The house built.","The house was built.","The house has built.","The house is built."], ans:1, exp:"Past passive: was + V3." },
  { id:'i11', q:"Antonym of 'expand':", opts:["Grow","Contract","Increase","Widen"], ans:1, exp:"Contract = shrink = opposite of expand." },
  { id:'i12', q:"Which sentence is in Present Perfect?", opts:["I go home.","I went home.","I have gone home.","I am going home."], ans:2, exp:"Present Perfect: have/has + V3." },
  { id:'i13', q:"'The book ___ I bought is interesting.'", opts:["who","which","whom","whose"], ans:1, exp:"'Which' — narsa uchun relative pronoun." },
  { id:'i14', q:"Reported speech: 'He said, \"I am tired.\"'", opts:["He said he is tired.","He said he was tired.","He said he were tired.","He told he was tired."], ans:1, exp:"Direct → Indirect: am → was." },
  { id:'i15', q:"'Despite the rain, ___'", opts:["but they went out.","they went out.","however they went out.","although they went out."], ans:1, exp:"'Despite + noun, [clause]' — 'they went out.' to'g'ri davom." },
  { id:'i16', q:"'Not only ___ late, but also rude.'", opts:["she was","was she","she is","is she"], ans:1, exp:"Not only + inversion: was she." },
  { id:'i17', q:"'I wish I ___ more time.'", opts:["have","had","will have","would have"], ans:1, exp:"Wish + past simple for present unreal wish." },
  { id:'i18', q:"Gerund or infinitive? 'I enjoy ___'", opts:["to swim","swimming","swim","swam"], ans:1, exp:"Enjoy + Gerund (swimming)." },
  { id:'i19', q:"Meaning of 'meticulous':", opts:["Careless","Very detailed and careful","Generous","Brave"], ans:1, exp:"Meticulous — diqqatli, aniq." },
  { id:'i20', q:"'By the time she arrived, we ___ dinner.'", opts:["finish","finished","had finished","have finished"], ans:2, exp:"Past perfect: had + V3 (oldinroq tugagan harakat)." },
  { id:'i21', q:"'She is ___ honest person.'", opts:["a","an","the","—"], ans:1, exp:"'Honest' unlidan boshlanadi → an." },
  { id:'i22', q:"Which is a modal verb?", opts:["Run","Should","Quick","Often"], ans:1, exp:"Should — modal verb." },
  { id:'i23', q:"'He ___ the exam if he had studied.'", opts:["pass","passed","would pass","would have passed"], ans:3, exp:"3rd conditional: would have + V3." },
  { id:'i24', q:"Noun form of 'decide':", opts:["Decisive","Decision","Decided","Decisively"], ans:1, exp:"Decide → Decision (noun)." },
  { id:'i25', q:"Adverb form of 'quick':", opts:["Quick","Quicker","Quickly","Quickest"], ans:2, exp:"Quick + -ly = quickly (adverb)." },
  { id:'i26', q:"'He is ___ than his brother.' (tall)", opts:["more tall","tallest","taller","most tall"], ans:2, exp:"Comparative adjective: tall → taller." },
  { id:'i27', q:"Choose the correct question tag: 'She sings well, ___?'", opts:["doesn't she","does she","isn't she","wasn't she"], ans:0, exp:"Positive sentence + negative tag: doesn't she?" },
  { id:'i28', q:"Which phrase means 'give up'?", opts:["Take off","Put on","Give in","Look up"], ans:2, exp:"Give in = surrender = give up." },
  { id:'i29', q:"'___ is the tallest mountain in the world?'", opts:["Where","What","Which","Who"], ans:1, exp:"'What' — narsani so'rasak (Mount Everest)." },
  { id:'i30', q:"'She has been working ___ eight hours.'", opts:["since","for","during","from"], ans:1, exp:"Duration (muddat) uchun: for + period." },
  { id:'i31', q:"Correct spelling:", opts:["Accomodate","Accommodate","Accomadete","Acomodate"], ans:1, exp:"Accommodate — ikki 'c' va ikki 'm'." },
  { id:'i32', q:"'The more you read, ___ you learn.'", opts:["the more","more","most","the most"], ans:0, exp:"'The more... the more' — parallel taqqoslash." },
  { id:'i33', q:"Meaning of 'procrastinate':", opts:["To plan ahead","To delay tasks","To work hard","To celebrate"], ans:1, exp:"Procrastinate — ishni keyinga qoldirmoq." },
  { id:'i34', q:"'She suggested ___ early.'", opts:["leave","to leave","leaving","that we left"], ans:2, exp:"Suggest + gerund: suggest leaving." },
  { id:'i35', q:"Which word is a conjunction?", opts:["However","Although","Nevertheless","All of these"], ans:3, exp:"Hammasi conjunction (bog'lovchi) vazifasini bajarishi mumkin." },
]

/* ══════════════════════════════════════════════════════════
   INFORMATIKA
   ═══════════════════════════════════════════════════════ */
export const INFORMATIKA_POOL = [
  { id:'in1',  q:"1 bayt necha bitdan iborat?", opts:["4","8","16","32"], ans:1, exp:"1 byte = 8 bit." },
  { id:'in2',  q:"HTML qisqartmasi nima?", opts:["HyperText Markup Language","High Text Modern Language","HyperText Modern Links","High Transfer Markup Language"], ans:0, exp:"HTML — HyperText Markup Language." },
  { id:'in3',  q:"Qaysi til tarmoq serverlarida eng ko'p ishlatiladigan?", opts:["Java","Python","PHP","JavaScript"], ans:2, exp:"PHP — web serverlar uchun keng tarqalgan til." },
  { id:'in4',  q:"CPU nima?", opts:["Markaziy protsessor birlik","Kompyuter Power Unit","Central Port Unit","Core Process Unit"], ans:0, exp:"CPU — Central Processing Unit (markaziy protsessor)." },
  { id:'in5',  q:"Ikkilik (binary) sistemada 1010 = ?", opts:["8","10","12","14"], ans:1, exp:"1×8 + 0×4 + 1×2 + 0×1 = 10." },
  { id:'in6',  q:"'www' nima anglatadi?", opts:["World Wide Web","World Wave Web","Web World Wire","World Wire Wide"], ans:0, exp:"www — World Wide Web." },
  { id:'in7',  q:"RAM nima?", opts:["Read Access Memory","Random Access Memory","Real Application Memory","Remote Access Module"], ans:1, exp:"RAM — Random Access Memory (tasodifiy kirish xotira)." },
  { id:'in8',  q:"CSS da rangni belgilash uchun:", opts:["color: blue;","colour: blue;","text-color: blue;","font-color: blue;"], ans:0, exp:"CSS: color: blue; to'g'ri sintaksis." },
  { id:'in9',  q:"Python dasturlash tilini kim yaratgan?", opts:["Dennis Ritchie","Guido van Rossum","Bjarne Stroustrup","James Gosling"], ans:1, exp:"Python — Guido van Rossum, 1991." },
  { id:'in10', q:"Internetning kasbiy dastlabki nomi:", opts:["ARPANET","DARPANET","NetWork","WebNet"], ans:0, exp:"ARPANET — 1969-yilda AQSh mudofaa vazirligining tarmog'i." },
  { id:'in11', q:"Qaysi fayl kengaytmasi rasm faylidir?", opts:[".mp3",".docx",".png",".xlsx"], ans:2, exp:".png — rasm (Portable Network Graphics)." },
  { id:'in12', q:"For loop qanday ishlaydi?", opts:["Faqat bir marta","Shartga qarab","Belgilangan marta yoki kolleksiya bo'ylab","Hech qachon to'xtatilmaydi"], ans:2, exp:"For loop — belgilangan marta yoki kolleksiya elementlari bo'ylab ishlaydi." },
  { id:'in13', q:"SQL nima?", opts:["Simple Query Language","Structured Query Language","Sequential Question Language","Standard Query Library"], ans:1, exp:"SQL — Structured Query Language (ma'lumotlar bazasi uchun)." },
  { id:'in14', q:"OOP — Object Oriented Programming asosiy tushunchalari:", opts:["Sinf, Ob'ekt, Meros, Polimorfizm","Sikl, Shart, Funksiya","Algoritm, Grafikalar","Til, Kompilyator, Debug"], ans:0, exp:"OOP: Class, Object, Inheritance, Polymorphism, Encapsulation." },
  { id:'in15', q:"Git nima uchun ishlatiladi?", opts:["Ma'lumotlar bazasi","Versiya nazorat tizimi","Server yaratish","Veb dizayn"], ans:1, exp:"Git — versiya nazorat tizimi (version control system)." },
  { id:'in16', q:"16-lik (hexadecimal) sanoq sistemasida FF = ?", opts:["128","255","256","240"], ans:1, exp:"FF = 15×16 + 15 = 255." },
  { id:'in17', q:"Operatsion tizim misollari:", opts:["Google Chrome, Firefox","Windows, Linux, macOS","Microsoft Word, Excel","MySQL, PostgreSQL"], ans:1, exp:"OS: Windows, Linux, macOS, Android, iOS." },
  { id:'in18', q:"Rekursiya nima?", opts:["Funksiya o'zini chaqirishi","Ikki funksiya bir-birini chaqirishi","Tsikl ichida tsikl","Shartli ifoda"], ans:0, exp:"Rekursiya — funksiyaning o'zini chaqirishi." },
  { id:'in19', q:"HTTP statuslari: 404 nima?", opts:["Muvaffaqiyatli","Not Found (topilmadi)","Server xatosi","Redirect"], ans:1, exp:"404 Not Found — so'ralgan sahifa topilmadi." },
  { id:'in20', q:"JSON nima?", opts:["JavaScript Object Notation","JavaScript Open Network","Java Serialized Output Name","Json Script Only Notation"], ans:0, exp:"JSON — JavaScript Object Notation, ma'lumot almashish formati." },
  { id:'in21', q:"Qaysi algoritm eng tez saralaydi (katta ma'lumotlar uchun)?", opts:["Bubble sort","Selection sort","Quick sort","Insertion sort"], ans:2, exp:"Quick sort — o'rtacha O(n log n) murakkablik." },
  { id:'in22', q:"Firewall nima qiladi?", opts:["Viruslarni yo'q qiladi","Tarmoq trafikini filtrlaydi","Diskni tezlashtiradi","Fayllarni siqadi"], ans:1, exp:"Firewall — tarmoq trafikini nazorat qiladi va filtrlaydi." },
  { id:'in23', q:"Boolean o'zgaruvchi qanday qiymatlarni olishi mumkin?", opts:["0 va 1","True va False","Har qanday son","Matn yoki son"], ans:1, exp:"Boolean: True yoki False." },
  { id:'in24', q:"URL nima?", opts:["Uniform Resource Locator","Universal Reader Link","Unique Request Location","Unified Resource Layer"], ans:0, exp:"URL — Uniform Resource Locator (internet manzil)." },
  { id:'in25', q:"Python'da ro'yxat (list) yaratish:", opts:["arr = {}","arr = []","arr = ()","arr = <>"], ans:1, exp:"Python listlar square brackets bilan: arr = []." },
  { id:'in26', q:"Kriptografiyada 'hashing' nima?", opts:["Ma'lumotni shifrlash","Ma'lumotdan qisqa belgi chiqarish","Parolni saqlash","Ma'lumotni o'chirish"], ans:1, exp:"Hashing — bir yo'nalishli funksiya, ma'lumotdan qisqa hash chiqaradi." },
  { id:'in27', q:"API nima?", opts:["Application Programming Interface","Advanced Program Input","Automated Protocol Integration","Application Package Installer"], ans:0, exp:"API — Application Programming Interface (dasturlar interfeysi)." },
  { id:'in28', q:"Qaysi protokol veb saytlar uchun xavfsiz ma'lumot uzatadi?", opts:["HTTP","FTP","HTTPS","SMTP"], ans:2, exp:"HTTPS — HTTP over TLS/SSL, shifrlangan kanal." },
  { id:'in29', q:"Stack ma'lumotlar strukturasi qanday ishlaydi?", opts:["FIFO","LIFO","Random","Sorted"], ans:1, exp:"Stack — Last In First Out (oxirgi kirgan birinchi chiqadi)." },
  { id:'in30', q:"Operatsion tizimning asosiy qismi:", opts:["Kernel (yadro)","Brauzer","Antivirus","Disk manager"], ans:0, exp:"Kernel — operatsion tizimning eng asosiy qismi." },
  { id:'in31', q:"Qaysi til sun'iy intellekt sohasida eng ko'p ishlatiladi?", opts:["C++","Java","Python","Swift"], ans:2, exp:"Python — AI/ML sohasida eng mashhur til." },
  { id:'in32', q:"DNS nima?", opts:["Domain Name System","Data Network Security","Digital Naming Service","Direct Network Storage"], ans:0, exp:"DNS — Domain Name System (domen nomini IP ga aylantiradi)." },
  { id:'in33', q:"Qaysi ma'lumotlar bazasi SQL emas?", opts:["MySQL","PostgreSQL","MongoDB","SQLite"], ans:2, exp:"MongoDB — NoSQL (hujjat yo'nalishi)." },
  { id:'in34', q:"Cloud computing (bulut hisoblash) nima?", opts:["Ob-havoni prognoz qilish","Internet orqali hisoblash resurslari berish","Lokal server yaratish","Kompyuter ta'miri"], ans:1, exp:"Cloud computing — internet orqali server, saqlash, dasturiy ta'minot taqdim etish." },
  { id:'in35', q:"'Big O notation' nima uchun ishlatiladi?", opts:["Kod xatolarini topish","Algoritmning vaqt va joy murakkabligini baholash","Ma'lumotlar bazasini optimallashtirish","Tarmoq tezligini o'lchash"], ans:1, exp:"Big O — algoritmning eng yomon holat murakkabligini ifodalash." },
]

/* ══════════════════════════════════════════════════════════
   YO'NALISHLAR
   ═══════════════════════════════════════════════════════ */
export const DIRECTIONS = [
  // ─── TIBBIYOT ─────────────────────────────────────────
  {
    id:'med-1', name:"Tibbiyot (Lech faglik)", category:'medical',
    sub1: 'Biologiya', sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Kimyo',     sub2Pool: KIMYO_POOL,
    desc:"Davolash va diagnostika, umumiy tibbiyot",
  },
  {
    id:'med-2', name:"Stomatologiya", category:'medical',
    sub1: 'Biologiya', sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Kimyo',     sub2Pool: KIMYO_POOL,
    desc:"Tish va og'iz bo'shlig'i kasalliklari",
  },
  {
    id:'med-3', name:"Farmatsiya", category:'medical',
    sub1: 'Kimyo',      sub1Pool: KIMYO_POOL,
    sub2: 'Biologiya',  sub2Pool: BIOLOGIYA_POOL,
    desc:"Dorilar ishlab chiqarish va farmakologiya",
  },
  {
    id:'med-4', name:"Pediatriya", category:'medical',
    sub1: 'Biologiya', sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Kimyo',     sub2Pool: KIMYO_POOL,
    desc:"Bolalar salomatligi va kasalliklari",
  },
  {
    id:'med-5', name:"Tibbiy biologiya va genetika", category:'medical',
    sub1: 'Biologiya', sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Kimyo',     sub2Pool: KIMYO_POOL,
    desc:"Genetika va molekulyar biologiya",
  },
  // ─── IT va TEXNOLOGIYA ─────────────────────────────────
  {
    id:'it-1', name:"Kompyuter ilmlari va dasturlash texnologiyalari", category:'technical',
    sub1: 'Matematika',  sub1Pool: MATEMATIKA_POOL,
    sub2: 'Fizika',      sub2Pool: FIZIKA_POOL,
    desc:"Dasturlash, algoritmlar, sun'iy intellekt",
  },
  {
    id:'it-2', name:"Axborot xavfsizligi", category:'technical',
    sub1: 'Matematika',  sub1Pool: MATEMATIKA_POOL,
    sub2: 'Fizika',      sub2Pool: FIZIKA_POOL,
    desc:"Kiberxavfsizlik va ma'lumotlarni himoyalash",
  },
  {
    id:'it-3', name:"Sun'iy intellekt va mashinali o'qitish", category:'technical',
    sub1: 'Matematika',  sub1Pool: MATEMATIKA_POOL,
    sub2: 'Informatika', sub2Pool: INFORMATIKA_POOL,
    desc:"AI, ML, neyron tarmoqlar",
  },
  {
    id:'it-4', name:"Telekommunikatsiya texnologiyalari", category:'technical',
    sub1: 'Matematika', sub1Pool: MATEMATIKA_POOL,
    sub2: 'Fizika',     sub2Pool: FIZIKA_POOL,
    desc:"Tarmoqlar, signallar, aloqa tizimlari",
  },
  {
    id:'it-5', name:"Muhandislik (mexanika)", category:'technical',
    sub1: 'Matematika', sub1Pool: MATEMATIKA_POOL,
    sub2: 'Fizika',     sub2Pool: FIZIKA_POOL,
    desc:"Mexanik muhandislik va mashinasozlik",
  },
  {
    id:'it-6', name:"Elektrotexnika va elektronika", category:'technical',
    sub1: 'Matematika', sub1Pool: MATEMATIKA_POOL,
    sub2: 'Fizika',     sub2Pool: FIZIKA_POOL,
    desc:"Elektr qurilmalari va sxemalar",
  },
  // ─── IQTISOD ──────────────────────────────────────────
  {
    id:'eco-1', name:"Iqtisodiyot", category:'economic',
    sub1: 'Matematika', sub1Pool: MATEMATIKA_POOL,
    sub2: 'Geografiya', sub2Pool: GEOGRAFIYA_POOL,
    desc:"Makro va mikroiqtisodiyot",
  },
  {
    id:'eco-2', name:"Moliya", category:'economic',
    sub1: 'Matematika', sub1Pool: MATEMATIKA_POOL,
    sub2: 'Geografiya', sub2Pool: GEOGRAFIYA_POOL,
    desc:"Bank tizimi, moliyaviy bozorlar",
  },
  {
    id:'eco-3', name:"Buxgalteriya hisobi", category:'economic',
    sub1: 'Matematika', sub1Pool: MATEMATIKA_POOL,
    sub2: 'Geografiya', sub2Pool: GEOGRAFIYA_POOL,
    desc:"Moliyaviy hisobot va audit",
  },
  {
    id:'eco-4', name:"Menejment", category:'economic',
    sub1: 'Matematika', sub1Pool: MATEMATIKA_POOL,
    sub2: 'Tarix',      sub2Pool: TARIX_POOL,
    desc:"Tashkiliy boshqaruv va strategiya",
  },
  {
    id:'eco-5', name:"Biznes va tadbirkorlik", category:'economic',
    sub1: 'Matematika', sub1Pool: MATEMATIKA_POOL,
    sub2: 'Geografiya', sub2Pool: GEOGRAFIYA_POOL,
    desc:"Startaplar va biznesni boshqarish",
  },
  // ─── HUQUQ ─────────────────────────────────────────────
  {
    id:'law-1', name:"Huquqshunoslik", category:'law',
    sub1: 'Tarix',        sub1Pool: TARIX_POOL,
    sub2: 'Ingliz tili',  sub2Pool: INGLIZ_TILI_POOL,
    desc:"Fuqarolik, jinoyat va xalqaro huquq",
  },
  {
    id:'law-2', name:"Xalqaro huquq va diplomatiya", category:'law',
    sub1: 'Tarix',       sub1Pool: TARIX_POOL,
    sub2: 'Ingliz tili', sub2Pool: INGLIZ_TILI_POOL,
    desc:"Xalqaro munosabatlar va diplomatik protokol",
  },
  {
    id:'law-3', name:"Kriminalistika", category:'law',
    sub1: 'Tarix',       sub1Pool: TARIX_POOL,
    sub2: 'Biologiya',   sub2Pool: BIOLOGIYA_POOL,
    desc:"Jinoyatchilik va kriminologiya",
  },
  // ─── TA'LIM ────────────────────────────────────────────
  {
    id:'edu-1', name:"Boshlang'ich ta'lim o'qituvchisi", category:'pedagogical',
    sub1: 'Tarix',       sub1Pool: TARIX_POOL,
    sub2: 'Geografiya',  sub2Pool: GEOGRAFIYA_POOL,
    desc:"Boshlang'ich sinf o'qituvchiligi",
  },
  {
    id:'edu-2', name:"Ingliz tili o'qituvchisi", category:'pedagogical',
    sub1: 'Ingliz tili', sub1Pool: INGLIZ_TILI_POOL,
    sub2: 'Tarix',       sub2Pool: TARIX_POOL,
    desc:"Chet tillari o'qituvchisi",
  },
  {
    id:'edu-3', name:"Maktabgacha ta'lim", category:'pedagogical',
    sub1: 'Tarix',       sub1Pool: TARIX_POOL,
    sub2: 'Biologiya',   sub2Pool: BIOLOGIYA_POOL,
    desc:"Bog'cha va maktabgacha yoshdagi bolalar ta'limi",
  },
  {
    id:'edu-4', name:"Psixologiya", category:'pedagogical',
    sub1: 'Biologiya',   sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Tarix',       sub2Pool: TARIX_POOL,
    desc:"Insonlar va guruhlar psixologiyasi",
  },
  {
    id:'edu-5', name:"Matematika o'qituvchisi", category:'pedagogical',
    sub1: 'Matematika', sub1Pool: MATEMATIKA_POOL,
    sub2: 'Fizika',     sub2Pool: FIZIKA_POOL,
    desc:"Maktabda matematika o'qitish",
  },
  // ─── TABIIY FANLAR ─────────────────────────────────────
  {
    id:'nat-1', name:"Biologiya (ilmiy)", category:'natural',
    sub1: 'Biologiya', sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Kimyo',     sub2Pool: KIMYO_POOL,
    desc:"Ilmiy biologiya tadqiqotlari",
  },
  {
    id:'nat-2', name:"Kimyo texnologiyasi", category:'natural',
    sub1: 'Kimyo',    sub1Pool: KIMYO_POOL,
    sub2: 'Fizika',   sub2Pool: FIZIKA_POOL,
    desc:"Kimyoviy jarayonlar texnologiyasi",
  },
  {
    id:'nat-3', name:"Fizika (ilmiy)", category:'natural',
    sub1: 'Fizika',      sub1Pool: FIZIKA_POOL,
    sub2: 'Matematika',  sub2Pool: MATEMATIKA_POOL,
    desc:"Nazariy va eksperimental fizika",
  },
  {
    id:'nat-4', name:"Ekologiya", category:'natural',
    sub1: 'Biologiya',   sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Geografiya',  sub2Pool: GEOGRAFIYA_POOL,
    desc:"Atrof-muhit va ekosistemalar",
  },
  {
    id:'nat-5', name:"Geodeziya va kartografiya", category:'natural',
    sub1: 'Matematika',  sub1Pool: MATEMATIKA_POOL,
    sub2: 'Geografiya',  sub2Pool: GEOGRAFIYA_POOL,
    desc:"Yer o'lchash va xarita yaratish",
  },
  // ─── GUMANITAR ─────────────────────────────────────────
  {
    id:'hum-1', name:"Jurnalistika", category:'humanitarian',
    sub1: 'Tarix',       sub1Pool: TARIX_POOL,
    sub2: 'Ingliz tili', sub2Pool: INGLIZ_TILI_POOL,
    desc:"Axborot vositalari va media",
  },
  {
    id:'hum-2', name:"Tarjimonshunoslik", category:'humanitarian',
    sub1: 'Ingliz tili', sub1Pool: INGLIZ_TILI_POOL,
    sub2: 'Tarix',       sub2Pool: TARIX_POOL,
    desc:"Og'zaki va yozma tarjima",
  },
  {
    id:'hum-3', name:"Siyosatshunoslik", category:'humanitarian',
    sub1: 'Tarix',       sub1Pool: TARIX_POOL,
    sub2: 'Geografiya',  sub2Pool: GEOGRAFIYA_POOL,
    desc:"Siyosat nazariyasi va boshqaruv",
  },
  {
    id:'hum-4', name:"Sotsiologiya", category:'humanitarian',
    sub1: 'Tarix',       sub1Pool: TARIX_POOL,
    sub2: 'Geografiya',  sub2Pool: GEOGRAFIYA_POOL,
    desc:"Jamiyat va guruhlar sotsiologiyasi",
  },
  {
    id:'hum-5', name:"Tarix o'qituvchisi", category:'humanitarian',
    sub1: 'Tarix',       sub1Pool: TARIX_POOL,
    sub2: 'Geografiya',  sub2Pool: GEOGRAFIYA_POOL,
    desc:"Tarixni o'rganish va o'rgatish",
  },
  // ─── QISHLOQ XO'JALIGI ─────────────────────────────────
  {
    id:'agr-1', name:"Agrotexnologiya", category:'agriculture',
    sub1: 'Biologiya',  sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Kimyo',      sub2Pool: KIMYO_POOL,
    desc:"Zamonaviy qishloq xo'jaligi texnologiyalari",
  },
  {
    id:'agr-2', name:"Veterinariya", category:'agriculture',
    sub1: 'Biologiya', sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Kimyo',     sub2Pool: KIMYO_POOL,
    desc:"Hayvon kasalliklari va davolash",
  },
  {
    id:'agr-3', name:"Zootenika", category:'agriculture',
    sub1: 'Biologiya',  sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Kimyo',      sub2Pool: KIMYO_POOL,
    desc:"Chorvachilik va hayvonchilik",
  },
  {
    id:'agr-4', name:"Gidromelioratsiya", category:'agriculture',
    sub1: 'Matematika',  sub1Pool: MATEMATIKA_POOL,
    sub2: 'Geografiya',  sub2Pool: GEOGRAFIYA_POOL,
    desc:"Suv ta'minoti va irrigatsiya",
  },
  // ─── SAN'AT ────────────────────────────────────────────
  {
    id:'art-1', name:"Dizayn", category:'art',
    sub1: 'Matematika',  sub1Pool: MATEMATIKA_POOL,
    sub2: 'Tarix',       sub2Pool: TARIX_POOL,
    desc:"Grafik va sanoat dizayni",
  },
  {
    id:'art-2', name:"Arxitektura", category:'art',
    sub1: 'Matematika', sub1Pool: MATEMATIKA_POOL,
    sub2: 'Fizika',     sub2Pool: FIZIKA_POOL,
    desc:"Binolar loyihalash va qurish",
  },
  {
    id:'art-3', name:"Tasviriy san'at", category:'art',
    sub1: 'Tarix',       sub1Pool: TARIX_POOL,
    sub2: 'Geografiya',  sub2Pool: GEOGRAFIYA_POOL,
    desc:"Rasm, haykaltaroshlik, tasviriy ijod",
  },
  // ─── SPORT ─────────────────────────────────────────────
  {
    id:'sport-1', name:"Jismoniy tarbiya o'qituvchisi", category:'sports',
    sub1: 'Biologiya',  sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Tarix',      sub2Pool: TARIX_POOL,
    desc:"Sport murabbiyligi va jismoniy tarbiya",
  },
  {
    id:'sport-2', name:"Sport meditsinasi", category:'sports',
    sub1: 'Biologiya', sub1Pool: BIOLOGIYA_POOL,
    sub2: 'Kimyo',     sub2Pool: KIMYO_POOL,
    desc:"Sport shifokori va reabilitatsiya",
  },
]

export const CATEGORY_MAP = {
  medical:      { label:'Tibbiyot',            color:'from-rose-500 to-pink-600',    text:'#fb7185' },
  technical:    { label:'IT va Texnologiya',    color:'from-blue-500 to-indigo-600',  text:'#60a5fa' },
  economic:     { label:'Iqtisod va Moliya',    color:'from-emerald-500 to-teal-600', text:'#34d399' },
  law:          { label:'Huquq',                color:'from-violet-500 to-purple-600',text:'#a78bfa' },
  pedagogical:  { label:"Ta'lim",               color:'from-amber-500 to-orange-500', text:'#fbbf24' },
  natural:      { label:'Tabiiy Fanlar',        color:'from-teal-500 to-cyan-600',    text:'#2dd4bf' },
  humanitarian: { label:'Gumanitar',            color:'from-fuchsia-500 to-pink-600', text:'#e879f9' },
  agriculture:  { label:"Qishloq Xo'jaligi",   color:'from-lime-500 to-green-600',   text:'#a3e635' },
  art:          { label:"San'at",               color:'from-orange-500 to-red-500',   text:'#fb923c' },
  sports:       { label:'Sport',                color:'from-sky-500 to-blue-600',     text:'#38bdf8' },
}

export const CATEGORIES = Object.entries(CATEGORY_MAP).map(([key, val]) => ({
  key, ...val,
  directions: DIRECTIONS.filter(d => d.category === key),
}))
