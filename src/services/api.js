const DEFAULT_BASE_URL = 'http://localhost:3000'

const buildApiUrl = (path = '') => {
  const baseUrl = import.meta.env.VITE_API_URL || DEFAULT_BASE_URL

  if (!path) {
    return baseUrl
  }

  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
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
  async get(path) {
    const response = await fetch(buildApiUrl(path), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(await getApiError(response))
    }

    return response.json().catch(() => null)
  },
}
