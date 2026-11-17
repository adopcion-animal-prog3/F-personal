const DEFAULT_BASE_URL = 'http://localhost:3000'

let authToken = ''

const buildApiUrl = (path = '') => {
  const baseUrl = (import.meta.env.VITE_API_URL || DEFAULT_BASE_URL).trim()

  if (!path) {
    return baseUrl
  }

  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

const buildHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  return headers
}

export const setAuthToken = (token) => {
  authToken = token || ''
}

export const clearAuthToken = () => {
  authToken = ''
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const getApiError = async (response) => {
  const errorText = await response.text().catch(() => '')

  if (!errorText) {
    return `La API respondió con un error (${response.status}).`
  }

  try {
    const payload = JSON.parse(errorText)
    return payload.detail || payload.message || payload.error || errorText
  } catch {
    return errorText
  }
}

export const apiClient = {
  async request(path, options = {}) {
    const response = await fetch(buildApiUrl(path), {
      ...options,
      headers: buildHeaders(options.headers || {}),
    })

    if (!response.ok) {
      throw new ApiError(await getApiError(response), response.status)
    }

    return response.json().catch(() => null)
  },

  async get(path) {
    return this.request(path, { method: 'GET' })
  },

  async post(path, body) {
    return this.request(path, {
      method: 'POST',
      body: JSON.stringify(body ?? {}),
    })
  },

  async put(path, body) {
    return this.request(path, {
      method: 'PUT',
      body: JSON.stringify(body ?? {}),
    })
  },

  async delete(path) {
    return this.request(path, { method: 'DELETE' })
  },
}
