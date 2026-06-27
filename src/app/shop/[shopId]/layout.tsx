'use client'

import { useParams } from 'next/navigation'
import { useShopInit } from '@/hooks/useShop'
import { BottomNav } from '@/components/BottomNav'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const { shopId } = useParams<{ shopId: string }>()
  const { loading, error } = useShopInit(shopId)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#06C755] animate-pulse" />
        <p className="text-sm text-gray-400">กำลังโหลด...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-3 p-8 text-center">
        <div className="text-4xl">⚠️</div>
        <p className="font-semibold">{error}</p>
        <p className="text-sm text-gray-400">กรุณาติดต่อเจ้าของร้านเพื่อขอสิทธิ์</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh pb-20 relative">
      {children}
      <BottomNav shopId={shopId} />
    </div>
  )
}
