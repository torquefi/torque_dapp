import { useRouter } from "next/router"
import Head from "next/head"
import React from "react"
import { MainLayout } from "@/layouts/MainLayout"

const NotFound: React.FC = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Not Found | Torque</title>
      </Head>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-16 items-center justify-center text-center">
        <span className="font-rogan text-[80px] font-[400] text-black dark:text-white">
          404
        </span>
        <p className="text-[#959595] w-full max-w-none md:max-w-[320px] mt-2">
          Sorry, the page you are looking for doesn&apos;t exist or has been recently moved. Thank you.
        </p>
        <div className="mt-4">
          <button 
            onClick={() => router.push("/home")}
            className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full px-5 font-medium border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]"
          >
            <span>Back Home</span>
            <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-1 group-hover:opacity-100">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="#AA5BFF" fill-rule="evenodd" clip-rule="evenodd"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

NotFound.getLayout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>

export default NotFound
