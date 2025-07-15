'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock } from '@/components/ui/clock'
import { Modal } from '@/components/ui/modal'
import { PostDetail } from '@/components/PostDetail'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Heart, 
  Share2,
  Eye,
  Target,
  DollarSign,
  Calendar,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from 'lucide-react'
import { formatNumber, formatRelativeTime, calculateEngagementRate } from '@/lib/utils'
import { samplePosts } from '@/data/sample-posts'
import { LinkedInPost } from '@/types/post'
import CountUp from 'react-countup'

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedPost, setSelectedPost] = useState<LinkedInPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handlePostClick = (post: LinkedInPost) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  // Memorizar cálculos para evitar re-renders
  const { totalPosts, totalLikes, totalComments, totalShares, totalViews, avgEngagement } = useMemo(() => {
    const posts = samplePosts.length
    const likes = samplePosts.reduce((sum, post) => sum + post.metrics.likes, 0)
    const comments = samplePosts.reduce((sum, post) => sum + post.metrics.comments, 0)
    const shares = samplePosts.reduce((sum, post) => sum + post.metrics.shares, 0)
    const views = samplePosts.reduce((sum, post) => sum + post.metrics.views, 0)
    const engagement = samplePosts.reduce((sum, post) => sum + post.engagement.rate, 0) / posts

    return {
      totalPosts: posts,
      totalLikes: likes,
      totalComments: comments,
      totalShares: shares,
      totalViews: views,
      avgEngagement: engagement
    }
  }, [])

  const metrics = useMemo(() => [
    {
      title: 'Posts Publicados',
      value: totalPosts,
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'linkedin'
    },
    {
      title: 'Engagement Total',
      value: totalLikes + totalComments + totalShares,
      change: '+34%',
      trend: 'up',
      icon: Heart,
      color: 'success'
    },
    {
      title: 'Leads Generados',
      value: 247,
      change: '+28%',
      trend: 'up',
      icon: Users,
      color: 'warning'
    },
    {
      title: 'Conversiones',
      value: 56,
      change: '+45%',
      trend: 'up',
      icon: Target,
      color: 'accent'
    }
  ], [totalPosts, totalLikes, totalComments, totalShares])

  const recentPosts = useMemo(() => samplePosts.slice(0, 3), [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estrategia LinkedIn - Hapiick</h1>
          <p className="text-gray-600 mt-1">
            Propuesta de Simplificando | Simulación en tiempo real - <Clock />
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Este mes
          </Button>
          <Button size="sm">
            <Play className="w-4 h-4 mr-2" />
            Ver Demo
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const isPositive = metric.trend === 'up'
          
          return (
            <Card key={index} className={`linkedin-card-hover transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <Icon className={`w-4 h-4 text-${metric.color}-500`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {isLoaded ? (
                    <CountUp
                      start={0}
                      end={metric.value}
                      duration={0.8}
                      separator=","
                      formattingFn={(value) => formatNumber(value)}
                    />
                  ) : (
                    formatNumber(metric.value)
                  )}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3 text-success-500" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-error-500" />
                  )}
                  <span className={`text-xs ${isPositive ? 'text-success-500' : 'text-error-500'}`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-gray-500">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Posts Recientes</span>
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </CardTitle>
              <CardDescription>
                Ejemplos de contenido optimizado para el perfil de Hapiick
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex items-start space-x-3">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{post.author.name}</span>
                          {post.author.verified && (
                            <Badge variant="default" className="text-xs">Verificado</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(post.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {post.content.substring(0, 120)}...
                      </p>
                      
                      {/* Imagen del post */}
                      {post.images && post.images.length > 0 && (
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <img 
                            src={post.images[0]} 
                            alt="Post content"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{formatNumber(post.metrics.likes)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{formatNumber(post.metrics.comments)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="w-4 h-4" />
                          <span>{formatNumber(post.metrics.shares)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(post.metrics.views)}</span>
                        </div>
                        <Badge 
                          variant={post.engagement.level === 'high' ? 'success' : 'secondary'}
                          className="ml-auto"
                        >
                          {post.engagement.rate.toFixed(1)}% engagement
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rendimiento General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tasa de Engagement</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-linkedin-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: isLoaded ? `${Math.min(avgEngagement * 10, 100)}%` : '0%' }}
                    />
                  </div>
                  <span className="text-sm font-medium">{avgEngagement.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Alcance Total</span>
                <span className="text-sm font-medium">{formatNumber(totalViews)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ROI Estimado</span>
                <span className="text-sm font-medium text-success-600">420%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversión</span>
                <span className="text-sm font-medium">18.4%</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Crear Post
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Ver Leads
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analizar Métricas
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Programar Contenido
              </Button>
            </CardContent>
          </Card>

          {/* Demo Info */}
          <Card className="bg-linkedin-50 border-linkedin-200">
            <CardHeader>
              <CardTitle className="text-lg text-linkedin-800">Propuesta Simplificando</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-linkedin-700 mb-4">
                Simulación completa de la estrategia LinkedIn diseñada específicamente para Hapiick.
              </p>
              <Button className="w-full" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Ver Simulación Completa
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visual Content Gallery */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Galería Visual - Contenido Propuesto</span>
              <Badge variant="secondary">Ejemplos Reales</Badge>
            </CardTitle>
            <CardDescription>
              Ejemplos del tipo de contenido visual que Simplificando desarrollaría para Hapiick
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=400&fit=crop" 
                  alt="Automatización logística"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Automatización
                  </span>
                </div>
              </div>
              
              <div className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" 
                  alt="Fulfillment inteligente"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Fulfillment
                  </span>
                </div>
              </div>
              
              <div className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop" 
                  alt="Retail tecnología"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    RetailTech
                  </span>
                </div>
              </div>
              
              <div className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop" 
                  alt="Analytics dashboard"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Analytics
                  </span>
                </div>
              </div>
              
              <div className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" 
                  alt="CEO content"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Liderazgo
                  </span>
                </div>
              </div>
              
              <div className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop" 
                  alt="Tech innovation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Innovación
                  </span>
                </div>
              </div>
              
              <div className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop" 
                  alt="Success stories"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Casos Éxito
                  </span>
                </div>
              </div>
              
              <div className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=400&fit=crop" 
                  alt="Team collaboration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Equipo
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-linkedin-50 rounded-lg border border-linkedin-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-linkedin-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
                <div>
                  <h4 className="font-medium text-linkedin-800 mb-2">Propuesta de Simplificando</h4>
                  <p className="text-sm text-linkedin-700">
                    Cada imagen representaría contenido visual optimizado para LinkedIn, diseñado específicamente 
                    para los objetivos de marketing de Hapiick y su audiencia objetivo en el sector logístico y retail.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal para detalle del post */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        size="xl"
      >
        {selectedPost && <PostDetail post={selectedPost} />}
      </Modal>
    </div>
  )
} 