'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const TABS = [
  { label: 'หน้าแรก', icon: '🏠', href: '' },
  { label: 'ขาย', icon: '💰', href: '/sales' },
  { label: 'ซื้อ', icon: '📦', href: '/purchases' },
  { label: 'พัสดุ', icon: '🚚', href: '/shipments' },
  { label: 'รายงาน', icon: '📊', href: '/reports' },
]

export function BottomNav({ shopId }: { shopId: string }) {
  const pathname = usePathname()
  const base = `/shop/${shopId}`

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-gray-100 flex shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      {TABS.map((tab) => {
        const href = `${base}${tab.href}`
        const active =
          tab.href === ''
            ? pathname === base || pathname === base + '/'
            : pathname.startsWith(href)

        return (
          <Link
            key={tab.href}
            href={href}
            className={clsx(
              'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors',
              active ? 'text-[#06C755] font-semibold' : 'text-gray-400'
            )}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
