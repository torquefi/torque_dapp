import AppSeo from '@/components/common/App-Seo'
import { HomePage } from '@/components/pages/Home'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <AppSeo title="Home | Torque" />
      <HomePage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
