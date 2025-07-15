export interface LinkedInMessage {
  id: string
  conversationId: string
  sender: {
    id: string
    name: string
    title: string
    avatar: string
    company: string
    isBot?: boolean
  }
  recipient: {
    id: string
    name: string
    title: string
    avatar: string
    company: string
  }
  content: string
  type: 'text' | 'image' | 'file' | 'link' | 'connection_request' | 'automated'
  timestamp: Date
  read: boolean
  attachments?: MessageAttachment[]
  metadata?: {
    source: 'manual' | 'automated' | 'template'
    campaign_id?: string
    template_id?: string
  }
}

export interface MessageAttachment {
  id: string
  type: 'image' | 'document' | 'link' | 'video'
  url: string
  name: string
  size?: number
  preview?: string
}

export interface LinkedInConversation {
  id: string
  participants: ConversationParticipant[]
  messages: LinkedInMessage[]
  lastMessage: LinkedInMessage
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'archived' | 'blocked' | 'ended'
  unreadCount: number
  lead?: LeadInfo
  tags?: string[]
  notes?: string
  priority: 'high' | 'medium' | 'low'
  stage: 'initial' | 'qualifying' | 'nurturing' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
}

export interface ConversationParticipant {
  id: string
  name: string
  title: string
  avatar: string
  company: string
  email?: string
  phone?: string
  location?: string
  industry?: string
  connectionDate?: Date
  lastSeen?: Date
  isOnline?: boolean
}

export interface LeadInfo {
  id: string
  score: number
  grade: 'A' | 'B' | 'C' | 'D'
  source: 'organic' | 'paid' | 'referral' | 'direct'
  intent: 'high' | 'medium' | 'low'
  budget?: string
  timeline?: string
  pain_points?: string[]
  interests?: string[]
  company_size?: string
  decision_maker?: boolean
  qualification_status: 'qualified' | 'unqualified' | 'pending'
  next_action?: {
    type: 'call' | 'email' | 'meeting' | 'proposal' | 'follow_up'
    date: Date
    description: string
  }
}

export interface MessageTemplate {
  id: string
  name: string
  subject?: string
  content: string
  category: 'connection' | 'follow_up' | 'nurturing' | 'proposal' | 'closing'
  variables: TemplateVariable[]
  success_rate?: number
  usage_count?: number
  last_used?: Date
  is_active: boolean
  tags?: string[]
}

export interface TemplateVariable {
  name: string
  type: 'text' | 'number' | 'date' | 'boolean'
  default_value?: string
  description: string
  required: boolean
}

export interface ConversationAnalytics {
  conversationId: string
  response_time: number
  message_count: number
  engagement_score: number
  sentiment: 'positive' | 'neutral' | 'negative'
  topics: string[]
  conversion_probability: number
  next_best_action: string
  recommended_followup: Date
}

export interface MessageCampaign {
  id: string
  name: string
  description: string
  template: MessageTemplate
  target_audience: {
    industries: string[]
    job_titles: string[]
    company_sizes: string[]
    locations: string[]
  }
  schedule: {
    start_date: Date
    end_date: Date
    send_times: string[]
    timezone: string
  }
  metrics: {
    sent: number
    delivered: number
    opened: number
    replied: number
    connected: number
    conversion_rate: number
  }
  status: 'draft' | 'active' | 'paused' | 'completed'
  budget?: number
} 