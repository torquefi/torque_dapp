const TOKEN_ADMIN = 'tokenAdmin'
const TOKEN_USER = 'tokenUser'

export function setTokenAdmin(token: string) {
  localStorage.setItem(TOKEN_ADMIN, token)
}

export function clearTokenAdmin() {
  localStorage.removeItem(TOKEN_ADMIN)
}
export function getTokenAdmin() {
  return localStorage.getItem(TOKEN_ADMIN)
}

export function setTokenUser(token: string) {
  localStorage.setItem(TOKEN_USER, token)
}
export function getTokenUser() {
  return localStorage.getItem(TOKEN_USER)
}
