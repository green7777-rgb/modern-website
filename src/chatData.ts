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

const aiResponses: Record<string, string> = {
  default: `I'm Nexus AI, your advanced multimodal assistant. I can help you with:

**Answering questions** — Ask me anything and I'll provide accurate, well-explained answers.

**Writing code** — I can write, debug, and explain code in any programming language.

**Creative writing** — Stories, articles, reports, and more — I adapt to your style and tone.

**Image prompts** — I generate detailed image prompts with style, lighting, composition, and colors.

**Data analysis** — I can analyze text and data, identify patterns, and generate insights.

**Problem solving** — Complex problems broken down into clear, logical steps.

What would you like help with today?`,
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()

  if (lower.includes('code') || lower.includes('program') || lower.includes('function') || lower.includes('javascript') || lower.includes('python')) {
    return `I'd be happy to help with code! Here's an example:\n\n\`\`\`python\ndef fibonacci(n: int) -> list[int]:\n    """Generate Fibonacci sequence up to n terms."""\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    \n    sequence = [0, 1]\n    while len(sequence) < n:\n        sequence.append(sequence[-1] + sequence[-2])\n    return sequence\n\n# Example usage\nprint(fibonacci(10))\n# Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n\`\`\`\n\nThis uses a clean, efficient approach. Want me to explain the logic, optimize it further, or help with a different language?`
  }

  if (lower.includes('image') || lower.includes('picture') || lower.includes('draw') || lower.includes('artwork')) {
    return `Here's a detailed image generation prompt:\n\n**Title:** Enchanted Forest at Twilight\n\n**Prompt:** A mystical ancient forest bathed in soft bioluminescent light, towering trees with gnarled roots covered in glowing moss, tiny fairy lights dancing between fireflies, a winding path leading to a hidden crystal-clear stream reflecting the purple and teal sky, volumetric fog rolling between the trunks, ethereal atmosphere\n\n**Style:** Cinematic Digital Art, highly detailed, 8K resolution\n\n**Lighting:** Soft bioluminescent glow, twilight ambient light, volumetric god rays\n\n**Composition:** Central path leading into depth, rule of thirds with stream on right third, low angle looking up at canopy\n\n**Negative prompt:** blurry, low quality, overexposed, watermark, text, distorted, ugly, deformed\n\nWould you like me to generate a prompt for a different scene?`
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('how are you')) {
    return `Hello! I'm **Nexus AI**, your advanced multimodal assistant. 👋\n\nI can help you with:\n- 💬 Answering questions on any topic\n- 💻 Writing and debugging code\n- ✍️ Creating stories, articles, and reports\n- 🎨 Generating detailed image prompts\n- 📊 Analyzing data and information\n- 🧩 Solving complex problems step-by-step\n\nWhat can I help you with today?`
  }

  if (lower.includes('who are you') || lower.includes('what are you') || lower.includes('about you')) {
    return `I'm **Nexus AI**, an advanced multimodal AI assistant designed to help you with a wide range of tasks.\n\n**My capabilities:**\n- Answering questions accurately and intelligently\n- Writing code in any programming language\n- Creating stories, articles, and reports\n- Solving complex problems step-by-step\n- Analyzing text and data\n- Generating detailed image prompts with style, lighting, and composition details\n- Creating artwork concepts, logos, illustrations, and realistic scenes\n\n**My rules:**\n1. I always aim to be accurate, helpful, and creative\n2. I ask for clarification when needed\n3. I explain my reasoning clearly\n4. I never make up facts when uncertain\n\nHow can I assist you?`
  }

  if (lower.includes('write') || lower.includes('story') || lower.includes('essay') || lower.includes('article')) {
    return `I'd love to help you write! Here's a quick sample:\n\n---\n\n*The last light of the sun painted the canyon walls in shades of amber and rose. She stood at the edge, her boots crunching on loose shale, and looked down into the vast emptiness below. This was it — the moment she'd trained for three years to reach.*\n\n*With steady hands, she clipped the carabiner to the anchor point and tested the tension twice. The rope uncoiled like a living thing, disappearing into the shadowed depths. She took one breath. Two. Then stepped off the edge.*\n\n---\n\nWant me to continue this story, change the genre, or help you write something specific? I can match any tone — formal, casual, persuasive, creative, or technical.`
  }

  if (lower.includes('help') || lower.includes('what can you do')) {
    return aiResponses.default
  }

  return `Great question! Let me think about that...\n\nBased on my understanding, here's what I can tell you:\n\nYour query touches on an interesting topic. I'm designed to provide accurate, well-reasoned responses while being transparent about my limitations.\n\nHere's how I'd approach this:\n1. **Understanding** — I analyze the key components of your question\n2. **Research** — I draw from my training knowledge\n3. **Reasoning** — I apply logical thinking to form a response\n4. **Delivery** — I present the answer clearly\n\nCould you provide a bit more detail about what specifically you'd like to know? The more context you give me, the better I can tailor my response to your needs.`
}

export function getSimulatedResponse(_messages: Message[]): string {
  const lastUser = [..._messages].reverse().find(m => m.role === 'user')
  if (!lastUser) return aiResponses.default
  return getAIResponse(lastUser.content)
}
