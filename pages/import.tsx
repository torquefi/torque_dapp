import AppSeo from '@/components/common/App-Seo'
import { ImportPage } from '@/components/pages/Import'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      {/* <AppSeo title="Import | Torque" /> */}
      <Head>
        <title>Import | Torque</title>
      </Head>
      <ImportPage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
