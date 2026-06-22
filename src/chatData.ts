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

const SYSTEM_PROMPT = `You are an advanced multimodal AI assistant capable of:

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

const API_KEY = import.meta.env.VITE_AI_API_KEY as string
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'google/gemma-4-31b-it:free'

export async function fetchAIResponse(messages: Message[]): Promise<string> {
  if (!API_KEY) {
    return 'API key not configured. Please set VITE_AI_API_KEY in your Cloudflare Pages environment variables.'
  }

  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ]

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Nexus AI',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: formattedMessages,
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.9,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error:', response.status, errorText)
      throw new Error(`API error ${response.status}`)
    }

    const data = await response.json()

    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content.trim()
    }

    console.error('Unexpected response format:', data)
    return 'I received an unexpected response. Please try again.'
  } catch (error) {
    console.error('AI fetch failed:', error)
    throw error
  }
}
