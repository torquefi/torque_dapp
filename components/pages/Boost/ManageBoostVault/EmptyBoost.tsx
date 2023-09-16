export const EmptyBoost = () => {
  return (
    <div className="mt-[24px] overflow-hidden rounded-[12px] border border-neutral-300 from-[#030303] to-[#030303] dark:border-neutral-800 dark:bg-gradient-to-b">
      <div className="flex h-[382px] flex-col items-center justify-center bg-[url(/images/bg-grid-mobile.png)] bg-contain bg-top bg-no-repeat md:bg-[url(/images/bg-grid-desktop.png)]">
        <img className="w-[132px]" src="/images/boost-icon.png" alt="" />
        <p className="font-larken text-[28px] text-black dark:text-white">
          No vaults created yet
        </p>
        <p className="mt-[16px] max-w-[428px] text-center font-body text-[18px] text-[#959595]">
          Deposit assets to create a Boost vault & capture passive compound
          yield via dynamic strategies.
        </p>
      </div>
    </div>
  )
}
