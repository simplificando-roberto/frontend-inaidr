'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { 
  Plus, 
  Play, 
  Pause, 
  MoreHorizontal, 
  Mail, 
  Eye, 
  MousePointer, 
  MessageSquare,
  Calendar,
  Users,
  TrendingUp,
  Filter,
  Search,
  Bot,
  Zap
} from 'lucide-react'
import { sampleSequences, sequenceTemplates } from '@/data/sample-sequences'
import { formatRelativeTime, formatNumber } from '@/lib/utils'
import { EmailSequence, Email } from '@/types/sequence'

export default function SequencesPage() {
  const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(null)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [activeTab, setActiveTab] = useState<'sequences' | 'templates'>('sequences')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800' 
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEmailStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'opened': return 'bg-green-100 text-green-800'
      case 'clicked': return 'bg-purple-100 text-purple-800'
      case 'replied': return 'bg-linkedin-100 text-linkedin-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Secuencias de Email con IA</h1>
          <p className="text-gray-600 mt-1">
            Automatiza y personaliza el seguimiento de leads con inteligencia artificial
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button className="bg-linkedin-500 hover:bg-linkedin-600">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Secuencia
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-linkedin-100 rounded-lg">
              <Mail className="w-6 h-6 text-linkedin-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Emails Enviados</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
              <p className="text-xs text-green-600">↗ +12% vs anterior</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tasa de Apertura</p>
              <p className="text-2xl font-bold text-gray-900">68%</p>
              <p className="text-xs text-green-600">↗ +8% vs anterior</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MousePointer className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tasa de Click</p>
              <p className="text-2xl font-bold text-gray-900">24%</p>
              <p className="text-xs text-green-600">↗ +15% vs anterior</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reuniones</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-green-600">↗ +25% vs anterior</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('sequences')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'sequences' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Secuencias Activas
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'templates' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Plantillas IA
        </button>
      </div>

      {/* Content */}
      {activeTab === 'sequences' ? (
        <div className="space-y-4">
          {sampleSequences.map((sequence) => (
            <Card key={sequence.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{sequence.name}</h3>
                    <Badge className={getStatusColor(sequence.status)}>
                      {sequence.status === 'active' ? 'Activa' : 
                       sequence.status === 'paused' ? 'Pausada' : 
                       sequence.status === 'completed' ? 'Completada' : 'Borrador'}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Bot className="w-4 h-4 mr-1" />
                      Generada con IA
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{sequence.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{sequence.target.company} - {sequence.target.contactName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Creado {formatRelativeTime(sequence.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{sequence.emails.length} emails</span>
                    </div>
                  </div>

                  {/* Métricas rápidas */}
                  <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600">Enviados:</span>
                      <span className="font-medium">{sequence.metrics.sent}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Eye className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">Abiertos:</span>
                      <span className="font-medium">{sequence.metrics.opened}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MousePointer className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600">Clicks:</span>
                      <span className="font-medium">{sequence.metrics.clicked}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600">Respuestas:</span>
                      <span className="font-medium">{sequence.metrics.replied}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-linkedin-500" />
                      <span className="text-gray-600">Reuniones:</span>
                      <span className="font-medium">{sequence.metrics.meetings}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedSequence(sequence)}
                  >
                    Ver Emails
                  </Button>
                  <Button variant="ghost" size="sm">
                    {sequence.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sequenceTemplates.map((template) => (
            <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <Badge variant="secondary">{template.industry}</Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 mb-4">{template.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Emails en secuencia:</span>
                  <span className="font-medium">{template.emailCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tasa de respuesta promedio:</span>
                  <span className="font-medium text-green-600">{template.avgResponse}%</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <Button className="w-full bg-linkedin-500 hover:bg-linkedin-600">
                Usar Plantilla
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Secuencia */}
      {selectedSequence && (
        <Modal
          isOpen={!!selectedSequence}
          onClose={() => setSelectedSequence(null)}
          title={`Secuencia: ${selectedSequence.name}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Info de la secuencia */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Empresa objetivo</p>
                  <p className="font-medium">{selectedSequence.target.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contacto</p>
                  <p className="font-medium">{selectedSequence.target.contactName}</p>
                  <p className="text-sm text-gray-500">{selectedSequence.target.contactTitle}</p>
                </div>
              </div>
            </div>

            {/* Lista de emails */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Emails de la Secuencia</h4>
              {selectedSequence.emails.map((email, index) => (
                <div 
                  key={email.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Email #{email.sequenceNumber}
                        </span>
                        <Badge className={getEmailStatusColor(email.status)}>
                          {email.status === 'sent' ? 'Enviado' :
                           email.status === 'opened' ? 'Abierto' :
                           email.status === 'clicked' ? 'Clickeado' : 'Respondido'}
                        </Badge>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-1">{email.subject}</h5>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {email.content.split('\n')[0]}...
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Enviado {formatRelativeTime(email.sentAt)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Ver Completo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Email */}
      {selectedEmail && (
        <Modal
          isOpen={!!selectedEmail}
          onClose={() => setSelectedEmail(null)}
          title={`Email #${selectedEmail.sequenceNumber}: ${selectedEmail.subject}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Header del email */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{selectedEmail.sender.name}</p>
                  <p className="text-sm text-gray-600">{selectedEmail.sender.title}</p>
                  <p className="text-sm text-gray-600">{selectedEmail.sender.company}</p>
                </div>
                <Badge className={getEmailStatusColor(selectedEmail.status)}>
                  {selectedEmail.status === 'sent' ? 'Enviado' :
                   selectedEmail.status === 'opened' ? 'Abierto' :
                   selectedEmail.status === 'clicked' ? 'Clickeado' : 'Respondido'}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Para:</strong> {selectedEmail.recipient.name} - {selectedEmail.recipient.company}</p>
                <p><strong>Enviado:</strong> {selectedEmail.sentAt.toLocaleString('es-ES')}</p>
                {selectedEmail.openedAt && (
                  <p><strong>Abierto:</strong> {selectedEmail.openedAt.toLocaleString('es-ES')}</p>
                )}
                {selectedEmail.clickedAt && (
                  <p><strong>Clickeado:</strong> {selectedEmail.clickedAt.toLocaleString('es-ES')}</p>
                )}
                {selectedEmail.repliedAt && (
                  <p><strong>Respondido:</strong> {selectedEmail.repliedAt.toLocaleString('es-ES')}</p>
                )}
              </div>
            </div>

            {/* Contenido del email */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold mb-4">Asunto: {selectedEmail.subject}</h4>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-base">
                  {selectedEmail.content}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  {selectedEmail.sender.name}<br/>
                  {selectedEmail.sender.title}<br/>
                  {selectedEmail.sender.company}<br/>
                  {selectedEmail.sender.signature}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
} 