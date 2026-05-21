const getReplyWithOpenAI = async ({ prompt, model = 'gpt-4o-mini' }) => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  // Use fetch to avoid requiring any SDK dependency.
  // Node 18+ includes fetch; fallback will throw if not available.
  if (typeof fetch !== 'function') return null

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful medical triage assistant for a healthcare appointment booking website. Be safe and do not provide diagnoses or unsafe medication advice. Encourage users to see a qualified clinician, and recommend the appropriate specialty.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    }),
  })

  if (!resp.ok) return null

  const data = await resp.json()
  return data?.choices?.[0]?.message?.content || null
}

export { getReplyWithOpenAI }

