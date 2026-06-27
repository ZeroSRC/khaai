import { create } from 'zustand'
import type { Shop, ShopMember } from '@/lib/types'

interface ShopState {
  shop: Shop | null
  member: ShopMember | null
  lineUid: string | null
  lineDisplayName: string | null
  linePictureUrl: string | null

  setShop: (shop: Shop) => void
  setMember: (member: ShopMember) => void
  setLineProfile: (uid: string, name: string, picture: string) => void
  clear: () => void
}

export const useShopStore = create<ShopState>((set) => ({
  shop: null,
  member: null,
  lineUid: null,
  lineDisplayName: null,
  linePictureUrl: null,

  setShop: (shop) => set({ shop }),
  setMember: (member) => set({ member }),
  setLineProfile: (lineUid, lineDisplayName, linePictureUrl) =>
    set({ lineUid, lineDisplayName, linePictureUrl }),
  clear: () =>
    set({
      shop: null,
      member: null,
      lineUid: null,
      lineDisplayName: null,
      linePictureUrl: null,
    }),
}))
