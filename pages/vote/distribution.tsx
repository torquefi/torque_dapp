import AppSeo from '@/components/common/App-Seo'
import { Distribution } from '@/components/pages/Vote/Distribution'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      {/* <AppSeo title="Distribution | Torque" /> */}

      <Head>
        <title>Distribution | Torque</title>
      </Head>
      <Distribution />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
