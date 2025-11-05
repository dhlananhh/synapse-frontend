import { z } from 'zod'

// Define the Zod schema
export const reportSchema = z.object({
  reason: z.enum([
    'SPAM',
    'HARASSMENT',
    'HATE_SPEECH',
    'NSFW_CONTENT',
    'VIOLENCE',
    'MISINFORMATION',
    'ILLEGAL_ACTIVITY',
    'SELF_HARM',
    'IMPERSONATION',
    'COPYRIGHT',
    'OFF_TOPIC',
    'OTHER',
  ]),
  reasonDetail: z.string().max(500).optional(),
})

// Infer the form data type from the Zod schema
export type ReportFormData = z.infer<typeof reportSchema>
