import axios from 'axios'
import { getTokenAdmin, getTokenUser } from './header'

export type HeaderType = {}
export type BodyType = {}
export type METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE'
export interface TypeProps {
  method: METHOD
  url: string
  header?: HeaderType
  body?: BodyType
  params?: any
}

export async function callAPI({
  method,
  url,
  body = {},
  params = {},
  header = {},
  ...props
}: TypeProps) {
  console.log('callAPI')
  let token = getTokenUser()
  if (location.pathname.includes('/admin')) {
    token = getTokenAdmin()
  }

  const contextHeader = {
    ...header,
    ...(token && token != 'undefined'
      ? { Authorization: `Bearer ${token}` }
      : {}),
  }
  // console.log(body)
  // return await axios({
  //     method: method,
  //     url: url,
  //     data: body,
  //     headers: contextHeader,
  //     params: params,
  //     responseType: 'json',
  // })
  if (method == 'GET') {
    return await axios.get<any>(`${url}`, {
      data: body,
      headers: contextHeader,
      params: params,
    })
  } else if (method == 'POST') {
    return await axios.post<any>(`${url}`, body, {
      headers: contextHeader,
      params: params,
    })
  } else if (method == 'PUT') {
    return await axios.put<any>(`${url}`, {
      data: body,
      headers: contextHeader,
      params: params,
    })
  } else if (method == 'DELETE') {
    return await axios.delete<any>(`${url}`, {
      data: body,
      headers: contextHeader,
      params: params,
    })
  }
}
