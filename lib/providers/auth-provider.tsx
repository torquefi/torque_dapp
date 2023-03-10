import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { callAPI } from '../api'
import {
  setTokenAdmin,
  getTokenAdmin,
  setTokenUser,
  clearTokenAdmin,
} from '../api/header'
import { useAlert } from './alert-dialog'

interface User {
  id: string
  username: string
}
export const AuthContext = createContext<{
  loginAdmin?: (username: string, password: string) => Promise<any>
  userGetMe?: () => Promise<any>
  adminGetMe?: () => Promise<any>
  redirectToAdminPage?: () => void
  redirectToAdminLoginPage?: () => void
  logoutAdmin?: () => Promise<any>
  admin?: User
}>({})

export function AuthProvider({ children }: { children: any }) {
  const PRE_LOGIN_PATHNAME = 'PRE_LOGIN_PATHNAME'
  const router = useRouter()
  const alert = useAlert()
  const [admin, setAdmin] = useState<User>(undefined)
  console.log('admin', admin)
  const adminGetMe = async () => {
    await callAPI({
      method: 'GET',
      url: 'https://broadlandmedia.com/api/auth/me',
      header: {},
    })
      .then((res) => {
        var { data } = res.data
        setAdmin(data)
      })
      .catch((err) => {
        console.log(err)
        setAdmin(null)
      })
  }

  const loginAdmin = async (username: string, password: string) => {
    return await axios
      .post<{ data: any }>(
        'https://broadlandmedia.com/api/auth/login',

        {
          username: username,
          password: password,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        setTokenAdmin(res.data?.data?.accessToken)
        adminGetMe().then(() => redirectToAdminPage())
      })
      .catch((err) => {
        alert.error('Login failed')
        setAdmin(null)
      })
  }

  const logoutAdmin = async () => {
    await clearTokenAdmin()
    setAdmin(null)
    redirectToAdminLoginPage()
  }

  const redirectToAdminPage = () => {
    const pathname = localStorage.getItem(PRE_LOGIN_PATHNAME)
    if (admin) {
      router.replace('/admin')
    }
  }

  const redirectToAdminLoginPage = () => {
    localStorage.setItem(PRE_LOGIN_PATHNAME, router.pathname)
    router.replace('/admin/login')
  }

  useEffect(() => {
    const tokenAdmin = getTokenAdmin()
    if (admin == undefined && location.pathname.includes('/admin')) adminGetMe()
  }, [])
  return (
    <AuthContext.Provider
      value={{
        loginAdmin,
        redirectToAdminPage,
        redirectToAdminLoginPage,
        adminGetMe,
        logoutAdmin,
        admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
