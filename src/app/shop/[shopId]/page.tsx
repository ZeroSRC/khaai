'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useShopStore } from '@/store/shopStore'
import { createSupabaseClient } from '@/lib/supabase'
import { formatMoneyFull } from '@/lib/format'
import dayjs from 'dayjs'

interface DashboardStats {
  today_sales: number
  today_orders: number
  month_sales: number
  month_expenses: number
  low_stock: number
  pending_shipments: number
}

export default function DashboardPage() {
  const { shopId } = useParams<{ shopId: string }>()
  const { shop, lineDisplayName, linePictureUrl, lineUid } = useShopStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    if (!shop || !lineUid) return
    const sb = createSupabaseClient(lineUid)
    const today = dayjs().format('YYYY-MM-DD')
    const monthStart = dayjs().startOf('month').toISOString()

    Promise.all([
      sb.from('sales').select('total_amount').eq('shop_id', shop.id).gte('created_at', today),
      sb.from('sales').select('total_amount').eq('shop_id', shop.id).gte('created_at', monthStart),
      sb.from('expenses').select('amount').eq('shop_id', shop.id).gte('expense_date', dayjs().startOf('month').format('YYYY-MM-DD')),
      sb.from('products').select('id').eq('shop_id', shop.id).lt('stock', 3).eq('is_active', true),
      sb.from('shipments').select('id').eq('shop_id', shop.id).eq('status', 'shipped'),
    ]).then(([todaySalesRes, monthSalesRes, expensesRes, lowStockRes, shipmentsRes]) => {
      const today_sales = (todaySalesRes.data ?? []).reduce((s, r) => s + Number(r.total_amount), 0)
      const today_orders = todaySalesRes.data?.length ?? 0
      const month_sales = (monthSalesRes.data ?? []).reduce((s, r) => s + Number(r.total_amount), 0)
      const month_expenses = (expensesRes.data ?? []).reduce((s, r) => s + Number(r.amount), 0)
      setStats({
        today_sales,
        today_orders,
        month_sales,
        month_expenses,
        low_stock: lowStockRes.data?.length ?? 0,
        pending_shipments: shipmentsRes.data?.length ?? 0,
      })
    })
  }, [shop, lineUid])

  if (!shop) return null

  const base = `/shop/${shopId}`

  return (
    <div>
      {/* Header */}
      <div className="bg-[#06C755] px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          {linePictureUrl ? (
            <img src={linePictureUrl} className="w-10 h-10 rounded-full" alt="" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-bold">
              {lineDisplayName?.[0] ?? '?'}
            </div>
          )}
          <div>
            <p className="text-white/80 text-xs">สวัสดี,</p>
            <p className="text-white font-semibold text-sm">{lineDisplayName}</p>
          </div>
        </div>
        <h1 className="text-white text-xl font-bold">{shop.name}</h1>
        <p className="text-white/70 text-xs mt-0.5">{dayjs().format('dddd D MMMM')}</p>
      </div>

      <div className="px-4 -mt-4">
        {/* Today card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <p className="text-xs text-gray-400 font-medium mb-2">ยอดขายวันนี้</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats ? formatMoneyFull(stats.today_sales) : '—'}
          </p>
          <p className="text-xs text-gray-400 mt-1">{stats?.today_orders ?? 0} ออเดอร์</p>
        </div>

        {/* Month stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">ยอดขายเดือนนี้</p>
            <p className="text-lg font-bold text-[#06C755]">
              {stats ? formatMoneyFull(stats.month_sales) : '—'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">ค่าใช้จ่าย</p>
            <p className="text-lg font-bold text-red-500">
              {stats ? formatMoneyFull(stats.month_expenses) : '—'}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {(stats?.low_stock ?? 0) > 0 && (
          <Link href={`${base}/products?filter=low_stock`}
            className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-amber-700">สต็อกใกล้หมด</p>
              <p className="text-xs text-amber-600">{stats?.low_stock} รายการต่ำกว่า 3 ชิ้น</p>
            </div>
          </Link>
        )}

        {(stats?.pending_shipments ?? 0) > 0 && (
          <Link href={`${base}/shipments`}
            className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-3">
            <span className="text-xl">🚚</span>
            <div>
              <p className="text-sm font-semibold text-blue-700">รอการส่งพัสดุ</p>
              <p className="text-xs text-blue-600">{stats?.pending_shipments} ออเดอร์รอยืนยันส่ง</p>
            </div>
          </Link>
        )}

        {/* Quick actions */}
        <p className="text-xs font-semibold text-gray-400 mb-2 mt-4">เมนูด่วน</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { icon: '💰', label: 'บันทึกขาย', href: `${base}/sales/new` },
            { icon: '📦', label: 'บันทึกซื้อ', href: `${base}/purchases/new` },
            { icon: '🚚', label: 'ส่งพัสดุ', href: `${base}/shipments/new` },
            { icon: '💸', label: 'ค่าใช้จ่าย', href: `${base}/expenses/new` },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 shadow-sm active:scale-95 transition-transform">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-medium text-gray-500 text-center leading-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
