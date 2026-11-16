import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useMascota from './useMascota'
import useMascotas from './useMascotas'

describe('hooks de mascotas sin URL de API configurada', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('useMascotas termina en error claro sin realizar peticiones', async () => {
    vi.stubEnv('VITE_API_URL', '')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useMascotas())

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toMatch(/VITE_API_URL/)
    expect(result.current.data).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('useMascota termina en error claro sin realizar peticiones', async () => {
    vi.stubEnv('VITE_API_URL', '   ')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useMascota('7'))

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toMatch(/VITE_API_URL/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
