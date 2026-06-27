'use client'

import type { Liff } from '@line/liff'

let liffInstance: Liff | null = null

export async function initLiff(): Promise<Liff> {
  if (liffInstance) return liffInstance

  const liff = (await import('@line/liff')).default
  await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
  liffInstance = liff
  return liff
}

export async function getLiffProfile() {
  const liff = await initLiff()
  if (!liff.isLoggedIn()) {
    liff.login()
    // login redirects, so this never resolves
    return new Promise<never>(() => {})
  }
  return liff.getProfile()
}

export async function getLineUid(): Promise<string> {
  const profile = await getLiffProfile()
  return profile.userId
}

export async function closeLiff() {
  const liff = await initLiff()
  liff.closeWindow()
}
