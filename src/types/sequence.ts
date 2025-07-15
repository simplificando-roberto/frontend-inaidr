export interface EmailSequence {
  id: string
  name: string
  description: string
  target: {
    company: string
    contactName: string
    contactTitle: string
    industry: string
  }
  status: 'active' | 'paused' | 'completed' | 'draft'
  metrics: {
    sent: number
    opened: number
    clicked: number
    replied: number
    meetings: number
  }
  emails: Email[]
  createdAt: Date
  lastSent?: Date
}

export interface Email {
  id: string
  sequenceNumber: number
  subject: string
  content: string
  sender: {
    name: string
    title: string
    company: string
    signature: string
  }
  recipient: {
    name: string
    company: string
  }
  sentAt: Date
  status: 'sent' | 'opened' | 'clicked' | 'replied'
  openedAt?: Date
  clickedAt?: Date
  repliedAt?: Date
}

export interface SequenceTemplate {
  id: string
  name: string
  description: string
  industry: string
  emailCount: number
  avgResponse: number
  tags: string[]
} 