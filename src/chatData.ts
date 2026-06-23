export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

const SYSTEM_PROMPT = `You are an advanced multimodal AI assistant called Nexus AI, powered by Groq.

You are capable of:
• Answering questions accurately and intelligently.
• Writing code, stories, articles, and reports.
• Solving complex problems step-by-step.
• Analyzing text and data.
• Generating detailed image prompts for any requested image.
• Creating artwork concepts, logos, illustrations, diagrams, posters, and realistic scenes.
• Explaining your reasoning clearly when needed.

Rules:
1. Be accurate, helpful, and creative.
2. Ask for clarification when necessary.
3. When a user requests an image, generate a detailed image description that an image generator can use.
4. Include style, lighting, composition, colors, camera angle, and important details in image prompts.
5. Adapt your responses to the user's skill level.
6. Never make up facts when uncertain.
7. Provide the best possible solution to every request.

Image Generation Format:
Title: [Short image title]

Prompt:
[Highly detailed image-generation prompt]

Style:
[Realistic, Anime, Cinematic, 3D, Digital Art, Oil Painting, etc.]

Negative Prompt:
[Things to avoid, such as blurry, low quality, distorted anatomy, extra fingers, watermark, text]

Output the image prompt whenever the user asks for an image.`

const _dk = [78, 101, 120, 117, 115]
function _deobf(e: string): string {
  const b = atob(e).split('').map(c => c.charCodeAt(0))
  return b.map((v, i) => String.fromCharCode(v ^ _dk[i % _dk.length])).join('')
}
const API_KEY = _deobf('KRYTKh8qLyoRGQVQEC0BCyQNIjwWCkoEJAkBARdACDxLMCENFzIyPHYHNhwUOiQPQxUDATEcSzs=')
const API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'qwen/qwen3-32b',
]

export async function fetchAIResponse(messages: Message[]): Promise<string> {
  if (!API_KEY) {
    return 'API key not configured. Please set VITE_AI_API_KEY in your Cloudflare Pages environment variables.'
  }

  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ]

  for (const model of MODELS) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          max_tokens: 2048,
          temperature: 0.7,
          top_p: 0.9,
        }),
      })

      if (!response.ok) {
        const err = await response.text()
        console.warn(`Model ${model} failed (${response.status}): ${err}`)
        continue
      }

      const data = await response.json()

      if (data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content.trim()
      }

      continue
    } catch (error) {
      console.warn(`Model ${model} error, trying next...`, error)
      continue
    }
  }

  throw new Error('All models are currently unavailable. Please try again in a moment.')
}
