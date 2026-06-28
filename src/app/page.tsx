'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { initLiff } from '@/lib/liff'

export default function Home() {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Process LINE auth tokens when LINE redirects back here after login,
    // then auto-redirect to last visited shop if saved
    initLiff()
      .then(() => {
        const saved = localStorage.getItem('khaai_last_shop')
        if (saved) router.replace(`/shop/${saved}`)
        else setReady(true)
      })
      .catch(() => setReady(true))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGo = () => {
    const clean = slug.trim().toLowerCase()
    if (!clean) return
    router.push(`/shop/${clean}`)
  }

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#06C755] animate-pulse" />
        <p className="text-sm text-gray-400">กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-6 p-8">
      <div className="w-16 h-16 rounded-2xl bg-[#06C755] flex items-center justify-center text-white text-3xl font-bold">
        ขาย
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">Khaai</h1>
        <p className="text-sm text-gray-400 mt-1">ระบบจัดการร้านค้าผ่าน LINE</p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <input
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-center focus:outline-none focus:border-[#06C755] transition-colors"
          placeholder="ใส่ชื่อย่อร้านค้า เช่น onestore"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGo()}
          autoCapitalize="none"
          autoCorrect="off"
        />
        <button
          onClick={handleGo}
          disabled={!slug.trim()}
          className="w-full bg-[#06C755] disabled:bg-gray-200 text-white disabled:text-gray-400 font-bold py-3 rounded-2xl transition-colors"
        >
          เข้าสู่ร้านค้า
        </button>
      </div>

      <p className="text-xs text-gray-300 text-center">
        ชื่อย่อร้านค้าได้รับจากเจ้าของร้าน
      </p>
    </div>
  )
}
