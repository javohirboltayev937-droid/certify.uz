"""
O'zbekiston DTM yo'nalishlari va ularning imtihon fanlari.
Har bir yo'nalish uchun: [majburiy fanlar (o'zbek+math), 1-fan, 2-fan]
"""

DTM_DIRECTIONS = [
    # === PEDAGOGIKA ===
    {
        'code': '5110100', 'name': 'Maktabgacha ta\'lim', 'category': 'pedagogical',
        'first_subject': 'uzbek', 'second_subject': 'history',
    },
    {
        'code': '5110200', 'name': 'Boshlang\'ich ta\'lim va sport tarbiya ishi', 'category': 'pedagogical',
        'first_subject': 'uzbek', 'second_subject': 'history',
    },
    {
        'code': '5110300', 'name': 'Maktabgacha ta\'lim', 'category': 'pedagogical',
        'first_subject': 'uzbek', 'second_subject': 'history',
    },
    {
        'code': '5111000', 'name': 'O\'zbek tili va adabiyoti o\'qitish', 'category': 'pedagogical',
        'first_subject': 'uzbek', 'second_subject': 'history',
    },
    {
        'code': '5111100', 'name': 'Ingliz tili va adabiyoti o\'qitish', 'category': 'pedagogical',
        'first_subject': 'english', 'second_subject': 'history',
    },
    {
        'code': '5111200', 'name': 'Rus tili va adabiyoti o\'qitish', 'category': 'pedagogical',
        'first_subject': 'russian', 'second_subject': 'history',
    },
    {
        'code': '5111300', 'name': 'Nemis tili va adabiyoti o\'qitish', 'category': 'pedagogical',
        'first_subject': 'german', 'second_subject': 'history',
    },
    {
        'code': '5111400', 'name': 'Fransuz tili va adabiyoti o\'qitish', 'category': 'pedagogical',
        'first_subject': 'french', 'second_subject': 'history',
    },
    {
        'code': '5111500', 'name': 'Matematika o\'qitish', 'category': 'pedagogical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5111600', 'name': 'Fizika o\'qitish', 'category': 'pedagogical',
        'first_subject': 'physics', 'second_subject': 'mathematics',
    },
    {
        'code': '5111700', 'name': 'Kimyo o\'qitish', 'category': 'pedagogical',
        'first_subject': 'chemistry', 'second_subject': 'biology',
    },
    {
        'code': '5111800', 'name': 'Biologiya o\'qitish', 'category': 'pedagogical',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    {
        'code': '5111900', 'name': 'Tarix o\'qitish', 'category': 'pedagogical',
        'first_subject': 'history', 'second_subject': 'uzbek',
    },
    {
        'code': '5112000', 'name': 'Geografiya o\'qitish', 'category': 'pedagogical',
        'first_subject': 'geography', 'second_subject': 'history',
    },
    {
        'code': '5112100', 'name': 'Informatika va hisoblash texnikasi o\'qitish', 'category': 'pedagogical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5112200', 'name': 'Mehnat ta\'limi va kasb ta\'limi o\'qitish', 'category': 'pedagogical',
        'first_subject': 'physics', 'second_subject': 'mathematics',
    },
    {
        'code': '5113000', 'name': 'Maxsus pedagogika (defektologiya)', 'category': 'pedagogical',
        'first_subject': 'uzbek', 'second_subject': 'history',
    },
    # === GUMANITAR ===
    {
        'code': '5120100', 'name': 'Filologiya va tillarni o\'qitish (o\'zbek tili)', 'category': 'humanitarian',
        'first_subject': 'uzbek', 'second_subject': 'history',
    },
    {
        'code': '5120200', 'name': 'Filologiya va tillarni o\'qitish (rus tili)', 'category': 'humanitarian',
        'first_subject': 'russian', 'second_subject': 'history',
    },
    {
        'code': '5120300', 'name': 'Filologiya va tillarni o\'qitish (ingliz tili)', 'category': 'humanitarian',
        'first_subject': 'english', 'second_subject': 'history',
    },
    {
        'code': '5120400', 'name': 'Filologiya va tillarni o\'qitish (nemis tili)', 'category': 'humanitarian',
        'first_subject': 'german', 'second_subject': 'history',
    },
    {
        'code': '5120500', 'name': 'Filologiya va tillarni o\'qitish (fransuz tili)', 'category': 'humanitarian',
        'first_subject': 'french', 'second_subject': 'history',
    },
    {
        'code': '5120600', 'name': 'Jurnalistika', 'category': 'humanitarian',
        'first_subject': 'uzbek', 'second_subject': 'history',
    },
    {
        'code': '5120700', 'name': 'Tarjima nazariyasi va amaliyoti (ingliz tili)', 'category': 'humanitarian',
        'first_subject': 'english', 'second_subject': 'history',
    },
    {
        'code': '5120800', 'name': 'Tarix', 'category': 'humanitarian',
        'first_subject': 'history', 'second_subject': 'uzbek',
    },
    {
        'code': '5120900', 'name': 'Falsafa', 'category': 'humanitarian',
        'first_subject': 'history', 'second_subject': 'uzbek',
    },
    {
        'code': '5121000', 'name': 'Psixologiya', 'category': 'humanitarian',
        'first_subject': 'biology', 'second_subject': 'history',
    },
    {
        'code': '5121100', 'name': 'Sotsiologiya', 'category': 'humanitarian',
        'first_subject': 'history', 'second_subject': 'uzbek',
    },
    # === HUQUQ ===
    {
        'code': '5140200', 'name': 'Huquqshunoslik', 'category': 'law',
        'first_subject': 'history', 'second_subject': 'uzbek',
    },
    {
        'code': '5140300', 'name': 'Xalqaro munosabatlar', 'category': 'law',
        'first_subject': 'history', 'second_subject': 'english',
    },
    {
        'code': '5140400', 'name': 'Davlat va jamiyat boshqaruvi', 'category': 'law',
        'first_subject': 'history', 'second_subject': 'uzbek',
    },
    # === IQTISODIYOT ===
    {
        'code': '5230100', 'name': 'Iqtisodiyot', 'category': 'economic',
        'first_subject': 'mathematics', 'second_subject': 'geography',
    },
    {
        'code': '5230200', 'name': 'Menejment', 'category': 'economic',
        'first_subject': 'mathematics', 'second_subject': 'english',
    },
    {
        'code': '5230300', 'name': 'Buxgalteriya hisobi va audit', 'category': 'economic',
        'first_subject': 'mathematics', 'second_subject': 'geography',
    },
    {
        'code': '5230400', 'name': 'Moliya', 'category': 'economic',
        'first_subject': 'mathematics', 'second_subject': 'english',
    },
    {
        'code': '5230500', 'name': 'Bank ishi', 'category': 'economic',
        'first_subject': 'mathematics', 'second_subject': 'english',
    },
    {
        'code': '5230600', 'name': 'Soliqlar va soliqqa tortish', 'category': 'economic',
        'first_subject': 'mathematics', 'second_subject': 'geography',
    },
    {
        'code': '5230700', 'name': 'Marketing', 'category': 'economic',
        'first_subject': 'mathematics', 'second_subject': 'english',
    },
    {
        'code': '5230800', 'name': 'Statistika', 'category': 'economic',
        'first_subject': 'mathematics', 'second_subject': 'geography',
    },
    # === TEXNIKA ===
    {
        'code': '5310100', 'name': 'Energetika', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5310200', 'name': 'Elektrotexnika, elektromexanika va elektrotexnologiyalar', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5310300', 'name': 'Elektronika va asbobsozlik', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5310400', 'name': 'Aloqa texnologiyalari', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5311100', 'name': 'Mexanika va mashinasozlik', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5311200', 'name': 'Metallurgiya', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5311300', 'name': 'Mashinasozlik texnologiyasi', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5312100', 'name': 'Kimyo texnologiyasi va biotexnologiya', 'category': 'technical',
        'first_subject': 'chemistry', 'second_subject': 'mathematics',
    },
    {
        'code': '5312200', 'name': 'Oziq-ovqat texnologiyasi', 'category': 'technical',
        'first_subject': 'chemistry', 'second_subject': 'biology',
    },
    {
        'code': '5313100', 'name': 'Konchilik ishi', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5313200', 'name': 'Neft va gaz ishi', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5320100', 'name': 'Qurilish', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5321600', 'name': 'Arxitektura', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'drawing',
    },
    {
        'code': '5330100', 'name': 'Transport (tur bo\'yicha)', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5340000', 'name': 'Axborot texnologiyalari va telekommunikatsiyalar', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5340100', 'name': 'Kompyuter muhandisligi', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5340200', 'name': 'Dasturiy muhandislik', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5340300', 'name': 'Axborot xavfsizligi', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5340400', 'name': 'Telekommunikatsiya texnologiyalari', 'category': 'technical',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    # === TABIIY FANLAR ===
    {
        'code': '5140100', 'name': 'Matematika', 'category': 'natural',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5140500', 'name': 'Fizika', 'category': 'natural',
        'first_subject': 'physics', 'second_subject': 'mathematics',
    },
    {
        'code': '5140600', 'name': 'Kimyo', 'category': 'natural',
        'first_subject': 'chemistry', 'second_subject': 'biology',
    },
    {
        'code': '5140700', 'name': 'Biologiya', 'category': 'natural',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    {
        'code': '5140800', 'name': 'Geografiya', 'category': 'natural',
        'first_subject': 'geography', 'second_subject': 'history',
    },
    {
        'code': '5141000', 'name': 'Ekologiya va atrof-muhitni muhofaza qilish', 'category': 'natural',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    # === TIBBIYOT ===
    {
        'code': '5510100', 'name': 'Davolash ishi', 'category': 'medical',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    {
        'code': '5510200', 'name': 'Pediatriya', 'category': 'medical',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    {
        'code': '5510300', 'name': 'Tibbiy pedagogika', 'category': 'medical',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    {
        'code': '5510400', 'name': 'Stomatologiya', 'category': 'medical',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    {
        'code': '5510500', 'name': 'Tibbiy profilaktika', 'category': 'medical',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    {
        'code': '5510600', 'name': 'Farmatsiya', 'category': 'medical',
        'first_subject': 'chemistry', 'second_subject': 'biology',
    },
    {
        'code': '5510700', 'name': 'Tibbiy biologiya', 'category': 'medical',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    {
        'code': '5510800', 'name': 'Hamshiralik ishi', 'category': 'medical',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    # === QISHLOQ XO'JALIGI ===
    {
        'code': '5410100', 'name': 'Agrotexnologiya', 'category': 'agriculture',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    {
        'code': '5410200', 'name': 'Agronomiya', 'category': 'agriculture',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    {
        'code': '5410300', 'name': 'Qishloq xo\'jaligini mexanizatsiyalash', 'category': 'agriculture',
        'first_subject': 'mathematics', 'second_subject': 'physics',
    },
    {
        'code': '5410400', 'name': 'Veterinariya', 'category': 'agriculture',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    {
        'code': '5410500', 'name': 'Baliqchilik va baliq xo\'jaligi', 'category': 'agriculture',
        'first_subject': 'biology', 'second_subject': 'chemistry',
    },
    # === SAN'AT ===
    {
        'code': '5610100', 'name': 'Musiqa ta\'limi', 'category': 'art',
        'first_subject': 'uzbek', 'second_subject': 'history',
    },
    {
        'code': '5610200', 'name': 'Tasviriy san\'at va muhandislik grafikasi', 'category': 'art',
        'first_subject': 'drawing', 'second_subject': 'uzbek',
    },
    {
        'code': '5610300', 'name': 'Xoreografiya', 'category': 'art',
        'first_subject': 'uzbek', 'second_subject': 'history',
    },
    # === JISMONIY TARBIYA ===
    {
        'code': '5710100', 'name': 'Jismoniy tarbiya', 'category': 'sports',
        'first_subject': 'biology', 'second_subject': 'uzbek',
    },
    {
        'code': '5710200', 'name': 'Sport va sport menejment', 'category': 'sports',
        'first_subject': 'biology', 'second_subject': 'uzbek',
    },
]

SUBJECT_TEST_INFO = {
    'english': {'total': 30, 'time': 30},
    'russian': {'total': 30, 'time': 30},
    'german': {'total': 30, 'time': 30},
    'french': {'total': 30, 'time': 30},
    'uzbek': {'total': 30, 'time': 30},
    'mathematics': {'total': 30, 'time': 30},
    'physics': {'total': 30, 'time': 30},
    'chemistry': {'total': 30, 'time': 30},
    'biology': {'total': 30, 'time': 30},
    'history': {'total': 30, 'time': 30},
    'geography': {'total': 30, 'time': 30},
    'informatics': {'total': 30, 'time': 30},
    'drawing': {'total': 30, 'time': 30},
}

CATEGORY_NAMES = {
    'technical': 'Texnika va texnologiya',
    'natural': 'Tabiiy fanlar',
    'medical': 'Tibbiyot',
    'economic': 'Ijtimoiy-iqtisodiy',
    'humanitarian': 'Gumanitar',
    'pedagogical': 'Pedagogika',
    'law': 'Huquq',
    'agriculture': 'Qishloq xo\'jaligi',
    'art': 'San\'at va madaniyat',
    'sports': 'Jismoniy tarbiya',
    'military': 'Harbiy',
}
