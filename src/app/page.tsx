export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-4 p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#06C755] flex items-center justify-center text-white text-3xl font-bold">
        L
      </div>
      <h1 className="text-xl font-bold">LINE Backoffice</h1>
      <p className="text-sm text-gray-500">เปิดลิงก์ร้านค้าของคุณจาก LINE</p>
      <p className="text-xs text-gray-400 mt-2">
        ตัวอย่าง: <code className="bg-gray-100 px-2 py-1 rounded">/shop/your-shop-slug</code>
      </p>
    </div>
  )
}
