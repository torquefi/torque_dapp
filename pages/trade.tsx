import AppSeo from '@/components/common/App-Seo'
import { TradePage } from '@/components/pages/Trade'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      {/* <AppSeo title="Trade | Torque" /> */}
      <Head>
        <title>
          Trade | Torque
        </title>
      </Head>
      <TradePage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
