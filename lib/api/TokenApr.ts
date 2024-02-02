import axiosInstance from "@/configs/axios.config"


export class TokenApr {
  static async getListApr(payload: Record<string, any> = {}) {
    const res = await axiosInstance.post('/api/token-apr/list-apr', payload)
    return res?.data
  }
}
