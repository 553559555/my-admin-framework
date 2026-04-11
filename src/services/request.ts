import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message?: string
}

export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  skipAuth?: boolean
  returnRawResponse?: boolean
}

export class RequestError extends Error {
  code?: number
  status?: number

  constructor(message: string, options?: { code?: number; status?: number }) {
    super(message)
    this.name = 'RequestError'
    this.code = options?.code
    this.status = options?.status
  }
}

class HttpRequest {
  private readonly instance: AxiosInstance

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
      timeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 10000),
      ...config,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use((config) => this.handleRequest(config))
    this.instance.interceptors.response.use(
      (response) => this.handleResponse(response),
      (error) => Promise.reject(this.handleError(error)),
    )
  }

  private handleRequest(config: InternalAxiosRequestConfig & RequestConfig) {
    if (config.skipAuth) {
      return config
    }

    const token = window.localStorage.getItem('token')
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  }

  private handleResponse<T>(response: AxiosResponse<ApiResponse<T> | T, unknown>) {
    if ((response.config as RequestConfig).returnRawResponse) {
      return response
    }

    const payload = response.data
    if (this.isApiResponse<T>(payload)) {
      if (payload.code === 0 || payload.code === 200) {
        return payload.data
      }

      throw new RequestError(payload.message || 'Request failed', {
        code: payload.code,
        status: response.status,
      })
    }

    return payload
  }

  private handleError(error: AxiosError<ApiResponse>) {
    const status = error.response?.status
    const message =
      error.response?.data?.message ||
      error.message ||
      'Network request failed'

    return new RequestError(message, {
      code: error.response?.data?.code,
      status,
    })
  }

  private isApiResponse<T>(value: ApiResponse<T> | T): value is ApiResponse<T> {
    return typeof value === 'object' && value !== null && 'code' in value && 'data' in value
  }

  request<T = unknown, D = unknown>(config: RequestConfig<D>) {
    return this.instance.request<T, T, D>(config)
  }

  get<T = unknown, P = unknown>(url: string, config?: RequestConfig<P>) {
    return this.request<T, P>({
      method: 'GET',
      url,
      ...config,
    })
  }

  post<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>) {
    return this.request<T, D>({
      method: 'POST',
      url,
      data,
      ...config,
    })
  }

  put<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>) {
    return this.request<T, D>({
      method: 'PUT',
      url,
      data,
      ...config,
    })
  }

  patch<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<D>) {
    return this.request<T, D>({
      method: 'PATCH',
      url,
      data,
      ...config,
    })
  }

  delete<T = unknown, D = unknown>(url: string, config?: RequestConfig<D>) {
    return this.request<T, D>({
      method: 'DELETE',
      url,
      ...config,
    })
  }
}

const request = new HttpRequest()

export default request