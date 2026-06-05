import Link from 'next/link'
import {
  AcademicCapIcon, ArrowRightIcon, PlayCircleIcon, TrophyIcon,
  GlobeAltIcon, BookOpenIcon, DocumentCheckIcon,
  BoltIcon, ChartBarIcon, AcademicCapIcon as TeacherIcon,
  DevicePhoneMobileIcon, BellIcon, ShieldCheckIcon, StarIcon,
  ChevronRightIcon, SparklesIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'

const examTypes = [
  {
    id: 'ielts', title: 'IELTS', icon: GlobeAltIcon, color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700',
    desc: 'International English Language Testing System. Band 4.0 dan 9.0 gacha tayyorgarlik.',
    path: '/exams/ielts', badge: 'Eng mashhur',
  },
  {
    id: 'cefr', title: 'CEFR', icon: BookOpenIcon, color: 'from-green-500 to-green-700',
    bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700',
    desc: 'Common European Framework of Reference. A1 dan C2 gacha daraja sinovlari.',
    path: '/exams/cefr', badge: 'Xalqaro',
  },
  {
    id: 'national', title: 'Milliy Sertifikat', icon: DocumentCheckIcon, color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700',
    desc: "O'zbek milliy til sertifikatlash tizimi. Barcha fanlardan sertifikat.",
    path: '/exams/national', badge: 'Yangi',
  },
  {
    id: 'dtm', title: 'DTM Test', icon: AcademicCapIcon, color: 'from-orange-500 to-orange-700',
    bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700',
    desc: "DTM yo'nalishini tanlang - tizim avtomatik fan guruhini aniqlaydi.",
    path: '/dtm', badge: 'Interaktiv',
  },
]

const subjectIcons = {
  english:     GlobeAltIcon,
  mathematics: ChartBarIcon,
  physics:     BoltIcon,
  biology:     SparklesIcon,
  chemistry:   SparklesIcon,
  history:     BookOpenIcon,
  geography:   GlobeAltIcon,
  uzbek:       DocumentCheckIcon,
}

const subjects = [
  { icon: GlobeAltIcon,   name: 'Ingliz tili',  count: '120+', color: 'bg-blue-100 text-blue-700',    slug: 'english' },
  { icon: ChartBarIcon,   name: 'Matematika',   count: '200+', color: 'bg-red-100 text-red-700',       slug: 'mathematics' },
  { icon: BoltIcon,       name: 'Fizika',       count: '150+', color: 'bg-purple-100 text-purple-700', slug: 'physics' },
  { icon: SparklesIcon,   name: 'Biologiya',    count: '130+', color: 'bg-green-100 text-green-700',   slug: 'biology' },
  { icon: BeakerIconFix,  name: 'Kimyo',        count: '110+', color: 'bg-yellow-100 text-yellow-700', slug: 'chemistry' },
  { icon: BookOpenIcon,   name: 'Tarix',        count: '180+', color: 'bg-indigo-100 text-indigo-700', slug: 'history' },
  { icon: GlobeAltIcon,   name: 'Geografiya',   count: '90+',  color: 'bg-teal-100 text-teal-700',     slug: 'geography' },
  { icon: DocumentCheckIcon, name: "O'zbek tili", count: '160+', color: 'bg-emerald-100 text-emerald-700', slug: 'uzbek' },
]

function BeakerIconFix(props) { return <SparklesIcon {...props} /> }

const stats = [
  { value: '50,000+', label: 'Faol foydalanuvchi' },
  { value: '5,000+',  label: 'Savollar bazasi' },
  { value: '200+',    label: "Yo'nalishlar" },
  { value: '98%',     label: 'Mamnunlik darajasi' },
]

const features = [
  { icon: BoltIcon,             title: 'Maqsadli tayyorgarlik',   desc: "Yo'nalishingizni tanlang, tizim avtomatik ravishda qaysi fanlardan test kelishini aniqlaydi va tayyorgarlik rejasini tuzadi" },
  { icon: ChartBarIcon,         title: 'Real-time tahlil',         desc: 'Har bir test natijangiz batafsil tahlil qilinadi. Kuchli va kuchsiz tomonlar aniqlanadi' },
  { icon: TrophyIcon,           title: 'Yutuqlar tizimi',          desc: "Har bir muvaffaqiyatli test uchun badge va XP yig'ing. Reyting jadvalida o'z o'rningizni oling" },
  { icon: DevicePhoneMobileIcon, title: 'Mobil qulay',             desc: 'Telefon, planshet yoki kompyuterdagi istalgan qurilmada qulay foydalaning' },
  { icon: BellIcon,             title: 'Kundalik eslatmalar',      desc: "Dars vaqtlarini o'zingiz belgilang. Tizim sizni o'z vaqtida eslatib turadi" },
  { icon: AcademicCapIcon,      title: "Tajribali o'qituvchilar",  desc: "Barcha materiallar IELTS examiner va DTM ekspertlari tomonidan tayyorlangan" },
]

const testimonials = [
  { name: 'Aziz Karimov',    score: 'IELTS 7.5',     text: "Certify.uz bilan 3 oy ichida IELTS 7.5 oldim. Savollar bazasi va tahlil tizimi juda ajoyib!",                   city: 'Toshkent' },
  { name: 'Malika Yusupova', score: 'DTM 218 ball',   text: "DTM test tizimi menga 200+ ball olishda katta yordam berdi. Yo'nalishimga mos fanlarni aniq bilardim.",         city: 'Samarqand' },
  { name: 'Bobur Rashidov',  score: 'Milliy B2',      text: 'Milliy sertifikat uchun tayyorlanish juda qulay bo\'ldi. Testlar real imtihonga o\'xshash.',                    city: 'Andijon' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
                <span className="text-sm">O'zbekistondagi #1 tayyorgarlik platformasi</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
                Sertifikatga
                <span className="block text-yellow-400">tayyor bo'ling!</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                IELTS, CEFR, Milliy sertifikat va DTM imtihonlariga professional tayyorgarlik.
                50,000+ talabalar ishonadi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-base px-8 py-4 rounded-xl transition-colors shadow-lg">
                  Bepul boshlash <ArrowRightIcon className="w-5 h-5" />
                </Link>
                <Link href="/dtm" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 rounded-xl text-white font-semibold hover:bg-white/10 transition-colors text-base">
                  <PlayCircleIcon className="w-5 h-5" /> DTM Test sinab ko'rish
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {examTypes.map(exam => (
                <Link key={exam.id} href={exam.path}
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition-all duration-300 hover:scale-105 block">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <exam.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-1">{exam.title}</h3>
                  <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full">{exam.badge}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl lg:text-4xl font-extrabold text-primary-700">{value}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Qaysi imtihonga tayyorlanmoqchisiz?</h2>
            <p className="text-gray-500 mt-2">Har bir imtihon turi uchun maxsus tayyorlangan materiallar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examTypes.map(exam => (
              <Link key={exam.id} href={exam.path} className={`card p-6 block group hover:scale-105 transition-transform ${exam.bg} border ${exam.border}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${exam.bg}`} style={{ filter: 'brightness(0.85)' }}>
                  <exam.icon className={`w-6 h-6 ${exam.text}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${exam.text}`}>{exam.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{exam.desc}</p>
                <span className={`inline-flex items-center text-sm font-semibold ${exam.text}`}>
                  Boshlash <ArrowRightIcon className="w-4 h-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Barcha fanlar bo'yicha testlar</h2>
            <p className="text-gray-500 mt-2">O'zbek maktablarida o'qitiladigan barcha fanlar</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {subjects.map(s => (
              <Link key={s.slug} href={`/courses?subject=${s.slug}`}
                className={`${s.color} rounded-2xl p-5 block hover:scale-105 transition-transform text-center`}>
                <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                  <s.icon className="w-8 h-8" />
                </div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm opacity-70">{s.count} savol</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/courses" className="btn-secondary inline-flex">
              Barcha fanlarni ko'rish <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Nima uchun Certify.uz?</h2>
            <p className="text-gray-500 mt-2">Raqobatchilardan farqlanuvchi xususiyatlarimiz</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card p-6">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DTM CTA */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <TrophyIcon className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-4xl font-extrabold mb-4">DTM Test — Aqlli tizim</h2>
          <p className="text-xl text-orange-100 mb-8">
            Yo'nalishingizni tanlang. Tizim avtomatik ravishda qaysi fanlardan test kelishini aniqlaydi va
            200+ O'zbekiston universitetlarining barcha yo'nalishlarini o'z ichiga oladi.
          </p>
          <Link href="/dtm" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors text-lg">
            DTM Testni boshlash <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Talabalar fikri</h2>
            <p className="text-gray-500 mt-2">50,000+ muvaffaqiyatli talaba fikrlari</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <StarSolid key={j} className="w-4 h-4 text-yellow-400" />)}
                </div>
                <p className="text-gray-600 mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-700">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.score} · {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Bugun boshlang!</h2>
          <p className="text-xl text-primary-200 mb-8">
            Bepul ro'yxatdan o'ting va 5 ta darsga kiriting. Premium obuna bilan cheksiz kirish imkoniyatini oling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-lg px-10 py-4 rounded-xl transition-colors">
              Bepul boshlash
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold px-10 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg">
              Narxlarni ko'rish
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
