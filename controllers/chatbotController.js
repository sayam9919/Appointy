import doctorModel from '../models/doctorModel.js'
import { getReplyWithOpenAI } from '../config/ai.js'

const SITE_GUIDANCE = `Website (Appointy) info:
- Doctors are browsable at: GET /doctors (frontend route) and backend API: GET /api/doctor/list
- Authentication:
  - Patient signup/login at: POST /api/user/register and POST /api/user/login
  - Auth token is required for protected routes.
- Appointment booking flow:
  - Choose a doctor from the Doctors page
  - Book by selecting slot date/time (see Smart Scheduling page: /smart-scheduling)
  - Smart Scheduling shows queue prediction (prototype simulation)
- Symptom/health assistant page:
  - /health-assistant shows an interactive symptoms/condition explorer and suggests related specialties.
- User appointment management:
  - My Appointments: /my-appointments
  - Cancel/complete available via user protected endpoints.

When recommending doctors:
- Suggest a relevant specialty and advise the user to browse doctors and book an available slot.

Medical safety:
- Do NOT diagnose.
- Provide general information only.
- If severe symptoms (chest pain, difficulty breathing, stroke symptoms, uncontrolled bleeding, severe allergic reaction), advise urgent care/emergency immediately.
- Encourage seeking professional care for persistent or worsening symptoms.
`

const detectSymptomText = (message) => {
  if (!message) return ''
  const m = message.toLowerCase()
  // crude heuristics for symptoms/triage language
  const symptomKeywords = [
    'fever', 'cough', 'cold', 'flu', 'sore throat', 'headache', 'pain', 'vomit', 'nausea',
    'diarrhea', 'stomach', 'abdominal', 'rash', 'itch', 'dizziness', 'weakness', 'fatigue',
    'body ache', 'joint pain', 'anxiety', 'stress', 'back pain'
  ]
  const hit = symptomKeywords.find((k) => m.includes(k))
  return hit ? message : ''
}

const specialtyFromSymptomsFallback = (message) => {
  const m = message.toLowerCase()

  const rules = [
    { match: ['pimple', 'acne', 'skin', 'rash', 'itch', 'hives'], specialty: 'Dermatologist' },
    { match: ['pregnan', 'period', 'gynec', 'obgyn', 'vaginal'], specialty: 'Gynecologist' },
    { match: ['heart', 'chest pain', 'cardio', 'palpitation'], specialty: 'Cardiologist' },
    { match: ['child', 'pediatric', 'kid'], specialty: 'Pediatrician' },
    { match: ['eye', 'vision'], specialty: 'Ophthalmologist' },
    { match: ['ear', 'nose', 'throat', 'sinus', 'ent', 'sore throat'], specialty: 'ENT Specialist' },
    { match: ['stomach', 'gastric', 'acidity', 'vomit', 'nausea', 'diarrhea', 'gastro', 'abdominal'], specialty: 'Gastroenterologist' },
    { match: ['anxiety', 'stress', 'panic', 'sleep'], specialty: 'Psychiatrist' },
    { match: ['headache', 'migraine', 'neurolog'], specialty: 'Neurologist' },
    { match: ['urine', 'urolog', 'kidney', 'prostate'], specialty: 'Urologist' },
    { match: ['breath', 'cough', 'wheeze', 'pulmon'], specialty: 'Pulmonologist' },
    { match: ['arthritis', 'rheuma', 'joint'], specialty: 'Rheumatologist' },
    { match: ['thyroid', 'hormone', 'diabetes', 'endocr'], specialty: 'Endocrinologist' },
    { match: ['cancer', 'oncology', 'tumor'], specialty: 'Oncologist' },
    { match: ['blood', 'iron', 'anemia', 'weakness', 'pale'], specialty: 'General Physician' },
  ]

  const found = rules.find((r) => r.match.some((k) => m.includes(k)))
  return found?.specialty || 'General Physician'
}

const formatDoctorSuggestions = async (specialty) => {
  try {
    const doctors = await doctorModel.find({ speciality }).select('name speciality image fees experience available').limit(6)
    return doctors
  } catch {
    return []
  }
}

const chatbot = async (req, res) => {
  try {
    const { message, context = {} } = req.body || {}
    const userMessage = typeof message === 'string' ? message.trim() : ''

    if (!userMessage) {
      return res.status(400).json({ success: false, message: 'message is required' })
    }

    const symptomText = detectSymptomText(userMessage)

    // Fallback specialty suggestion (also used to provide structure to the LLM)
    const fallbackSpecialty = specialtyFromSymptomsFallback(symptomText || userMessage)

    const doctorsForFallback = await formatDoctorSuggestions(fallbackSpecialty)

    const prompt = `${SITE_GUIDANCE}

User message:
"""
${userMessage}
"""

User triage request:
- HasSymptomContent: ${symptomText ? 'yes' : 'no'}
- SuggestedSpecialty (fallback heuristic): ${fallbackSpecialty}

If the user seems to be asking about website usage, prioritize answering about booking, doctors list, and routes.

If the user provided symptoms, respond with:
1) Likely relevant specialty (no diagnosis)
2) Recommended next steps (book appointment / check / urgent care if severe)
3) Optional: general home care advice that is safe (no prescription)
4) Suggested doctors (if available) as plain text names and fees/availability

Keep the reply concise, friendly, and safe.`

    const openAIReply = await getReplyWithOpenAI({ prompt })

    const reply = openAIReply || (function () {
      const docsLine = doctorsForFallback.length
        ? `\n\nAvailable doctors for ${fallbackSpecialty}:\n` + doctorsForFallback
          .map((d) => `- ${d.name} (${d.available ? 'Available' : 'Not Available'}) — ₹${d.fees ?? '—'}`)
          .join('\n')
        : ''

      if (symptomText) {
        return `I can’t diagnose you, but your symptoms may fit a ${fallbackSpecialty}.
\nRecommended next steps:
- Book an appointment with a ${fallbackSpecialty} via the Doctors page
- If symptoms are severe (chest pain, trouble breathing, stroke-like signs, uncontrolled bleeding), seek urgent/emergency care now
\nYou can also use our Health Assistant page (/health-assistant) for symptom-based guidance.${docsLine}`
      }

      return `Here’s help about the website:\n- Doctors list: browse /doctors and choose a specialist\n- Smart Scheduling: /smart-scheduling for slot selection + queue prediction\n- Patient auth: /login (signup/login)\n- Symptom guide: /health-assistant\n\nTell me what you want to do, and I’ll guide you step-by-step.`
    })()

    return res.json({ success: true, reply })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: error.message || 'Server error' })
  }
}

export { chatbot }

