const TOKEN_KEY = 'monora_token'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  }
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body)
  }
  const res = await fetch(`/api${path}`, config)
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(data.message || 'Request failed')
  }
  return res.json()
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
