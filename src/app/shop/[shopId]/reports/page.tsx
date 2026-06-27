'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useShopStore } from '@/store/shopStore'
import { createSupabaseClient } from '@/lib/supabase'
import { formatMoneyFull } from '@/lib/format'
import dayjs from 'dayjs'

interface MonthReport {
  total_sales: number
  total_purchases: number
  total_expenses: number
  order_count: number
}

export default function ReportsPage() {
  const { shopId } = useParams<{ shopId: string }>()
  const { shop, lineUid } = useShopStore()
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'))
  const [report, setReport] = useState<MonthReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!shop || !lineUid) return
    setLoading(true)
    const sb = createSupabaseClient(lineUid)
    const start = dayjs(month).startOf('month').toISOString()
    const end = dayjs(month).endOf('month').toISOString()

    Promise.all([
      sb.from('sales').select('total_amount').eq('shop_id', shop.id).gte('created_at', start).lte('created_at', end),
      sb.from('purchases').select('total_amount').eq('shop_id', shop.id).gte('created_at', start).lte('created_at', end),
      sb.from('expenses').select('amount').eq('shop_id', shop.id).gte('expense_date', dayjs(month).format('YYYY-MM-01')).lte('expense_date', dayjs(month).endOf('month').format('YYYY-MM-DD')),
    ]).then(([salesRes, purchasesRes, expensesRes]) => {
      const total_sales = (salesRes.data ?? []).reduce((s, r) => s + Number(r.total_amount), 0)
      const total_purchases = (purchasesRes.data ?? []).reduce((s, r) => s + Number(r.total_amount), 0)
      const total_expenses = (expensesRes.data ?? []).reduce((s, r) => s + Number(r.amount), 0)
      setReport({
        total_sales,
        total_purchases,
        total_expenses,
        order_count: salesRes.data?.length ?? 0,
      })
      setLoading(false)
    })
  }, [shop, lineUid, month])

  const grossProfit = (report?.total_sales ?? 0) - (report?.total_purchases ?? 0)
  const netProfit = grossProfit - (report?.total_expenses ?? 0)

  return (
    <div>
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-lg font-bold mb-3">รายงานประจำเดือน</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setMonth(dayjs(month).subtract(1, 'month').format('YYYY-MM'))}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">←</button>
          <span className="flex-1 text-center text-sm font-semibold">
            {dayjs(month).format('MMMM YYYY')}
          </span>
          <button
            onClick={() => setMonth(dayjs(month).add(1, 'month').format('YYYY-MM'))}
            disabled={month >= dayjs().format('YYYY-MM')}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 disabled:opacity-30">→</button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* P&L Summary */}
        <div className={`rounded-2xl p-5 ${netProfit >= 0 ? 'bg-[#06C755]' : 'bg-red-500'}`}>
          <p className="text-white/80 text-xs mb-1">กำไรสุทธิ</p>
          <p className="text-white text-3xl font-bold">{formatMoneyFull(netProfit)}</p>
          <p className="text-white/70 text-xs mt-1">{report?.order_count ?? 0} ออเดอร์</p>
        </div>

        {[
          { label: 'รายรับ (ยอดขาย)', value: report?.total_sales ?? 0, color: 'text-[#06C755]', icon: '💰' },
          { label: 'รายจ่าย (ซื้อสินค้า)', value: report?.total_purchases ?? 0, color: 'text-red-500', icon: '📦' },
          { label: 'ค่าใช้จ่ายอื่น', value: report?.total_expenses ?? 0, color: 'text-orange-500', icon: '💸' },
          { label: 'กำไรขั้นต้น', value: grossProfit, color: grossProfit >= 0 ? 'text-[#06C755]' : 'text-red-500', icon: '📈' },
        ].map((row) => (
          <div key={row.label} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{row.icon}</span>
              <span className="text-sm text-gray-700 font-medium">{row.label}</span>
            </div>
            <span className={`text-base font-bold ${row.color}`}>{formatMoneyFull(row.value)}</span>
          </div>
        ))}

        {/* Profit margin */}
        {(report?.total_sales ?? 0) > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-2 font-medium">อัตรากำไร</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#06C755] transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, (netProfit / (report?.total_sales ?? 1)) * 100))}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-700 w-14 text-right">
                {report ? ((netProfit / report.total_sales) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
