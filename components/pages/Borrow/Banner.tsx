import Link from 'next/link'

export default function Banner() {
  return (
    <div className="relative">
      <img
        className="rounded-xl"
        src="/assets/banners/borrow-compressed.png"
        alt="Torque Borrow"
      />
      <Link
        href="/overview"
        className="absolute left-[24px] top-[24px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#030303]"
      >
        <img className="w-[12px]" src="/icons/arrow-left.svg" alt="" />
      </Link>
    </div>
  )
}
