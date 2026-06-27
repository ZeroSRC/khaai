import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'

dayjs.extend(buddhistEra)
dayjs.locale('th')

export function formatThaiDate(date: string | Date) {
  return dayjs(date).format('D MMM BBBB')
}

export function formatDateTime(date: string | Date) {
  return dayjs(date).format('D MMM BB HH:mm')
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatMoneyFull(amount: number) {
  return `฿${formatMoney(amount)}`
}

export function warrantyDaysLeft(endsAt: string): number {
  return Math.max(0, dayjs(endsAt).diff(dayjs(), 'day'))
}
