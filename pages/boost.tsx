import AppSeo from '@/components/common/App-Seo'
import { BoostPage } from '@/components/pages/Boost'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      {/* <AppSeo title="Boost | Torque" /> */}
      <Head>
        <title>
          Boost | Torque
        </title>
      </Head>
      <BoostPage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
