import { ApiError } from '../utils/ApiError.js'

export class AiService {
  async chatCompletion(payload) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new ApiError(500, 'GROQ_API_KEY is not configured on backend')
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const message = data?.error?.message || `Groq API Error ${response.status}`
      throw new ApiError(response.status, message)
    }

    return data
  }
}
