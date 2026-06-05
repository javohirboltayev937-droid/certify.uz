import './globals.css'
import Providers from './providers'

export const metadata = {
  title: { default: 'Certify.uz', template: '%s | Certify.uz' },
  description: "O'zbekiston sertifikat va imtihon tayyorgarlik platformasi — IELTS, CEFR, DTM, Milliy sertifikat",
  keywords: ['IELTS', 'DTM', 'CEFR', 'imtihon', 'sertifikat', 'tayyorgarlik'],
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
