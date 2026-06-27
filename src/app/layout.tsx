import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LINE Backoffice',
  description: 'ระบบบันทึกซื้อขายสำหรับร้านค้าขนาดเล็ก',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
