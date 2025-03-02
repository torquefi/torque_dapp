import AppSeo from '@/components/common/App-Seo'
import { TermsPage } from '@/components/pages/Terms'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      {/* <AppSeo title="Terms | Torque" /> */}
      <Head>
        <title>
          Terms | Torque
        </title>
      </Head>
      <TermsPage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
