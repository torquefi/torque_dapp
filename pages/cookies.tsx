import AppSeo from '@/components/common/App-Seo'
import { CookiesPage } from '@/components/pages/Cookies'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      {/* <AppSeo title="Cookies | Torque" /> */}
      <Head>
        <title>
          Cookies | Torque
        </title>
      </Head>
      <CookiesPage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
