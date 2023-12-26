import HomePageFilter from './Home'
import NetApy from './NetApy'
import PortfolioChart from './PortfolioChart'
import Product from './Product'

export const HomePage = () => {
  return (
    <div>
      <div className="mt-2">
        {/* <PortfolioChart /> */}
        {/* <NetApy /> */}
        <HomePageFilter />
      </div>
      <Product />
    </div>
  )
}
