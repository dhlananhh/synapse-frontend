export const ReasonColorMapping: Record<
  | 'SPAM'
  | 'HARASSMENT'
  | 'HATE_SPEECH'
  | 'NSFW_CONTENT'
  | 'VIOLENCE'
  | 'MISINFORMATION'
  | 'ILLEGAL_ACTIVITY'
  | 'SELF_HARM'
  | 'IMPERSONATION'
  | 'COPYRIGHT'
  | 'OFF_TOPIC'
  | 'OTHER',
  string
> = {
  SPAM: '#FF4500', // Bright orange
  HARASSMENT: '#C70039', // Deep red
  HATE_SPEECH: '#900C3F', // Dark purple
  NSFW_CONTENT: '#FFC300', // Yellow
  VIOLENCE: '#4B0082', // Tpurple
  MISINFORMATION: '#DAF7A6', // Light green
  ILLEGAL_ACTIVITY: '#581845', // Dark violet
  SELF_HARM: '#FF69B4', // Hot pink
  IMPERSONATION: '#3498DB', // Blue
  COPYRIGHT: '#2ECC71', // Green
  OFF_TOPIC: '#BDC3C7', // Light gray
  OTHER: '#7F8C8D', // Dark gray
}
