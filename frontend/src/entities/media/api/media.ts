import { api } from "@/shared/api/api"

export const mediaApi = {
  uploadMedia: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<{ link: string }>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

