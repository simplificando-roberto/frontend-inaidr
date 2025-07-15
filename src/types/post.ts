export interface LinkedInPost {
  id: string
  author: {
    name: string
    title: string
    avatar: string
    company: string
    verified: boolean
  }
  content: string
  images?: string[]
  video?: string
  createdAt: Date
  metrics: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  engagement: {
    rate: number
    level: 'low' | 'medium' | 'high'
  }
  tags?: string[]
  type: 'text' | 'image' | 'video' | 'article' | 'poll'
  isSponsored?: boolean
  location?: string
}

export interface LinkedInComment {
  id: string
  author: {
    name: string
    title: string
    avatar: string
    company: string
  }
  content: string
  createdAt: Date
  likes: number
  replies?: LinkedInComment[]
  isReply?: boolean
  parentId?: string
}

export interface PostAnalytics {
  postId: string
  impressions: number
  clicks: number
  shares: number
  saves: number
  followers_gained: number
  demographics: {
    age: { [key: string]: number }
    gender: { [key: string]: number }
    location: { [key: string]: number }
    industry: { [key: string]: number }
    seniority: { [key: string]: number }
  }
  performance: {
    reach: number
    engagement_rate: number
    click_through_rate: number
    cost_per_click?: number
    conversion_rate?: number
  }
}

export interface PostTemplate {
  id: string
  name: string
  description: string
  content: string
  category: 'educational' | 'promotional' | 'personal' | 'industry' | 'company'
  tags: string[]
  suggested_images: string[]
  call_to_action?: string
  best_times: string[]
  target_audience: string[]
}

export interface PostPerformanceMetrics {
  total_posts: number
  average_engagement: number
  best_performing_post: string
  worst_performing_post: string
  engagement_trend: 'up' | 'down' | 'stable'
  follower_growth: number
  reach_growth: number
  top_performing_content_types: string[]
  optimal_posting_times: string[]
}

export interface ContentPlan {
  id: string
  title: string
  description: string
  start_date: Date
  end_date: Date
  posts: LinkedInPost[]
  goals: {
    reach: number
    engagement: number
    leads: number
    conversions: number
  }
  status: 'draft' | 'active' | 'completed' | 'paused'
  budget?: number
  target_audience: string[]
} 