import axiosInstance from "@/configs/axios.config"


export class LabelApi {
  static async getListLabel(payload: Record<string, any> = {}) {
    const res = await axiosInstance.post('/api/label/get-list-label', payload)
    return res?.data
  }
  static async updateLabel(payload: Record<string, any> = {}) {
    const res = await axiosInstance.post('/api/label/update-label', payload)
    return res?.data
  }
}
