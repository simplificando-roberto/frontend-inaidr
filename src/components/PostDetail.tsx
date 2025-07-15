'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Eye,
  MoreHorizontal,
  Send,
  Bookmark
} from 'lucide-react'
import { formatNumber, formatRelativeTime } from '@/lib/utils'
import { LinkedInPost } from '@/types/post'

interface PostDetailProps {
  post: LinkedInPost
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <div className="bg-white">
      {/* Header del post */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">{post.author.name}</span>
                {post.author.verified && (
                  <Badge variant="default" className="text-xs">Verificado</Badge>
                )}
                {post.isSponsored && (
                  <Badge variant="secondary" className="text-xs">Promocionado</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{post.author.title}</p>
              <p className="text-sm text-gray-500">
                {formatRelativeTime(post.createdAt)} • 🌍
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Contenido del post */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-900 whitespace-pre-line leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-linkedin-500 hover:text-linkedin-600 cursor-pointer text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Imágenes */}
        {post.images && post.images.length > 0 && (
          <div className="mt-4">
            {post.images.length === 1 ? (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={post.images[0]} 
                  alt="Post content"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                {post.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Post content ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Métricas */}
      <div className="px-6 py-3 border-t border-b border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>{formatNumber(post.metrics.likes)} reacciones</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{formatNumber(post.metrics.comments)} comentarios</span>
            <span>{formatNumber(post.metrics.shares)} compartidos</span>
            <span>{formatNumber(post.metrics.views)} visualizaciones</span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="px-6 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="flex-1 justify-start space-x-2 text-gray-600 hover:text-linkedin-500">
            <Heart className="w-5 h-5" />
            <span>Me gusta</span>
          </Button>
          <Button variant="ghost" className="flex-1 justify-start space-x-2 text-gray-600 hover:text-linkedin-500">
            <MessageSquare className="w-5 h-5" />
            <span>Comentar</span>
          </Button>
          <Button variant="ghost" className="flex-1 justify-start space-x-2 text-gray-600 hover:text-linkedin-500">
            <Share2 className="w-5 h-5" />
            <span>Compartir</span>
          </Button>
          <Button variant="ghost" className="flex-1 justify-start space-x-2 text-gray-600 hover:text-linkedin-500">
            <Send className="w-5 h-5" />
            <span>Enviar</span>
          </Button>
        </div>
      </div>

      {/* Sección de comentarios */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-start space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face"
              alt="Tu avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="Añade un comentario..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-linkedin-500 focus:border-transparent"
                />
                <Button size="sm" className="rounded-full">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comentarios de ejemplo */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              alt="Comentarista"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">Carlos Pérez</span>
                  <span className="text-xs text-gray-500">2h</span>
                </div>
                <p className="text-sm text-gray-700">¡Excelente contenido! Nos interesa mucho conocer más sobre la implementación.</p>
              </div>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <button className="hover:text-linkedin-500">Me gusta</button>
                <button className="hover:text-linkedin-500">Responder</button>
                <span>3 me gusta</span>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
              alt="Comentarista"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">Laura Martín</span>
                  <span className="text-xs text-gray-500">5h</span>
                </div>
                <p className="text-sm text-gray-700">Muy interesante. ¿Tienen casos de estudio específicos del sector farmacéutico?</p>
              </div>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <button className="hover:text-linkedin-500">Me gusta</button>
                <button className="hover:text-linkedin-500">Responder</button>
                <span>7 me gusta</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm" className="text-gray-500">
            Ver todos los {formatNumber(post.metrics.comments)} comentarios
          </Button>
        </div>
      </div>
    </div>
  )
} 