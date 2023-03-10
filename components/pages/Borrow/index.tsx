import Banner from './Banner'
import CreateBorrowVault from './CreateBorrowVault'
import ManageBorrowVault from './ManageBorrowVault'

export const BorrowPage = () => {
  return (
    <div className="space-y-[36px]">
      <Banner />
      <CreateBorrowVault />
      <ManageBorrowVault />
    </div>
  )
}
