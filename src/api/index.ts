import type { AxiosProgressEvent } from 'axios'
import { get, post } from '@/utils/request'

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchAnswerAPIProcess<T = any>(
  params: {
    msgId: string
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  return get<T>({
    url: `${import.meta.env.VITE_API_PREFIX}/reply-stream?msgId=${params.msgId}`,
    onDownloadProgress: params.onDownloadProgress,
  })
}
