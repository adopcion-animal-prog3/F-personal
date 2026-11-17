let authToken = ''
export const API_UNAUTHORIZED_EVENT = 'f-personal:unauthorized'

export const requireApiUrl = (resource) => {
  if (!import.meta.env.VITE_API_URL?.trim()) {
    throw new Error(`La URL de la API no está configurada. Definí VITE_API_URL para consultar ${resource}.`)
  }
}

const buildApiUrl = (path = '') => {
  const baseUrl = import.meta.env.VITE_API_URL.trim()

  if (!path) {
    return baseUrl
  }

  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

const buildHeaders = (customHeaders = {}, hasJsonBody = false) => {
  const headers = {
    ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
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
  let errorText = ''
  try {
    errorText = await response.text()
  } catch {
    return `La API respondió con un error (${response.status}).`
  }

  if (!errorText) {
    return `La API respondió con un error (${response.status}).`
  }

  try {
    const payload = JSON.parse(errorText)
    const message = payload.message || payload.error?.message || payload.detail
    const validationMessages = Array.isArray(payload.errors)
      ? payload.errors
        .map((item) => [item.field, item.message].filter(Boolean).join(': '))
        .filter(Boolean)
      : []
    return [message, ...validationMessages].filter(Boolean).join(' — ') || errorText
  } catch {
    return errorText
  }
}

export const apiClient = {
  async request(path, options = {}) {
    const response = await fetch(buildApiUrl(path), {
      ...options,
      headers: buildHeaders(options.headers || {}, options.body != null),
    })

    if (!response.ok) {
      const message = await getApiError(response)
      if (response.status === 401 && authToken) {
        clearAuthToken()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event(API_UNAUTHORIZED_EVENT))
        }
      }
      throw new ApiError(message, response.status)
    }

    if (response.status === 204) {
    return null
    }

    const responseText = await response.text()
    if (!responseText.trim()) {
    throw new Error('La API respondió sin contenido para una operación exitosa.')
    }

    let payload
    try {
    payload = JSON.parse(responseText)
    } catch {
    throw new Error('La API respondió con un formato JSON inválido.')
    }

    if (payload?.success === true) {
    if (!Object.prototype.hasOwnProperty.call(payload, 'data')) {
      throw new Error('La API devolvió una respuesta exitosa sin datos.')
    }
    return payload.data
    }

    return payload
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
