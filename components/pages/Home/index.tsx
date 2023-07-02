import NetApy from './NetApy'
import PortfolioChart from './PortfolioChart'
import Product from './Product'

export const HomePage = () => {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <PortfolioChart />
        <NetApy />
      </div>
      <Product />
    </div>
  )
}
