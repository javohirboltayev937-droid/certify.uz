import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import {
  AcademicCapIcon, CheckCircleIcon, StarIcon,
  ArrowRightIcon, PlayCircleIcon, TrophyIcon
} from '@heroicons/react/24/outline'
import { coursesAPI } from '@/api/courses'

const examTypes = [
  {
    id: 'ielts', title: 'IELTS', emoji: '🏆', color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700',
    desc: 'International English Language Testing System. Band 4.0 dan 9.0 gacha tayyorgarlik.',
    path: '/exams/ielts', badge: 'Eng mashhur'
  },
  {
    id: 'cefr', title: 'CEFR', emoji: '🌍', color: 'from-green-500 to-green-700',
    bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700',
    desc: 'Common European Framework of Reference. A1 dan C2 gacha daraja sinovlari.',
    path: '/exams/cefr', badge: 'Xalqaro'
  },
  {
    id: 'national', title: 'Milliy Sertifikat', emoji: '🇺🇿', color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700',
    desc: 'O\'zbek milliy til sertifikatlash tizimi. Barcha fanlardan sertifikat.',
    path: '/exams/national', badge: 'Yangi'
  },
  {
    id: 'dtm', title: 'DTM Test', emoji: '🎓', color: 'from-orange-500 to-orange-700',
    bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700',
    desc: 'DTM yo\'nalishini tanlang - tizim avtomatik fan guruhini aniqlaydi.',
    path: '/dtm', badge: 'Interaktiv'
  },
]

const subjects = [
  { icon: '🇬🇧', name: 'Ingliz tili', count: '120+', color: 'bg-blue-100', slug: 'english' },
  { icon: '🔢', name: 'Matematika', count: '200+', color: 'bg-red-100', slug: 'mathematics' },
  { icon: '⚛️', name: 'Fizika', count: '150+', color: 'bg-purple-100', slug: 'physics' },
  { icon: '🧬', name: 'Biologiya', count: '130+', color: 'bg-green-100', slug: 'biology' },
  { icon: '🧪', name: 'Kimyo', count: '110+', color: 'bg-yellow-100', slug: 'chemistry' },
  { icon: '📜', name: 'Tarix', count: '180+', color: 'bg-indigo-100', slug: 'history' },
  { icon: '🌍', name: 'Geografiya', count: '90+', color: 'bg-teal-100', slug: 'geography' },
  { icon: '🇺🇿', name: 'O\'zbek tili', count: '160+', color: 'bg-emerald-100', slug: 'uzbek' },
]

const stats = [
  { value: 50000, label: 'Faol foydalanuvchi', suffix: '+' },
  { value: 5000, label: 'Savollar bazasi', suffix: '+' },
  { value: 200, label: 'Yo\'nalishlar', suffix: '+' },
  { value: 98, label: 'Mamnunlik darajasi', suffix: '%' },
]

const features = [
  { icon: '🎯', title: 'Maqsadli tayyorgarlik', desc: 'Yo\'nalishingizni tanlang, tizim avtomatik fan guruhini va tayyorgarlik rejasini tuzadi' },
  { icon: '📊', title: 'Real-time tahlil', desc: 'Har bir test natijangiz batafsil tahlil qilinadi. Kuchli va kuchsiz tomonlar aniqlanadi' },
  { icon: '🏆', title: 'Yutuqlar tizimi', desc: 'Har bir muvaffaqiyatli test uchun badge va XP yig\'ing. Reyting jadvalida o\'z o\'rningizni oling' },
  { icon: '📱', title: 'Mobil qulay', desc: 'Telefon, planshet yoki kompyuterdagi istalgan qurilmada qulay foydalaning' },
  { icon: '🔔', title: 'Kundalik eslatmalar', desc: 'Dars vaqtlarini o\'zingiz belgilang. Tizim sizni o\'z vaqtida eslatib turadi' },
  { icon: '👨‍🏫', title: 'Tajribali o\'qituvchilar', desc: 'Barcha materiallar IELTS examiner va DTM ekspertlari tomonidan tayyorlangan' },
]

const testimonials = [
  { name: 'Aziz Karimov', score: 'IELTS 7.5', text: 'Certify.uz bilan 3 oy ichida IELTS 7.5 oldim. Savollar bazasi va tahlil tizimi juda ajoyib!', city: 'Toshkent' },
  { name: 'Malika Yusupova', score: 'DTM 218 ball', text: 'DTM test tizimi menga 200+ ball olishda katta yordam berdi. Yo\'nalishimga mos fanlarni aniq bilardim.', city: 'Samarqand' },
  { name: 'Bobur Rashidov', score: 'Milliy B2', text: 'Milliy sertifikat uchun tayyorlanish juda qulay bo\'ldi. Testlar real imtihonga o\'xshash.', city: 'Andijon' },
]

export default function Home() {
  const [subjects_data, setSubjectsData] = useState(subjects)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
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
                <Link to="/register" className="btn-primary bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-base px-8 py-4">
                  Bepul boshlash
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/dtm" className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 rounded-xl text-white font-semibold hover:bg-white/10 transition-colors text-base">
                  <PlayCircleIcon className="w-5 h-5" />
                  DTM Test sinab ko'rish
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {examTypes.map((exam, i) => (
                <Link
                  key={exam.id}
                  to={exam.path}
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-2">{exam.emoji}</div>
                  <h3 className="font-bold text-white mb-1">{exam.title}</h3>
                  <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full">{exam.badge}</span>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, suffix }) => (
              <div key={label} className="text-center">
                <div className="text-3xl lg:text-4xl font-extrabold text-primary-700">
                  <CountUp end={value} duration={2} separator="," suffix={suffix} enableScrollSpy />
                </div>
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
            <h2 className="section-title">Qaysi imtihonga tayyorlanmoqchisiz?</h2>
            <p className="section-subtitle">Har bir imtihon turi uchun maxsus tayyorlangan materiallar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examTypes.map((exam, i) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={exam.path} className={`card p-6 block group hover:scale-105 transition-transform ${exam.bg} border ${exam.border}`}>
                  <div className="text-4xl mb-4">{exam.emoji}</div>
                  <h3 className={`text-xl font-bold mb-2 ${exam.text}`}>{exam.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{exam.desc}</p>
                  <span className={`inline-flex items-center text-sm font-semibold ${exam.text} group-hover:gap-2 transition-all`}>
                    Boshlash <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Barcha fanlar bo'yicha testlar</h2>
            <p className="section-subtitle">O'zbek maktablarida o'qitiladigan barcha fanlar</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {subjects.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/courses?subject=${s.slug}`}
                  className={`${s.color} rounded-2xl p-5 block hover:scale-105 transition-transform text-center`}>
                  <div className="text-4xl mb-2">{s.icon}</div>
                  <div className="font-semibold text-gray-800">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.count} savol</div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/courses" className="btn-secondary">
              Barcha fanlarni ko'rish <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Nima uchun Certify.uz?</h2>
            <p className="section-subtitle">Raqobatchilardan farqlanuvchi xususiyatlarimiz</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DTM CTA */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TrophyIcon className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-4xl font-extrabold mb-4">DTM Test — Aqlli tizim</h2>
            <p className="text-xl text-orange-100 mb-8">
              Yo'nalishingizni tanlang. Tizim avtomatik ravishda qaysi fanlardan test kelishini aniqlaydi va
              200+ O'zbekiston universitetlarining barcha yo'nalishlarini o'z ichiga oladi.
            </p>
            <Link to="/dtm" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors text-lg">
              DTM Testni boshlash <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Talabalar fikri</h2>
            <p className="section-subtitle">50,000+ muvaffaqiyatli talab fikrlari</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <StarIcon key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
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
              </motion.div>
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
            <Link to="/register" className="btn-primary bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-lg px-10 py-4">
              Bepul boshlash
            </Link>
            <Link to="/pricing" className="border-2 border-white/30 text-white font-semibold px-10 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg">
              Narxlarni ko'rish
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
