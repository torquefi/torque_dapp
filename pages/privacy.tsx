import AppSeo from '@/components/common/App-Seo'
import { PrivacyPage } from '@/components/pages/Privacy'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      {/* <AppSeo title="Privacy | Torque" /> */}
      <Head>
        <title>
          Privacy | Torque
        </title>
      </Head>
      <PrivacyPage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
