import AppSeo from '@/components/common/App-Seo'
import { BridgePage } from '@/components/pages/Bridge'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      {/* <AppSeo title="Bridge | Torque" /> */}
      <Head>
        <title>Bridge | Torque</title>
      </Head>
      <BridgePage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
