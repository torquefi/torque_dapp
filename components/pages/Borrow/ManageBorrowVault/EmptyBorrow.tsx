export const EmptyBorrow = () => {
  return (
    <div className="mt-[24px] overflow-hidden rounded-[12px] border border-neutral-300 from-[#030303] to-[#030303] dark:border-neutral-800 dark:bg-gradient-to-b">
      <div className="flex h-[300px] flex-col items-center justify-center bg-[url(/images/bg-grid-mobile.png)] bg-contain bg-top bg-no-repeat md:bg-[url(/images/bg-grid-desktop.png)]">
        <img className="w-[112px]" src="/images/borrow-icon.png" alt="" />
        <p className="font-larken text-[28px] text-black dark:text-white">
          No vaults created yet
        </p>
        <p className="mt-[16px] max-w-[400px] text-center font-body text-[18px] text-[#959595]">
          Deposit assets to create a Borrow vault & access a self-service line
          of credit. Repay as you prefer.
        </p>
      </div>
    </div>
  )
}
