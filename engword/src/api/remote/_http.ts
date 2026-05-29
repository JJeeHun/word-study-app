import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'

async function request<T>(url: string, options: RequestInit = {}): Promise<Result<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return err(body?.message ?? res.statusText)
    }

    const data = await res.json() as T
    return ok(data)
  } catch {
    return err('network_error')
  }
}

export const http = {
  get: <T>(url: string, headers?: HeadersInit) =>
    request<T>(url, { method: 'GET', headers }),

  post: <T>(url: string, body: unknown, headers?: HeadersInit) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body), headers }),

  patch: <T>(url: string, body: unknown, headers?: HeadersInit) =>
    request<T>(url, { method: 'PATCH', body: JSON.stringify(body), headers }),
}
